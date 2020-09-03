import React from "react";
import { Stepper, Step, StepLabel } from "material-ui";
import { getPrimary, getSecondary } from "../../../styles/colors";
import { BasicButton } from "../../../displayComponents";



const SteperAcceso = ({ resendKey, translate, responseSMS, error }) => {
    return (
        <Stepper nonLinear alternativeLabel style={{ height: '8em' }} >
            <Step className={'stepperAcceso'}>
                <StepLabel >
                    <span style={{ color: getPrimary() }}>Acceso previo</span>
                </StepLabel>
            </Step>
            {responseSMS ?
                <Step className={error ? 'stepperAcceso' : responseSMS === 'SUCCESS' ? 'stepperAcceso' : 'stepperAccesoNoActived'}>
                    <StepLabel>
                        <span style={{ color: getPrimary() }}>SMS enviado</span>
                    </StepLabel>
                </Step>
                :
                <Step className={error ? 'stepperAcceso' : 'stepperAccesoNoActived'}>
                    <StepLabel>
                        <span style={{ color: getPrimary() }}>SMS Enviado</span>
                    </StepLabel>
                </Step>
            }
            {responseSMS ?
                <Step className={error ? 'stepperAccesoFail' : responseSMS === 'SUCCESS' ? 'stepperAcceso' : 'stepperAccesoNoActived'}>
                    <StepLabel>
                        <span style={{ color: getPrimary() }}>SMS Entregado</span>
                        <br></br>
                        <span style={{ color: getSecondary(), cursor: 'pointer' }} onClick={resendKey}>{translate.resend}</span>
                    </StepLabel>
                </Step>
                :
                <Step className={error ? 'stepperAccesoFail' : 'stepperAccesoNoActived'}>
                    <StepLabel>
                        <span style={{ color: getPrimary() }}>SMS Entregado</span>
                    </StepLabel>
                </Step>
            }
            <Step className={'stepperAccesoNoActived'}>
                <StepLabel>
                    <span style={{ color: getPrimary() }}>Clave validada</span>
                </StepLabel>
            </Step>
        </Stepper>
    )
}


export default SteperAcceso;