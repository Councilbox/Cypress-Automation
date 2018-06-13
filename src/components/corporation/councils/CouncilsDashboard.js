import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { COUNCIL_STATES } from '../../../constants';


class CouncilsDashboard extends React.PureComponent {

    render(){
        console.log(this.props.data);

        return(
            <div>
                COUNCILS SECTION
            </div>
        )
    }
}

const corporationCouncils = gql`
    query corporationCouncils{
        corporationCouncils{
            id
            name
            state
            dateStart
        }
    }
`;

export default graphql(corporationCouncils, {
    options: props => ({
        variables: {
            state: COUNCIL_STATES.CONVENED,
            isMeeting: false,
            active: 1
        }
    })
})(CouncilsDashboard);