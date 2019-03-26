import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { AlertConfirm, BasicButton } from '../../../displayComponents';
import { getSecondary } from '../../../styles/colors';
import RefuseDelegationConfirm from '../delegations/RefuseDelegationConfirm';

const reducer = (state, { type, payload }) => {
    const actions = {
        success: () => ({
            ...state,
            data: payload,
            success: true,
            error: false,
            loading: false
        }),

        loading: () => ({
            ...state,
            loading: payload
        }),

        error: () => ({
            ...state,
            success: false,
            loading: false,
            error: payload
        })
    }

    return actions[type]();
}

const DelegationsModal = ({ open, requestClose, translate, refuseDelegation, refetch, participant }) => {
    const [delegation, setDelegation] = React.useState(false);

    const closeConfirm = () => {
        setDelegation(false);
    }

    function _renderDelegationsModalBody() {
        return (
            <div>
                {participant.delegatedVotes.length > 0 &&
                    'Tiene los siguientes votos delegados en usted:'
                }
                {participant.delegatedVotes.map(vote => (
                    <div key={`delegatedVote_${vote.id}`} style={{padding: '0.3em', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <span>{`${vote.name} ${vote.surname} - Votos: ${vote.numParticipations}`/*TRADUCCION*/}</span>
                        <BasicButton
                            text="Rechazar"
                            color="white"
                            onClick={() => setDelegation(vote)}
                            buttonStyle={{ border: `1px solid ${getSecondary()}`}}
                            textStyle={{ color: getSecondary() }}
                        />
                    </div>
                ))}
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