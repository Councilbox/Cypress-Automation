import React from 'react';
import { AlertConfirm } from "../../../../../displayComponents";
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import CustomPointForm from './CustomPointForm';
import { checkRepeatedItemValue } from '../../../../../utils/CBX';


const defaultPollOptions = {
    writeIn: false,
    maxSelections: 1,
    multiselect: false
}

const defaultValues = {
    agendaSubject: "",
    subjectType: 6,
    description: "",
}

const NewCustomPointModal = ({ translate, addCustomAgenda, ...props }) => {
    const [agenda, setAgenda] = React.useState({
        ...defaultValues,
        councilId: props.council.id,
        orderIndex: props.agendas.length + 1
    });
    const [errors, setErrors] = React.useState({});
    const [items, setItems] = React.useState([{
        value: ''
    }]);
    const [options, setOptions] = React.useState(defaultPollOptions);

    const addCustomPoint = async () => {
        if(!validateCustomAgenda()){
            const response = await addCustomAgenda({
                variables: {
                    agenda,
                    items,
                    options
                }
            });

            await props.refetch();
            props.requestClose();
        }
    }

    const addOption = () => {
        setItems([
            ...items,
            {
                value: ''
            }
        ]);
        setErrors({
            ...errors,
            itemsLength: null
        });
    }

    const updateItem = (index, value) => {
        let newItems = [...items];
        newItems[index].value = value;
        setItems(newItems);
    }

    const removeItem = (index) => {
        let newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    }

    const updateOptions = object => {
        setOptions({
            ...options,
            ...object
        });
    }


    const validateCustomAgenda = () => {
        let hasError = false;
        let newErrors = {
            items: items.map(item => ({error: ''}))
        }

        if(items.length === 0){
            newErrors.itemsLength = 'Es necesario añadir al menos una opción';//TRADUCCION
            hasError = true;
        }

        if(!agenda.agendaSubject){
            newErrors.agendaSubject = translate.required_field;
            hasError = true;
        }

        if(options.multiselect && options.maxSelections > items.length){
            newErrors.maxSelections = 'Ha indicando un número máximo mayor que las opciones disponibles';//TRADUCCION
            hasError = true;
        }

        items.forEach((item, index) => {
            if(!item.value){
                newErrors.items[index].error = 'No ha indicado valor a esta opción';//TRADUCCION
                hasError = true;
            }
        });

        const repeatedItems = checkRepeatedItemValue(items);
        if(repeatedItems.length > 0){
            hasError = true;
            repeatedItems.forEach(repeated => {
                newErrors.items[repeated].error = 'Valor repetido en otra opción';
            });
        }


        setErrors(newErrors);
        return hasError;
    }

    const updateAgenda = object => {
        setAgenda({
            ...agenda,
            ...object
        });
    }

    //console.log(errors);

    const renderBody = () => {
        return (
            <div style={{marginTop: '1em', marginBottom: '2em', width: window.innerWidth > 720? '720px' : '100%'}}>
                <CustomPointForm
                    {...{
                        agenda,
                        options,
                        items,
                        errors,
                        translate,
                        council: props.council,
                        company: props.company,
                        statute: props.statute,
                        companyStatutes: props.companyStatutes,
                        updateAgenda,
                        updateItem,
                        updateOptions,
                        removeItem,
                        addOption
                    }}
                />
            </div>
        )
    }

    return (
        <AlertConfirm
            requestClose={props.requestClose}
            open={props.open}
            acceptAction={addCustomPoint}
            buttonAccept={translate.accept}
            buttonCancel={translate.cancel}
            bodyText={renderBody()}
            title={translate.new_point}
        />
    )
}

const addCustomAgenda = gql`
    mutation AddCustomAgenda($agenda: AgendaInput!, $options: PollOptionsInput!, $items: [PollItemInput]!){
        addCustomAgenda(agenda: $agenda, options: $options, items: $items){
            id
            items {
                value
            }
            options {
                maxSelections
            }
        }
    }
`;

export default graphql(addCustomAgenda, {
    name: 'addCustomAgenda'
})(NewCustomPointModal);