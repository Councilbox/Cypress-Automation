import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { BasicButton } from '../../../../displayComponents';
import ShareholderEditor from './ShareholderEditor';
import { getSecondary } from '../../../../styles/colors';


const ApproveRequestButton = ({ request, client, refetch, translate, council }) => {
    const [modal, setModal] = React.useState(null);
    let { requestType, legalTermsAccepted, attachments, earlyVotes, representative, ...cleanData } = request.data;
    cleanData.numParticipations = +cleanData.numParticipations || 1;
    cleanData.socialCapital = cleanData.numParticipations || 1;
    cleanData.personOrEntity = cleanData.personOrEntity ? +cleanData.personOrEntity : 0;
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


    const sendPrueba = async participant => {
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
                participantId: request.participantId
            }
        });
    }

    return (
        <>
            <BasicButton
                disabled={request.participantCreated}
                text={request.participantCreated? 'Ya creado' : "Añadir al censo"}
                onClick={() => {
                    request.participantCreated?
                    sendPrueba()
                    :
                    setModal(request)
                }}
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
                    council={council}
                    participations={true}
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