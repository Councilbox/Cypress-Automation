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
                bodyText={<div>Esta acción no se puede revertir, confirmar voto?</div>}//TRADUCCION
                title={this.props.translate.warning}
            />
        )
    }
}

export default VoteConfirmationModal