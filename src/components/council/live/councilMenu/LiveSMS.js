import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { LoadingSection, BasicButton, TextInput } from '../../../../displayComponents';
import { getSMS } from '../../../corporation/councils/council/FailedSMSList';
import { moment } from '../../../../containers/App';
import { Table, TableCell, TableRow, TableBody } from 'material-ui';
import { getSMSStatusByCode } from '../../../../utils/CBX';


const LiveSMS = ({ council, client, translate, ...props }) => {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [resendLoading, setResendLoading] = React.useState(null);
    const [modifiedValues, setModifiedValues] = React.useState(new Map());

    const getData = React.useCallback(async () => {
        const response = await client.query({
            query: getSMS,
            variables: {
                councilId: council.id,
                filter: 'failed'
            }
        });

        if(response.data.sendsSMS){
            setData(response.data);
            setLoading(false);
        }
    }, [council.id]);

    React.useEffect(() => {
        getData();
    }, [getData]);

    const updateParticipantPhone = participantId => newPhone => {
        modifiedValues.set(participantId, newPhone);
        setModifiedValues(new Map(modifiedValues));
    }

    return (
        <div>
            {loading?
                <LoadingSection />
            :
                <Table>
                    <TableBody>
                        {data.sendsSMS.map(send => (
                            <TableRow key={send.id}>
                                <TableCell>
                                    {send.recipient.name}
                                </TableCell>
                                <TableCell>
                                    {send.recipient.surname}
                                </TableCell>
                                <TableCell>
                                    <EditableCell defaultValue={send.recipient.phone} setModifiedValues={updateParticipantPhone(send.recipient.id)} />
                                </TableCell>
                                <TableCell>
                                    {getSMSStatusByCode(send.reqCode)}
                                </TableCell>
                                <TableCell>
                                    <BasicButton
                                        color="transparent"
                                        text={'Reenviar'}
                                        loading={resendLoading === send.id}
                                        //onClick={() => resendRoomAccessKey(send.recipient.id, send.id)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            }
        </div>
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
            />
        </React.Fragment>
    )
}

export default withApollo(LiveSMS);