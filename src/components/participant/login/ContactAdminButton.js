import React from 'react';
import { withApollo } from 'react-apollo';
import { BasicButton } from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';
import ContactModal from './ContactModal';

const ContactAdminButton = ({ participant, translate, council, styles, fullWidth }) => {
    const primary = getPrimary();
    const [modal, setModal] = React.useState(false);

    return (
        <React.Fragment>
            <BasicButton
                text={translate.mail_contact_admin}
                onClick={() => setModal(true)}
                fullWidth={fullWidth}
                color={primary}
                textStyle={{ color: getPrimary() }}
                backgroundColor={{ borderRadius: '4px', border: `solid 1px ${getPrimary()}`, backgroundColor: 'white', minWidth: '200px', ...styles }}
            />
            <ContactModal
                open={modal}
                requestClose={() => setModal(false)}
                participant={participant}
                translate={translate}
                council={council}
            />
        </React.Fragment>
    );
};

export default withApollo(ContactAdminButton);
