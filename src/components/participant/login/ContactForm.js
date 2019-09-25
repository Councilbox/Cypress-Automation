import React from 'react';
import { TextInput, BasicButton, ButtonIcon } from '../../../displayComponents';
import RichTextInput from '../../../displayComponents/RichTextInput';
import { useOldState } from '../../../hooks';
import { getPrimary } from '../../../styles/colors';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';

const ContactForm = ({ participant, translate, council, client }) => {
    const [state, setState] = useOldState({
        replyTo: participant.email,
        subject: '',
        body: ''
    });
    const [errors, setErrors] = React.useState({});
    const primary = getPrimary();

    const send = async () => {
        if (!validate(state)) {
            const response = await client.mutate({
                mutation: gql`
                mutation sendAdminEmail(
                    $councilId: Int!,
                    $message: AdminMessageInput
                ){
                    sendAdminEmail(
                        councilId: $councilId
                        message: $message
                    ){
                        success
                        message
                    }
                }
            `,
                variables: {
                    councilId: council.id,
                    message: state
                }
            });
            console.log(response);
        }

    }

    const validate = (items) => {
        let hasError = false;
        // console.log(items); ///object para array object.key(items)
        console.log(state)
        // state.map(item => (console.log(item))) 
        // let newErrors = { items: Object.key(state).map(item => ({ error: '' })) }
        let newErrors = {}

        if (!state.body) {
            newErrors.body = translate.required_field;
            hasError = true;
        }
        if (!state.replyTo) {
            newErrors.replyTo = translate.required_field;
            hasError = true;
        } else {
            if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(state.replyTo))) {
                newErrors.replyTo = "El email esta mal";
                hasError = true;
            }
        }
        if (!state.subject) {
            newErrors.subject = translate.required_field;
            hasError = true;
        }

        setErrors(newErrors);
        return hasError;
    }

    // Estética como las plantillas
    // Validación de campos vacíos
    // Control de envio -> enviando -> enviado (la animación esa que hiciste)

    console.log(errors)

    return (
        <React.Fragment>
            <TextInput
                value={state.replyTo}
                onChange={event => setState({ replyTo: event.target.value })}
                floatingText={'Email'}
                errorText={errors.replyTo}
            />
            <TextInput
                value={state.subject}
                onChange={event => setState({ subject: event.target.value })}
                floatingText={translate.title}
                errorText={errors.subject}
            />
            <RichTextInput
                value={state.body}
                onChange={value => setState({ body: value })}
                floatingText={translate.message}
                errorText={errors.body}
            />
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: '0.6em' }}>
                <BasicButton
                    text={translate.send}
                    color={primary}
                    onClick={send}
                    icon={<ButtonIcon type="send" />}
                    textStyle={{ color: 'white' }}
                />
            </div>

        </React.Fragment>

    )
}

export default withApollo(ContactForm);