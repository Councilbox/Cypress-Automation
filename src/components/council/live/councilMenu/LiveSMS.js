import React from 'react';
import { withApollo, graphql } from 'react-apollo';
import {
 Table, TableCell, TableRow, TableBody, TableHead, CardContent, CardHeader, Card, CardActions
} from 'material-ui';
import {
 LoadingSection, BasicButton, TextInput, Scrollbar, PaginationFooter
} from '../../../../displayComponents';
import { getSMS, sendParticipantRoomKey } from '../../../corporation/councils/council/FailedSMSList';
import { moment } from '../../../../containers/App';
import { getSMSStatusByCode } from '../../../../utils/CBX';

import { getSecondary, getPrimary } from '../../../../styles/colors';
import { isMobile } from '../../../../utils/screen';

const limitPerPage = 10;

const LiveSMS = ({
 council, client, translate, sendAccessKey, showAll
}) => {
    const [state, setState] = React.useState({
        page: 1
    });
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [filter, setFilter] = React.useState(showAll ? null : 'failed');
    const [resendLoading, setResendLoading] = React.useState(null);
    const [modifiedValues, setModifiedValues] = React.useState(new Map());


    const getData = React.useCallback(async value => {
        const response = await client.query({
            query: getSMS,
            variables: {
                councilId: council.id,
                filter,
                options: {
                    limit: limitPerPage,
                    offset: limitPerPage * (value - 1)
                }
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

    const changePage = value => {
        setState({ page: value });
        getData(value);
    };

    const updateParticipantPhone = participantId => newPhone => {
        modifiedValues.set(participantId, newPhone);
        setModifiedValues(new Map(modifiedValues));
    };

    const resendRoomAccessKey = async (id, sendId) => {
        setResendLoading(sendId);
        await sendAccessKey({
            variables: {
                councilId: council.id,
                participantIds: [id],
                timezone: moment(council.dateStart).utcOffset().toString(),
                newPhone: modifiedValues.get(id)
            }
        });
        setResendLoading(null);
        getData();
    };
    if (isMobile) {
        return (
            <div style={{ height: '100%' }}>
                {loading ?
                    <LoadingSection />
                    : <React.Fragment>
                        <div style={{ marginBottom: '1em', marginLeft: '5px' }}>
                            <BasicButton
                                color="transparent"
                                text={filter ? translate.all_plural : translate.browse_failed_sms}
                                onClick={filter ? () => setFilter(null) : () => setFilter('failed')}
                                textStyle={{ color: '#000000de', border: `1px solid ${getSecondary()}` }}
                            />
                        </div>
                        <div style={{ height: 'calc( 100% - 2em )', }}>
                            <Scrollbar>
                                {data.sendsSMS.list.map(send => (
                                    <Card style={{ margin: '5px', marginBottom: '15px' }} key={send.id}>
                                        <CardHeader
                                            title={`${send.recipient.name} ${send.recipient.surname}` || ''}
                                            subheader={`${translate.state}: ${getSMSStatusByCode(send.reqCode)}`}
                                        />
                                        <CardContent>
                                            <EditableCell
                                                defaultValue={send.recipient.phone}
                                                setModifiedValues={updateParticipantPhone(send.recipient.id)}
                                            />
                                        </CardContent>
                                        <CardActions>
                                            <BasicButton
                                                size="small"
                                                color="primary"
                                                text={translate.resend}
                                                textStyle={{ boxShadow: 'none', color: getPrimary(), background: 'white' }}
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
        );
    }
        return (
            <div style={{ height: '100%' }}>
                {loading ?
                    <LoadingSection />
                    : <React.Fragment>
                        <div style={{ marginBottom: '1em' }}>
                            <BasicButton
                                color="transparent"
                                text={filter ? translate.all_plural : translate.browse_failed_sms}
                                onClick={filter ? () => setFilter(null) : () => setFilter('failed')}
                                textStyle={{ color: '#000000de', border: `1px solid ${getSecondary()}` }}
                            />
                        </div>
                        <div style={{ height: 'calc( 100% - 5em )', }}>
                            <Scrollbar>
                                <Table style={{ maxWidth: '100%', width: '100%' }} >
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
                                                {translate.resend}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.sendsSMS.list.map(send => (
                                            <Row send={send} resendRoomAccessKey={resendRoomAccessKey} resendLoading={resendLoading} key={send.id}>
                                                <TableCell>
                                                    {`${send.recipient.name} ${send.recipient.surname}` || ''}
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
                                                        text={translate.resend}
                                                        loading={resendLoading === send.id}
                                                        onClick={() => resendRoomAccessKey(send.recipient.id, send.id)}
                                                        loadingColor={'#000000de'}
                                                    />
                                                </TableCell>
                                            </Row>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Scrollbar>
                            <div style={{ display: 'flex', width: '100%', padding: '0.5em', }}>
                                {loading ?
                                    <div></div>
                                    : <PaginationFooter
                                        page={state.page}
                                        translate={translate}
                                        length={data.sendsSMS.list.length}
                                        total={data.sendsSMS.total}
                                        limit={limitPerPage}
                                        changePage={changePage}
                                    />
                                }
                            </div>
                        </div>

                    </React.Fragment>
                }
            </div>
        );
};

const Row = ({ send, children }) => {
    const [hover, setHover] = React.useState(false);

    const onMouseEnter = () => {
        setHover(true);
    };

    const onMouseLeave = () => {
        setHover(false);
    };

    return (
        <TableRow key={send.id} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={{ background: hover && '#e8e8e8' }}>
            {children}
        </TableRow>
    );
};

const EditableCell = ({ defaultValue, setModifiedValues }) => {
    const [value, setValue] = React.useState(defaultValue);

    const updateValue = event => {
        setValue(event.target.value);
        setModifiedValues(event.target.value);
    };

    return (
        <React.Fragment>
            <TextInput
                value={value}
                onChange={updateValue}
                className={'inputTableSMS'}
                styleInInput={{ border: '1px solid #0000006b', padding: '5px' }}
                disableUnderline={true}
                // styles={{ borderTop: "1px solid #0000006b", borderLeft: "1px solid #0000006b", borderRight: "1px solid #0000006b", marginTop: "5px" }}
            />
        </React.Fragment>
    );
};


export default graphql(sendParticipantRoomKey, {
    name: 'sendAccessKey'
})(withApollo(LiveSMS));
