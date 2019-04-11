import React from 'react';
import { AlertConfirm } from '../../../displayComponents';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import TranslationForm from './TranslationForm';


class NewTranslationModal extends React.Component {

    state = {
        data: this.props.values ? this.props.values : {
            label: '',
            es: '',
            cat: '',
            en: '',
            gal: '',
            pt: '',
        },
        errors: {},
        success: false
    }

    initialState = this.state;

    updateState = object => {
        this.setState({
            data: {
                ...this.state.data,
                ...object
            }
        });
    }

    saveNewTranslation = async () => {
        if (!this.checkRequiredFields()) {
            const response = await this.props.createTranslation({
                variables: {
                    translation: this.state.data
                }
            });

            if (!response.errors) {
                this.setState({
                    ...this.initialState,
                    success: true,
                })
            }
        }
    }

    updateTranslationAction = async () => {
        if (!this.checkRequiredFields()) {
            const { __typename, ...translation } = this.state.data;
            const response = await this.props.updateTranslation({
                variables: {
                    translation
                }
            });
            
            if(!response.errors){
                const response = await this.props.refresh();
            }
        }
    }

    checkRequiredFields = () => {
        let errors = {
            label: '',
            es: '',
            cat: '',
            en: '',
            gal: '',
            pt: '',
        }
        let hasError = false;

        const { data } = this.state;

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

        this.setState({
            errors
        });

        return hasError;
    }

    _renderModalBody = () => {
        return (
            <TranslationForm
                errors={this.state.errors}
                updateState={this.updateState}
                data={this.state.data}
            />
        )
    }


    render() {
        const { translate } = this.props;

        return (
            <AlertConfirm
                requestClose={this.props.requestClose}
                open={this.props.open}
                acceptAction={this.updateTranslationAction}
                // acceptAction={this.saveNewTranslation}
                buttonAccept={translate.accept}
                buttonCancel={translate.cancel}
                bodyText={this._renderModalBody()}
                title={translate.edit}
            />
        )
    }
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
    }))(NewTranslationModal);