import React from 'react';
import { BasicButton, TextInput } from '../../../../displayComponents';
import { getPrimary, getSecondary } from '../../../../styles/colors';


const AccessClaveJusticiaForm = ({ sendKey, error, translate, resendClaveJusticia }) => {
	const [resendSuccess, setResentSuccess] = React.useState(false);
	const [loading, setLoading] = React.useState(null);
	const [firstChar, setFirstChar] = React.useState('');
	const [secondChar, setSecondChar] = React.useState('');
	const [thirdChar, setThirdChar] = React.useState('');
	const secondary = getSecondary();

	const fullKey = `${firstChar}${secondChar}${thirdChar}`;
	const disabled = fullKey.length !== 3;


	const resendClave = async type => {
		setLoading(type);
		const response = await resendClaveJusticia(type);
		setLoading(false);
		setResentSuccess(response);
	};

	return (
		<>
			<div style={{ width: '50%', marginBottom: '.5em' }}>
				<div style={{ display: 'flex', color: '#154481' }}>
					Clave PIN
				</div>
			</div>
			<div style={{ display: 'flex' }}>
				<TextInput
					id="first-pin-char"
					stylesTextField={{ border: `1px solid ${secondary}`, borderRadius: '8px', marginTop: '5px' }}
					styles={{ marginRight: '12px' }}
					styleInInput={{ textAlign: 'center', margin: '2px ​0px', fontWeight: 'bold' }}
					labelNone={true}
					disableUnderline={true}
					value={firstChar}
					onChange={event => {
						if (/^[a-z0-9]$/i.test(event.target.value)) {
							setFirstChar(event.target.value.toUpperCase());
							document.getElementById('second-pin-char').focus();
						} else {
							setFirstChar('');
						}
					}}
				/>
				<TextInput
					id="second-pin-char"
					stylesTextField={{ border: `1px solid ${secondary}`, borderRadius: '8px', marginTop: '5px' }}
					styles={{ marginRight: '12px' }}
					styleInInput={{ textAlign: 'center', margin: '4px ​0px', fontWeight: 'bold' }}
					labelNone={true}
					disableUnderline={true}
					value={secondChar}
					onKeyUp={event => {
						if (event.keyCode === 8) {
							document.getElementById('first-pin-char').focus();
						}
					}}
					onChange={event => {
						if (/^[a-z0-9]$/i.test(event.target.value)) {
							setSecondChar(event.target.value.toUpperCase());
							document.getElementById('third-pin-char').focus();
						} else {
							setSecondChar('');
						}
					}}
				/>
				<TextInput
					id="third-pin-char"
					stylesTextField={{ border: `1px solid ${secondary}`, borderRadius: '8px', marginTop: '5px' }}
					styles={{ marginRight: '12px' }}
					styleInInput={{ textAlign: 'center', margin: '2px ​0px', fontWeight: 'bold' }}
					labelNone={true}
					disableUnderline={true}
					onKeyUp={event => {
						if (event.keyCode === 8) {
							document.getElementById('second-pin-char').focus();
						}
					}}
					value={thirdChar}
					onChange={event => {
						if (/^[a-z0-9]$/i.test(event.target.value)) {
							setThirdChar(event.target.value.toUpperCase());
						} else {
							setThirdChar('');
						}
					}}
				/>
			</div>
			<div>
				<BasicButton
					text={translate.access}
					color={disabled ? 'grey' : getPrimary()}
					onClick={() => sendKey(fullKey)}
					backgroundColor={{
						fontWeight: '700',
						borderRadius: '4px',
						boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)',
						color: 'white'
						// opacity: '0.4'
					}}
					textPosition="before"
					fullWidth={true}
					disabled={disabled}
				/>
				{error.message === 'Invalid cl@ve pin' &&
					<div style={{ color: 'red', fontWeight: '700' }}>
						{translate.invalid_clave_pin}
					</div>
				}
			</div>
			<div style={{
				display: 'flex',
				justifyContent: 'space-between',
				marginBottom: '3em',
				marginTop: '1em',
				width: '100%'
			}}>
				<BasicButton
					text={translate.resend_clave_pin_SMS}
					loading={loading === 'SMS'}
					loadingColor={secondary}
					onClick={() => resendClave('SMS')}
					backgroundColor={{
						color: secondary,
						backgroundColor: 'white',
						border: `1px solid ${secondary}`,
						borderRadius: '4px',
						fontSize: '13px',
						padding: '0',
						minHeight: '28px',
						boxShadow: 'none',
						width: '48%'
					}}
					textPosition="before"
					fullWidth={true}
				/>
				<BasicButton
					text={translate.resend_clave_pin_app}
					loading={loading === 'APP'}
					loadingColor={secondary}
					onClick={() => resendClave('APP')}
					backgroundColor={{
						color: secondary,
						backgroundColor: 'white',
						border: `1px solid ${secondary}`,
						borderRadius: '4px',
						fontSize: '13px',
						padding: '0',
						minHeight: '28px',
						boxShadow: 'none',
						width: '48%'
					}}
					textPosition="before"
					fullWidth={true}
				/>
			</div>
			{resendSuccess &&
				<div style={{ color: 'green', fontSize: '1.1em', fontWeight: '700' }}>
					<i className="fa fa-check" aria-hidden="true" style={{ marginRight: '0.2em' }}></i>
					Reenviado
				</div>
			}
		</>
	);
};

export default AccessClaveJusticiaForm;
