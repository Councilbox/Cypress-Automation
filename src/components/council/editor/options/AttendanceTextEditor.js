import React from 'react';
import { withApollo } from 'react-apollo';
import RichTextInput from '../../../../displayComponents/RichTextInput';
import { AlertConfirm, BasicButton, UnsavedChangesModal } from '../../../../displayComponents';
import { getSecondary } from '../../../../styles/colors';


const AttendanceTextEditor = ({
	translate, text, setText, updateAttendanceText, isModal, setIsmodal
}) => {
	const initialValue = React.useRef(text);

	React.useEffect(() => {
		if (isModal.modal) {
			initialValue.current = text;
		}
	}, [isModal.modal]);

	const renderBody = () => (
		<RichTextInput
			translate={translate}
			id="council-options-attendance-instructions-text-editor"
			value={text}
			onChange={value => setText(value)}
		/>
	);

	const handleClose = ev => {
		ev.preventDefault();
		if (text !== initialValue.current) {
			setIsmodal({ ...isModal, modal: true, unsavedModal: true });
		} else {
			setIsmodal({ ...isModal, modal: false, unsavedModal: false });
		}
	};
	const discardText = ev => {
		ev.preventDefault();
		if (text !== initialValue.current) {
			setIsmodal({ ...isModal, modal: false, unsavedModal: false });
			setText(initialValue.current);
		}
	};

	return (
		<>
			<BasicButton
				text={text ? translate.edit_instructions : translate.add_instructions}
				id="council-options-edit-attendance-instructions"
				onClick={() => setIsmodal({ ...isModal, modal: true })}
				color="white"
				type="flat"
				textStyle={{
					color: getSecondary()
				}}
			/>
			<AlertConfirm
				open={isModal.modal}
				requestClose={handleClose}
				buttonAccept={translate.save}
				acceptAction={updateAttendanceText}
				buttonCancel={translate.cancel}
				title={text ? translate.edit_instructions : translate.add_instructions}
				bodyText={renderBody()}
			/>
			<UnsavedChangesModal
				translate={translate}
				open={isModal.unsavedModal}
				requestClose={() => {
					setIsmodal({ ...isModal, modal: true, unsavedModal: false });
				}}
				acceptAction={updateAttendanceText}
				cancelAction={discardText}
			/>
		</>
	);
};

export default withApollo(AttendanceTextEditor);
