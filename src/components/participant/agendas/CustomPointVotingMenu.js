import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { LoadingSection } from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';
import { AGENDA_TYPES } from '../../../constants';
import { VotingButton } from './VotingMenu';

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

    const addSelection = item => {
        const newSelections = [...selections, cleanObject(item)];
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
        return 'Tu voto ha sido registrado en la apertura de votos anterior, para preservar el anonimato de los votos, los registrados antes del cierre no pueden ser cambiados';
    }

    const renderCommonButtons = () => {
        return (
            <div style={{ paddingTop: "20px" }}>
                <div style={{ display: "flex", width: "52.5%" }}>
                    <VotingButton
                        text={translate.abstention_btn}
                        styleButton={{ width: "90%" }}
                        //selectCheckBox={getSelectedRadio(item.id)}
                    />
                    <VotingButton
                        text={"No votar"} //TRADUCCION
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
                    <div style={{fontSize: '0.85em', textAlign: 'left'}}>
                        {loading?
                            <div style={{width: '3em'}}>
                                <LoadingSection size={10} />
                            </div>
                        :
                            selections.length > 0?
                                'Voto guardado'
                            :
                                ''

                        }
                    </div>
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
                    <div style={{fontSize: '0.85em', textAlign: 'left'}}>
                        {loading?
                            <div style={{width: '3em'}}>
                                <LoadingSection size={10} />
                            </div>
                        :
                            (selections.length < agenda.options.minSelections && agenda.options.minSelections > 1) ?
                                `Tiene que marcar ${agenda.options.minSelections - selections.length} opciones más`
                            :
                                selections.length > 0?
                                    'Voto guardado'
                                :
                                    ''

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
