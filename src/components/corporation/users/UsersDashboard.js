import React from 'react';
import { graphql, compose } from 'react-apollo';
import { LoadingSection, TextInput, ButtonIcon, SelectInput, BasicButton, Link, Scrollbar } from '../../../displayComponents';
import UserItem from './UserItem';
import NewUser from './NewUser';
import { MenuItem, Table, TableRow, TableCell, InputAdornment } from 'material-ui';
import { corporationUsers } from '../../../queries/corporation';
import withTranslations from '../../../HOCs/withTranslations';
import { getSecondary } from '../../../styles/colors';
import { TableHead } from 'material-ui';

const DEFAULT_OPTIONS = {
    limit: 100,
    offset: 0,
    orderBy: 'lastConnectionDate',
    orderDirection: 'DESC'
}

class UsersDashboard extends React.PureComponent {
    state = {
        filterText: '',
        limit: DEFAULT_OPTIONS.limit,
        addUser: false
    }

    timeout = null;

    updateFilterText = (text) => {
        this.setState({
            filterText: text
        }, () => {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => this.refresh(), 450);
        });
    }

    updateLimit = (value) => {
        this.setState({
            limit: value
        }, () => this.refresh());
    }

    refresh = () => {
        let variables = {
            options: DEFAULT_OPTIONS
        };
        variables.options.limit = this.state.limit;
        variables.filters = [{ field: 'fullName', text: this.state.filterText }];
        this.props.data.refetch(variables);
    }

    render() {
        const { translate } = this.props;

        if (this.state.addUser) {
            return <NewUser translate={translate} requestClose={() => this.setState({ addUser: false })} />
        }

        return (
            <div
                style={{
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div
                    style={{
                        paddingLeft: '1.4em',
                        paddingRight: '1.4em',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid gainsboro'
                    }}
                >

                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <div style={{ marginLeft: '0.6em', justifyContent: 'flex-end' }}>
                            <TextInput
                                startAdornment={
                                    <InputAdornment position="start" style={{ marginRight: "1em" }}>
                                        <i className="fa fa-search" aria-hidden="true"></i>
                                    </InputAdornment>
                                }
                                floatingText={" "}
                                type="text"
                                value={this.state.filterText}
                                onChange={event => {
                                    this.updateFilterText(event.target.value);
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div style={{
                    height: 'calc(100% - 6em)',
                    flexDirection: 'column',
                    padding: "1em"
                }}>
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}
                    >
                        <div>
                            <BasicButton
                                text={this.props.translate.users_add}
                                color={getSecondary()}
                                icon={<ButtonIcon type="add" color="white" />}
                                textStyle={{ textTransform: 'none', color: 'white', fontWeight: '700' }}
                                onClick={() => this.setState({
                                    addUser: true
                                })}
                            />
                        </div>
                        <div>
                            <SelectInput
                                value={this.state.limit}
                                onChange={event => {
                                    this.updateLimit(event.target.value);
                                }}
                            >
                                <MenuItem value={10}>
                                    10
                                </MenuItem>
                                <MenuItem value={20}>
                                    20
                            </MenuItem>
                            </SelectInput>
                        </div>
                    </div>
                    <Table
                        style={{ width: "100%", maxWidth: "100%" }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ width: "15%", padding: '4px 56px 4px 15px', textAlign: "center" }}>{translate.state}</TableCell>
                                <TableCell style={{ width: "10%", padding: '4px 56px 4px 15px' }}>Id</TableCell>
                                <TableCell style={{ width: "25%", padding: '4px 56px 4px 15px' }}>{translate.name}</TableCell>
                                <TableCell style={{ width: "25%", padding: '4px 56px 4px 15px' }}>{translate.email}</TableCell>
                                <TableCell style={{ width: "25%", padding: '4px 56px 4px 15px' }}>Ultima Conexion</TableCell>
                            </TableRow>
                        </TableHead>
                    </Table>
                    <div style={{ height: "calc( 100% - 5em)" }}>
                        <Scrollbar>
                            {this.props.data.loading ?
                                <LoadingSection />
                                :
                                this.props.data.corporationUsers.list.map(user => (
                                    <Link to={`/users/edit/${user.id}`} key={`user_${user.id}`} >
                                        <UserItem
                                            user={user}
                                            clickable={true}
                                            translate={this.props.translate}
                                        />
                                    </Link>
                                ))
                            }
                        </Scrollbar>
                    </div>
                </div>



                {/* <div style={{
                        height: 'calc(100% - 6em)',
                        flexDirection: 'column',
                        padding: "1em"
                    }}>
                        <Scrollbar>
                            {this.props.data.loading ?
                                <LoadingSection />
                                :
                                this.props.data.corporationUsers.list.map(user => (
                                    <Link to={`/users/edit/${user.id}`} key={`user_${user.id}`} >
                                        <UserItem
                                            user={user}
                                            clickable={true}
                                            translate={this.props.translate}
                                        />
                                    </Link>
                                ))
                            }
                        </Scrollbar>
                    </div> */}
            </div>
        );
    }
}

export default compose(
    graphql(corporationUsers, {
        options: props => ({
            variables: {
                options: DEFAULT_OPTIONS
            },
            notifyOnNetworkStatusChange: true
        })
    })
)(withTranslations()(UsersDashboard));