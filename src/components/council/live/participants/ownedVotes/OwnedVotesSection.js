import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import RemoveDelegationButton from '../RemoveDelegationButton';
import { ParticipantBlock } from '../LiveParticipantEditor';
import { Grid, LoadingSection } from '../../../../../displayComponents';
import { PARTICIPANT_STATES } from '../../../../../constants';
import OwnedVotesModal from './OwnedVotesModal';


const OwnedVotesSection = ({ votes, participant, translate, client }) => {
	const [data, setData] = React.useState(null);
	const [modal, setModal] = React.useState(false);
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
		return <LoadingSection />;
	}

	return (
		<>
			{(data.participantOwnedVotes && data.participantOwnedVotes.list.length > 0)
			&&
				<>
					<OwnedVotesModal
						open={modal}
						translate={translate}
						requestClose={() => setModal(false)}
						participant={participant}
					/>
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
					<Grid
						style={{
							marginBottom: '1em',
							display: 'flex',
							cursor: 'pointer',
							alignItems: 'center',
							boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)',
							border: 'solid 1px #61abb7',
							borderRadius: '4px',
							padding: '1em',
							contentVisibility: 'auto',
							marginTop: '1em',
							justifyContent: 'space-between'
						}}
						onClick={() => setModal(true)}
					>
						{data.participantOwnedVotes.total > 15 &&
						`${data.participantOwnedVotes.total - 15} votos más - Pulse para ver todos los votos`}
					</Grid>
				</>
			}
		</>
	);
};

export default withApollo(OwnedVotesSection);
