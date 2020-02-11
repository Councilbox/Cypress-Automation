import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { AlertConfirm } from '../../../displayComponents';
import DocumentPreview from '../../documentEditor/DocumentPreview';

export const createCertificateMutation = gql`
	mutation CreateCertificate($certificate: CertificateInput) {
		createCertificate(certificate: $certificate) {
			success
			message
		}
	}
`;

const CreateCertificateModal = ({ doc, open, requestClose, client, councilId, options, generatePreview, company, translate }) => {
    const [loading, setLoading] = React.useState(false);
    
    const createCertificate = async () => {
        //if(!checkRequiredFields()){
            setLoading(true);
            const response = await client.mutate({
                mutation: createCertificateMutation,
                variables: {
                    certificate: {
                        councilId,
						document: {
							fragments: doc,
							options
						}
                    }
                }
            })

            if(!response.errors){
                if(response.data.createCertificate.success){
                    setLoading(false);
                    requestClose();
                }
            }
        //}
    }

    const renderBody = () => {
        return (
            <div style={{marginTop: '12px', height: '100%', border: '1px solid gainsboro'}}>
				<DocumentPreview
					translate={translate}
					options={options}
					doc={doc}
					generatePreview={generatePreview}
					company={company}
				/>
			</div>
        )
    }

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
    )
}

export default withApollo(CreateCertificateModal)