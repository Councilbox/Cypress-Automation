import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { BasicButton } from '../../../../displayComponents';
import ShareholderEditor from './ShareholderEditor';
import { getSecondary } from '../../../../styles/colors';


const ApproveRequestButton = ({ request, client, refetch, translate }) => {
    const [modal, setModal] = React.useState(null);
    const { requestType, attachments, ...cleanData } = request.data;
    const secondary = getSecondary()

    const approveRequest = async () => {
        const response = await client.mutate({
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
        setModal(false);
        refetch();
    }

    return (
        <>
            <BasicButton
                text="Aprobar"
                onClick={() => setModal(request)}
                buttonStyle={{
                    border: `1px solid ${secondary}`
                }}
                color="white"
                textStyle={{ color: secondary }}
                //onClick={approveRequest}
            />
            {modal &&
                <ShareholderEditor
                    open={modal}
                    refetch={approveRequest}
                    defaultValues={cleanData}
                    councilId={request.councilId}
                    requestClose={() => setModal(false)}
                />
            }
        </>
    )
}

export default withApollo(ApproveRequestButton);