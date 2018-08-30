import React from 'react';
import withTranslations from '../../HOCs/withTranslations';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import { Paper } from 'material-ui';
import { bHistory } from '../../containers/App';
import gql from 'graphql-tag';
import { getPrimary } from '../../styles/colors';
import { LoadingSection, BasicButton, TextInput, NotLoggedLayout } from '../../displayComponents';


class SetUserPasswordPage extends React.Component {

    state = {
        password: '',
        confirmPassword: '',
        showPassword: false,
        showConfirmPassword: false,
        loading: false,
        success: false,
        errors: {
            confirmPassword: '',
            password: ''
        }
    }

    confirmEmailAndSetPwd = async () => {
        if(!this.checkRequiredFields()){
            this.setState({
                loading: true
            });
            const response = await this.props.confirmEmailAndSetPwd({
                variables: {
                    token: this.props.match.params.token,
                    pwd: this.state.password
                }
            });

            if(!response.errors){
                if(response.data.confirmEmailAndSetPwd.success){
                    this.setState({
                        loading: false,
                        success: true
                    });
                }
            }else{
                this.setState({
                    loading: false,
                    success: false,
                    error: response.errors[0].code
                });
            }
        }
    }

    checkRequiredFields = () => {
        let errors = {
            confirmPassword: '',
            password: ''
        }

        let hasError;

        if(this.state.password.length === 0){
            hasError = true;
            errors.password = this.props.translate.required_field;
        }else{
            if(this.state.confirmPassword.length === 0){
                hasError = true;
                errors.confirmPassword = this.props.translate.required_field;
            }else{
                if(this.state.password !== this.state.confirmPassword){
                    errors.confirmPassword = this.props.translate.register_unmatch_pwds;
                    hasError = true;
                }
            }
        }

        this.setState({
            errors
        });

        return hasError;
    }

    errorWrapper = () => {
        return(
            <div
                style={{
                    color: getPrimary(),
                    fontSize: '1.3em',
                    fontWeight: '700',
                    marginBottom: '1.3em'
                }}
            >
                {this.state.error === 407?
                    this.props.translate.account_actived_yet
                :
                    this.props.translate.error_active_account
                }
            </div>
        )
    }

    successMessage = () => {
        return (
            <div
                style={{
                    color: getPrimary(),
                    fontSize: '1.3em',
                    fontWeight: '700',
                    marginBottom: '1.3em'
                }}
            >
                {this.props.translate.account_actived}
            </div>
        )
    }

    render(){
        const { translate } = this.props;
        const primary = getPrimary()

        return(
            <NotLoggedLayout
                translate={translate}
                helpIcon={true}
                languageSelector={true}
            >
                <div
					className="row"
					style={{
						width: "100%",
						margin: 0,
						fontSize: "0.85em",
						height: "100%",
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
					}}
				>
                    <Paper
                        style={{
                            width: '600px',
                            height: '65vh',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column'
                        }}
                    >
                        {this.state.loading?
                                <LoadingSection />
                            :
                                <React.Fragment>
                                   { this.state.error &&
                                        this.errorWrapper()}
                                    {this.state.success &&
                                        this.successMessage()}
                                    {(!this.state.success && !this.state.error)?
                                        <React.Fragment>
                                            <p
                                                style={{
                                                    fontSize: '1.6em',
                                                    color: primary,
                                                    fontWeight: '700',
                                                    width: '80%',
                                                    textAlign: 'center',
                                                    marginBottom: '1.2em'
                                                }}
                                            >
                                                {translate.welcome_set_your_pwd} 
                                            </p>
                                            <div
                                                style={{
                                                    width: '80%',
                                                    marginBottom: '15%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    flexDirection: 'column'
                                                }}
                                            >
                                                <TextInput
                                                    floatingText={translate.login_password}
                                                    type={
                                                        this.state.showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    passwordToggler={() =>
                                                        this.setState({
                                                            showPassword: !this.state.showPassword
                                                        })
                                                    }
                                                    showPassword={this.state.showPassword}
                                                    required
                                                    value={this.state.password}
                                                    errorText={this.state.errors.password}
                                                    onChange={(event) => this.setState({
                                                        password: event.target.value
                                                    })}
                                                />
                                                <TextInput
                                                    floatingText={translate.login_confirm_password}
                                                    type={
                                                        this.state.showConfirmPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    passwordToggler={() =>
                                                        this.setState({
                                                            showConfirmPassword: !this.state.showConfirmPassword
                                                        })
                                                    }
                                                    showPassword={this.state.showConfirmPassword}
                                                    value={this.state.confirmPassword}
                                                    errorText={this.state.errors.confirmPassword}
                                                    onChange={(event) => this.setState({
                                                        confirmPassword: event.target.value
                                                    })}
                                                />
                                                <div
                                                    style={{marginTop: '1.2em'}}
                                                >
                                                    <BasicButton
                                                        text={translate.set_pwd}
                                                        color={primary}
                                                        textStyle={{color: 'white', textTransform: 'none', fontWeight: '700'}}
                                                        onClick={this.confirmEmailAndSetPwd}
                                                    />
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    :
                                        <BasicButton
                                            text={this.props.translate.go_login}
                                            textStyle={{color: 'white', textTransform: 'none', fontWeight: '700'}}
                                            color={getPrimary()}
                                            onClick={() => bHistory.push('/')}
                                        />
                                    }
                                </React.Fragment>
                            }
                    </Paper>
                </div>
            </NotLoggedLayout>
        )
    }
}

const confirmEmailAndSetPwd = gql`
    mutation confirmEmailAndSetPwd($token: String!, $pwd: String!){
        confirmEmailAndSetPwd(token: $token, pwd: $pwd){
            success
            message
        }
    }
`;


export default graphql(confirmEmailAndSetPwd, {
    name: 'confirmEmailAndSetPwd'
})(withTranslations()(withRouter(SetUserPasswordPage)));