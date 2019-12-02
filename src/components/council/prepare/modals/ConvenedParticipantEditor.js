import React from "react";
import { BasicButton, CustomDialog } from "../../../../displayComponents/index";
import { compose, graphql, withApollo } from "react-apollo";
import { getPrimary, secondary } from "../../../../styles/colors";
import { languages } from "../../../../queries/masters";
import ParticipantForm from "../../participants/ParticipantForm";
import {
	checkRequiredFieldsParticipant,
	checkRequiredFieldsRepresentative
} from "../../../../utils/validation";
import RepresentativeForm from "../../../company/census/censusEditor/RepresentativeForm";
import { upsertConvenedParticipant, checkUniqueCouncilEmails } from "../../../../queries/councilParticipant";
import { PARTICIPANT_STATES } from "../../../../constants";
import withSharedProps from "../../../../HOCs/withSharedProps";

class ConvenedParticipantEditor extends React.Component {

	state = {
		modal: false,
		data: {},
		representative: {},
		errors: {},
		representativeErrors: {}
	};

	componentDidMount(){
		this.setParticipantData();
	}

	componentWillUnmount(){
		this.setParticipantData();
	}

	setParticipantData(){
		let { representative, delegateId, delegateUuid, __typename, councilId, ...participant } = extractTypeName(
			this.props.participant
		);

		representative = (participant.representatives.length > 0)
			? {
					hasRepresentative: true,
					...extractTypeName(participant.representatives[0])
			  }
			: initialRepresentative;

		delete representative.live;
		delete representative.notifications;
		delete participant.live;
		delete participant.notifications;


		this.setState({
			data: participant,
			representative
		});
	}

	updateConvenedParticipant = async sendConvene => {
		const { hasRepresentative, ...data } = this.state.representative;
		const representative = this.state.representative.hasRepresentative
			? {
					...data,
					councilId: this.props.councilId
			  }
			: null;


		if (!await this.checkRequiredFields()) {
			const { representatives, ...participant } = this.state.data;
			const response = await this.props.updateConvenedParticipant({
				variables: {
					participant: {
						...participant,
						councilId: this.props.councilId
					},
					representative,
					sendConvene
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

	async checkRequiredFields(onlyEmail) {
		const participant = this.state.data;
		const representative = this.state.representative;
		const { translate, participations, company } = this.props;

		let errorsParticipant = {
			errors: {},
			hasError: false
		};

		if(!onlyEmail){
			let hasSocialCapital = participations;
			errorsParticipant = checkRequiredFieldsParticipant(
				participant,
				translate,
				hasSocialCapital,
				company
			);
		}
		let errorsRepresentative = {
			errors: {},
			hasError: false
		};



		if (representative.hasRepresentative) {
			if(!onlyEmail){
				errorsRepresentative = checkRequiredFieldsRepresentative(
					representative,
					translate
				);
			}
		}


		if(participant.email && participant.email !== this.props.participant.email && company.type !== 10){
			let emailsToCheck = [participant.email];

			if(representative.email && ((this.props.participant.representative && representative.email !== this.props.participant.representative.email) || !this.props.participant.representative)){
				emailsToCheck.push(representative.email);
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

	render() {
		const primary = getPrimary();
		const participant = this.state.data;
		const { representative, errors, representativeErrors } = this.state;
		const { translate, participations } = this.props;
		const { languages } = this.props.data;


		return (
			<CustomDialog
				title={translate.edit_participant}
				requestClose={() => this.props.close()}
				open={this.props.opened}
				actions={
					<React.Fragment>
						<BasicButton
							text={translate.cancel}
							textStyle={{
								textTransform: "none",
								fontWeight: "700"
							}}
							onClick={this.props.close}
						/>
						<BasicButton
							text={translate.save_changes_and_send}
							textStyle={{
								color: "white",
								textTransform: "none",
								fontWeight: "700"
							}}
							buttonStyle={{ marginLeft: "1em" }}
							color={secondary}
							onClick={() => {
								this.updateConvenedParticipant(true);
							}}
						/>
						<BasicButton
							text={translate.save_changes}
							textStyle={{
								color: "white",
								textTransform: "none",
								fontWeight: "700"
							}}
							buttonStyle={{ marginLeft: "1em" }}
							color={primary}
							onClick={() => {
								this.updateConvenedParticipant(false);
							}}
						/>
					</React.Fragment>
				}
			>
				<div style={{maxWidth: '900px'}}>
					<ParticipantForm
						type={participant.personOrEntity}
						participant={participant}
						participations={participations}
						translate={translate}
						languages={languages}
						errors={errors}
						updateState={this.updateState}
					/>
					<RepresentativeForm
						translate={translate}
						state={representative}
						updateState={this.updateRepresentative}
						errors={representativeErrors}
						languages={languages}
					/>
				</div>
			</CustomDialog>
		);
	}
}

export default compose(
	graphql(upsertConvenedParticipant, {
		name: "updateConvenedParticipant",
		options: {
			errorPolicy: "all"
		}
	}),
	graphql(languages),
	withSharedProps()
)(withApollo(ConvenedParticipantEditor));

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
