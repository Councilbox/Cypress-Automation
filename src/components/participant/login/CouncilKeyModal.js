import React from 'react';
import { useSendRoomKey, useCountdown } from '../../../hooks';
import { withApollo } from 'react-apollo';
import { AlertConfirm } from '../../../displayComponents';


const CouncilKeyModal = ({ client, participant, council, translate, open, requestClose }) => {
    const [error, setError] = React.useState('');
    const { secondsLeft, setCountdown } = useCountdown();
    const [loading, sendKey] = useSendRoomKey(client, participant);

    const renderStatusSMS = (reqCode) => {
        switch (reqCode) {
            case 22:
                return (<div>El SMS ha sido enviado</div>)
            case 20:
                return (<div>El SMS ha sido enviado</div>)
            case -2:
                return (<div>El SMS no se ha podido enviar porque el número no es válido. Por favor contacte con el administrador</div>)
            default:
                return (<div>{`Para entrar en esta reunión es necesario una clave que se envía por SMS al número: ${formatPhone(participant.phone)}`}</div>);
        }

    }

    const sendParticipantRoomKey = async () => {
        const response = await sendKey();

        if(!response.data.sendParticipantRoomKey.success){
            setError('No se ha podido enviar la clave al número de teléfono indicado. Puede ponerse en contacto con el administrador en caso de que el teléfono registrado tenga algún problema');
        } else {
            setCountdown(60);
        }

    }

    

    const formatPhone = phone => {
        if (phone.length >= 4) {
            return "*".repeat(phone.length - 4) + phone.slice(-4);
        }
    }


    const _sendPassModalBody = () => {
        return (
            <div>
                {council.securityType === 1 &&
                    translate.receive_access_key_email
                }
                {/* {council.securityType === 2 &&
                    <React.Fragment>
                        {
                            sends ?
                                <div>
                                    {renderStatusSMS(sends[0]? sends[0].reqCode : null)}
                                    <BasicButton
                                        text={translate.send}
                                        color={secondary}
                                        textStyle={{
                                            maxWidth: '200px',
                                            color: "white",
                                            fontWeight: "700"
                                        }}
                                        textPosition="before"
                                        fullWidth={true}
                                        onClick={sendParticipantRoomKey}
                                        //loading={loading}
                                    ></BasicButton>
                                </div>
                                :
                                <LoadingSection />
                        }
                    </React.Fragment>
                } */}
                {!!error &&
                    <div style={{ color: 'red' }}>{error}</div>
                }
            </div>
        )
    }

    return (
        <AlertConfirm
            requestClose={requestClose}
            open={open}
            //loadingAction={loading}
            acceptAction={sendParticipantRoomKey}
            //buttonAccept={sends[0].reqCode === -2 ? "" : translate.accept}
            buttonCancel={translate.cancel}
            bodyText={_sendPassModalBody()}
            title={translate.resend_access_key}
        />
    )
}

export default withApollo(CouncilKeyModal);