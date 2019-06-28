import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { BasicButton, TextInput } from '../../../../displayComponents';
import { getSecondary } from '../../../../styles/colors';
import { Table, TableHead, Card, TableBody, TableCell, TableRow, CardHeader } from 'material-ui';
import { isMobile } from 'react-device-detect';



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
    const maxBallot = agenda.presentCensus;
    const maxTotal = agenda.presentCensus * agenda.options.maxSelections;
    const totalWeight = getActualRecount(ballots);

    const updateBallotValue = (itemId, value) => {
        let correctedValue = value;
        let ballot = {
            ...ballots.get(itemId)
        };
        if(((totalWeight - ballot.weight) + value) > maxTotal){
            correctedValue = maxTotal - (totalWeight - ballot.weight);
        }
        if(correctedValue > maxBallot){
            correctedValue = maxBallot;
        }
        ballot.weight = correctedValue;
        ballot.itemId = itemId;
        ballots.set(itemId, ballot);
        setBallots(new Map(ballots));
        props.changeEditedVotings(true);
    }

    function getActualRecount(ballotsMap) {
        return Array.from(ballotsMap.values()).reduce((acc, item) => item.weight + acc, 0);
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
        props.changeEditedVotings(false);
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

    //TRADUCCION
    return (
        <div style={{ width: '100%', backgroundColor: 'white', paddingTop: '1em' }}> {/**padding: '0 1em' */}
            <hr></hr>
            <div>
                <h5>
                    Introducir recuento
                </h5>
            </div>
            {/* {isMobile ?
                renderInMobil()
                : */}
            <div
                style={{
                    backgroundColor: 'white',
                    width: '100%',
                    marginBottom: '1em',
                    border: '1px solid gainsboro',
                    alignItems: 'center',

                }}
            >
                <div style={{
                    width: '100%',
                    marginBottom: '0.3em',
                    borderBottom: "1px solid gainsboro",
                    display: "flex",
                    justifyContent: "space-between",
                    padding: '0.3em 0.5em',
                    color: "#e02e2e"
                }}
                >
                    <div>
                        * Máximo por opción: {maxBallot} {/**TRADUCCION */}
                    </div>
                    <div>
                        * Máximos totales: {`${totalWeight} / ${maxTotal}`} {/**TRADUCCION */}
                    </div>
                </div>
                <div>
                    <div style={{
                        padding: isMobile ? '0.3em 0.3em' : '0.3em 0.5em',
                    }}
                    >
                        <Table style={{ width: "100%", maxWidth: "100%" }}>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        {translate.new_options}
                                </TableCell>
                                    <TableCell>
                                        {translate.votes}
                                </TableCell>
                                </TableRow>
                                {agenda.items.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell style={{padding: '5px 10px'}}>
                                            <div
                                                style={{
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    maxWidth: isMobile ? "50px" : "150px"
                                                }}
                                            >
                                                {item.value}
                                            </div>
                                        </TableCell>
                                        <TableCell style={{padding: '5px 10px'}}>
                                            <TextInput
                                                styles={{ width: isMobile ? "50px" : "100px" }}
                                                // styleInInput={{ textAlign: 'center' }}
                                                value={ballots.get(item.id) ? ballots.get(item.id).weight : 0}
                                                onChange={event => updateBallotValue(item.id, +event.target.value)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div style={{
                        width: "100%",
                        display: "flex",
                        padding: '0.6em 1em',
                    }}
                    >
                        <BasicButton
                            loading={state.loading}
                            success={state.success}
                            reset={resetButtonStates}
                            text={translate.save}
                            textStyle={{ color: 'white', fontWeight: '700' }}
                            color={getSecondary()}
                            onClick={sendBallots}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default graphql(createManualBallotsMutation, {
    name: 'createManualBallots'
})(CustomAgendaManualVotings)