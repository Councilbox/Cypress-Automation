import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { AlertConfirm, BasicButton } from '../../../displayComponents';
import { getSecondary } from '../../../styles/colors';

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
    const [loading, setLoading] = React.useState(false);
    const [state, dispatch] = React.useReducer(reducer, { loading: false, success: false, error: false });

    const sendRefuseDelegation = async participantId => {
        dispatch({ type: 'loading', payload: participantId });
        const response = await refuseDelegation({
            variables: {
                participantId
            }
        })

        if(response.data.refuseDelegation && response.data.refuseDelegation.success){
            dispatch({ type: 'success'});
            refetch();
        }

        if(response.errors){
            dispatch({ type: 'error', payload: response.errors })
        }
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
                            loading={state.loading === vote.id}
                            onClick={() => sendRefuseDelegation(vote.id)}
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
        <AlertConfirm
            requestClose={requestClose}
            open={open}
            fullWidth={false}
            buttonCancel={translate.close}
            bodyText={_renderDelegationsModalBody()}
            title={translate.warning}
        />
    )
}

const refuseDelegationMutation = gql`
	mutation RefuseDelegation($participantId: Int!){
		refuseDelegation(participantId: $participantId){
			success
		}
	}
`;

export default graphql(refuseDelegationMutation, {
    name: 'refuseDelegation'
})(DelegationsModal);