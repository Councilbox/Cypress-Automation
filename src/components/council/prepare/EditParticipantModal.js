import React, { Component } from 'react';
import { AlertConfirm } from '../../../displayComponents';
import ConvenedParticipantEditor from './modals/ConvenedParticipantEditor';

class EditParticipantModal extends Component {

    saveParticipant = () => {
       // console.log(this.editor);
        this.editor.getWrappedInstance().updateParticipant();
    }


    _renderEditBody = () => {
        if(!!this.props.participant) {
            const { notifications, ...participant } = this.props.participant;
            return(
                <div style={{maxWidth: '950px'}}>
                    <ConvenedParticipantEditor
                        ref={(editor) => this.editor = editor}
                        requestClose={() => this.props.requestClose()}
                        translate={this.props.translate}
                        participant={participant}
                        hideButtons={true}
                        participations={this.props.participations}
                    />
                </div>
            );
        }
        return(<div />);
    }


    render(){
        const { translate } = this.props;

        return(
            <AlertConfirm
                requestClose={this.props.requestClose}
                open={this.props.open}
                acceptAction={() => this.saveParticipant()}
                buttonAccept={translate.accept}
                buttonCancel={translate.close}
                bodyText={this._renderEditBody()}
                title={translate.edit_participant}
            />
        )
    }
}

export default EditParticipantModal;