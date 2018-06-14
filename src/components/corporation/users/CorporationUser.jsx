import React, { Component, Fragment } from "react"; 
import { ErrorWrapper } from "../../../displayComponents"; 
import { compose, graphql, withApollo } from "react-apollo"; 
import { getCorporationUser } from "../../../queries/corporation"; 
import { getPrimary, getSecondary } from "../../../styles/colors"; 
import withSharedProps from "../../../HOCs/withSharedProps"; 
import { withRouter } from "react-router-dom"; 
import UserItem from "./UserItem"; 
import { Card } from "material-ui"; 
import ScrollBar from "react-perfect-scrollbar"; 
 
class CorporationUser extends Component { 
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
    const { loading, error, corporationUser } = this.props.data; 
    const primary = getPrimary(); 
    return ( 
      <Card 
        title={translate.users} 
        style={{ height: "calc(100vh - 3em)", position: "relative" }} 
      > 
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
          !!corporationUser && ( 
            <div>{JSON.stringify(corporationUser)}</div> 
          ) 
        )} 
      </Card> 
    ); 
  } 
} 
 
export default withRouter(graphql(getCorporationUser, { 
    options: props => ({ 
        variables: { 
            id: props.match.params.id 
        }, 
        notifyOnNetworkStatusChange: true 
    }) 
})(withApollo(CorporationUser))); 