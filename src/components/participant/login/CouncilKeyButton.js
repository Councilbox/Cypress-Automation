import React from 'react';
import { withApollo } from 'react-apollo';
import { BasicButton } from '../../../displayComponents';
import { getSecondary, getPrimary } from '../../../styles/colors';
import { useSendRoomKey, useCountdown } from '../../../hooks';
import ContactModal from './ContactModal';

const CouncilKeyButton = ({ participant, translate, council, styles, client }) => {
    const { secondsLeft, setCountdown } = useCountdown();
    const secondary = getSecondary();
    const primary = getPrimary();

    const [loading, sendKey] = useSendRoomKey(client, participant);
    const [errorAcces, setErrorAcces] = React.useState(false);
    const [modal, setModal] = React.useState(false);


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