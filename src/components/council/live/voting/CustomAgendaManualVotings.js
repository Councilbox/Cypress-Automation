import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { BasicButton, TextInput } from '../../../../displayComponents';
import { getSecondary } from '../../../../styles/colors';



const createManualBallotsMutation = gql`
    mutation CreateManualBallots($ballots: [ManualBallotBulk], $agendaId: Int!){
        createManualBallots(ballots: $ballots, agendaId: $agendaId){
            success
        }
    }
`;


const CustomAgendaManualVotings = ({ agenda, translate, createManualBallots, ...props }) => {
    const [state, setState] = React.useState(false)
    const [ballots, setBallots] = React.useState(new Map(agenda.ballots.filter(ballot => ballot.admin === 1).map(ballot => [ballot.itemId, ballot])));

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
        setState({
            loading: true
        });
        const response = await createManualBallots({
            variables: {
                ballots: Array.from(ballots.values()).map(ballot => ({
                    weight: ballot.weight,
                    itemId: ballot.itemId
                })),
                agendaId: agenda.id
            }
        });
        if (!response.errors) {
            setState({
                loading: false,
                success: true
            });
        }
    }

    const resetButtonStates = () => {
        setState({
            loading: false,
            success: false
        });
    }

    if(agenda.presentCensus === 0){
        return <span />
    }

    return (
        <div style={{ width: '100%', backgroundColor: 'white', paddingTop: '1em' }}> {/**padding: '0 1em' */}
            <div
                style={{
                    backgroundColor: 'white',
                    width: '100%',
                    marginBottom: '1em',
                    border: '1px solid gainsboro',
                    alignItems: 'center',
                    padding: '0.6em 1em'
                }}
            >
                {agenda.items.map(item => (
                    <div key={item.id} >
                        <TextInput
                            floatingText={item.value}
                            value={ballots.get(item.id) ? ballots.get(item.id).weight : 0}
                            onChange={event => updateBallotValue(item.id, event.target.value)}
                        />
                    </div>
                ))}
                <BasicButton
                    loading={state.loading}
                    success={state.success}
                    reset={resetButtonStates}
                    text={translate.save}
                    textStyle={{ color: 'white', fontWeight: '700' }}
                    color={getSecondary()}
                    onClick={sendBallots}
                />
                {/* <BasicButton
                    text={translate.save}
                    onClick={sendBallots}
                /> */}
            </div>
        </div>
        // <div style={{width: '100%'}}>
        //     {agenda.items.map(item => (
        //         <div key={item.id} style={{display: 'flex'}}>
        //             <TextInput
        //                 floatingText={item.value}
        //                 value={ballots.get(item.id)? ballots.get(item.id).weight : 0}
        //                 onChange={event => updateBallotValue(item.id, event.target.value)}
        //             />
        //         </div>
        //     ))}
        //     <BasicButton
        //         text={translate.save}
        //         onClick={sendBallots}
        //     />
        // </div>
    )
}

export default graphql(createManualBallotsMutation, {
    name: 'createManualBallots'
})(CustomAgendaManualVotings)