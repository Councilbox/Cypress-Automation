import React, { Component, Fragment } from 'react';
import { BasicButton, ButtonIcon, CustomDialog } from '../../../../displayComponents/index';
import { graphql, compose } from 'react-apollo';
import { getPrimary, secondary } from '../../../../styles/colors';
import { languages } from '../../../../queries/masters';
import ParticipantForm from "../../participants/ParticipantForm";
import { checkRequiredFieldsParticipant, checkRequiredFieldsRepresentative } from "../../../../utils/validation";
import RepresentativeForm from "../../../company/census/censusEditor/RepresentativeForm";
import { upsertConvenedParticipant } from "../../../../queries/councilParticipant";


class ConvenedParticipantEditor extends Component {

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

        delete representative.live;
        delete representative.notifications;
        delete participant.live;
        delete participant.notifications;

        return {
            data: participant,
            representative: representative
        }
    }

    updateConvenedParticipant = async (sendConvene) => {
        const { hasRepresentative, ...data } = this.state.representative;
        const representative = this.state.representative.hasRepresentative ? {
            ...data,
            councilId: this.props.councilId
        } : null;

        if (!this.checkRequiredFields()) {
            const response = await this.props.updateConvenedParticipant({
                variables: {
                    participant: {
                        ...this.state.data,
                        councilId: this.props.councilId
                    },
                    representative: representative,
                    sendConvene: sendConvene
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
        const { translate, participations } = this.props;
        let hasSocialCapital = participations;
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

    render() {
        const primary = getPrimary();
        const participant = this.state.data;
        const { representative, errors, representativeErrors } = this.state;
        const { translate, participations } = this.props;
        const { languages } = this.props.data;

        return (<CustomDialog
                title={translate.edit_participant}
                requestClose={() => this.props.close()}
                open={this.props.opened}
                actions = {<Fragment>
                    <BasicButton
                        text={translate.cancel}
                        textStyle={{
                            textTransform: 'none',
                            fontWeight: '700'
                        }}
                        onClick={this.props.close}
                    />
                    <BasicButton
                        text={translate.save_changes_and_send}
                        textStyle={{
                            color: 'white',
                            textTransform: 'none',
                            fontWeight: '700'
                        }}
                        buttonStyle={{ marginLeft: '1em' }}
                        color={secondary}
                        onClick={()=>{this.updateConvenedParticipant(true)}}
                    />
                    <BasicButton
                        text={translate.save_changes}
                        textStyle={{
                            color: 'white',
                            textTransform: 'none',
                            fontWeight: '700'
                        }}
                        buttonStyle={{ marginLeft: '1em' }}
                        color={primary}
                        onClick={()=>{this.updateConvenedParticipant(false)}}
                    />
                </Fragment>}>
                <ParticipantForm
                    type={participant.personOrEntity}
                    participant={participant}
                    participations={participations}
                    translate={translate}
                    languages={languages}
                    errors={errors}
                    updateState={this.updateState}
                />
                <RepresentativeForm
                    translate={translate}
                    state={representative}
                    updateState={this.updateRepresentative}
                    errors={representativeErrors}
                    languages={languages}
                />
            </CustomDialog>)
    }
}

export default compose(graphql(upsertConvenedParticipant, {
    name: 'updateConvenedParticipant',
    options: {
        errorPolicy: 'all'
    }
}), graphql(languages))(ConvenedParticipantEditor);

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