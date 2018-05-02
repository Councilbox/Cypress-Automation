import React from 'react';
import { TextInput, SelectInput, Grid, GridItem } from '../../../displayComponents';
import { MenuItem } from 'material-ui';

const ParticipantForm = ({ type, participant, errors, updateState, participations, translate, languages }) => {
    if (type === 1) {
        return (<Grid>
                <GridItem xs={12} lg={4} md={6}>
                    <TextInput
                        floatingText={translate.entity_name}
                        type="text"
                        errorText={errors.name}
                        value={participant.name}
                        onChange={(event) => updateState({
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
                        onChange={(event) => updateState({
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
                        onChange={(event) => updateState({
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
                        onChange={(event) => updateState({
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
                        onChange={(event) => updateState({
                            phone: event.nativeEvent.target.value
                        })}
                    />
                </GridItem>

                <GridItem xs={4} lg={2} md={2}>
                    <SelectInput
                        floatingText={translate.language}
                        value={participant.language}
                        onChange={(event) => updateState({
                            language: event.target.value
                        })}
                    >
                        {languages.map((language) => {
                            return <MenuItem
                                value={language.column_name}
                                key={`language_${language.id}`}>{language.desc}</MenuItem>
                        })}
                    </SelectInput>
                </GridItem>

                <GridItem xs={4} lg={2} md={2}>
                    <TextInput
                        floatingText={translate.votes}
                        type="number"
                        errorText={errors.numParticipations}
                        value={participant.numParticipations}
                        onChange={(event) => updateState({
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
                        onChange={(event) => updateState({
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
                    onChange={(event) => updateState({
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
                    onChange={(event) => updateState({
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
                    onChange={(event) => updateState({
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
                    onChange={(event) => updateState({
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
                    onChange={(event) => updateState({
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
                    onChange={(event) => updateState({
                        phone: event.nativeEvent.target.value
                    })}
                />
            </GridItem>

            <GridItem xs={12} lg={4} md={6}>
                <SelectInput
                    floatingText={translate.language}
                    value={participant.language}
                    onChange={(event) => updateState({
                        language: event.target.value
                    })}
                >
                    {languages.map((language) => {
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
                    onChange={(event) => updateState({
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
                    onChange={(event) => updateState({
                        socialCapital: event.nativeEvent.target.value
                    })}
                />
            </GridItem>}
        </Grid>);
};

export default ParticipantForm