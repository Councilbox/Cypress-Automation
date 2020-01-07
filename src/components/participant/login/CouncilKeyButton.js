import React from 'react';
import { withApollo } from 'react-apollo';
import { AlertConfirm, LoadingSection, BasicButton } from '../../../displayComponents';
import { moment } from '../../../containers/App';
import gql from 'graphql-tag';
import { getSecondary, getPrimary } from '../../../styles/colors';
import { useSendRoomKey, useCountdown } from '../../../hooks';
import ContactModal from './ContactModal';

const CouncilKeyButton = ({ participant, setError, translate, setResponseSMS, council, styles, client }) => {
    const { secondsLeft, setCountdown } = useCountdown();
    const secondary = getSecondary();
    const primary = getPrimary();

    const [loading, sendKey] = useSendRoomKey(client, participant);
    const [errorAcces, setErrorAcces] = React.useState(false);
    const [modal, setModal] = React.useState(false);

    const sendParticipantRoomKey = async () => {
        const response = await sendKey();
        // setResponseSMS(response)
        if (!response.data.sendParticipantRoomKey.success) {
            // TRADUCCION
            setError('Hay un error con la entrega de SMS a tu teléfono. Contacta con el admin para confirmar que tus datos son correctos antes de volver a enviarlo.');
            setErrorAcces(true)
        } else {
            setCountdown(60);
        }
    }



    return (
        <React.Fragment>
            {/* // TRADUCCION */}
            <BasicButton
                text={secondsLeft ? `Recibir clave de acceso ${secondsLeft} segundos` : errorAcces ? "Contacta con el admin" : `Contacta con el admin`}
                onClick={() => setModal(true)}
                // onClick={sendParticipantRoomKey}
                loading={loading}
                disabled={secondsLeft !== 0}
                color={primary}
                textStyle={{ color: getPrimary() }}
                backgroundColor={{ borderRadius: '4px', border: `solid 1px ${getPrimary()}`, backgroundColor: "white", minWidth: "200px", ...styles }}
            />
            <ContactModal
                open={modal}
                requestClose={() => setModal(false)}
                participant={participant}
                translate={translate}
                council={council}
            />
        </React.Fragment>
    )
}

export default withApollo(CouncilKeyButton);