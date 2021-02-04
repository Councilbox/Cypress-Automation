import React from 'react';
import { AlertConfirm } from '../../../displayComponents';
import withSharedProps from '../../../HOCs/withSharedProps';


const AttendanceConfirmation = ({ open, requestClose, company, translate }) => (
        <AlertConfirm
            open={open}
            title={translate.warning}
            cancelAction={requestClose}
            buttonCancel={translate.close}
            requestClose={requestClose}
            bodyText={<div style={{ maxWidth: '700px' }}>
                Gracias por confirmar su participación en la Asamblea General.
                Para poder validar la representación de la entidad asociada a la que
                representa necesitamos que remita una copia de sus poderes de representación
                a la siguiente dirección de correo electrónico <a href="pilar@asnef.com">pilar@asnef.com</a>. Muchas gracias.
            </div>}
        />
    )

export default withSharedProps()(AttendanceConfirmation);
