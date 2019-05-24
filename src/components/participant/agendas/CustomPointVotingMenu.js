import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { BasicButton, Radio, Checkbox, ButtonIcon } from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';
import { AGENDA_TYPES } from '../../../constants';

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

const CustomPointVotingMenu = ({ agenda, translate, updateCustomPointVoting, ...props }) => {
    const [selections, setSelections] = React.useState(createSelectionsFromBallots(props.ownVote.ballots, props.ownVote.participantId));
    const [loading, setLoading] = React.useState(false);
    const primary = getPrimary();

    const addSelection = item => {
        const newSelections = [...selections, cleanObject(item)];
        setSelections(newSelections);
    }

    const getSelectedRadio = id => {
        return !!selections.find(selection => selection.id === id)
    }

    const removeSelection = item => {
        setSelections(selections.filter(selection => selection.id !== item.id));
    }

    const setSelection = item => {
        setSelections([cleanObject(item)]);
    }

    const sendCustomAgendaVote = async () => {
        setLoading(true);
        const response = await updateCustomPointVoting({
            variables: {
                selections,
                votingId: props.ownVote.id
            }
        });
        await props.refetch();
        setLoading(false);
        props.close();

    }


    if(props.ownVote.vote !== -1 && props.ownVote.ballots.length === 0 && agenda.subjectType === AGENDA_TYPES.CUSTOM_PRIVATE){
        //TRADUCCION
        return 'Tu voto ha sido registrado en la apertura de votos anterior, para preservar el anonimato de los votos, los registrados antes del cierre no pueden ser cambiados';
    }

    return (
        <div>
            {agenda.options.maxSelections === 1?
                agenda.items.map(item => (
                    <div key={`item_${item.id}`}>
                        <Radio
                            checked={getSelectedRadio(item.id)}
                            onChange={() => setSelection(item)}
                            name="security"
                            label={item.value}//TRADUCCION
                        />
                    </div>
                ))
            :
                agenda.items.map(item => (
                    <div key={`item_${item.id}`}>
                        <Checkbox
                            label={item.value}
                            value={getSelectedRadio(item.id)}
                            disabled={agenda.options.maxSelections === selections.length && !getSelectedRadio(item.id)}
                            onChange={(event, isInputChecked) => {
                                if(isInputChecked){
                                    addSelection(item)
                                } else {
                                    removeSelection(item)
                                }
                            }}
                        />
                    </div>
                ))
            }

            <BasicButton
                text="Enviar selección"
                textStyle={{fontWeight: '700', color: 'white'}}
                color={primary}
                icon={<ButtonIcon type="save" color={'white'} />}
                loading={loading}
                loadingColor={'white'}
                onClick={sendCustomAgendaVote}
            />
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