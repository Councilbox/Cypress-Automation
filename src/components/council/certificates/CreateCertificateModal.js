import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { AlertConfirm } from '../../../displayComponents';
import DocumentPreview from '../../documentEditor/DocumentPreview';
import { buildDocVariable } from '../../documentEditor/utils';
import { removeHTMLTags } from '../../../utils/CBX';

export const createCertificateMutation = gql`
	mutation CreateCertificate($certificate: CertificateInput) {
		createCertificate(certificate: $certificate) {
			success
			message
		}
	}
`;

const CreateCertificateModal = ({
	doc, open, requestClose, setError, client, councilId, options, generatePreview, company, translate, closeEditor
}) => {
	const [loading, setLoading] = React.useState(false);

	const createCertificate = async () => {
		if (!checkRequiredFields()) {
			setLoading(true);
			const response = await client.mutate({
				mutation: createCertificateMutation,
				variables: {
					certificate: {
						councilId,
						document: buildDocVariable(doc, options),
						title: removeHTMLTags(doc.find(block => block.type === 'cert_title').text)
					}
				}
			});

			if (!response.errors) {
				if (response.data.createCertificate.success) {
					setLoading(false);
					closeEditor();
				}
			}
		}
	};

	const checkRequiredFields = () => {
		const titleBlock = doc.find(block => block.type === 'cert_title');
		let error = null;

		if (!titleBlock.text) {
			error = translate.cert_title_error;
		}

		if (error) {
			setError(error);
			requestClose();
			return true;
		}
		return false;
	};

	const renderBody = () => (
		<div style={{ marginTop: '12px', height: '100%', border: '1px solid gainsboro' }}>
			<DocumentPreview
				translate={translate}
				options={options}
				doc={doc}
				generatePreview={generatePreview}
				company={company}
			/>
		</div>
	);

	return (
		<AlertConfirm
			open={open}
			loadingAction={loading}
			acceptAction={createCertificate}
			requestClose={requestClose}
			buttonAccept={translate.accept}
			buttonCancel={translate.cancel}
			title={translate.certificate_generate}
			bodyText={renderBody()}
		/>
	);
};

export default withApollo(CreateCertificateModal);
