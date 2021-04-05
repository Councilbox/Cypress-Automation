import { Card, MenuItem } from 'material-ui';
import React from 'react';
import { withApollo } from 'react-apollo';
import { SelectInput } from '../../../../displayComponents';
import { getPrimary } from '../../../../styles/colors';


const ServiceSelector = ({ appointment, setState }) => {
	const primary = getPrimary();

	return (
		<Card
			elevation={4}
			style={{
				padding: '2em',
				border: `1px solid ${primary}`,
				backgroundColor: 'rgba(187, 210, 241, 0.14)'
			}}
		>
			<SelectInput
				floatingText="Centro"
				styleLabel={{
					fontSize: '20px',
					fontWeight: '700'
				}}
				value={appointment.companyId}
				onChange={event => {
					setState({
						companyId: event.target.value
					});
				}}
			>
				<MenuItem value={1054}>OVAC-DEMO</MenuItem>
			</SelectInput>
			<SelectInput
				floatingText="Servicio solicitado"
				styleLabel={{
					fontSize: '20px',
					fontWeight: '700'
				}}
				value={appointment.statuteId}
				styles={{
					marginTop: '1em'
				}}
				onChange={event => {
					setState({
						statuteId: event.target.value
					});
				}}
			>
				<MenuItem value={2486}>DEMO</MenuItem>
			</SelectInput>
		</Card>
	);
};

export default withApollo(ServiceSelector);
