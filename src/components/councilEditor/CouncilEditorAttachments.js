import React, { Component, Fragment } from 'react';
import { BasicButton, LoadingSection, FileUploadButton, ProgressBar, ErrorAlert, ButtonIcon, Grid, GridItem } from '../displayComponents';
import { getPrimary, getSecondary } from '../../styles/colors';
import { graphql, compose } from 'react-apollo';
import { MAX_FILE_SIZE } from '../../constants';
import { Typography } from "material-ui";
import AttachmentList from '../attachments/AttachmentList';
import { showAddCouncilAttachment } from '../../utils/CBX';
import { councilStepFour, addCouncilAttachment, removeCouncilAttachment, updateCouncil } from '../../queries';


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
                totalSize = attachments.reduce((a, b) => a + parseInt(b.filesize, 10), 0)
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
        if(file.size / 1000 + parseInt(this.state.totalSize, 10) > MAX_FILE_SIZE){
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
                councilId: this.props.councilID
            };

            this.setState({
                uploading: true
            });
            const response = await this.props.addAttachment({
                variables: {
                    attachment: fileInfo
                }
            })
            if(response){
                this.props.data.refetch();
                this.setState({
                    uploading: false
                });
            }
        }
    }

    removeCouncilAttachment = async (attachmentID) => {
        this.props.removeCouncilAttachment({
            variables: {
                attachmentId : attachmentID,
                councilId : this.props.councilID
            },
            refetchQueries: [{
                query: councilStepFour,
                name: "data",
                variables: {
                    id: this.props.councilID
                }
            }]
        });
    }

    updateCouncil = () => {
        const { attachments, __typename, ...council } = this.props.data.council;
        this.props.updateCouncil({
            variables: {
                council: {
                    ...council,
                    step: this.props.actualStep > 4? this.props.actualStep : 4
                }
            }
        })
    }


    nextPage = () => {
        if(true){
            this.updateCouncil();
            this.props.nextStep();
        }
    }

    previousPage = () => {
        if(true){
            this.updateCouncil();
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

        const { attachments } = this.props.data.council;
        const primary = getPrimary()

        return(
            <div style={{width: '100%', height: '100%', padding: '2em'}}>
                <Grid>
                    <GridItem xs={12} lg={12} md={12}>
                        <Typography variant="title">
                            {translate.attachment_files}
                        </Typography>
                    </GridItem>
                    <GridItem xs={12} md={12} lg={12} style={{display: 'flex', flexDirection: 'row'}}>
                        {showAddCouncilAttachment(attachments) &&
                            <Fragment>
                                <FileUploadButton 
                                    text={translate.new_add}
                                    color={primary}
                                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                                    icon={<ButtonIcon type="publish" color='white' />}
                                    onChange={this.handleFile}
                                />
                                <div style={{width: '3em'}}>
                                    {this.state.uploading && 
                                        <LoadingSection size={25} /> 
                                    }
                                </div>
                            </Fragment>
                        }
                    </GridItem>
                </Grid>             
                <Typography variant="subheading" style={{marginTop: '1.5em'}}>
                    {translate.new_files_desc}
                </Typography>

                <ProgressBar 
                    value={this.state.totalSize > 0 ? (this.state.totalSize / MAX_FILE_SIZE ) * 100 : 0} 
                    color={getSecondary()}
                    style={{height: '1.2em'}}
                />

                <Typography variant="caption">
                    {(this.state.totalSize / 1024).toFixed(2)}/Mb
                </Typography>

                {attachments.length > 0 &&
                    <AttachmentList
                        attachments={attachments}
                        refetch={this.props.data.refetch}
                        deleteAction={this.removeCouncilAttachment}
                        translate={translate}
                    />
                }
                <Grid style={{marginTop: '3em'}}>
                    <GridItem xs={12} md={12} lg={12}>
                        <div style={{float: 'right'}}>
                            <BasicButton
                                text={translate.previous}
                                color={primary}
                                textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                                textPosition="after"
                                onClick={this.props.previousStep}
                            />
                            <BasicButton
                                text={translate.save}
                                color={primary}
                                textStyle={{color: 'white', fontWeight: '700', marginLeft: '0.5em', marginRight: '0.5em', fontSize: '0.9em', textTransform: 'none'}}
                                icon={<ButtonIcon color='white' type="save" />}
                                textPosition="after"
                                onClick={this.updateCouncil} 
                            />
                            <BasicButton
                                text={translate.next}
                                color={primary}
                                textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                                textPosition="after"
                                onClick={this.nextPage}
                            />
                        </div>
                    </GridItem>
                </Grid>


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
    graphql(councilStepFour, {
        name: "data",
        options: (props) => ({
            variables: {
                id: props.councilID,
            }
        })
    }),
    graphql(addCouncilAttachment, {
        name: 'addAttachment'
    }),

    graphql(updateCouncil, {
        name: 'updateCouncil'
    }),

    graphql(removeCouncilAttachment, {
        name: 'removeCouncilAttachment'
    })
)(CouncilEditorAttachments);