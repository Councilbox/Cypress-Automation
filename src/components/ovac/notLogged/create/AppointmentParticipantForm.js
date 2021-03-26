import { Card } from 'material-ui';
import React from 'react';
import { TextInput } from '../../../../displayComponents';
import withTranslations from '../../../../HOCs/withTranslations';


const labelStyle = {
	fontSize: '20px',
	fontWeight: '500'
}

const AppointmentParticipantForm = ({ translate }) => {
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
			/>
			<TextInput
				floatingText={translate.surname}
				styleFloatText={labelStyle}
			/>
			<TextInput
				floatingText={translate.dni}
				styleFloatText={labelStyle}
			/>
			<TextInput
				floatingText={translate.phone}
				styleFloatText={labelStyle}
			/>
			<TextInput
				floatingText={translate.email}
				styleFloatText={labelStyle}
			/>
		</Card>
	);
};

export default withTranslations()(AppointmentParticipantForm);
