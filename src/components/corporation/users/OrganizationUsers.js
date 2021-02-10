import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { Icon, Card, CardActions } from 'material-ui';
import withSharedProps from '../../../HOCs/withSharedProps';
import { corporationUsers } from '../../../queries/corporation';
import { getPrimary } from '../../../styles/colors';
import { Scrollbar, Grid, PaginationFooter, LoadingSection, CardPageLayout, BasicButton, TextInput, Link, GridItem, AlertConfirm } from '../../../displayComponents';
import { moment } from '../../../containers/App';
import { USER_ACTIVATIONS } from '../../../constants';
import NewUser from './NewUser';
import { isMobile } from '../../../utils/screen';

const queryLimit = 20;

const getActivationText = (value, translate) => {
    const activations = {
        // TRADUCCION
        [USER_ACTIVATIONS.NOT_CONFIRMED]: 'No confirmado',
        [USER_ACTIVATIONS.CONFIRMED]: translate.confirmed,
        [USER_ACTIVATIONS.DEACTIVATED]: translate.disabled,
        [USER_ACTIVATIONS.UNSUBSCRIBED]: translate.blocked
    };

    return activations[value] ? activations[value] : activations[USER_ACTIVATIONS.CONFIRMED];
};

const OrganizationUsers = ({ client, translate, company }) => {
    const [inputSearch, setInputSearch] = React.useState(false);
    const [state, setState] = React.useState({
        filterTextCompanies: '',
        filterTextUsuarios: '',
        filterFecha: ''
    });
    const [users, setUsers] = React.useState(false);
    const [usersPage, setUsersPage] = React.useState(1);
    const [usersTotal, setUsersTotal] = React.useState(false);
    const [addUser, setAddUser] = React.useState(false);
    const primary = getPrimary();

    const getUsers = async () => {
        const response = await client.query({
            query: corporationUsers,
            variables: {
                filters: [{ field: 'businessName', text: state.filterTextCompanies }],
                options: {
                    limit: queryLimit,
                    offset: (usersPage - 1) * queryLimit,
                    orderDirection: 'DESC',
                },
                corporationId: company.id
            }
        });

        if (response.data.corporationUsers.list) {
            setUsers(response.data.corporationUsers.list);
            setUsersTotal(response.data.corporationUsers.total);
        }
    };

    React.useEffect(() => {
        getUsers();
    }, [state.filterTextCompanies, usersPage]);

    React.useEffect(() => {
        getUsers();
    }, [company.id, state.filterTextUsuarios, state.filterTextCompanies, usersPage]);


    const changePageUsuarios = value => {
        setUsersPage(value);
    };

    if (!users) {
        return <LoadingSection />;
    }

    if (addUser) {
        return (
            <NewUser
                translate={translate}
                requestClose={() => setAddUser(false)}
                styles={{
                    height: '100%',
                    display: 'flex',
                    width: '100%',
                    overflow: 'hidden'
                }}
            />
        );
    }

    return (
        <CardPageLayout title={translate.users} stylesNoScroll={{ height: '100%' }} disableScroll={true}>
            <div style={{ fontSize: '13px', padding: '1.5em 1.5em 1.5em', height: '100%', paddingTop: '0px' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ padding: '0.5em', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingTop: '0px' }}>
                        <BasicButton
                            buttonStyle={{ boxShadow: 'none', marginRight: '1em', borderRadius: '4px', border: `1px solid ${primary}`, padding: '0.2em 0.4em', marginTop: '5px', color: primary, }}
                            backgroundColor={{ backgroundColor: 'white' }}
                            onClick={() => setAddUser(true)}
                            text={translate.add}
                        />

                        <div style={{ padding: '0px 8px', fontSize: '24px', color: '#c196c3' }}>
                            <i className="fa fa-filter"></i>
                        </div>

                        <TextInput
                            className={isMobile && !inputSearch ? 'openInput' : ''}
                            disableUnderline={true}
                            styleInInput={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.54)', background: '#f0f3f6', padding: isMobile && inputSearch && '4px 5px', paddingLeft: !isMobile && '5px' }}
                            stylesAdornment={{ background: '#f0f3f6', marginLeft: '0', paddingLeft: isMobile && inputSearch ? '8px' : '4px' }}
                            adornment={<Icon onClick={() => setInputSearch(!inputSearch)} >search</Icon>}
                            placeholder={isMobile ? '' : translate.search}
                            type="text"
                            value={state.filterTextCompanies || ''}
                            onChange={event => {
                                setState({
                                    ...state,
                                    filterTextCompanies: event.target.value
                                });
                            }}
                        />
                    </div>
                </div>
                <div style={{ fontSize: '13px', height: '100%' }}>
                    {users.length === undefined ?
                        <LoadingSection />
                        : <TablaUsuarios
                            users={users}
                            company={company}
                            translate={translate}
                            total={usersTotal}
                            changePageUsuarios={changePageUsuarios}
                            usersPage={usersPage}
                        />
                    }
                </div>
            </div>
        </CardPageLayout>
    );
};


const TablaUsuarios = withApollo(({ users, translate, company, total, changePageUsuarios, usersPage, client }) => {
    const primary = getPrimary();
    const [modalBloquear, setModalBloquear] = React.useState(false);
    const [loadingBlock, setLoadingBlock] = React.useState(false);

    const setUserBloquear = data => {
        setModalBloquear(data);
    };

    const userBloquear = async () => {
        setLoadingBlock(true);
        await client.mutate({
            mutation: gql`
                mutation unsubscribeUser($userId: Int!){
                    unsubscribeUser(userId: $userId){
                        success
                        message
                    }
                }
            `,
            variables: {
                userId: modalBloquear.id
            }
        });
        setLoadingBlock(false);
        setModalBloquear(false);
    };

    const renderModalBlockUser = () => (
            <AlertConfirm
                requestClose={() => setModalBloquear(false)}
                open={modalBloquear}
                acceptAction={userBloquear}
                buttonAccept={translate.accept}
                loadingAction={loadingBlock}
                buttonCancel={translate.cancel}
                bodyText={
                    <div>Desactivar cuenta de usuario {`${modalBloquear.name} ${modalBloquear.surname}` || ''}</div>
                }
                title={'Bloquear'}
            />
        );

    if (isMobile) {
        return (
            <div style={{ height: 'calc( 100% - 5em )' }}>
                <div style={{ height: '100%' }}>
                    <Scrollbar>
                        <Grid style={{ padding: '2em 2em 1em 2em', height: '100%' }}>
                            {users.map(item => (
                                    <Card style={{ marginBottom: '0.5em', padding: '1em' }} key={item.id}>
                                        <Grid>
                                            <GridItem xs={4} md={4} lg={4} style={{ fontWeight: '700' }}>
                                                {translate.state}
                                            </GridItem>
                                            <GridItem xs={8} md={8} lg={8} style={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                                {getActivationText(item.actived, translate)}
                                            </GridItem>
                                            <GridItem xs={4} md={4} lg={4} style={{ fontWeight: '700' }}>
                                                Id
                                            </GridItem>
                                            <GridItem xs={8} md={8} lg={8} style={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                                {item.id}
                                            </GridItem>
                                            <GridItem xs={4} md={4} lg={4} style={{ fontWeight: '700' }}>
                                                {translate.name}
                                            </GridItem>
                                            <GridItem xs={8} md={8} lg={8} style={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                                {`${item.name} ${item.surname}` || ''}
                                            </GridItem>
                                            <GridItem xs={4} md={4} lg={4} style={{ fontWeight: '700' }}>
                                                {translate.email}
                                            </GridItem>
                                            <GridItem xs={8} md={8} lg={8} style={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                                {item.email}
                                            </GridItem>
                                            <GridItem xs={4} md={4} lg={4} style={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                            </GridItem>
                                            <GridItem xs={8} md={8} lg={8} style={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                                {item.lastConnectionDate ? moment(item.lastConnectionDate).format('LLL') : '-'}
                                            </GridItem>
                                            <CardActions>
                                                <Link
                                                    to={`/company/${company.id}/users/${item.id}/edit`}
                                                    styles={{
                                                        color: primary,
                                                        background: 'white',
                                                        marginRight: '1em'
                                                    }}>
                                                    {translate.edit}
                                                </Link>
                                                <BasicButton
                                                    onClick={() => setUserBloquear(item)}
                                                    backgroundColor={{
                                                        background: 'white',
                                                        padding: '0',
                                                        margin: '0',
                                                        boxShadow: 'none',
                                                        color: primary,
                                                        minHeight: '0',
                                                    }}
                                                    text="Bloquear">
                                                </BasicButton>
                                            </CardActions>
                                        </Grid>
                                    </Card>
                                ))}
                            {renderModalBlockUser()}
                            <Grid style={{ marginTop: '1em' }}>
                                <PaginationFooter
                                    page={usersPage}
                                    translate={translate}
                                    length={users.length}
                                    total={total}
                                    limit={queryLimit}
                                    changePage={changePageUsuarios}
                                    md={12}
                                    xs={12}
                                />
                            </Grid>
                        </Grid>
                    </Scrollbar>
                </div>
            </div>
        );
    }
        return (
            <div style={{ height: '100%' }}>
                <div style={{ fontSize: '13px', height: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1em', }}>
                        <div style={{ color: primary, fontWeight: 'bold', width: '10%', textAlign: 'left' }}>
                            {translate.state}
                        </div>
                        <div style={{ color: primary, fontWeight: 'bold', width: '10%', textAlign: 'left' }}>
                            Id
                        </div>
                        <div style={{ color: primary, fontWeight: 'bold', width: '20%', textAlign: 'left' }}>
                            {translate.name}
                        </div>
                        <div style={{ color: primary, fontWeight: 'bold', overflow: 'hidden', width: '20%', textAlign: 'left' }}>
                            Email
                        </div>
                        <div style={{ color: primary, fontWeight: 'bold', overflow: 'hidden', width: '20%', textAlign: 'left' }}>
                            {translate.last_connection}
                        </div>
                        <div style={{ color: primary, fontWeight: 'bold', overflow: 'hidden', width: '20%', textAlign: 'left' }}>
                        </div>
                    </div>
                    <div style={{ height: 'calc( 100% - 13em )' }}>
                        <Scrollbar>
                            {users.map(item => (
                                    <div
                                        key={item.id}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            padding: '1em',
                                            alignItems: 'center'
                                        }}>
                                        <Cell text={getActivationText(item.actived, translate)} width={10} />
                                        <Cell text={item.id} width={10} />
                                        <Cell text={`${item.name} ${item.surname}` || ''} width={20} />
                                        <Cell text={item.email} width={20} />
                                        <Cell text={item.lastConnectionDate ? moment(item.lastConnectionDate).format('LLL') : '-'} width={20} />
                                        <Cell
                                            width={20}
                                            styles={{ padding: '3px' }}
                                            text={
                                                <div style={{ display: 'flex' }}>
                                                    <Link
                                                        to={`/company/${company.id}/users/${item.id}/edit`}
                                                        styles={{
                                                            color: primary,
                                                            background: 'white',
                                                            borderRadius: '4px',
                                                            boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.5)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            padding: '0.3em',
                                                            marginRight: '1em',
                                                            width: '100px'
                                                        }}>
                                                        {translate.edit}
                                                    </Link>
                                                    <BasicButton
                                                        onClick={() => setUserBloquear(item)}
                                                        backgroundColor={{
                                                            background: 'white',
                                                            color: primary,
                                                        }}
                                                        text="Bloquear">
                                                    </BasicButton>
                                                </div>
                                            } />
                                    </div>
                                ))}
                        </Scrollbar>
                    </div>
                    {renderModalBlockUser()}
                    <Grid style={{ marginTop: '1em' }}>
                        <PaginationFooter
                            page={usersPage}
                            translate={translate}
                            length={users.length}
                            total={total}
                            limit={queryLimit}
                            changePage={changePageUsuarios}
                            md={12}
                            xs={12}
                        />
                    </Grid>
                </div>
            </div>
        );
});

const Cell = ({ text, width, styles }) => (
        <div style={{
            width: `${width}%`,
            textAlign: 'left',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            paddingRight: '10px',
            ...styles
        }}>
            {text}
        </div>
    );

export default withApollo(withSharedProps()(OrganizationUsers));
