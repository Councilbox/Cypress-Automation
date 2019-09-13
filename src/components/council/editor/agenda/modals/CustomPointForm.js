import React from 'react';
import { CUSTOM_AGENDA_VOTING_TYPES } from '../../../../../constants';
import { Radio, SectionTitle, TextInput, Grid, GridItem, SelectInput, BasicButton } from "../../../../../displayComponents";
import RichTextInput from "../../../../../displayComponents/RichTextInput";
import { MenuItem } from 'material-ui';
import { getPrimary, getSecondary } from '../../../../../styles/colors';
import { Card } from 'material-ui';

const CustomPointForm = ({
    errors,
    translate,
    agenda,
    options,
    items,
    council,
    company,
    addOption,
    updateAgenda,
    updateOptions,
    updateItem,
    removeItem,
    ...props
}) => {
    const [loadDraftModal, setLoadDraft] = React.useState(false);
    const editor = React.useRef();
    const validateNumber = number => {
        if(number < 0 || isNaN(number)){
            let value = Math.abs(parseInt(number, 10));
            if(isNaN(value)){
                return '';
            }
            return value;
        }
        return number;
    }

    const primary = getPrimary();
    const secondary = getSecondary();

    return (
        <React.Fragment>
            <div>
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
                            floatingText={translate.votation_type}
                            value={"" + agenda.subjectType}
                            onChange={event =>
                                updateAgenda({
                                    subjectType: +event.target.value
                                })
                            }
                            required
                        >
                            {council.councilType === 3?
                                    <MenuItem
                                        value={"" + CUSTOM_AGENDA_VOTING_TYPES[1].value}
                                        key={`voting${CUSTOM_AGENDA_VOTING_TYPES[1].value}`}
                                    >
                                        {translate[CUSTOM_AGENDA_VOTING_TYPES[1].label]}
                                    </MenuItem>
                            :
                                Object.keys(CUSTOM_AGENDA_VOTING_TYPES).map(key => {
                                    return (
                                        <MenuItem
                                            value={"" + CUSTOM_AGENDA_VOTING_TYPES[key].value}
                                            key={`voting${CUSTOM_AGENDA_VOTING_TYPES[key].value}`}
                                        >
                                            {translate[CUSTOM_AGENDA_VOTING_TYPES[key].label]}
                                        </MenuItem>
                                    );
                                })
                            }
                        </SelectInput>
                    </GridItem>
                    <RichTextInput
                        ref={editor}
                        floatingText={translate.description}
                        translate={translate}
                        type="text"
                        tags={[
                            {
                                value: `${council.street}, ${council.country}`,
                                label: translate.new_location_of_celebrate
                            },
                            {
                                value: company.countryState,
                                label: translate.company_new_country_state
                            },
                            {
                                value: company.city,
                                label: translate.company_new_locality
                            }
                        ]}
                        errorText={errors.description}
                        value={agenda.description}
                        onChange={value =>
                           updateAgenda({
                                description: value
                            })
                        }
                    />
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
                        checked={!!options.multiselect}
                        onChange={event => updateOptions({
                            multiselect: true,
                            maxSelections: 2
                        })}
                        name="security"
                        label={'Múltiple'}//TRADUCCION
                    />
                    <Radio
                        checked={!options.multiselect}
                        onChange={event => updateOptions({
                            multiselect: false,
                            maxSelections: 1
                        })}
                        name="security"
                        label={'Única'}//TRADUCCION
                    />
                </div>
                {options.multiselect &&
                    <React.Fragment>
                        <TextInput
                            floatingText="Máximo de elecciones por usuario"//TRADUCCION
                            value={options.maxSelections}
                            onChange={event => updateOptions({ maxSelections: validateNumber(event.target.value)})}
                        />
                        {errors.maxSelections &&
                            <div style={{color: 'red'}}>
                                {errors.maxSelections}
                            </div>
                        }
                        <TextInput
                            floatingText="Elecciones mínimas"//TRADUCCION
                            value={options.minSelections}
                            onChange={event => updateOptions({ minSelections: validateNumber(event.target.value) })}
                        />
                        {errors.minSelections &&
                            <div style={{color: 'red'}}>
                                {errors.minSelections}
                            </div>
                        }
                    </React.Fragment>
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
                {items.map((item, index) => (
                    <Card
                        key={`item_${index}`}
                        style={{
                            display: 'flex',
                            padding: '0.6em',
                            marginBottom: '0.6em',
                            justifyContent: 'space-between'
                        }}
                    >
                        <TextInput
                            value={item.value}
                            placeholder="Escribe el valor de la opción"
                            floatingText="Valor"
                            errorText={errors.items && errors.items[index] && errors.items[index].error}
                            onChange={event => updateItem(index, event.target.value)}
                        />
                        <i
                            className="fa fa-times"
                            aria-hidden="true"
                            style={{color: 'red', cursor: 'pointer'}}
                            onClick={() => removeItem(index)}
                        ></i>
                    </Card>
                ))}
                {errors.itemsLength &&
                    <div style={{color: 'red'}}>
                        {errors.itemsLength}
                    </div>
                }
            </div>
        </React.Fragment>
    )
}

export default CustomPointForm;