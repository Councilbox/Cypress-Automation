import React from 'react';
import RemoveDelegationButton from '../RemoveDelegationButton';
import { ParticipantBlock } from '../LiveParticipantEditor';
import { Grid } from '../../../../../displayComponents';
import { PARTICIPANT_STATES } from '../../../../../constants';
import OwnedVotesModal from './OwnedVotesModal';
import OwnedVotesRecountSection from './OwnedVotesRecountSection';


const OwnedVotesSection = ({ participant, translate, council, ownedVotes, updateOwnedVotes }) => {
	const [modal, setModal] = React.useState(false);

	return (
		<>
			{(ownedVotes && ownedVotes.list.length > 0)
			&&
				<>
					<OwnedVotesModal
						open={modal}
						council={council}
						translate={translate}
						requestClose={() => setModal(false)}
						participant={participant}
					/>
					{ownedVotes.meta &&
						<OwnedVotesRecountSection
							ownedVotesMeta={ownedVotes.meta}
							participant={participant}
							translate={translate}
							council={council}
						/>
					}
					{ownedVotes.list.map((delegatedVote, index) => (
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
										refetch={updateOwnedVotes}
									/>
							}
							data={ownedVotes}
							type={delegatedVote.state === PARTICIPANT_STATES.DELEGATED ? 3 : 5}
						/>
					))}
					{ownedVotes.total > 15 &&
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
							{translate.num_delegated_votes_see_all.replace(/{{number}}/, ownedVotes.total - 15)}
						</Grid>
					}
				</>
			}
		</>
	);
};

export default OwnedVotesSection;
