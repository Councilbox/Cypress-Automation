import React, { Component, Fragment } from "react"; 
import { 
    ErrorWrapper 
} from "../../../displayComponents"; 
import { compose, graphql, withApollo } from "react-apollo"; 
import { getCorporationUsers } from "../../../queries/corporation"; 
import { getPrimary, getSecondary } from "../../../styles/colors"; 
import { withRouter } from "react-router-dom"; 
import UserItem from "./UserItem"; 
import { Card } from "material-ui"; 
import ScrollBar from "react-perfect-scrollbar"; 
 
 
 
class CorporationUsers extends Component { 
    constructor(props) { 
        super(props); 
        this.state = { 
            selectedIndex: -1, 
            selectedValues: [] 
        }; 
    } 
 
    componentDidMount() { 
        this.props.data.refetch(); 
    } 
 
    render() { 
        const { translate } = this.props; 
        const { loading, error, corporationUsers } = this.props.data; 
        const primary = getPrimary(); 
        return ( 
            <Card title={translate.users} style={{ height: 'calc(100vh - 3em)', position: 'relative' }}> 
                {error ? ( 
                    <div> 
                        {error.graphQLErrors.map(error => { 
                            return ( 
                                <ErrorWrapper 
                                    error={error} 
                                    translate={translate} 
                                /> 
                            ); 
                        })} 
                    </div> 
                ) : ( 
                        <ScrollBar > 
                            {!!corporationUsers && ( 
                                corporationUsers.map(user => { 
                                    return ( 
                                        <UserItem key={user.id} user={user} /> 
                                    ) 
                                }) 
                            )} 
                        </ScrollBar> 
 
                    )} 
            </Card> 
        ); 
    } 
} 
 
export default compose( 
    graphql(getCorporationUsers, { 
        options: props => ({ 
            notifyOnNetworkStatusChange: true 
        }) 
    }) 
)(withRouter(withApollo(CorporationUsers))); 