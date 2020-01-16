import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import withSharedProps from '../../../HOCs/withSharedProps';
import { corporationUsers } from '../../../queries/corporation';
import { getPrimary } from '../../../styles/colors';
import { Icon, Avatar } from 'material-ui';
import { Scrollbar, Grid, PaginationFooter, LoadingSection, CardPageLayout, BasicButton, TextInput, Link } from '../../../displayComponents';
import { moment } from '../../../containers/App';
import DeactivateAccount from './DeactivateAccount';
import RestoreAccount from './RestoreAccount';
import { USER_ACTIVATIONS } from '../../../constants';
import MenuSuperiorTabs from '../../dashboard/MenuSuperiorTabs';




const OrganizationUsers = ({ client, translate, company }) => {
    const [total, setTotal] = React.useState(null);
    const [addEntidades, setEntidades] = React.useState(false);
    const [selectedCompany, setSelectedCompany] = React.useState(null);
    const [selecteEntUsu, setSelecteEntUsu] = React.useState('Usuarios');
    const [state, setState] = React.useState({
        filterTextCompanies: "",
        filterTextUsuarios: "",
        filterFecha: ""
    });
    const [users, setUsers] = React.useState(false);
    const [usersPage, setUsersPage] = React.useState(1);
    const [usersTotal, setUsersTotal] = React.useState(false);
    const [companies, setCompanies] = React.useState(false);
    const [companiesPage, setCompaniesPage] = React.useState(1);
    const [companiesTotal, setCompaniesTotal] = React.useState(false);

    const primary = getPrimary();

    const getUsers = async () => {
        const response = await client.query({
            query: corporationUsers,
            variables: {
                filters: [{ field: 'businessName', text: state.filterTextCompanies }],
                options: {
                    limit: 20,
                    offset: (usersPage - 1) * 20,
                    orderDirection: 'DESC'
                },
                corporationId: company.id
            }
        });

        if (response.data.corporationUsers.list) {
            setUsers(response.data.corporationUsers.list)
            setUsersTotal(response.data.corporationUsers.total)
        }
    }

    const getCompanies = async () => {
        const response = await client.query({
            query: corporationCompanies,
            variables: {
                filters: [{ field: 'businessName', text: state.filterTextCompanies }],
                options: {
                    limit: 10,
                    offset: (companiesPage - 1) * 10,
                    orderDirection: 'DESC'
                },
                corporationId: company.id
            }
        });

        if (response.data.corporationCompanies.list) {
            setCompanies(response.data.corporationCompanies.list)
            setCompaniesTotal(response.data.corporationCompanies.total)
        }
    }
    const changePageCompanies = value => {
        setCompaniesPage(value)
    }

    React.useEffect(() => {
        getUsers()
    }, [state.filterTextCompanies, usersPage]);

    React.useEffect(() => {
        if (selecteEntUsu === "Usuarios") {
            getUsers();
        } else {
            getCompanies()
        }
    }, [company.id, state.filterTextUsuarios, state.filterTextCompanies, selecteEntUsu, usersPage, companiesPage]);


    const changePageUsuarios = value => {
        setUsersPage(value)
    }

    if (!users) {
        return <LoadingSection />;
    }

    // if (addEntidades) {
    // 	return <NewCompanyPage requestClose={() => setEntidades(false)} buttonBack={true} />
    // }

    return (
        <CardPageLayout title={translate.users} stylesNoScroll={{ height: "100%" }} disableScroll={true}>
            <div style={{ fontSize: "13px", padding: '1.5em 1.5em 1.5em', height: "100%" }}>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    {/* <div>
                        <div>
                            <MenuSuperiorTabs
                                items={['Usuarios', 'Entidades']}
                                setSelect={setSelecteEntUsu}
                            />
                        </div>
                    </div> */}
                    <div style={{ padding: "0.5em", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                        <BasicButton
                            buttonStyle={{ boxShadow: "none", marginRight: "1em", borderRadius: "4px", border: `1px solid ${primary}`, padding: "0.2em 0.4em", marginTop: "5px", color: primary, }}
                            backgroundColor={{ backgroundColor: "white" }}
                            text={translate.add}
                            onClick={() => setEntidades(true)}
                        />

                        <div style={{ padding: "0px 8px", fontSize: "24px", color: "#c196c3" }}>
                            <i className="fa fa-filter"></i>
                        </div>

                        <TextInput
                            placeholder={translate.search}
                            adornment={<Icon style={{ background: "#f0f3f6", paddingLeft: "5px", height: '100%', display: "flex", alignItems: "center", justifyContent: "center" }}>search</Icon>}
                            type="text"
                            value={state.filterTextCompanies || ""}
                            styleInInput={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.54)", background: "#f0f3f6", marginLeft: "0", paddingLeft: "8px" }}
                            disableUnderline={true}
                            stylesAdornment={{ background: "#f0f3f6", marginLeft: "0", paddingLeft: "8px" }}
                            onChange={event => {
                                setState({
                                    ...state,
                                    filterTextCompanies: event.target.value
                                })
                            }}
                        />
                    </div>
                </div>
                <div style={{ fontSize: "13px", height: '100%' }}>
                    {selecteEntUsu === 'Usuarios' ?
                        users.length === undefined ?
                            <LoadingSection />
                            :
                            <TablaUsuarios
                                users={users}
                                translate={translate}
                                total={usersTotal}
                                changePageUsuarios={changePageUsuarios}
                                usersPage={usersPage}
                            />
                        :
                        companies.length === undefined ?
                            <LoadingSection />
                            :
                            <TablaCompanies
                                companies={companies}
                                translate={translate}
                                total={companiesTotal}
                                changePageCompanies={changePageCompanies}
                                companiesPage={companiesPage}
                            />
                    }
                </div>
            </div>
        </CardPageLayout>
    )
}


const TablaUsuarios = ({ users, translate, total, changePageUsuarios, usersPage }) => {

    return (
        <div style={{ height: '100%' }}>
            <div style={{ fontSize: "13px", height: '100%' }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "1em", }}>
                    <div style={{ color: getPrimary(), fontWeight: "bold", width: '10%', textAlign: 'left' }}>
                        Estado
				</div>
                    <div style={{ color: getPrimary(), fontWeight: "bold", width: '10%', textAlign: 'left' }}>
                        Id
				</div>
                    <div style={{ color: getPrimary(), fontWeight: "bold", width: '20%', textAlign: 'left' }}>
                        Nombre
				</div>
                    <div style={{ color: getPrimary(), fontWeight: "bold", overflow: "hidden", width: '30%', textAlign: 'left' }}>
                        Email
				</div>
                    <div style={{ color: getPrimary(), fontWeight: "bold", overflow: "hidden", width: '20%', textAlign: 'left' }}>
                        Últ.Conexión
				</div>
                    <div style={{ color: getPrimary(), fontWeight: "bold", overflow: "hidden", width: '10%', textAlign: 'left' }}>
                    </div>
                </div>
                <div style={{ height: "calc( 100% - 13em )" }}>
                    <Scrollbar>
                        {users.map(item => {
                            return (
                                <div
                                    key={item.id}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        padding: "1em",
                                        alignItems: "center"
                                    }}>
                                    <Cell text={item.actived} width={10} />
                                    <Cell text={item.id} width={10} />
                                    <Cell text={item.name + " " + item.surname} width={20} />
                                    <Cell text={item.email} width={30} />
                                    <Cell text={moment(item.lastConnectionDate).format("LLL")} width={20} />
                                    <Cell width={10}
                                        styles={{ padding: "3px" }}
                                        text={
                                            <div style={{ display: "flex" }}>
                                                <Link
                                                    to={`/edit/${item.id}`}
                                                    styles={{
                                                        color: getPrimary(),
                                                        background: 'white',
                                                        borderRadius: '4px',
                                                        boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.5)',
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        padding: "0.3em",
                                                        marginRight: "1em",
                                                        width: "100px"
                                                    }}>
                                                    {translate.edit}
                                                </Link>
                                                <Link
                                                    to={`/edit/${item.id}`}
                                                    styles={{
                                                        color: getPrimary(),
                                                        background: 'white',
                                                        borderRadius: '4px',
                                                        boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.5)',
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        padding: "0.3em",
                                                        marginRight: "1em",
                                                        width: "100px"
                                                    }}>
                                                    Bloquear
                                                </Link>
                                            </div>
                                        } />
                                </div>

                            )
                        })}
                    </Scrollbar>
                </div>
                <Grid style={{ marginTop: "1em" }}>
                    <PaginationFooter
                        page={usersPage}
                        translate={translate}
                        length={users.length}
                        total={total}
                        limit={10}
                        changePage={changePageUsuarios}
                        md={12}
                        xs={12}
                    />
                </Grid>
            </div>
        </div>
    )
}

const TablaCompanies = ({ companies, translate, total, changePageCompanies, companiesPage }) => {

    return (
        <div style={{ fontSize: "13px", height: '100%' }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "1em", }}>
                <div style={{ color: getPrimary(), fontWeight: "bold", width: '33%', textAlign: 'left' }}>

                </div>
                <div style={{ color: getPrimary(), fontWeight: "bold", width: '33%', textAlign: 'left' }}>
                    Id
				</div>
                <div style={{ color: getPrimary(), fontWeight: "bold", width: '33%', textAlign: 'left' }}>
                    Nombre
				</div>
            </div>
            <div style={{ height: "calc( 100% - 13em )" }}>
                <Scrollbar>
                    {companies.map(item => {
                        return (
                            <div
                                key={item.id}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    padding: "1em"
                                }}>
                                <CellAvatar width={33} avatar={item.logo} />
                                <Cell width={33} text={item.id} />
                                <Cell width={33} text={item.businessName} />
                            </div>

                        )
                    })}
                </Scrollbar>
            </div>
            <Grid style={{ marginTop: "1em" }}>
                <PaginationFooter
                    page={companiesPage}
                    translate={translate}
                    length={companies.length}
                    total={total}
                    limit={10}
                    changePage={changePageCompanies}
                />
            </Grid>
        </div>
    )
}


const getActivationText = value => {
    const activations = {
        [USER_ACTIVATIONS.NOT_CONFIRMED]: 'Sin confirmar',
        [USER_ACTIVATIONS.CONFIRMED]: 'Confirmado',
        [USER_ACTIVATIONS.DEACTIVATED]: 'Deshabilitada'
    }

    return activations[value] ? activations[value] : activations[USER_ACTIVATIONS.CONFIRMED];
}

const CellAvatar = ({ avatar, width }) => {
    return (
        <div style={{ overflow: "hidden", width: `${width}%`, textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: "10px" }}>
            {avatar ?
                <Avatar src={avatar} alt="Foto" />
                :
                <i style={{ color: 'lightgrey', fontSize: "1.7em", marginLeft: '6px' }} className={'fa fa-building-o'} />
            }
        </div>
    )
}

const Cell = ({ text, width, styles }) => {
    return (
        <div style={{ overflow: "hidden", width: `${width}%`, textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: "10px", ...styles }}>
            {text}
        </div>
    )
}

const corporationCompanies = gql`
    query corporationCompanies($filters: [FilterInput], $options: OptionsInput, $corporationId: Int!){
        corporationCompanies(filters: $filters, options: $options, corporationId: $corporationId){
            list{
                id
                businessName
                logo
            }
            total
        }
    }
`;



export default withApollo(withSharedProps()(OrganizationUsers));
