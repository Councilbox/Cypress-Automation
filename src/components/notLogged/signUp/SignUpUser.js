import React, { Component } from 'react';
import { BasicButton, ButtonIcon, TextInput } from '../../displayComponents/index';
import { checkValidEmail } from '../../../utils/index';
import { getPrimary } from '../../../styles/colors';

class SignUpUser extends Component {

    constructor(props){
        super(props);
        this.state = {
            confirmPWD: ''
        }
    }

    nextPage = () => {
        if(!this.checkRequiredFields()){
            this.props.nextPage();
        }
    };

    checkRequiredFields(){
        let errors = {
            name: '',
            surname: '',
            phone: '',
            email: '',
            pwd: '',
            confirmPWD: ''
        };

        const data = this.props.formData;
        const { translate } = this.props;
        let hasError = false;

        if(!data.name.length > 0){
            hasError = true;
            errors.name = 'Este campo es obligatorio';
        }

        if(!checkValidEmail(data.email.toLowerCase())){
            hasError = true;
            errors.email = 'Por favor introduce un email válido';
        }

        if(!data.surname.length > 0){
            hasError = true;
            errors.surname = 'Este campo es obligatorio';
        }

        if(!data.phone.length > 0){
            hasError = true;
            errors.phone = 'Este campo es obligatorio';
        }
        
        if(!data.email.length > 0){
            hasError = true;
            errors.email = 'Este campo es obligatorio';
        }

        
        if(!data.pwd.length > 0){
            hasError = true;
            errors.pwd = translate.no_empty_pwd;
        }

        if(data.pwd !== this.state.confirmPWD){
            hasError = true;
            errors.confirmPWD = translate.no_match_pwd;
        }

        this.props.updateErrors(errors);
        return hasError;
    }

    render(){
        const primary = getPrimary();
        const { translate } = this.props;
        const data = this.props.formData;

        return(
            <div style={{width: '100%', padding: '6%'}}>
                <span style={{fontSize: '1.3em', fontWeight: '700', color: primary}}>{translate.user_data}</span>
                <div className="row" style={{marginTop: '2em'}}>
                    <div className="col-lg-6 col-md-6 col-xs-12" style={{marginBottom: '2.2em', height: '3em', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <TextInput
                            floatingText={translate.name}
                            type="text"
                            value={data.name}
                            errorText={this.props.errors.name}
                            onChange={(event) => this.props.updateState({
                                name: event.target.value
                            })}
                        />
                    </div>
                    <div className="col-lg-6 col-md-6 col-xs-12" style={{height: '3em', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.2em'}}>
                        <TextInput
                            floatingText={translate.surname}
                            type="text"
                            value={data.surname}
                            onChange={(event) => this.props.updateState({
                                surname: event.target.value
                            })}
                            errorText={this.props.errors.surname}
                        />
                    </div>
                    <div className="col-lg-6 col-md-6 col-xs-12" style={{height: '3em', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.2em'}}>
                        <TextInput
                            floatingText={translate.phone}
                            type="text"
                            value={data.phone}
                            onChange={(event) => this.props.updateState({
                                phone: event.target.value
                            })}
                            errorText={this.props.errors.phone}
                        />
                    </div>
                    <div className="col-lg-6 col-md-6 col-xs-12" style={{height: '3em', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.2em'}}>
                        <TextInput
                            floatingText={translate.email}
                            type="text"
                            value={data.email}
                            onChange={(event) => this.props.updateState({
                                email: event.target.value
                            })}
                            errorText={this.props.errors.email}
                        />
                    </div>
                    <div className="col-lg-6 col-md-6 col-xs-12" style={{height: '3em', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.2em'}}>
                        <TextInput
                            floatingText={translate.login_password}
                            type="password"
                            value={data.pwd}
                            onChange={(event) => this.props.updateState({
                                pwd: event.target.value
                            })}
                            errorText={this.props.errors.pwd}
                        />
                    </div>
                    <div className="col-lg-6 col-md-6 col-xs-12" style={{height: '3em', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.2em'}}>
                        <TextInput
                            floatingText={translate.login_confirm_password}
                            type="password"
                            value={this.state.confirmPWD}
                            onChange={(event) => this.setState({
                                confirmPWD: event.target.value
                            })}
                            errorText={this.props.errors.confirmPWD}
                        />
                    </div>
                </div>
                <div className="col-lg-6 col-lg-offset-6 col-md-6 col-md-offset-6 col-xs-12" style={{float: 'right', marginTop: '2em'}} >
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

export default SignUpUser;