import React, { Component } from 'react';
import { TextField, RaisedButton, FontIcon, Checkbox } from 'material-ui';
import { Grid, Row, Col } from "react-bootstrap";
import CouncilboxApi from '../api/CouncilboxApi';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';

class SignUpPage extends Component {
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
        const countries = await CouncilboxApi.getCountries();
        const subscriptions = await CouncilboxApi.getSubscriptions();
        let provinces = [];
        if(this.props.company.country){
            provinces = await CouncilboxApi.getProvinces(this.props.company.country);
        }
        this.setState({
            countries: countries,
            subscriptions: subscriptions,
            provinces: provinces
        });
    }

    endForm = () => {
        //this.props.saveInfo(this.state.data);
        //if(!this.checkRequiredFields()){
            this.props.sendNewCompany(this.props.company);
            //CouncilboxApi.createCompany(this.props.company);
        //}
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
        
        const provinces = await CouncilboxApi.getProvinces(this.state.countries[index].id);
        this.setState({
            provinces: provinces
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
        return(
            <div>
                Facturación
                <Grid>
                    <Row style={{width: '75%'}}>
                        <Col xs={12} md={6}>
                            <TextField
                                floatingLabelText="DIRECCIÓN"
                                floatingLabelFixed={true}
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
                            <TextField
                                floatingLabelText="LOCALIDAD"
                                floatingLabelFixed={true}
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
                            <SelectField
                                floatingLabelText="País"
                                value={this.state.data.country}
                                onChange={this.handleCountryChange}
                                errorText={this.state.errors.country}
                            >   
                                {this.state.countries.map((country) => {
                                    return <MenuItem key={country.deno} value={country.id} primaryText={country.deno} />
                                })
                                }
                            </SelectField>
                        </Col>
                        <Col xs={6} md={3}>
                            <TextField
                                floatingLabelText="C.P."
                                floatingLabelFixed={true}
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
                            <SelectField
                                floatingLabelText="Provincia"
                                value={this.state.data.province}
                                errorText={this.state.errors.province}
                                onChange={this.handleProvinceChange}
                            >   
                                {this.state.provinces.map((province) => {
                                    return <MenuItem key={province.deno} value={province.id} primaryText={province.deno} />
                                })
                                }
                            </SelectField>
                        </Col>
                        <Col xs={12} md={6}>
                           <SelectField
                                floatingLabelText="Subscripción"
                                value={this.state.data.subscription}
                                errorText={this.state.errors.subscription}
                                onChange={this.handleSubscriptionChange}
                            >   
                                {this.state.subscriptions.map((subscription) => {
                                    return <MenuItem key={subscription} value={subscription} primaryText={subscription} />
                                })
                                }
                            </SelectField>
                        </Col>
                        <Col xs={12} md={6}>
                            <TextField
                                floatingLabelText="IBAN"
                                floatingLabelFixed={true}
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
                                checked={this.state.data.termsCheck}
                                onCheck={(event, isInputChecked) => this.setState({
                                    ...this.state,
                                    data: {
                                        ...this.state.data,
                                        termsCheck: isInputChecked
                                    }
                                })}
                            />
                        </Col>
                        <Col xs={12} md={4}>
                            <RaisedButton
                                label="Enviar solicitud"
                                fullWidth={true}
                                backgroundColor={'purple'}
                                labelStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em'}}
                                labelPosition="before"
                                onClick={this.endForm}
                                icon={<FontIcon className="material-icons">arrow_forward</FontIcon>}
                            />
                        </Col>
                    </Row>
                </Grid>
                <Dialog
                    actions={<RaisedButton 
                        label="Aceptar"
                        backgroundColor='purple'
                        labelStyle={{color: 'white', fontWeight: '700'}}
                        onClick={this.closeAlert} 
                    />}
                    modal={false}
                    open={!!this.state.errors.termsCheck}
                    onRequestClose={this.closeAlert}
                    contentStyle={{width: '35%'}}
                    >
                    Debes aceptar los términos y condiciones antes de continuar
                </Dialog>
            </div>
        ); 
    }

}

export default SignUpPage;