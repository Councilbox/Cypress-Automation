import React from 'react';
import { AlertConfirm } from '../../../displayComponents';
import ContactForm from './ContactForm';

const ContactModal = ({
 open, requestClose, participant, council, translate
}) => {
    const renderBody = () => (
            <ContactForm
                participant={participant}
                translate={translate}
                council={council}
            />
        );

    return (
        <AlertConfirm
            open={open}
            title={'Contacto'}
            requestClose={requestClose}
            bodyText={renderBody()}
        />
    );
};

export default ContactModal;
