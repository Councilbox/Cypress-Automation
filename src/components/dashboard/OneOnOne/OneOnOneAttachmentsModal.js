import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { AlertConfirm, LoadingSection } from '../../../displayComponents';
import { useQueryReducer } from '../../../hooks';
import AttachmentDownload from '../../attachments/AttachmentDownload';

const OneOnOneAttachmentsModal = ({
	client, translate, council, open, requestClose
}) => {
	const { data, loading } = useQueryReducer({
		client,
		query: gql`
			query council($id: Int!){
				council(id: $id){
					id
					name
					attachments {
						filename
						filesize
						id
						participantId
					}
				}
			}
		`,
		variables: {
			id: council.id
		}
	});

	return (
		<AlertConfirm
			title={translate.attachments}
			bodyText={
				<div>
					{!loading ?
						data.council.attachments.length > 0 ? data.council.attachments.map((attachment, index) => (
							<AttachmentDownload
								attachment={attachment}
								// loading={this.state.downloading}
								spacing={0.5}
								key={`attachment_key_${index}`}
							/>
						))
							: translate.no_results

						: <LoadingSection /> }
				</div>
			}
			buttonCancel={translate.close}
			requestClose={requestClose}
			open={open}
		/>
	);
};

export default withApollo(OneOnOneAttachmentsModal);
