import React from 'react';
import { BasicButton, TextInput } from '../../../../displayComponents';
import { getPrimary } from '../../../../styles/colors';


const CheckClaveJusticiaForm = ({ sendKey, error, loading }) => {
	const [firstChar, setFirstChar] = React.useState('');
	const [secondChar, setSecondChar] = React.useState('');
	const [thirdChar, setThirdChar] = React.useState('');
	const primary = getPrimary();

	const fullKey = `${firstChar}${secondChar}${thirdChar}`;
	const disabled = fullKey.length !== 3;
	const color = error ? 'red' : primary;

	return (
		<>
			<div>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<TextInput
						id="first-pin-char"
						stylesTextField={{ border: `1px solid ${color}`, borderRadius: '8px', marginTop: '5px' }}
						styles={{ marginRight: '12px', width: '3.5em' }}
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
						stylesTextField={{ border: `1px solid ${color}`, borderRadius: '8px', marginTop: '5px' }}
						styles={{ marginRight: '12px', width: '3.5em' }}
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
						stylesTextField={{ border: `1px solid ${color}`, borderRadius: '8px', marginTop: '5px' }}
						styles={{ marginRight: '12px', width: '3.5em' }}
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
					<div style={{ height: '3em' }}>
						<BasicButton
							text={'Validar'}
							loading={loading}
							color={disabled ? 'grey' : getPrimary()}
							onClick={() => sendKey(fullKey)}
							buttonStyle={{
								fontWeight: '700',
								borderRadius: '4px',
								color: 'white',
								padding: '4px'
							}}
							textPosition="before"
							fullWidth={true}
							disabled={disabled}
						/>
					</div>
				</div>
				<div style={{ fontSize: '10px', color, marginTop: '-5px' }}>
					{error ?
						'Clave justicia inválida'
						:
						'Clave justicia'
					}
				</div>
			</div>
		</>
	);
};

export default CheckClaveJusticiaForm;
