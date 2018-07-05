import React from 'react';
import { graphql, compose } from 'react-apollo';
import { LoadingSection, TextInput, ButtonIcon, SelectInput, BasicButton, Icon, Link, Scrollbar } from '../../../displayComponents';
import UserItem from './UserItem';
import NewUser from './NewUser';
import { MenuItem } from 'material-ui';
import { corporationUsers } from '../../../queries/corporation';
import withTranslations from '../../../HOCs/withTranslations';
import { getSecondary } from '../../../styles/colors';

const DEFAULT_OPTIONS = {
    limit: 10,
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
        variables.filters = [{field: 'fullName', text: this.state.filterText}];
        this.props.data.refetch(variables);
    }

    render() {

        if(this.state.addUser){
            return <NewUser translate={this.props.translate} requestClose={() => this.setState({ addUser: false})} />
        }

        return (
            <div
                style={{
                    height: 'calc(100vh - 3em)',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div
                    style={{
                        marginLeft: '1.4em',
                        marginRight: '1.4em',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid gainsboro'
                    }}
                >
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
                    <div style={{width: '600px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                        <div>
                            <BasicButton
                                text={this.props.translate.users_add}
                                color={getSecondary()}
                                icon={<ButtonIcon type="add" color="white" />}
                                textStyle={{textTransform: 'none', color: 'white', fontWeight: '700'}}
                                onClick={() => this.setState({
                                    addUser: true
                                })}
                            />
                        </div>
                        <div style={{marginLeft: '0.6em'}}>
                            <TextInput
                                adornment={<Icon>search</Icon>}
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
                    height: 'calc(100vh - 6em)',
                    flexDirection: 'column',
                    overflowY: 'auto',
                    overflowX: 'hidden'
                }}>
                    {this.props.data.loading?
                        <LoadingSection />
                    :
                        this.props.data.corporationUsers.list.map(user => (
                            <Link to={`/users/edit/${user.id}`} >
                                <UserItem
                                    key={`user_${user.id}`}
                                    user={user}
                                    clickable={true}
                                    translate={this.props.translate}
                                />
                            </Link>
                        ))
                    }
                </div>
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