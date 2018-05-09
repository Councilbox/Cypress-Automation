import React, { Component } from 'react';
import { Checkbox, AlertConfirm, Icon } from "../../../displayComponents";
import { Typography } from 'material-ui';
import { graphql, compose } from 'react-apollo';
import { addRepresentative } from '../../../queries';
import RepresentativeForm from '../participants/RepresentativeForm';
import { languages } from '../../../queries/masters';


class AddRepresentativeModal extends Component {

    constructor(props){
        super(props);
        this.state = {
            success: '',
            errors: {},
            representative: {
                ...newRepresentativeInitialValues
            }
        };
    }

    close = () => {
        this.props.requestClose();
        this.resetForm();
    };

    addRepresentative = async () => {
        const response = await this.props.addRepresentative({
            variables: {
                representative: this.state.representative,
                participantId: this.props.participant.id
            }
        });
        if(response){
            if(response.data.addRepresentative.success){
                this.props.refetch();
                this.close();
            }else{
                if(response.data.addRepresentative.message === "601"){
                    this.setState({
                        errors: {
                            email: this.props.translate.repeated_email
                        }
                    })
                }
            }
        }
    }

    resetForm = () => {
        this.setState({
            representative: {
                ...newRepresentativeInitialValues
            }
        });
    }

    updateRepresentative = (object) => {
        this.setState({
            representative: {
                ...this.state.representative,
                ...object
            }
        });
    }

    _renderReminderBody(){
        const { translate } = this.props;

        if(this.state.sending){
            return(
                <div>
                    {translate.sending_convene_reminder}
                </div>
            )
        }


        return(
            <RepresentativeForm
                translate={this.props.translate}
                representative={this.state.representative}
                updateState={this.updateRepresentative}
                errors={this.state.errors}
                languages={this.props.data.languages}
            />
        )
    }

    render() {
        const { translate } = this.props;

        return(
            <AlertConfirm
                requestClose={this.close}
                open={this.props.show}
                acceptAction={this.addRepresentative}
                buttonAccept={translate.send}
                buttonCancel={translate.close}
                bodyText={this._renderReminderBody()}
                title={translate.add_representative}
            />
        );
    }
}

export default compose(
    graphql(addRepresentative, {
        name: 'addRepresentative',
        options: {
            errorPolicy: 'all'
        }
    }),
    graphql(languages)
)(AddRepresentativeModal);

const newRepresentativeInitialValues = {
    language: 'es',
    personOrEntity: 0,
    name: '',
    surname: '',
    position: '',
    dni: '',
    email: '',
    phone: ''
};