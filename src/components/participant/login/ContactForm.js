import React from 'react';
import { TextInput, BasicButton, ButtonIcon, SuccessMessage } from '../../../displayComponents';
import RichTextInput from '../../../displayComponents/RichTextInput';
import { useOldState } from '../../../hooks';
import { getPrimary } from '../../../styles/colors';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { Input, withStyles } from 'material-ui';




const styles = {
    'input': {
        '&::placeholder': {
            textOverflow: 'ellipsis !important',
            color: '#0000005c'
        }
    },
    formControl: {
        background: "red"
    }
};


const ContactForm = ({ participant, translate, council, client, ...props }) => {
    const [state, setState] = useOldState({
        replyTo: participant.email,
        subject: '',
        body: ''
    });
    const [emailEnviado, setEmailEnviado] = React.useState(false);
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
            if (response.data.sendAdminEmail) {
                setEmailEnviado(true)
            }
        }

    }

    const validate = (items) => {
        let hasError = false;
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

    if (emailEnviado) {
        return (
            <SuccessMessage message={translate.sent} />
        )
    } else {
        return (
            <React.Fragment>
                <div>
                    <div style={{ fontWeight: "bold" }}>{translate.email}</div>
                    <Input
                        placeholder={translate.email}
                        disableUnderline={true}
                        id={"titleDraft"}
                        style={{
                            color: "rgba(0, 0, 0, 0.65)",
                            fontSize: '15px',
                            boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)',
                            border: !!errors.replyTo ? "1px solid red" : "1px solid #d7d7d7",
                            width: "100%",
                            padding: '.5em 1.6em',
                            marginTop: "1em"
                        }}
                        value={state.replyTo}
                        onChange={event => setState({ replyTo: event.target.value })}
                        classes={{ input: props.classes.input }}
                        error={!!errors.replyTo}
                    >
                    </Input>
                </div>
                <div style={{ marginTop: "1em" }}>
                    <div style={{ fontWeight: "bold" }}>{translate.title}</div>
                    <Input
                        placeholder={translate.title}
                        disableUnderline={true}
                        id={"titleDraft"}
                        style={{
                            color: "rgba(0, 0, 0, 0.65)",
                            fontSize: '15px',
                            boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)',
                            border: !!errors.subject ? "1px solid red" : "1px solid #d7d7d7",
                            width: "100%",
                            padding: '.5em 1.6em',
                            marginTop: "1em"
                        }}
                        value={state.subject}
                        onChange={event => setState({ subject: event.target.value })}
                        classes={{ input: props.classes.input }}
                        error={!!errors.subject}
                    >
                    </Input>
                </div>
                <div style={{ marginTop: "1em" }}>
                    <div style={{ marginBottom: "1em", fontWeight: "bold" }}>{translate.message}</div>
                    <RichTextInput
                        value={state.body}
                        onChange={value => setState({ body: value })}
                        errorText={errors.body}
                    />
                </div>
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
}

export default withStyles(styles)(withApollo(ContactForm));