import React from 'react';
import gql from 'graphql-tag';
import { withApollo, graphql } from 'react-apollo';
import { LoadingSection, BasicButton, TextInput, Scrollbar, PaginationFooter } from '../../../../displayComponents';
import { getSMS } from '../../../corporation/councils/council/FailedSMSList';
import { moment } from '../../../../containers/App';
import { Table, TableCell, TableRow, TableBody, TableHead, CardContent, CardHeader, Card, CardActions, Button, TextField } from 'material-ui';
import { getSMSStatusByCode } from '../../../../utils/CBX';
import { sendParticipantRoomKey } from "../../../corporation/councils/council/FailedSMSList";
import { getSecondary, getPrimary } from '../../../../styles/colors';
import { isMobile } from 'react-device-detect';



const LiveSMS = ({ council, client, translate, sendAccessKey, showAll, ...props }) => {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [filter, setFilter] = React.useState(showAll ? null : 'failed');
    const [resendLoading, setResendLoading] = React.useState(null);
    const [modifiedValues, setModifiedValues] = React.useState(new Map());



    const getData = React.useCallback(async () => {
        const response = await client.query({
            query: getSMS,
            variables: {
                councilId: council.id,
                filter
            }
        });

        if (response.data.sendsSMS) {
            setData(response.data);
            setLoading(false);
        }
    }, [council.id, filter]);

    React.useEffect(() => {
        getData();
    }, [getData]);

    const updateParticipantPhone = participantId => newPhone => {
        modifiedValues.set(participantId, newPhone);
        setModifiedValues(new Map(modifiedValues));
    }

    const resendRoomAccessKey = async (id, sendId) => {
        setResendLoading(sendId);
        await sendAccessKey({
            variables: {
                councilId: council.id,
                participantIds: [id],
                timezone: moment().utcOffset(),
                newPhone: modifiedValues.get(id)
            }
        });
        setResendLoading(null);
        getData();
    }

    //calcular total entre 10

    let total
    if (!loading) {
        total = data.sendsSMS / 2;
    }

    if (isMobile) {
        return (
            <div style={{ height: "100%" }}>
                {loading ?
                    <LoadingSection />
                    :
                    <React.Fragment>
                        <div style={{ marginBottom: "1em", marginLeft: "5px" }}>
                            <BasicButton
                                color="transparent"
                                text={filter ? 'Todos' : 'Ver fallidos' /*TRADUCCION*/}
                                onClick={filter ? () => setFilter(null) : () => setFilter('failed')}
                                textStyle={{ color: "#000000de", border: "1px solid " + getSecondary() }}
                            />
                        </div>
                        <div style={{ height: "calc( 100% - 2em )", }}>
                            <Scrollbar>
                                {data.sendsSMS.map(send => (
                                    <Card style={{ margin: "5px", marginBottom: "15px" }} key={send.id}>
                                        <CardHeader
                                            title={send.recipient.name + " " + send.recipient.surname}
                                            subheader={translate.state + ": " + getSMSStatusByCode(send.reqCode)}
                                        />
                                        <CardContent>
                                            <EditableCell defaultValue={send.recipient.phone} setModifiedValues={updateParticipantPhone(send.recipient.id)} />
                                        </CardContent>
                                        <CardActions>
                                            <BasicButton
                                                size="small"
                                                color="primary"
                                                text={'Reenviar'}
                                                textStyle={{ background: "none", boxShadow: "none", color: getPrimary(), background: "white" }}
                                                loading={resendLoading === send.id}
                                                onClick={() => resendRoomAccessKey(send.recipient.id, send.id)}
                                                loadingColor={getPrimary()}
                                            />
                                        </CardActions>
                                    </Card>
                                ))}
                            </Scrollbar>
                        </div>
                    </React.Fragment>
                }
            </div>
        )
    } else {
        return (
            <div style={{ height: "100%" }}>
                {loading ?
                    <LoadingSection />
                    :
                    <React.Fragment>
                        <div style={{ marginBottom: "1em" }}>
                            <BasicButton
                                color="transparent"
                                text={filter ? 'Todos' : 'Ver fallidos' /*TRADUCCION*/}
                                onClick={filter ? () => setFilter(null) : () => setFilter('failed')}
                                textStyle={{ color: "#000000de", border: "1px solid " + getSecondary() }}
                            />
                        </div>
                        <div style={{ height: "calc( 100% - 2em )", }}>
                            <Scrollbar>
                                <Table style={{ maxWidth: "100%", width: "100%" }} >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                {translate.name}
                                            </TableCell>
                                            <TableCell>
                                                {translate.phone}
                                            </TableCell>
                                            <TableCell>
                                                {translate.state}
                                            </TableCell>
                                            <TableCell>
                                                Reenviar
                                </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.sendsSMS.map(send => (
                                            <Row send={send} resendRoomAccessKey={resendRoomAccessKey} resendLoading={resendLoading }key={send.id}>
                                                <TableCell>
                                                    {send.recipient.name + " " + send.recipient.surname}
                                                </TableCell>
                                                <TableCell>
                                                    <EditableCell defaultValue={send.recipient.phone} setModifiedValues={updateParticipantPhone(send.recipient.id)} />
                                                </TableCell>
                                                <TableCell>
                                                    {getSMSStatusByCode(send.reqCode)}
                                                </TableCell>
                                                <TableCell>
                                                    <BasicButton
                                                        color="white"
                                                        text={'Reenviar'}
                                                        loading={resendLoading === send.id}
                                                        onClick={() => resendRoomAccessKey(send.recipient.id, send.id)}
                                                        loadingColor={"#000000de"}
                                                    />
                                                </TableCell>
                                            </Row>

                                        ))}
                                    </TableBody>
                                </Table>
                            </Scrollbar>
                        </div>

                    </React.Fragment>
                }
            </div>
        )
    }
}


const Row = ({ send, children }) => {
    const [state, setState] = React.useState(false);

    const onMouseEnter = () => {
        setState(true)
    }

    const onMouseLeave = () => {
        setState(false)
    }

    return (
        <TableRow key={send.id} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={{ background: state && "#e8e8e8" }}>
            {children}
        </TableRow>
    )
}

const EditableCell = ({ defaultValue, setModifiedValues }) => {
    const [value, setValue] = React.useState(defaultValue);

    const updateValue = event => {
        setValue(event.target.value);
        setModifiedValues(event.target.value);
    }

    return (
        <React.Fragment>
            <TextInput
                value={value}
                onChange={updateValue}
                styles={{ border: "1px solid black" }}
                clasName={'inputTableSMS'}
                styles={{ borderTop: "1px solid #0000006b", borderLeft: "1px solid #0000006b", borderRight: "1px solid #0000006b", marginTop: "5px" }}
            />
        </React.Fragment>
    )
}


export default graphql(sendParticipantRoomKey, {
    name: 'sendAccessKey'
})(withApollo(LiveSMS));