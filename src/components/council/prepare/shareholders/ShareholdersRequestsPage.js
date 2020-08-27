import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { LoadingSection, PaginationFooter, DropDownMenu, Scrollbar } from '../../../../displayComponents';
import { usePolling } from '../../../../hooks';
import { Table, TableBody, TableRow, MenuItem } from 'material-ui';
import { TableHead } from 'material-ui';
import { TableCell } from 'material-ui';
import { moment } from '../../../../containers/App';
import CheckShareholderRequest, { getTypeText } from './CheckShareholderRequest';
import { PARTICIPANT_STATES } from '../../../../constants';


const ShareholdersRequestsPage = ({ council, translate, client }) => {
    const [data, setData] = React.useState(null);
    const [modal, setModal] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [inputSearch, setInputSearch] = React.useState(false);
    const [search, setSearch] = React.useState({ state: '0' });
    const [usersPage, setUsersPage] = React.useState(1);
    const [usersTotal, setUsersTotal] = React.useState(false);


    const getData = React.useCallback(async () => {
        const response = await client.query({
            query: gql`
                query ShareholdersRequest($councilId: Int!,$filters: [FilterInput],$options: OptionsInput){
                    shareholdersRequests(councilId: $councilId, filters: $filters, options: $options){
                        list { 
                            councilId
                            id
                            participantId
                            data
                            participantCreated
                            date
                            participant {
                                name
                                surname
                                live {
                                    name
                                    surname
                                    state
                                }
                            }
                            state
                        }
                        total
                    }
                }
            `,
            variables: {
                councilId: council.id,
                filters: search?
                    Object.keys(search).map(key => {
                        return {
                            field: key,
                            text: search[key]
                        }
                    })
                :
                    [],
                options: {
                    limit: 10,
                    offset: (usersPage - 1) * 10,
                    orderDirection: 'ASC'
                },
            }
        });

        if (response.data.shareholdersRequests) {
            setData(response.data.shareholdersRequests.list);
            setUsersTotal(response.data.shareholdersRequests.total);
        }
        setLoading(false);
    }, [council.id, usersPage, search])

    usePolling(getData, 8000);

    React.useEffect(() => {
        getData();
    }, [getData, usersPage, search])

    if (loading) {
        return <LoadingSection />
    }

    return (
        <div style={{ padding: '2em 1em 1em', height: "calc( 100% - 3em )" }}>
            <Scrollbar>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div style={{ width: "200px", marginBottom: "2em" }}>
                        <DropDownMenu
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            color="transparent"
                            Component={() =>
                                <div style={{ marginRight: "1em", marginTop: "0.5em", cursor: "pointer" }}>
                                    <div>
                                        <i class="fa fa-filter" aria-hidden="true" style={{ color: '#c196c3', fontSize: "24px" }}></i>
                                    </div>
                                </div>
                            }
                            textStyle={{ color: "#c196c3" }}
                            type="flat"
                            items={
                                <div style={{ color: "" }}>
                                    <MenuItem onClick={() => setSearch({
                                        state: '1'
                                    })} checked={search && search.state === '1'}>
                                        {'Archivadas' /*TRADUCCION*/}
                                    </MenuItem>
                                    <MenuItem onClick={() => setSearch({
                                        state: '0'
                                    })} checked={search && search.state === '0'}>
                                        {translate.pending}
                                    </MenuItem>
                                </div>
                            }
                        />
                    </div>
                </div>
                <Table>
                    <TableHead>
                        <TableCell style={{ color: 'rgb(125, 33, 128)', fontWeight: 'bold', borderBottom: 'none', fontSize: "0.75rem" }}>
                            {translate.name}
                        </TableCell>
                        <TableCell style={{ color: 'rgb(125, 33, 128)', fontWeight: 'bold', borderBottom: 'none', fontSize: "0.75rem" }}>
                            {translate.email}
                        </TableCell>
                        <TableCell style={{ color: 'rgb(125, 33, 128)', fontWeight: 'bold', borderBottom: 'none', fontSize: "0.75rem" }}>
                            {translate.type}
                        </TableCell>
                        <TableCell style={{ color: 'rgb(125, 33, 128)', fontWeight: 'bold', borderBottom: 'none', fontSize: "0.75rem" }}>
                            {translate.date}
                        </TableCell>
                        <TableCell style={{ color: 'rgb(125, 33, 128)', fontWeight: 'bold', borderBottom: 'none', fontSize: "0.75rem" }}>
                            {translate.state}
                        </TableCell>
                        <TableCell style={{ color: 'rgb(125, 33, 128)', fontWeight: 'bold', borderBottom: 'none', fontSize: "0.75rem" }}>
                            Aprobar
                        </TableCell>
                    </TableHead>
                    <TableBody>
                        {data.map(request => {
                            const delegationPending = (request.participantCreated &&
                                request.data.requestType === 'represent' &&
                                (!request.participant || !request.participant.live ||
                                    (request.participant.live.state !== PARTICIPANT_STATES.DELEGATED))
                                )
                            return (<TableRow key={`request_${request.id}`} style={{ background: delegationPending && "gainsboro" }}>
                                <TableCell style={{ color: "black", borderBottom: 'none' }}>
                                    {request.data.name}  {request.data.surname ? request.data.surname : ""}
                                </TableCell>
                                <TableCell style={{ color: "black", borderBottom: 'none' }}>
                                    {request.data.email}
                                </TableCell>
                                <TableCell style={{ color: "black", borderBottom: 'none' }}>
                                    {getTypeText(request.data.requestType)}
                                </TableCell>
                                {/* <TableCell style={{ color: "black", borderBottom: 'none' }}>
                                    
                                </TableCell> */}
                                <TableCell style={{ color: "black", borderBottom: 'none' }}>
                                    {moment(request.date).format('LLL')}
                                </TableCell>
                                <TableCell style={{ color: "black", borderBottom: 'none' }}>
                                    {request.participantCreated === false ?
                                        translate.pending :
                                            delegationPending ?
                                                translate.confirmed_pending_delegation :
                                            translate.confirmed}
                                </TableCell>
                                <TableCell style={{ color: "black", borderBottom: 'none' }}>
                                    <CheckShareholderRequest
                                        request={request}
                                        refetch={getData}
                                        translate={translate}
                                    />
                                </TableCell>
                            </TableRow>)
                        })}
                    </TableBody>
                </Table>
                <div style={{ display: "flex", alignItems: "center", marginTop: "2em" }}>
                    <PaginationFooter
                        page={usersPage}
                        translate={translate}
                        length={data.length}
                        total={usersTotal}
                        limit={10}
                        changePage={setUsersPage}
                        md={12}
                        xs={12}
                    />
                </div>
            </Scrollbar>
        </div >
    )
}

export default withApollo(ShareholdersRequestsPage);