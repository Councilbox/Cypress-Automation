import React from 'react';
import gql from 'graphql-tag';
import { withApollo, graphql } from 'react-apollo';
import { BasicButton, AlertConfirm, LoadingSection } from '../../../../displayComponents';
import { getSMSStatusByCode } from '../../../../utils/CBX';
import { getSecondary } from '../../../../styles/colors';
import { moment } from '../../../../containers/App';
import { Table, TableRow, TableCell } from 'material-ui';
import LiveSMS from '../../../council/live/councilMenu/LiveSMS';


const FailedSMSList = ({ council, translate }) => {
    const [modal, setModal] = React.useState(false);
    const secondary = getSecondary();

    const closeModal = () => {
        setModal(false);
    }

    const showModal = () => {
        setModal(true);
    }

    return (
        <React.Fragment>
            <BasicButton
                text="Ver envios SMS"
                color={secondary}
				textStyle={{ fontWeight: '700', color: 'white' }}
                onClick={showModal}
            />
            <AlertConfirm
                requestClose={closeModal}
                open={modal}
                buttonCancel={'Cancelar'}
                bodyStyle={{overflowY: "hidden",height: "50vh", width: "100%"}}
                bodyText={
                    <LiveSMS
                        translate={translate}
                        council={council}
                    />
                }
                title={'Lista de SMS'}
            />
        </React.Fragment>
    )
}

export const sendParticipantRoomKey = gql`
    mutation SendParticipantRoomKey($participantIds: [Int]!, $councilId: Int!, $timezone: String!, $newPhone: String){
        sendParticipantRoomKey(participantsIds: $participantIds, councilId: $councilId, timezone: $timezone, newPhone: $newPhone){
            success
            message
        }
    }
`;

const FailedList = graphql(sendParticipantRoomKey, { name: 'sendAccessKey' })(withApollo(({ client, council, sendAccessKey }) => {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [resendLoading, setResendLoading] = React.useState(null);
    const [filter, setFilter] = React.useState(null);

    const resendRoomAccessKey = async (id, sendId) => {
        setResendLoading(sendId);
        const response = await sendAccessKey({
            variables: {
                councilId: council.id,
                participantIds: [id],
                timezone: moment().utcOffset()
            }
        });
        setResendLoading(null);
        getData();
    }


    const getData = React.useCallback(async () => {
        const response = await client.query({
            query: getSMS,
            variables: {
                councilId: council.id,
                ...(filter? { filter } : {})
            }
        });

        if(response.data.sendsSMS){
            setData(response.data);
            setLoading(false);
        }
    }, [council.id, filter]);

    React.useEffect(() => {
        getData();
    }, [getData]);

    return (
        <div>
            {loading?
                <LoadingSection />
            :
                <React.Fragment>
                    <BasicButton
                        color="transparent"
                        text={filter? 'Todos' : 'Ver fallidos'}
                        onClick={filter? () => setFilter(null) : () => setFilter('failed')}
                    />
                    <Table>
                        {data.sendsSMS.map(send => (
                            <TableRow>
                                <TableCell>
                                    {send.recipient.name}
                                </TableCell>
                                <TableCell>
                                    {send.recipient.surname}
                                </TableCell>
                                <TableCell>
                                    {send.recipient.phone}
                                </TableCell>
                                <TableCell>
                                    {getSMSStatusByCode(send.reqCode)}
                                </TableCell>
                                <TableCell>
                                    <BasicButton
                                        color="transparent"
                                        text={'Reenviar'}
                                        loading={resendLoading === send.id}
                                        onClick={() => resendRoomAccessKey(send.recipient.id, send.id)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </Table>
                </React.Fragment>
            }
        </div>
    )
}));


export const getSMS = gql`
    query sendsSMS($councilId: Int!, $filter: String){
        sendsSMS(councilId: $councilId, filter: $filter){
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
    }
`;

export default FailedSMSList;