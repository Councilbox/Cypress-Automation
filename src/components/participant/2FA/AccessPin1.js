import React from 'react';
import { Card } from 'material-ui';
import { BasicButton, TextInput, NotLoggedLayout, HelpPopover } from '../../../displayComponents';
import { isMobile } from '../../../utils/screen';
import { getPrimary, getSecondary } from '../../../styles/colors';
import Resend2FAModal from './Resend2FAModal';
import SMSStepper from '../../../components/participant/login/SMSAccess/SMSStepper';


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


const AccessPin1 = ({
	value, updateValue, send, translate, error, council
}) => {
	const [resendModal, setResendModal] = React.useState(false);

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
									<h3 style={{ color: '#154481', fontSize: '2em' }}>
										Acceso Evid
									</h3>
								</div>
								<div style={{ display: 'flex', justifyContent: 'center' }}>
									<div style={{ width: '440px' }}>
										<div style={{ textAlign: 'center', padding: '1em', border: "1px solid gainsboro" }}>
											<div style={{ width: "50%" }}>
												<TextInput
													styleFloatText={{ fontSize: '20px', color: getSecondary() }}
													floatingText={'NIF/NIE'}
													type="email"
													fullWidth
													styleFloatText={{ color: '#154481', }}
													// onKeyUp={event => {
													// 	if (event.keyCode === 13) {
													// 		send();
													// 	}
													// }}
													// errorText={error.message === 'Invalid key' ? 'Clave no válida' : ''}
													value={value}
													onChange={event => updateValue(event.target.value)}
												/>
											</div>
											<div style={{ width: "50%" }}>
												<TextInput
													styleFloatText={{ fontSize: '20px', color: getSecondary() }}
													floatingText={'Fecha validez/Nº soporte '}
													helpPopover={true}
													helpTitle={'titulo'}
													helpDescription={'descripcion'}
													colorHelp={"#80a5b7"}
													type="text"
													fullWidth
													styleFloatText={{ color: '#154481' }}
													// onKeyUp={event => {
													// 	if (event.keyCode === 13) {
													// 		send();
													// 	}
													// }}
													// errorText={error.message === 'Invalid key' ? 'Clave no válida' : ''}
													value={value}
													onChange={event => updateValue(event.target.value)}
												/>
											</div>
											<div style={{ display: "flex", alignItems: "flex-end" }}>
												<TextInput
													stylesTextField={{ marginBottom: "0px" }}
													styleFloatText={{ fontSize: '20px', color: getSecondary() }}
													floatingText={'Clave Pin'}
													helpPopover={true}
													helpTitle={'titulo'}
													helpDescription={'descripcion'}
													colorHelp={"#80a5b7"}
													type="text"
													fullWidth
													styleFloatText={{ color: '#154481' }}
													// onKeyUp={event => {
													// 	if (event.keyCode === 13) {
													// 		send();
													// 	}
													// }}
													// errorText={error.message === 'Invalid key' ? 'Clave no válida' : ''}
													value={value}
													onChange={event => updateValue(event.target.value)}
												/>
												<BasicButton
													text={'Solicitar PIN vía SMS'}
													onClick={send}
													backgroundColor={{
														color: '#154481',
														backgroundColor: "white",
														border: "1px solid #154481",
														borderRadius: "4px",
														fontSize: '11px',
														marginRight: "5px",
														marginLeft: "5px",
														padding: '0',
														minHeight: '24px',
														boxShadow: "none"
													}}
													textPosition="before"
													fullWidth={true}
												/>
												<BasicButton
													text={'Solicitar PIN vía APP'}
													onClick={send}
													backgroundColor={{
														color: '#154481',
														backgroundColor: "white",
														border: "1px solid #154481",
														borderRadius: "4px",
														fontSize: '11px',
														padding: '0',
														minHeight: '24px',
														boxShadow: "none"
													}}
													textPosition="before"
													fullWidth={true}
												/>
											</div>
											<div style={{ textAlign: 'center', padding: '1em 0em', }}>
												<BasicButton
													text={'Acceder'}
													onClick={send}
													backgroundColor={{
														fontWeight: '700',
														borderRadius: '4px',
														boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)',
														color: 'white',
														backgroundColor: "#154481",
													}}
													textPosition="before"
													fullWidth={true}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
							<div style={{ width: '100%' }}>
								<SMSStepper
									council={council}
									translate={translate}
									addClass={'Blue'}
									// responseSMS={responseSMS}
									// resendKey={sendParticipantRoomKey}
									error={error}
									color={"#154481"}
								/>
							</div>
					</div>
				</Card>
			</div>
		</NotLoggedLayout>
	);
};

export default AccessPin1;
