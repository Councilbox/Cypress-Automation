import React from 'react';
import { TableRow, TableCell, Card, CardContent } from 'material-ui';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { EnhancedTable, RefreshButton, LoadingSection } from '../../../../displayComponents';
import { PARTICIPANTS_LIMITS, SIGNATURE_PARTICIPANTS_STATES } from '../../../../constants';
import { getSignerStatusTranslateField } from '../../../../utils/CBX';
import { isMobile } from '../../../../utils/screen';

const signatureParticipants = gql`
    query SignatureParticipants($signatureId: Int!, $filters: [FilterInput], $options: OptionsInput){
        signatureParticipants(signatureId: $signatureId, filters: $filters, options: $options){
            list{
                id
                name
                status
                surname
                dni
                email
            }
            total
        }
    }
`;

const SignersList = ({ translate, client, ...props }) => {
    const [loading, setLoading] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(false);
    const [signatureParticipantsList, setSignatureParticipantsList] = React.useState([]);
    const [signatureParticipantsTotal, setSignatureParticipantsTotal] = React.useState(0);

    const table = React.useRef();

    const getData = React.useCallback(async filtros => {
        const response = await client.query({
            query: signatureParticipants,
            variables: {
                signatureId: props.signature.id,
                ...(filtros ? {
                    ...filtros
                }
                    : {}
                )
            },
        });
        setSignatureParticipantsList(response.data.signatureParticipants.list);
        setSignatureParticipantsTotal(response.data.signatureParticipants.total);
        setLoading(false);
    }, []);

    React.useEffect(() => {
        getData();
    }, [getData]);


    const removeSignature = async id => {
        const response = await client.mutate({
            mutation: removeSignatureParticipant,
            variables: {
                participantId: ''
            }
        });
    };

    const refresh = async () => {
        setRefreshing(true);
        await props.refetch();
        setRefreshing(false);
    };

    if (loading) {
        return <LoadingSection />;
    }

    return (
        <React.Fragment>
            <EnhancedTable
                hideTextFilter={isMobile}
                searchInMovil={isMobile}
                ref={table}
                translate={translate}
                defaultLimit={PARTICIPANTS_LIMITS[0]}
                defaultFilter={'fullName'}
                defaultOrder={['fullName', 'asc']}
                limits={PARTICIPANTS_LIMITS}
                menuButtons={
                    <div style={{ marginRight: '0.8em' }}>
                        <RefreshButton
                            loading={refreshing}
                            translate={translate}
                            tooltip={translate.refresh_convened}
                            onClick={refresh}
                        />
                    </div>
                }
                page={1}
                length={signatureParticipantsList.length}
                total={signatureParticipantsTotal}
                refetch={getData}
                fields={[
                    {
                        value: 'fullName',
                        translation: translate.participant_data
                    },
                    {
                        value: 'dni',
                        translation: translate.dni
                    },
                    {
                        value: 'email',
                        translation: translate.email
                    }
                ]}
                headers={[
                    {
                        name: 'fullName',
                        text: translate.participant_data,
                        canOrder: true
                    },
                    {
                        name: 'dni',
                        text: translate.dni,
                        canOrder: true
                    },
                    {
                        name: 'email',
                        text: translate.email,
                        canOrder: true
                    },
                    {
                        name: 'status',
                        text: translate.signed,
                        canOrder: true
                    }
                ]}
            >
                {signatureParticipantsList.length > 0
                    && signatureParticipantsList.map(participant => (
                        isMobile ?
                            <Card style={{ marginBottom: '1em', fontSize: '0.9em' }} key={`participant_${participant.id}`}>
                                <CardContent>
                                    <div>
                                        <div style={{ display: 'flex' }}>
                                            <div style={{ fontWeight: 'bold' }}>{translate.participant_data}: </div>
                                            <div style={{ marginLeft: '5px' }}>
                                                {participant.status === SIGNATURE_PARTICIPANTS_STATES.SIGNED
                                                    && <i className="fa fa-check" aria-hidden="true" style={{ marginRight: '0.2em', color: 'green' }}></i>
                                                }
                                                {`${participant.name} ${participant.surname || ''}`}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex' }}>
                                            <div style={{ fontWeight: 'bold' }}>{translate.dni}: </div>
                                            <div style={{ marginLeft: '5px' }}>
                                                {participant.dni}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex' }}>
                                            <div style={{ fontWeight: 'bold' }}>{translate.email}: </div>
                                            <div style={{ marginLeft: '5px' }}>
                                                {participant.email}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex' }}>
                                            <div style={{ fontWeight: 'bold' }}>{translate.signed}: </div>
                                            <div style={{ marginLeft: '5px' }}>
                                                {translate[getSignerStatusTranslateField(participant.status)]}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            : <TableRow
                                key={`participant_${participant.id}`}
                            >
                                <TableCell>
                                    {participant.status === SIGNATURE_PARTICIPANTS_STATES.SIGNED
                                        && <i className="fa fa-check" aria-hidden="true" style={{ marginRight: '0.2em', color: 'green' }}></i>
                                    }
                                    {`${participant.name} ${participant.surname || ''}`}
                                </TableCell>
                                <TableCell>
                                    {participant.dni}
                                </TableCell>
                                <TableCell>
                                    {participant.email}
                                </TableCell>
                                <TableCell>
                                    {translate[getSignerStatusTranslateField(participant.status)]}
                                </TableCell>
                            </TableRow>
                    ))
                }
            </EnhancedTable>
        </React.Fragment>
    );
};

const removeSignatureParticipant = gql`
    mutation RemoveSignatureParticipant($participantId: Int!){
        removeSignatureParticipant(id: $participantId){
            success
            message
        }
    }
`;

export default withApollo(SignersList);
