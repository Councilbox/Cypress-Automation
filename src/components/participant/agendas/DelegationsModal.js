import React from 'react';
import { AlertConfirm, BasicButton } from '../../../displayComponents';
import { getSecondary } from '../../../styles/colors';
import RefuseDelegationConfirm from '../delegations/RefuseDelegationConfirm';
import { PARTICIPANT_STATES } from '../../../constants';


const DelegationsModal = ({ open, requestClose, translate, refetch, participant }) => {
    const [delegation, setDelegation] = React.useState(false);

    const closeConfirm = () => {
        setDelegation(false);
    }

    const delegations = participant.delegatedVotes.filter(vote => vote.state === PARTICIPANT_STATES.DELEGATED);
    const representations = participant.delegatedVotes.filter(vote => vote.state === PARTICIPANT_STATES.REPRESENTATED);

    function _renderDelegationsModalBody() {
        return (
            <div>
                {delegations.length > 0 &&
                    translate.you_have_following_delegated_votes
                }
                {delegations.map(vote => (
                        <div key={`delegatedVote_${vote.id}`} style={{padding: '0.3em', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <span>{`${vote.name} ${vote.surname} - ${translate.votes}: ${vote.numParticipations}`}</span>
                            <BasicButton
                                text={translate.refuse}
                                color="white"
                                onClick={() => setDelegation(vote)}
                                buttonStyle={{ border: `1px solid ${getSecondary()}`}}
                                textStyle={{ color: getSecondary() }}
                            />
                        </div>
                    )
                )}
                {representations.length > 0 &&
                    'Está representando a:'
                }
                {representations.map(vote => (
                        <div key={`delegatedVote_${vote.id}`} style={{padding: '0.3em', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <span>{`${vote.name} ${vote.surname} - ${translate.votes}: ${vote.numParticipations}`}</span>
                        </div>
                    )
                )}
                <br/>Total de votos: {calculateParticipantVotes()}
            </div>
        )
    }

    const calculateParticipantVotes = () => {
        return participant.delegatedVotes.reduce((a, b) => a + b.numParticipations, participant.numParticipations);
    }

    return (
        <React.Fragment>
            <AlertConfirm
                requestClose={requestClose}
                open={open}
                fullWidth={false}
                buttonCancel={translate.close}
                bodyText={_renderDelegationsModalBody()}
                title={translate.warning}
            />
            {delegation &&
				<RefuseDelegationConfirm
					delegation={delegation}
					translate={translate}
					requestClose={closeConfirm}
					refetch={refetch}
				/>
			}
        </React.Fragment>
    )
}


export default DelegationsModal;