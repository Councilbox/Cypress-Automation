import React, { Component } from 'react';
import { FontIcon, IconButton } from 'material-ui';
import { BasicButton, LoadingSection, FileUploadButton } from '../displayComponents';
import DeleteForever from 'material-ui/svg-icons/action/delete-forever';
import { primary } from '../../styles/colors';
import { graphql, compose } from 'react-apollo';
import { getCouncilDataStepFour, saveAttachmentMutation, deleteAttachmentMutation, saveCouncilData } from '../../queries';
import { urlParser } from '../../utils';

class CouncilEditorAttachments extends Component {

    constructor(props){
        super(props);
        this.state = {
            uploading: false
        }
    }

    handleFile = (event) => {
        const file = event.nativeEvent.target.files[0];
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
                    data: this.props.data.council
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
                <FileUploadButton 
                    text={translate.new_add}
                    color={primary}
                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    icon={<FontIcon className="material-icons">publish</FontIcon>}
                    onChange={this.handleFile}
                />

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