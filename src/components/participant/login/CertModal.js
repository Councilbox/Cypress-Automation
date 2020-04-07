import React from 'react';
import { AlertConfirm } from '../../../displayComponents';



const CertModal = ({ open }) => {


    return (
        <AlertConfirm
            open={open}
            title="Prueba"
            bodyText={
                <iframe src="https://localhost:5001"></iframe>
            }
        />
    )
}

export default CertModal;