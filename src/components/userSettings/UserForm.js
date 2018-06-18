import React from 'react';
import {
	BasicButton,
	ButtonIcon,
	Grid,
	GridItem,
	SelectInput,
	TextInput
} from "../../displayComponents";
import { MenuItem } from 'material-ui';

const UserForm = ({ data, updateState, errors, languages, translate }) => (
    <Grid>
        <GridItem xs={12} md={6} lg={4}>
            <TextInput
                floatingText={translate.name}
                type="text"
                required
                value={data.name}
                errorText={errors.name}
                onChange={event =>
                    updateState({
                        name: event.target.value
                    })
                }
            />
        </GridItem>
        <GridItem xs={12} md={6} lg={4}>
            <TextInput
                floatingText={translate.surname}
                type="text"
                value={data.surname}
                onChange={event =>
                    updateState({
                        surname: event.target.value
                    })
                }
                errorText={errors.surname}
                required
            />
        </GridItem>
        <GridItem xs={12} md={6} lg={4}>
            <TextInput
                floatingText={translate.email}
                type="text"
                value={data.email}
                onChange={event =>
                    updateState({
                        email: event.target.value
                    })
                }
                errorText={errors.email}
                required
            />
        </GridItem>
        <GridItem xs={12} md={6} lg={4}>
            <TextInput
                floatingText={translate.phone}
                type="text"
                value={data.phone}
                errorText={errors.phone}
                onChange={event =>
                    updateState({
                        phone: event.target.value
                    })
                }
            />
        </GridItem>
        <GridItem xs={12} md={6} lg={4}>
            <SelectInput
                floatingText={translate.language}
                value={data.preferred_language}
                onChange={event =>
                    updateState({
                        preferred_language: event.target.value
                    })
                }
                errorText={errors.preferred_language}
                required
            >
                {languages.map(language => (
                    <MenuItem
                        key={`language_${language.columnName}`}
                        value={language.columnName}
                    >
                        {language.desc}
                    </MenuItem>
                ))}
            </SelectInput>
        </GridItem>
    </Grid>
)

export default UserForm