import React, { Component, Fragment } from 'react';
import { graphql } from 'react-apollo';
import { BasicButton, ButtonIcon, Grid, GridItem, Checkbox, Radio } from '../displayComponents';
import { getPrimary } from '../../styles/colors';
import { Typography, Paper } from 'material-ui';
import RepresentativeForm from './RepresentativeForm';
import ParticipantForm from './ParticipantForm';
import CouncilBoxApi from '../../api/CouncilboxApi';
import { checkValidEmail, errorHandler } from '../../utils';



class ParticipantEditor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            languages: [],
            addRepresentative: false,
            participantType: 0,
            data:  {               
                participant: {
                    ...newParticipantInitialValues
                },
                representative: {
                    ...newRepresentativeInitialValues
                }
            },

            errors: {
                language: '',
                councilId: '',
                numParticipations: '',
                personOrEntity: '',
                name: '',
                dni: '',
                position: '',
                email: '',
                phone: '',
            }
        }
    }

    async componentDidMount() {
        const languages = await CouncilBoxApi.getLanguageList();
        this.setState({
            languages: languages
        });
    }


    updateParticipant = (object) => {
        this.setState({
            data: {
                ...this.state.data,
                participant: {
                    ...this.state.data.participant, ...object
                }
            }
        });
    };

    updateRepresentative = (object) => {
        this.setState({
            data: {
                ...this.state.data,
                representative: {
                    ...this.state.data.representative, ...object
                }
            }
        });
    };

    _renderAddParticipantTypeSelector() {
        const { translate } = this.props;

        return (<Fragment>
                <Radio
                    checked={this.state.participantType === 0}
                    label={translate.person}
                    onChange={(event) => {
                        console.log(event);
                        this.setState({
                            participantType: parseInt(event.target.value, 10),
                            data: {
                                ...this.state.data,
                                participant: {
                                    ...newParticipantInitialValues
                                }
                            }
                        })
                    }}
                    value='0'
                    name={'person_or_entity'}
                    aria-label="A"
                />
                <Radio
                    checked={this.state.participantType === 1}
                    onChange={(event) => {
                        console.log(event);
                        this.setState({
                            participantType: parseInt(event.target.value, 10),
                            data: {
                                ...this.state.data,
                                participant: {
                                    ...newParticipantInitialValues
                                }
                            }
                        })
                    }}
                    value="1"
                    name="person_or_entity"
                    aria-label="B"
                    label={translate.entity_name}
                />

            </Fragment>);
    }

    checkRequiredFields() {
        const { participant } = this.state.data;
        const { translate } = this.props;

        let errors = {
            name: '',
            surname: '',
            dni: '',
            position: '',
            email: '',
            phone: '',
            language: '',
            numParticipations: ''
        };

        let hasError = false;

        if (!participant.name) {
            hasError = true;
            errors.name = translate.field_required;
        }

        if (!participant.surname && this.state.participantType === 0) {
            hasError = true;
            errors.surname = translate.field_required;
        }

        if (!participant.dni) {
            hasError = true;
            errors.dni = translate.field_required;
        }

        if (!participant.position) {
            hasError = true;
            errors.position = translate.field_required;
        }

        if (!checkValidEmail(participant.email.toLocaleLowerCase())) {
            hasError = true;
            errors.email = 'Se requiere un email válido';
        }

        if (!participant.phone) {
            hasError = true;
            errors.phone = translate.field_required;
        }

        if (!participant.language) {
            hasError = true;
            errors.language = translate.field_required;
        }

        if (!participant.numParticipations) {
            hasError = true;
            errors.numParticipations = translate.field_required;
        }

        this.setState({
            ...this.state,
            errors: errors
        });

        return hasError;
    }

    _renderRepresentativeCheckbox() {
        return (<Grid>
                <GridItem xs={12} lg={12} md={12}>
                    <Checkbox
                        label={this.props.translate.add_representative}
                        value={this.state.addRepresentative}
                        onChange={(event, isInputChecked) => this.setState({
                            addRepresentative: isInputChecked
                        })}
                    />
                </GridItem>
            </Grid>);
    }

    _renderAddParticipantButtons() {
        const { translate } = this.props;
        const primary = getPrimary();

        return (<Fragment>
                <BasicButton
                    text={translate.cancel}
                    color={'white'}
                    textStyle={{
                        color: primary,
                        fontWeight: '700',
                        fontSize: '0.9em',
                        textTransform: 'none'
                    }}
                    textPosition="after"
                    onClick={this.close}
                    buttonStyle={{
                        marginRight: '1em',
                        border: `2px solid ${primary}`
                    }}
                />
                <BasicButton
                    text={translate.save}
                    color={primary}
                    textStyle={{
                        color: 'white',
                        fontWeight: '700',
                        fontSize: '0.9em',
                        textTransform: 'none'
                    }}
                    icon={<ButtonIcon color='white' type="save"/>}
                    textPosition="after"
                    onClick={this.sendNewParticipant}
                />
            </Fragment>);
    }

    render(){
        const participant = this.state.data.participant;
        const { translate, participations } = this.props;
        const { representative } = this.state.data;
        const { errors } = this.state;

        return(
            <Fragment>
                <Grid>
                    <GridItem xs={12} lg={12} md={12}>
                        <Typography variant="title">
                            {translate.add_participant}
                        </Typography>
                    </GridItem>
                    <Paper style={{padding: '2em', paddingTop: '1em', marginTop: '1em', marginBottom: '1em'}}>
                        {this._renderAddParticipantTypeSelector()}
                        {<ParticipantForm
                            type={this.state.participantType}
                            participant={participant}
                            participations={participations}
                            translate={translate}
                            languages={this.state.languages}
                            errors={errors}
                            updateState={this.updateParticipant}
                        />}
                    </Paper>
                    {this._renderRepresentativeCheckbox()}
                    {this.state.addRepresentative && 
                        <Paper style={{marginBottom: '1.3em', padding: '2em'}}>
                            {<RepresentativeForm 
                                representative={representative}
                                translate={translate}
                                languages={this.state.languages}
                                errors={errors}
                                updateState={this.updateRepresentative}
                            />}
                        </Paper>
                    }                    
                    {this._renderAddParticipantButtons()}
                </Grid>
            </Fragment>
        )
    }
}

export default ParticipantEditor;

const newParticipantInitialValues = {
    language: 'es',
    councilId: '',
    numParticipations: 1,
    personOrEntity: 0,
    name: '',
    surname: '',
    dni: '',
    position: '',
    email: '',
    phone: '',
};

const newRepresentativeInitialValues = {
    language: 'es',
    personOrEntity: 0,
    name: '',
    surname: '',
    position: '',
    dni: '',
    email: '',
    phone: ''
};