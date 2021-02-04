import React from 'react';
import { AlertConfirm } from '../../../../displayComponents';
import LiveSMS from './LiveSMS';
import { isMobile } from '../../../../utils/screen';


const SMSManagerModal = ({ open, translate, council, requestClose }) => (
        <div>
            <AlertConfirm
				title={'SMS Manager'}
				bodyText={<LiveSMS council={council} translate={translate} showAll />}
				open={open}
				buttonCancel={translate.close}
				modal={true}
				requestClose={requestClose}
				classNameDialog={isMobile ? "noMarginM" : 'noMargin'}
				bodyStyle={{ overflowY: "hidden", height: "50vh", width: "100%", maxWidth: isMobile && "100vw" }}
			/>
        </div>
    )

export default SMSManagerModal;
