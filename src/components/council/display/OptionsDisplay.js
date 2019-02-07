import React from 'react';


export const OptionsDisplay = ({ council, translate }) => (
    <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>{translate.confirm_assistance}</span>{getSelectionIcon(council.confirmAssistance)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>{translate.room_video_broadcast}</span>{getSelectionIcon(council.councilType ? 0 : 1)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>{translate.full_video_record}</span>{getSelectionIcon(council.fullVideoRecord)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>{translate.auto_close}</span>{getSelectionIcon(council.autoClose)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {`${translate.security}: ${getSecurityTypeText(council.securityType, translate)}`}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>{translate.approve_act_draft_at_end}</span>{getSelectionIcon(council.approveActDraft)}
        </div>
    </div>
)


export const OptionsDisplayIconIzq = ({ council, translate }) => (
    <div>
        <div style={{ display: 'flex' }} className={"colorTable"}>
            <div style={{ width: "30px" }}>{getSelectionIcon(council.confirmAssistance)}</div><span style={{width:"100%"}}>{translate.confirm_assistance}</span>
        </div>
        <div style={{ display: 'flex' }}  className={"colorTable"}>
            <div style={{ width: "30px" }}>{getSelectionIcon(council.councilType ? 0 : 1)}</div><span style={{width:"100%"}}>{translate.room_video_broadcast}</span>
        </div>
        <div style={{ display: 'flex' }} className={"colorTable"}>
            <div style={{ width: "30px" }}> {getSelectionIcon(council.fullVideoRecord)} </div><span style={{width:"100%"}}>{translate.full_video_record}</span>
        </div>
        <div style={{ display: 'flex' }} className={"colorTable"}>
            <div style={{ width: "30px" }}>{getSelectionIcon(council.autoClose)}  </div> <span style={{width:"100%"}}>{translate.auto_close}</span>
        </div>
        <div style={{ display: 'flex' }} className={"colorTable"}>
            <div style={{ width: "30px" }}></div> <span style={{width:"100%"}}> {`${translate.security}: ${getSecurityTypeText(council.securityType, translate)}`}</span>
        </div>
        <div style={{ display: 'flex' }} className={"colorTable"}>
            <div style={{ width: "30px" }}> {getSelectionIcon(council.approveActDraft)}</div> <span style={{width:"100%"}}>{translate.approve_act_draft_at_end}</span>
        </div>
    </div>
)

const getSelectionIcon = value => {
    if (value === 1) {
        return <i className="fa fa-check" style={{ color: 'limegreen', marginLeft: '0.3em' }} aria-hidden="true"></i>
    }

    return <i className="fa fa-times" style={{ color: 'red', marginLeft: '0.3em' }} aria-hidden="true"></i>
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

export default OptionsDisplay
