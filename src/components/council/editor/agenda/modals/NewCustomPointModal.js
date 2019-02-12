import React from 'react';
import { Radio, SectionTitle, TextInput, AlertConfirm, Grid, GridItem } from "../../../../../displayComponents";
import { getPrimary, getSecondary } from '../../../../../styles/colors';
import { Card } from 'material-ui';

const defaultPollOptions = {
    writeIn: false,
    maxSelections: false,
    multiselect: false
}

defaultValues = {
    agendaSubject: "",
    subjectType: 5,
    description: "",
}

const NewCustomPointModal = ({ translate, ...props }) => {
    const [agenda, setAgenda] = React.useState(defaultValue)
    const [choices, setChoices] = React.useState([]);
    const [options, setOptions] = React.useState(defaultPollOptions);


    const primary = getPrimary();
    const secondary = getSecondary();

    return (
        <AlertConfirm
            requestClose={props.requestClose}
            open={props.open}
            //acceptAction={this.addAgenda}
            //buttonAccept={translate.accept}
            //buttonCancel={translate.cancel}
            //bodyText={this._renderNewPointBody()}
            title={translate.new_point}
        />
    )

    return (
        <div style={{marginTop: '1em', marginBottom: '2em'}}>
            <Grid>
                <GridItem xs={12} md={9} lg={9}>
                    <TextInput
                        floatingText={translate.title}
                        type="text"
                        errorText={errors.agendaSubject}
                        value={agenda.agendaSubject}
                        onChange={event =>
                            this.updateState({
                                agendaSubject: event.target.value
                            })
                        }
                        required
                    />
                </GridItem>
                <GridItem xs={12} md={3} lg={3}>
                    <SelectInput
                        floatingText={translate.type}
                        value={"" + agenda.subjectType}
                        onChange={event =>
                            this.updateState({
                                subjectType: +event.target.value
                            })
                        }
                        required
                    >
                        {filteredTypes.map(voting => {
                            return (
                                <MenuItem
                                    value={"" + voting.value}
                                    key={`voting${voting.value}`}
                                >
                                    {translate[voting.label]}
                                </MenuItem>
                            );
                        })}
                    </SelectInput>
                </GridItem>
            </Grid>
            <SectionTitle
                text={'Selección'}
                color={primary}
            />
            <Radio
                value={"0"}
                checked={options.multiselect}
                onChange={event => {}}
                name="security"
                label={'Múltiple'}
            />
            <Radio
                value={"1"}
                checked={!options.multiselect}
                onChange={event => {}}
                name="security"
                label={'Única'}
            />

            <SectionTitle
                text={'Respuestas posibles'}
                color={primary}
                style={{marginTop: '1.3em'}}
            />
            {choices.map((choice, index) => (
                <Card
                    key={`choice_${choice.value}`}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                    <TextInput
                        value={choice.value}
                        floatingText="Valor"
                    />
                    <i className="fa fa-times" aria-hidden="true" style={{color: 'red'}}></i>
                </Card>

            ))}
        </div>
    )
}

export default NewCustomPointModal;