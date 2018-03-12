import React, { Component } from 'react';
import { Grid, Row, Col } from "react-bootstrap";
import CouncilboxApi from '../../api/CouncilboxApi';
import { SelectInput, BasicButton, TextInput, Checkbox, Icon } from '../displayComponents';
import { getPrimary } from '../../styles/colors';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import gql from 'graphql-tag';
import { graphql, withApollo } from 'react-apollo';
import { countriesQuery } from '../../queries';

class SignUpPay extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: {
                address: this.props.company.address || '',
                city: this.props.company.city || '',
                country: this.props.company.country || '',
                zipCode: this.props.company.zipCode || '',
                province: this.props.company.province || '',
                subscription: this.props.company.subscription || '',
                IBAN: this.props.company.IBAN || ''
            },
            countries: [],
            provinces: [],
            subscriptions: [],
            termsCheck: false,
            termsAlert: false,
            errors: {
                address: '',
                city: '',
                country: '',
                zipCode: '',
                region: '',
                subscription: '',
                IBAN: '',
                termsCheck: '',
            }
        }
    }

    componentDidMount = async () => {
        const subscriptions = await CouncilboxApi.getSubscriptions();
        if(this.props.data.countries){
            let provinces = [];
            if(this.props.company.country){
                const response = await this.props.client.query({
                    query: gql`query ProvinceList($countryID: ID!) {
                        provinces(countryID: $countryID){
                            deno
                            id
                        }
                    }`,
                    variables: {
                        countryID: this.props.company.country
                    },
                });
                provinces = response.data.provinces;
                
            }
            this.setState({
                provinces: provinces,
                countries: this.props.data.countries,
                subscriptions: subscriptions
            });
        }

    }

    componentWillReceiveProps(nextProps){
        if(this.props.data.loading && !nextProps.data.loading){
            this.setState({
                countries: nextProps.data.countries
            })
        }
    }

    endForm = () => {
        this.props.saveInfo(this.state.data);
        if(!this.checkRequiredFields()){
            //this.props.sendNewCompany(this.props.company);
            //CouncilboxApi.createCompany(this.props.company);
        }
    }

    checkRequiredFields(){
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

        if(!this.state.data.address.length > 0){
            hasError = true;
            errors.address = 'Este campo es obligatorio';
        }
        
        if(!this.state.data.city.length > 0){
            hasError = true;
            errors.city = 'Este campo es obligatorio';
        }

        if(this.state.data.type === ''){
            hasError = true;
            errors.country = 'Este campo es obligatorio';
        }

        if(!this.state.data.zipCode.length > 0){
            hasError = true;
            errors.zipCode = 'Este campo es obligatorio';
        }

        if(this.state.data.type === ''){
            hasError = true;
            errors.province = 'Este campo es obligatorio';
        }

        if(!this.state.data.subscription.length > 0){
            hasError = true;
            errors.subscription = 'Este campo es obligatorio';
        }

        if(!this.state.data.IBAN.length > 0){
            hasError = true;
            errors.IBAN = 'Este campo es obligatorio';
        }

        if(!this.state.data.termsCheck){
            hasError = true;
            errors.termsCheck = 'Tienes que aceptar los términos';
        }

        this.setState({
            ...this.state,
            errors: errors
        });
        
        return hasError;
    }

    handleCountryChange = async (event, index) => {
        this.setState({
            ...this.state,
            data: {
                ...this.state.data,
                country: this.state.countries[index].id
            }
        })
        const response = await this.props.client.query({
            query: gql`query ProvinceList($countryID: ID!) {
                provinces(countryID: $countryID){
                    deno
                    id
                }
            }`,
            variables: {
                countryID: this.state.countries[index].id
            },
        });
        
        this.setState({
            provinces: response.data.provinces
        });
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
            return <p>Loading...</p>;
        }

        const { translate } = this.props;
        const primary = getPrimary();
        
        return(
            <div>
                Facturación
                <Grid>
                    <Row style={{width: '75%'}}>
                        <Col xs={12} md={6}>
                            <TextInput
                                floatingText={translate.address}
                                type="text"
                                errorText={this.state.errors.address}
                                value={this.state.data.address}
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
                <Dialog
                    actions={<BasicButton 
                        text={translate.accept}
                        color={primary}
                        textStyle={{color: 'white', fontWeight: '700'}}
                        onClick={this.closeAlert} 
                    />}
                    modal={false}
                    open={!!this.state.errors.termsCheck}
                    onRequestClose={this.closeAlert}
                    contentStyle={{width: '35%'}}
                    >
                    {translate.acept_terms}
                </Dialog>
            </div>
        ); 
    }

}


export default graphql(countriesQuery)(withApollo(SignUpPay));