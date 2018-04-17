import React, { Component } from 'react';
import CouncilboxApi from '../../../api/CouncilboxApi';
import {
    BasicButton, ButtonIcon, Checkbox, Grid, GridItem, LoadingSection, SelectInput, TextInput
} from '../../displayComponents';
import { getPrimary, secondary } from '../../../styles/colors';
import { MenuItem } from 'material-ui/Menu';
import { graphql, withApollo } from 'react-apollo';
import { countries, provinces } from '../../../queries';

class SignUpPay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            provinces: [],
            subscriptions: [],
            termsCheck: false,
            termsAlert: false,
        }
    }

    componentDidMount = async () => {
        const subscriptions = await CouncilboxApi.getSubscriptions();
        this.setState({
            subscriptions: subscriptions
        });
    };

    componentWillReceiveProps = async (nextProps) => {
        if (!this.props.data.loading) {
            const data = nextProps.formData;
            const selectedCountry = this.props.data.countries.find((country) => country.deno === data.country);

            const response = await this.props.client.query({
                query: provinces,
                variables: {
                    countryId: selectedCountry.id
                },
            });

            if (response) {
                this.setState({
                    provinces: response.data.provinces
                })
            }
        }
    };

    previousPage = () => {
        this.props.previousPage();
    };

    endForm = async () => {
        if (!this.checkRequiredFields()) {
            //this.props.sendNewCompany(this.props.company);
            const response = await CouncilboxApi.createCompany(this.props.formData);
            console.log(response);
        }
    };

    checkRequiredFields() {
        // return false;
        let errors = {
            address: '',
            city: '',
            country: '',
            zipCode: '',
            region: '',
            subscription: '',
            IBAN: '',
            termsCheck: '',
        };
        let hasError = false;
        const data = this.props.formData;

        // if (!data.address.length > 0) {
        //     hasError = true;
        //     errors.address = 'Este campo es obligatorio';
        // }
        //
        // if (!data.city.length > 0) {
        //     hasError = true;
        //     errors.city = 'Este campo es obligatorio';
        // }
        //
        // if (data.type === '') {
        //     hasError = true;
        //     errors.country = 'Este campo es obligatorio';
        // }
        //
        // if (!data.zipCode.length > 0) {
        //     hasError = true;
        //     errors.zipCode = 'Este campo es obligatorio';
        // }
        //
        // if (data.type === '') {
        //     hasError = true;
        //     errors.province = 'Este campo es obligatorio';
        // }
        //
        // if (!data.subscription.length > 0) {
        //     hasError = true;
        //     errors.subscription = 'Este campo es obligatorio';
        // }
        //
        // if (!data.IBAN.length > 0) {
        //     hasError = true;
        //     errors.IBAN = 'Este campo es obligatorio';
        // }

        if (!data.termsCheck) {
            hasError = true;
            errors.termsCheck = 'Tienes que aceptar los términos';
        }

        this.props.updateErrors(errors);

        return hasError;
    }

    handleCountryChange = async (event) => {
        this.props.updateState({
            country: event.target.value
        })
    };

    handleProvinceChange = (event, index) => {
        this.setState({
            ...this.state,
            data: {
                ...this.state.data,
                province: this.state.provinces[ index ].id
            }
        })
    };

    handleSubscriptionChange = (event, index) => {
        this.setState({
            ...this.state,
            data: {
                ...this.state.data,
                subscription: this.state.subscriptions[ index ]
            }
        })
    };

    closeAlert = () => {
        this.setState({
            ...this.state,
            errors: {
                ...this.state.errors,
                termsCheck: ''
            }
        })
    };

    render() {
        if (this.props.data.loading) {
            return <LoadingSection/>;
        }

        const { translate, errors } = this.props;
        const data = this.props.formData;
        const primary = getPrimary();

        return (<div style={{
            width: '100%',
            padding: '6%'
        }}>
            <div style={{
                fontSize: '1.3em',
                fontWeight: '700',
                color: primary
            }}>
                {translate.billing_information}
            </div>
            <Grid style={{ marginTop: '2em' }}>
                <GridItem xs={12} md={6} lg={6}>
                    <TextInput
                        floatingText={translate.address}
                        type="text"
                        value={data.address}
                        errorText={this.props.errors.address}
                        onChange={(event) => this.props.updateState({
                            address: event.target.value
                        })}
                    />
                </GridItem>
                <GridItem xs={12} md={6} lg={6}>
                    <TextInput
                        floatingText={translate.company_new_locality}
                        type="text"
                        value={data.city}
                        onChange={(event) => this.props.updateState({
                            city: event.target.value
                        })}
                        errorText={this.props.errors.city}
                    />
                </GridItem>
                <GridItem xs={12} md={6} lg={6}>
                    <SelectInput
                        floatingText={translate.country}
                        value={data.country}
                        onChange={this.handleCountryChange}
                        errorText={errors.country}>
                        {this.props.data.countries.map((country) => {
                            return <MenuItem key={country.deno} value={country.deno}>{country.deno}</MenuItem>
                        })}
                    </SelectInput>
                </GridItem>
                <GridItem xs={12} md={6} lg={6}>
                    <SelectInput
                        floatingText={translate.company_new_country_state}
                        value={data.countryState}
                        errorText={errors.countryState}
                        onChange={(event) => this.props.updateState({ countryState: event.target.value })}>
                        {this.state.provinces.map((province) => {
                            return <MenuItem key={province.deno} value={province.id}>{province.deno}</MenuItem>
                        })}
                    </SelectInput>
                </GridItem>
                <GridItem xs={12} md={6} lg={6}>
                    <TextInput
                        floatingText={translate.company_new_zipcode}
                        type="text"
                        value={data.zipcode}
                        onChange={(event) => this.props.updateState({
                            zipcode: event.target.value
                        })}
                        errorText={this.props.errors.zipcode}/>
                </GridItem>
                <GridItem xs={12} md={6} lg={6}>
                    <TextInput
                        floatingText={translate.type_of_subscription}
                        type="text"
                        value={this.state.subscriptionType}
                        onChange={(event) => this.setState({
                            subscriptionType: event.target.value
                        })}
                        errorText={this.props.errors.subscriptionType}/>
                </GridItem>
                <GridItem xs={12} md={6} lg={6}>
                    <TextInput
                        floatingText="Código"
                        type="text"
                        value={this.state.code}
                        onChange={(event) => this.setState({
                            code: event.target.value
                        })}
                        errorText={this.props.errors.code}/>
                </GridItem>
                <GridItem xs={12} md={6} lg={6}>
                    <TextInput
                        floatingText="IBAN"
                        type="text"
                        value={this.state.IBAN}
                        onChange={(event) => this.setState({
                            IBAN: event.target.value
                        })}
                        errorText={this.props.errors.IBAN}
                    />
                </GridItem>
                <GridItem xs={12} md={12} lg={12}>
                    <Checkbox
                        label="He leido y acepto los términos y condiciones de CouncilBox"
                        value={this.state.termsCheck}
                        onChange={(event, isInputChecked) => this.setState({
                            termsCheck: isInputChecked
                        })}
                    />
                </GridItem>
            </Grid>
            <Grid>
                <GridItem xs={12} md={6} lg={6}>
                    <BasicButton
                        text={translate.back}
                        color={secondary}
                        textStyle={{
                            color: 'white',
                            fontWeight: '700'
                        }}
                        onClick={this.previousPage}
                        fullWidth
                        icon={<ButtonIcon color='white' type="arrow_back"/>}/>
                </GridItem>
                <GridItem xs={12} md={6} lg={6}>
                    <BasicButton
                        text={translate.continue}
                        color={primary}
                        textStyle={{
                            color: 'white',
                            fontWeight: '700'
                        }}
                        onClick={this.endForm}
                        fullWidth
                        icon={<ButtonIcon color='white' type="arrow_forward"/>}/>
                </GridItem>
            </Grid>
        </div>);
    }
}

export default graphql(countries)(withApollo(SignUpPay));