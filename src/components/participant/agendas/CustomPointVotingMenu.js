import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { LoadingSection } from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';
import { AGENDA_TYPES } from '../../../constants';
import { VotingButton } from './VotingMenu';
import { moment } from "../../../containers/App";

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

const asbtentionOption = {
    id: -1,
    value: 'Abstention'
}

const CustomPointVotingMenu = ({ agenda, translate, ownVote, updateCustomPointVoting, ...props }) => {
    const [selections, setSelections] = React.useState(createSelectionsFromBallots(ownVote.ballots, ownVote.participantId)); //(props.ownVote.ballots, props.ownVote.participantId));
    const [loading, setLoading] = React.useState(false);

    const addSelection = item => {
        let newSelections = [...selections, cleanObject(item)]; ;
        if(selections.length === 1){
            if(selections[0].id === -1){
                newSelections = [cleanObject(item)];
            }
        }
        setSelections(newSelections);
        if(newSelections.length >= agenda.options.minSelections){
            sendCustomAgendaVote(newSelections);
        }
    }

    const getSelectedRadio = id => {
        return !!selections.find(selection => selection.id === id)
    }

    const removeSelection = item => {
        const newSelections = selections.filter(selection => selection.id !== item.id);
        setSelections(newSelections);
        if(newSelections.length < agenda.options.minSelections){
            return sendCustomAgendaVote([]);
        }
        return sendCustomAgendaVote(newSelections);
    }

    const setSelection = item => {
        setSelections([cleanObject(item)]);
        sendCustomAgendaVote([cleanObject(item)]);
    }

    const setAbstentionOption = () => {
        setSelections([asbtentionOption]);
        sendCustomAgendaVote([asbtentionOption]);
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

    const getRemainingOptions = () => {
        if(selections.length === 1){
            if(selections[0].id === -1){
                return agenda.options.minSelections;
            }
        }
        return agenda.options.minSelections - selections.length
    }

    if (ownVote.vote !== -1 && ownVote.ballots.length === 0 && agenda.subjectType === AGENDA_TYPES.CUSTOM_PRIVATE) {
        //return 'Tu voto ha sido registrado en la apertura de votos anterior, para preservar el anonimato de los votos, los registrados antes del cierre no pueden ser cambiados';
    }

    const renderCommonButtons = () => {
        return (
            <div style={{ paddingTop: "20px" }}>
                <div style={{ display: "flex", width: "52.5%", height: '2.5em' }}>
                    <VotingButton
                        text={translate.abstention_btn}
                        styleButton={{ width: "90%" }}
                        onClick={setAbstentionOption}
                        selectCheckBox={getSelectedRadio(-1)}
                    />
                    <VotingButton
                        text={translate.dont_vote}
                        styleButton={{ width: "90%" }}
                        selectCheckBox={selections.length === 0}
                        onClick={resetSelections}
                    />
                </div>
            </div>
        )
    }

    return (
        <div>
            {agenda.options.maxSelections === 1 ?
                <React.Fragment>
                    {agenda.items.map((item, index) => (
                        <React.Fragment key={`item_${item.id}`}>
                            <div>
                                <VotingButton
                                    styleButton={{ padding: '0', width: '100%' }}
                                    selectCheckBox={getSelectedRadio(item.id)}
                                    onClick={() => setSelection(item)}
                                    text={item.value}
                                />
                            </div>
                            {agenda.items.length - 1 === index && renderCommonButtons()}
                        </React.Fragment>
                    ))}
                </React.Fragment>
                :
                <React.Fragment>
                    <div style={{fontSize: '0.85em', height: '1.2em', textAlign: 'left'}}>
                        {(selections.length < agenda.options.minSelections && agenda.options.minSelections > 1) &&
                            `Tiene que marcar ${getRemainingOptions()} opciones más`
                        }
                    </div>
                    {agenda.items.map((item, index) => (
                        <React.Fragment key={`item_${item.id}`}>
                            <div >
                                <VotingButton
                                    styleButton={{ padding: '0', width: '100%' }}
                                    selectCheckBox={getSelectedRadio(item.id)}
                                    disabled={agenda.options.maxSelections === selections.length && !getSelectedRadio(item.id)}
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
                            {agenda.items.length - 1 === index && renderCommonButtons()}
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
