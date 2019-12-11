import React from 'react';
import {
    Grid,
    GridItem,
    SelectInput,
    TextInput
} from "../../displayComponents";
import { MenuItem } from 'material-ui';
import { getPrimary } from '../../styles/colors';

const UserForm = ({ data, updateState, errors, languages, onKeyUp, translate }) => (
    <Grid style={{ justifyContent:"space-between" }}>
        <GridItem xs={12} md={12} lg={12}>
            <h2 style={{
                color: getPrimary(),
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '0.6em'
            }}>
                {/* TRADUCCION */}
                Datos del nuevo usuario
            </h2>
        </GridItem>
        <GridItem xs={12} md={6} lg={5} style={{ }}>
            <div style={{ }}>
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
            </div>
        </GridItem>
        <GridItem xs={12} md={6} lg={5} style={{ }}>
            <div style={{ }}>
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
            </div>
        </GridItem>
        <GridItem xs={12} md={6} lg={5} style={{ }}>
            <div style={{ }}>
                <TextInput
                    floatingText={translate.email}
                    type="text"
                    value={data.email}
                    {...(!!onKeyUp ? { onKeyUp: onKeyUp } : {})}
                    onChange={event =>
                        updateState({
                            email: event.target.value
                        })
                    }
                    errorText={errors.email}
                    required
                />
            </div>
        </GridItem>
        <GridItem xs={12} md={6} lg={5} style={{ }}>
            <div style={{ }}>
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
            </div>
        </GridItem>
        <GridItem xs={12} md={6} lg={5} style={{ }}>
            <div style={{ }}>
                <SelectInput
                    floatingText={translate.language}
                    value={data.preferredLanguage}
                    onChange={event =>
                        updateState({
                            preferredLanguage: event.target.value
                        })
                    }
                    errorText={errors.preferredLanguage}
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
            </div>
        </GridItem>
    </Grid >
)

export default UserForm