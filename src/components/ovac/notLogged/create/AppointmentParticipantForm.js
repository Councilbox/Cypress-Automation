import { Card } from 'material-ui';
import React from 'react';
import { Checkbox } from '../../../../displayComponents';
import TextInput from '../../UI/TextInput';
import withTranslations from '../../../../HOCs/withTranslations';
import LegalModal from './LegalModal';
import { getPrimary } from '../../../../styles/colors';

const labelStyle = {
	fontSize: '20px',
	fontWeight: '500'
};

const AppointmentParticipantForm = ({ translate, participant, appointment, setState, setLegalTerms, errors }) => {
	const [modal, setModal] = React.useState(false);
	const primary = getPrimary();

	return (
		<Card
			elevation={4}
			style={{
				height: '100%',
				flexGrow: 1,
				flexDirection: 'column',
				display: 'flex',
				justifyContent: 'space-between',
				border: '1px solid silver',
				padding: '2em'
			}}
		>
			<LegalModal
				open={modal}
				translate={translate}
				action={() => {
					setLegalTerms(true);
					setModal(false);
				}}
				requestClose={() => setModal(false)}
			/>
			<TextInput
				floatingText={translate.name}
				styleFloatText={labelStyle}
				value={participant.name}
				errorText={errors.name}
				required
				onChange={event => {
					setState({
						name: event.target.value
					});
				}}
			/>
			<TextInput
				floatingText={translate.surname}
				styleFloatText={labelStyle}
				errorText={errors.surname}
				required
				value={participant.surname}
				onChange={event => {
					setState({
						surname: event.target.value
					});
				}}
			/>
			<TextInput
				floatingText={translate.dni}
				styleFloatText={labelStyle}
				errorText={errors.dni}
				required
				value={participant.dni}
				onChange={event => {
					setState({
						dni: event.target.value
					});
				}}
			/>
			<div
				style={{
					display: 'flex'
				}}
			>
				<div
					style={{
						maxWidth: '8em',
						marginRight: '1em'
					}}
				>
					<TextInput
						floatingText={translate.phone_country_code}
						styleFloatText={labelStyle}
						errorText={errors.phoneCountryCode}
						startAdornment={'+'}
						required
						value={participant.phoneCountryCode}
						onChange={event => {
							const clean = event.target.value.replace(/[^0-9]/g, '');
							if (Number.isNaN(+clean) || +event.target.value === 0) {
								return setState({
									phoneCountryCode: ''
								});
							}
							setState({
								phoneCountryCode: +clean
							});
						}}
					/>
				</div>
				<TextInput
					floatingText={translate.phone}
					styleFloatText={labelStyle}
					errorText={errors.phone}
					required
					value={participant.phone}
					onChange={event => {
						const clean = event.target.value.replace(/[^0-9]/g, '');
						if (Number.isNaN(+clean) || +event.target.value === 0) {
							return setState({
								phone: ''
							});
						}
						setState({
							phone: +clean
						});
					}}
				/>
			</div>
			<TextInput
				floatingText={translate.email}
				errorText={errors.email}
				styleFloatText={labelStyle}
				required
				value={participant.email}
				onChange={event => {
					setState({
						email: event.target.value
					});
				}}
			/>
			<div>
				<div style={{ color: primary, fontWeight: '700', fontSize: '15px' }}>{translate.privacy}</div>
				<div onClick={() => {
					setModal(true);
					setLegalTerms(false);
				}}>
					<Checkbox
						value={appointment.acceptedLegal}
						onChange={() => {}}
						label={translate.appointment_legal_check_label}
					/>
					{errors.acceptedLegal &&
						<span style={{ color: 'red' }}>{errors.acceptedLegal}</span>
					}
				</div>
			</div>
		</Card>
	);
};

export default withTranslations()(AppointmentParticipantForm);
