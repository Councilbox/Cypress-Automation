import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { BasicButton } from '../../../displayComponents';
import { getSecondary } from '../../../styles/colors';

class CloseSessionButton extends React.PureComponent {
    closeUserSessions = async () => {
        await this.props.closeUserSessions({
            variables: {
                userId: this.props.user.id
            }
        });
    }

    render() {
        return (
            <BasicButton
                text={this.props.translate.close_sessions}
                textStyle={{ textTransform: 'none', fontWeight: '700', color: 'white' }}
                color={getSecondary()}
                onClick={this.closeUserSessions}
            />
        );
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
