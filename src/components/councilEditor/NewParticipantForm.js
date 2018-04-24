import React, { Component, Fragment } from "react";
import { MenuItem, Typography } from 'material-ui';
import { BasicButton, ButtonIcon, Checkbox, Grid, GridItem, Radio, SelectInput, TextInput } from '../displayComponents';
import { getPrimary } from '../../styles/colors';
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { checkValidEmail, errorHandler } from '../../utils';
import CouncilBoxApi from '../../api/CouncilboxApi';

let primary = getPrimary();

class NewParticipantForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            languages: [],
            addRepresentative: false,
            participantType: 0,
            data: {
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

    sendNewParticipant = async () => {
        if (!this.checkRequiredFields()) {
            const { participant, representative } = this.state.data;
            const { translate } = this.props;

            let variables = {
                participant: {
                    ...participant,
                    name: `${participant.name} ${participant.surname}`,
                    councilId: this.props.councilID
                }
            };

            if (this.state.addRepresentative) {
                variables.representative = {
                    ...representative,
                    name: `${representative.name} ${representative.surname}`,
                    councilId: this.props.councilID
                }
            }

            const response = await this.props.mutate({
                variables: variables
            });
            if (response) {
                if (response.errors) {
                    const errorField = errorHandler(response.errors[ 0 ].code);
                    this.setState({
                        errors: {
                            ...this.state.errors,
                            email: translate[ errorField ]
                        }
                    })
                } else {
                    this.props.requestClose();
                    //this.props.refetch();
                    //this.resetValues();
                    //this.props.close();
                }
            }
        }
    };

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

    close = () => {
        this.resetValues();
        this.props.requestClose();
    };

    resetValues = () => {
        this.setState({
            data: {
                ...this.props.data,
                participant: {
                    ...newParticipantInitialValues
                },
                representative: {
                    ...newRepresentativeInitialValues
                }
            }
        })
    };

    _renderAddParticipantButtons() {
        const { translate } = this.props;
        primary = getPrimary();

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

    _renderRepresentativeForm() {
        const { translate } = this.props;
        const { representative } = this.state.data;
        const { errors } = this.state;

        return (<Grid style={{
                margin: '1em',
                padding: '1em',
                border: '1px solid turquoise'
            }}>
                <GridItem xs={6} lg={4} md={4}>
                    <TextInput
                        floatingText={translate.name}
                        type="text"
                        errorText={errors.name}
                        value={representative.name}
                        onChange={(event) => this.updateRepresentative({
                            name: event.nativeEvent.target.value
                        })}
                    />
                </GridItem>
                <GridItem xs={6} lg={4} md={4}>
                    <TextInput
                        floatingText={translate.surname}
                        type="text"
                        errorText={errors.surname}
                        value={representative.surname}
                        onChange={(event) => this.updateRepresentative({
                            surname: event.nativeEvent.target.value
                        })}
                    />
                </GridItem>
                <GridItem xs={6} lg={4} md={4}>
                    <TextInput
                        floatingText={translate.new_dni}
                        type="text"
                        errorText={errors.dni}
                        value={representative.dni}
                        onChange={(event) => this.updateRepresentative({
                            dni: event.nativeEvent.target.value
                        })}
                    />
                </GridItem>
                <GridItem xs={6} lg={4} md={4}>
                    <TextInput
                        floatingText={translate.position}
                        type="text"
                        errorText={errors.position}
                        value={representative.position}
                        onChange={(event) => this.updateRepresentative({
                            position: event.nativeEvent.target.value
                        })}
                    />
                </GridItem>
                <GridItem xs={6} lg={4} md={4}>
                    <TextInput
                        floatingText={translate.email}
                        type="text"
                        errorText={errors.email}
                        value={representative.email}
                        onChange={(event) => this.updateRepresentative({
                            email: event.nativeEvent.target.value
                        })}
                    />
                </GridItem>
                <GridItem xs={6} lg={4} md={4}>
                    <TextInput
                        floatingText={translate.phone}
                        type="text"
                        errorText={errors.phone}
                        value={representative.phone}
                        onChange={(event) => this.updateRepresentative({
                            phone: event.nativeEvent.target.value
                        })}
                    />
                </GridItem>
                <GridItem xs={12} lg={2} md={2}>
                    <SelectInput
                        floatingText={translate.language}
                        value={representative.language}
                        onChange={(event) => this.updateRepresentative({
                            language: event.target.value
                        })}
                    >
                        {this.state.languages.map((language) => {
                            return <MenuItem value={language.column_name}
                                             key={`language${language.id}`}>{language.desc}</MenuItem>
                        })}
                    </SelectInput>
                </GridItem>
            </Grid>)
    }

    _renderAddParticipantForm() {
        const participant = this.state.data.participant;
        const errors = this.state.errors;
        const { translate, participations } = this.props;

        if (this.state.participantType === 1) {
            return (<Grid>
                    <GridItem xs={12} lg={4} md={6}>
                        <TextInput
                            floatingText={translate.entity_name}
                            type="text"
                            errorText={errors.name}
                            value={participant.name}
                            onChange={(event) => this.updateParticipant({
                                name: event.nativeEvent.target.value
                            })}
                        />
                    </GridItem>

                    <GridItem xs={12} lg={4} md={6}>
                        <TextInput
                            floatingText={translate.cif}
                            type="text"
                            errorText={errors.dni}
                            value={participant.dni}
                            onChange={(event) => this.updateParticipant({
                                dni: event.nativeEvent.target.value
                            })}
                        />
                    </GridItem>

                    <GridItem xs={12} lg={4} md={6}>
                        <TextInput
                            floatingText={translate.position}
                            type="text"
                            errorText={errors.position}
                            value={participant.position}
                            onChange={(event) => this.updateParticipant({
                                position: event.nativeEvent.target.value
                            })}
                        />
                    </GridItem>

                    <GridItem xs={12} lg={4} md={6}>
                        <TextInput
                            floatingText={translate.email}
                            type="text"
                            errorText={errors.email}
                            value={participant.email}
                            onChange={(event) => this.updateParticipant({
                                email: event.nativeEvent.target.value
                            })}
                        />
                    </GridItem>

                    <GridItem xs={12} lg={4} md={6}>
                        <TextInput
                            floatingText={translate.phone}
                            type="text"
                            errorText={errors.phone}
                            value={participant.phone}
                            onChange={(event) => this.updateParticipant({
                                phone: event.nativeEvent.target.value
                            })}
                        />
                    </GridItem>

                    <GridItem xs={4} lg={2} md={2}>
                        <SelectInput
                            floatingText={translate.language}
                            value={participant.language}
                            onChange={(event) => this.updateParticipant({
                                language: event.target.value
                            })}
                        >
                            {this.state.languages.map((language) => {
                                return <MenuItem value={language.column_name}
                                                 key={`language${language.id}`}>{language.desc}</MenuItem>
                            })}
                        </SelectInput>
                    </GridItem>

                    <GridItem xs={4} lg={2} md={2}>
                        <TextInput
                            floatingText={translate.votes}
                            type="number"
                            errorText={errors.numParticipations}
                            value={participant.numParticipations}
                            onChange={(event) => this.updateParticipant({
                                numParticipations: event.nativeEvent.target.value
                            })}
                        />
                    </GridItem>
                    {participations && <GridItem xs={4} lg={2} md={2}>
                        <TextInput
                            floatingText={translate.social_capital}
                            type="number"
                            errorText={errors.socialCapital}
                            value={participant.socialCapital}
                            onChange={(event) => this.updateParticipant({
                                socialCapital: event.nativeEvent.target.value
                            })}
                        />
                    </GridItem>}
                </Grid>);
        }

        return (<Grid>
                <GridItem xs={12} lg={4} md={6}>
                    <TextInput
                        floatingText={translate.name}
                        type="text"
                        errorText={errors.name}
                        value={participant.name}
                        onChange={(event) => this.updateParticipant({
                            name: event.nativeEvent.target.value
                        })}
                    />
                </GridItem>

                <GridItem xs={12} lg={4} md={6}>
                    <TextInput
                        floatingText={translate.surname}
                        type="text"
                        errorText={errors.surname}
                        value={participant.surname}
                        onChange={(event) => this.updateParticipant({
                            surname: event.nativeEvent.target.value
                        })}
                    />
                </GridItem>

                <GridItem xs={12} lg={4} md={6}>
                    <TextInput
                        floatingText={translate.new_dni}
                        type="text"
                        errorText={errors.dni}
                        value={participant.dni}
                        onChange={(event) => this.updateParticipant({
                            dni: event.nativeEvent.target.value
                        })}
                    />
                </GridItem>

                <GridItem xs={12} lg={4} md={6}>
                    <TextInput
                        floatingText={translate.position}
                        type="text"
                        errorText={errors.position}
                        value={participant.position}
                        onChange={(event) => this.updateParticipant({
                            position: event.nativeEvent.target.value
                        })}
                    />
                </GridItem>

                <GridItem xs={12} lg={4} md={6}>
                    <TextInput
                        floatingText={translate.email}
                        type="text"
                        errorText={errors.email}
                        value={participant.email}
                        onChange={(event) => this.updateParticipant({
                            email: event.nativeEvent.target.value
                        })}
                    />
                </GridItem>

                <GridItem xs={12} lg={4} md={6}>
                    <TextInput
                        floatingText={translate.phone}
                        type="text"
                        errorText={errors.phone}
                        value={participant.phone}
                        onChange={(event) => this.updateParticipant({
                            phone: event.nativeEvent.target.value
                        })}
                    />
                </GridItem>

                <GridItem xs={12} lg={4} md={6}>
                    <SelectInput
                        floatingText={translate.language}
                        value={participant.language}
                        onChange={(event) => this.updateParticipant({
                            language: event.target.value
                        })}
                    >
                        {this.state.languages.map((language) => {
                            return <MenuItem value={language.column_name}
                                             key={`language${language.id}`}>{language.desc}</MenuItem>
                        })}
                    </SelectInput>
                </GridItem>

                <GridItem xs={4} lg={2} md={2}>
                    <TextInput
                        floatingText={translate.votes}
                        type="number"
                        errorText={errors.numParticipations}
                        value={participant.numParticipations}
                        onChange={(event) => this.updateParticipant({
                            numParticipations: event.nativeEvent.target.value
                        })}
                    />
                </GridItem>
                {participations && <GridItem xs={4} lg={2} md={2}>
                    <TextInput
                        floatingText={translate.social_capital}
                        type="number"
                        errorText={errors.socialCapital}
                        value={participant.socialCapital}
                        onChange={(event) => this.updateParticipant({
                            socialCapital: event.nativeEvent.target.value
                        })}
                    />
                </GridItem>}
            </Grid>);
    }

    render() {
        const { translate } = this.props;
        return (<Fragment>
                <Grid>
                    <GridItem xs={12} lg={12} md={12}>
                        <Typography variant="title">
                            {translate.add_participant}
                        </Typography>
                    </GridItem>
                    {this._renderAddParticipantTypeSelector()}
                    {this._renderAddParticipantForm()}
                    {this._renderRepresentativeCheckbox()}
                    {this.state.addRepresentative && this._renderRepresentativeForm()}
                    {this._renderAddParticipantButtons()}
                </Grid>
            </Fragment>);
    }
}

const addParticipant = gql `
    mutation addParticipant($participant: NewParticipant, $representative: NewRepresentative) {
        addCouncilParticipant(participant: $participant, representative: $representative){
            id
        }
    }
`;

export default graphql(addParticipant, {
    options: {
        errorPolicy: 'all'
    }
})(NewParticipantForm);

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