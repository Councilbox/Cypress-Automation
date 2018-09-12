import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { BasicButton } from '../../displayComponents';

class ToggleVideo extends React.Component {

    toggle = async () => {
        const response = await this.props.toggleVideo({
            variables: {
                id: 2
            }
        });
        console.log(response);
    }

    render(){
        return(
            <BasicButton
                text="Toggle video"
                onClick={this.toggle}
            />
        )
    }
}

const toggleVideo = gql`
    mutation ToggleFeature($id: Int!) {
        toggleFeature(id: $id){
            success
        }
    }
`;

export default graphql(toggleVideo, {
    name: 'toggleVideo'
})(ToggleVideo);