import React from 'react';
import { AlertConfirm } from '../../../../displayComponents';
import SignatureParticipantForm from './SignatureParticipantForm';
import { graphql, compose, withApollo } from 'react-apollo';
import { languages } from '../../../../queries/masters';
import gql from 'graphql-tag';
import { checkValidEmail } from '../../../../utils/validation';

class NewParticipantModal extends React.Component {

    state = {
        data: {
            name: '',
            surname: '',
            dni: '',
            language: 'es',
            position: '',
            email: '',
            phone: '',
            signatureId: this.props.signature.id
        },
        errors: {}
    }

    initialState = this.state;

    componentDidUpdate(prevProps, prevState){
        if(prevProps.open && !this.props.open){
            this.setState(this.initialState);
        }
    }

    checkEmailAvailability = async () => {
        const response = await this.props.client.query({
            query: checkSignatureEmail,
            variables: {
                email: this.state.data.email,
                signatureId: this.props.signature.id
            },
            errorPolicy: 'all'
        });

        return response.data.checkSignatureParticipantEmail.success;
    }

    updateState = object => {
        this.setState({
            data: {
                ...this.state.data,
                ...object
            }
        });
    }

    addSignatureParticipant = async () => {
        if(!await this.checkRequiredFields()){
            const response = await this.props.addSignatureParticipant({
                variables: {
                    participant: {
                        ...this.state.data
                    }
                }
            });

            if(response.data.addSignatureParticipant.id){
                this.props.refetch();
                this.props.requestClose();
            }
        }
    }

    async checkRequiredFields(){
        const errors = {
            name: '',
            surname: '',
            dni: '',
            position: '',
            phone: '',
            email: ''
        }

        let hasError = false;
        const { translate } = this.props;
        const { data } = this.state;

        if(!data.name){
            hasError = true;
            errors.name = translate.field_required;
        }

        if(!data.surname){
            hasError = true;
            errors.surname = translate.field_required;
        }

        if(!data.dni){
            hasError = true;
            errors.dni = translate.field_required;
        }

        if(!data.email){
            hasError = true;
            errors.email = translate.field_required;
        }else{
            if(!checkValidEmail(data.email)){
                hasError = true;
                errors.email = translate.valid_email_required;
            }else{
                if(!await this.checkEmailAvailability()){
                    hasError = true;
                    errors.email = this.props.translate.register_exists_email
                }
            }
        }

        this.setState({
            errors,
            errorState: hasError
        })
        return hasError;
    }

    _renderBody = () => {
        const { languages = {}} = this.props.data;
        return (
            <div
                style={{
                    minWidth: '650px',
                    maxWidth: '90%'
                }}
                {...(this.state.errorState? { onKeyUp: () => this.checkRequiredFields()} : {})}
            >
                <SignatureParticipantForm
                    translate={this.props.translate}
                    participant={this.state.data}
                    errors={this.state.errors}
                    updateState={this.updateState}
                    languages={languages}
                />
            </div>
        )
    }

    render(){
        const { translate } = this.props;
        return (
            <AlertConfirm
                requestClose={this.props.requestClose}
                open={this.props.open}
                acceptAction={this.addSignatureParticipant}
                buttonAccept={translate.accept}
                buttonCancel={translate.cancel}
                bodyText={this._renderBody()}
                title={translate.add_participant}
            />
        );
    }
};

const addSignatureParticipant = gql`
    mutation AddSignatureParticipant($participant: SignatureParticipantInput!){
        addSignatureParticipant(participant: $participant){
            id
        }
    }
`;

const checkSignatureEmail = gql`
    query CheckSignatureParticipantEmail($email: String!, $signatureId: Int!){
        checkSignatureParticipantEmail(email: $email, signatureId: $signatureId){
            success
        }
    }
`;

export default compose(
    graphql(languages),
    graphql(addSignatureParticipant, {
        name: 'addSignatureParticipant'
    }),
)(withApollo(NewParticipantModal));
