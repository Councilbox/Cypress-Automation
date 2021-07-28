import React from 'react';
import { AlertConfirm, BasicButton } from '../../../displayComponents';
import { getSecondary } from '../../../styles/colors';
import RefuseDelegationConfirm from '../delegations/RefuseDelegationConfirm';
import { PARTICIPANT_STATES } from '../../../constants';
import { councilStarted, showNumParticipations } from '../../../utils/CBX';
import RefusedDelegationDisabled from './RefusedDelegationDisabled';


const DelegationsModal = ({
	open, requestClose, translate, refetch, council, participant
}) => {
	const [delegation, setDelegation] = React.useState(false);
	const [refusedDisabledModal, setRefusedDisabledModal] = React.useState(false);

	const closeConfirm = () => {
		setDelegation(false);
	};

	const delegations = participant.delegatedVotes.filter(vote => vote.state === PARTICIPANT_STATES.DELEGATED);
	const representations = participant.delegatedVotes.filter(vote => vote.state !== PARTICIPANT_STATES.DELEGATED);

	// TRADUCCION
	function renderDelegationsModalBody() {
		return (
			<div>
				{participant.voteDenied
					&& <div style={{ marginBottom: '1em' }}>
						Su derecho a voto <strong>ha sido denegado</strong>
						{participant.voteDeniedReason
							&& <div>{`El motivo indicado es: ${participant.voteDeniedReason}`}</div>
						}
					</div>
				}

				{delegations.length > 0
					&& translate.you_have_following_delegated_votes
				}
				{delegations.map(vote => (
					<div key={`delegatedVote_${vote.id}`} style={{
						padding: '0.3em', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
					}}>
						<div>
							<span>{`${vote.name} ${vote.surname || ''} - ${translate.votes}: ${showNumParticipations(vote.numParticipations, council.company, council.statute, council.statute)}`}</span>
							{vote.voteDenied
								&& <span style={{ color: 'red', marginLeft: '0.6em' }}>(Voto denegado)</span>
							}
						</div>
						{council.councilStarted === 0 &&
							<BasicButton
								text={translate.refuse}
								color="white"
								onClick={!councilStarted(council) ? () => setDelegation(vote) : () => setRefusedDisabledModal(true)}
								buttonStyle={{ border: `1px solid ${getSecondary()}` }}
								textStyle={{ color: getSecondary() }}
							/>
						}
					</div>
				))}
				{representations.length > 0
					&& `${translate.representative_of}:`
				}
				{representations.map(vote => (
					<div key={`delegatedVote_${vote.id}`} style={{ padding: '0.3em', display: 'flex', alignItems: 'center' }}>
						<span>{`${vote.name} ${vote.surname || ''} - ${translate.votes}: ${showNumParticipations(vote.numParticipations, council.company, council.statute)}`}</span>
						{vote.voteDenied
							&& <span style={{ color: 'red', marginLeft: '0.6em' }}>(Voto denegado)</span>
						}
					</div>
				))}
				<br />{translate.total_votes}: {calculateParticipantVotes()}
			</div>
		);
	}

	const calculateParticipantVotes = () => showNumParticipations(participant.delegatedVotes.reduce((a, b) => a + b.numParticipations, participant.numParticipations), council.company, council.statute);

	return (
		<React.Fragment>
			<AlertConfirm
				requestClose={requestClose}
				open={open}
				fullWidth={false}
				buttonCancel={translate.close}
				bodyText={renderDelegationsModalBody()}
				title={translate.warning}
			/>
			<RefusedDelegationDisabled
				translate={translate}
				open={refusedDisabledModal}
				requestClose={() => setRefusedDisabledModal(false)}
			/>
			{delegation
				&& <RefuseDelegationConfirm
					delegation={delegation}
					translate={translate}
					requestClose={closeConfirm}
					refetch={refetch}
				/>
			}
		</React.Fragment>
	);
};


export default DelegationsModal;
