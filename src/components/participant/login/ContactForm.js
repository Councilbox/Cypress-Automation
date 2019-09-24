import React from 'react';
import { TextInput, BasicButton, ButtonIcon } from '../../../displayComponents';
import RichTextInput from '../../../displayComponents/RichTextInput';
import { useOldState } from '../../../hooks';
import { getPrimary } from '../../../styles/colors';

const ContactForm = ({ participant, translate, council }) => {
    const [state, setState] = useOldState({
        replyTo: participant.email,
        title: '',
        body: ''
    });
    const primary = getPrimary();


    return (
        <React.Fragment>
            <TextInput
                value={state.replyTo}
                onChange={event => setState({ replyTo: event.target.value })}
                floatingText={'Email'}
            />
            <TextInput
                value={state.title}
                onChange={event => setState({ title: event.target.value })}
                floatingText={translate.title}
            />
            <RichTextInput
                value={state.body}
                onChange={event => setState({ body: event.target.value })}
                floatingText={translate.message}
            />
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: '0.6em'}}>
                <BasicButton
                    text={translate.send}
                    color={primary}
                    icon={<ButtonIcon type="send" />}
                    textStyle={{ color: 'white' }}
                />
            </div>

        </React.Fragment>

    )
}

export default ContactForm;