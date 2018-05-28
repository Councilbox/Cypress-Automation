import React from 'react';
import { showVideo, getEmailIconByReqCode, isRepresented, hasHisVoteDelegated } from '../../../../utils/CBX';
import { MenuItem, Tooltip, IconButton } from 'material-ui';
import { GridItem } from '../../../../displayComponents';
import ParticipantStateIcon from '../ParticipantStateIcon';
import { Add } from 'material-ui-icons';

const ParticipantItem = ({ participant, translate, council, editParticipant, mode }) => (
    <GridItem
        xs={showVideo(council) ? 6 : 4}
        md={showVideo(council) ? 6 : 4}
        lg={showVideo(council) ? 6 : 4}
        key={`liveParticipant_${participant.id}`}
        style={{
            display: 'flex',
            alignItem: 'center',
            justifyContent: 'center',
            marginBottom: '1.2em',
            cursor: 'pointer',
            position: 'relative'
        }}
    >
        <MenuItem style={{
            width: '80%',
            height: '4.8em',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
        }} onClick={() => editParticipant(participant.id)}>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                textOverflow: 'ellipsis',
                overflow: 'hidden'
            }}>
                {mode === 'participantState' ?
                    <ParticipantStateIcon
                        participant={participant}
                        translate={translate}
                    /> 
                : 
                    participant.notifications.length > 0 ?
                        <img
                            style={{
                                height: '2.1em',
                                width: 'auto'
                            }}
                            src={getEmailIconByReqCode(participant.notifications[ participant.notifications.length - 1 ].reqCode)}
                            alt="email-state-icon"
                        /> 
                    : 
                        '-'
                    
                }
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: '1.3em',
                    width: '100%',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden'
                }}>
                    <div style={{ fontSize: '0.95em' }}>
                        {`${participant.name} ${participant.surname}`}
                    </div>
                    <div style={{
                        color: 'grey',
                        fontSize: '0.8em'
                    }}>
                        {`${participant.position}`}
                    </div>
                    {isRepresented(participant) &&
                        <Tooltip
                            title={`${translate.represented_by}: ${participant.representative.name} ${participant.representative.surname}`}
                        >
                            <div style={{
                                color: 'grey',
                                fontSize: '0.8em',
                                width: '100%',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden'
                            }}>
                                {`${translate.represented_by}: ${participant.representative.name} ${participant.representative.surname}`}
                            </div>
                        </Tooltip>
                    }
                    {hasHisVoteDelegated(participant) &&
                        <Tooltip
                        title={`${translate.voting_delegate}: ${participant.representative.name} ${participant.representative.surname}`}
                    >
                            <div style={{
                                color: 'grey',
                                fontSize: '0.8em',
                                width: '100%',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden'
                            }}>
                                {`${translate.voting_delegate}: ${participant.representative.name} ${participant.representative.surname}`}
                            </div>
                        </Tooltip>
                    }
                </div>
            </div>
        </MenuItem>
    </GridItem>
)

export default ParticipantItem;