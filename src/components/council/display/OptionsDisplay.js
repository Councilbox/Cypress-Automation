import React from 'react';


export const OptionsDisplay = ({ council, translate }) => (
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
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {getSelectionIcon(council.wallActive)} <span>{translate.wall}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {getSelectionIcon(council.askWordMenu)} <span>{translate.can_ask_word}</span>
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
    if (value == 1) {
        return <i className="fa fa-check" style={{ color: 'limegreen', marginRight: '0.4em', width: "15px" }} aria-hidden="true"></i>
    }

    return <i className="fa fa-times" style={{ color: 'red', marginRight: '0.4em', width: "15px" }} aria-hidden="true"></i>
}

const getSecurityTypeText = (type, translate) => {
    const texts = {
        0: translate.new_security_none,
        1: translate.new_security_email,
        2: translate.new_security_sms
    }

    return texts[type];
}

export default OptionsDisplay
