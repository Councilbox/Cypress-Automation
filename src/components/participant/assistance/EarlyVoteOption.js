import React from 'react';
import gql from 'graphql-tag';
import { AlertConfirm, LoadingSection, BasicButton } from '../../../displayComponents';
import { PARTICIPANT_STATES, VOTE_VALUES, AGENDA_TYPES, PARTICIPANT_TYPE } from '../../../constants';
import AssistanceOption from './AssistanceOption';
import { withApollo } from 'react-apollo';

import EarlyVoteModal from './EarlyVoteModal';


const EarlyVoteOption = ({ data, setState, state, participant, council, translate, client, ...props }) => {
    const [modal, setModal] = React.useState(false);
    
    return (
        <>
            <AssistanceOption
                translate={translate}
                title={translate.anticipate_vote}
                select={() => {
                    setModal(true)
                    setState({
                        ...state,
                        locked: false,
                    })
                }}
                value={PARTICIPANT_STATES.EARLY_VOTE}
                selected={state.assistanceIntention}
            />
            <EarlyVoteModal
                open={modal}
                setState={setState}
                translate={translate}
                state={state}
                requestClose={() => setModal(false)}
                council={council}
                participant={participant}

            />
        </>
    )
}


export default withApollo(EarlyVoteOption);