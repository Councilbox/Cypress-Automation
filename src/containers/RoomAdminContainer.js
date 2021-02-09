import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import withTranslations from '../HOCs/withTranslations';
import * as mainActions from '../actions/mainActions';

const RoomAdminContainer = ({ match, client, actions }) => {
    const getAdminToken = async () => {
        const response = await client.mutate({
            mutation: gql`
                mutation adminToken($token: String!){
                    adminToken(token: $token){
                        token
                    }
                }
            `,
            variables: {
                token: match.params.token
            }
        });

        if(response.data.adminToken){
            actions.loginSuccess(response.data.adminToken.token);
        }
    };


    React.useEffect(() => {
        getAdminToken();
    }, [match.params.token]);

    return (
        <div/>
    );
};


function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(mainActions, dispatch)
	};
}

export default connect(
	null,
	mapDispatchToProps
)(withTranslations()(withApollo(RoomAdminContainer)));
