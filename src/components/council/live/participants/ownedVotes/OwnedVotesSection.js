import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import RemoveDelegationButton from '../RemoveDelegationButton';
import { ParticipantBlock } from '../LiveParticipantEditor';
import { Grid, LoadingSection } from '../../../../../displayComponents';
import { PARTICIPANT_STATES } from '../../../../../constants';
import OwnedVotesModal from './OwnedVotesModal';
import OwnedVotesRecountSection from './OwnedVotesRecountSection';

const OwnedVotesSection = ({ participant, translate, client, council, ...props }) => {
	const [data, setData] = React.useState(null);
	const [modal, setModal] = React.useState(false);
	const [loading, setLoading] = React.useState(true);


	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: gql`
				query ParticipantOwnedVotesLimited(
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
						meta
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
		if (!response.errors) {
			setData(response.data);
			props.data.refetch();
			props.updateState({ isOwnedVotes: false, isDelegateVotes: false });
			setLoading(false);
		}
	}, [participant.id]);

	const remove = () => {
		getData();
		props.updateState({ isOwnedVotes: false, isDelegateVotes: true });
	};


	React.useEffect(() => {
		if (client) {
			getData();
		}
	}, [getData, client, props.state.isOwnedVotes]);


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
						council={council}
						translate={translate}
						requestClose={() => setModal(false)}
						participant={participant}
					/>
					{data.participantOwnedVotes.meta &&
						<OwnedVotesRecountSection
							ownedVotesMeta={data.participantOwnedVotes.meta}
							participant={participant}
							translate={translate}
							council={council}
						/>
					}
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
									refetch={remove}
								/>
							}
							data={data}
							type={delegatedVote.state === PARTICIPANT_STATES.DELEGATED ? 3 : 5}
						/>
					))}
					{data.participantOwnedVotes.total > 15 &&
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
							{translate.num_delegated_votes_see_all.replace(/{{number}}/, data.participantOwnedVotes.total - 15)}
						</Grid>
					}
				</>
			}
		</>
	);
};

export default withApollo(OwnedVotesSection);
