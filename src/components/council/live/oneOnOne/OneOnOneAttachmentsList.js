import React from 'react';
import { withApollo } from 'react-apollo';
import { LoadingSection } from '../../../../displayComponents';
import AttachmentDownload from '../../../attachments/AttachmentDownload';
import AddAdminAttachment from './AddAdminAttachment';

const OneOnOneAttachmentsList = ({
	company, council, translate, refetch
}) => {
	const participantAttachments = council.attachments.filter(a => a.participantId);
	const adminAttachments = council.attachments.filter(a => !a.participantId);

	return (
		<div style={{ padding: '1em' }}>
			<h4>{translate.dashboard_documentation}</h4>
			{council ?
				council.attachments.length > 0 ?
					<>
						<h6 style={{ marginTop: '1em' }}>{translate.attachments_added_by_participant}</h6>
						{participantAttachments.length > 0 ?
							participantAttachments.map((attachment, index) => (
								<AttachmentDownload
									key={`attachment_Download${index}`}
									attachment={attachment}
									// loading={this.state.downloading}
									spacing={0.5}
								/>
							))
							: translate.no_results
						}

						<h6 style={{ marginTop: '1em' }}>{translate.attachments_added_by_admin}</h6>
						{adminAttachments.length > 0 ?
							adminAttachments.map((attachment, index) => (
								<AttachmentDownload
									key={`attachment_Download${index}`}
									attachment={attachment}
									// loading={this.state.downloading}
									spacing={0.5}
								/>
							))
							: translate.no_results
						}
					</>
					: translate.no_results

				: <LoadingSection />
			}
			<AddAdminAttachment
				company={company}
				council={council}
				refetch={refetch}
				translate={translate}
			/>
		</div>
	);
};

export default withApollo(OneOnOneAttachmentsList);
