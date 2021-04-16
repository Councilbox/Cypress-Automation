import gql from 'graphql-tag';
import React from 'react';
import { addCouncilAttachment as addMutation, removeCouncilAttachment as removeMutation } from '../queries';
import { downloadFile } from '../utils/CBX';

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


export const useDownloadCouncilMessages = ({ client, translate }) => {
	const [downloading, setDownloading] = React.useState(false);

	const downloadCouncilMessagesPDF = async council => {
		setDownloading(true);
		const response = await client.query({
			query: gql`
				query participantCommentsPDF($councilId: Int!) {
					participantCommentsPDF(
						councilId: $councilId 
					)
				}
			`,
			variables: {
				councilId: council.id
			}
		});

		if (response) {
			if (response.data.participantCommentsPDF) {
				setDownloading(false);
				downloadFile(
					response.data.participantCommentsPDF,
					'application/pdf',
					`${translate.comments}_${council.id}`
				);
			}
		}
	};

	return {
		downloading,
		downloadCouncilMessagesPDF
	};
};
