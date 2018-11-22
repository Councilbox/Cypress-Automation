import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { BasicButton, TextInput } from '../../../displayComponents';

class LogoutUser extends React.Component {

    state = {
        userId: ''
    }

    toggle = async () => {
        if(this.state.userId){
            await this.props.logoutUser({
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
                    text="Logout user"
                    onClick={this.toggle}
                />
                <TextInput
                    floatingText={'User to logout'}
                    value={this.state.userId}
                    onChange={event => this.setState({ userId: event.target.value })}
                />
            </div>
        )
    }
}

const logoutUser = gql`
    mutation LogoutUser($userId: String!) {
        logoutUser(userId: $userId) {
            success
        }
    }
`;

export default graphql(logoutUser, {
    name: 'logoutUser'
})(LogoutUser);