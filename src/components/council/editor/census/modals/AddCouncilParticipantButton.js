import React from "react";
import {
	AlertConfirm,
	BasicButton,
	ButtonIcon
} from "../../../../../displayComponents/index";
import { compose, graphql, withApollo } from "react-apollo";
import { getPrimary } from "../../../../../styles/colors";
import { addParticipant, checkUniqueCouncilEmails } from "../../../../../queries/councilParticipant";
import { languages } from "../../../../../queries/masters";
import { checkValidEmail } from "../../../../../utils/validation";
import ParticipantForm from "../../../participants/ParticipantForm";
import {
	checkRequiredFieldsParticipant,
	checkRequiredFieldsRepresentative,
} from "../../../../../utils/validation";
import RepresentativeForm from "../../../../company/census/censusEditor/RepresentativeForm";
import withSharedProps from "../../../../../HOCs/withSharedProps";


class AddCouncilParticipantButton extends React.Component {
	state = {
		modal: false,
		data: { ...initialParticipant },
		representative: { ...initialRepresentative },
		errors: {},
		loading: false,
		representativeErrors: {}
	};

	timeout = null;

	addParticipant = async () => {
		const { hasRepresentative, ...data } = this.state.representative;
		const representative = this.state.representative.hasRepresentative
			? {
					...data,
					councilId: this.props.councilId
			  }
			: null;

		if (!await this.checkRequiredFields()) {
			this.setState({
				loading: true
			});
			const response = await this.props.addParticipant({
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
				this.setState({
					modal: false,
					data: { ...initialParticipant },
					representative: { ...initialRepresentative },
					errors: {},
					loading: false,
					representativeErrors: {}
				});
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

	async checkRequiredFields() {
		const participant = this.state.data;
		const representative = this.state.representative;
		const { translate, participations, company } = this.props;
		let hasSocialCapital = participations;
		let errorsParticipant = checkRequiredFieldsParticipant(
			participant,
			translate,
			hasSocialCapital,
			company
		);

		let errorsRepresentative = {
			errors: {},
			hasError: false
		};

		const emailsToCheck = [];

		if(this.props.company.type !== 10){
			emailsToCheck.push(participant.email);
		}

		if (representative.hasRepresentative) {
			errorsRepresentative = checkRequiredFieldsRepresentative(
				representative,
				translate
			);

			emailsToCheck.push(representative.email);
		}


		if(emailsToCheck.length > 0){
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

			if(participant.email === representative.email){
				errorsRepresentative.errors.email = translate.repeated_email;
				errorsParticipant.errors.email = translate.repeated_email;
				errorsParticipant.hasError = true;
			}
		}


		this.setState({
			...this.state,
			errors: errorsParticipant.errors,
			representativeErrors: errorsRepresentative.errors
		});

		return errorsParticipant.hasError || errorsRepresentative.hasError;
	}

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
					error = translate.valid_email_required;
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
		const errors = this.state.errors;
		const { translate, participations } = this.props;
		const { languages } = this.props.data;
		return (
			<div style={{width: '850px'}}>
				<ParticipantForm
					type={participant.personOrEntity}
					participant={participant}
					participations={participations}
					translate={translate}
					languages={languages}
					checkEmail={this.emailKeyUp}
					errors={errors}
					updateState={this.updateState}
				/>
				<RepresentativeForm
					translate={this.props.translate}
					state={this.state.representative}
					updateState={this.updateRepresentative}
					checkEmail={this.emailKeyUp}
					errors={this.state.representativeErrors}
					languages={this.props.data.languages}
				/>
			</div>
		);
	}

	render() {
		const { translate } = this.props;
		const primary = getPrimary();

		return (
			<React.Fragment>
				<BasicButton
					text={translate.add_participant}
					floatRight
					color={"white"}
					textStyle={{
						color: primary,
						fontWeight: "700",
						fontSize: "0.9em",
						textTransform: "none"
					}}
					textPosition="after"
					icon={<ButtonIcon type="add" color={primary} />}
					onClick={() => this.setState({ modal: true })}
					buttonStyle={{
						border: `2px solid ${primary}`
					}}
				/>
				<AlertConfirm
					requestClose={() => this.setState({
						modal: false,
						errors: {},
						representativeErrors: {},
						loading: false
					})}
					open={this.state.modal}
					fullWidth={false}
					loadingAction={this.state.loading}
					acceptAction={this.addParticipant}
					buttonAccept={translate.accept}
					buttonCancel={translate.cancel}
					bodyText={this._renderBody()}
					title={translate.add_participant}
				/>
			</React.Fragment>
		);
	}
}



export default compose(
	graphql(addParticipant, {
		name: "addParticipant",
		options: {
			errorPolicy: "all"
		}
	}),
	graphql(languages),
	withSharedProps()
)(withApollo(AddCouncilParticipantButton));

const initialParticipant = {
	name: "",
	surname: "",
	position: "",
	email: "",
	phone: "",
	dni: "",
	type: 0,
	delegateId: null,
	numParticipations: 1,
	socialCapital: 1,
	uuid: null,
	delegateUuid: null,
	language: "es",
	city: "",
	personOrEntity: 0
};

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
