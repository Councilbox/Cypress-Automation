import React from 'react';
import { withApollo } from 'react-apollo';
import { AlertConfirm, BasicButton, DateTimePicker } from '../../../../displayComponents';
import useClaveJusticia from '../../../../hooks/claveJusticia';
import { getPrimary } from '../../../../styles/colors';


const SendClaveJusticiaModal = ({ participantId, open, client, requestClose, successCB }) => {
	const {
		status,
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
			title={'Enviar clave justicia'}
			bodyText={
				<>
					<DateTimePicker
						format={'DD-MM-yyyy'}
						floatingText={'Fecha validez/Nº soporte'}
						errorText={expirationDateError}
						onlyDate
						style={{ width: '10em' }}
						onChange={date => {
							setExpirationDate(date);
						}}
						value={expirationDate}
					/>
					<div style={{ display: 'flex', alignItems: 'flex-end', marginTop: '1.3em' }}>
						<BasicButton
							text={'Solicitar PIN vía SMS'}
							onClick={() => {
								const response = sendClaveJusticia('SMS');
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
							text={'Solicitar PIN vía APP'}
							onClick={() => {
								const response = sendClaveJusticia('SMS');
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
				</>
			}
		/>
	);
};

export default withApollo(SendClaveJusticiaModal);
