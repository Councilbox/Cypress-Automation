import React from 'react';
import gql from 'graphql-tag';
import { withApollo, graphql } from 'react-apollo';
import { BasicButton, AlertConfirm, LoadingSection } from '../../../../displayComponents';
import { moment } from '../../../../containers/App';
import { Table, TableRow, TableCell } from 'material-ui';


const FailedSMSList = ({ council }) => {
    const [modal, setModal] = React.useState(false);

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
                onClick={showModal}
            />
            <AlertConfirm
                requestClose={closeModal}
                open={modal}
                buttonCancel={'Cancelar'}
                bodyText={<FailedList council={council} />}
                title={'Lista de SMS'}
            />
        </React.Fragment>
    )
}

const sendParticipantRoomKey = gql`
    mutation SendParticipantRoomKey($participantIds: [Int]!, $councilId: Int!, $timezone: String!){
        sendParticipantRoomKey(participantsIds: $participantIds, councilId: $councilId, timezone: $timezone){
            success
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
            query: getFailedSMS,
            variables: {
                councilId: council.id,
                ...(filter? { filter } : {})
            }
        });

        console.log(response);

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
                                    {send.recipient.email}
                                </TableCell>
                                <TableCell>
                                    {getStatusByCode(send.reqCode)}
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

const getStatusByCode = reqCode => {
    const status = {
        22: 'Entregado',
        20: 'Enviado',
        default: 'Fallido'
    }

    return status[reqCode]? status[reqCode] : status.default;
}

const getFailedSMS = gql`
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