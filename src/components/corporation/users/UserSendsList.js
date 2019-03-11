import React from 'react';
import { Typography} from 'material-ui';
import { getPrimary } from '../../../styles/colors';
import { RefreshButton } from '../../../displayComponents';
import NotificationsTable from '../../notifications/NotificationsTable';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

class UserSendsList extends React.PureComponent {

    state = {
        visible: false
    }

    toggleVisible = () => {
        this.setState({
            visible: !this.state.visible
        });
    }

    refreshUserSends = async () => {
        const response = await this.props.refreshUserSends({
            variables: {
                userId: this.props.user.id
            }
        })

        if(!response.errors){
            this.props.refetch();
        }
    }

    render(){
        const { translate } = this.props;

        return(
            <React.Fragment>
                <div style={{width: '100%', display: 'flex', flexDirection: 'row', marginTop: '0.8em', alignItems: 'center'}}>
                    <Typography variant="subheading" style={{color: getPrimary(), marginRight: '0.6em'}}>
                        {translate.sends}
                    </Typography>
                    <RefreshButton
                        tooltip={`${
                            translate.refresh_convened
                        }`}
                        onClick={this.refreshUserSends}
                    />
                </div>
                <div style={{width: '100%', display: 'flex'}}>
                    <NotificationsTable notifications={this.props.user.sends} translate={translate} visib={this.state.visible} handleToggleVisib={this.toggleVisible} />
                </div>
            </React.Fragment>
        )
    }
}

const refreshUserSends = gql`
    mutation RefreshUserSends($userId: Int!){
        refreshUserSends(userId: $userId){
            id
            reqCode
        }
    }
`;

export default graphql(refreshUserSends, {
    name: 'refreshUserSends'
})(UserSendsList);