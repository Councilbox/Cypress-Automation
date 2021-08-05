
import React from 'react';
import { MenuItem } from 'material-ui';
import { withApollo } from 'react-apollo';
import { SelectInput } from '../../../../../displayComponents';
import gql from 'graphql-tag';


const FeatureExceptionSelect = ({ exception, companyId, refetch, client, featureName }) => {

	const addFeatureException = async value => {
		const response = await client.mutate({
			mutation: gql`
				mutation AddFeatureException($companyId: Int!, $active: Boolean!, $featureName: String!) {
					addFeatureException(companyId: $companyId, active: $active, featureName: $featureName) {
						success
					}
				}
			`,
			variables: {
				featureName,
				companyId,
				active: value
			}
		});

		console.log(response);
	};

	const updateFeatureExceptionValue = async (value, id) => {
		const response = await client.mutate({
			mutation: gql`
				mutation UpdateFeatureException($featureExceptionId: Int!, $active: Boolean!) {
					updateFeatureException(featureExceptionId: $featureExceptionId, active: $active) {
						success
					}
				}
			`,
			variables: {
				featureExceptionId: id,
				active: value
			}
		});

		console.log(response);
	};

	return (
		<SelectInput
			floatingText={'Valor fijado'}
			id="company-feature-exception-select"
			onChange={async event => {
				const { value } = event.target;
				if (value !== 'none') {
					if (!exception) {
						await addFeatureException(value === 'true');
					} else {
						await updateFeatureExceptionValue(value === 'true', exception.id);
					}
					refetch();
				}
			}}
			value={exception ? exception.active.toString() : 'none'}
		>
			<MenuItem value={'none'}>
				{exception ? 'Quitar' : 'No hay valor fijado'}
			</MenuItem>
			<MenuItem value="true">
				Activada
			</MenuItem>
			<MenuItem value="false">
				Desactivada
			</MenuItem>
		</SelectInput>
	);
};

export default withApollo(FeatureExceptionSelect);
