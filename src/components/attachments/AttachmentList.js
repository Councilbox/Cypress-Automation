import React from "react";
import { AlertConfirm, TextInput } from "../../displayComponents";
import { compose, graphql } from "react-apollo";
import { updateCouncilAttachment, updateAgendaAttachment } from "../../queries";
import AttachmentItem from "./AttachmentItem";
import { splitExtensionFilename } from '../../utils/CBX';


const AttachmentList = ({ translate, attachments, isAgendaAttachment, ...props }) => {
	const [state, setState] = React.useState({
		showModal: false,
		data: {
			name: ""
		},
		errors: {
			name: ""
		}
	});

	const updateState = object => {
		setState({
			...state,
			data: {
				...state.data,
				...object
			}
		});
	};

	const _renderModalBody = () => {
		return (
			<div style={{ width: window.innerWidth > 650 ? "650px" : '100%' }}>
				<TextInput
					floatingText={translate.name}
					type="text"
					errorText={state.errors.name}
					value={state.data.filename}
					onChange={event =>
						updateState({
							filename: event.target.value
						})
					}
				/>
			</div>
		);
	};

	const editIndex = index => {
		setState({
			...state,
			showModal: true,
			editId: attachments[index].id,
			data: {
				...state.data,
				...splitExtensionFilename(attachments[index].filename)
			}
		});
	};

	const updateAttachment = async () => {
		let response;
		if (isAgendaAttachment) {
			response = await props.updateAgendaAttachment({
				variables: {
					id: state.editId,
					filename: `${state.data.filename}.${state.data.extension}`
				}
			});
		} else {
			response = await props.updateCouncilAttachment({
				variables: {
					id: state.editId,
					filename: `${state.data.filename}.${state.data.extension}`
				}
			});
		}
		
		if (response) {
			setState({
				...state,
				showModal: false
			});
			props.refetch();
		}
	};

	const deleteAttachment = id => {
		setState({
			...state,
			deletingId: id
		});
		props.deleteAction(id);
	};

	return (
		<div
			style={{
				width: "100%"
			}}
		>
			{attachments.map((attachment, index) => {
				return (
					<AttachmentItem
						edit={true}
						key={`attachment${index}`}
						attachment={attachment}
						translate={translate}
						loadingId={props.loadingId}
						removeAttachment={deleteAttachment}
						editName={() => {
							editIndex(index);
						}}
					/>
				);
			})}
			<AlertConfirm
				requestClose={() => setState({ ...state, showModal: false })}
				open={state.showModal}
				acceptAction={updateAttachment}
				buttonAccept={translate.accept}
				buttonCancel={translate.cancel}
				bodyText={_renderModalBody()}
				title={translate.edit}
			/>
		</div>
	);
}

export default compose(
	graphql(updateCouncilAttachment, {
		name: "updateCouncilAttachment"
	}),
	graphql(updateAgendaAttachment, {
		name: "updateAgendaAttachment"
	}))(AttachmentList);
