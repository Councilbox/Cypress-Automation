import { withApollo } from '@apollo/react-hoc';
import React from 'react';
import RemoveDelegationButton from './RemoveDelegationButton';
import { ParticipantBlock } from './LiveParticipantEditor';
import gql from 'graphql-tag';
import { Grid, LoadingSection } from '../../../../displayComponents';
import { PARTICIPANT_STATES } from '../../../../constants';


const OwnedVotesModal = ({ votes, participant, translate, client }) => {
	const [data, setData] = React.useState(null);
	const [loading, setLoading] = React.useState(true);

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: gql`
				query participantOwnedVotes(
					$participantId: Int!
					$filters: [FilterInput]
					$options: OptionsInput
				) {
					participantOwnedVotes(
						participantId: $participantId
						filters: $filters
						options: $options
					) {
						list {
							id
							name
							surname
							state
						}
						total
					}
				}
			`,
			variables: {
				participantId: participant.id,
				options: {
					limit: 15,
					offset: 0
				}
			}
		});

		setData(response.data);
		setLoading(false);
	}, [participant.id]);

	React.useEffect(() => {
		getData();
	}, [getData]);

	if (loading) {
		return <LoadingSection />
	}

	return (
		<>
			{(data.participantOwnedVotes && data.participantOwnedVotes.list.length > 0)
			&&
				<>
					{data.participantOwnedVotes.list.map((delegatedVote, index) => (
						<ParticipantBlock
							key={`participantBlock_deletedVoted_${index}`}
							active={false}
							participant={delegatedVote}
							translate={translate}
							action={
								delegatedVote.state === PARTICIPANT_STATES.DELEGATED &&
									<RemoveDelegationButton
										delegatedVote={delegatedVote}
										participant={participant}
										translate={translate}
										refetch={getData}
									/>
							}
							data={data}
							type={delegatedVote.state === PARTICIPANT_STATES.DELEGATED ? 3 : 5}
						/>
					))}
					<Grid style={{
						marginBottom: '1em',
						display: 'flex',
						alignItems: 'center',
						boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)',
						border: 'solid 1px #61abb7',
						borderRadius: '4px',
						padding: '1em',
						contentVisibility: 'auto',
						marginTop: '1em',
						justifyContent: 'space-between'
					}}>
						{data.participantOwnedVotes.total > 15 &&
						`${data.participantOwnedVotes.total - 15} más - Pulse para ver todos los votos`}
					</Grid>
				</>
			}
		</>
	);
};

export default withApollo(OwnedVotesModal);
