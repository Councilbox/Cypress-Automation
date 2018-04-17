import React, { Component } from 'react';
import { SelectInput, BasicButton, LoadingSection, ButtonIcon, TextInput } from '../displayComponents';
import { MenuItem } from 'material-ui/Menu';
import { graphql } from 'react-apollo';
import { getPrimary } from '../../styles/colors';
import { companyTypes } from '../../queries';

class SignUpEnterprise extends Component {


    nextPage = () => {
        if(!this.checkRequiredFields()){
            this.props.nextPage();
        }
    }

    checkRequiredFields(){
        const data = this.props.formData;
        let errors = {
            businessName: '',
            type: '',
            cif: ''
        };
        let hasError = false;

        if(!data.businessName.length > 0){
            hasError = true;
            errors.businessName = 'Este campo es obligatorio'
        }
        
        if(data.type === ''){
            hasError = true;
            errors.type = 'Este campo es obligatorio'
        }

        if(!data.cif.length > 0){
            hasError = true;
            errors.cif = 'Este campo es obligatorio'
        }

        console.log(errors);

        this.props.updateErrors(errors);
        
        return hasError;
    }

    handleTypeChange = (event) => {
        this.props.updateState({
            type: event.target.value
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
            <div style={{width: '100%', padding: '6%', height: '100%'}}>
                <span style={{fontSize: '1.3em', fontWeight: '700', color: primary}}>{translate.company_data}</span>
                <div style={{width: '100%', marginBottom: '2.2em', marginTop: '2em'}}>
                    <TextInput
                        floatingText={translate.entity_name}
                        type="text"
                        value={this.props.formData.businessName}
                        onChange={(event) => this.props.updateState({
                            businessName: event.nativeEvent.target.value
                        })}
                        errorText={this.props.errors.businessName}
                    />
                </div>
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-xs-12" style={{marginBottom: '2.2em', height: '3em', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <SelectInput
                            floatingText={translate.company_type}
                            value={this.props.formData.type}
                            onChange={this.handleTypeChange}
                            errorText={this.props.errors.type}
                        >   
                            {this.props.data.companyTypes.map((type) => {
                                return <MenuItem key={type.label} value={type.value}>{translate[type.label]}</MenuItem>
                            })
                            }
                        </SelectInput>
                    </div>
                    <div className="col-lg-6 col-md-6 col-xs-12" style={{height: '3em', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <TextInput
                            floatingText={translate.cif}
                            type="text"
                            value={this.props.formData.cif}
                            onChange={(event) => this.props.updateState({
                                cif: event.target.value
                            })}
                            errorText={this.props.errors.cif}
                        />
                    </div>
                </div>
                <div className="col-lg-6 col-lg-offset-6 col-md-6 col-md-offset-6 col-xs-12" style={{float: 'right', marginTop: '3em'}} >
                    <BasicButton
                        text={translate.continue}
                        color={primary}
                        textStyle={{color: 'white', fontWeight: '700'}}
                        onClick={this.nextPage}
                        fullWidth
                        icon={<ButtonIcon color='white' type="arrow_forward" />}
                    />
                </div>
            </div>
        );
    }
}

export default graphql(companyTypes)(SignUpEnterprise);