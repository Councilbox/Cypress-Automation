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
                    Antes de confirmar, recuerde que tiene votos delegados.
                </div>
            }
        />
    )
}


export default NoAttendDelegationWarning;