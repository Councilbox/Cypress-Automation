import React, { Component, Fragment } from 'react';
import { Dialog, Checkbox, MenuItem } from 'material-ui';
import { BasicButton, TextInput, SelectInput, LoadingSection } from "../displayComponents";
import { primary } from '../../styles/colors';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { countriesQuery } from "../../queries";
import CouncilboxApi from '../../api/CouncilboxApi';

class PlaceModal extends Component {

    constructor(props){
        super(props);
        this.state = {
            data: {
                ...this.props.council.council
            },
            countries: [],
            country_states: [],
            remote: false,
            errors: {
                address: '',
                city: '',
                country: '',
                zipCode: '',
                region: '',
            }
        }
    }

    componentDidMount(){
        this.props.data.refetch();
        if(this.props.council){

            this.setState({
                data: {
                    council: this.props.council
                }
            })

            if(this.props.data.countries && this.props.council.country){
                const country = this.props.data.countries.filter((country) => country.deno === this.props.council.country)[0];            
                if(country){
                    this.updateCountryStates(country.id);
                }
                
            }
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.council){
            this.setState({
                data: {
                    council: nextProps.council
                }
            })

            if(this.props.data.countries && nextProps.council.country){
                const country = this.props.data.countries.filter((country) => country.deno === nextProps.council.country)[0];            
                if(country){
                    this.updateCountryStates(country.id);
                }
                
            }
        }
    }

    handleCountryChange = (event, index, value) => {
        this.setState({
            ...this.state,
            data: {
                ...this.state.data,
                council: {
                    ...this.state.data.council,
                    country: value
                }
            }
        })
        this.updateCountryStates(this.props.data.countries[index].id);
    }

    updateCountryStates = async (countryID) => {
        const response = await this.props.client.query({
            query: gql`query ProvinceList($countryID: ID!) {
                provinces(countryID: $countryID){
                    deno
                    id
                }
            }`,
            variables: {
                countryID: countryID
            },
        });
        
        this.setState({
            country_states: response.data.provinces
        });
    }


    handleProvinceChange = (event, index, value) => {
        this.setState({
            ...this.state,
            data: {
                ...this.state.data,
                council: {
                    ...this.state.data.council,
                    country_state: value
                }
            }
        })
    }

    checkRequiredFields() {
        if(this.state.data.council.remote_celebration){
            return false;
        }
        
        let errors = {
            country: '',
            country_state: '',
            street: '',
            zipcode: '',
            city: ''
        };

        let hasError = false;

        if(!this.state.data.council.country){
            hasError = true;
            errors.country = 'Este campo es obligatorio'
        }
        
        if(!this.state.data.council.street){
            hasError = true;
            errors.street = 'Este campo es obligatorio'
        }

        if(!this.state.data.council.city){
            hasError = true;
            errors.city = 'Este campo es obligatorio'
        }

        if(!this.state.data.council.zipcode){
            hasError = true;
            errors.zipcode = 'Este campo es obligatorio'
        }

        if(!this.state.data.council.country_state){
            hasError = true;
            errors.country_state = 'Este campo es obligatorio'
        }

        this.setState({
            ...this.state,
            errors: errors
        });
        
        return hasError;
    }

    
    saveAndClose = () => {
        if(!this.checkRequiredFields()){
            if(!this.state.remote){
                this.props.saveAndClose(this.state.data.council);
            }else{
                this.props.saveAndClose({
                    street: 'remote_celebration',
                    remote_celebration: 1,
                    country: '',
                    country_state: '',
                    state: '',
                    city: '',
                    zipcode: ''
                })
            }
        }
    }

    _renderActionButtons = () => {
        const { translate } = this.props;

        return(
            <Fragment>
                <BasicButton
                    text={translate.close}
                    color={'white'}
                    textStyle={{color: primary, fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    textPosition="after"
                    onClick={this.props.close}
                />
                <BasicButton
                    text={translate.accept}
                    color={primary}
                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    buttonStyle={{marginLeft: '1em'}}
                    textPosition="after"
                    onClick={this.saveAndClose}
                />
            </Fragment>
        );
    }

    render() {
        const { translate } = this.props;

        if(this.props.data.loading || !this.state.data.council){
            return(
                <LoadingSection />
            );
        }

        return (
            <Dialog
                title={translate.new_location_of_celebrate}
                actions={this._renderActionButtons()}
                contentStyle={{width: '40%', padding: '2em'}}
                autoScrollBodyContent
                modal={true}
                open={this.props.open}
            >
                <Checkbox
                    label={translate.remote_celebration}
                    checked={this.state.data.council.remote_celebration === 1 ? true : false}
                    onCheck={(event, isInputChecked) => 
                        this.setState({
                            data: {
                                ...this.state.data,
                                council: {
                                    ...this.state.council,
                                    remote_celebration: isInputChecked? 1 : 0,
                                    street: ''
                                }
                            }
                        })}
                />
                {!this.state.data.council.remote_celebration &&
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                        <SelectInput
                            floatingText={translate.country}
                            value={this.state.data.council.country}
                            onChange={this.handleCountryChange}
                            errorText={this.state.errors.country}
                        >   
                            {this.props.data.countries.map((country) => {
                                return <MenuItem key={country.deno} value={country.deno} primaryText={country.deno} />
                            })
                            }
                        </SelectInput>
                        <SelectInput
                            floatingText={translate.company_new_country_state}
                            value={this.state.data.council.country_state}
                            errorText={this.state.errors.country_state}
                            onChange={this.handleProvinceChange}
                        >   
                            {this.state.country_states.map((country_state) => {
                                return <MenuItem key={country_state.deno} value={country_state.deno} primaryText={country_state.deno} />
                            })
                            }
                        </SelectInput>
                        <TextInput
                            floatingText={translate.company_new_zipcode}
                            type="text"
                            errorText={this.state.errors.zipcode}
                            value={this.state.data.council.zipcode}
                            onChange={(event) => this.setState({
                                ...this.state,
                                data: {
                                    ...this.state.data,
                                    council: {
                                        ...this.state.data.council,
                                        zipcode: event.nativeEvent.target.value
                                    }
                                }
                            })}
                        />
                        <TextInput
                            floatingText={translate.company_new_locality}
                            type="text"
                            errorText={this.state.errors.city}
                            value={this.state.data.council.city}
                            onChange={(event) => this.setState({
                                ...this.state,
                                data: {
                                    ...this.state.data,
                                    council: {
                                        ...this.state.data.council,
                                        city: event.nativeEvent.target.value
                                    }
                                }
                            })}
                        />
                        <TextInput
                            floatingText={translate.company_new_address}
                            type="text"
                            errorText={this.state.errors.street}
                            value={this.state.data.council.street}
                            onChange={(event) => this.setState({
                                ...this.state,
                                data: {
                                    ...this.state.data,
                                    council: {
                                        ...this.state.data.council,
                                        street: event.nativeEvent.target.value
                                    }
                                }
                            })}
                        />
                    </div>
                }
            </Dialog>
        );
    }
}

export default graphql(countriesQuery)(withApollo(PlaceModal));