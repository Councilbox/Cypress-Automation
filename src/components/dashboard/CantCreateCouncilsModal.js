import React from 'react';
import { AlertConfirm } from '../../displayComponents';
import CBXContactButton from '../noCompany/CBXContactButton';


const CantCreateCouncilsModal = props => (
        <AlertConfirm
            title="Aviso"
            open={props.open}
            hideAccept
            buttonCancel={props.translate.close}
            requestClose={props.requestClose}
            bodyText={
                <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ marginBottom: '0.8em' }}>
                        {props.translate.action_need_premium}
                    </div>
                    <CBXContactButton
                        translate={props.translate}
                    />
                </div>
            }
        />
    )

export default CantCreateCouncilsModal;

