/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';
import React from 'react';

export const useHandleParticipantDelegations = ({ client }) => {
	const [loading, setLoading] = React.useState(false);

	const removeDelegations = async participantIds => {
		setLoading(true);

		await client.mutate({
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
		setLoading(false);
	};

	const addDelegations = async (participantIds, newDelegateId) => {
		setLoading(true);

		await client.mutate({
			mutation: gql`
				mutation AddDelegations($participantIds: [ID]!, $newDelegateId: ID!) {
					addDelegations(participantIds: $participantIds, newDelegateId: $newDelegateId) {
						success
						message
					}
				}
			`,
			variables: {
				participantIds,
				newDelegateId
			}
		});
		setLoading(false);
	};

	return {
		loading,
		removeDelegations,
		addDelegations
	};
};
