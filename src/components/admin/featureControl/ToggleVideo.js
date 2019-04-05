import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { BasicButton } from '../../../displayComponents';

const ToggleVideo = ({ toggleVideo }) => {

    const toggle = async () => {
        await toggleVideo({
            variables: {
                id: 2
            }
        });
    }

    return(
        <BasicButton
            text="Toggle video"
            onClick={this.toggle}
        />
    )
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