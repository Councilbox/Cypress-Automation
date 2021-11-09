import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { BasicButton, AlertConfirm, Scrollbar } from '../../../../displayComponents/index';
import { getPrimary, secondary } from '../../../../styles/colors';
import { languages as languagesQuery } from '../../../../queries/masters';
import ParticipantForm from '../../participants/ParticipantForm';
import {
	checkRequiredFieldsParticipant,
	checkRequiredFieldsRepresentative,
	checkValidEmail
} from '../../../../utils/validation';
import RepresentativeForm from '../../../company/census/censusEditor/RepresentativeForm';
import { upsertConvenedParticipant, checkUniqueCouncilEmails } from '../../../../queries/councilParticipant';
import { COUNCIL_TYPES, INPUT_REGEX } from '../../../../constants';
import withSharedProps from '../../../../HOCs/withSharedProps';
import SelectRepresentative from '../../editor/census/modals/SelectRepresentative';
import { getMaxGrantedWordsMessage, isAppointment, isMaxGrantedWordsError, participantIsGuest, participantIsTranslator, removeTypenameField } from '../../../../utils/CBX';
import AppointmentParticipantForm from '../../participants/AppointmentParticipantForm';
import TranslatorForm from '../../participants/TranslatorForm';


const initialRepresentative = {
	hasRepresentative: false,
	language: 'es',
	type: 2,
	name: '',
	surname: '',
	position: '',
	email: '',
	phone: '',
	dni: ''
};

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
		// eslint-disable-next-line prefer-const
		let { representative, delegateId, delegateUuid, __typename, councilId, ...participant } = removeTypenameField(
			this.props.participant
		);

		representative = (participant.representatives.length > 0) ?
			{
				hasRepresentative: true,
				...removeTypenameField(participant.representatives[0])
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
		const representative = this.state.representative.hasRepresentative ?
			{
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
			} else if (isMaxGrantedWordsError(response.errors[0])) {
				const message = getMaxGrantedWordsMessage(response.errors[0], this.props.translate);

				this.setState({
					loading: false,
					...(participant.initialState === 2 ? {
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

	async checkRequiredFields(onlyEmail) {
		const participant = this.state.data;
		const translator = participantIsTranslator(participant);
		const { representative } = this.state;
		const { translate, participations, company } = this.props;

		let errorsParticipant = {
			errors: {},
			hasError: false
		};
		let errorsRepresentative = {
			errors: {},
			hasError: false
		};

		if (translator) {
			const testPhone = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;

			const regex = INPUT_REGEX;

			if (!(regex.test(participant.name)) || !participant.name.trim()) {
				errorsParticipant.errors.name = translate.required_field;
				errorsParticipant.hasError = true;
			}

			if (!participant.phone) {
				errorsParticipant.errors.phone = translate.required_field;
				errorsParticipant.hasError = true;
			}

			if (participant.phone && participant.phone !== '-') {
				if (!testPhone.test(participant.phone)) {
					errorsParticipant.errors.phone = translate.invalid_field;
					errorsParticipant.hasError = true;
				}
			}

			if (!participant.email) {
				errorsParticipant.errors.email = translate.required_field;
				errorsParticipant.hasError = true;
			} else if (!checkValidEmail(participant.email)) {
				errorsParticipant.errors.email = translate.valid_email_required;
				errorsParticipant.hasError = true;
			}
		} else {
			if (!onlyEmail) {
				const hasSocialCapital = participations;
				errorsParticipant = checkRequiredFieldsParticipant(
					participant,
					translate,
					hasSocialCapital,
					company
				);
			}

			if (representative.hasRepresentative) {
				if (!onlyEmail) {
					errorsRepresentative = checkRequiredFieldsRepresentative(
						representative,
						translate
					);
				}
			}
		}

		const emailsToCheck = [];

		if (participant.email && participant.email !== this.props.participant.email && company.type !== 10) {
			emailsToCheck.push(participant.email);
		}

		if (representative.email && ((this.props.participant.representative
			&& representative.email !== this.props.participant.representative.email) || !this.props.participant.representative)) {
			emailsToCheck.push(representative.email);
		}

		if (emailsToCheck.length > 0) {
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
				});
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
		const { representative, errors, representativeErrors } = this.state;
		const { translate, participations } = this.props;
		const { languages = [] } = this.props.data;

		if (participantIsTranslator(participant)) {
			return (
				<AlertConfirm
					bodyStyle={{ height: '400px', width: '950px' }}
					bodyText={
						<TranslatorForm
							translate={translate}
							representative={participant}
							updateState={this.updateState}
							errors={errors}
							languages={languages}
						/>
					}
					title={translate.edit_translator}
					requestClose={() => this.props.close()}
					open={this.props.opened}
					actions={
						<React.Fragment>
							<BasicButton
								text={translate.cancel}
								color="transparent"
								textStyle={{
									boxShadow: 'none',
									borderRadius: '4px',
									textTransform: 'none',
									fontWeight: '700',
								}}
								onClick={this.props.close}
							/>
							<BasicButton
								text={this.props.council.councilType === COUNCIL_TYPES.BOARD_WITHOUT_SESSION ?
									translate.save_and_notify : translate.save_changes_and_send}
								textStyle={{
									boxShadow: 'none',
									borderRadius: '4px',
									color: 'white',
									textTransform: 'none',
									fontWeight: '700'
								}}
								buttonStyle={{ marginLeft: '1em' }}
								color={secondary}
								onClick={() => {
									this.updateConvenedParticipant(true);
								}}
							/>
							<BasicButton
								text={translate.save_changes}
								textStyle={{
									boxShadow: 'none',
									borderRadius: '4px',
									color: 'white',
									textTransform: 'none',
									fontWeight: '700'
								}}
								buttonStyle={{ marginLeft: '1em' }}
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

		return (
			<AlertConfirm
				bodyStyle={{ height: '400px', width: '950px' }}
				bodyText={
					<Scrollbar>
						<SelectRepresentative
							open={this.state.selectRepresentative}
							council={this.props.council}
							translate={translate}
							participantId={participant.id}
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
						<div style={{ marginRight: '1em' }}>
							<div style={{
								boxShadow: 'rgba(0, 0, 0, 0.5) 0px 2px 4px 0px',
								border: '1px solid rgb(97, 171, 183)',
								borderRadius: '4px',
								padding: '1em',
								marginBottom: '1em',
								color: 'black',
							}}>
								{isAppointment(this.props.council) ?
									<AppointmentParticipantForm
										participant={participant}
										translate={translate}
										languages={languages}
										errors={errors}
										updateState={this.updateState}
									/>
									:
									<ParticipantForm
										type={participant.personOrEntity}
										participant={participant}
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
							</div>
							{!isAppointment(this.props.council) && !participantIsGuest(participant) &&
								<div style={{
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
						</div>
					</Scrollbar>
				}
				title={ participantIsGuest(participant) ? translate.edit_guest : translate.edit_participant}
				requestClose={() => this.props.close()}
				open={this.props.opened}
				actions={
					<React.Fragment>
						<BasicButton
							text={translate.cancel}
							color="transparent"
							textStyle={{
								boxShadow: 'none',
								borderRadius: '4px',
								textTransform: 'none',
								fontWeight: '700',
							}}
							onClick={this.props.close}
						/>
						<BasicButton
							text={this.props.council.councilType === COUNCIL_TYPES.BOARD_WITHOUT_SESSION ?
								translate.save_and_notify : translate.save_changes_and_send}
							textStyle={{
								boxShadow: 'none',
								borderRadius: '4px',
								color: 'white',
								textTransform: 'none',
								fontWeight: '700'
							}}
							buttonStyle={{ marginLeft: '1em' }}
							color={secondary}
							onClick={() => {
								this.updateConvenedParticipant(true);
							}}
						/>
						<BasicButton
							text={translate.save_changes}
							textStyle={{
								boxShadow: 'none',
								borderRadius: '4px',
								color: 'white',
								textTransform: 'none',
								fontWeight: '700'
							}}
							buttonStyle={{ marginLeft: '1em' }}
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
		name: 'updateConvenedParticipant',
		options: {
			errorPolicy: 'all'
		}
	}),
	graphql(languagesQuery),
	withSharedProps()
)(withApollo(ConvenedParticipantEditor));
