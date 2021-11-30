import React from 'react';
import { AlertConfirm } from '../../../displayComponents';


const FinishModal = ({
	open, action, requestClose, translate
}) => {
	const renderBody = () => (
		<div>
			{translate.after_confirm_you_cannot_change_vote}
		</div>
	);

	return (
		<AlertConfirm
			requestClose={requestClose}
			open={open}
			acceptAction={action}
			cancelAction={requestClose}
			buttonAccept={translate.send}
			buttonCancel={translate.cancel}
			title={translate.warning}
			bodyText={renderBody()}
		/>
	);
};

export default FinishModal;
