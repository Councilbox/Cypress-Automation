import React from 'react';
import FontAwesome from 'react-fontawesome';
import { getPrimary, getSecondary } from '../../../styles/colors';
import { getParticipantStateString, isRepresentative, participantIsGuest } from '../../../utils/CBX';
import { Tooltip } from 'material-ui';

const mainIconSize = 1.75;
const subIconSize = 1;


const DoubleIcon = ({ main, sub, subSize = subIconSize, subColor = getPrimary(), mainColor = getPrimary() }) => {

    return (<div style={{
        position: 'relative',
        height: '2.5em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }}>
        <FontAwesome
            name={main}
            style={{
                margin: '0.5em',
                color: mainColor,
                fontSize: `${mainIconSize}em`
            }}
        />
        <FontAwesome
            name={sub}
            style={{
                margin: '0.5em',
                color: subColor,
                fontSize: `${subSize}em`,
                position: 'absolute',
                top: `${mainIconSize - 0.25 - subSize}em`,
                right: 0
            }}
        />
    </div>)
}

const IconSwitch = ({ participant, translate, tooltip, isIntention, representative }) => {

    let state;
    if (!isIntention) {
        state = getParticipantStateString(participant.state);
    } else {
        state = getParticipantStateString(participant.live.assistanceIntention);
    }
    const primary = getPrimary();

    switch (state) {
        case 'REMOTE':
            return (<Tooltip
                title={`${representative ? translate.representative + ' - ' : ''}${tooltip === 'change' ? translate.change_to_remote : translate.remote_assistance}`}>
                <div>
                    <FontAwesome
                        name={'globe'}
                        style={{
                            margin: '0.5em',
                            color: primary,
                            fontSize: `${mainIconSize}em`
                        }}
                    />
                </div>
            </Tooltip>)

        case 'PRESENT':
            return (<Tooltip
                title={`${representative ? translate.representative + ' - ' : ''}${tooltip === 'change' ? translate.change_to_present : translate.physically_present_assistance}`}>
                <FontAwesome
                    name={'user'}
                    style={{
                        margin: '0.5em',
                        color: primary,
                        fontSize: `${mainIconSize}em`
                    }}
                />
            </Tooltip>)

        case 'REPRESENTATED':
            return (<Tooltip
                title={`${representative ? translate.representative + ' - ' : ''}${tooltip === 'change' ? translate.add_representative : translate.representated}`}>
                <div>
                    <DoubleIcon main={'user-o'} sub={'user'}/>
                </div>
            </Tooltip>)

        case 'DELEGATED':
            return (<Tooltip
                title={`${representative ? translate.representative + ' - ' : ''}${tooltip === 'change' ? translate.to_delegate_vote : translate.delegated}`}>
                <div>
                    <DoubleIcon main={'user'} sub={'user'} mainColor={getSecondary()}/>
                </div>
            </Tooltip>)

        case 'PHYSICALLY_PRESENT':
            return (<Tooltip
                title={`${representative ? translate.representative + ' - ' : ''}${tooltip === 'change' ? translate.change_to_present : translate.physically_present_assistance}`}>
                <FontAwesome
                    name={'user'}
                    style={{
                        margin: '0.5em',
                        color: primary,
                        fontSize: `${mainIconSize}em`
                    }}
                />
            </Tooltip>)

        case 'NO_PARTICIPATE':
            return (<Tooltip
                title={`${representative ? translate.representative + ' - ' : ''}${tooltip === 'change' ? translate.change_to_no_participate : translate.no_assist_assistance}`}>
                <div>
                    <DoubleIcon main={'user-o'} sub={'times'}/>
                </div>
            </Tooltip>)

        case 'PRESENT_WITH_REMOTE_VOTE':
            return (<Tooltip
                title={`${representative ? translate.representative + ' - ' : ''}${tooltip === 'change' ? translate.change_to_present_with_remote_vote : translate.physically_present_with_remote_vote}`}>
                <div>
                    <DoubleIcon main={'user-o'} sub={'mobile'} subSize={1.75}/>
                </div>
            </Tooltip>)

        default:
            return (<Tooltip title={translate.not_confirmed_assistance}>
                <FontAwesome
                    name={'question'}
                    style={{
                        margin: '0.5em',
                        color: primary,
                        fontSize: `${mainIconSize}em`
                    }}
                />
            </Tooltip>)
    }
}


const ParticipantStateIcon = ({ participant, translate, tooltip, isIntention }) => {

    if (participantIsGuest(participant)) {
        return (<Tooltip title={translate.guest}>
            <div>
                <DoubleIcon main={'user-o'} sub={'eye'}/>
            </div>
        </Tooltip>)
    }

    if (isRepresentative(participant)) {
        return (<IconSwitch
            participant={participant}
            translate={translate}
            tooltip={tooltip}
            isIntention={isIntention}
            representative
        />)
    }

    return <IconSwitch participant={participant}
                       translate={translate}
                       tooltip={tooltip}
                       isIntention={isIntention}
    />

}

export default ParticipantStateIcon;