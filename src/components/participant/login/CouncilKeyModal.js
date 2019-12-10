import React from 'react';
import { withApollo } from 'react-apollo';
import { AlertConfirm, LoadingSection, BasicButton } from '../../../displayComponents';
import { moment } from '../../../containers/App';
import gql from 'graphql-tag';
import { getSecondary } from '../../../styles/colors';

const CouncilKeyModal = ({ participant, council, open, requestClose, translate, client }) => {
    const [loading, setLoading] = React.useState(true);
    const [sends, setSends] = React.useState(null);
    const secondary = getSecondary();

    const getData = React.useCallback(async value => {
        const response = await client.query({
            query: participantSend,
            variables: {
                councilId: council.id,
                participantId: participant.id,
                options: {
                    offset: 0,
                    limit: 20
                }
            }
        });

        console.log(response);

        if (response.data.participantSend.list) {
            setSends(response.data.participantSend.list);
        }
        setLoading(false);
    }, [council.id]);

    React.useEffect(() => {
        if(council.securityType !== 0){
            getData();
        }
    }, [getData, council.id]);



    const checkSend = () => {
        //setModalSecurity(false);
        getData();
    }


    const sendParticipantRoomKey = async () => {
        // setState({
        //     loading: true
        // });
        const response = await client.mutate({
            mutation: gql`
                mutation SendParticipantRoomKey($participantIds: [Int]!, $councilId: Int!, $timezone: String!){
                    sendParticipantRoomKey(participantsIds: $participantIds, councilId: $councilId, timezone: $timezone){
                        success
                    }
                }
            `,
            variables: {
                councilId: council.id,
                participantIds: [participant.id],
                timezone: moment().utcOffset()
            }
        });

        console.log(response);

        // if (response.errors) {
        //     if (response.errors[0].message === 'Invalid phone number') {
        //         // setState({
        //         //     phoneError: translate.invalid_phone_number,
        //         //     loading: false
        //         // });
        //     }
        // } else {
        //     // setState({
        //     //     loading: false,
        //     //     phoneError: ''
        //     // });
        //     closeSendPassModal();
        //     checkSend()
        // }
    }

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
                {council.securityType === 2 &&
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
                }
                {/* {!!state.phoneError &&
                    <div style={{ color: 'red' }}>{state.phoneError}</div>
                } */}
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

const participantSend = gql`
    query participantSend($councilId: Int!, $filter: String,  $options: OptionsInput, $participantId: Int!,){
        participantSend(councilId: $councilId, filter: $filter, options: $options, participantId: $participantId){
            list{
                liveParticipantId
                sendType
                id
                reqCode
                councilId
                recipient{
                    name
                    id
                surname
                phone
                email
            }
        }
        total
    }
}
`;


export default withApollo(CouncilKeyModal);