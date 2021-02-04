import React from 'react';
import { AlertConfirm } from '../../../displayComponents';


const NoAttendDelegationWarning = ({ translate, requestClose }) => (
        <AlertConfirm
            open={true}
            title={translate.warning}
            requestClose={requestClose}
            cancelAction={requestClose}
            buttonCancel={translate.close}
            bodyText={
                <div>
                    {translate.before_confirm_no_attend}
                </div>
            }
        />
    )


export default NoAttendDelegationWarning;
