import React from 'react';
import { Card } from 'material-ui';
import { withRouter } from 'react-router';
import gql from 'graphql-tag';
import { BasicButton, NotLoggedLayout, DateTimePicker } from '../../../../displayComponents';
import { isMobile } from '../../../../utils/screen';
import { getPrimary } from '../../../../styles/colors';
import ClaveJusticiaStepper from './ClaveJusticiaStepper';
import { client, moment } from '../../../../containers/App';


const styles = {
	loginContainerMax: {
		width: '100%',
		height: '100%',
		padding: '1em',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative'
	},
	loginContainer: {
		width: '100%',
		height: '100%',
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

const reducer = (state, action) => {

	const actions = {
		LOADING: () => ({
			...state,
			status: 'LOADING',
			errorText: ''
		}),
		ERROR: () => ({
			...state,
			status: 'ERROR',
			errorText: state.payload
		}),
		SUCCESS: () => ({
			...state,
			status: 'SUCCESS',
			errorText: ''
		}),
	};

	return actions[action.type] ? actions[action.type]() : state;
};


const checkValidExpirationDate = string => string.length === 10;

const AccessClaveJusticia = ({
	translate, council, match
}) => {
	const [{ status }, dispatch] = React.useReducer(reducer, { status: 'IDDLE', errorText: '' });
	const primary = getPrimary();
	const [expirationDate, setExpirationDate] = React.useState(null);
	const [expirationDateError, setExpirationDateError] = React.useState('');

	const sendClaveJusticia = async type => {
		if (!expirationDate) {
			return setExpirationDateError('Es necesario introducir la fecha de expiración');
		}

		const formatedExpirationDate = moment(expirationDate).format('L').replace(/\//g, '-')

		if (!checkValidExpirationDate(formatedExpirationDate)) {
			return setExpirationDateError('Fecha de expiración no válida');
		}

		setExpirationDateError('');

		const response = await client.mutate({
			mutation: gql`
				mutation SendClaveJusticia($expirationDate: String!, $type: String!, $token: String) {
					sendClaveJusticiaToParticipant(expirationDate: $expirationDate, type: $type, token: $token) {
						success
						message
					}
				}
			`,
			variables: {
				type,
				expirationDate: formatedExpirationDate,
				token: match.params.token
			}
		});


		if (response.data.sendClaveJusticiaToParticipant.success) {
			dispatch({ type: 'SUCCESS' });
		} else if (response.data.sendClaveJusticiaToParticipant.message === 'Invalid expiration date') {
			setExpirationDateError('La fecha de expiración no coincide');
		}
	};


	return (
		<NotLoggedLayout
			translate={translate}
			helpIcon={true}
			languageSelector={false}
			styleFix={{ overflow: 'hidden' }}
		>
			<div style={{
				...styles.mainContainer,
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				width: '100%'
			}}>
				<Card style={{
					...styles.cardContainer,
					maxWidth: isMobile ? '100%' : '650px',
					minWidth: window.innerWidth > 450 ? '650px' : '100%',
				}} elevation={6}>
					<div style={{
						...styles.loginContainerMax,
						height: '',
					}}>
						<div style={{
							width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1em 6em',
						}}>
							<div style={{
								width: '100%',
								paddingLeft: '4px',
							}}>
								<div style={{ textAlign: 'center', padding: '1em', paddingTop: '0em' }} >
									<h3 style={{ color: primary, fontSize: '2em' }}>
										Acceso Evid
									</h3>
								</div>
								<div style={{ display: 'flex', justifyContent: 'center' }}>
									<div style={{ width: '440px' }}>
										<div style={{ textAlign: 'center', padding: '1em', border: '1px solid gainsboro', boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)' }}>
											{status === 'IDDLE' && (
												<>
													<div style={{ width: '50%' }}>
														<DateTimePicker
															format="L"
															floatingText={'Fecha validez/Nº soporte'}
															errorText={expirationDateError}
															onlyDate
															style={{ width: '10em' }}
															onChange={date => {
																setExpirationDate(date);
															}}
															value={expirationDate}
														/>
													</div>
													<div style={{ display: 'flex', alignItems: 'flex-end' }}>
														<BasicButton
															text={'Solicitar PIN vía SMS'}
															onClick={() => sendClaveJusticia('SMS')}
															backgroundColor={{
																color: primary,
																backgroundColor: 'white',
																border: '1px solid #154481',
																borderRadius: '4px',
																fontSize: '12px',
																marginRight: '5px',
																marginLeft: '5px',
																padding: '0',
																minHeight: '24px',
																boxShadow: 'none'
															}}
															textPosition="before"
															fullWidth={true}
														/>
														<BasicButton
															text={'Solicitar PIN vía APP'}
															onClick={() => sendClaveJusticia('APP')}
															backgroundColor={{
																color: primary,
																backgroundColor: 'white',
																border: '1px solid #154481',
																borderRadius: '4px',
																fontSize: '12px',
																padding: '0',
																minHeight: '24px',
																boxShadow: 'none'
															}}
															textPosition="before"
															fullWidth={true}
														/>
													</div>
												</>
											)}
											{status === 'SUCCESS' && (
												<div>
													MENU METER CLAVE
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
						<div style={{ width: '100%' }}>
							<ClaveJusticiaStepper
								council={council}
								translate={translate}
								error={status === 'ERROR'}
								success={status === 'SUCCESS'}
								color={primary}
							/>
						</div>
					</div>
				</Card>
			</div>
		</NotLoggedLayout>
	);
};

export default withRouter(AccessClaveJusticia);
