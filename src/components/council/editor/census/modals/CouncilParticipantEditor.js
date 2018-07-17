import React from "react";
import { AlertConfirm } from "../../../../../displayComponents/index";
import { compose, graphql, withApollo } from "react-apollo";
import { updateCouncilParticipant, checkUniqueCouncilEmails } from "../../../../../queries/councilParticipant";
import { languages } from "../../../../../queries/masters";
import ParticipantForm from "../../../participants/ParticipantForm";
import {
	checkRequiredFieldsParticipant,
	checkRequiredFieldsRepresentative,
	checkValidEmail
} from "../../../../../utils/validation";
import RepresentativeForm from "../../../../company/census/censusEditor/RepresentativeForm";

class CouncilParticipantEditor extends React.Component {
	state = {
		modal: false,
		data: {},
		representative: {},
		errors: {},
		representativeErrors: {}
	};

	static getDerivedStateFromProps(nextProps, prevState) {
		let { representative, ...participant } = extractTypeName(
			nextProps.participant
		);
		representative = representative
			? {
					hasRepresentative: true,
					...extractTypeName(representative)
			  }
			: initialRepresentative;
		return {
			data: participant,
			representative: representative
		};
	}


	updateCouncilParticipant = async () => {
		const { hasRepresentative, ...data } = this.state.representative;
		const representative = this.state.representative.hasRepresentative
			? {
					...data,
					councilId: this.props.councilId
			  }
			: null;

		if (!await this.checkRequiredFields()) {
			const response = await this.props.updateCouncilParticipant({
				variables: {
					participant: {
						...this.state.data,
						councilId: this.props.councilId
					},
					representative: representative
				}
			});
			if (!response.errors) {
				this.props.refetch();
				this.props.close();
			}
		}
	};

	updateState = object => {
		this.setState({
			data: {
				...this.state.data,
				...object
			}
		});
	};

	updateRepresentative = object => {
		this.setState({
			representative: {
				...this.state.representative,
				...object
			}
		});
	};

	cleanAndClose = () => {
		this.setState({
			errors: {},
			representativeErrors: {}
		})
		this.props.close();
	}

	async checkRequiredFields() {
		const participant = this.state.data;
		const representative = this.state.representative;
		const { translate, participations } = this.props;
		let hasSocialCapital = participations;
		let errorsParticipant = checkRequiredFieldsParticipant(
			participant,
			translate,
			hasSocialCapital
		);

		let errorsRepresentative = {
			errors: {},
			hasError: false
		};

		const emailsToCheck = [];
		if(participant.email !== this.props.participant.email){
			emailsToCheck.push(participant.email);
		}

		if (representative.hasRepresentative) {
			errorsRepresentative = checkRequiredFieldsRepresentative(
				representative,
				translate
			);

			if(this.props.representative){
				if(representative.email !== this.props.representative.email){
					emailsToCheck.push(representative.email);
				}
			}
		}

		const response = await this.props.client.query({
			query: checkUniqueCouncilEmails,
			variables: {
				councilId: this.props.councilId,
				emailList: emailsToCheck
			}
		});

		if(!response.data.checkUniqueCouncilEmails.success){
			const data = JSON.parse(response.data.checkUniqueCouncilEmails.message);
			data.duplicatedEmails.forEach(email => {
				if(participant.email === email){
					errorsParticipant.errors.email = translate.register_exists_email;
					errorsParticipant.hasError = true;
				}
				if(representative.email === email){
					errorsRepresentative.errors.email = translate.register_exists_email;
					errorsRepresentative.hasError = true;
				}
			})
		}

		this.setState({
			...this.state,
			errors: errorsParticipant.errors,
			representativeErrors: errorsRepresentative.errors
		});

		return errorsParticipant.hasError || errorsRepresentative.hasError;
	}

	timeout = null;

	checkEmail = async (email, type) => {
		let error;
		const { translate } = this.props;

		if(email.length > 0){
			if(!this.props[type] || email !== this.props[type].email){
				if(checkValidEmail(email)){
					const response = await this.props.client.query({
						query: checkUniqueCouncilEmails,
						variables: {
							councilId: this.props.councilId,
							emailList: [email]
						}
					});

					if(!response.data.checkUniqueCouncilEmails.success){
						const data = JSON.parse(response.data.checkUniqueCouncilEmails.message);
						data.duplicatedEmails.forEach(email => {
							if(this.state.data.email === email){
								error = translate.register_exists_email;
							}
							if(this.state.representative.email === email){
								error = translate.register_exists_email;
							}
						})
					}
				}else{
					error = 'Se requiere un email válido';//TRADUCCION
				}
				if(type === 'participant'){
					this.setState({
						errors: {
							...this.state.errors,
							email: error
						}
					})
				}else{
					this.setState({
						representativeErrors: {
							...this.state.errors,
							email: error
						}
					})
				}
			}
		}
	}

	emailKeyUp = (event, type) => {
		clearTimeout(this.timeout);
		const value = event.target.value;
		this.timeout = setTimeout(() => {
			this.checkEmail(value, type);
			clearTimeout(this.timeout);
		}, 400);
	}

	_renderBody() {
		const participant = this.state.data;
		const { representative, errors, representativeErrors } = this.state;
		const { translate, participations } = this.props;
		const { languages } = this.props.data;
		return (
			<div>
				<ParticipantForm
					type={participant.personOrEntity}
					participant={participant}
					checkEmail={this.emailKeyUp}
					participations={participations}
					translate={translate}
					languages={languages}
					errors={errors}
					updateState={this.updateState}
				/>
				<RepresentativeForm
					translate={translate}
					state={representative}
					checkEmail={this.emailKeyUp}
					updateState={this.updateRepresentative}
					errors={representativeErrors}
					languages={languages}
				/>
			</div>
		);
	}

	render() {
		const { translate } = this.props;

		return (
			<React.Fragment>
				<AlertConfirm
					requestClose={() => this.cleanAndClose()}
					open={this.props.opened}
					fullWidth={false}
					acceptAction={this.updateCouncilParticipant}
					buttonAccept={translate.accept}
					buttonCancel={translate.cancel}
					bodyText={this._renderBody()}
					title={translate.edit_participant}
				/>
			</React.Fragment>
		);
	}
}

export default compose(
	graphql(updateCouncilParticipant, {
		name: "updateCouncilParticipant",
		options: {
			errorPolicy: "all"
		}
	}),
	graphql(languages)
)(withApollo(CouncilParticipantEditor));

const initialRepresentative = {
	hasRepresentative: false,
	language: "es",
	type: 2,
	name: "",
	surname: "",
	position: "",
	email: "",
	phone: "",
	dni: ""
};

function extractTypeName(object) {
	let { __typename, ...rest } = object;
	return rest;
}
