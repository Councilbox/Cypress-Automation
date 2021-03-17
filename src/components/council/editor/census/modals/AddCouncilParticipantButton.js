import React from 'react';
import { compose, graphql, withApollo } from 'react-apollo';
import { Card } from 'material-ui';
import {
	AlertConfirm,
	BasicButton,
	ButtonIcon
} from '../../../../../displayComponents/index';
import { getPrimary } from '../../../../../styles/colors';
import { addParticipant, checkUniqueCouncilEmails } from '../../../../../queries/councilParticipant';
import { languages as languagesQuery } from '../../../../../queries/masters';
import {
	checkValidEmail,
	checkRequiredFieldsParticipant,
	checkRequiredFieldsRepresentative,
} from '../../../../../utils/validation';
import ParticipantForm from '../../../participants/ParticipantForm';
import RepresentativeForm from '../../../../company/census/censusEditor/RepresentativeForm';
import CheckUserClavePin from '../../../participants/CheckParticipantRegisteredClavePin';
import withSharedProps from '../../../../../HOCs/withSharedProps';
import SelectRepresentative from './SelectRepresentative';
import { COUNCIL_TYPES, INPUT_REGEX, PARTICIPANT_VALIDATIONS } from '../../../../../constants';
import { isAppointment } from '../../../../../utils/CBX';
import AppointmentParticipantForm from '../../../participants/AppointmentParticipantForm';

const initialParticipant = council => {
	return {
		name: '',
		surname: '',
		position: '',
		email: '',
		phone: '',
		dni: '',
		initialState: isAppointment(council) ? 2 : 0,
		type: 0,
		delegateId: null,
		numParticipations: 1,
		socialCapital: 1,
		uuid: null,
		delegateUuid: null,
		language: 'es',
		city: '',
		personOrEntity: 0
	};
};

const initialRepresentative = council => {
	return {
		hasRepresentative: false,
		language: 'es',
		type: 2,
		initialState: isAppointment(council) ? 2 : 0,
		name: '',
		surname: '',
		position: '',
		email: '',
		phone: '',
		dni: ''
	};
};

class AddCouncilParticipantButton extends React.Component {
	state = {
		modal: false,
		data: {
			...initialParticipant(this.props.council),
			...(this.props.council.councilType === COUNCIL_TYPES.ONE_ON_ONE ? {
				initialState: 2
			} : {})
		},
		representative: { ...initialRepresentative(this.props.council) },
		errors: {},
		loading: false,
		validated: !this.props.validateBeforeCreate,
		representativeErrors: {}
	};

	timeout = null;

	addParticipant = async () => {
		const { hasRepresentative, ...data } = this.state.representative;
		const representative = this.state.representative.hasRepresentative ?
			{
				...data,
				councilId: this.props.council.id
			}
			: null;

		if (!await this.checkRequiredFields()) {
			if (!this.state.validated) {
				return this.setState({
					errors: {
						clavePin: 'Antes de poder crear el participante tiene que se comprobada su alta en el servicio cl@ve pin'
					}
				});
			}

			this.setState({
				loading: true
			});
			const response = await this.props.addParticipant({
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
				this.setState({
					modal: false,
					data: { ...initialParticipant(this.props.council) },
					representative: { ...initialRepresentative(this.props.council) },
					errors: {},
					loading: false,
					representativeErrors: {}
				});
			} else if (response.errors[0].message === 'Too many granted words') {
				this.setState({
					loading: false,
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
	};

	updateState = object => {
		this.setState({
			...(object?.dni ? {
				validated: false
			} : {}),
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
		const testPhone = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
		const participant = this.state.data;
		const { representative } = this.state;
		const { translate, participations, company } = this.props;
		const hasSocialCapital = participations;
		const errorsParticipant = checkRequiredFieldsParticipant(
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
		const regex = INPUT_REGEX;

		if (participant.name) {
			if (!(regex.test(participant.name)) || !participant.name.trim()) {
				errorsParticipant.errors.name = translate.invalid_field;
				errorsParticipant.hasError = true;
			}
		}
		if (participant.surname) {
			if (!(regex.test(participant.surname)) || !participant.surname.trim()) {
				errorsParticipant.errors.surname = translate.invalid_field;
				errorsParticipant.hasError = true;
			}
		}


		if (this.props.company.type !== 10) {
			emailsToCheck.push(participant.email);
		}

		if (representative.hasRepresentative) {
			errorsRepresentative = checkRequiredFieldsRepresentative(
				representative,
				translate
			);

			if (!representative.id && representative.email) {
				emailsToCheck.push(representative.email);
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
					if (participant.email && participant.email === email) {
						errorsParticipant.errors.email = translate.register_exists_email;
						errorsParticipant.hasError = true;
					}
					if (representative.email && representative.email === email) {
						errorsRepresentative.errors.email = translate.register_exists_email;
						errorsRepresentative.hasError = true;
					}
				});
			}

			if (representative.hasRepresentative && participant.email === representative.email) {
				errorsRepresentative.errors.email = translate.repeated_email;
				errorsParticipant.errors.email = translate.repeated_email;
				errorsParticipant.hasError = true;
			}

			if (!participant.email) {
				errorsParticipant.hasError = true;
				errorsParticipant.errors.email = translate.field_required;
			}

			if (participant.phone && participant.phone !== '-') {
				if (!testPhone.test(participant.phone)) {
					errorsParticipant.hasError = true;
					errorsParticipant.errors.phone = translate.invalid_field;
				}
			}

			if (representative.hasRepresentative && !representative.email) {
				errorsRepresentative.errors.email = translate.field_required;
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
		const { errors } = this.state;
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
				<div style={{ marginRight: '1em' }}>
					<Card style={{
						padding: '1em',
						marginBottom: '1em',
						color: 'black',
					}}>
						{isAppointment(this.props.council) ?
							<AppointmentParticipantForm
								participant={participant}
								translate={translate}
								languages={languages}
								checkEmail={this.emailKeyUp}
								errors={errors}
								updateState={this.updateState}
							/>
							:
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
						}
					</Card>
					{!isAppointment(this.props.council) &&
						<Card style={{
							padding: '1em',
							marginBottom: '1em',
							color: 'black',
						}}>
							<RepresentativeForm
								translate={this.props.translate}
								state={this.state.representative}
								updateState={this.updateRepresentative}
								setSelectRepresentative={value => this.setState({
									selectRepresentative: value
								})}
								checkEmail={this.emailKeyUp}
								errors={this.state.representativeErrors}
								languages={this.props.data.languages}
							/>
						</Card>
					}
					{this.props.council.statute.participantValidation === PARTICIPANT_VALIDATIONS.CLAVE_PIN &&
						<Card style={{
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
							{this.state.errors.clavePin &&
								<div style={{ color: 'red', fontWeight: '700', padding: '0.6em' }}>
									{this.state.errors.clavePin}
								</div>
							}
							{this.state.validated &&
								<div style={{ color: 'green', fontWeight: '700', padding: '0.6em' }}>
									{'Alta validada'}
								</div>
							}
						</Card>
					}
				</div>
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
					disabled={this.props.disabled}
					floatRight
					color={this.props.disabled ? 'lightgrey' : 'white'}
					textStyle={{
						color: primary,
						fontWeight: '700',
						fontSize: '0.9em',
						textTransform: 'none'
					}}
					textPosition="after"
					icon={<ButtonIcon type="add" color={primary} />}
					onClick={() => this.setState({ modal: true })}
					buttonStyle={{
						border: `2px solid ${primary}`
					}}
					id={'anadirParticipanteEnCensoNewReunion'}
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
					bodyText={this.renderBody()}
					title={translate.add_participant}
				/>
			</React.Fragment>
		);
	}
}


export default compose(
	graphql(addParticipant, {
		name: 'addParticipant',
		options: {
			errorPolicy: 'all'
		}
	}),
	graphql(languagesQuery),
	withSharedProps()
)(withApollo(AddCouncilParticipantButton));

