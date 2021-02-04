import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { BasicButton } from '../../../displayComponents';

const ToggleRecordings = ({ toggleRecordings }) => (
        <BasicButton
            text="Toggle recordings"
        />
    )


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
