import React from 'react';
import { BasicButton } from '../../../../displayComponents';
import { getPrimary } from '../../../../styles/colors';

const FailedSMSMessage = ({ onClick }) => {
    const primary = getPrimary();

    return (
        <div style={{ maxWidth: window.innerWidth > 680 ? '680px' : '100%' }}>
            <div style={{ marginBottom: '1em' }}>
                La sala ha sido abierta correctamente, pero <b>ha fallado el envió de algunos SMS de acceso.</b><br/>
                Posiblemente el problema haya sido que el <b>teléfono no es válido</b> o le falta el <b>prefijo internacional.</b>
                <br/>Puede modificarlos y reenviarlos pulsando aquí.
            </div>
            <BasicButton
                text={'Administrar SMS'}
                color={'white'}
                onClick={onClick}
                buttonStyle={{ width: "11em", border: `1px solid ${primary}` }}
                textStyle={{
                    fontWeight: "700",
                    textTransform: "none"
                }}
            />
        </div>
    )
}

export default FailedSMSMessage;
