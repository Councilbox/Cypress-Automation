import React from 'react';
import { withApollo } from 'react-apollo';
import { PARTICIPANT_STATES } from '../../../constants';
import AssistanceOption from './AssistanceOption';

import EarlyVoteModal from './EarlyVoteModal';


const EarlyVoteOption = ({ setState, state, participant, council, translate }) => {
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
                acceptState={PARTICIPANT_STATES.EARLY_VOTE}
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
