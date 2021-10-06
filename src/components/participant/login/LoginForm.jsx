import React from 'react';
import { Tooltip, Card } from 'material-ui';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import gql from 'graphql-tag';
import { graphql, withApollo } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { isMobile } from 'react-device-detect';
import * as mainActions from '../../../actions/mainActions';
import { bHistory, moment } from '../../../containers/App';
import withTranslations from '../../../HOCs/withTranslations';
import withWindowSize from '../../../HOCs/withWindowSize';
import withWindowOrientation from '../../../HOCs/withWindowOrientation';
import { getPrimary, getSecondary } from '../../../styles/colors';
import {
	ButtonIcon, TextInput, BasicButton, AlertConfirm, HelpPopover, LoadingSection, Checkbox
} from '../../../displayComponents';
import { councilStarted, participantNeverConnected, hasAccessKey, getTermsURL } from '../../../utils/CBX';
import {
	useOldState, useCountdown, useSendRoomKey, useInterval
} from '../../../hooks';
import LoginWithCert from './LoginWithCert';
import ContactAdminButton from './ContactAdminButton';
import SMSStepper from './SMSAccess/SMSStepper';
import { useSubdomain } from '../../../utils/subdomain';

const styles = {
	loginContainerMax: {
		width: '100%',
		padding: '1em',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative'
	},
	loginContainer: {
		width: '100%',
		padding: '1em',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative'
	},
	splittedLoginContainer: {
		width: '100%',
		height: '100%',
		padding: '1em',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative'
	},
	councilInfoContainer: {
		display: 'flex',
		width: '100%',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		padding: '15px',
		textAlign: 'center'
	},
	loginFormContainer: {
		display: 'flex',
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		padding: '15px'
	},
	enterButtonContainer: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: '35px'
	}
};

const participantSend = gql`
    query participantSend($councilId: Int!, $filter: String,  $options: OptionsInput, $participantId: Int!,){
        participantSend(councilId: $councilId, filter: $filter, options: $options, participantId: $participantId){
            list{
                liveParticipantId
                sendType
                id
                reqCode
                sendDate
                councilId
                recipient{
                    name
                    id
                    surname
                    phone
                    email
                }
            }
            total
        }
    }
`;

const LoginForm = ({
	participant, translate, company, council, client, ...props
}) => {
	const [loading, setLoading] = React.useState(true);
	const [state, setState] = useOldState({
		password: '',
		sendPassModal: council.securityType !== 0,
		showPassword: false,
		legalTermsAccepted: !!participant.legalTermsAccepted,
		hover: false,
		helpPopover: true,
		modal: false
	});
	const [errors, setErrors] = React.useState({
		email: '',
		password: ''
	});
	const [sends, setSends] = React.useState(null);
	const [responseSMS, setResponseSMS] = React.useState('');
	const { secondsLeft, setCountdown } = useCountdown(0);
	// eslint-disable-next-line no-unused-vars
	const [loadingKey, sendKey] = useSendRoomKey(client, participant);
	const primary = getPrimary();
	const secondary = getSecondary();
	const subdomain = useSubdomain();

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: participantSend,
			variables: {
				councilId: council.id,
				participantId: participant.id,
				options: {
					offset: 0,
					limit: 20
				}
			}
		});

		if (response.data.participantSend.list) {
			setSends(response.data.participantSend.list);
		}
		setLoading(false);
	}, [council.id]);

	React.useEffect(() => {
		if (council.securityType === 2) {
			getData();
		}
	}, [getData, council.id]);

	useInterval(getData, responseSMS === 20 ? 5000 : null);

	React.useEffect(() => {
		if (sends && sends.length > 0) {
			const lastSend = sends[sends.length - 1];
			const end = moment(new Date());
			const start = moment(lastSend.sendDate);
			const duration = moment.duration(start.diff(end));
			const seconds = duration.asSeconds();
			if (seconds > -60) {
				setCountdown(Math.round(60 + seconds));
			}
			setResponseSMS(lastSend.reqCode);
		}
	}, [sends]);

	const checkFieldsValidationState = () => {
		const newErrors = {};

		if (council.securityType !== 0 && council.securityType !== 3 && !(state.password.length > 0)) {
			newErrors.password = translate.field_required;
		}

		if (!state.legalTermsAccepted) {
			newErrors.legalTerms = translate.acept_terms;
		}

		setErrors(oldErrors => ({
			...oldErrors,
			...newErrors
		}));

		return Object.keys(newErrors).length === 0;
	};

	const handleChange = (field, event) => {
		const newState = {};
		newState[field] = event.target.value;
		setState(newState, checkFieldsValidationState);
	};

	const sendConfirmation = async () => {
		await client.mutate({
			mutation: gql`
				mutation liveAcceptLegalTermsAndConditions{
					liveAcceptLegalTermsAndConditions{
						success
					}
				}
			`
		});
	};

	const handleSuccess = async () => {
		await sendConfirmation();
		props.actions.participantLoginSuccess();
		bHistory.push(`/participant/${participant.id}/council/${council.id}/${participant.roomType === 'MEETING' ? 'meet' : 'council'}`);
	};

	const closeSendPassModal = () => {
		setState({
			sendPassModal: false,
			phoneError: ''
		});
	};

	const login = async () => {
		const isValidForm = checkFieldsValidationState();
		if (hasAccessKey(council)) {
			try {
				const response = await props.checkParticipantKey({
					variables: {
						participantId: participant.id,
						key: +state.password
					}
				});

				if (!response.data.checkParticipantKey.success) {
					setErrors(oldErrors => ({
						...oldErrors,
						password: translate.incorrect_access__key
					}));
					return;
				}
			} catch (error) {
				setErrors(oldErrors => ({
					...oldErrors,
					password: translate.incorrect_access__key
				}));
				return;
			}
		}
		if (isValidForm) {
			handleSuccess();
		}
	};

	const handleKeyUp = event => {
		if (event.nativeEvent.keyCode === 13) {
			login();
		}
	};

	const tooltipContent = () => {
		const securityTypes = {
			1: translate.key_should_receive_email,
			2: translate.key_must_receive_sms
		};

		return securityTypes[council.securityType];
	};

	const sendParticipantRoomKey = async () => {
		setState({
			loading: true,
			modal: true
		});
		const response = await sendKey();
		if (!response.data.sendMyRoomKey.success) {
			setResponseSMS(-2);
		} else {
			setResponseSMS(20);
		}
		setCountdown(60);
	};

	const showHiddenPhone = num => {
		if (!num) {
			return '';
		}

		return num.toString().substr(num.length - 4);
	};

	const success = !!responseSMS && (responseSMS === 20 || responseSMS === 22 || responseSMS === 25);
	const error = !!responseSMS && !success;

	const renderAccessButton = () => {
		if (council.securityType === 3) {
			return (
				<LoginWithCert
					translate={translate}
					participant={participant}
					handleSuccess={handleSuccess}
					status={props.status}
					message={props.message}
					dispatch={props.updateState}
				/>
			);
		}

		if (council.securityType === 0 || council.securityType === 1) {
			return (
				<div style={styles.enterButtonContainer}>
					<BasicButton
						text={translate.enter_room}
						color={primary}
						textStyle={{
							color: 'white',
							fontWeight: '700',
							...subdomain?.styles?.roomLoginButton
						}}
						textPosition="before"
						fullWidth={true}
						icon={
							<ButtonIcon
								color="white"
								type="directions_walk"
								style={{ ...subdomain?.styles?.roomLoginButton }}
							/>
						}
						onClick={login}
					/>
				</div>
			);
		}

		const disabled = secondsLeft > 0 && error;

		const buttons = <div style={{
			margin: '0 auto', marginTop: '1em', display: isMobile ? '' : 'flex', justifyContent: 'space-between', width: '90%'
		}}>
			<ContactAdminButton
				participant={participant}
				council={council}
				translate={translate}
				open={state.sendPassModal}
				fullWidth={isMobile}
				requestclose={closeSendPassModal}
			/>
			<BasicButton
				text={disabled ? translate.sms_sent_seconds_left.replace('secondsLeft', secondsLeft) :
					success ? translate.enter_room : translate.request_access_code}
				color={primary}
				textStyle={{
					color: 'white',
					fontWeight: '700',
					marginTop: isMobile ? '1em' : ''
				}}
				disabled={disabled}
				buttonStyle={{
					minWidth: '200px'
				}}
				textPosition="before"
				fullWidth={isMobile}
				onClick={
					success ?
						login
						:
						sendParticipantRoomKey
				}
			/>
		</div>;

		return (
			<>
				{buttons}
				{/* no recibi el sms, un state para abrir y modal */}
				<AlertConfirm
					open={!!responseSMS && state.modal}
					requestClose={() => setState({ modal: false })}
					bodyText={
						<div style={{ margin: isMobile ? '4em 0em 2em' : '4em 4em 2em' }}>
							{loading ?
								<LoadingSection />
								:
								<React.Fragment>
									<div style={{ textAlign: 'center', color: 'black', fontWeight: 'bold' }}>
										{responseSMS &&
											<>
												{success &&
													`${translate.sms_sent_to_phone} ...${showHiddenPhone(participant.phone)}`
												}
												{error &&
													<div style={{
														fontWeight: 'bold', color: '#f11a1a', marginTop: '2em', display: 'flex', alignItems: 'center', justifyContent: 'center'
													}}>
														<div style={{ width: '90%' }}>
															{translate.sms_error_description}
														</div>
													</div>
												}
											</>
										}
									</div>
									<div style={{
										margin: '0 auto', marginTop: '1em', display: isMobile ? '' : 'flex', justifyContent: 'space-between', width: '90%'
									}}>
										<ContactAdminButton
											participant={participant}
											council={council}
											translate={translate}
											open={state.sendPassModal}
											fullWidth={isMobile}
											requestclose={closeSendPassModal}
										/>
										{!success ?
											<BasicButton
												text={disabled ? translate.sms_sent_seconds_left.replace('secondsLeft', secondsLeft) :
													success ? translate.enter_room : translate.request_access_code}
												color={primary}
												textStyle={{
													color: 'white',
													fontWeight: '700',
													marginTop: isMobile ? '1em' : ''
												}}
												disabled={disabled}
												buttonStyle={{
													minWidth: '200px'
												}}
												textPosition="before"
												fullWidth={isMobile}
												onClick={
													success ?
														login
														:
														sendParticipantRoomKey
												}
											/>
											:
											<BasicButton
												text={translate.close}
												color={primary}
												textStyle={{
													color: 'white',
													fontWeight: '700',
													marginTop: isMobile ? '1em' : ''
												}}
												buttonStyle={{
													minWidth: '200px'
												}}
												textPosition="before"
												fullWidth={isMobile}
												onClick={() => setState({ modal: false })}
											/>
										}
									</div>
								</React.Fragment>
							}
						</div>
					}
				/>
			</>
		);
	};

	const { password, showPassword } = state;
	return (
		<div>
			<div style={{
				width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'
			}}>
				<div style={{
					width: '100%',
					paddingLeft: '4px'
				}}>
					<div style={{ textAlign: 'center', padding: '1em' }} >
						<Tooltip
							title={council.businessName}
							placement={'top'}
							enterDelay={300}
							leaveDelay={300}
						>
							{company.logo ?
								<img
									src={company.logo}
									alt="company_logo"
									style={{
										maxWidth: '130px',
										maxHeight: '80px',
										marginBottom: '1em'
									}}
								/>
								:
								<i className="fa fa-building-o" style={{ fontSize: '75px', color: 'grey', marginBottom: '10px' }} />
							}
						</Tooltip>
						<h3 style={{ color: secondary, fontSize: '1.8em' }}>{council.name}</h3>
						<span>
							{moment(new Date(council.dateStart)).format('LLL')}
						</span>

						{(councilStarted(council) && (council.statute.existsLimitedAccessRoom === 1) && participantNeverConnected(participant)) &&
							<p>
								{translate.room_access_close_at}
								<span style={{ fontWeight: 'bold', marginLeft: '2px' }}>
									{
										moment(new Date(council.dateRealStart))
											.add(council.statute.limitedAccessRoomMinutes, 'm')
											.format('HH:mm')
									}
								</span>
							</p>
						}
						{council.securityType === 2 &&
							<div style={{ color: '#61abb7', fontWeight: 'bold', margin: '1em' }}>
								{translate.sms_login_description}
							</div>
						}
					</div>

					<Card elevation={1} style={{ padding: '1.5em', border: '1px solid gainsboro' }}>
						<form style={{ width: '100%' }}>
							<TextInput
								styleFloatText={{ fontSize: '20px' }}
								floatingText={translate.email}
								type="email"
								fullWidth
								errorText={errors.email}
								value={participant.email}
								disabled={true}
							/>

							{hasAccessKey(council) && (
								<React.Fragment>
									<TextInput
										onKeyUp={handleKeyUp}
										helpPopoverInLabel={true}
										floatingText={council.securityType === 2 ?
											(
												<div style={{ display: 'flex', fontSize: '20px' }}>
													{translate.key_by_sms}
													<div>
														<HelpPopover
															errorText={!!errors.password}
															title={translate.key_by_sms}
															content={tooltipContent()}
														/>
													</div>
												</div>
											)
											:
											(
												<div style={{ display: 'flex' }}>
													{translate.key_by_email}
													<div>
														<HelpPopover
															errorText={!!errors.password}
															title={translate.key_by_email}
															content={tooltipContent()}
														/>
													</div>
												</div>
											)
										}
										type={showPassword ? 'text' : 'password'}
										errorText={errors.password}
										value={password}
										onChange={event => handleChange('password', event)}
										required={true}
										showPassword={showPassword}
										passwordToggler={() => setState({
											showPassword: !showPassword
										})}
									/>


								</React.Fragment>
							)}
							{!participant.legalTermsAccepted && subdomain.name !== 'evid' &&
								<>
									<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
										<Checkbox
											id="accept-legal-checkbox"
											label={
												<div>
													{translate.login_read_terms}
													<a
														style={{
															color: primary,
															fontWeight: '700',
															cursor: 'pointer',
															textTransform: 'lowerCase',
															marginLeft: '0.4em'
														}}
														href={getTermsURL(translate.selectedLanguage)}
														target="_blank"
														rel="noreferrer noopener"
													>
														{translate.login_read_terms2}
													</a>
												</div>}
											value={state.termsCheck}
											onChange={(event, isInputChecked) => setState({
												legalTermsAccepted: isInputChecked
											})}
										/>
									</div>
									{errors.legalTerms && (
										<div style={{ color: 'red' }} id="legal-terms-error-text">
											{errors.legalTerms}
										</div>
									)}
								</>
							}
							{renderAccessButton()}
						</form>
					</Card>
					{error &&
						<div style={{
							fontWeight: 'bold', color: '#f11a1a', marginTop: '2em', display: 'flex', alignItems: 'center', justifyContent: 'center'
						}}>
							<div style={{ width: '90%' }}>
								{translate.sms_error_description}
							</div>
						</div>
					}
					{council.securityType === 2 &&
						<div style={{
							marginTop: '1em', marginBottom: '1em', display: 'flex', alignItems: 'center', justifyContent: 'center'
						}}>
							<div style={{ width: '100%' }}>
								<SMSStepper
									council={council}
									translate={translate}
									responseSMS={responseSMS}
									resendKey={sendParticipantRoomKey}
									error={error}
								/>
							</div>
						</div>
					}
				</div>
			</div>
		</div>
	);
};


const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(mainActions, dispatch)
});

const checkParticipantKey = gql`
    mutation CheckParticipantKey($participantId: Int!, $key: Int!){
        checkParticipantKey(participantId: $participantId, key: $key){
            success
            message
        }
    }
`;

const sendParticipantRoomKey = gql`
    mutation SendMyRoomKey{
        sendMyRoomKey{
            success
        }
    }
`;

export default compose(
	graphql(checkParticipantKey, {
		name: 'checkParticipantKey'
	}),
	graphql(sendParticipantRoomKey, {
		name: 'sendParticipantRoomKey'
	})
)(connect(
	null,
	mapDispatchToProps
)(withTranslations()(withWindowOrientation(withWindowSize(withApollo(LoginForm))))));
