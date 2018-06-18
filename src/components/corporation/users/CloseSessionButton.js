import React from 'react';
import { BasicButton } from '../../../displayComponents';
import { getSecondary } from '../../../styles/colors';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

class CloseSessionButton extends React.PureComponent {

    closeUserSessions = async () => {
        const response = await this.props.closeUserSessions({
            variables: {
                userId: this.props.user.id
            }
        });

        console.log(response);

        if(!response.errors){

        }
    }

    render(){
        return(
            <BasicButton
                text={this.props.translate.close_sessions}
                textStyle={{textTransform: 'none', fontWeight: '700', color: 'white'}}
                color={getSecondary()}
                onClick={this.closeUserSessions}
            />
        )
    }
}

const closeUserSessions = gql`
    mutation CloseUserSessions($userId: Int!){
        closeUserSessions(userId: $userId){
            success
            message
        }
    }
`;

export default graphql(closeUserSessions, {
    name: 'closeUserSessions'
})(CloseSessionButton);