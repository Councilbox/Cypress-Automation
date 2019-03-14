import React from 'react';
import { AlertConfirm } from '../../../displayComponents';


const NoAttendDelegationWarning = ({ translate, requestClose }) => {
//TRADUCCION

    return(
        <AlertConfirm
            open={true}
            title={translate.warning}
            requestClose={requestClose}
            cancelAction={requestClose}
            buttonCancel={translate.close}
            bodyText={
                <div>
                    Ha seleccionado no asistir, pero <b>tiene votos delegados</b>, piense si quiere rechazarlos. <br/>Si finalmente no asiste esos votos no se usarán en la reunión.
                </div>
            }
        />
    )
}


export default NoAttendDelegationWarning;