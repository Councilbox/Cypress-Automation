import React from "react";
import { BasicButton, CustomDialog, AlertConfirm, Scrollbar } from "../../../../displayComponents/index";
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
import { PARTICIPANT_STATES, COUNCIL_TYPES } from "../../../../constants";
import withSharedProps from "../../../../HOCs/withSharedProps";
import SelectRepresentative from "../../editor/census/modals/SelectRepresentative";

class ConvenedParticipantEditor extends React.Component {

	state = {
		modal: false,
		data: {},
		representative: {},
		errors: {},
		representativeErrors: {}
	};

	componentDidMount() {
		this.setParticipantData();
	}

	componentWillUnmount() {
		this.setParticipantData();
	}

	setParticipantData() {
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
		delete participant.representing;
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
			const { representatives, delegate, ...participant } = this.state.data;
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

		if (!onlyEmail) {
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
			if (!onlyEmail) {
				errorsRepresentative = checkRequiredFieldsRepresentative(
					representative,
					translate
				);
			}
		}


		if (participant.email && participant.email !== this.props.participant.email && company.type !== 10) {
			let emailsToCheck = [participant.email];

			if (representative.email && ((this.props.participant.representative && representative.email !== this.props.participant.representative.email) || !this.props.participant.representative)) {
				emailsToCheck.push(representative.email);
			}

			const response = await this.props.client.query({
				query: checkUniqueCouncilEmails,
				variables: {
					councilId: this.props.councilId,
					emailList: emailsToCheck
				}
			});

			if (!response.data.checkUniqueCouncilEmails.success) {
				const data = JSON.parse(response.data.checkUniqueCouncilEmails.message);
				data.duplicatedEmails.forEach(email => {
					if (participant.email === email) {
						errorsParticipant.errors.email = translate.register_exists_email;
						errorsParticipant.hasError = true;
					}
					if (representative.email === email) {
						errorsRepresentative.errors.email = translate.register_exists_email;
						errorsRepresentative.hasError = true;
					}
				})
			}
			if (participant.email === representative.email) {
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

		console.log(participant);
		console.log(this.props.participant);
		const { representative, errors, representativeErrors } = this.state;
		const { translate, participations } = this.props;
		const { languages } = this.props.data;


		return (
			<AlertConfirm
				bodyStyle={{ height: '400px', width: '950px' }}
				bodyText={
					<Scrollbar>
						<SelectRepresentative
							open={this.state.selectRepresentative}
							council={this.props.council}
							translate={translate}
							updateRepresentative={representative => {
								this.updateRepresentative({
									...representative,
									hasRepresentative: true
								});
							}}
							requestClose={() => this.setState({
								selectRepresentative: false
							})}
						/>
						<div style={{marginRight: "1em"}}>
							<div style={{
								boxShadow: 'rgba(0, 0, 0, 0.5) 0px 2px 4px 0px',
								border: '1px solid rgb(97, 171, 183)',
								borderRadius: '4px',
								padding: '1em',
								marginBottom: "1em",
								color: 'black',
							}}>
								<ParticipantForm
									type={participant.personOrEntity}
									participant={participant}
									participations={participations}
									translate={translate}
									languages={languages}
									errors={errors}
									updateState={this.updateState}
								/>
							</div>
							<div style={{
								boxShadow: 'rgba(0, 0, 0, 0.5) 0px 2px 4px 0px',
								border: '1px solid rgb(97, 171, 183)',
								borderRadius: '4px',
								padding: '1em',
								color: 'black',
								marginBottom: ".5em",
							}}>
								<RepresentativeForm
									translate={translate}
									state={representative}
									disabled={!!this.props.participant.representing}
									setSelectRepresentative={value => this.setState({
										selectRepresentative: value
									})}
									updateState={this.updateRepresentative}
									errors={representativeErrors}
									languages={languages}
								/>
							</div>
						</div>
					</Scrollbar>
				}
				title={translate.edit_participant}
				requestClose={() => this.props.close()}
				open={this.props.opened}
				actions={
					<React.Fragment>
						<BasicButton
							text={translate.cancel}
							color="transparent"
							textStyle={{
								boxShadow: "none",
								borderRadius: '4px',
								textTransform: "none",
								fontWeight: "700",
							}}
							onClick={this.props.close}
						/>
						<BasicButton
							text={this.props.council.councilType === COUNCIL_TYPES.BOARD_WITHOUT_SESSION? translate.save_and_notify : translate.save_changes_and_send}
							textStyle={{
								boxShadow: "none",
								borderRadius: '4px',
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
								boxShadow: "none",
								borderRadius: '4px',
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

			</AlertConfirm>
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
