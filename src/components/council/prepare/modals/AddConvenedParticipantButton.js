import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import {
	BasicButton,
	ButtonIcon,
	AlertConfirm,
	Scrollbar
} from '../../../../displayComponents';
import { getPrimary, secondary } from '../../../../styles/colors';
import { languages as languagesQuery } from '../../../../queries/masters';
import ParticipantForm from '../../participants/ParticipantForm';
import {
	checkRequiredFieldsParticipant,
	checkRequiredFieldsRepresentative
} from '../../../../utils/validation';
import RepresentativeForm from '../../../company/census/censusEditor/RepresentativeForm';
import { checkUniqueCouncilEmails, addConvenedParticipant } from '../../../../queries/councilParticipant';
import { useOldState } from '../../../../hooks';
import withSharedProps from '../../../../HOCs/withSharedProps';
import { isMobile } from '../../../../utils/screen';
import { COUNCIL_TYPES } from '../../../../constants';
import {
	councilIsFinished, getMaxGrantedWordsMessage, isAppointment, isMaxGrantedWordsError
} from '../../../../utils/CBX';
import SelectRepresentative from '../../editor/census/modals/SelectRepresentative';
import AppointmentParticipantForm from '../../participants/AppointmentParticipantForm';

const initialParticipant = {
	name: '',
	surname: '',
	position: '',
	email: '',
	phone: '',
	dni: '',
	type: 0,
	delegateId: null,
	numParticipations: 1,
	socialCapital: 1,
	uuid: null,
	initialState: 0,
	delegateUuid: null,
	language: 'es',
	city: '',
	personOrEntity: 0
};

const initialRepresentative = {
	hasRepresentative: false,
	language: 'es',
	type: 2,
	name: '',
	surname: '',
	position: '',
	email: '',
	initialState: 0,
	phone: '',
	dni: ''
};

const AddConvenedParticipantButton = ({
	translate, council, participations, client, company, buttonAdd = true, modal, requestClose, ...props
}) => {
	const [state, setState] = useOldState({
		modal: false,
		data: { ...initialParticipant },
		representative: { ...initialRepresentative },
		errors: {},
		representativeErrors: {}
	});

	const primary = getPrimary();

	async function checkRequiredFields(onlyEmail) {
		const testPhone = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
		const participant = state.data;
		const { representative } = state;

		let errorsParticipant = {
			errors: {},
			hasError: false
		};

		if (!onlyEmail) {
			const hasSocialCapital = participations;
			errorsParticipant = checkRequiredFieldsParticipant(
				participant,
				representative,
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


		if ((participant.email && company.type !== 10) || (participant.personOrEntity === 1)) {
			const emailsToCheck = [participant.email];

			if (representative.email && !representative.id) {
				emailsToCheck.push(representative.email);
			}

			const response = await client.query({
				query: checkUniqueCouncilEmails,
				variables: {
					councilId: props.councilId,
					emailList: emailsToCheck
				}
			});

			if (!response.data.checkUniqueCouncilEmails.success) {
				const data = JSON.parse(response.data.checkUniqueCouncilEmails.message);
				data.duplicatedEmails.forEach(email => {
					if (participant.email === email && participant.email.length > 0) {
						errorsParticipant.errors.email = translate.register_exists_email;
						errorsParticipant.hasError = true;
					}
					if (representative.email === email && representative.email.length > 0) {
						errorsRepresentative.errors.email = translate.register_exists_email;
						errorsRepresentative.hasError = true;
					}
				});
			}

			if (participant.email === representative.email && !representative.hasRepresentative) {
				errorsRepresentative.errors.email = translate.repeated_email;
				errorsParticipant.errors.email = translate.repeated_email;
				errorsParticipant.hasError = true;
			}

			if (participant.phone && participant.phone !== '-') {
				if (!testPhone.test(participant.phone)) {
					errorsParticipant.hasError = true;
					errorsParticipant.errors.phone = translate.invalid_field;
				}
			}

			if (representative.phone && representative.phone !== '-') {
				if (!testPhone.test(representative.phone)) {
					errorsRepresentative.hasError = true;
					errorsRepresentative.errors.phone = translate.invalid_field;
				}
			}
		}

		setState({
			...state,
			errors: errorsParticipant.errors,
			representativeErrors: errorsRepresentative.errors
		});

		return errorsParticipant.hasError || errorsRepresentative.hasError;
	}

	const addParticipant = async sendConvene => {
		const { hasRepresentative, ...data } = state.representative;
		const representative = state.representative.hasRepresentative ?
			{
				...data,
				councilId: props.councilId
			}
			: null;

		if (!await checkRequiredFields()) {
			const response = await props.addParticipant({
				variables: {
					participant: {
						...state.data,
						councilId: props.councilId
					},
					representative,
					sendConvene
				}
			});
			if (!response.errors) {
				props.refetch();
				setState({
					modal: false,
					data: { ...initialParticipant },
					representative: { ...initialRepresentative },
					errors: {},
					representativeErrors: {}
				});
				if (!buttonAdd) {
					requestClose();
				}
			} else if (isMaxGrantedWordsError(response.errors[0])) {
				const message = getMaxGrantedWordsMessage(response.errors[0], translate);

				setState({
					...(state.data.initialState === 2 ? {
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

	const updateState = object => {
		setState({
			data: {
				...state.data,
				...object
			}
		});
	};

	const updateRepresentative = object => {
		setState({
			representative: {
				...state.representative,
				...object
			}
		});
	};

	const {
		data: participant,
		errors,
		representativeErrors,
		representative
	} = state;

	const { languages } = props.data;

	const openModal = () => (buttonAdd ? state.modal : modal);
	const closeModal = () => (buttonAdd ? () => setState({
		modal: false,
		errors: {},
		representativeErrors: {},
		loading: false
	}) : () => {
		setState({
			errors: {},
			representativeErrors: {},
			loading: false
		});
		requestClose();
	});

	const button = () => (
		<BasicButton
			text={translate.add_participant}
			disabled={councilIsFinished(council)}
			color={'white'}
			textStyle={{
				color: primary,
				fontWeight: '700',
				fontSize: '0.9em',
				textTransform: 'none'
			}}
			textPosition="after"
			icon={!isMobile ? <ButtonIcon type="add" color={primary} /> : null}
			onClick={() => setState({ modal: true })}
			buttonStyle={{
				marginRight: '1em',
				border: `2px solid ${primary}`
			}}
		/>
	);

	return (
		<React.Fragment>
			{
				buttonAdd
				&& button()
			}

			<AlertConfirm
				bodyStyle={{ height: '400px', width: '950px' }}
				bodyText={
					<Scrollbar>
						<SelectRepresentative
							open={state.selectRepresentative}
							council={council}
							translate={translate}
							updateRepresentative={repre => {
								updateRepresentative({
									...repre,
									hasRepresentative: true
								});
							}}
							requestClose={() => setState({
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
								{isAppointment(council) ?
									<AppointmentParticipantForm
										participant={participant}
										representative={representative}
										translate={translate}
										languages={languages}
										errors={errors}
										updateState={updateState}
									/>
									: <ParticipantForm
										type={participant.personOrEntity}
										participant={participant}
										representative={representative}
										participations={participations}
										translate={translate}
										hideVotingInputs={council.councilType === COUNCIL_TYPES.ONE_ON_ONE}
										languages={languages}
										errors={errors}
										updateState={updateState}
									/>

								}
							</div>
							{!isAppointment(council)
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
										updateState={updateRepresentative}
										setSelectRepresentative={value => setState({
											selectRepresentative: value
										})}
										errors={representativeErrors}
										languages={languages}
									/>
								</div>
							}
						</div>
					</Scrollbar>
				}
				title={translate.add_participant}
				requestClose={closeModal()}
				open={openModal()}
				actions={
					<React.Fragment>
						<BasicButton
							text={translate.cancel}
							type="flat"
							color="white"
							textStyle={{
								textTransform: 'none',
								fontWeight: '700'
							}}
							onClick={closeModal()}
						/>
						<BasicButton
							text={council.councilType === COUNCIL_TYPES.BOARD_WITHOUT_SESSION ? translate.save_and_notify : translate.save_changes_and_send}
							textStyle={{
								color: 'white',
								textTransform: 'none',
								fontWeight: '700'
							}}
							buttonStyle={{ marginLeft: '1em' }}
							color={secondary}
							onClick={() => {
								addParticipant(true);
							}}
						/>
						<BasicButton
							text={translate.save_changes}
							textStyle={{
								color: 'white',
								textTransform: 'none',
								fontWeight: '700'
							}}
							buttonStyle={{ marginLeft: '1em' }}
							color={primary}
							onClick={() => {
								addParticipant(false);
							}}
						/>
					</React.Fragment>
				} />
		</React.Fragment>
	);
};


export default compose(
	graphql(addConvenedParticipant, {
		name: 'addParticipant',
		options: {
			errorPolicy: 'all'
		}
	}),
	graphql(languagesQuery),
	withSharedProps()
)(withApollo(AddConvenedParticipantButton));

