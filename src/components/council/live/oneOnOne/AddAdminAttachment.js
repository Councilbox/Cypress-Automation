import React from 'react';
import { withApollo } from 'react-apollo';
import { useCouncilAttachments } from '../../../../hooks/council';
import AddCouncilAttachmentButton from '../../editor/attachments/AddCouncilAttachmentButton';


const AddAdminAttachment = ({ company, translate, council, client }) => {
	const {
		addCouncilAttachment,
		loading
	} = useCouncilAttachments({ client });

	const handleFile = async event => {
		const file = event.nativeEvent.target.files[0];
		if (!file) {
			return;
		}

		const reader = new FileReader();
		reader.readAsBinaryString(file);

		reader.onload = async loadEvent => {
			const fileInfo = {
				filename: file.name,
				filetype: file.type,
				filesize: loadEvent.loaded,
				base64: btoa(loadEvent.target.result),
				councilId: council.id
			};
			await addCouncilAttachment(fileInfo);
		};
	};

	return (
		<>
			<AddCouncilAttachmentButton
				company={company}
				handleFile={handleFile}
				loading={loading}
				translate={translate}
			/>
		</>
	);
};

export default withApollo(AddAdminAttachment);
