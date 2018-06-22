import React from 'react';
import FontAwesome from 'react-fontawesome';
import { Tooltip } from 'material-ui';
import { getPrimary } from '../../../../styles/colors';
import { removeHTMLTags } from '../../../../utils/CBX';

const AttendIntentionIcon = ({ participant, translate, size = '1.3em' }) => {
    const primary = getPrimary();
    let tooltip = translate.not_confirmed_assistance;
    let icon = 'question';

    if(participant.assistanceLastDateConfirmed){
        switch(participant.assistanceIntention){
            case 0:
                tooltip = translate.remote_assistance_short;
                icon = "globe"
                break;

            case 5:
                tooltip = translate.confirmed_assistance;
                icon = "user"
                break;
            
            case 6:
                tooltip = translate.no_assist_assistance;
                icon = "times"
                break;
            
            default:
                tooltip = translate.not_confirmed_assistance;
                icon = ""
        }
    }

    return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
            <Tooltip title={tooltip}>
                    <FontAwesome
                        name={icon}
                        style={{
                            margin: "0.5em",
                            color: primary,
                            fontSize: size
                        }}
                    />
            </Tooltip>
            {!!participant.assistanceComment &&
                <Tooltip title={removeHTMLTags(participant.assistanceComment)}>
                    <FontAwesome
                        name={'comment'}
                        style={{
                            margin: "0.5em",
                            color: primary,
                            fontSize: size
                        }}
                    />
                </Tooltip>
            }
        </div>  
    )
}

export default AttendIntentionIcon;
