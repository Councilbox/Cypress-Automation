import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { Card } from 'material-ui';
import { AlertConfirm, Scrollbar } from '../../../../../displayComponents/index';
import { updateCouncilParticipant, checkUniqueCouncilEmails } from '../../../../../queries/councilParticipant';
import { languages as languagesQuery } from '../../../../../queries/masters';
import ParticipantForm from '../../../participants/ParticipantForm';
import {
	checkRequiredFieldsParticipant,
	checkRequiredFieldsRepresentative,
	checkValidEmail,
	checkValidPhone
} from '../../../../../utils/validation';
import RepresentativeForm from '../../../../company/census/censusEditor/RepresentativeForm';
import withSharedProps from '../../../../../HOCs/withSharedProps';
import SelectRepresentative from './SelectRepresentative';
import { COUNCIL_TYPES, PARTICIPANT_VALIDATIONS } from '../../../../../constants';
import {
	getMaxGrantedWordsMessage, isAppointment, isMaxGrantedWordsError, participantIsGuest, removeTypenameField
} from '../../../../../utils/CBX';
import CheckUserClavePin from '../../../participants/CheckParticipantRegisteredClavePin';
import AppointmentParticipantForm from '../../../participants/AppointmentParticipantForm';

const initialRepresentative = {
	hasRepresentative: false,
	language: 'es',
	initialState: 0,
	type: 2,
	name: '',
	surname: '',
	position: '',
	email: '',
	phone: '',
	dni: ''
};

class CouncilParticipantEditor extends React.Component {
	state = {
		modal: false,
		data: {},
		representative: {},
		errors: {},
		representativeErrors: {},
		selectRepresentative: false,
		validated: false
	};

	updateParticipantData() {
		let {
			// eslint-disable-next-line prefer-const
			representative, representatives, representing, ...participant
		} = removeTypenameField(this.props.participant);
		representative = representative ?
			{
				hasRepresentative: true,
				...removeTypenameField(representative)
			}
			: initialRepresentative;
		this.setState({
			data: participant,
			representative
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
		const representative = this.state.representative.hasRepresentative ?
			{
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
			} else if (isMaxGrantedWordsError(response.errors[0])) {
				const message = getMaxGrantedWordsMessage(response.errors[0], this.props.translate);

				this.setState({
					...(this.state.data.initialState === 2 ? {
						errors: {
							initialState: message
						}
					} : {}),
					...(representative && representative.initialState === 2 ? {
						representativeErrors: {
							initialState: message
						}
					} : {})

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

	cleanAndClose = () => {
		this.setState({
			errors: {},
			representativeErrors: {}
		});
		this.props.close();
	}

	async checkRequiredFields() {
		const participant = this.state.data;
		const { representative } = this.state;
		const { translate, participations, company } = this.props;
		const hasSocialCapital = participations;
		const errorsParticipant = checkRequiredFieldsParticipant(
			participant,
			representative,
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
				});
			}
		}

		if (!participant.phone && !representative?.hasRepresentative) {
			errorsParticipant.hasError = true;
			errorsParticipant.errors.phone = translate.validation_required_field;
		} else if (participant.phone && !checkValidPhone(participant.phone)) {
			errorsParticipant.hasError = true;
			errorsParticipant.errors.phone = translate.invalid_phone;
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
						data.duplicatedEmails.forEach(duplicatedEmail => {
							if (this.state.data.email === duplicatedEmail) {
								error = translate.register_exists_email;
							}
							if (this.state.representative.email === duplicatedEmail) {
								error = translate.register_exists_email;
							}
						});
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
					});
				} else {
					this.setState({
						representativeErrors: {
							...this.state.errors,
							email: error
						}
					});
				}
			}
		}
	}

	emailKeyUp = (event, type) => {
		clearTimeout(this.timeout);
		const { value } = event.target;
		this.timeout = setTimeout(() => {
			this.checkEmail(value, type);
			clearTimeout(this.timeout);
		}, 400);
	}

	renderBody() {
		const participant = this.state.data;
		const { representative, errors, representativeErrors } = this.state;
		const { translate, participations } = this.props;
		const { languages } = this.props.data;
		return (
			<Scrollbar>
				<SelectRepresentative
					open={this.state.selectRepresentative}
					council={this.props.council}
					participantId={participant.id}
					translate={translate}
					updateRepresentative={repre => {
						this.updateRepresentative({
							...repre,
							hasRepresentative: true
						});
					}}
					requestClose={() => this.setState({
						selectRepresentative: false
					})}
				/>
				<div style={{ margin: '1em' }}>
					<Card style={{
						padding: '1em',
						marginBottom: '1em',
						color: 'black',
					}}>
						{isAppointment(this.props.council) ?
							<AppointmentParticipantForm
								participant={participant}
								checkEmail={this.emailKeyUp}
								translate={translate}
								languages={languages}
								errors={errors}
								updateState={this.updateState}
							/>
							: <ParticipantForm
								type={participant.personOrEntity}
								participant={participant}
								representative={representative}
								checkEmail={this.emailKeyUp}
								participations={participations}
								translate={translate}
								isGuest={participantIsGuest(participant)}
								hideVotingInputs={this.props.council.councilType === COUNCIL_TYPES.ONE_ON_ONE
									|| participantIsGuest(participant)
								}
								languages={languages}
								errors={errors}
								updateState={this.updateState}
							/>
						}
					</Card>
					{!isAppointment(this.props.council) && !participantIsGuest(participant)
						&& <div style={{
							boxShadow: 'rgba(0, 0, 0, 0.5) 0px 2px 4px 0px',
							border: '1px solid rgb(97, 171, 183)',
							borderRadius: '4px',
							padding: '1em',
							color: 'black',
							marginBottom: '.5em',
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
					}
					{this.props.council.statute.participantValidation === PARTICIPANT_VALIDATIONS.CLAVE_PIN
						&& <Card style={{
							padding: '1em',
							marginBottom: '1em',
							color: 'black',
						}}>
							<CheckUserClavePin
								translate={this.props.translate}
								participant={participant}
								setPinError={error => {
									this.setState({
										validated: false,
										errors: {
											clavePin: error
										}
									});
								}}
								validateParticipant={() => {
									this.setState({
										validated: true,
										errors: {
											...this.state.errors,
											clavePin: ''
										}
									});
								}}
							/>
							{this.state.errors.clavePin
								&& <div style={{ color: 'red', fontWeight: '700', padding: '0.6em' }}>
									{this.state.errors.clavePin}
								</div>
							}
							{this.state.validated
								&& <div style={{ color: 'green', fontWeight: '700', padding: '0.6em' }}>
									{translate.clave_justicia_participant_validated}
								</div>
							}
						</Card>
					}
				</div>
			</Scrollbar>
		);
	}

	render() {
		const { translate, participant } = this.props;

		return (
			<React.Fragment>
				<AlertConfirm
					bodyStyle={{ height: '400px', width: '950px' }}
					requestClose={() => this.cleanAndClose()}
					open={this.props.opened}
					fullWidth={false}
					acceptAction={this.updateCouncilParticipant}
					buttonAccept={translate.accept}
					buttonCancel={translate.cancel}
					bodyText={this.renderBody()}
					title={participantIsGuest(participant) ? translate.edit_guest : translate.edit_participant}
				/>
			</React.Fragment>
		);
	}
}

export default compose(
	graphql(updateCouncilParticipant, {
		name: 'updateCouncilParticipant',
		options: {
			errorPolicy: 'all'
		}
	}),
	graphql(languagesQuery),
	withSharedProps()
)(withApollo(CouncilParticipantEditor));


