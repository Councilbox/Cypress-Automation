import React from 'react';
import { AlertConfirm } from '../../../displayComponents';


const FinishModal = ({ open, action, requestClose, translate, ...props }) => {

    const renderBody = () => {
        return (
            <div>
                Puede enviar sus votos pulsando el botón "Enviar", en caso de querer hacer alguna modificación pulse el botón "Cancelar".
            </div>
        )
    }

    return (
        <AlertConfirm
            requestClose={requestClose}
            open={open}
            acceptAction={action}
            cancelAction={requestClose}
            buttonAccept={translate.send}
            buttonCancel={translate.cancel}
            title={translate.warning}
            bodyText={renderBody()}
        />
    )
}

export default FinishModal;