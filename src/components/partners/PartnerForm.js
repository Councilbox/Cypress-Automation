import React from 'react';
import { SelectInput, TextInput, Grid, GridItem, Radio, DateTimePicker, SectionTitle } from '../../displayComponents';
import RichTextInput from '../../displayComponents/RichTextInput';
import { MenuItem, Paper } from 'material-ui';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { getPrimary } from '../../styles/colors';

class PartnerForm extends React.PureComponent {

    state = {
        provinces: []
    }

    onParse(event) {
        var text = event
        var tempDiv = document.createElement("DIV");
        tempDiv.innerHTML = text;
        return tempDiv.innerHTML;
    }


    render() {
        const { participant, translate, updateState, errors, checkEmail, representative, updateRepresentative } = this.props;
        const primary = getPrimary();

        return (
            <React.Fragment>
                <Grid>
                    <GridItem xs={12} md={12} lg={12}>
                        <Radio
                            checked={participant.personOrEntity === 0}
                            label={translate.person}
                            onChange={event =>
                                updateState({
                                    personOrEntity: parseInt(
                                        event.nativeEvent.target.value,
                                        10
                                    )
                                })
                            }
                            value="0"
                            name="personOrEntity"
                        />
                        <Radio
                            id={'addSocioPersonaJuridica'}
                            checked={participant.personOrEntity === 1}
                            label={translate.entity}
                            onChange={event =>
                                updateState({
                                    personOrEntity: parseInt(
                                        event.nativeEvent.target.value,
                                        10
                                    ),
                                    surname: ""
                                })
                            }
                            value="1"
                            name="personOrEntity"
                        />
                    </GridItem>
                </Grid>

                <SectionTitle color={primary} text={translate.personal_data} style={{ marginTop: '1.2em' }} />
                <Paper elevation={0}>
                    <Grid>
                        {participant.personOrEntity ? (
                            <GridItem xs={6} md={8} lg={6}>
                                <TextInput
                                    id={'anadirSocioRazonSocial'}
                                    floatingText={translate.entity_name}
                                    type="text"
                                    errorText={errors.name}
                                    value={participant.name || ''}
                                    onChange={event =>
                                        updateState({
                                            name: this.onParse(event.nativeEvent.target.value) 
                                        })
                                    }
                                />
                            </GridItem>
                        ) : (
                                <React.Fragment>
                                    <GridItem xs={6} md={4} lg={3}>
                                        <TextInput
                                            id={'anadirSocioNombre'}
                                            floatingText={translate.name}
                                            type="text"
                                            errorText={errors.name}
                                            value={participant.name || ''}
                                            onChange={event =>
                                                updateState({
                                                    name: this.onParse(event.nativeEvent.target.value) 
                                                })
                                            }
                                        />
                                    </GridItem>
                                    <GridItem xs={6} md={4} lg={3}>
                                        <TextInput
                                            id={'anadirSocioApellido'}
                                            floatingText={translate.surname || ''}
                                            type="text"
                                            errorText={errors.surname || ''}
                                            value={participant.surname || ''}
                                            onChange={event =>
                                                updateState({
                                                    surname: this.onParse(event.nativeEvent.target.value) 
                                                })
                                            }
                                        />
                                    </GridItem>
                                </React.Fragment>
                            )}
                        <GridItem xs={6} md={4} lg={3}>
                            <TextInput
                                id={'anadirSocioDni'}
                                floatingText={participant.personOrEntity === 1 ? translate.cif : translate.dni}
                                type="text"
                                errorText={errors.dni}
                                value={participant.dni || ''}
                                onChange={event =>
                                    updateState({
                                        dni: this.onParse(event.nativeEvent.target.value) 
                                    })
                                }
                            />
                        </GridItem>
                        <GridItem xs={6} md={4} lg={3}>
                            <TextInput
                                id={'anadirSocioNAcionalidad'}
                                floatingText={translate.nationality}
                                type="text"
                                errorText={errors.nationality}
                                value={participant.nationality || ''}
                                onChange={event =>
                                    updateState({
                                        nationality: this.onParse(event.nativeEvent.target.value) 
                                    })
                                }
                            />
                        </GridItem>
                        <GridItem xs={6} md={4} lg={3}>
                            <TextInput
                                id={'anadirSocioMail'}
                                floatingText={translate.email}
                                {...(checkEmail ? { onKeyUp: (event) => checkEmail(event, 'participant') } : {})}
                                type="text"
                                errorText={errors.email}
                                value={participant.email || ''}
                                onChange={event =>
                                    updateState({
                                        email: this.onParse(event.nativeEvent.target.value) 
                                    })
                                }
                            />
                        </GridItem>
                        <GridItem xs={6} md={4} lg={3}>
                            <TextInput
                                id={'anadirSocioTelefono'}
                                floatingText={translate.phone}
                                type="text"
                                errorText={errors.phone}
                                value={participant.phone || ''}
                                onChange={event =>
                                    updateState({
                                        phone: this.onParse(event.nativeEvent.target.value) 
                                    })
                                }
                            />
                        </GridItem>
                        <GridItem xs={6} md={4} lg={3}>
                            <TextInput
                                id={'anadirSocioFijo'}
                                floatingText={translate.landline_phone}
                                type="text"
                                errorText={errors.landlinePhone}
                                value={participant.landlinePhone || ''}
                                onChange={event =>
                                    updateState({
                                        landlinePhone: this.onParse(event.nativeEvent.target.value) 
                                    })
                                }
                            />
                        </GridItem>
                        <GridItem xs={6} md={4} lg={3}>
                            <TextInput
                                id={'anadirSocioTipoSocio'}
                                floatingText={translate.partner_type}
                                type="text"
                                errorText={errors.position}
                                value={participant.position || ''}
                                onChange={event =>
                                    updateState({
                                        position: this.onParse(event.nativeEvent.target.value) 
                                    })
                                }
                            />
                        </GridItem>
                        <GridItem xs={6} md={4} lg={3}>
                            <SelectInput
                                floatingText={translate.state}
                                value={'' + participant.state}
                                errorText={errors.state}
                                onChange={event =>
                                    updateState({
                                        state: +event.target.value
                                    })
                                }
                            >
                                <MenuItem
                                    value={'1'}
                                >
                                    {translate.subscribed}
                                </MenuItem>
                                <MenuItem
                                    value={'0'}
                                >
                                    {translate.unsubscribed}
                                </MenuItem>
                                <MenuItem
                                    value={'2'}
                                >
                                    {translate.other}
                                </MenuItem>
                            </SelectInput>
                        </GridItem>
                        <GridItem xs={6} md={4} lg={3}>
                            <TextInput
                                floatingText={translate.votes}
                                type="number"
                                errorText={errors.numParticipations}
                                value={participant.numParticipations || ''}
                                onChange={event =>
                                    updateState({
                                        numParticipations: +event.target.value
                                    })
                                }
                            />
                        </GridItem>
                        <GridItem xs={6} md={4} lg={3}>
                            <TextInput
                                floatingText={translate.social_capital}
                                type="number"
                                errorText={errors.socialCapital}
                                value={participant.socialCapital || ''}
                                onChange={event =>
                                    updateState({
                                        socialCapital: +event.target.value
                                    })
                                }
                            />
                        </GridItem>
                    </Grid>
                </Paper>

                <SectionTitle color={primary} text={translate.partner_file} style={{ marginTop: '2.8em' }} />
                <Paper elevation={0}>
                    <Grid>
                        <GridItem xs={6} md={4} lg={4}>
                            <TextInput
                                id={'anadirSocioActaAlta'}
                                floatingText={translate.subscribe_act_number}
                                type="text"
                                errorText={errors.subscribeActNumber}
                                value={participant.subscribeActNumber}
                                onChange={event =>
                                    updateState({
                                        subscribeActNumber: this.onParse(event.nativeEvent.target.value) 
                                    })
                                }
                            />
                        </GridItem>
                        <GridItem xs={6} md={4} lg={4}>
                            <TextInput
                                id={'anadirSocioActaBaja'}
                                floatingText={translate.unsubscribe_act_number}
                                type="text"
                                errorText={errors.unsubscribeActNumber}
                                value={participant.unsubscribeActNumber}
                                onChange={event =>
                                    updateState({
                                        unsubscribeActNumber: this.onParse(event.nativeEvent.target.value) 
                                    })
                                }
                            />
                        </GridItem>
                        <GridItem xs={12} md={4} lg={4}>
                            <DateTimePicker
                                idIcon={'anadirSocioAperturaFicha'}
                                required
                                onlyDate
                                onChange={date => {
                                    const newDate = new Date(date);
                                    const dateString = newDate.toISOString();
                                    updateState({
                                        openDate: date ? dateString : date
                                    });
                                }}
                                minDateMessage={""}
                                errorText={errors.openDate}
                                acceptText={translate.accept}
                                cancelText={translate.cancel}
                                label={translate.open_date}
                                value={participant.openDate}
                            />
                        </GridItem>
                        <GridItem xs={12} md={4} lg={4}>
                            <DateTimePicker
                                idIcon={'anadirSocioFechaAlta'}
                                required
                                onlyDate
                                onChange={date => {
                                    const newDate = new Date(date);
                                    const dateString = newDate.toISOString();
                                    updateState({
                                        subscribeDate: date ? dateString : date
                                    });
                                }}
                                minDateMessage={""}
                                errorText={errors.subscribeDate}
                                acceptText={translate.accept}
                                cancelText={translate.cancel}
                                label={translate.subscribe_date}
                                value={participant.subscribeDate}
                            />
                        </GridItem>
                        <GridItem xs={12} md={4} lg={4}>
                            <DateTimePicker
                                idIcon={'anadirSocioFechaActaAlta2'}
                                required
                                onlyDate
                                onChange={date => {
                                    const newDate = new Date(date);
                                    const dateString = newDate.toISOString();
                                    updateState({
                                        subscribeActDate: date ? dateString : date
                                    });
                                }}
                                minDateMessage={""}
                                errorText={errors.subscribeActDate}
                                acceptText={translate.accept}
                                cancelText={translate.cancel}
                                label={translate.subscribe_act_date}
                                value={participant.subscribeActDate}
                            />
                        </GridItem>
                        <GridItem xs={12} md={4} lg={4}>
                            <DateTimePicker
                                idIcon={'anadirSocioFechaActaBaja'}
                                required
                                onlyDate
                                onChange={date => {
                                    const newDate = new Date(date);
                                    const dateString = newDate.toISOString();
                                    updateState({
                                        unsubscribeDate: date ? dateString : date
                                    });
                                }}
                                minDateMessage={""}
                                errorText={errors.unsubscribeDate}
                                acceptText={translate.accept}
                                cancelText={translate.cancel}
                                label={translate.unsubscribe_date}
                                value={participant.unsubscribeDate}
                            />
                        </GridItem>
                        <GridItem xs={12} md={4} lg={4}>
                            <DateTimePicker
                                idIcon={'anadirSocioFechaActaBaja2'}
                                required
                                onlyDate
                                onChange={date => {
                                    const newDate = new Date(date);
                                    const dateString = newDate.toISOString();
                                    updateState({
                                        unsubscribeActDate: date ? dateString : date
                                    });
                                }}
                                minDateMessage={""}
                                errorText={errors.unsubscribeActDate}
                                acceptText={translate.accept}
                                cancelText={translate.cancel}
                                label={translate.unsubscribe_act_date}
                                value={participant.unsubscribeActDate}
                            />
                        </GridItem>
                    </Grid>
                </Paper>

                <SectionTitle color={primary} text={translate.additional_data} style={{ marginTop: '2.8em' }} />
                <Paper elevation={0}>
                    <Grid>
                        <GridItem xs={6} md={6} lg={5}>
                            <TextInput
                                id={'anadirSocioDireccion'}
                                floatingText={translate.address}
                                type="text"
                                errorText={errors.address}
                                value={participant.address || ''}
                                onChange={event =>
                                    updateState({
                                        address: this.onParse(event.nativeEvent.target.value) 
                                    })
                                }
                            />
                        </GridItem>
                        <GridItem xs={6} md={6} lg={3}>
                            <TextInput
                                id={'anadirSocioLocalidad'}
                                floatingText={translate.company_new_locality}
                                type="text"
                                errorText={errors.city}
                                value={participant.city || ''}
                                onChange={event =>
                                    updateState({
                                        city: this.onParse(event.nativeEvent.target.value) 
                                    })
                                }
                            />
                        </GridItem>
                        <GridItem xs={6} md={4} lg={2}>
                            <TextInput
                                floatingText={translate.company_new_country}
                                type="text"
                                value={participant.country || ''}
                                errorText={errors.country !== "España" && errors.country }
                                onChange={event =>
                                    updateState({
                                        country: this.onParse(event.nativeEvent.target.value) 
                                    })
                                }
                            />
                        </GridItem>
                        <GridItem xs={6} md={4} lg={2}>
                            <TextInput
                                id={'anadirSocioProvincia'}
                                floatingText={translate.company_new_country_state}
                                type="text"
                                errorText={errors.countryState}
                                value={participant.countryState || ''}
                                onChange={event =>
                                    updateState({
                                        countryState: this.onParse(event.nativeEvent.target.value) 
                                    })
                                }
                            />
                        </GridItem>
                        <GridItem xs={6} md={6} lg={3}>
                            <TextInput
                                id={'anadirSocioCP'}
                                floatingText={translate.company_new_zipcode || ''}
                                type="text"
                                errorText={errors.zipcode}
                                value={participant.zipcode}
                                onChange={event =>
                                    updateState({
                                        zipcode: this.onParse(event.nativeEvent.target.value) 
                                    })
                                }
                            />
                        </GridItem>
                        <GridItem xs={6} md={4} lg={2}>
                            <SelectInput
                                floatingText={translate.language}
                                value={participant.language ? participant.language : '-1'}
                                onChange={event =>
                                    updateState({
                                        language: event.target.value
                                    })
                                }
                            >
                                {!this.props.data.loading && (
                                    this.props.data.languages.map(language =>
                                        <MenuItem value={language.columnName} key={`language_${language.deno}`}>
                                            {language.desc}
                                        </MenuItem>
                                    )
                                )}
                            </SelectInput>
                        </GridItem>
                        <GridItem xs={12} md={12} lg={12}>
                            <RichTextInput
                                floatingText={translate.observations}
                                translate={translate}
                                value={participant.observations || ''}
                                onChange={value =>
                                    updateState({
                                        observations: value
                                    })
                                }
                            />
                        </GridItem>
                    </Grid>




                    {participant.personOrEntity === 1 &&
                        <React.Fragment>
                            <SectionTitle color={primary} text={translate.representative} style={{ marginTop: '2.8em' }} />
                            <SectionTitle color={primary} text={translate.personal_data} style={{ marginTop: '1.2em' }} />
                            <Paper elevation={0}>
                                <Grid>
                                    <GridItem xs={6} md={4} lg={3}>
                                        <TextInput
                                            id={'anadirSocioRepresentanteNombre'}
                                            floatingText={translate.name}
                                            type="text"
                                            value={representative.name || ''}
                                            onChange={event =>
                                                updateRepresentative({
                                                    name: this.onParse(event.nativeEvent.target.value) 
                                                })
                                            }
                                        />
                                    </GridItem>
                                    <GridItem xs={6} md={4} lg={3}>
                                        <TextInput
                                            id={'anadirSocioRepresentanteApellido'}
                                            floatingText={translate.surname || ''}
                                            type="text"
                                            value={representative.surname || ''}
                                            onChange={event =>
                                                updateRepresentative({
                                                    surname: this.onParse(event.nativeEvent.target.value) 
                                                })
                                            }
                                        />
                                    </GridItem>
                                    <GridItem xs={6} md={4} lg={3}>
                                        <TextInput
                                            id={'anadirSocioRepresentanteDNI'}
                                            floatingText={translate.dni}
                                            type="text"
                                            value={representative.dni || ''}
                                            onChange={event =>
                                                updateRepresentative({
                                                    dni: this.onParse(event.nativeEvent.target.value) 
                                                })
                                            }
                                        />
                                    </GridItem>
                                    <GridItem xs={6} md={4} lg={3}>
                                        <TextInput
                                            id={'anadirSocioRepresentanteNacionalidad'}
                                            floatingText={translate.nationality}
                                            type="text"
                                            value={representative.nationality || ''}
                                            onChange={event =>
                                                updateRepresentative({
                                                    nationality: this.onParse(event.nativeEvent.target.value) 
                                                })
                                            }
                                        />
                                    </GridItem>
                                    <GridItem xs={6} md={4} lg={3}>
                                        <TextInput
                                            id={'anadirSocioRepresentanteEmail'}
                                            floatingText={translate.email}
                                            {...(checkEmail ? { onKeyUp: (event) => checkEmail(event, 'representative') } : {})}
                                            type="text"
                                            value={representative.email || ''}
                                            onChange={event =>
                                                updateRepresentative({
                                                    email: this.onParse(event.nativeEvent.target.value) 
                                                })
                                            }
                                        />
                                    </GridItem>
                                    <GridItem xs={6} md={4} lg={3}>
                                        <TextInput
                                            id={'anadirSocioRepresentanteTelefono'}
                                            floatingText={translate.phone}
                                            type="text"
                                            value={representative.phone || ''}
                                            onChange={event =>
                                                updateRepresentative({
                                                    phone: this.onParse(event.nativeEvent.target.value) 
                                                })
                                            }
                                        />
                                    </GridItem>
                                    <GridItem xs={6} md={4} lg={3}>
                                        <TextInput
                                            id={'anadirSocioRepresentanteTelefonoFijo'}
                                            floatingText={translate.landline_phone}
                                            type="text"
                                            value={representative.landlinePhone || ''}
                                            onChange={event =>
                                                updateRepresentative({
                                                    landlinePhone: this.onParse(event.nativeEvent.target.value) 
                                                })
                                            }
                                        />
                                    </GridItem>
                                    <GridItem xs={6} md={4} lg={3}>
                                        <TextInput
                                            id={'anadirSocioRepresentanteCargo'}
                                            floatingText={translate.position}
                                            type="text"
                                            value={representative.position || ''}
                                            onChange={event =>
                                                updateRepresentative({
                                                    position: this.onParse(event.nativeEvent.target.value) 
                                                })
                                            }
                                        />
                                    </GridItem>
                                </Grid>
                            </Paper>
                            <SectionTitle color={primary} text={translate.additional_data} style={{ marginTop: '2.8em' }} />
                            <Paper elevation={0}>
                                <Grid>
                                    <GridItem xs={6} md={6} lg={5}>
                                        <TextInput
                                            id={'anadirSocioRepresentanteDireccion'}
                                            floatingText={translate.address}
                                            type="text"
                                            value={representative.address || ''}
                                            onChange={event =>
                                                updateRepresentative({
                                                    address: this.onParse(event.nativeEvent.target.value) 
                                                })
                                            }
                                        />
                                    </GridItem>
                                    <GridItem xs={6} md={6} lg={3}>
                                        <TextInput
                                            id={'anadirSocioRepresentanteLocalidad'}
                                            floatingText={translate.company_new_locality}
                                            type="text"
                                            value={representative.city || ''}
                                            onChange={event =>
                                                updateRepresentative({
                                                    city: this.onParse(event.nativeEvent.target.value) 
                                                })
                                            }
                                        />
                                    </GridItem>
                                    <GridItem xs={6} md={4} lg={2}>
                                        <TextInput
                                            floatingText={translate.company_new_country}
                                            type="text"
                                            value={representative.country || ''}
                                            onChange={event =>
                                                updateRepresentative({
                                                    country: this.onParse(event.nativeEvent.target.value) 
                                                })
                                            }
                                        />
                                    </GridItem>
                                    <GridItem xs={6} md={4} lg={2}>
                                        <TextInput
                                            id={'anadirSocioRepresentanteProvincia'}
                                            floatingText={translate.company_new_country_state}
                                            type="text"
                                            value={representative.countryState || ''}
                                            onChange={event =>
                                                updateRepresentative({
                                                    countryState: this.onParse(event.nativeEvent.target.value) 
                                                })
                                            }
                                        />
                                    </GridItem>
                                    <GridItem xs={6} md={6} lg={3}>
                                        <TextInput
                                            id={'anadirSocioRepresentanteCP'}
                                            floatingText={translate.company_new_zipcode}
                                            type="text"
                                            value={representative.zipcode || ''}
                                            onChange={event =>
                                                updateRepresentative({
                                                    zipcode: this.onParse(event.nativeEvent.target.value) 
                                                })
                                            }
                                        />
                                    </GridItem>
                                    <GridItem xs={6} md={4} lg={2}>
                                        <SelectInput
                                            floatingText={translate.language}
                                            value={representative.language ? representative.language : '-1'}
                                            onChange={event =>
                                                updateRepresentative({
                                                    language: event.target.value
                                                })
                                            }
                                        >
                                            {!this.props.data.loading && (
                                                this.props.data.languages.map(language =>
                                                    <MenuItem value={language.columnName} key={`language_${language.deno}`}>
                                                        {language.desc}
                                                    </MenuItem>
                                                )
                                            )}
                                        </SelectInput>
                                    </GridItem>
                                    <GridItem xs={12} md={12} lg={12}>
                                        <RichTextInput
                                            floatingText={translate.observations}
                                            translate={translate}
                                            value={representative.observations || ''}
                                            onChange={value =>
                                                updateRepresentative({
                                                    observations: value
                                                })
                                            }
                                        />
                                    </GridItem>
                                </Grid>
                            </Paper>
                        </React.Fragment>
                    }
                </Paper>
            </React.Fragment>
        )
    }
}

const query = gql`
    query ParticipantFields {
        countries {
            deno
            id
        }
        languages {
			desc
			columnName
		}
    }
`;

export default graphql(query)(withApollo(PartnerForm));