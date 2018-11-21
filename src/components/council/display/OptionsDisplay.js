import React from 'react';


const OptionsDisplay = ({ council, translate }) => (
    <div>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <span>{translate.confirm_assistance}</span>{getSelectionIcon(council.confirmAssistance)}
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <span>{translate.room_video_broadcast}</span>{getSelectionIcon(council.councilType? 0 : 1)}
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <span>{translate.full_video_record}</span>{getSelectionIcon(council.fullVideoRecord)}
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <span>{translate.auto_close}</span>{getSelectionIcon(council.autoClose)}
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
            {`${translate.security}: ${getSecurityTypeText(council.securityType, translate)}`}
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <span>{translate.approve_act_draft_at_end}</span>{getSelectionIcon(council.approveActDraft)}
        </div>
    </div>
)

const getSelectionIcon = value => {
    if(value === 1){
        return <i className="fa fa-check" style={{color: 'limegreen', marginLeft: '0.3em'}} aria-hidden="true"></i>
    }

    return <i className="fa fa-times" style={{color: 'red', marginLeft: '0.3em'}} aria-hidden="true"></i>
}

const getSecurityTypeText = (type, translate) => {
    switch (type){
        case 0:
            return translate.new_security_none

        case 1:
            return translate.new_security_email

        case 2:
            return translate.new_security_sms
    }
}

export default OptionsDisplay;