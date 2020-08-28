import React from 'react';
import { AlertConfirm } from '../../../../../displayComponents';


const SelectRepresentative = ({ open, requestClose, updateRepresentative }) => {

    return (
        <AlertConfirm
            open={open}
            requestClose={requestClose}
            bodyText={
                <div>
                    PRUEBA
                </div>
            }
        />
    )
}

export default SelectRepresentative;