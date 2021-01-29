import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { BasicButton } from '../../../../displayComponents';
import { getSecondary } from '../../../../styles/colors';

const RefreshCredsSendsButton = ({ translate, council, refreshCouncilCredsSends }) => {
    const [loading, setLoading] = React.useState(false);
    const secondary = getSecondary();

    const refreshCredSends = async () => {
        setLoading(true);
        await refreshCouncilCredsSends({
            variables: {
                councilId: council.id
            }
        });
        setLoading(false);
    }

    return (
        <div>
            <BasicButton
                text={translate.refresh_convened}
                color='white'
                loading={loading}
                loadingColor={secondary}
                type="flat"
                textStyle={{ color: secondary, fontWeight: '700', border: `1px solid ${secondary}` }}
                onClick={refreshCredSends}
            />
        </div>
    )
}

const refreshSends = gql`
    mutation RefreshCouncilCredsSends($councilId: Int!){
        updateCredentialsSends(councilId: $councilId){
            success
            message
        }
    }
`;

export default graphql(refreshSends, {
    name: 'refreshCouncilCredsSends'
})(RefreshCredsSendsButton);
