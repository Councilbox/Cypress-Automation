import React from 'react';
import FontAwesome from 'react-fontawesome';
import { Tooltip } from 'material-ui';
import { getPrimary } from '../../../../styles/colors';
import { PARTICIPANT_STATES } from '../../../../constants';

const AttendIntentionIcon = ({ participant, translate, size = '1.3em', color = getPrimary(), showCommentIcon, onCommentClick }) => {
    let tooltip = translate.not_confirmed_assistance;
    const iconStyle = {
        margin: "0.5em",
        color: color,
        fontSize: size
    };
    let icon = <i className='fa fa-question' style={iconStyle}></i>;

    if(participant.assistanceLastDateConfirmed){
        switch(participant.assistanceIntention){
            case PARTICIPANT_STATES.REMOTE:
                tooltip = translate.remote_assistance_short;
                icon = <i className='fa fa-globe' style={iconStyle}></i>;
                break;

            case PARTICIPANT_STATES.PHYSICALLY_PRESENT:
                tooltip = translate.confirmed_assistance;
                icon = <i className='fa fa-user' style={iconStyle}></i>;
                break;

            case PARTICIPANT_STATES.NO_PARTICIPATE:
                tooltip = translate.no_assist_assistance;
                icon = <i className='fa fa-times' style={iconStyle}></i>;
                break;

            case PARTICIPANT_STATES.DELEGATED:
                if(participant.representative){
                    tooltip = `${translate.delegated_in}: ${participant.representative.name} ${participant.representative.surname}`;
                }
                icon = <i className='fa fa-users' style={iconStyle}></i>;
                break;

            default:
                break;
        }
    }

    return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
            <Tooltip title={tooltip}>
                {icon}
            </Tooltip>
            {!!participant.assistanceComment && showCommentIcon &&
                <FontAwesome
                    onClick={onCommentClick}
                    name={'comment'}
                    style={{
                        margin: "0.5em",
                        color: color,
                        fontSize: size
                    }}
                />
            }
        </div>
    )
}

export default AttendIntentionIcon;
