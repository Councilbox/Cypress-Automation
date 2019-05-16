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

    const updateBallotValue = (itemId, value) => {
        let ballot = {
            ...ballots.get(itemId)
        };
        ballot.weight = value;
        ballot.itemId = itemId;
        ballots.set(itemId, ballot);
        setBallots(new Map(ballots));
    }


    const sendBallots = async () => {
        const response = await createManualBallots({
            variables: {
                ballots: Array.from(ballots.values()).map(ballot => ({
                    weight: ballot.weight,
                    itemId: ballot.itemId
                })),
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
                        onChange={event => updateBallotValue(item.id, event.target.value)}
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