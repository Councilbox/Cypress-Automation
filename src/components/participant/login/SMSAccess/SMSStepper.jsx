import React from "react";
import { Stepper, Step, StepLabel } from "material-ui";
import { getPrimary, getSecondary } from "../../../../styles/colors";

const SteperAcceso = ({ resendKey, translate, responseSMS, error }) => {
    const primary = getPrimary();
    const secondary = getSecondary();
    return (
        <Stepper nonLinear alternativeLabel style={{ height: '10em' }} >
            <Step className={'stepperAcceso'}>
                <StepLabel >
                    <span style={{ color: primary }}>{translate.room_access}</span>
                </StepLabel>
            </Step>
            <Step className={error ? 'stepperAcceso' : (responseSMS === 20 || responseSMS === 22) ? 'stepperAcceso' : 'stepperAccesoNoActived'}>
                <StepLabel>
                    <span style={{ color: primary }}>{translate.sms_sent}</span>
                </StepLabel>
            </Step>
            <Step className={error ? 'stepperAccesoFail' : responseSMS === 22 ? 'stepperAcceso' : 'stepperAccesoNoActived'}>
                <StepLabel>
                    <span style={{ color: primary }}>{translate.sms_delivered}</span>
                    <br></br>
                    <span style={{ color: secondary, cursor: 'pointer' }} onClick={resendKey}>{translate.resend}</span>
                </StepLabel>
            </Step>
            <Step className={'stepperAccesoNoActived'}>
                <StepLabel>
                    <span style={{ color: primary }}>{translate.validate_key}</span>
                </StepLabel>
            </Step>
        </Stepper>
    )
}


export default SteperAcceso;