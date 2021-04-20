import React from 'react';
import { withApollo } from 'react-apollo';
import { AlertConfirm, BasicButton } from '../../../../displayComponents';
import useClaveJusticia from '../../../../hooks/claveJusticia';
import { getPrimary } from '../../../../styles/colors';
import ClaveJusticiaPicker from './ClaveJusticiaPicker';


const SendClaveJusticiaModal = React.memo(({ participantId, open, client, requestClose, successCB, translate }) => {
	const {
		sendClaveJusticia,
		setExpirationDate,
		expirationDate,
		expirationDateError
	} = useClaveJusticia({ client, participantId });
	const primary = getPrimary();

	return (
		<AlertConfirm
			open={open}
			requestClose={requestClose}
			title={translate.send_clave_pin}
			bodyText={
				<div style={{
					maxWidth: '600px'
				}}>
					<ClaveJusticiaPicker
						onChange={date => {
							setExpirationDate(date);
						}}
						error={expirationDateError}
						date={expirationDate}
					/>
					<div
						style={{
							margin: '1em 0em'
						}}
					>
						Introduzca la Fecha de Validez de su DNI (o Fecha de Expedición si es un DNI Permanente)
						y solicite un PIN para acceder con Cl@ve Justicia
					</div>
					<div style={{ display: 'flex', alignItems: 'flex-end', marginTop: '1.3em' }}>
						<BasicButton
							text={translate.request_clave_pin_SMS}
							onClick={async () => {
								const response = await sendClaveJusticia('SMS');
								if (response) {
									successCB();
								}
							}}
							backgroundColor={{
								color: primary,
								backgroundColor: 'white',
								border: `1px solid ${primary}`,
								borderRadius: '4px',
								fontSize: '14px',
								marginRight: '5px',
								marginLeft: '5px',
								padding: '3px',
								minHeight: '24px',
								boxShadow: 'none'
							}}
							textPosition="before"
							fullWidth={true}
						/>
						<BasicButton
							text={translate.request_clave_pin_app}
							onClick={async () => {
								const response = await sendClaveJusticia('APP');
								if (response) {
									successCB();
								}
							}}
							backgroundColor={{
								color: primary,
								backgroundColor: 'white',
								border: `1px solid ${primary}`,
								borderRadius: '4px',
								fontSize: '14px',
								padding: '3px',
								minHeight: '24px',
								boxShadow: 'none'
							}}
							textPosition="before"
							fullWidth={true}
						/>
					</div>
				</div>
			}
		/>
	);
}, (props, nextProps) => {
	if (props.open !== nextProps.open) {
		return false;
	}

	if (props.participantId !== nextProps.participantId) {
		return false;
	}

	return true;
});

export default withApollo(SendClaveJusticiaModal);
