import React, { Component } from 'react';
import { FontIcon, IconButton } from 'material-ui';
import { BasicButton, LoadingSection, FileUploadButton, ProgressBar, ErrorAlert } from '../displayComponents';
import DeleteForever from 'material-ui/svg-icons/action/delete-forever';
import { primary, secondary } from '../../styles/colors';
import { graphql, compose } from 'react-apollo';
import { maxFileSize } from '../../constants';
import { getCouncilDataStepFour, saveAttachmentMutation, deleteAttachmentMutation, saveCouncilData } from '../../queries';
import { urlParser } from '../../utils';

class CouncilEditorAttachments extends Component {

    constructor(props){
        super(props);
        this.state = {
            uploading: false,
            totalSize: 0,
            alert: false
        }
    }

    componentDidMount(){
        this.props.data.refetch();
    }

    componentWillReceiveProps(nextProps){
        if(!nextProps.data.council){
            return;
        }
        const { attachments } = nextProps.data.council;
        let totalSize = 0;
        if(attachments.length !== 0){
            if(attachments.length > 1){
                totalSize = attachments.reduce((a, b) => a + parseInt(b.filesize), 0)
            }else{
                totalSize = attachments[0].filesize;
            }
        }

        if(attachments){
            this.setState({
                totalSize: totalSize
            });
        }
    } 

    handleFile = (event) => {
        const file = event.nativeEvent.target.files[0];
        if(!file){
            return;
        }
        if(file.size / 1000 + this.state.totalSize > maxFileSize){
            this.setState({
                alert: true
            });
            return;
        }
        let reader = new FileReader();
        reader.readAsDataURL(file);


        reader.onload = async () => {
            let fileInfo = {
                filename: file.name,
                filetype: file.type,
                filesize: Math.round(file.size / 1000),
                base64: reader.result,
                council_id: this.props.councilID
            };

            this.setState({
                uploading: true
            });
            const response = await this.props.sendAttachment({
                variables: {
                    data: urlParser({data: {
                        ...fileInfo
                    }})
                },
                refetchQueries: [{
                    query: getCouncilDataStepFour,
                    name: "data",
                    variables: {
                        councilInfo: {
                            companyID: this.props.companyID,
                            councilID: this.props.councilID,
                            step: 4
                        }
                    }
                }]
            })
            if(response){
                this.setState({
                    uploading: false
                });
            }
        }
    }

    deleteAttachment = async (attachmentID) => {

        const response = this.props.deleteAttachment({
            variables: {
                attachment: {
                    attachment_id : attachmentID,
                    council_id : this.props.councilID
                }
            },

            refetchQueries: [{
                query: getCouncilDataStepFour,
                name: "data",
                variables: {
                    councilInfo: {
                        companyID: this.props.companyID,
                        councilID: this.props.councilID,
                        step: 4
                    }
                }
            }]
        });
    }

    saveDraft = () => {
        this.props.saveCouncil({
            variables: {
                data: urlParser({
                    data: {
                        council: {
                            ...this.props.data.council,
                            step: this.props.actualStep > 4? this.props.actualStep : 4
                        }
                    }
                })
            }
        })
    }


    nextPage = () => {
        if(true){
            this.saveDraft();
            this.props.nextStep();
        }
    }

    previousPage = () => {
        if(true){
            this.saveDraft();
            this.props.previousStep()
        }
    }

    render(){
        const { translate } = this.props;
        if(this.props.data.loading){
            return(
                <LoadingSection />
            );
        }

        return(
            <div style={{width: '100%', height: '100%', padding: '2em'}}>
                {translate.attachment_files.toUpperCase()}
                {this.props.data.council.attachments.length < 5?
                    <FileUploadButton 
                    text={translate.new_add}
                    color={primary}
                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    icon={<FontIcon className="material-icons">publish</FontIcon>}
                    onChange={this.handleFile}
                />
                : 
                    'HAS LLEGADO AL LÍMITE'
                }

                <BasicButton
                    text={translate.save}
                    color={primary}
                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    icon={<FontIcon className="material-icons">save</FontIcon>}
                    textPosition="after"
                    onClick={this.saveDraft} 
                />

                <BasicButton
                    text={translate.previous}
                    color={primary}
                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    textPosition="after"
                    onClick={this.props.previousStep}
                />
                <BasicButton
                    text={translate.next}
                    color={primary}
                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    textPosition="after"
                    onClick={this.nextPage}
                />
                <div>
                    {translate.new_files_desc}
                    <br/>{(this.state.totalSize / 1024).toFixed(2)}/Mb</div>
                <ProgressBar 
                    value={this.state.totalSize > 0 ? (this.state.totalSize / maxFileSize ) * 100 : 0} 
                    color={secondary}
                    style={{height: '1.2em'}}
                />

                {this.props.data.council.attachments.map((attachment) => {
                    return(
                        <div key={attachment.id}>
                            {attachment.filename}
                            <IconButton 
                                iconStyle={{color: primary}}
                                onClick={() => this.deleteAttachment(attachment.id)}
                            >
                                <DeleteForever />
                            </IconButton>
                        </div>
                    );
                })}
                {this.state.uploading && 
                    <div style={{width: '30%', float: 'left'}}>
                        <LoadingSection size={25} /> 
                    </div>
                }
                <ErrorAlert
                    title={translate.error}
                    bodyText={translate.file_exceeds_rest}
                    open={this.state.alert}
                    requestClose={() => this.setState({alert: false})}
                    buttonAccept={translate.accept}
                />
            </div>
        );
    }
}

export default compose(
    graphql(getCouncilDataStepFour, {
        name: "data",
        options: (props) => ({
            variables: {
                councilInfo: {
                    companyID: props.companyID,
                    councilID: props.councilID,
                    step: 4
                }
            }
        })
    }),
    graphql(saveAttachmentMutation, {
        name: 'sendAttachment'
    }),

    graphql(saveCouncilData, {
        name: 'saveCouncil'
    }),

    graphql(deleteAttachmentMutation, {
        name: 'deleteAttachment'
    })
)(CouncilEditorAttachments);