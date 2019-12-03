import React from 'react';
import { AlertConfirm, BasicButton } from "../../../../displayComponents";
import { getSecondary } from "../../../../styles/colors";
import CustomPointVotingMenu from '../../../participant/agendas/CustomPointVotingMenu';
import { isMobile } from 'react-device-detect';

const NominalCustomVoting = ({ translate, agendaVoting, agenda, refetch, council, ...props }) => {
    const [modal, setModal] = React.useState(false);
    const secondary = getSecondary();

    const openModal = () => {
        setModal(true);
    }

    const closeModal = () => {
        setModal(false);
    }

    const renderVotingMenu = () => {
        return (
            <div style={{width: '600px'}}>
                <CustomPointVotingMenu
                    agenda={agenda}
                    translate={translate}
                    refetch={refetch}
                    council={council}
                    ownVote={agendaVoting}
                />
            </div>
        )
    }

    return (
        <div>
            <AlertConfirm
                open={modal}
                modal={false}
                title="Marcar selección"
                requestClose={closeModal}
                cancelAction={closeModal}
                buttonCancel={translate.close}
                bodyText={renderVotingMenu()}
            />
            <BasicButton
                text="Menu votación"
                onClick={openModal}
                color="white"
                buttonStyle={{ border: `1px solid ${secondary}`, marginRight: '0.6em'}}
                textStyle={{ color: secondary, fontWeight: '700' }}
            />
            {agendaVoting.ballots.length === 0?
                '-'
            :
                <div>
                    <DisplayVoting
                        ballots={agendaVoting.ballots}
                        translate={translate}
                    />
                </div>
            }
        </div>
    )
}

export const DisplayVoting = ({ ballots, translate }) => {
    const getVoteValueText = value => {
        const texts = {
            'Abstention': translate.abstention_btn,
            'default': value
        }

        return texts[value]? texts[value] : texts.default;
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', marginTop: isMobile? '0.6em' : 'inherit'}}>
            {isMobile && 'Selección:'}
            {ballots.map(ballot => (
                <div className="truncate" style={{marginTop: '0.3em', maxWidth: '20em', fontWeight: isMobile? '700' : '400', whiteSpace: 'pre-wrap'}}>
                    {getVoteValueText(ballot.value)}
                </div>
            ))}
        </div>
    )
}

export default NominalCustomVoting;