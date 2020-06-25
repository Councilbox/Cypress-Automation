import React from 'react';
import { withApollo } from 'react-apollo';
import { Checkbox, SectionTitle } from '../../../../displayComponents';
import { getPrimary } from '../../../../styles/colors';
import gql from 'graphql-tag';


const VoteLetterWithSenseOption = ({ council, client, translate }) => {
    const [canEarlyVote, setCanEarlyVote] = React.useState(council.statute.canEarlyVote);
    const primary = getPrimary();

    const send = async value => {
        setCanEarlyVote(value);
        await client.mutate({
            mutation: gql`
                mutation UpdateCouncilStatute($councilId: Int!, $statute: CouncilOptions!){
                    updateCouncilStatute(councilId: $councilId, statute: $statute){
                        id
                        canEarlyVote
                    }
                }
            `,
            variables: {
                councilId: council.id,
                statute: {
                    canEarlyVote: value
                }
            }
        });
    }

    return (
        <>
            <SectionTitle
                text={'Opciones de voto' /**TRADUCCION */}
                color={primary}
                style={{
                    marginTop: '1.6em'
                }}
            />
            <Checkbox
                label={'Permite indicar sentido del voto por punto en la carta de voto' /*TRADUCCION*/}
                value={canEarlyVote}
                onChange={(event, isInputChecked) => {
                    send(isInputChecked)
                }}
            />
        </>

    )
}

export default withApollo(VoteLetterWithSenseOption);