import React from 'react';
import { withApollo } from 'react-apollo';
import { AlertConfirm, LoadingSection, BasicButton } from '../../../displayComponents';
import { moment } from '../../../containers/App';
import gql from 'graphql-tag';
import { getSecondary, getPrimary } from '../../../styles/colors';
import { useSendRoomKey, useCountdown } from '../../../hooks';

const CouncilKeyButton = ({ participant, setError, translate, client }) => {
    const { secondsLeft, setCountdown } = useCountdown();
    const secondary = getSecondary();
    const primary = getPrimary();

    const [loading, sendKey] = useSendRoomKey(client, participant);

    const sendParticipantRoomKey = async () => {
        const response = await sendKey();

        if(!response.data.sendParticipantRoomKey.success){
            setError('No se ha podido enviar la clave al número de teléfono indicado. Puede ponerse en contacto con el administrador en caso de que el teléfono registrado tenga algún problema');
        } else {
            setCountdown(60);
        }

    }

    return (
        <BasicButton
            text={secondsLeft? `Recibir clave de acceso ${secondsLeft} segundos` : `Recibir clave de acceso`}
            onClick={sendParticipantRoomKey}
            loading={loading}
            disabled={secondsLeft !== 0}
            color={primary}
            textStyle={{ color: getPrimary() }}
            backgroundColor={{ borderRadius: '4px', border: `solid 1px ${getPrimary()}`, backgroundColor: "white",  minWidth: "200px" }}
        />
    )
}

export default withApollo(CouncilKeyButton);