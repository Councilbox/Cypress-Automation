import React from 'react';
import { PARTICIPANT_TYPE } from '../../../../../constants';
import { Grid, GridItem } from '../../../../../displayComponents';
import { hasParticipations } from '../../../../../utils/CBX';

const Label = ({ children }) => (
	<span style={{ fontWeight: '700' }}>{children}</span>
);

const OwnedVotesRecountSection = ({ ownedVotesMeta, translate, participant, council }) => {
	const showSocialCapital = hasParticipations(council);

	return (
		<Grid
			style={{
				marginBottom: '1em',
				display: 'flex',
				alignItems: 'center',
				boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.5)',
				border: 'solid 1px #61abb7',
				borderRadius: '4px',
				padding: '1em',
				contentVisibility: 'auto',
				marginTop: '1em',
			}}
		>
			{participant.type !== PARTICIPANT_TYPE.REPRESENTATIVE &&
				<GridItem xs={12} md={6} lg={4}>
					<div>
						<Label>{translate.own_votes}:</Label> {ownedVotesMeta.totalOwnVotes || 0}
					</div>
					{showSocialCapital &&
						<div>
							<Label>{translate.own_social_capital}:</Label> {ownedVotesMeta.totalOwnSocialCapital || 0}
						</div>
					}

				</GridItem>
			}
			{ownedVotesMeta.numDelegated > 0 &&
				<GridItem xs={12} md={6} lg={4}>
					<div>
						<Label>{translate.num_delegations}:</Label> {ownedVotesMeta.numDelegated}
					</div>
					<div>
						<Label>{translate.delegated_votes}:</Label> {ownedVotesMeta.totalDelegatedVotes}
					</div>
					{showSocialCapital &&
						<div>
							<Label>{translate.delegated_social_capital}:</Label> {ownedVotesMeta.totalDelegatedSocialCapital}
						</div>
					}

				</GridItem>
			}
			{ownedVotesMeta.numRepresented > 0 &&
				<GridItem xs={12} md={6} lg={4}>
					<div>
						<Label>{translate.num_representations}:</Label> {ownedVotesMeta.numRepresented}
					</div>
					<div>
						<Label>{translate.representated_votes}:</Label> {ownedVotesMeta.totalRepresentedVotes}
					</div>
					{showSocialCapital &&
						<div>
							<Label>{translate.representated_social_capital}:</Label> {ownedVotesMeta.totalRepresentedSocialCapital}
						</div>
					}
				</GridItem>
			}

		</Grid>
	);
};

export default OwnedVotesRecountSection;

