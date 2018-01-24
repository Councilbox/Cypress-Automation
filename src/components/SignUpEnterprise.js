import React, { Component } from 'react';
import { TextField, RaisedButton, FontIcon } from 'material-ui';
import { Grid, Row, Col } from "react-bootstrap";
import CouncilboxApi from '../api/CouncilboxApi';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class SignUpEnterprise extends Component {

    constructor(props){
        super(props);
        this.state = {
            data: {
                companyName: this.props.company.companyName || '',
                type: this.props.company.type || '',
                code: this.props.company.code || ''
            }, 
            types: [],
            errors: {
                companyName: '',
                type: '',
                code: ''
            }
        }
    }

    componentDidMount = async () => {
        const types = await CouncilboxApi.getCompanyTypes();
        this.setState({
            types: types
        });
    }

    nextPage = () => {
        if(!this.checkRequiredFields()){
            this.props.saveInfo(this.state.data);
            this.props.nextPage();
        }
    }

    checkRequiredFields(){
        let errors = {
            companyName: '',
            type: '',
            code: ''
        };
        let hasError = false;

        if(!this.state.data.companyName.length > 0){
            hasError = true;
            errors.companyName = 'Este campo es obligatorio'
        }
        
        if(this.state.data.type === ''){
            hasError = true;
            errors.type = 'Este campo es obligatorio'
        }

        if(!this.state.data.code.length > 0){
            hasError = true;
            errors.code = 'Este campo es obligatorio'
        }

        console.log(errors);

        this.setState({
            ...this.state,
            errors: errors
        });
        
        return hasError;
    }

    handleTypeChange = (event, index) => {
        this.setState({
            ...this.state,
            data: {
                ...this.state.data,
                type: this.state.types[index].value
            }
        });
    }

    render() {
        return(
            <div>
                Empresa
                <Grid>
                    <Row style={{width: '75%'}}>
                        <Col xs={12} md={12}>
                            <TextField
                                floatingLabelText="RAZÓN SOCIAL"
                                floatingLabelFixed={true}
                                type="text"
                                value={this.state.data.companyName}
                                onChange={(event) => this.setState({
                                    ...this.state,
                                    data: {
                                        ...this.state.data,
                                        companyName: event.nativeEvent.target.value
                                    }
                                })}
                                errorText={this.state.errors.companyName}
                            />
                        </Col>
                        <Col xs={12} md={6}>
                            <SelectField
                                floatingLabelText="Tipo"
                                value={this.state.data.type}
                                onChange={this.handleTypeChange}
                                errorText={this.state.errors.type}
                            >   
                                {this.state.types.map((type) => {
                                    return <MenuItem key={type.label} value={type.value} primaryText={type.label} />
                                })
                                }
                            </SelectField>
                        </Col>
                        <Col xs={12} md={6}>
                            <TextField
                                floatingLabelText="CIF"
                                floatingLabelFixed={true}
                                type="text"
                                value={this.state.data.code}
                                onChange={(event) => this.setState({
                                    ...this.state,
                                    data: {
                                        ...this.state.data,
                                        code: event.nativeEvent.target.value
                                    }
                                })}
                                errorText={this.state.errors.code}
                            />
                        </Col>
                        <Col md={5} />
                        <Col xs={12} md={3}>
                            <RaisedButton
                                label="Continuar"
                                fullWidth={true}
                                backgroundColor={'purple'}
                                labelStyle={{color: 'white', fontWeight: '700'}}
                                labelPosition="before"
                                onClick={this.nextPage}
                                icon={<FontIcon className="material-icons">arrow_forward</FontIcon>}
                            />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default SignUpEnterprise;