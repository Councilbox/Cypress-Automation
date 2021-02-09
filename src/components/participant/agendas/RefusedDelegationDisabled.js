import React from 'react';
import { AlertConfirm } from '../../../displayComponents';


const RefusedDelegationDisabled = ({ translate, open, requestClose }) => (
        <AlertConfirm
            title={translate.warning}
            open={open}
            requestClose={requestClose}
            buttonCancel={translate.close}
            bodyText={
                <div>
                    {translate.refuse_delegation_disabled_warning}
                </div>
            }
        />
    );

export default RefusedDelegationDisabled;
