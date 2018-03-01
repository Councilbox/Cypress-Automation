import React, { Component } from 'react';
import { FontIcon } from 'material-ui';
import { Grid, Row, Col } from "react-bootstrap";
import { SelectInput, BasicButton, LoadingSection, TextInput } from '../displayComponents';
import MenuItem from 'material-ui/MenuItem';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { getPrimary } from '../../styles/colors';

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

    componentWillReceiveProps(nextProps){
        if(this.props.data.loading && !nextProps.data.loading){
            this.setState({
                types: nextProps.data.companyTypes
            });
        }
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
        if(this.props.data.loading){
            return(
                <LoadingSection />
            );
        }
        const { translate } = this.props;
        const primary = getPrimary();        

        return(
            <div>
                Empresa
                <Grid>
                    <Row style={{width: '75%'}}>
                        <Col xs={12} md={12}>
                            <TextInput
                                floatingText={translate.entity_name.toUpperCase()}
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
                            <SelectInput
                                floatingLabelText={translate.company_type}
                                value={this.state.data.type}
                                onChange={this.handleTypeChange}
                                errorText={this.state.errors.type}
                            >   
                                {this.state.types.map((type) => {
                                    return <MenuItem key={type.label} value={type.value} primaryText={translate[type.label]} />
                                })
                                }
                            </SelectInput>
                        </Col>
                        <Col xs={12} md={6}>
                            <TextInput
                                floatingText={translate.cif}
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
                            <BasicButton
                                text={translate.continue}
                                color={primary}
                                textStyle={{color: 'white', fontWeight: '700'}}
                                onClick={this.nextPage}
                                textPosition="before"
                                fullWidth
                                icon={<FontIcon className="material-icons">arrow_forward</FontIcon>}
                            />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export const companyTypesQuery = gql `
  query CompanyTypes {
    companyTypes {
      label
      value
    }
  }
`;

export default graphql(companyTypesQuery)(SignUpEnterprise);