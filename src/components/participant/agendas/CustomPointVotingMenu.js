import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { BasicButton, Radio, ButtonIcon, Checkbox } from '../../../displayComponents';
import { getPrimary, secondary } from '../../../styles/colors';
import { AGENDA_TYPES } from '../../../constants';
import { VotingButton } from './VotingMenu';
import { createMuiTheme, FormControl } from 'material-ui';

const createSelectionsFromBallots = (ballots = [], participantId) => {
    return ballots
        .filter(ballot => ballot.participantId === participantId)
        .map(ballot => {
            return {
                id: ballot.itemId,
                value: ballot.value
            }
        });
}

const CustomPointVotingMenu = ({ agenda, translate, ownVote, updateCustomPointVoting, ...props }) => {
    const [selections, setSelections] = React.useState(createSelectionsFromBallots(ownVote.ballots, ownVote.participantId)); //(props.ownVote.ballots, props.ownVote.participantId));
    const [loading, setLoading] = React.useState(false);
    const primary = getPrimary();

    const addSelection = item => {
        const newSelections = [...selections, cleanObject(item)];
        setSelections(newSelections);
        sendCustomAgendaVote(newSelections);
    }

    const getSelectedRadio = id => {
        return !!selections.find(selection => selection.id === id)
    }

    const removeSelection = item => {
        const newSelections = selections.filter(selection => selection.id !== item.id);
        setSelections(newSelections);
        sendCustomAgendaVote(newSelections);

    }

    const setSelection = item => {
        setSelections([cleanObject(item)]);
        sendCustomAgendaVote([cleanObject(item)]);
    }

    const resetSelections = () => {
        setSelections([]);
        sendCustomAgendaVote([]);
    }

    const sendCustomAgendaVote = async selected => {
        setLoading(true);
        const response = await updateCustomPointVoting({
            variables: {
                selections: selected,
                votingId: ownVote.id
            }
        });
        await props.refetch();
        setLoading(false);
    }


    if (ownVote.vote !== -1 && ownVote.ballots.length === 0 && agenda.subjectType === AGENDA_TYPES.CUSTOM_PRIVATE) {
        //TRADUCCION
        console.log(agenda, ownVote);

        return 'Tu voto ha sido registrado en la apertura de votos anterior, para preservar el anonimato de los votos, los registrados antes del cierre no pueden ser cambiados';
    }

    // console.log(agenda.options.maxSelections )
    // console.log(selections.length )

    return (
        <div>
            {agenda.options.maxSelections === 1 ?
                <React.Fragment>
                    <FormControl>
                        {agenda.items.map((item, index) => (
                            <React.Fragment>
                                <div key={`item_${item.id}`}>
                                    <VotingButton
                                        styleButton={{ padding: '0' }}
                                        selectCheckBox={getSelectedRadio(item.id)}
                                        onClick={() => setSelection(item)}
                                        text={item.value}
                                    />
                                </div>
                                {agenda.items.length - 1 === index &&
                                    <React.Fragment>
                                        <div>
                                            <VotingButton
                                                text={"Abstencion"} //TRADUCCION
                                                selectCheckBox={getSelectedRadio(item.id)}
                                            />
                                            <VotingButton
                                                text={"No votar"} //TRADUCCION
                                                selectCheckBox={ownVote.ballots.length === 0}
                                                onClick={resetSelections}
                                            />
                                        </div>
                                    </React.Fragment>
                                }
                            </React.Fragment>
                        ))
                        }
                    </FormControl>
                </React.Fragment>
                :
                <React.Fragment>
                    {agenda.items.map((item, index) => (
                        <React.Fragment key={`item_${item.id}`}>
                            <div >
                                <VotingButton //TODO hacer que se desmarque bien
                                    styleButton={{ padding: '0' }}
                                    selectCheckBox={getSelectedRadio(item.id)}
                                    disabled={agenda.options.maxSelections === selections.length && !getSelectedRadio(item.id)}
                                    styleButton={{ width: "100%" }}
                                    onClick={() => {
                                        if (!getSelectedRadio(item.id)) {
                                            addSelection(item)
                                        } else {
                                            removeSelection(item)
                                        }
                                    }}
                                    text={item.value}
                                />
                            </div>
                            {agenda.items.length - 1 === index &&
                                <div style={{ paddingTop: "20px" }}>
                                    <div style={{ display: "flex", width: "52.5%" }}>
                                        <VotingButton
                                            styleButton={{ width: "90%" }}
                                            text={"Abstencion"} //TRADUCCION
                                        />
                                        <VotingButton
                                            styleButton={{ width: "90%" }}
                                            text={"No votar"} //TRADUCCION
                                            onClick={resetSelections}
                                            selectCheckBox={selections.length === 0}
                                        />
                                    </div>
                                </div>
                            }
                        </React.Fragment>
                    ))}

                </React.Fragment>
            }
        </div>
    )
}


const updateCustomPointVoting = gql`
    mutation updateCustomPointVoting($selections: [PollItemInput]!, $votingId: Int!){
        updateCustomPointVoting(selections: $selections, votingId: $votingId){
            success
        }
    }
`;

const cleanObject = object => {
    const { __typename, ...rest } = object;
    return rest;
}

export default graphql(updateCustomPointVoting, {
    name: 'updateCustomPointVoting'
})(CustomPointVotingMenu);
