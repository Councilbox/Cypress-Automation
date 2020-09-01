import React from 'react';
import { AlertConfirm, LoadingSection, BasicButton } from '../../../displayComponents';
import EarlyVoteMenu from './EarlyVoteMenu';

const EarlyVoteModal = ({ state, setState, acceptState, participant, council, translate, open, requestClose }) => {
    const [selected, setSelected] = React.useState(new Map());

    return (
        <AlertConfirm
            title={translate.anticipate_vote}
            buttonAccept={translate.accept}
            acceptAction={() => {
                setState({
                    ...state,
                    assistanceIntention: acceptState,
                    requireDoc: false,
                    earlyVotes: Array.from(selected.values())
                })
                requestClose();
            }}
            open={open}
            bodyText={
                <>
                    <EarlyVoteMenu
                        selected={selected}
                        state={state}
                        setState={setState}
                        setSelected={setSelected}
                        participant={participant}
                        council={council}
                        translate={translate}
                    /> 
                </>
            }
            requestClose={requestClose}
        />
    )
}

export default EarlyVoteModal;