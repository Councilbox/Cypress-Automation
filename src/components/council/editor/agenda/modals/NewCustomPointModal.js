import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { AlertConfirm } from '../../../../../displayComponents';
import CustomPointForm from './CustomPointForm';
import { checkRepeatedItemValue } from '../../../../../utils/CBX';
import { INPUT_REGEX } from '../../../../../constants';


const defaultPollOptions = {
    writeIn: false,
    maxSelections: 1,
    minSelections: 1,
    multiselect: false
};

const defaultValues = {
    agendaSubject: '',
    subjectType: 6,
    description: '',
};

export const useValidateAgenda = (translate, setErrors) => (items, options, agenda) => {
    let hasError = false;
    const regex = new RegExp('^[a-zA-Z0-9-äÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙ ]{0}\.+$');

    const newErrors = {
        items: items.map(item => ({ error: '' }))
    };

    if (items.length === 0) {
        newErrors.itemsLength = translate.necessary_add_least_one_option;
        hasError = true;
    }

	if (agenda.agendaSubject) {
		if (!(regex.test(agenda.agendaSubject)) || !agenda.agendaSubject.trim()) {
			hasError = true;
			newErrors.agendaSubject = translate.invalid_field;
		}
    }

    if (!agenda.agendaSubject) {
        newErrors.agendaSubject = translate.required_field;
        hasError = true;
    }

    if (options.multiselect && options.maxSelections > items.length) {
        newErrors.maxSelections = translate.maximum_number_available_options;
        hasError = true;
    }

    if (options.multiselect && options.minSelections > items.length) {
        newErrors.minSelections = translate.minimum_number_available_options;
        hasError = true;
    }

    if (options.multiselect && options.minSelections > options.maxSelections) {
        newErrors.minSelections = translate.minimum_number_maximum_number;
        hasError = true;
    }

    if (options.maxSelections == '') {
        newErrors.maxSelections = translate.not_indicated_value_option;
        hasError = true;
    }
    if (options.minSelections == '') {
        newErrors.minSelections = translate.not_indicated_value_option;
        hasError = true;
    }

    items.forEach((item, index) => {
        if (!item.value) {
            newErrors.items[index].error = translate.not_indicated_value_option;
            hasError = true;
        }
        if (item.value) {
            if (!(regex.test(item.value)) || !item.value.trim()) {
                hasError = true;
                newErrors.items[index].error = translate.invalid_field;
            }
        }
    });

    const repeatedItems = checkRepeatedItemValue(items);
    if (repeatedItems.length > 0) {
        hasError = true;
        repeatedItems.forEach(repeated => {
            newErrors.items[repeated].error = translate.value_repeated_another_option;
        });
    }

    setErrors(newErrors);
    return hasError;
};

const NewCustomPointModal = ({ translate, addCustomAgenda, ...props }) => {
    const [agenda, setAgenda] = React.useState({
        ...defaultValues,
        subjectType: props.council.councilType === 3 ? 7 : 6,
        councilId: props.council.id,
        orderIndex: props.agendas.length + 1
    });
    const [loading, setLoading] = React.useState(false);
    const [errors, setErrors] = React.useState({});
    const [items, setItems] = React.useState([{
        value: ''
    }]);
    const [options, setOptions] = React.useState(defaultPollOptions);
    const validateCustomAgenda = useValidateAgenda(translate, setErrors);

    const addCustomPoint = async () => {
        if (!validateCustomAgenda(items, options, agenda)) {
            setLoading(true);
            await addCustomAgenda({
                variables: {
                    agenda,
                    items,
                    options
                }
            });

            await props.refetch();
            setLoading(false);
            props.requestClose();
        }
    };

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
    };

    const updateItem = (index, value) => {
        const newItems = [...items];
        newItems[index].value = value;
        setItems(newItems);
    };

    const removeItem = (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const updateOptions = object => {
        setOptions({
            ...options,
            ...object
        });
    };

    const updateAgenda = object => {
        setAgenda({
            ...agenda,
            ...object
        });
    };

    const renderBody = () => (
            <div style={{ marginTop: '1em', marginBottom: '2em', width: window.innerWidth > 720 ? '720px' : '100%' }}>
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
        );

    return (
        <AlertConfirm
            requestClose={props.requestClose}
            open={props.open}
            acceptAction={addCustomPoint}
            loadingAction={loading}
            buttonAccept={translate.accept}
            buttonCancel={translate.cancel}
            bodyText={renderBody()}
            title={translate.new_custom_point}
        />
    );
};

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
