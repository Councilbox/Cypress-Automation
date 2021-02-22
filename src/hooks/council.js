import React from 'react';
import { addCouncilAttachment as addMutation, removeCouncilAttachment as removeMutation } from '../queries';

export const useCouncilAttachments = ({ client }) => {
	const [loading, setLoading] = React.useState(false);

	const addCouncilAttachment = async attachment => {
		setLoading(true);
		const response = await client.mutate({
			mutation: addMutation,
			variables: {
				attachment
			}
		});
		if (response) {
			setLoading(false);
		}
	};

	const removeCouncilAttachment = async ({
		attachmentId,
		councilId
	}) => {
		setLoading(true);
		const response = await client.mutate({
			mutation: removeMutation,
			variables: {
				attachmentId,
				councilId
			}
		});
		if (response) {
			setLoading(false);
		}
	};

	return {
		addCouncilAttachment,
		loading,
		removeCouncilAttachment
	};
};
