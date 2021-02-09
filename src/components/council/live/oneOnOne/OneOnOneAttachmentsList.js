import React from 'react';
import { withApollo } from 'react-apollo';
import { LoadingSection } from '../../../../displayComponents';
import AttachmentDownload from '../../../attachments/AttachmentDownload';

const OneOnOneAttachmentsList = ({ council, translate }) => (
        <div style={{ padding: '1em' }}>
            <h4>{translate.dasboard_documentation}</h4>
            {council ?
                council.attachments.length > 0 ? council.attachments.map((attachment, index) => (
                    <AttachmentDownload
                        key={`attachment_Download${index}`}
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
    )

export default withApollo(OneOnOneAttachmentsList);
