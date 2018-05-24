import React, { Component } from 'react';
import { AlertConfirm } from "../../../displayComponents";
import { compose, graphql } from 'react-apollo';
import { addGuest } from '../../../queries';
import RepresentativeForm from '../participants/RepresentativeForm';
import { languages } from '../../../queries/masters';


class AddGuestModal extends Component {

    close = () => {
        this.props.requestClose();
        this.resetForm();
    };
    addGuest = async () => {
        const response = await this.props.addGuest({
            variables: {
                guest: {
                    ...this.state.guest,
                    position: this.props.translate.guest,
                    councilId: this.props.council.id
                }

            }
        });
        if (response) {
            if (response.data.addGuest.success) {
                this.props.refetch();
                this.close();
            } else {
                if (response.data.addGuest.message === "601") {
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
            guest: {
                ...newGuestInitialValues
            }
        });
    }
    updateGuest = (object) => {
        this.setState({
            guest: {
                ...this.state.guest, ...object
            }
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            success: '',
            errors: {},
            guest: {
                ...newGuestInitialValues
            }
        };
    }

    _renderReminderBody() {
        const { translate } = this.props;

        if (this.state.sending) {
            return (<div>
                {translate.sending_convene_reminder}
            </div>)
        }


        return (<div style={{ maxWidth: '850px' }}>
            <RepresentativeForm
                guest={true}
                translate={this.props.translate}
                representative={this.state.guest}
                updateState={this.updateGuest}
                errors={this.state.errors}
                languages={this.props.data.languages}
            />
        </div>)
    }

    render() {
        const { translate } = this.props;

        return (<AlertConfirm
            requestClose={this.close}
            open={this.props.show}
            acceptAction={this.addGuest}
            buttonAccept={translate.send}
            buttonCancel={translate.close}
            bodyText={this._renderReminderBody()}
            title={translate.add_guest}
        />);
    }
}

export default compose(graphql(addGuest, {
    name: 'addGuest',
    options: {
        errorPolicy: 'all'
    }
}), graphql(languages))(AddGuestModal);

const newGuestInitialValues = {
    language: 'es',
    personOrEntity: 0,
    name: '',
    surname: '',
    position: '',
    dni: '',
    email: '',
    phone: ''
};