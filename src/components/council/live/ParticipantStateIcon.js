import React from 'react';
import FontAwesome from 'react-fontawesome';
import { getPrimary, getSecondary } from '../../../styles/colors';
import { getParticipantStateString } from '../../../utils/CBX';
import { Tooltip } from 'material-ui';
const mainIconSize = 1.75;
const subIconSize = 1;


const DoubleIcon = ({ main, sub, subSize = subIconSize }) => {
    const primary = getPrimary();
    const secondary = getSecondary();

    return(
        <div style={{position: 'relative', height: '2.5em', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <FontAwesome
                name={main}
                style={{margin: '0.5em', color: primary, fontSize: `${mainIconSize}em`}}
            />
            <FontAwesome
                name={sub}
                style={{margin: '0.5em', color: primary, fontSize: `${subSize}em`, position: 'absolute', top: `${mainIconSize - 0.25 - subSize}em`, right: 0}}
            />
        </div>
    )
}




const ParticipantStateIcon = ({ participant, translate }) => {
    const state = getParticipantStateString(participant);
    const primary = getPrimary();

    if(participant.type === 1){
        return(
            <Tooltip title={translate.guest}>
                <div>
                    <DoubleIcon main={'user-o'} sub={'eye'} />
                </div>
            </Tooltip>
        )
    }

    switch(state){
        case 'REMOTE': 
            return(
                <Tooltip title={translate.remote_assistance}>
                    <div>
                        <FontAwesome
                            name={'globe'}
                            style={{margin: '0.5em', color: primary, fontSize: `${mainIconSize}em`}}
                        />
                    </div>
                </Tooltip>
            )

        case 'PRESENT':
            return (
                <FontAwesome
                    name={'user'}
                    style={{margin: '0.5em', color: primary, fontSize: `${mainIconSize}em`}}
                />
            )
            
        case 'REPRESENTATED':
            return (
                <Tooltip title={translate.delegated}>
                    <div>
                        <DoubleIcon main={'user-o'} sub={'user-o'} />
                    </div>
                </Tooltip>
            )

        case 'DELEGATED':
            return (
                <FontAwesome
                    name={'user-times'}
                    style={{margin: '0.5em', color: primary, fontSize: `${mainIconSize}em`}}
                />
            )

        case 'PHYSICALLY_PRESENT':
            return (
                <FontAwesome
                    name={'user-times'}
                    style={{margin: '0.5em', color: primary, fontSize: `${mainIconSize}em`}}
                />
            )

        case 'NO_PARTICIPATE':
            return (
                <Tooltip title={translate.no_assist_assistance}>
                    <div>
                        <DoubleIcon main={'user-o'} sub={'times'} />
                    </div>
                </Tooltip>
            )

        case 'PRESENT_WITH_REMOTE_VOTE':
            return (
                <Tooltip title={translate.physically_present_with_remote_vote}>
                    <div>
                        <DoubleIcon main={'user-o'} sub={'mobile'} subSize={1.75} />
                    </div>
                </Tooltip>
            )

        default:
            return (
                <FontAwesome
                    name={'user-times'}
                    style={{margin: '0.5em', color: primary, fontSize: `${mainIconSize}em`}}
                />
            )
    }
}

export default ParticipantStateIcon;