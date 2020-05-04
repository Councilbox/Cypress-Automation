import React from 'react';
import {
    Grid,
    GridItem,
    SelectInput,
    TextInput
} from "../../displayComponents";
import { MenuItem } from 'material-ui';
import { getPrimary } from '../../styles/colors';
import { isMobile } from '../../utils/screen';

const UserForm = ({ data, updateState, errors, languages, onKeyUp, translate }) => (
    <Grid style={{ justifyContent: "space-between", color: '#61abb7' }}>
        <GridItem xs={12} md={12} lg={12} style={{ display: "flex", alignItems: 'center', }}>
            <div style={{ width: "120px", color: getPrimary(), fontWeight: "bold" }}>
                {translate.name}
            </div>
            <div>
                <TextInput
                    // floatingText={translate.name}
                    type="text"
                    // required
                    disableUnderline={!!data.name}
                    styles={{ fontWeight: "bold", width: isMobile ? "100%" : '300px' }}
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
        <GridItem xs={12} md={12} lg={12} style={{ display: "flex", alignItems: 'center', }}>
            <div style={{ width: "120px", color: getPrimary(), fontWeight: "bold" }}>
                {translate.surname}
            </div>
            <div >
                <TextInput
                    // floatingText={translate.surname || ''}
                    type="text"
                    value={data.surname || ''}
                    disableUnderline={!!data.surname}
                    styles={{ fontWeight: "bold", width: isMobile ? "100%" : '300px' }}
                    onChange={event =>
                        updateState({
                            surname: event.target.value
                        })
                    }
                    errorText={errors.surname || ''}
                // required
                />
            </div>
        </GridItem>
        <GridItem xs={12} md={12} lg={12} style={{ display: "flex", alignItems: 'center', }}>
            <div style={{ width: "120px", color: getPrimary(), fontWeight: "bold" }}>
                {translate.email}
            </div>
            <div>
                <TextInput
                    // floatingText={translate.email}
                    type="text"
                    value={data.email}
                    disabled={true}
                    disableUnderline={true}
                    styles={{ fontWeight: "bold", width: isMobile ? "100%" : '300px' }}
                    {...(!!onKeyUp ? { onKeyUp: onKeyUp } : {})}
                    onChange={event =>
                        updateState({
                            email: event.target.value
                        })
                    }
                    errorText={errors.email}
                // required
                />
            </div>
        </GridItem>
        <GridItem xs={12} md={12} lg={12} style={{ display: "flex", alignItems: 'center', }}>
            <div style={{ display: "flex", alignItems: 'center', justifyContent: "space-between", width: "100%" }}>
                <div style={{ display: "flex", alignItems: 'center', }}>
                    <div style={{ width: "120px", color: getPrimary(), fontWeight: "bold" }}>
                        {translate.phone}
                    </div>
                    <div>
                        <TextInput
                            // floatingText={translate.phone}
                            type="text"
                            value={data.phone}
                            disableUnderline={true}
                            styles={{ fontWeight: "bold", width: '300px' }}
                            errorText={errors.phone}
                            onChange={event =>
                                updateState({
                                    phone: event.target.value
                                })
                            }
                        />
                    </div>
                </div>
                {!isMobile &&
                    <div style={{ display: "flex", alignItems: 'center', }}>
                        <div style={{ width: "90px", color: getPrimary(), fontWeight: "bold", marginTop: "4px" }}>
                            {translate.language}
                        </div>
                        <div>
                            <SelectInput
                                // floatingText={translate.language}
                                value={data.preferredLanguage}
                                onChange={event =>
                                    updateState({
                                        preferredLanguage: event.target.value
                                    })
                                }
                                styles={{ fontWeight: "bold" }}
                                errorText={errors.preferredLanguage}
                                // required
                                disableUnderline={true}
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
                            {/* <span style={{ color: getPrimary() }} className="material-icons">
                            arrow_drop_down
                        </span> */}
                        </div>
                    </div>
                }
            </div>
        </GridItem>
        {isMobile &&
            <GridItem xs={12} md={12} lg={12} style={{ display: "flex", alignItems: 'center', }}>
                <div style={{ display: "flex", alignItems: 'center', }}>
                    <div style={{ width: "90px", color: getPrimary(), fontWeight: "bold", marginTop: "4px" }}>
                        {translate.language}
                    </div>
                    <div>
                        <SelectInput
                            // floatingText={translate.language}
                            value={data.preferredLanguage}
                            onChange={event =>
                                updateState({
                                    preferredLanguage: event.target.value
                                })
                            }
                            styles={{ fontWeight: "bold" }}
                            errorText={errors.preferredLanguage}
                            // required
                            disableUnderline={true}
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
                        {/* <span style={{ color: getPrimary() }} className="material-icons">
                            arrow_drop_down
                        </span> */}
                    </div>
                </div>
            </GridItem>
        }
        <div style={{ width: "100%", border: "1px solid" + getPrimary() }}></div>
        {/* <GridItem xs={12} md={12} lg={12} style={{ display: "flex", alignItems: 'center', }}>
            IDIOMA
        </GridItem> */}


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
        {/* <GridItem xs={12} md={6} lg={5} style={{ display: "flex", alignItems: 'center', justifyContent: 'center' }}>
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
        </GridItem> */}
    </Grid >
)

export default UserForm