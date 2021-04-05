import { Card } from 'material-ui';
import React from 'react';
import { Checkbox, TextInput } from '../../../../displayComponents';
import withTranslations from '../../../../HOCs/withTranslations';


const labelStyle = {
	fontSize: '20px',
	fontWeight: '500'
};

const AppointmentParticipantForm = ({ translate, participant, setState }) => {
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
			<TextInput
				floatingText={translate.name}
				styleFloatText={labelStyle}
				onChange={event => {
					setState({
						name: event.target.value
					});
				}}
			/>
			<TextInput
				floatingText={translate.surname}
				styleFloatText={labelStyle}
				onChange={event => {
					setState({
						surname: event.target.value
					});
				}}
			/>
			<TextInput
				floatingText={translate.dni}
				styleFloatText={labelStyle}
				onChange={event => {
					setState({
						dni: event.target.value
					});
				}}
			/>
			<TextInput
				floatingText={translate.phone}
				styleFloatText={labelStyle}
				onChange={event => {
					setState({
						phone: event.target.value
					});
				}}
			/>
			<TextInput
				floatingText={translate.email}
				styleFloatText={labelStyle}
				onChange={event => {
					setState({
						email: event.target.value
					});
				}}
			/>
			<Checkbox
				label={'El ciudadano da su consentimiento para que el resultado de la asistencia prestada en la cita previa sea tratada por este organismo'}
			/>
		</Card>
	);
};

export default withTranslations()(AppointmentParticipantForm);
