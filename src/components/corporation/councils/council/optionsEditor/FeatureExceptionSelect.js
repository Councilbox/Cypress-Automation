
import React from 'react';
import gql from 'graphql-tag';
import { MenuItem } from 'material-ui';
import { withApollo } from 'react-apollo';
import { SelectInput } from '../../../../../displayComponents';


const FeatureExceptionSelect = ({ exception, companyId, refetch, client, featureName }) => {
	const addFeatureException = async value => {
		await client.mutate({
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
	};

	const updateFeatureExceptionValue = async (value, id) => {
		await client.mutate({
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
	};

	const removeFeatureException = async id => {
		await client.mutate({
			mutation: gql`
				mutation RemoveFeatureException($featureExceptionId: Int!) {
					removeFeatureException(featureExceptionId: $featureExceptionId) {
						success
					}
				}
			`,
			variables: {
				featureExceptionId: id,
			}
		});
	};

	return (
		<SelectInput
			id="company-feature-exception-select"
			style={{
				maxWidth: '20em'
			}}
			onChange={async event => {
				const { value } = event.target;
				if (value !== 'none') {
					if (!exception) {
						await addFeatureException(value === 'true');
					} else {
						await updateFeatureExceptionValue(value === 'true', exception.id);
					}
					refetch();
				} else if (exception) {
					await removeFeatureException(exception.id);
					refetch();
				}
			}}
			value={exception ? exception.active.toString() : 'none'}
		>
			<MenuItem value={'none'}>
				{exception ? 'Quitar' : 'Por defecto'}
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
