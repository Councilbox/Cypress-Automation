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
				onChange={event => {
					setState({
						dni: event.target.value
					});
				}}
			/>
			<TextInput
				floatingText={translate.phone}
				styleFloatText={labelStyle}
				errorText={errors.phone}
				required
				onChange={event => {
					setState({
						phone: event.target.value
					});
				}}
			/>
			<TextInput
				floatingText={translate.email}
				errorText={errors.email}
				styleFloatText={labelStyle}
				required
				onChange={event => {
					setState({
						email: event.target.value
					});
				}}
			/>
			<div>
				<div style={{ color: primary, fontWeight: '700', fontSize: '15px' }}>Privacidad</div>
				<div onClick={() => {
					setModal(true);
					setLegalTerms(false);
				}}>
					<Checkbox
						value={appointment.acceptedLegal}
						onChange={() => {}}
						label={'El ciudadano da su consentimiento para que el resultado de la asistencia prestada en la cita previa sea tratada por este organismo'}
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
