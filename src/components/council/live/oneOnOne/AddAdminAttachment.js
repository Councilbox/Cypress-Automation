import React from 'react';
import { withApollo } from 'react-apollo';
import { useCouncilAttachments } from '../../../../hooks/council';
import AddCouncilAttachmentButton from '../../editor/attachments/AddCouncilAttachmentButton';


const AddAdminAttachment = ({
	company, translate, council, client, refetch
}) => {
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
			refetch();
		};
	};

	return (
		<>
			<div style={{ maxWidth: '20em', marginTop: '1em' }}>
				<AddCouncilAttachmentButton
					company={company}
					text={translate.add_documentation}
					handleFile={handleFile}
					loading={loading}
					translate={translate}
				/>
			</div>

		</>
	);
};

export default withApollo(AddAdminAttachment);
