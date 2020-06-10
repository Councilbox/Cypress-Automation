import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { BasicButton } from '../../../../displayComponents';
import ShareholderEditor from './ShareholderEditor';
import { getSecondary } from '../../../../styles/colors';


const ApproveRequestButton = ({ request, client, refetch, translate }) => {
    const [modal, setModal] = React.useState(null);
    const { requestType, attachments, earlyVotes, representative, ...cleanData } = request.data;
    const secondary = getSecondary();
    const buttonColor = request.participantCreated? 'grey' : secondary;

    const setParticipantCreated = async participant => {
        const response = await client.mutate({
            mutation: gql`
                mutation SetRequestShareholderCreated($requestId: Int!, $participantId: Int!){
                    setRequestShareholderCreated(requestId: $requestId, participantId: $participantId){
                        success
                    }
                }
            `,
            variables: {
                requestId: request.id,
                participantId: participant.id
            }
        });
        refetch();
        setModal(false);
    }

    return (
        <>
            <BasicButton
                disabled={request.participantCreated}
                text={request.participantCreated? 'Accionista ya creado' : "Añadir el accionista al censo"}
                onClick={() => setModal(request)}
                buttonStyle={{
                    border: `1px solid ${buttonColor}`
                }}
                color="white"
                textStyle={{ color: buttonColor }}
                //onClick={approveRequest}
            />
            {modal &&
                <ShareholderEditor
                    open={modal}
                    refetch={setParticipantCreated}
                    defaultValues={cleanData}
                    councilId={request.councilId}
                    requestClose={() => setModal(false)}
                />
            }
        </>
    )
}

export default withApollo(ApproveRequestButton);