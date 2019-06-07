import React from 'react';
import { BasicButton } from '../../../../displayComponents';
import { AGENDA_STATES } from '../../../../constants';
import { getPrimary, getSecondary } from '../../../../styles/colors';
import { Tooltip } from 'material-ui';
import ApproveActButton from './ApproveActButton';
import SendActToVote from './SendActToVote';
import ToggleAgendaButton from '../ToggleAgendaButton';
import ToggleVotingsButton from '../ToggleVotingsButton';


const ActPointStateManager = ({ agenda, council, translate, refetch, ...props }) => {
    const [sendAct, setSendAct] = React.useState(false);
    const primary = getPrimary();

    if(!props.active){
        return (
            <Tooltip title={translate.warning_unclosed_agenda}>
                <i
                    className="fa fa-lock"
                    style={{
                        color: getSecondary(),
                        fontSize: "2em"
                    }}
                />
            </Tooltip>
        )
    }

    return (
        <React.Fragment>
            {agenda.pointState === AGENDA_STATES.INITIAL &&
                <div>
                    <ToggleAgendaButton
                        agenda={agenda}
                        council={council}
                        translate={translate}
                        refetch={refetch}
                        active={true}
                    />
                </div>
            }
            {agenda.votingState === AGENDA_STATES.DISCUSSION &&
                <ToggleVotingsButton
                    council={council}
                    agenda={agenda}
                    translate={translate}
                    refetch={refetch}
                />
            }

             {agenda.votingState === AGENDA_STATES.CLOSED &&
                <ApproveActButton
                    council={council}
                    agenda={agenda}
                    translate={translate}
                    refetch={refetch}
                />
            }

            {agenda.pointState === AGENDA_STATES.DISCUSSION && agenda.votingState === AGENDA_STATES.INITIAL &&
                <React.Fragment>
                    <BasicButton
                        text={translate.save_preview_act}
                        color={'white'}
                        textStyle={{
                            color: primary,
                            fontWeight: "700",
                            fontSize: "0.9em",
                            textTransform: "none"
                        }}
                        onClick={() => setSendAct(true)}
                        buttonStyle={{
                            marginRight: "1em",
                            border: `2px solid ${primary}`
                        }}
                    />
                    <SendActToVote
                        council={council}
                        agenda={agenda}
                        refetch={refetch}
                        translate={translate}
                        show={sendAct}
                        requestClose={() => setSendAct(false)}
                    />
                </React.Fragment>

            }
        </React.Fragment>
    )

}

export default ActPointStateManager;