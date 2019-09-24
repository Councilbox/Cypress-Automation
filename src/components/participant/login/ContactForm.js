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
    const primary = getPrimary();

    const send = async () => {
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
    }


    return (
        <React.Fragment>
            <TextInput
                value={state.replyTo}
                onChange={event => setState({ replyTo: event.target.value })}
                floatingText={'Email'}
            />
            <TextInput
                value={state.subject}
                onChange={event => setState({ subject: event.target.value })}
                floatingText={translate.title}
            />
            <RichTextInput
                value={state.body}
                onChange={value => setState({ body: value })}
                floatingText={translate.message}
            />
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: '0.6em'}}>
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