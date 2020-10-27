import gql from 'graphql-tag';
import { Input } from 'material-ui';
import React from 'react';
import { withApollo } from 'react-apollo';
import { AlertConfirm, BasicButton, ButtonIcon, SuccessMessage } from '../../../displayComponents';
import RichTextInput from '../../../displayComponents/RichTextInput';
import withSharedProps from '../../../HOCs/withSharedProps';
import { useOldState } from '../../../hooks';
import { getPrimary } from '../../../styles/colors';


const SendMessageToParticipant = ({ participantId, translate, council, open, requestClose, client, user }) => {
    const [status, setStatus] = React.useState('IDDLE');
    const [state, setState] = useOldState({
        subject: '',
        body: ''
    });
    const primary = getPrimary();

    const send = async () => {
        setStatus('LOADING');
        await client.mutate({
            mutation: gql`
                mutation SendEmailtoParticipant($participantId: Int!, $message: AdminMessageInput){
                    sendEmailtoParticipant(participantId: $participantId, message: $message){
                        success
                    }
                }
            `,
            variables: {
                participantId,
                message: {
                    subject: state.subject,
                    body: state.body,
                    replyTo: user.email
                }
            }
        });

        setStatus('SUCCESS')
    }

    return (
        <AlertConfirm
            open={open}
            title={translate.send_message}
            requestClose={() => {
                setStatus('IDDLE');
                requestClose();
            }}
            bodyText={
                <>
                    {status === 'SUCCESS' ?
                        <SuccessMessage
                            message={translate.sent}
                        />
                    :
                        <>
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
                                        //border: !!errors.subject ? "1px solid red" : "1px solid #d7d7d7",
                                        width: "100%",
                                        padding: '.5em 1.6em',
                                        marginTop: "1em"
                                    }}
                                    value={state.subject}
                                    onChange={event => setState({ subject: event.target.value })}
                                    //classes={{ input: props.classes.input }}
                                    //error={!!errors.subject}
                                >
                                </Input>
                            </div>
                            <div style={{ marginTop: "1em" }}>
                                <div style={{ marginBottom: "1em", fontWeight: "bold" }}>{translate.message}</div>
                                <RichTextInput
                                    value={state.body}
                                    onChange={value => setState({ body: value })}
                                    //errorText={errors.body}
                                />
                            </div>
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: '0.6em' }}>
                                <BasicButton
                                    text={translate.send}
                                    color={primary}
                                    loading={status === 'LOADING'}
                                    onClick={send}
                                    icon={<ButtonIcon type="send" />}
                                    textStyle={{ color: 'white' }}
                                />
                            </div>

                        </>

                    }
                </>
            }
        />
    )
}

export default withSharedProps()(withApollo(SendMessageToParticipant))