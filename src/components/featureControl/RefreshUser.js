import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { BasicButton, TextInput } from '../../displayComponents';

class RefreshUser extends React.Component {

    state = {
        userId: ''
    }

    toggle = async () => {
        if(this.state.userId){
            await this.props.refreshUser({
                variables: {
                    userId: this.state.userId
                }
            });
        }
    }

    render(){
        return(
            <div style={{display: 'flex'}}>
                <BasicButton
                    text="Refresh user"
                    onClick={this.toggle}
                />
                <TextInput
                    floatingText={'User to refresh'}
                    value={this.state.userId}
                    onChange={event => this.setState({ userId: event.target.value })}
                />
            </div>
        )
    }
}

const refreshUser = gql`
    mutation ($userId: String!){
        refreshParticipantApp(userId: $userId) {
            success
        }
    }
`;

export default graphql(refreshUser, {
    name: 'refreshUser'
})(RefreshUser);