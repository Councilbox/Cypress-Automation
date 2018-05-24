import React, { Component, Fragment } from 'react';
import { BasicButton, ButtonIcon, CustomDialog } from '../../../../displayComponents';
import { graphql, compose } from 'react-apollo';
import { getPrimary, secondary } from '../../../../styles/colors';
import { upsertConvenedParticipant } from '../../../../queries/councilParticipant';
import { languages } from '../../../../queries/masters';
import ParticipantForm from '../../participants/ParticipantForm';
import { checkRequiredFieldsParticipant, checkRequiredFieldsRepresentative } from '../../../../utils/validation';
import RepresentativeForm from '../../../company/census/censusEditor/RepresentativeForm';

class AddConvenedParticipantButton extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            data: { ...initialParticipant },
            representative: {...initialRepresentative},
            errors: {},
            representativeErrors: {}
        }
    }

    addParticipant = async (sendConvene) => {
        const { hasRepresentative, ...data } = this.state.representative;
        const representative = this.state.representative.hasRepresentative ? {
            ...data,
            councilId: this.props.councilId
        } : null;

        if (!this.checkRequiredFields()) {
            const response = await this.props.addParticipant({
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
                this.setState({
                    modal: false,
                    data: { ...initialParticipant },
                    representative: {...initialRepresentative},
                    errors: {},
                    representativeErrors: {}
                });
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
        const {data: participant, errors, representativeErrors, representative} = this.state;
        const { translate, participations } = this.props;
        const { languages } = this.props.data;

        return (<Fragment>
            <BasicButton
                text={translate.add_participant}
                color={'white'}
                textStyle={{
                    color: primary,
                    fontWeight: '700',
                    fontSize: '0.9em',
                    textTransform: 'none'
                }}
                textPosition="after"
                icon={<ButtonIcon type="add" color={primary}/>}
                onClick={() => this.setState({ modal: true })}
                buttonStyle={{
                    marginRight: '1em',
                    border: `2px solid ${primary}`
                }}
            />
            <CustomDialog
                title={translate.add_participant}
                requestClose={() => this.setState({ modal: false })}
                open={this.state.modal}
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
                        onClick={()=>{this.addParticipant(true)}}
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
                        onClick={()=>{this.addParticipant(false)}}
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
            </CustomDialog>
        </Fragment>)
    }

}

export default compose(graphql(upsertConvenedParticipant, {
    name: 'addParticipant',
    options: {
        errorPolicy: 'all'
    }
}), graphql(languages))(AddConvenedParticipantButton);

const initialParticipant = {
    name: '',
    surname: '',
    position: '',
    email: '',
    phone: '',
    dni: '',
    type: 0,
    delegateId: null,
    numParticipations: 1,
    socialCapital: 1,
    uuid: null,
    delegateUuid: null,
    language: 'es',
    city: '',
    personOrEntity: 0
};

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