import gql from 'graphql-tag';
import React from 'react';
import { withApollo } from 'react-apollo';
import FontAwesome from 'react-fontawesome';
import { AlertConfirm, BasicButton } from '../../../../displayComponents';
import withSharedProps from '../../../../HOCs/withSharedProps';
import { downloadCBXData } from '../../../../queries';
import { getSecondary } from '../../../../styles/colors';
import { downloadFile } from '../../../../utils/CBX';
import CBXDocumentLayout from '../../../documentEditor/CBXDocumentLayout';


const CbxDataModal = ({
 open, requestClose, participant, translate, client, company
}) => {
    const [html, setHtml] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const secondary = getSecondary();
    const [downloading, setDownloading] = React.useState(false);

	const download = async () => {
		setDownloading(true);
		const response = await client.mutate({
            mutation: downloadCBXData,
			variables: {
                participantId: participant.id
			}
		});

		if (response) {
			if (response.data.cbxData) {
				downloadFile(response.data.cbxData, 'application/pdf', `CbxData_${participant.id}`);
            }
            setDownloading(false);
		}
	};


    const getData = React.useCallback(async () => {
        const response = await client.mutate({
            mutation: gql`
                mutation CBXDataHTML($participantId: Int!){
                    cbxDataHtml(participantId: $participantId)
                }
            `,
            variables: {
                participantId: participant.id
            }
        });
        setHtml(response.data.cbxDataHtml);
        setLoading(false);
    }, [participant.id]);

    React.useEffect(() => {
        if (open) {
            getData();
        }
    }, [getData, open]);

    return (
        <AlertConfirm
            open={open}
            requestClose={requestClose}
            title={translate.participant_data}
            bodyText={
                <>
                    <BasicButton
                        text={translate.download_cbxdata}
                        color={'white'}
                        type="flat"
                        loading={downloading}
                        loadingColor={secondary}
                        onClick={download}
                        buttonStyle={{ marginTop: '0.5em', border: `1px solid ${secondary}` }}
                        textStyle={{
                            color: secondary,
                            fontWeight: '700',
                            fontSize: '0.9em',
                            textTransform: 'none'
                        }}
                        icon={
                            <FontAwesome
                                name={'file-pdf-o'}
                                style={{
                                    fontSize: '1em',
                                    color: secondary,
                                    marginLeft: '0.3em'
                                }}
                            />
                        }
                        textPosition="after"
                    />
                    <div style={{ fontSize: '0.9em' }}>
                        <CBXDocumentLayout
                            options={{
                                stamp: true
                            }}
                            company={company}
                            loading={loading}
                            preview={html}
                        />
                    </div>

                </>

            }
        />
    );
};

export default withSharedProps()(withApollo(CbxDataModal));
