import React from 'react';
import { AlertConfirm } from '../../../../displayComponents';
import LiveSMS from './LiveSMS';

const SMSManagerModal = ({ open, translate, council, requestClose }) => {

    return (
        <div>
            <AlertConfirm
				title={'SMS Manager'}
				bodyText={<LiveSMS council={council} translate={translate} showAll />}
				open={open}
				buttonCancel={translate.close}
				modal={true}
				requestClose={requestClose}
			/>
        </div>
    )
}

export default SMSManagerModal;