import React, { Component, Fragment } from 'react';
import { BasicButton, ButtonIcon, AlertConfirm } from '../../../../../displayComponents/index';
import { graphql, compose } from 'react-apollo';
import { getPrimary } from '../../../../../styles/colors';
import { updateCensusParticipant } from '../../../../../queries/census';
import { languages } from '../../../../../queries/masters';
import { censusHasParticipations } from '../../../../../utils/CBX';
import RepresentativeForm from '../RepresentativeForm';
import ParticipantForm from "../../../../council/participants/ParticipantForm";
import { checkRequiredFieldsParticipant, checkRequiredFieldsRepresentative } from "../../../../../utils/validation";

class CensusParticipantEditor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            data: {},
            representative: {},
            errors: {},
            representativeErrors: {}
        }
    }

    static getDerivedStateFromProps(nextProps, prevState){
        let { representative, ...participant} = extractTypeName(nextProps.participant);
        representative = representative ? {
            hasRepresentative: true,
            ...extractTypeName(representative)
        } : initialRepresentative;
        return {
            data: participant,
            representative: representative
        }
    }
    
    

    updateCensusParticipant = async () => {
        const { hasRepresentative, ...data } = this.state.representative;
        const representative = this.state.representative.hasRepresentative ? {
            ...data,
            companyId: this.props.census.companyId,
            censusId: this.props.census.id
        } : null;

        if (!this.checkRequiredFields()) {
            const response = await this.props.updateCensusParticipant({
                variables: {
                    participant: {
                        ...this.state.data,
                        companyId: this.props.census.companyId,
                        censusId: this.props.census.id
                    },
                    representative: representative
                }
            });
            if (!response.errors) {
                this.props.refetch();
                this.props.close();
            }
        }
    };

    checkRequiredFields() {
        const participant = this.state.data;
        const representative = this.state.representative;
        const { translate } = this.props;
        let hasSocialCapital = censusHasParticipations(this.props.census);
        let errorsParticipant = checkRequiredFieldsParticipant(participant, translate, hasSocialCapital);

        let errorsRepresentative = {
            errors: {},
            hasError: false
        };
        if(representative.hasRepresentative){
            errorsRepresentative = checkRequiredFieldsRepresentative(representative, translate);
        }

        this.setState({
            ...this.state,
            errors: errorsParticipant.errors,
            representativeErrors: errorsRepresentative.errors
        });

        return (errorsParticipant.hasError || errorsRepresentative.hasError);
    }

    updateState = (object) => {
        this.setState({
            data: {
                ...this.state.data,
                ...object
            }
        });
    };

    updateRepresentative = (object) => {
        this.setState({
            representative: {
                ...this.state.representative,
                ...object
            }
        })
    };

    _renderBody() {
        const participant = this.state.data;
        const errors = this.state.errors;
        const { translate } = this.props;
        const { languages } = this.props.data;
        return (<Fragment>
            <ParticipantForm
                type={participant.personOrEntity}
                participant={participant}
                participations={censusHasParticipations(this.props.census)}
                translate={translate}
                languages={languages}
                errors={errors}
                updateState={this.updateState}
            />
            <RepresentativeForm
                translate={this.props.translate}
                state={this.state.representative}
                updateState={this.updateRepresentative}
                errors={this.state.representativeErrors}
                languages={this.props.data.languages}
            />
        </Fragment>)
    }

    render() {
        const { translate } = this.props;
        const primary = getPrimary();

        return (<Fragment>
            <AlertConfirm
                requestClose={() => this.props.close()}
                open={this.props.opened}
                fullWidth={false}
                acceptAction={this.updateCensusParticipant}
                buttonAccept={translate.accept}
                buttonCancel={translate.cancel}
                bodyText={this._renderBody()}
                title={translate.edit_participant}
            />
        </Fragment>)
    }
}

export default compose(graphql(updateCensusParticipant, {
    name: 'updateCensusParticipant',
    options: {
        errorPolicy: 'all'
    }
}), graphql(languages))(CensusParticipantEditor);

const initialRepresentative = {
    hasRepresentative: false,
    language: 'es',
    type: 2,
    name: '',
    surname: '',
    position: '',
    email: '',
    phone: '',
    dni: '',
};

function extractTypeName (object) {
    let {__typename, ...rest} = object;
    return rest;
}