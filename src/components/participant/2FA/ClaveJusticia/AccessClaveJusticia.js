import React from 'react';
import { Card } from 'material-ui';
import { withRouter } from 'react-router';
import { BasicButton, NotLoggedLayout, DateTimePicker } from '../../../../displayComponents';
import { isMobile } from '../../../../utils/screen';
import { getPrimary } from '../../../../styles/colors';
import ClaveJusticiaStepper from './ClaveJusticiaStepper';
import { client } from '../../../../containers/App';
import AccessClaveJusticiaForm from './AccessClaveJusticiaForm';
import useClaveJusticia from '../../../../hooks/claveJusticia';
import { useSubdomain } from '../../../../utils/subdomain';


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

const AccessClaveJusticia = ({
	translate, council, match, sendKey, error
}) => {
	const primary = getPrimary();
	const {
		status,
		sendClaveJusticia,
		setExpirationDate,
		expirationDate,
		expirationDateError
	} = useClaveJusticia({ client, token: match.params.token });
	const subdomain = useSubdomain();

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
										Acceso {subdomain.title || 'Councilbox'}
									</h3>
								</div>
								<div style={{ display: 'flex', justifyContent: 'center' }}>
									<div style={{ width: '440px' }}>
										<div style={{
											textAlign: 'center',
											padding: '1em',
											border: '1px solid gainsboro',
											boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)'
										}}>
											{status === 'IDDLE' && (
												<>
													<div style={{ width: isMobile ? '95%' : '50%', marginTop: '1em' }}>
														<DateTimePicker
															format="L"
															label={translate.clave_pin_dni_expiration_date}
															errorText={expirationDateError}
															onlyDate
															style={{ width: '10em' }}
															onChange={date => {
																setExpirationDate(date);
															}}
															value={expirationDate}
														/>
													</div>
													<div
														style={{
															margin: '1em 0em'
														}}
													>
														Introduzca la Fecha de Validez de su DNI (o Fecha de Expedición si es un DNI Permanente)
														y solicite un PIN para acceder con Cl@ve Justicia
													</div>
													<div style={{ display: 'flex', alignItems: 'flex-end', marginTop: '0.6em' }}>
														<BasicButton
															text={translate.request_clave_pin_SMS}
															onClick={() => sendClaveJusticia('SMS')}
															backgroundColor={{
																color: primary,
																backgroundColor: 'white',
																border: '1px solid #154481',
																borderRadius: '4px',
																fontSize: '14px',
																marginRight: '5px',
																marginLeft: '5px',
																padding: '5px',
																minHeight: '24px',
																boxShadow: 'none'
															}}
															textPosition="before"
															fullWidth={true}
														/>
														<BasicButton
															text={translate.request_clave_pin_app}
															onClick={() => sendClaveJusticia('APP')}
															backgroundColor={{
																color: primary,
																backgroundColor: 'white',
																border: '1px solid #154481',
																borderRadius: '4px',
																fontSize: '14px',
																padding: '5px',
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
												<AccessClaveJusticiaForm
													sendKey={sendKey}
													resendClaveJusticia={sendClaveJusticia}
													translate={translate}
													error={error}
												/>
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
