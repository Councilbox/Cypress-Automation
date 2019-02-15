import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { BasicButton, Radio, Checkbox } from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';

const CustomPointVotingMenu = ({ agenda, translate, updateCustomPointVoting, ...props }) => {
    const [selections, setSelections] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const primary = getPrimary();

    console.log(agenda);

    const addSelection = item => {
        const newSelections = [...selections, cleanObject(item)];
        setSelections(newSelections);
    }

    const getSelectedRadio = value => {
        return !!selections.find(selection => selection.value === value)
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
        console.log(response);
        setLoading(false);
        //console.log(selections)

    }

    return (
        <div>
            {agenda.options.maxSelections === 1?
                agenda.items.map(item => (
                    <div key={`item_${item.id}`}>
                        <Radio
                            checked={getSelectedRadio(item.value)}
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
                            checked={getSelectedRadio(item.value)}
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
                loading={loading}
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