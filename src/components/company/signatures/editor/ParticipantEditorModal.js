import React from 'react';
import { AlertConfirm, BasicButton } from '../../../../displayComponents';
import SignatureParticipantForm from './SignatureParticipantForm';
import { graphql, compose, withApollo } from 'react-apollo';
import { languages } from '../../../../queries/masters';
import gql from 'graphql-tag';
import { checkValidEmail } from '../../../../utils/validation';

class ParticipantEditorModal extends React.Component {

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

    static getDerivedStateFromProps(nextProps, prevState){
        if(!nextProps.data.loading){
            const { __typename, ...participant } = nextProps.data.signatureParticipant;
            return {
                data: participant
            }
        }

        return null;
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

    updateSignatureParticipant = async () => {
        if(!await this.checkRequiredFields()){
            const response = await this.props.updateSignatureParticipant({
                variables: {
                    participant: {
                        ...this.state.data
                    }
                }
            });

            if(response.data.updateSignatureParticipant.success){
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

        if(!data.phone){
            hasError = true;
            errors.phone = translate.field_required;
        }

        if(!data.position){
            hasError = true;
            errors.position = translate.field_required;
        }

        if(!data.email){
            hasError = true;
            errors.email = translate.field_required;
        }else{
            if(!checkValidEmail(data.email)){
                hasError = true;
                errors.email = 'Se requiere un email válido';//TRADUCCION
            }else{
                if(data.email !== this.props.data.signatureParticipant.email){
                    if(!await this.checkEmailAvailability()){
                        hasError = true;
                        errors.email = this.props.translate.register_exists_email
                    }
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
        return (
            <div
                style={{
                    minWidth: '650px',
                    maxWidth: '90%'
                }}
                onKeyUp={() => this.checkRequiredFields()}
            >
                <SignatureParticipantForm
                    translate={this.props.translate}
                    participant={this.state.data}
                    errors={this.state.errors}
                    updateState={this.updateState}
                    languages={this.props.extra.languages}
                />
            </div>
        )
    }

    render(){
        const { translate } = this.props;
        return (
            <AlertConfirm
                requestClose={this.props.requestClose}
                open={!!this.props.participantId}
                acceptAction={this.updateSignatureParticipant}
                buttonAccept={translate.accept}
                buttonCancel={translate.cancel}
                bodyText={this._renderBody()}
                title={translate.add_participant}
            />
        );
    }
};

const signatureParticipant = gql`
    query SignatureParticipant($id: Int!){
        signatureParticipant(id: $id){
            id
            name
            surname
            language
            dni
            email
            position
            phone
        }
    }
`;

const updateSignatureParticipant = gql`
    mutation UpdateSignatureParticipant($participant: SignatureParticipantInput!){
        updateSignatureParticipant(participant: $participant){
            success
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
    graphql(updateSignatureParticipant, {
        name: 'updateSignatureParticipant'
    }),
    graphql(signatureParticipant, {
        options: props => ({
            variables: {
                id: props.participantId
            }
        })
    }),
    graphql(languages, {
        name: 'extra'
    }),
)(withApollo(ParticipantEditorModal));
