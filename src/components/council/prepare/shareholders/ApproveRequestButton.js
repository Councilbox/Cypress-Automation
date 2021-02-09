import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { BasicButton } from '../../../../displayComponents';
import { getSecondary } from '../../../../styles/colors';


const ApproveRequestButton = ({ request, client, refetch }) => {
    const secondary = getSecondary();
    const approveRequest = async () => {
        await client.mutate({
            mutation: gql`
                mutation ApproveShareholderRequest($requestId: Int!, $shareholder: ParticipantInput){
                    approveShareholderRequest(requestId: $requestId, shareholder: $shareholder){
                        success
                    }
                }
            `,
            variables: {
                requestId: request.id,
                shareholder: null
            }
        });
        refetch();
    };

    return (
        <>
            <BasicButton
                text="Archivar"
                onClick={approveRequest}
                buttonStyle={{
                    border: `1px solid ${secondary}`,
                    marginLeft: '0.4em'
                }}
                color="white"
                textStyle={{ color: secondary }}
                // onClick={approveRequest}
            />
        </>
    );
};

export default withApollo(ApproveRequestButton);
