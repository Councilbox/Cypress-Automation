import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { BasicButton } from '../../displayComponents';

class ToggleRecordings extends React.Component {

    toggle = async () => {
        const response = await this.props.toggleRecordings({
            variables: {
                id: 3
            }
        });
    }

    render(){
        return(
            <BasicButton
                text="Toggle recordings"
                onClick={this.toggle}
            />
        )
    }
}

const toggleRecordings = gql`
    mutation ToggleFeature($id: Int!) {
        toggleFeature(id: $id){
            success
        }
    }
`;

export default graphql(toggleRecordings, {
    name: 'toggleRecordings'
})(ToggleRecordings);