import React from 'react';
import { Tooltip } from 'material-ui';
import { BasicButton } from '../../../../displayComponents';
import { AGENDA_STATES } from '../../../../constants';
import { getPrimary, getSecondary } from '../../../../styles/colors';
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
                        fontSize: '2em'
                    }}
                />
            </Tooltip>
        );
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
        </React.Fragment>
    );
};

export default ActPointStateManager;
