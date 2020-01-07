import React from "react";
import { Stepper, Step, StepLabel } from "material-ui";
import { getPrimary } from "../../../styles/colors";



const SteperAcceso = ({ council, responseSMS, error }) => {
    //  1- Marcado - stepperAcceso
    //  2- Fail - stepperAccesoFail
    //  1- No activado - stepperAccesoNoActived
    // console.log(council)
    // console.log(responseSMS)
    // responseSMS.data.sendParticipantRoomKey.success
    return (
        <Stepper nonLinear alternativeLabel style={{ height: '8em' }} >
            <Step className={'stepperAcceso'}>
                <StepLabel >
                    <span style={{ color: getPrimary() }}>  Acceso previo</span>
                </StepLabel>
            </Step>
            {responseSMS ?
                <Step className={error ? 'stepperAcceso' : responseSMS.data.sendParticipantRoomKey.success ? 'stepperAcceso' : 'stepperAccesoNoActived'}>
                    <StepLabel>
                        <span style={{ color: getPrimary() }}>  SMS enviado</span>
                    </StepLabel>
                </Step>
                :
                <Step className={error ? 'stepperAcceso' : 'stepperAccesoNoActived'}>
                    <StepLabel>
                        <span style={{ color: getPrimary() }}>  SMS Enviado</span>
                    </StepLabel>
                </Step>
            }
            {responseSMS ?
                <Step className={error ? 'stepperAccesoFail' : responseSMS.data.sendParticipantRoomKey.success ? 'stepperAcceso' : 'stepperAccesoNoActived'}>
                    <StepLabel>
                        <span style={{ color: getPrimary() }}>  SMS Entregado</span>
                    </StepLabel>
                </Step>
                :
                <Step className={error ? 'stepperAccesoFail' : 'stepperAccesoNoActived'}>
                    <StepLabel>
                        <span style={{ color: getPrimary() }}>   SMS Entregado</span>
                    </StepLabel>
                </Step>
            }
            <Step className={'stepperAccesoNoActived'}>
                <StepLabel>
                    <span style={{ color: getPrimary() }}>  Clave validada</span>
                </StepLabel>
            </Step>
        </Stepper>
    )
}


export default SteperAcceso;