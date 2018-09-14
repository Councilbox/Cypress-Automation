import React from 'react';
import { SelectInput, TextInput, Grid, GridItem, Radio, DateTimePicker, SectionTitle } from '../../displayComponents';
import RichTextInput from '../../displayComponents/RichTextInput';
import { MenuItem, Paper } from 'material-ui';
import { provinces } from '../../queries/masters';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { getPrimary } from '../../styles/colors';

class PartnerForm extends React.PureComponent {

    state = {
        provinces: []
    }

    setProvinces = async () => {
        const response = await this.props.client.query({
            query: provinces,
            variables: {
                countryId: this.props.data.countries.find(country => country.deno === this.props.participant.country).id
            }
        });
        this.setState({
            provinces: response.data.provinces
        });
    }

    async componentDidUpdate(prevProps, prevState) {
        if (!this.props.data.loading) {
            if ((prevProps.participant.country !== this.props.participant.country) || this.state.provinces.length === 0) {
                this.setProvinces();
            }
        }
    }

    render() {
        const { participant, translate, updateState, errors, checkEmail } = this.props;
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

                <SectionTitle color={primary} text={'Datos personales'} /*TRADUCCION*/ style={{ marginTop: '1.2em' }} />
                <Paper elevation={0}>
                    <Grid>
                        {participant.personOrEntity ? (
                            <GridItem xs={6} md={8} lg={6}>
                                <TextInput
                                    floatingText={translate.entity_name}
                                    type="text"
                                    errorText={errors.name}
                                    value={participant.name}
                                    onChange={event =>
                                        updateState({
                                            name: event.nativeEvent.target.value
                                        })
                                    }
                                />
                            </GridItem>
                        ) : (
                                <React.Fragment>
                                    <GridItem xs={6} md={4} lg={3}>
                                        <TextInput
                                            floatingText={translate.name}
                                            type="text"
                                            errorText={errors.name}
                                            value={participant.name}
                                            onChange={event =>
                                                updateState({
                                                    name: event.nativeEvent.target.value
                                                })
                                            }
                                        />
                                    </GridItem>
                                    <GridItem xs={6} md={4} lg={3}>
                                        <TextInput
                                            floatingText={translate.surname}
                                            type="text"
                                            errorText={errors.surname}
                                            value={participant.surname}
                                            onChange={event =>
                                                updateState({
                                                    surname: event.nativeEvent.target.value
                                                })
                                            }
                                        />
                                    </GridItem>
                                </React.Fragment>
                            )}
                        <GridItem xs={6} md={4} lg={3}>
                            <TextInput
                                floatingText={participant.personOrEntity === 1 ? translate.cif : translate.dni}
                                type="text"
                                errorText={errors.dni}
                                value={participant.dni}
                                onChange={event =>
                                    updateState({
                                        dni: event.nativeEvent.target.value
                                    })
                                }
                            />
                        </GridItem>
                        <GridItem xs={6} md={4} lg={3}>
                            <TextInput
                                floatingText={translate.nationality}
                                type="text"
                                errorText={errors.nationality}
                                value={participant.nationality}
                                onChange={event =>
                                    updateState({
                                        nationality: event.nativeEvent.target.value
                                    })
                                }
                            />
                        </GridItem>
                        <GridItem xs={6} md={4} lg={3}>
                            <TextInput
                                floatingText={translate.email}
                                {...(checkEmail ? { onKeyUp: (event) => checkEmail(event, 'participant') } : {})}
                                type="text"
                                errorText={errors.email}
                                value={participant.email}
                                onChange={event =>
                                    updateState({
                                        email: event.nativeEvent.target.value
                                    })
                                }
                            />
                        </GridItem>
                        <GridItem xs={6} md={4} lg={3}>
                            <TextInput
                                floatingText={translate.phone}
                                type="text"
                                errorText={errors.phone}
                                value={participant.phone}
                                onChange={event =>
                                    updateState({
                                        phone: event.nativeEvent.target.value
                                    })
                                }
                            />
                        </GridItem>
                        <GridItem xs={6} md={4} lg={3}>
                            <TextInput
                                floatingText={translate.landline_phone}
                                type="text"
                                errorText={errors.landlinePhone}
                                value={participant.landlinePhone}
                                onChange={event =>
                                    updateState({
                                        landlinePhone: event.nativeEvent.target.value
                                    })
                                }
                            />
                        </GridItem>
                        <GridItem xs={6} md={4} lg={3}>
                            <TextInput
                                floatingText={translate.position}
                                type="text"
                                errorText={errors.position}
                                value={participant.position}
                                onChange={event =>
                                    updateState({
                                        position: event.nativeEvent.target.value
                                    })
                                }
                            />
                        </GridItem>
                        <GridItem xs={6} md={4} lg={2}>
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
                                    value={2}
                                >
                                    {translate.other}
                                </MenuItem>
                            </SelectInput>
                        </GridItem>
                    </Grid>
                </Paper>

                <SectionTitle color={primary} text={'Ficha'} /*TRADUCCION*/ style={{ marginTop: '2.8em' }} />
                <Paper elevation={0}>
                    <Grid>
                        <GridItem xs={6} md={4} lg={4}>
                            <TextInput
                                floatingText={translate.subscribe_act_number}
                                type="text"
                                errorText={errors.subscribeActNumber}
                                value={participant.subscribeActNumber}
                                onChange={event =>
                                    updateState({
                                        subscribeActNumber: event.nativeEvent.target.value
                                    })
                                }
                            />
                        </GridItem>
                        <GridItem xs={6} md={4} lg={4}>
                            <TextInput
                                floatingText={translate.unsubscribe_act_number}
                                type="text"
                                errorText={errors.unsubscribeActNumber}
                                value={participant.unsubscribeActNumber}
                                onChange={event =>
                                    updateState({
                                        unsubscribeActNumber: event.nativeEvent.target.value
                                    })
                                }
                            />
                        </GridItem>
                        <GridItem xs={12} md={4} lg={4}>
                            <DateTimePicker
                                required
                                onChange={date => {
                                    const newDate = new Date(date);
                                    const dateString = newDate.toISOString();
                                    updateState({
                                        openDate: dateString
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
                                required
                                onChange={date => {
                                    const newDate = new Date(date);
                                    const dateString = newDate.toISOString();
                                    updateState({
                                        subscribeDate: dateString
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
                                required
                                onChange={date => {
                                    const newDate = new Date(date);
                                    const dateString = newDate.toISOString();
                                    updateState({
                                        subscribeActDate: dateString
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
                                required
                                onChange={date => {
                                    const newDate = new Date(date);
                                    const dateString = newDate.toISOString();
                                    updateState({
                                        unsubscribeDate: dateString
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
                                required
                                onChange={date => {
                                    const newDate = new Date(date);
                                    const dateString = newDate.toISOString();
                                    updateState({
                                        unsubscribeActDate: dateString
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

                <SectionTitle color={primary} text={'Datos adicionales'} /*TRADUCCION*/ style={{ marginTop: '2.8em' }} />
                <Paper elevation={0}>
                    <Grid>
                        <GridItem xs={6} md={6} lg={5}>
                            <TextInput
                                floatingText={translate.address}
                                type="text"
                                errorText={errors.address}
                                value={participant.address}
                                onChange={event =>
                                    updateState({
                                        address: event.nativeEvent.target.value
                                    })
                                }
                            />
                        </GridItem>
                        <GridItem xs={6} md={6} lg={3}>
                            <TextInput
                                floatingText={translate.company_new_locality}
                                type="text"
                                errorText={errors.city}
                                value={participant.city}
                                onChange={event =>
                                    updateState({
                                        city: event.nativeEvent.target.value
                                    })
                                }
                            />
                        </GridItem>
                        <GridItem xs={6} md={4} lg={2}>
                            <SelectInput
                                floatingText={translate.company_new_country}
                                value={participant.country}
                                onChange={event =>
                                    updateState({
                                        country: event.target.value
                                    })
                                }
                            >
                                {!this.props.data.loading && (
                                    this.props.data.countries.map(country =>
                                        <MenuItem value={country.deno} key={`country_${country.deno}`}>
                                            {country.deno}
                                        </MenuItem>
                                    )
                                )}
                            </SelectInput>
                        </GridItem>
                        <GridItem xs={6} md={4} lg={2}>
                            <SelectInput
                                floatingText={translate.company_new_country_state}
                                value={participant.countryState}
                                onChange={event =>
                                    updateState({
                                        countryState: event.target.value
                                    })
                                }
                            >
                                {this.state.provinces.length > 0 && (
                                    this.state.provinces.map(province =>
                                        <MenuItem value={province.deno} key={`province_${province.deno}`}>
                                            {province.deno}
                                        </MenuItem>
                                    )
                                )}
                            </SelectInput>
                        </GridItem>
                        <GridItem xs={6} md={6} lg={3}>
                            <TextInput
                                floatingText={translate.company_new_zipcode}
                                type="text"
                                errorText={errors.zipcode}
                                value={participant.zipcode}
                                onChange={event =>
                                    updateState({
                                        zipcode: event.nativeEvent.target.value
                                    })
                                }
                            />
                        </GridItem>
                        <GridItem xs={6} md={4} lg={2}>
                            <SelectInput
                                floatingText={translate.language}
                                value={participant.language}
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
                                value={participant.observations}
                                onChange={value =>
                                    updateState({
                                        observations: value
                                    })
                                }
                            />
                        </GridItem>
                    </Grid>
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