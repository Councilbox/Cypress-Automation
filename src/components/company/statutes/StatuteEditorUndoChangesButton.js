import React from 'react';
import { AlertConfirm, BasicButton, ButtonIcon } from '../../../displayComponents';
import { getSecondary } from '../../../styles/colors';


const StatuteEditorUndoChangesButton = ({ translate, action }) => {
	const [modal, setModal] = React.useState(false);

	return (
		<>
			<AlertConfirm
				title={translate.attention}
				bodyText={translate.are_you_sure_undo_changes}
				open={modal}
				buttonAccept={translate.accept}
				acceptAction={action}
				buttonCancel={translate.cancel}
				modal={true}
				requestClose={() => setModal(false)}
			/>
			<BasicButton
				id="discard-changes-button"
				color={getSecondary()}
				textStyle={{
					color: 'white',
					fontWeight: '700',
					textTransform: 'none'
				}}
				buttonStyle={{
					marginRight: '0.8em'
				}}
				onClick={() => setModal(true)}
				icon={
					<ButtonIcon
						type={'replay'}
						color="white"
					/>
				}
			/>
		</>
	);
};

export default StatuteEditorUndoChangesButton;
