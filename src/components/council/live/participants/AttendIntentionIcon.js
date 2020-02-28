import React from 'react';
import FontAwesome from 'react-fontawesome';
import { Tooltip } from 'material-ui';
import { getPrimary } from '../../../../styles/colors';
import { PARTICIPANT_STATES } from '../../../../constants';
import DownloadParticipantProxy from '../../prepare/DownloadParticipantProxy';

const AttendIntentionIcon = ({ participant, representative, council, translate, size = '1.3em', color = getPrimary(), showCommentIcon, onCommentClick }) => {
    let tooltip = translate.not_confirmed_assistance;
    const iconStyle = {
        margin: "0.5em",
        color: color,
        fontSize: size
    };
    let icon = <i className='fa fa-question' style={iconStyle}></i>;

    const confirmationDate = participant.state === PARTICIPANT_STATES.REPRESENTATED? representative.assistanceLastDateConfirmed : participant.assistanceLastDateConfirmed;
    const intention = participant.state === PARTICIPANT_STATES.REPRESENTATED? representative.assistanceIntention : participant.assistanceIntention;

    //console.log(participant, representative);

    if(confirmationDate){
        switch(intention){
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
                if((representative && participant.delegateId !== representative.id) || (!representative && participant.delegateId)){
                    tooltip = `${translate.delegated_in}: ${participant.representative.name} ${participant.representative.surname}`;
                } else {
                    tooltip = `Delegará su voto`;//TRADUCCION
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
            {showCommentIcon &&
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
            {council.statute.requireProxy === 1 && participant.delegationProxy &&
                <DownloadParticipantProxy
                    translate={translate}
                    participantId={participant.id}
                    participant={participant}
                />
            }
        </div>
    )
}

export default AttendIntentionIcon;
