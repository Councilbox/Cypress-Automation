import React, { Component } from 'react';
import { RaisedButton, Dialog, Checkbox, SelectField, MenuItem, TextField } from 'material-ui';
import CouncilboxApi from '../api/CouncilboxApi';

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


    handleClose = () => {
        if(this.checkRequiredFields()){
            this.props.close();
        }
    }

    componentDidMount = async () => {
        const countries = await CouncilboxApi.getCountries();
        const subscriptions = await CouncilboxApi.getSubscriptions();
        let country_states = [];
        if(this.props.council.country){
            const index = countries.findIndex((country) => country.deno === this.props.council.country);
            country_states = await CouncilboxApi.getProvinces(index);
        }
        this.setState({
            countries: countries,
            subscriptions: subscriptions,
            country_states: country_states
        });
    }

    async componentWillReceiveProps(nextProps){
        let country_states = [];
        if(nextProps.country){
            const index = this.state.countries.findIndex((country) => country.deno === this.props.council.country);
            country_states = await CouncilboxApi.getProvinces(index);
        }

        this.setState({
            ...this.state,
            data: nextProps.council,
            country_states: country_states
        });
    }

    handleCountryChange = async (event, index) => {
        this.setState({
            ...this.state,
            data: {
                ...this.state.data,
                country: this.state.countries[index].deno
            }
        })

        const country_states = await CouncilboxApi.getProvinces(this.state.countries[index].id);
        this.setState({
            country_states: country_states
        });
    }

    handleProvinceChange = (event, index) => {
        this.setState({
            ...this.state,
            data: {
                ...this.state.data,
                country_state: this.state.country_states[index].id
            }
        })
    }

    checkRequiredFields() {
        if(this.state.remote){
            return true;
        }
    }

    render() {
        return (
            <Dialog
                title="Lugar de celebración"
                actions={<RaisedButton
                    label = "Enviar"
                    backgroundColor = {'purple'}
                    labelStyle = {{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    labelPosition = "after"
                    onClick = {this.handleClose}
                />}
                contentStyle={{width: '40%', padding: '2em'}}
                modal={true}
                open={this.props.open}
            >
                <Checkbox
                    label="Celebrar la junta de forma remota a través de CouncilBox"
                    checked={this.state.remote}
                    onCheck={(event, isInputChecked) => this.setState({remote: isInputChecked})}
                />
                {!this.state.remote &&
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                        <SelectField
                            floatingLabelText="País"
                            value={this.state.data.country}
                            onChange={this.handleCountryChange}
                            errorText={this.state.errors.country}
                        >   
                            {this.state.countries.map((country) => {
                                return <MenuItem key={country.deno} value={country.deno} primaryText={country.deno} />
                            })
                            }
                        </SelectField>
                        <SelectField
                            floatingLabelText="Provincia"
                            value={this.state.data.country_state}
                            errorText={this.state.errors.country_state}
                            onChange={this.handleProvinceChange}
                        >   
                            {this.state.country_states.map((country_state) => {
                                return <MenuItem key={country_state.deno} value={country_state.deno} primaryText={country_state.deno} />
                            })
                            }
                        </SelectField>
                        <TextField
                            floatingLabelText="C.P."
                            floatingLabelFixed={true}
                            type="text"
                            errorText={this.state.errors.zipode}
                            value={this.state.data.zipcode}
                            onChange={(event) => this.setState({
                                ...this.state,
                                data: {
                                    ...this.state.data,
                                    zipCode: event.nativeEvent.target.value
                                }
                            })}
                        />
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
                        <TextField
                            floatingLabelText="DIRECCIÓN"
                            floatingLabelFixed={true}
                            type="text"
                            errorText={this.state.errors.address}
                            value={this.state.data.street}
                            onChange={(event) => this.setState({
                                ...this.state,
                                data: {
                                    ...this.state.data,
                                    address: event.nativeEvent.target.value
                                }
                            })}
                        />
                    </div>
                }
            </Dialog>
        );
    }
}

export default PlaceModal;