import React from 'react';
import { Radio, SectionTitle, TextInput, AlertConfirm, Grid, GridItem, SelectInput, BasicButton } from "../../../../../displayComponents";
import { MenuItem } from 'material-ui';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { getPrimary, getSecondary } from '../../../../../styles/colors';
import { CUSTOM_AGENDA_VOTING_TYPES } from '../../../../../constants';
import { Card } from 'material-ui';

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
    const [agenda, setAgenda] = React.useState(defaultValues);
    const [errors, setErrors] = React.useState({});
    const [choices, setChoices] = React.useState([{
        value: ''
    }]);
    const [options, setOptions] = React.useState(defaultPollOptions);


    const primary = getPrimary();
    const secondary = getSecondary();

    const addCustomPoint = async () => {
        const response = await addCustomAgenda({
            variables: {
                agenda,
                choices,
                options
            }
        });

        console.log(response);
    }

    const addOption = () => {
        setChoices([
            ...choices,
            {
                value: ''
            }
        ])
    }

    const updateChoice = (index, value) => {
        let newChoices = [...choices];
        newChoices[index].value = value;
        setChoices(newChoices);
    }

    const updateOptions = object => {
        setOptions({
            ...options,
            ...object
        });
    }

    const updateAgenda = object => {
        setAgenda({
            ...agenda,
            ...object
        });
    }

    console.log(choices, agenda, options);

    const renderBody = () => {
        return (
            <div style={{marginTop: '1em', marginBottom: '2em'}}>
                <Grid>
                    <GridItem xs={12} md={9} lg={9}>
                        <TextInput
                            floatingText={translate.title}
                            type="text"
                            errorText={errors.agendaSubject}
                            value={agenda.agendaSubject}
                            onChange={event => updateAgenda({agendaSubject: event.target.value})}
                            required
                        />
                    </GridItem>
                    <GridItem xs={12} md={3} lg={3}>
                        <SelectInput
                            floatingText={'Tipo de votación'}//TRADUCCION
                            value={"" + agenda.subjectType}
                            onChange={event =>
                                updateAgenda({
                                    subjectType: +event.target.value
                                })
                            }
                            required
                        >
                            {Object.keys(CUSTOM_AGENDA_VOTING_TYPES).map(key => {
                                return (
                                    <MenuItem
                                        value={"" + CUSTOM_AGENDA_VOTING_TYPES[key].value}
                                        key={`voting${CUSTOM_AGENDA_VOTING_TYPES[key].value}`}
                                    >
                                        {translate[CUSTOM_AGENDA_VOTING_TYPES[key].label]}
                                    </MenuItem>
                                );
                            })}
                        </SelectInput>
                    </GridItem>
                </Grid>
                <SectionTitle
                    text={'Selección'}//TRADUCCION
                    color={primary}
                    style={{
                        marginTop: '1em'
                    }}
                />
                <div>
                    <Radio
                        value={"0"}
                        checked={options.multiselect}
                        onChange={event => updateOptions({multiselect: true})}
                        name="security"
                        label={'Múltiple'}//TRADUCCION
                    />
                    <Radio
                        value={"1"}
                        checked={!options.multiselect}
                        onChange={event => updateOptions({multiselect: false})}
                        name="security"
                        label={'Única'}//TRADUCCION
                    />
                </div>
                {options.multiselect &&
                    <TextInput
                        floatingText="Máximo de elecciones por usuario"//TRADUCCION
                        value={options.maxSelections}
                        onChange={event => updateOptions({ maxSelections: event.target.value})}
                    />
                }
                <SectionTitle
                    text={'Respuestas posibles'}//TRADUCCION
                    color={primary}
                    style={{marginTop: '1.3em'}}
                />
                <BasicButton
                    onClick={addOption}
                    color="white"
                    text="Añadir opción"//TRADUCCION
                    buttonStyle={{
                        color: 'white',
                        border: `1px solid ${secondary}`,
                        marginBottom: '1em'
                    }}
                    textStyle={{
                        fontWeight: '700',
                        color: secondary
                    }}
                />
                {choices.map((choice, index) => (
                    <Card
                        key={`choice_${index}`}
                        style={{
                            display: 'flex',
                            padding: '0.6em',
                            marginBottom: '0.6em',
                            justifyContent: 'space-between'
                        }}
                    >
                        <TextInput
                            value={choice.value}
                            placeholder="Escribe el valor de la opción"
                            floatingText="Valor"
                            onChange={event => updateChoice(index, event.target.value)}
                        />
                        <i className="fa fa-times" aria-hidden="true" style={{color: 'red'}}></i>
                    </Card>

                ))}
            </div>
        )
    }

    return (
        <AlertConfirm
            requestClose={props.requestClose}
            open={props.open}
            acceptAction={this.addCustomAgenda}
            buttonAccept={translate.accept}
            buttonCancel={translate.cancel}
            bodyText={renderBody()}
            title={translate.new_point}
        />
    )
}

const addCustomAgenda = gql`
    mutation AddCustomAgenda($agenda: AgendaInput!, $pollOptions: PollOptionsInput!, $pollChoices: [PollChoicesInput]!){
        addCustomAgenda(agenda: $agenda, pollOptions: $pollOptions, pollChoices: $pollChoices){
            id
        }
    }
`;

export default graphql(addCustomAgenda, {
    name: 'addCustomAgenda'
})(NewCustomPointModal);