import React, { Component, Fragment } from "react"; 
import { BasicButton, LoadingSection, TextInput, Icon, ButtonIcon } from "../../../displayComponents"; 
import { compose, graphql, withApollo } from "react-apollo"; 
import { corporationUsers } from "../../../queries/corporation"; 
import { getSecondary } from "../../../styles/colors"; 
import { withRouter } from "react-router-dom"; 
import UserItem from "./UserItem"; 
import withTranslations from '../../../HOCs/withTranslations';
 
const DEFAULT_OPTIONS = {
    limit: 10,
    offset: 0,
}
 
class CorporationUsers extends Component { 
    state = {
        filterText: '',
        limit: DEFAULT_OPTIONS.limit
    }
 
    componentDidMount() { 
        this.props.data.refetch(); 
    } 

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
                    <div style={{width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
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
                            <UserItem key={`user_${user.id}`} user={user} translate={this.props.translate} />
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
)(withRouter(withApollo(withTranslations()(CorporationUsers)))); 