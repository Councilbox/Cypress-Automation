import { Card } from 'material-ui';
import React from 'react';
import { withApollo } from 'react-apollo';
import { SelectInput } from '../../../../displayComponents';
import { getPrimary } from '../../../../styles/colors';


const ServiceSelector = () => {
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
			>

			</SelectInput>
			<SelectInput
				floatingText="Servicio solicitado"
				styleLabel={{
					fontSize: '20px',
					fontWeight: '700'
				}}
				styles={{
					marginTop: '1em'
				}}
			>

			</SelectInput>
		</Card>
	);
};

export default withApollo(ServiceSelector);
