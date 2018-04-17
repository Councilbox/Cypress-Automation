import React, { Component } from 'react';
import CouncilboxApi from '../../api/CouncilboxApi';
import { SelectInput, BasicButton, ButtonIcon, TextInput, LoadingSection } from '../displayComponents';
import { getPrimary } from '../../styles/colors';
import { MenuItem } from 'material-ui/Menu';
import Dialog from 'material-ui/Dialog';
import { graphql, withApollo } from 'react-apollo';
import { countries, provinces } from '../../queries';

class SignUpPay extends Component {
    constructor(props){
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
    }

    componentWillReceiveProps = async (nextProps) => {
        if(!this.props.data.loading){
            const data = nextProps.formData;
            const selectedCountry = this.props.data.countries.find((country) => country.deno === data.country);        

            const response = await this.props.client.query({
                query: provinces,
                variables: {
                    countryId: selectedCountry.id
                },
            });

            if(response){
                this.setState({
                    provinces: response.data.provinces
                })
            }
        }
    }

    endForm = async () => {
        if(!this.checkRequiredFields()){
            //this.props.sendNewCompany(this.props.company);
            const response = await CouncilboxApi.createCompany(this.props.formData);
            console.log(response);
        }
    }

    checkRequiredFields(){
        return false;
        /*let errors = {
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

        if(!data.address.length > 0){
            hasError = true;
            errors.address = 'Este campo es obligatorio';
        }
        
        if(!data.city.length > 0){
            hasError = true;
            errors.city = 'Este campo es obligatorio';
        }

        if(data.type === ''){
            hasError = true;
            errors.country = 'Este campo es obligatorio';
        }

        if(!data.zipCode.length > 0){
            hasError = true;
            errors.zipCode = 'Este campo es obligatorio';
        }

        if(data.type === ''){
            hasError = true;
            errors.province = 'Este campo es obligatorio';
        }

        if(!data.subscription.length > 0){
            hasError = true;
            errors.subscription = 'Este campo es obligatorio';
        }

        if(!data.IBAN.length > 0){
            hasError = true;
            errors.IBAN = 'Este campo es obligatorio';
        }

        if(!data.termsCheck){
            hasError = true;
            errors.termsCheck = 'Tienes que aceptar los términos';
        }

        this.props.updateErrorse(errors);
        
        return hasError;*/
    }


    handleCountryChange = async (event) => {
        this.props.updateState({
            country: event.target.value
        })
    }

    handleProvinceChange = (event, index) => {
        this.setState({
            ...this.state,
            data: {
                ...this.state.data,
                province: this.state.provinces[index].id
            }
        })
    }

    handleSubscriptionChange = (event, index) => {
        this.setState({
            ...this.state,
            data: {
                ...this.state.data,
                subscription: this.state.subscriptions[index]
            }
        })
    }

    closeAlert = () => {
        this.setState({
            ...this.state,
            errors: {
                ...this.state.errors,
                termsCheck: ''
            }
        })
    }

    render(){
        if(this.props.data.loading){
            return <LoadingSection />;
        }

        const { translate, errors } = this.props;
        const data = this.props.formData;
        const primary = getPrimary();
        
        return(
            <div style={{width: '100%', padding: '6%'}}>
                <span style={{fontSize: '1.3em', fontWeight: '700', color: primary}}>{translate.billing_information}</span>
                <div className="row" style={{marginTop: '2em'}}>
                    <div className="col-lg-8 col-md-8 col-xs-12" style={{marginBottom: '2.2em', height: '3em', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <TextInput
                            floatingText={translate.address}
                            type="text"
                            value={data.address}
                            errorText={this.props.errors.address}
                            onChange={(event) => this.props.updateState({
                                address: event.target.value
                            })}
                        />
                    </div>
                    <div className="col-lg-4 col-md-4 col-xs-12" style={{height: '3em', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.2em'}}>
                        <TextInput
                            floatingText={translate.company_new_locality}
                            type="text"
                            value={data.city}
                            onChange={(event) => this.props.updateState({
                                city: event.target.value
                            })}
                            errorText={this.props.errors.city}
                        />
                    </div>
                    <div className="col-lg-4 col-md-4 col-xs-6" style={{height: '3em', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.2em'}}>
                        <SelectInput
                            floatingText={translate.country}
                            value={data.country}
                            onChange={this.handleCountryChange}
                            errorText={errors.country}
                        >   
                            {this.props.data.countries.map((country) => {
                                return <MenuItem key={country.deno} value={country.deno}>{country.deno}</MenuItem>
                            })}
                        </SelectInput>
                    </div>
                    <div className="col-lg-4 col-md-4 col-xs-6" style={{height: '3em', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.2em'}}>
                        <SelectInput
                            floatingText={translate.company_new_country_state}
                            value={data.countryState}
                            errorText={errors.countryState}
                            onChange={(event) => this.props.updateState({countryState: event.target.value})}
                        >   
                            {this.state.provinces.map((province) => {
                                return <MenuItem key={province.deno} value={province.id}>{province.deno}</MenuItem>
                            })
                            }
                        </SelectInput>
                    </div>
                    <div className="col-lg-4 col-md-4 col-xs-6" style={{height: '3em', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.2em'}}>
                        <TextInput
                            floatingText={translate.company_new_zipcode}
                            type="text"
                            value={data.zipcode}
                            onChange={(event) => this.props.updateState({
                                zipcode: event.target.value
                            })}
                            errorText={this.props.errors.zipcode}
                        />
                    </div>
                    <div className="col-lg-3 col-md-3 col-xs-6" style={{height: '3em', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.2em'}}>
                        <TextInput
                            floatingText={translate.type_of_subscription}
                            type="text"
                            value={this.state.subscriptionType}
                            onChange={(event) => this.setState({
                                subscriptionType: event.target.value
                            })}
                            errorText={this.props.errors.subscriptionType}
                        />
                    </div>
                    <div className="col-lg-3 col-md-3 col-xs-6" style={{height: '3em', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.2em'}}>
                        <TextInput
                            floatingText="Código"
                            type="text"
                            value={this.state.code}
                            onChange={(event) => this.setState({
                                code: event.target.value
                            })}
                            errorText={this.props.errors.code}
                        />
                    </div>
                    <div className="col-lg-6 col-md-6 col-xs-12" style={{height: '3em', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.2em'}}>
                        <TextInput
                            floatingText="IBAN"
                            type="text"
                            value={this.state.IBAN}
                            onChange={(event) => this.setState({
                                IBAN: event.target.value
                            })}
                            errorText={this.props.errors.IBAN}
                        />
                    </div>
                </div>
                <div className="col-lg-6 col-lg-offset-6 col-md-6 col-md-offset-6 col-xs-12" style={{float: 'right', marginTop: '3em'}} >
                    <BasicButton
                        text={translate.continue}
                        color={primary}
                        textStyle={{color: 'white', fontWeight: '700'}}
                        onClick={this.endForm}
                        fullWidth
                        icon={<ButtonIcon color='white' type="arrow_forward" />}
                    />
                </div>
                <Dialog
                    actions={<BasicButton 
                        text={translate.accept}
                        color={primary}
                        textStyle={{color: 'white', fontWeight: '700'}}
                        onClick={this.closeAlert} 
                    />}
                    modal={false}
                    open={!!this.props.errors.termsCheck}
                    onRequestClose={this.closeAlert}
                    contentStyle={{width: '35%'}}
                    >
                    {translate.acept_terms}
                </Dialog>
            </div>
        ); 
    }

}


export default graphql(countries)(withApollo(SignUpPay));

/*
<Grid>
                    <Row style={{width: '75%'}}>
                        <Col xs={12} md={6}>
                            <TextInput
                                floatingText={translate.address}
                                type="text"
                                errorText={errors.address}
                                value={data.address}
                                onChange={(event) => this.setState({
                                    ...this.state,
                                    data: {
                                        ...this.state.data,
                                        address: event.nativeEvent.target.value
                                    }
                                })}
                            />
                        </Col>
                        <Col xs={12} md={6}>
                            <TextInput
                                floatingText={translate.company_new_locality}
                                type="text"
                                errorText={this.state.errors.city}
                                value={this.state.data.city}
                                onChange={(event) => this.setState({
                                    ...this.state,
                                    data: {
                                        ...this.state.data,
                                        city: event.nativeEvent.target.value
                                    }
                                })}
                            />
                        </Col>
                        <Col xs={6} md={3}>
                            <SelectInput
                                floatingText={translate.country}
                                value={this.state.data.country}
                                onChange={this.handleCountryChange}
                                errorText={this.state.errors.country}
                            >   
                                {this.state.countries.map((country) => {
                                    return <MenuItem key={country.deno} value={country.id} primaryText={country.deno} />
                                })
                                }
                            </SelectInput>
                        </Col>
                        <Col xs={6} md={3}>
                            <TextInput
                                floatingText={translate.company_new_zipcode}
                                type="text"
                                errorText={this.state.errors.zipCode}
                                value={this.state.data.zipCode}
                                onChange={(event) => this.setState({
                                    ...this.state,
                                    data: {
                                        ...this.state.data,
                                        zipCode: event.nativeEvent.target.value
                                    }
                                })}
                            />
                        </Col>
                        <Col xs={12} md={6}>
                            <SelectInput
                                floatingText={translate.company_new_country_state}
                                value={this.state.data.province}
                                errorText={this.state.errors.province}
                                onChange={this.handleProvinceChange}
                            >   
                                {this.state.provinces.map((province) => {
                                    return <MenuItem key={province.deno} value={province.id} primaryText={province.deno} />
                                })
                                }
                            </SelectInput>
                        </Col>
                        <Col xs={12} md={6}>
                           <SelectInput
                                floatingText={translate.type_of_subscription}
                                value={this.state.data.subscription}
                                errorText={this.state.errors.subscription}
                                onChange={this.handleSubscriptionChange}
                            >   
                                {this.state.subscriptions.map((subscription) => {
                                    return <MenuItem key={subscription} value={subscription} primaryText={subscription} />
                                })
                                }
                            </SelectInput>
                        </Col>
                        <Col xs={12} md={6}>
                            <TextInput
                                floatingText="IBAN"
                                type="text"
                                errorText={this.state.errors.IBAN}
                                value={this.state.data.IBAN}
                                onChange={(event) => this.setState({
                                    ...this.state,
                                    data: {
                                        ...this.state.data,
                                        IBAN: event.nativeEvent.target.value
                                    }
                                })}
                            />
                        </Col>
                        <Col md={5}>
                            <Checkbox
                                label="He leido y acepto los términos y condiciones de CouncilBox"
                                value={this.state.data.termsCheck}
                                onChange={(event, isInputChecked) => this.setState({
                                    ...this.state,
                                    data: {
                                        ...this.state.data,
                                        termsCheck: isInputChecked
                                    }
                                })}
                            />
                        </Col>
                        <Col xs={12} md={4}>
                            <BasicButton
                                text={translate.send}
                                color={primary}
                                textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em'}}
                                textPosition="before"
                                onClick={this.endForm}
                                icon={<Icon className="material-icons" style={{color: 'white'}}>arrow_forward</Icon>}
                            />
                        </Col>
                    </Row>
                </Grid>
*/