import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import DelegationsRestrictionModal from './DelegationsRestrictionModal';


const councilDelegates = gql`
    query CouncilDelegates($councilId: Int!){
        councilDelegates(councilId: $councilId){
            participant {
                id
                name
                surname
            }
        }
    }
`;

const addCouncilDelegateMutation = gql`
    mutation AddCouncilDelegate($councilId: Int!, $participantId: Int!){
        addCouncilDelegate(councilId: $councilId, participantId: $participantId){
            success
        }
    }
`;

const removeCouncilDelegateMutation = gql`
    mutation RemoveCouncilDelegate($councilId: Int!, $participantId: Int!){
        removeCouncilDelegate(councilId: $councilId, participantId: $participantId){
            success
        }
    }
`;

const DelegationRestriction = ({ translate, council, client, ...props }) => {
    const [participants, setParticipants] = React.useState([]);
    const [modal, setModal] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    const getData = React.useCallback(async () => {
        const response = await client.query({
            query: councilDelegates,
            variables: {
                councilId: council.id
            }
        });

        setParticipants(response.data.councilDelegates.map(item => item.participant));

        console.log(response);
    }, [council.id]);

    const openSelectModal = () => {
        setModal(true);
    }

    const closeModal = () => {
        setModal(false);
    }

    const addCouncilDelegate = async participantId => {
        const response = await client.mutate({
            mutation: addCouncilDelegateMutation,
            variables: {
                councilId: council.id,
                participantId: participantId
            }
        });

        if(response.data.addCouncilDelegate.success){
            getData();
        }
    }

    const removeCouncilDelegate = async participantId => {
        const response = await client.mutate({
            mutation: removeCouncilDelegateMutation,
            variables: {
                councilId: council.id,
                participantId: participantId
            }
        })

        if(response.data.removeCouncilDelegate.success){
            getData();
        }
    }


    React.useEffect(() => {
        getData()
    }, [getData]);

    return (
        <div>
            TABLA CON PARTICIPANTES
            <button onClick={openSelectModal}>Añadir</button>
            {participants.map(participant => (
                <div key={`participant_${participant.id}`}>
                    {participant.name}
                    <button onClick={() => removeCouncilDelegate(participant.id)}>Borrar</button>
                </div>
            ))}
            <DelegationsRestrictionModal
                translate={translate}
                council={council}
                open={modal}
                addCouncilDelegate={addCouncilDelegate}
                requestClose={closeModal}
            />
        </div>
    )
}


export default withApollo(DelegationRestriction);