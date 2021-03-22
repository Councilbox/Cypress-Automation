import React from 'react';
import { withApollo } from 'react-apollo';
import { AlertConfirm, BasicButton, DateTimePicker } from '../../../../displayComponents';
import useClaveJusticia from '../../../../hooks/claveJusticia';
import { getPrimary } from '../../../../styles/colors';


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
			title={'Enviar clave justicia'}
			bodyText={
				<>
					<DateTimePicker
						format={'DD-MM-yyyy'}
						floatingText={translate.clave_pin_dni_expiration_date}
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
								const response = await sendClaveJusticia('SMS');
								console.log(response);
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
