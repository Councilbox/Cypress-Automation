import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { BasicButton } from '../../../displayComponents';

const ToggleVideo = ({ toggleVideo }) => {
    return(
        <BasicButton
            text="Toggle video"

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