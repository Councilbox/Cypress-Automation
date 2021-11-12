import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { BasicButton } from '../../../displayComponents';
import { getSecondary } from '../../../styles/colors';
import { changeParticipantState } from '../../../queries/liveParticipant';

const setMainRepresentative = gql`
	mutation setMainRepresentative($participantId: Int!, $representativeId: Int!){
		setMainRepresentative(participantId: $participantId, representativeId: $representativeId){
			success
		}
	}
`;


const RemoveDelegationAndEnter = ({
	participant, represented, client, refetch, translate
}) => {
	const [loading, setLoading] = React.useState(false);
	const secondary = getSecondary();

	const setRepresentativeAsVoteOwner = async () => {
		setLoading(true);

		await Promise.all(represented.map(repre => (
			client.mutate({
				mutation: setMainRepresentative,
				variables: {
					participantId: repre.id,
					representativeId: participant.id
				}
			})
		)));

		await refetch();
		setLoading(false);
	};

	const removeDelegation = async () => {
		setLoading(true);
		await client.mutate({
			mutation: changeParticipantState,
			variables: {
				participantId: participant.id,
				state: 6
			}
		});
		await refetch();
		setLoading(false);
	};

	// TRADUCCION
	return (
		<BasicButton
			text={translate.remove_delegation_and_enter}
			textStyle={{
				color: secondary
			}}
			buttonStyle={{
				color: 'white',
				border: `1px solid ${secondary}`,
				paddingTop: '5px'
			}}
			type="flat"
			loading={loading}
			loadingColor={secondary}
			onClick={(represented && represented.length > 0) ? setRepresentativeAsVoteOwner : removeDelegation}
		/>
	);
};

export default withApollo(RemoveDelegationAndEnter);
