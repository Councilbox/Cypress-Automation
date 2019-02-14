import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { BasicButton, Radio, Checkbox } from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';

const CustomPointVotingMenu = ({ agenda, translate, ...props }) => {
    const [selections, setSelections] = React.useState([]);
    const primary = getPrimary();

    const addSelection = value => {
        const newSelections = [...selections, value];
        setSelections(newSelections);
    }

    const getSelectedRadio = value => {
        return !!selections.find(selection => selection.value === value)
    }

    const removeSelection = item => {
        setSelections(selections.filter(selection => selection.id !== item.id));
    }

    const setSelection = item => {
        setSelections([item]);
    }

    const sendCustomAgendaVote = async () => {
        console.log(selections)
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
                onClick={sendCustomAgendaVote}
            />
        </div>
    )
}

export default CustomPointVotingMenu;