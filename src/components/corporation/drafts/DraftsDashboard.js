import React from 'react';
import { graphql } from 'react-apollo';
import { corporationDrafts } from "../../../queries";

class DraftsDashboard extends React.PureComponent {

    render(){
        console.log(this.props.data);

        return(
            <div>
                CORPORATION DRAFTS
            </div>
        )
    }
}

export default graphql(corporationDrafts)(DraftsDashboard);