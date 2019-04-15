import React from 'react';


const OptionsDisplay = ({ council, translate }) => (
    <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {getSelectionIcon(council.confirmAssistance)} <span>{translate.confirm_assistance}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {getSelectionIcon(council.councilType ? 0 : 1)}<span>{translate.room_video_broadcast}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {getSelectionIcon(council.fullVideoRecord)} <span>{translate.full_video_record}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {getSelectionIcon(council.autoClose)}  <span>{translate.auto_close}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{width: "15px", marginRight: "0.4em" }}></div>{`${translate.security}: ${getSecurityTypeText(council.securityType, translate)} `}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {getSelectionIcon(council.approveActDraft)} <span>{translate.approve_act_draft_at_end}</span>
        </div>
    </div>
)

const getSelectionIcon = value => {
    if (value === 1) {
        return <i className="fa fa-check" style={{ color: 'limegreen', marginRight: '0.4em', width: "15px" }} aria-hidden="true"></i>
    }

    return <i className="fa fa-times" style={{ color: 'red', marginRight: '0.4em', width: "15px" }} aria-hidden="true"></i>
}

const getSecurityTypeText = (type, translate) => {
    switch (type) {
        case 0:
            return translate.new_security_none

        case 1:
            return translate.new_security_email

        case 2:
            return translate.new_security_sms
    }
}

export default OptionsDisplay;