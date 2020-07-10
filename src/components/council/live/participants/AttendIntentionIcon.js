import React from 'react';
import FontAwesome from 'react-fontawesome';
import { Tooltip } from 'material-ui';
import { getPrimary } from '../../../../styles/colors';
import { PARTICIPANT_STATES } from '../../../../constants';
import DownloadParticipantProxy from '../../prepare/DownloadParticipantProxy';
import DownloadParticipantVoteLetter from '../../prepare/DownloadParticipantVoteLetter';
import { getAttendanceIntentionIcon } from '../../../../utils/CBX';

const AttendIntentionIcon = ({ participant, representative, council, translate, size = '1.3em', color = getPrimary(), showCommentIcon, onCommentClick }) => {
    let tooltip = translate.not_confirmed_assistance;
    const iconStyle = {
        margin: "0.3em",
        color,
        fontSize: size
    };
    let icon = <i className='fa fa-question' style={iconStyle}></i>;

    const confirmationDate = participant.state === PARTICIPANT_STATES.REPRESENTATED? representative.assistanceLastDateConfirmed : participant.assistanceLastDateConfirmed;
    const intention = participant.state === PARTICIPANT_STATES.REPRESENTATED? representative.assistanceIntention : participant.assistanceIntention;

    if(confirmationDate){
        switch(intention){
            case PARTICIPANT_STATES.REMOTE:
                tooltip = translate.remote_assistance_short;
                icon = getAttendanceIntentionIcon(intention, iconStyle);
                break;

            case PARTICIPANT_STATES.PHYSICALLY_PRESENT:
                tooltip = translate.confirmed_assistance;
                icon = getAttendanceIntentionIcon(intention, iconStyle);
                break;

            case PARTICIPANT_STATES.NO_PARTICIPATE:
                tooltip = translate.no_assist_assistance;
                icon = getAttendanceIntentionIcon(intention, iconStyle);
                break;

            case PARTICIPANT_STATES.EARLY_VOTE:
                tooltip = translate.participant_vote_fixed;
                icon = <span class="material-icons" style={iconStyle}>
                        how_to_vote
                    </span>
                break;
    

            case PARTICIPANT_STATES.DELEGATED:
                if((representative && participant.delegateId !== representative.id) || (!representative && participant.delegateId)){
                    tooltip = `${translate.delegated_in}: ${participant.representative.name} ${participant.representative.surname || ''}`;
                } else {
                    tooltip = translate.will_delegate
                }
                icon = getAttendanceIntentionIcon(intention, iconStyle);
                break;
            case PARTICIPANT_STATES.SENT_VOTE_LETTER:
                tooltip = translate.vote_letter_sent;
                icon = <DownloadParticipantVoteLetter
                    translate={translate}
                    participantId={participant.id}
                    participant={participant}
                    trigger={<i className='fa fa-sticky-note' style={iconStyle}></i>}
                />
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
                        margin: "0.2em",
                        color,
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
