import React from 'react';
import { Card } from 'material-ui';
import { BasicButton, TextInput, NotLoggedLayout } from '../../../displayComponents';
import { isMobile } from '../../../utils/screen';
import { getPrimary, getSecondary } from '../../../styles/colors';
import Resend2FAModal from './Resend2FAModal';

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


const SMSAuthForm = ({
	value, updateValue, send, translate, error
}) => {
	const [resendModal, setResendModal] = React.useState(false);

	return (
		<NotLoggedLayout
			translate={translate}
			helpIcon={true}
			languageSelector={false}
			styleFix={{ overflow: 'hidden', }}
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
					minWidth: window.innerWidth > 450 ? '550px' : '100%',
				}} elevation={6}>
					<div style={{
						...styles.loginContainerMax,
						height: '',
					}}>
						<div style={{
							width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1em 3em 1em 3em',
						}}>
							<div style={{
								width: '100%',
								paddingLeft: '4px',
							}}>
								<div style={{ textAlign: 'center', padding: '1em', paddingTop: '2em', }} >
									<h3 style={{ color: 'black', fontSize: '1.7em', }}>
Bienvenido, para acceder introduzca el código que se ha enviado a su teléfono {error.originalError.data ?
											`(terminado en ${error.originalError.data.phone})`
											: ''
										}
									</h3>
								</div>
								<div style={{ display: 'flex', justifyContent: 'center', }}>
									<div style={{ width: '280px', }}>
										<div style={{ textAlign: 'center', padding: '1em', }}>
											<TextInput
												styleFloatText={{ fontSize: '20px', color: getSecondary() }}
												floatingText={'Código recibido por SMS'}
												type="email"
												fullWidth
												onKeyUp={event => {
													if (event.keyCode === 13) {
														send();
													}
												}}
												errorText={error.message === 'Invalid key' ? 'Clave no válida' : ''}
												value={value}
												onChange={event => updateValue(event.target.value)}
											/>
										</div>
										<div style={{ textAlign: 'center', padding: '1em', paddingBottom: '1em' }}>
											<BasicButton
												text={'Validar'}
												onClick={send}
												color={getPrimary()}
												textStyle={{
													color: 'white',
													fontWeight: '700',
													borderRadius: '4px',
													boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)'
												}}
												textPosition="before"
												fullWidth={true}
											/>
										</div>
										<div style={{ textAlign: 'center', padding: '1em', paddingBottom: '2em' }}>
											<Resend2FAModal
												translate={translate}
												open={resendModal}
												requestClose={() => setResendModal(false)}
											/>
											<BasicButton
												text={'No he recibido ningún SMS'}
												color={'white'}
												textStyle={{
													color: getSecondary(),
													boxShadow: 'none'
												}}
												textPosition="before"
												fullWidth={true}
												onClick={() => setResendModal(true)}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Card>
			</div>
		</NotLoggedLayout>
	);
};

export default SMSAuthForm;
