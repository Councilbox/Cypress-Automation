import gql from 'graphql-tag';
import React from 'react';
import { withApollo } from 'react-apollo';
import { Grid, GridItem } from '../../../../../displayComponents';

const editableFeatures = {
	hideAbstentionButton: true,
	hideNoVoteButton: true,
	hideRecount: true,
	hideVotingButtons: true,
	participantsHeader: true,
	quickAccess: true,
	attendanceComment: true,
	attendanceConfirmation: true,
	roomAccessConvene: true
};


const CompanyFeaturesEditor = ({ client, companyId }) => {
	const [data, setData] = React.useState(null);
	const [loading, setLoading] = React.useState(true);


	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: gql`
				query Features($companyId: Int!) {
					features {
						id
						name
						active
						value
					}
					companyFeatureExceptions(companyId: $companyId) {
						id
						featureName
						companyId
						active
					}
				}
			`,
			variables: {
				companyId
			}
		});

		console.log(response);
		setData(response.data);
		setLoading(false);
	}, [companyId]);

	React.useEffect(() => {
		getData();
	}, [getData]);

	return (
		<Grid style={{ overflow: 'hidden' }}>
			<GridItem xs={12} md={7} lg={7}>
				Features {companyId}
				{loading ?
					null
					:
					data.features.filter(feature => editableFeatures[feature.name]).map(feature => (
						<div key={feature.id}>
							{feature.name}
						</div>
					))
				}

			</GridItem>
		</Grid>
	);
};

export default withApollo(CompanyFeaturesEditor);
