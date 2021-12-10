/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';
import React from 'react';

export const useRemoveDelegations = ({ client }) => {
	const [loading, setLoading] = React.useState(false);

	const removeDelegations = async participantIds => {
		setLoading(true);

		const response = await client.mutate({
			mutation: gql`
				mutation RemoveDelegations($participantIds: [ID]!) {
					removeDelegations(participantIds: $participantIds) {
						success
						message
					}
				}
			`,
			variables: {
				participantIds
			}
		});

		console.log(response);


		setLoading(false);
	};

	return {
		loading,
		removeDelegations
	};
};
