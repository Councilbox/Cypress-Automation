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
import withSharedProps from "../../../../../HOCs/withSharedProps";
import { Card } from "material-ui";
import SelectRepresentative from "./SelectRepresentative";

class CouncilParticipantEditor extends React.Component {
	state = {
		modal: false,
		data: {},
		representative: {},
		errors: {},
		representativeErrors: {},
		selectRepresentative: false
	};

	updateParticipantData() {
		let { representative, representatives, representing, ...participant } = extractTypeName(
			this.props.participant
		);
		representative = representative
			? {
				hasRepresentative: true,
				...extractTypeName(representative)
			}
			: initialRepresentative;
		this.setState({
			data: participant,
			representative: representative
		});
	}

	componentDidMount() {
		this.updateParticipantData();
	}

	componentWillUnmount() {
		this.updateParticipantData();
	}


	updateCouncilParticipant = async () => {
		const { hasRepresentative, ...data } = this.state.representative;
		const representative = this.state.representative.hasRepresentative
			? {
				...data,
				councilId: this.props.council.id
			}
			: null;

		if (!await this.checkRequiredFields()) {
			const response = await this.props.updateCouncilParticipant({
				variables: {
					participant: {
						...this.state.data,
						councilId: this.props.council.id
					},
					representative
				}
			});
			if (!response.errors) {
				this.props.refetch();
				this.props.close();
			} else {
				if (response.errors[0].message === 'Too many granted words') {
					this.setState({
						...(this.state.data.initialState === 2 ? {
							errors: {
								initialState: this.props.translate.initial_granted_word_error
							}
						} : {}),
						...(representative && representative.initialState === 2 ? {
							representativeErrors: {
								initialState: this.props.translate.initial_granted_word_error
							}
						} : {})

					});
				}
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
		const testPhone = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
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

		if (company.type !== 10) {
			if (participant.email !== this.props.participant.email) {
				emailsToCheck.push(participant.email);
			}
		}

		if (representative.hasRepresentative) {
			errorsRepresentative = checkRequiredFieldsRepresentative(
				representative,
				translate
			);

			if (this.props.representative) {
				if (representative.email !== this.props.representative.email) {
					emailsToCheck.push(representative.email);
				}
			}
		}


		if (emailsToCheck.length > 0) {
			const response = await this.props.client.query({
				query: checkUniqueCouncilEmails,
				variables: {
					councilId: this.props.council.id,
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
		}

		if (participant.phone) {
			if (!testPhone.test(participant.phone) && participant.phone !== '-') {
				errorsParticipant.hasError = true;
				errorsParticipant.errors.phone = translate.invalid_field;
			}
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

		if (email.length > 0) {
			if (!this.props[type] || email !== this.props[type].email) {
				if (checkValidEmail(email)) {
					const response = await this.props.client.query({
						query: checkUniqueCouncilEmails,
						variables: {
							councilId: this.props.council.id,
							emailList: [email]
						}
					});

					if (!response.data.checkUniqueCouncilEmails.success) {
						const data = JSON.parse(response.data.checkUniqueCouncilEmails.message);
						data.duplicatedEmails.forEach(email => {
							if (this.state.data.email === email) {
								error = translate.register_exists_email;
							}
							if (this.state.representative.email === email) {
								error = translate.register_exists_email;
							}
						})
					}
				} else {
					error = translate.valid_email_required;
				}
				if (type === 'participant') {
					this.setState({
						errors: {
							...this.state.errors,
							email: error
						}
					})
				} else {
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
				<div style={{ marginRight: "1em" }}>
					<Card style={{
						padding: '1em',
						marginBottom: "1em",
						color: 'black',
					}}>
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
					</Card>
					<Card style={{
						padding: '1em',
						marginBottom: "1em",
						color: 'black',
					}}>
						<RepresentativeForm
							translate={translate}
							state={representative}
							disabled={!!this.props.participant.representing}
							setSelectRepresentative={value => this.setState({
								selectRepresentative: value
							})}
							checkEmail={this.emailKeyUp}
							updateState={this.updateRepresentative}
							errors={representativeErrors}
							languages={languages}
						/>
					</Card>
				</div>
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
	graphql(languages),
	withSharedProps()
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
