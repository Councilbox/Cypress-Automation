import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { BasicButton, TextInput } from '../../../../displayComponents';


const createManualBallotsMutation = gql`
    mutation CreateManualBallots($ballots: [ManualBallotBulk], $agendaId: Int!){
        createManualBallots(ballots: $ballots, agendaId: $agendaId){
            success
        }
    }
`;


const CustomAgendaManualVotings = ({ agenda, translate, createManualBallots, ...props }) => {

    const [ballots, setBallots] = React.useState(new Map(agenda.ballots.map(ballot => [ballot.itemId, ballot])));

    console.log(ballots);


    const sendBallots = async () => {
        const response = await createManualBallots({
            variables: {
                ballots: [
                    {
                        itemId: agenda.items[0].id,
                        value: 100
                    },
                    {
                        itemId: agenda.items[1].id,
                        value: 20
                    },
                    {
                        itemId: agenda.items[2].id,
                        value: 5
                    }
                ],
                agendaId: agenda.id
            }
        });
    }

    return (
        <div style={{width: '100%'}}>
            {agenda.items.map(item => (
                <div key={item.id} style={{display: 'flex'}}>
                    <TextInput
                        floatingText={item.value}
                        value={ballots.get(item.id)? ballots.get(item.id).weight : 0}
                    />
                </div>
            ))}
            <BasicButton
                text={translate.save}
                onClick={sendBallots}
            />
        </div>
    )
}

export default graphql(createManualBallotsMutation, {
    name: 'createManualBallots'
})(CustomAgendaManualVotings)