import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { AlertConfirm, HelpPopover } from '../../../displayComponents';
import { downloadFile } from '../../../utils/CBX';
import { getPrimary } from '../../../styles/colors';


const DownloadUnsignedProxy = ({
	action, translate, client, participant, delegation
}) => {
	const [loading, setLoading] = React.useState(false);
	const primary = getPrimary();


	const downloadUnsignedProxy = async () => {
		if (!loading) {
			setLoading(true);
			const response = await client.query({
				query: gql`
					query UnsignedProxyPDF($participantId: Int!, $delegateId: Int!){
						unsignedProxyPDF(participantId: $participantId, delegateId: $delegateId)
					}
				`,
				variables: {
					participantId: participant.id,
					delegateId: delegation.id
				}
			});

			if (response) {
				if (response.data.unsignedProxyPDF) {
					downloadFile(
						response.data.unsignedProxyPDF,
						'application/pdf',
						`Proxy_${participant.name}${participant.surname ? `_${participant.surname || ''}` : ''}.pdf`.replace(' ', '_')
					);
					await action();
					setLoading(false);
				}
			}
		}
	};

	return (
		<React.Fragment>
			<div style={{
				borderRadius: '4px',
				boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.5)',
				color: primary,
				marginBottom: '1em',
				padding: '0.6em 1em',
				display: 'flex',
				alignItems: 'center',
				width: '100%'
			}}>
				<div style={{
					whiteSpace: 'nowrap',
					overflow: 'hidden',
					textOverflow: 'ellipsis',
					cursor: 'pointer'
				}} onClick={downloadUnsignedProxy}>
					{translate.send_intention_download_PDF}
				</div>
				<HelpPopover
					title={'Información'}
					content={
						<div>
							{translate.document_proxy_download_help}
						</div>
					}
				/>
			</div>
			<AlertConfirm

			/>
		</React.Fragment>
	);
};

export default withApollo(DownloadUnsignedProxy);
