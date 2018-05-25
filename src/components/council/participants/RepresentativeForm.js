import React from 'react';
import { Grid, GridItem, SelectInput, TextInput } from '../../../displayComponents';
import { MenuItem } from 'material-ui';

const RepresentativeForm = ({ representative, errors, updateState, translate, languages, guest }) => (<Grid>
    <GridItem xs={6} lg={4} md={4}>
        <TextInput
            floatingText={translate.name}
            type="text"
            errorText={errors.name}
            value={representative.name}
            onChange={(event) => updateState({
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
            onChange={(event) => updateState({
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
            onChange={(event) => updateState({
                dni: event.nativeEvent.target.value
            })}
        />
    </GridItem>
    {!guest && <GridItem xs={6} lg={4} md={4}>
        <TextInput
            floatingText={translate.position}
            type="text"
            errorText={errors.position}
            value={representative.position}
            onChange={(event) => updateState({
                position: event.nativeEvent.target.value
            })}
        />
    </GridItem>}
    <GridItem xs={6} lg={4} md={4}>
        <TextInput
            floatingText={translate.email}
            type="text"
            errorText={errors.email}
            value={representative.email}
            onChange={(event) => updateState({
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
            onChange={(event) => updateState({
                phone: event.nativeEvent.target.value
            })}
        />
    </GridItem>
    <GridItem xs={12} lg={2} md={2}>
        <SelectInput
            floatingText={translate.language}
            value={representative.language}
            onChange={(event) => updateState({
                language: event.target.value
            })}
        >
            {languages.map((language) => {
                return <MenuItem value={language.columnName ? language.columnName : language.column_name}
                                 key={`language${language.columnName ? language.columnName : language.column_name}`}>{language.desc}</MenuItem>
            })}
        </SelectInput>
    </GridItem>
</Grid>);

export default RepresentativeForm;