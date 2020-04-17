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
    <Grid style={{ justifyContent: "space-between", color: '#61abb7' }}>
        {/* <GridItem xs={12} md={12} lg={12}>
            <h2 style={{
                color: getPrimary(),
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '0.6em'
            }}>
               
                Datos del nuevo usuario
            </h2>
        </GridItem> */}
        <GridItem xs={12} md={6} lg={5} style={{ display: "flex", alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: "15px", width: "2em" }}>
                <i className={'fa fa-info'}></i>
            </div>
            <div style={{ width: "100%" }}>
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
        <GridItem xs={12} md={6} lg={5} style={{ display: "flex", alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: "15px", width: "2em" }}></div>
            <div style={{ width: "100%" }}>
                <TextInput
                    floatingText={translate.surname || ''}
                    type="text"
                    value={data.surname || ''}
                    onChange={event =>
                        updateState({
                            surname: event.target.value
                        })
                    }
                    errorText={errors.surname || ''}
                    required
                />
            </div>
        </GridItem>
        <GridItem xs={12} md={6} lg={5} style={{ display: "flex", alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: "15px", width: "2em" }}>
                <i className={'fa fa-at'}></i>
            </div>
            <div style={{ width: "100%" }}>
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
        <GridItem xs={12} md={6} lg={5} style={{ display: "flex", alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: "15px", width: "2em" }}></div>
            <div style={{ width: "100%" }}>
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
        <GridItem xs={12} md={6} lg={5} style={{ display: "flex", alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: "15px", width: "2em" }}></div>
            <div style={{ width: "100%" }}>
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
                    {languages &&
                    languages.map(language => (
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