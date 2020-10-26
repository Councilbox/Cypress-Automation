import React from 'react';
import { AlertConfirm, LoadingSection } from '../../../displayComponents';
import { withApollo } from 'react-apollo';
import { useQueryReducer } from '../../../hooks';
import gql from 'graphql-tag';
import AttachmentDownload from '../../attachments/AttachmentDownload';

const OneOneOneAttachmentsModal = ({ client, translate, council, open, requestClose }) => {
    const { data, loading, errors } = useQueryReducer({
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

    console.log(data);

    return (
        <AlertConfirm
            title={translate.attachments}
            bodyText={
                <div>
                    {!loading ?
                        data.council.attachments.length > 0 ? data.council.attachments.map(attachment => (
                            <AttachmentDownload
                                attachment={attachment}
                                //loading={this.state.downloading}
                                spacing={0.5}
                            />
                        ))
                        :
                            translate.no_results
                    
                    :
                    
                    <LoadingSection /> }
                </div>
            }
            buttonCancel={translate.close}
            requestClose={requestClose}
            open={open}
        />
    )
}

export default withApollo(OneOneOneAttachmentsModal);
