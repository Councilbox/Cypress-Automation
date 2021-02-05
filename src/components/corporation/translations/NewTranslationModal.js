import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { AlertConfirm } from '../../../displayComponents';
import TranslationForm from './TranslationForm';
import { useOldState } from '../../../hooks';

const NewTranslationModal = ({ translate, ...props }) => {
    const [state, setState] = useOldState({
        data: props.values ? props.values : {
            label: '',
            es: '',
            cat: '',
            en: '',
            gal: '',
            pt: '',
        },
        errors: {},
        success: false
    });

    const initialState = React.useRef(state);

    const updateState = object => {
        setState({
            data: {
                ...state.data,
                ...object
            }
        });
    }

    const checkRequiredFields = () => {
        const errors = {
            label: '',
            es: '',
            cat: '',
            en: '',
            gal: '',
            pt: '',
        }
        let hasError = false;

        const { data } = state;

        if (!data.label) {
            hasError = true;
            errors.label = 'Campo requerido';
        }

        if (!data.es) {
            hasError = true;
            errors.es = 'Campo requerido';
        }

        if (!data.gal) {
            hasError = true;
            errors.gal = 'Campo requerido';
        }

        if (!data.cat) {
            hasError = true;
            errors.cat = 'Campo requerido';
        }

        if (!data.en) {
            hasError = true;
            errors.en = 'Campo requerido';
        }

        if (!data.pt) {
            hasError = true;
            errors.pt = 'Campo requerido';
        }

        setState({
            errors
        });

        return hasError;
    }

    const saveNewTranslation = async () => {
        if (!checkRequiredFields()) {
            const response = await props.createTranslation({
                variables: {
                    translation: state.data
                }
            });

            if (!response.errors) {
                setState({
                    ...initialState.current,
                    success: true,
                });
            }
        }
    }


    const updateTranslationAction = async () => {
        if (!checkRequiredFields()) {
            const { __typename, ...translation } = state.data;
            const response = await props.updateTranslation({
                variables: {
                    translation
                }
            });

            if (!response.errors) {
                await props.refresh();
                props.requestClose();
            }
        }
    }

    const _renderModalBody = () => (
        <TranslationForm
            errors={state.errors}
            updateState={updateState}
            data={state.data}
            flagEdit={!!props.values}
        />
    )

    return (
        <AlertConfirm
            requestClose={props.requestClose}
            open={props.open}
            acceptAction={props.values ? updateTranslationAction : saveNewTranslation}
            buttonAccept={translate.accept}
            buttonCancel={translate.cancel}
            bodyText={_renderModalBody()}
            title={props.values ? translate.edit : "Nueva traducción"}
        />
    )
}

const saveTranslation = gql`
    mutation SaveTranslation($translation: TranslationInput){
        createTranslation(translation: $translation){
            label
            es
        }
    }
`;

const updateTranslation = gql`
    mutation UpdateTranslation($translation: TranslationInput){
        updateTranslation(translation: $translation){
            id
        }
    }
`;


export default compose(
    graphql(updateTranslation, {
        name: "updateTranslation"
    }),
    graphql(saveTranslation, {
        name: 'createTranslation'
    })
)(NewTranslationModal);
