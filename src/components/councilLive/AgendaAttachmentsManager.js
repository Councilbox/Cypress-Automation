import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import { CollapsibleSection, FileUploadButton, Icon } from '../displayComponents';
import AttachmentList from '../councilEditor/AttachmentList';
import { darkGrey } from '../../styles/colors';
import { urlParser } from '../../utils';
import { sendAgendaAttachment, deleteAgendaAttachment } from '../../queries';
import { maxFileSize } from '../../constants';

class AgendaAttachmentsManager extends Component {

    constructor(props){
        super(props);
        this.state = {
            open: false
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
                state: 0,
                agenda_id: this.props.agendaID,
                council_id: this.props.councilID
            };

            this.setState({
                uploading: true
            });
            const response = await this.props.sendAgendaAttachment({
                variables: {
                    data: urlParser({data: {
                        ...fileInfo
                    }})
                }
            })
            if(response){
                this.props.refetch();
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
                    agenda_id: this.props.agendaID,
                    council_id : this.props.councilID
                }
            }
        });

        if(response){
            this.props.refetch();
        }
    }

    _button = () => {
        const { attachments } = this.props;

        return(
            <div style={{height: '3em', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{width: '25%', height: '3em', display: 'flex', alignItems: 'center', paddingLeft: '1.5em'}}>
                    <Icon className="material-icons" style={{color: 'grey'}}>description</Icon>
                    <span style={{marginLeft: '0.7em', color: darkGrey, fontWeight: '700'}}>{`${attachments.length}` }</span>
                </div>
                <div style={{width: '25%', display: 'flex', justifyContent: 'flex-end', paddingRight: '2em'}}>
                    <Icon className="material-icons" style={{color: 'grey'}}>keyboard_arrow_down</Icon>
                </div>
            </div>
        )
    }

    _section = () => {
        const { attachments, translate } = this.props;

        return(
            <AttachmentList 
                attachments={attachments}
                translate={translate}
                deleteAction={this.deleteAttachment}
            />
        );
    }

    render(){

        return(
            <div
                style={{
                    width: '100%',
                    backgroundColor: 'lightgrey',
                    position: 'relative'
                }}
            >
                <CollapsibleSection trigger={this._button} collapse={this._section} />
                <div style={{display: 'flex', overflow: 'hidden', height: '3em', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, left: '5em'}}>
                    <FileUploadButton 
                        color={'lightgrey'}
                        textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                        buttonStyle={{width: '1em'}}
                        flat
                        icon={<Icon className="material-icons" style={{fontSize: '1.5em', color: 'grey'}}>control_point</Icon>}
                        onChange={this.handleFile}
                    />
                </div>
            </div>
        );
    }
}

export default compose(
    graphql(sendAgendaAttachment, {
        name: 'sendAgendaAttachment'
    }),

    graphql(deleteAgendaAttachment, {
        name: 'deleteAttachment'
    })
)(AgendaAttachmentsManager);