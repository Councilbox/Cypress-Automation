import React, { Component } from 'react';
import { CardPageLayout, TextInput, SelectInput, FileUploadButton, LoadingSection, ButtonIcon, BasicButton } from '../displayComponents';
import { Typography, MenuItem } from 'material-ui';
import { graphql, compose, withApollo } from 'react-apollo';
import { countries, languages, provinces, updateCompany } from '../../queries';
import { getPrimary } from '../../styles/colors';
import { store } from '../../containers/App';
import { setCompany } from '../../actions/companyActions';


class CompanySettingsPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            data: this.props.company,
            success: false,
            error: false,
            request: false,
            provinces: [],
            errors: {}
        }
    }


    async componentWillReceiveProps(nextProps){
        this.setState({
            data: nextProps.company
        });

        if(!nextProps.data.loading){
            const selectedCountry = nextProps.data.countries.find((country) => country.deno === this.props.company.country);        

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

    updateState(newValues){
        this.setState({
            data: {
                ...this.state.data,
                ...newValues
            }
        });
    }

    handleCountryChange = (event) => {
        this.setState({
            data: {
                country: event.target.value
            }
        })
        const selectedCountry = this.props.data.countries.find((country) => country.deno === event.target.value);
        this.updateCountryStates(selectedCountry.id);
    }

    updateCountryStates = async (countryID) => {
        const response = await this.props.client.query({
            query: provinces,
            variables: {
                countryId: countryID
            },
        });
        this.setState({
            country_states: response.data.provinces
        });
    }

    handleFile = (event) => {
        const file = event.nativeEvent.target.files[0];
        if(!file){
            return;
        }

        let reader = new FileReader();
        reader.readAsDataURL(file);


        reader.onload = async () => {
            let fileInfo = {
                filename: file.name,
                filetype: file.type,
                filesize: Math.round(file.size / 1000),
                base64: reader.result,
                councilId: this.props.councilID
            };

            this.setState({
                uploading: true,
                data: {
                    ...this.state.data,
                    logo: fileInfo.base64
                }
            });
        }
    }

    saveCompany = async () => {
        if(!this.checkRequiredFields()){
            this.setState({
                loading: true
            });
            const { __typename, ...data } = this.state.data;

            const response = await this.props.updateCompany({
                variables: {
                    company: data
                }
            })
            if(response.errors){
                this.setState({
                    error: true,
                    loading: false,
                    success: false
                });
            }else{
                store.dispatch(setCompany(response.data.updateCompany));
                this.setState({
                    error: false,
                    loading: false,
                    success: true
                });
            }
        }

    }

    checkRequiredFields(){
        return false;
    }

    render(){
        const { translate } = this.props;
        const { data, errors, success, request } = this.state;
        const updateError = this.state.error;
        const { loading } = this.props.data;

        if(loading){
            return <LoadingSection />
        }

        return(
           <CardPageLayout title={translate.settings}>
                <Typography variant="subheading" style={{marginTop: '2em'}}>
                    {translate.fiscal_data}
                </Typography>
                <div className="row" style={{paddingRight: '3em'}}>
                    <div className="col-lg-8 col-md-8 col-xs-12">
                        <div className="row">
                        <div className="col-lg-3 col-md-6 col-xs-12">
                            <TextInput
                                floatingText={translate.company_new_domain}
                                type="text"
                                value={data.domain}
                                errorText={errors.domain}
                                onChange={(event) => this.updateState({
                                    domain: event.target.value
                                })}
                            />
                        </div>
                        <div className="col-lg-1 col-md-1 col-xs-2">
                            <TextInput
                                floatingText={translate.company_type}
                                type="text"
                                value={data.type}
                                errorText={errors.type}
                                onChange={(event) => this.updateState({
                                    type: event.target.value
                                })}
                            />
                        </div>
                        <div className="col-lg-3 col-md-6 col-xs-12">
                            <TextInput
                                floatingText={translate.business_name}
                                type="text"
                                value={data.businessName}
                                errorText={errors.businessName}
                                onChange={(event) => this.updateState({
                                    businessName: event.target.value
                                })}
                            />
                        </div>
                        <div className="col-lg-3 col-md-6 col-xs-12">
                            <TextInput
                                floatingText={translate.company_new_alias}
                                type="text"
                                value={data.alias}
                                errorText={errors.alias}
                                onChange={(event) => this.updateState({
                                    alias: event.target.value
                                })}
                            />
                        </div>
                        <div className="col-lg-3 col-md-6 col-xs-12">
                            <TextInput
                                floatingText={translate.company_new_cif}
                                type="text"
                                value={data.tin}
                                errorText={errors.tin}
                                onChange={(event) => this.updateState({
                                    tin: event.target.value
                                })}
                            />
                        </div>
                        <div className="col-lg-3 col-md-6 col-xs-12">
                            <TextInput
                                floatingText={translate.company_new_key}
                                type="text"
                                value={data.linkKey}
                                errorText={errors.linkKey}
                                onChange={(event) => this.updateState({
                                    linkKey: event.target.value
                                })}
                            />
                        </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-xs-12" style={{height: '10em'}}>
                        <img src={data.logo} alt="logo" style={{marginBottom: '0.6em', maxHeight: '10em', maxWidth: '10em'}}/>
                        <FileUploadButton 
                            text={translate.company_logotype}
                            image
                            color={getPrimary()}
                            textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                            icon={<ButtonIcon type="publish" color='white' />}
                            onChange={this.handleFile}
                        />
                    </div>
                </div>

                
                <Typography variant="subheading" style={{marginTop: '2em'}}>
                    {translate.contact_data}
                </Typography>
                <div className="row" style={{paddingRight: '3em'}}>
                    <div className="col-lg-3 col-md-6 col-xs-12">
                        <TextInput
                            floatingText={translate.address}
                            type="text"
                            value={data.address}
                            errorText={errors.address}
                            onChange={(event) => this.updateState({
                                address: event.target.value
                            })}
                        />
                    </div>
                    <div className="col-lg-3 col-md-6 col-xs-12">
                        <TextInput
                            floatingText={translate.company_new_locality}
                            type="text"
                            value={data.city}
                            errorText={errors.city}
                            onChange={(event) => this.updateState({
                                city: event.target.value
                            })}
                        />
                    </div>
                    <div className="col-lg-2 col-md-2 col-xs-3" style={{height: '3em', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.2em'}}>
                        <SelectInput
                            floatingText={translate.company_new_country}
                            value={data.country}
                            onChange={this.handleCountryChange}
                            errorText={errors.country}
                        >   
                            {this.props.data.countries.map((country) => {
                                return <MenuItem key={country.deno} value={country.deno}>{country.deno}</MenuItem>
                            })}
                        </SelectInput>
                    </div>
                    <div className="col-lg-2 col-md-2 col-xs-3" style={{height: '3em', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.2em'}}>
                        <SelectInput
                            floatingText={translate.company_new_country_state}
                            value={data.countryState}
                            errorText={errors.countryState}
                            onChange={(event) => this.updateState({countryState: event.target.value})}
                        >   
                            {this.state.provinces.map((province) => {
                                return <MenuItem key={province.deno} value={province.deno}>{province.deno}</MenuItem>
                            })
                            }
                        </SelectInput>
                    </div>
                    <div className="col-lg-3 col-md-6 col-xs-12">
                        <TextInput
                            floatingText={translate.company_new_zipcode}
                            type="text"
                            value={data.zipcode}
                            errorText={errors.zipcode}
                            onChange={(event) => this.updateState({
                                zipcode: event.target.value
                            })}
                        />
                    </div>
                    <div className="col-lg-3 col-md-6 col-xs-12">
                        <SelectInput
                            floatingText={translate.language}
                            value={data.language}
                            onChange={(event) => this.updateState({
                                preferred_language: event.target.value
                            })}
                            errorText={errors.language}
                        >   
                            {this.props.info.languages.map((language) =>
                                <MenuItem key={`language_${language.columnName}`} value={language.columnName}>
                                    {language.desc}
                                </MenuItem>
                            )}
                        </SelectInput>
                    </div>
                </div>
                <BasicButton
                    text={translate.save}
                    color={getPrimary()}
                    error={updateError}
                    success={success}
                    loading={request}
                    textStyle={{color: 'white', fontWeight: '700'}}
                    onClick={this.saveCompany}
                    icon={<ButtonIcon type="save" color='white' />}
                />
            </CardPageLayout>
        );
    }
}

export default compose(
    graphql(countries, {name: 'data'}),
    graphql(languages, {name: 'info'}),
    graphql(updateCompany, {name: 'updateCompany', options: {
        errorPolicy: 'all'
    }})
)(withApollo(CompanySettingsPage));