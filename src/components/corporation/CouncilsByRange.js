import gql from 'graphql-tag';
import { TableBody, TableHead, TableRow, TableCell, Table } from 'material-ui';


import React from 'react';
import { withApollo } from 'react-apollo';
import { AlertConfirm, Grid, PaginationFooter } from '../../displayComponents';
import { moment } from '../../containers/App';
import KPISends from './KPISends';


const CouncilsByRange = ({ client, dateStart, dateEnd, translate }) => {
    const [data, setData] = React.useState(null);
    const [page, setPage] = React.useState(1);
    const [sendsModal, setSendsModal] = React.useState(null);

    const getData = React.useCallback(async () => {
        if(!dateStart || !dateEnd){
            return;
        }

        const response = await client.query({
            query: gql`
                query KpiCouncils($dateStart: String!, $dateEnd: String!, $options: OptionsInput){
                    kpiCouncils(dateStart: $dateStart, dateEnd: $dateEnd, options: $options)
                }
            `,
            variables: {
                dateStart,
                dateEnd,
                options: {
                    limit: 20,
                    offset: (page - 1) * 20
                }
            }
        });
        setData(response.data.kpiCouncils)
    }, [dateStart, dateEnd, page])


    const changePage = page => {
        setPage(page);
    }

    React.useEffect(() => {
        getData();
    }, [getData])

    if(!data){
        return <span/>
    }


    return (
        <div style={{ width: '100%' }}>
            <AlertConfirm
                open={!!sendsModal}
                title={translate.sends}
                buttonCancel={translate.close}
                requestClose={() => setSendsModal(false)}
                bodyText={
                    <KPISends
                        translate={translate}
                        councilId={sendsModal}
                    />
                }
            />
            <Table>
                <TableHead>
                    <TableCell>
                        Cod. Cliente
                    </TableCell>
                    <TableCell>
                        Entidad
                    </TableCell>
                    <TableCell>
                        Nombre
                    </TableCell>
                    <TableCell>
                        Fecha de inicio
                    </TableCell>
                    <TableCell>
                        Fecha de fin
                    </TableCell>
                    <TableCell>
                        Duración
                    </TableCell>
                    <TableCell>
                        Código
                    </TableCell>
                    <TableCell>
                        Precio
                    </TableCell>
                    <TableCell>
                        Envíos
                    </TableCell>
                </TableHead>
                <TableBody>
                    {data.list.map(council => (
                        <TableRow>
                            <TableCell>
                                {council.customer_code || ''}
                            </TableCell>
                            <TableCell>
                                {council.business_name}
                            </TableCell>
                            <TableCell>
                                {council.name}
                            </TableCell>
                            <TableCell>
                                {moment(council.date_real_start).format('DD/MM/YYYY HH:mm:ss')}
                            </TableCell>
                            <TableCell>
                                {moment(council.date_end).format('DD/MM/YYYY HH:mm:ss')}
                            </TableCell>
                            <TableCell>
                                {council.duration ?
                                    `${council.duration.hours || '00'}:${council.duration.minutes || '00'}:${council.duration.seconds || '00'}`
                                :
                                    '-'
                                }
                            </TableCell>
                            <TableCell>
                                {council.price_observations}
                            </TableCell>
                            <TableCell>
                                {council.price}
                            </TableCell>
                            <TableCell>
                                <div onClick={() => setSendsModal(council.id)} style={{ cursor: 'pointer' }}>
                                    Ver
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Grid style={{ width: '100%', marginTop: '1.2em' }}>
                <PaginationFooter
                    page={page}
                    translate={translate}
                    length={data.list.length}
                    total={data.total}
                    limit={20}
                    changePage={changePage}
                />
            </Grid>
        </div>
    )
}

export default withApollo(CouncilsByRange);
