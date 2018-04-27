import React from 'react';
import { withApollo } from 'react-apollo';
import { downloadCouncilAttachment } from '../../queries';
import { CircularProgress } from 'material-ui';
import { getSecondary } from '../../styles/colors';
import FontAwesome from 'react-fontawesome';
import { printPrettyFilesize, downloadFile } from '../../utils/CBX';


class AttachmentDownload extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            downloading: false
        }
    }

    downloadAttachment = async (id) => {
        this.setState({
            downloading: true
        });

        const response = await this.props.client.query({
            query: downloadCouncilAttachment,
            variables: {
                attachmentId: this.props.attachment.id
            }  
        });

        if(response){
            if(response.data.councilAttachment.base64){
                const file = response.data.councilAttachment;
                downloadFile(file.base64, file.filetype, file.filename);
            }
            this.setState({
                downloading: false
            });
        }
    }

    render() {
        const { loading, attachment, spacing = 0 } = this.props;

        return(
            <div 
                style={{
                    display: 'inline',
                    cursor: 'pointer',
                    padding: '0.6em',
                    border: `1px solid ${getSecondary()}`,
                    color: getSecondary(),
                    margin: `${spacing}em`
                }}
                onClick={() => this.downloadAttachment(attachment.filename)}
            >
                {this.state.downloading?
                    <CircularProgress size={14} color={'secondary'} style={{marginRight: '0.8em'}} />
                :
                    <FontAwesome
                        name={'download'}
                        style={{fontSize: '0.9em', color: getSecondary(), marginRight: '0.8em'}}
                    /> 
                }

                {`${attachment.filename} (${printPrettyFilesize(attachment.filesize)})`}
            </div>
        )
    }
}

export default withApollo(AttachmentDownload);