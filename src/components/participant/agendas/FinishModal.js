import React from 'react';
import { AlertConfirm } from '../../../displayComponents';


const FinishModal = ({ open, action, requestClose, translate, ...props }) => {

    const renderBody = () => {
        return (
            <div>
                Una vez enviado no se podrá modificar el sentido del voto ¿Aceptar?
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