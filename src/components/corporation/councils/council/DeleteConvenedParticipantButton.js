import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { AlertConfirm, BasicButton } from '../../../../displayComponents';


const DeleteConvenedParticipantButton = ({ translate, participant, client }) => {
    const [modal, setModal] = React.useState(false);
    
    console.log(participant);

    const killParticipant = async () => {
        const response = await client.mutate({
            mutation: gql`
                mutation removeConvenedParticipant($participantId: Int!){
                    removeConvenedParticipant(participantId: $participantId){
                        success
                        message
                    }
                }
            `,
            variables: {
                participantId: participant.id
            }
        });

        console.log(response)
    }

    return (
        <>
            <BasicButton
                text="Matar"
                onClick={() => setModal(true)}
            />
            <AlertConfirm
                open={modal}
                requestClose={() => setModal(false)}
                title={translate.warning}
                acceptAction={killParticipant}
                buttonAccept={translate.accept}
                buttonCancel={translate.close}
                bodyText={ `Estás seguro que quieres matar a ${participant.name} ${participant.surname || ''}`}
            />
        </>
    )
}

export default withApollo(DeleteConvenedParticipantButton);