import React from 'react';
import { AlertConfirm } from '../../../displayComponents';

class VoteConfirmationModal extends React.Component {

    render(){
        return (
            <AlertConfirm
                requestClose={this.props.requestClose}
                open={this.props.open}
                acceptAction={this.props.acceptAction}
                buttonAccept={this.props.translate.accept}
                buttonCancel={this.props.translate.cancel}
                bodyText={<div>{this.props.translate.cant_revert_confirm}</div>}
                title={this.props.translate.warning}
            />
        )
    }
}

export default VoteConfirmationModal