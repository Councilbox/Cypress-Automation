import gql from 'graphql-tag';
import { Card, MenuItem } from 'material-ui';
import React from 'react';
import { withApollo } from 'react-apollo';
import { SelectInput } from '../../../../displayComponents';
import { getPrimary } from '../../../../styles/colors';


const ServiceSelector = ({ appointment, setState, entities, client, translate }) => {
	const [services, setServices] = React.useState(null);

	const getData = React.useCallback(async () => {
		if (appointment.companyId) {
			const response = await client.query({
				query: gql`
					query OvacCompanyServices($companyId: ID!){
						ovacCompanyServices(companyId: $companyId) {
							id
							title
						}
					}
				`,
				variables: {
					companyId: appointment.companyId
				}
			});
			setServices(response.data.ovacCompanyServices);
			setState({
				statuteId: response.data?.ovacCompanyServices[0]?.id,
				name: response.data?.ovacCompanyServices[0]?.title
			});
		}
	}, [appointment.companyId]);

	React.useEffect(() => {
		getData();
	}, [getData]);

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
				disabled={entities.length <= 1}
				floatingText="Centro"
				styleLabel={{
					fontSize: '20px',
					fontWeight: '700',
					color: primary
				}}
				value={appointment.companyId}
				onChange={event => {
					setState({
						companyId: event.target.value
					});
				}}
			>
				{entities.map(entity => (
					<MenuItem value={entity.id} key={entity.id}>
						{entity.businessName}
					</MenuItem>
				))}
			</SelectInput>
			<SelectInput
				floatingText={translate.selected_service}
				styleLabel={{
					fontSize: '20px',
					fontWeight: '700',
					color: primary
				}}
				value={`${appointment.statuteId}|${appointment.name}`}
				styles={{
					marginTop: '1em'
				}}
				onChange={event => {
					setState({
						statuteId: +(event.target.value.split('|')[0]),
						name: event.target.value.split('|')[1],
					});
				}}
			>
				{services && services.map(service => (
					<MenuItem
						value={`${service.id}|${service.title}`}
						key={service.id}
					>
						{service.title}
					</MenuItem>
				))}
			</SelectInput>
		</Card>
	);
};

export default withApollo(ServiceSelector);
