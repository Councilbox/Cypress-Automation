import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import { CollapsibleSection, FileUploadButton, Icon } from '../displayComponents';
import AttachmentList from '../councilEditor/AttachmentList';
import { darkGrey } from '../../styles/colors';
import { addAgendaAttachment, removeAgendaAttachment } from '../../queries';
import { maxFileSize } from '../../constants';

class AgendaAttachmentsManager extends Component {

    constructor(props){
        super(props);
        this.state = {
            open: false,
            loadingId: ''
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
                agendaId: this.props.agendaID,
                councilId: this.props.councilID
            };

            this.setState({
                uploading: true
            });
            const response = await this.props.addAgendaAttachment({
                variables: {
                    attachment: fileInfo
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

    removeAgendaAttachment = async (attachmentID) => {
        this.setState({
            loadingId: attachmentID
        });

        const response = await this.props.removeAgendaAttachment({
            variables: {
                attachmentId : attachmentID,
                agendaId: this.props.agendaID
            }
        });

        if(response){
            const refetch = await this.props.refetch();
            if(refetch){
                this.setState({loadingId: ''});
            }
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
                loadingId={this.state.loadingId}
                deleteAction={this.removeAgendaAttachment}
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
                <div style={{overflow: 'hidden', height: '3em', position: 'absolute', top: '5px', left: '5em', margin: 0, padding: 0}}>
                    <FileUploadButton 
                        color={'lightgrey'}
                        textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                        buttonStyle={{maxWidth: '1em', height: '3em'}}
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
    graphql(addAgendaAttachment, {
        name: 'addAgendaAttachment'
    }),

    graphql(removeAgendaAttachment, {
        name: 'removeAgendaAttachment'
    })
)(AgendaAttachmentsManager);