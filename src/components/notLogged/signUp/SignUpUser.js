import React, { Component } from 'react';
import { BasicButton, ButtonIcon, Grid, GridItem, TextInput } from '../../displayComponents/index';
import { checkValidEmail } from '../../../utils/index';
import { getPrimary, secondary } from '../../../styles/colors';

class SignUpUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            confirmPWD: ''
        }
    }

    nextPage = () => {
        if (!this.checkRequiredFields()) {
            this.props.nextPage();
        }
    };

    previousPage = () => {
        this.props.previousPage();
    };

    checkRequiredFields() {
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

        if (!data.name.length > 0) {
            hasError = true;
            errors.name = 'Este campo es obligatorio';
        }

        if (!checkValidEmail(data.email.toLowerCase())) {
            hasError = true;
            errors.email = 'Por favor introduce un email válido';
        }

        if (!data.surname.length > 0) {
            hasError = true;
            errors.surname = 'Este campo es obligatorio';
        }

        if (!data.phone.length > 0) {
            hasError = true;
            errors.phone = 'Este campo es obligatorio';
        }

        if (!data.email.length > 0) {
            hasError = true;
            errors.email = 'Este campo es obligatorio';
        }


        if (!data.pwd.length > 0) {
            hasError = true;
            errors.pwd = translate.no_empty_pwd;
        }

        if (data.pwd !== this.state.confirmPWD) {
            hasError = true;
            errors.confirmPWD = translate.no_match_pwd;
        }

        this.props.updateErrors(errors);
        return hasError;
    }

    render() {
        const primary = getPrimary();
        const { translate } = this.props;
        const data = this.props.formData;

        return (<div
                style={{
                    width: '100%',
                    padding: '6%'
                }}>
                <div style={{
                    fontSize: '1.3em',
                    fontWeight: '700',
                    color: primary
                }}>
                    {translate.user_data}
                </div>
                <Grid style={{ marginTop: '2em' }}>
                    <GridItem xs={12} md={6} lg={6}>
                        <TextInput
                            floatingText={translate.name}
                            type="text"
                            value={data.name}
                            errorText={this.props.errors.name}
                            onChange={(event) => this.props.updateState({
                                name: event.target.value
                            })}/>
                    </GridItem>
                    <GridItem xs={12} md={6} lg={6}>
                        <TextInput
                            floatingText={translate.surname}
                            type="text"
                            value={data.surname}
                            onChange={(event) => this.props.updateState({
                                surname: event.target.value
                            })}
                            errorText={this.props.errors.surname}/>
                    </GridItem>
                    <GridItem xs={12} md={6} lg={6}>
                        <TextInput
                            floatingText={translate.phone}
                            type="text"
                            value={data.phone}
                            onChange={(event) => this.props.updateState({
                                phone: event.target.value
                            })}
                            errorText={this.props.errors.phone}/>
                    </GridItem>
                    <GridItem xs={12} md={6} lg={6}>
                        <TextInput
                            floatingText={translate.email}
                            type="text"
                            value={data.email}
                            onChange={(event) => this.props.updateState({
                                email: event.target.value
                            })}
                            errorText={this.props.errors.email}/>
                    </GridItem>
                    <GridItem xs={12} md={6} lg={6}>
                        <TextInput
                            floatingText={translate.login_password}
                            type="password"
                            value={data.pwd}
                            onChange={(event) => this.props.updateState({
                                pwd: event.target.value
                            })}
                            errorText={this.props.errors.pwd}/>
                    </GridItem>
                    <GridItem xs={12} md={6} lg={6}>
                        <TextInput
                            floatingText={translate.login_confirm_password}
                            type="password"
                            value={this.state.confirmPWD}
                            onChange={(event) => this.setState({
                                confirmPWD: event.target.value
                            })}
                            errorText={this.props.errors.confirmPWD}
                        />
                    </GridItem>
                    <GridItem xs={12} md={6} lg={6}>
                        <BasicButton
                            text={translate.back}
                            color={secondary}
                            textStyle={{
                                color: 'white',
                                fontWeight: '700'
                            }}
                            onClick={this.previousPage}
                            fullWidth
                            icon={<ButtonIcon color='white' type="arrow_back"/>}/>
                    </GridItem>
                    <GridItem xs={12} md={6} lg={6}>
                        <BasicButton
                            text={translate.continue}
                            color={primary}
                            textStyle={{
                                color: 'white',
                                fontWeight: '700'
                            }}
                            onClick={this.nextPage}
                            fullWidth
                            icon={<ButtonIcon color='white' type="arrow_forward"/>}/>
                    </GridItem>
                </Grid>
            </div>);
    }

}

export default SignUpUser;