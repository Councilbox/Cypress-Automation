import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { LoadingSection, PaginationFooter, TextInput, DropDownMenu, Scrollbar } from '../../../../displayComponents';
import { usePolling } from '../../../../hooks';
import { Table, TableBody, TableRow, MenuItem } from 'material-ui';
import { TableHead } from 'material-ui';
import { TableCell } from 'material-ui';
import { moment } from '../../../../containers/App';
import { isMobile } from 'react-device-detect';
import { Icon } from 'material-ui';
import ApproveRequestButton from './ApproveRequestButton';
import ShareholderEditor from './ShareholderEditor';


const ShareholdersRequestsPage = ({ council, translate, client }) => {
    const [data, setData] = React.useState(null);
    const [modal, setModal] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [inputSearch, setInputSearch] = React.useState(false);
    const [search, setSearch] = React.useState('');
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
                        data
                        date
                        state
                        }
                        total
                    }
                }
            `,
            variables: {
                councilId: council.id,
                filters: [{ field: 'state', text: search }],
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
    }, [council.id])

    usePolling(getData, 12000);

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
                                    {/* TRADUCCION */}
                                    <MenuItem onClick={() => setSearch('1')} >
                                        Aceptada
                                    </MenuItem>
                                    <MenuItem onClick={() => setSearch('0')}>
                                        Pendiente
                                    </MenuItem>
                                </div>
                            }
                        />

                        {/* <TextInput
                        className={isMobile && !inputSearch ? "openInput" : ""}
                        disableUnderline={true}
                        styleInInput={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.54)", background: "#f0f3f6", padding: isMobile && inputSearch && "4px 5px", paddingLeft: !isMobile && "5px" }}
                        stylesAdornment={{ background: "#f0f3f6", marginLeft: "0", paddingLeft: isMobile && inputSearch ? "8px" : "4px" }}
                        adornment={<Icon onClick={() => setInputSearch(!inputSearch)} >search</Icon>}
                        floatingText={" "}
                        type="text"
                        value={search}
                        placeholder={isMobile ? "" : translate.search}
                        onChange={event => {
                            setSearch(event.target.value);
                        }}
                        styles={{ marginTop: "-16px" }}
                        stylesTextField={{ marginBottom: "0px" }}
                    /> */}
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
                            Archivos
                        {/* {translate.files} */}
                        </TableCell>
                        <TableCell style={{ color: 'rgb(125, 33, 128)', fontWeight: 'bold', borderBottom: 'none', fontSize: "0.75rem" }}>
                            {translate.date}
                        </TableCell>
                        <TableCell style={{ color: 'rgb(125, 33, 128)', fontWeight: 'bold', borderBottom: 'none', fontSize: "0.75rem" }}>
                            {translate.state}
                        </TableCell>
                    </TableHead>
                    <TableBody>
                        {data.map(request => (
                            <TableRow key={`request_${request.id}`}>
                                <TableCell style={{ color: "black", borderBottom: 'none' }}>
                                    {request.data.name}
                                </TableCell>
                                <TableCell style={{ color: "black", borderBottom: 'none' }}>
                                    {request.data.email}
                                </TableCell>
                                <TableCell style={{ color: "black", borderBottom: 'none' }}>
                                    {request.data.attachments ?
                                        request.data.attachments.map(attachment => (
                                            <div>
                                                <i className='fa fa-file-pdf-o' ></i>  {attachment.filename}
                                            </div>
                                        ))
                                        :
                                        ""
                                    }
                                </TableCell>
                                <TableCell style={{ color: "black", borderBottom: 'none' }}>
                                    {moment(request.date).format('LLL')}
                                </TableCell>
                                <TableCell style={{ color: "black", borderBottom: 'none' }}>
                                    {request.state === '0' ? "Pendiente" : "Aceptada"}
                                </TableCell>
                            </TableRow>
                        ))}
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