import React from 'react';
import * as mainActions from '../actions/mainActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card } from 'material-ui';
import { graphql } from 'react-apollo';
import { login } from '../queries';
import { getPrimary } from '../styles/colors';
import { BasicButton, ButtonIcon, TextInput, Link } from './displayComponents';


class Login extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
            user: '',
            password: '',
            errors: {
                user: '',
                password: ''
            }
        }
    }

    login = async () => {
        const { translate } = this.props;
        if(!this.checkRequiredFields()){
            const response = await this.props.mutate({
                variables: {
                    email: this.state.user,
                    password: this.state.password
                }
            });
            if(response.errors){
                switch(response.errors[0].message){
                    case 'Incorrect password':
                        this.setState({
                            errors: {
                                password: translate.password_err
                            }
                        })
                        break;
                    case 'Not found':
                        this.setState({
                            errors: {
                                user: translate.email_not_found
                            }
                        });
                        break;

                    default:
                        return;

                }

            }
            if(response.data.login){
                this.props.actions.loginSuccess(response.data.login.token);
            }
        }
    }

    checkRequiredFields(){
        let errors = {
            user: '',
            password: ''
        };
        let hasError = false;

        if(!this.state.user.length > 0){
            hasError = true;
            errors.user = 'Este campo es obligatorio'
        }

        if(!this.state.password.length > 0){
            hasError = true;
            errors.password = 'Por favor introduce una contraseña'
        }

        this.setState({
            ...this.state,
            errors: errors
        });
        
        return hasError;
    }

    logout = () => {
        this.props.actions.logout();
    }

    handleKeyUp = (event) => {
        if(event.nativeEvent.keyCode === 13){
            this.login();
        }
    }

    render(){
        const { translate } = this.props;
        const primary = getPrimary();

        return(
            <div className="row" style={{width: '100%', margin: 0, background: `linear-gradient(to right, ${primary}, #6499B1)`, fontSize: '0.85em', height: '100%'}}>
                <div className="col-lg-7 col-md-7 col-xs-12" style={{ color: 'white', display: 'flex', paddingLeft: '3%', flexDirection: 'column', alignItems: 'center', paddingTop: '9em'}}>
                    <div style={{width: '70%', fontSize: '0.9em'}}>
                        <h4 style={{fontWeigth: '300', marginBottom: '1.2em', fontSize: '2em'}}>Bienvenido/a</h4>
                        <h6>¿Todavía no dispones de una cuenta en CouncilBox?</h6>
                        <span style={{fontSize: '0.9', marginBottom: '1em', marginTop: '0.7em'}}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                            Duis ut volutpat magna, sed auctor ligula. Quisque felis ex, 
                            ultricies sit amet dapibus ac, egestas ac ex. Aliquam pellentesque, 
                            velit quis tristique faucibus, neque sapien volutpat diam, sed aliquet sem leo ornare eros.
                            Maecenas sed urna magna. Vestibulum vel arcu ac nisl laoreet molestie ut id justo.
                            Mauris sed quam eget lorem egestas pulvinar.
                        </span>
                        <br />
                        <div className="row" style={{display: 'flex', flexDirection: 'row', marginTop: '1em'}}>
                            <div className="col-lg-6 col-md-6 col-xs-6" style={{padding: '1em'}}>
                                <BasicButton
                                    text="Solicitar demostración"
                                    color={'transparent'}
                                    fullWidth
                                    buttonStyle={{backgroundColor: 'transparent', border: '1px solid white', marginRight: '2em'}}
                                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                                />
                            </div>
                            <div className="col-lg-6 col-md-6 col-xs-6" style={{padding: '1em'}}>                            
                                <Link to="/signup">
                                    <BasicButton
                                        text="Dar de alta mi empresa"
                                        color={'white'}
                                        fullWidth
                                        textStyle={{color: primary, fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                                        textPosition="before"
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-5 col-md-5 col-xs-12" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Card style={{minHeight: '60%', width: '70%', padding: '8%', marginBottom: '5em', marginRight: '5em'}} >
                        <div
                            style={{marginBottom: 0, paddingBottom: 0, fontWeight: '700', fontSize: '1.5em', color: primary}}
                        >
                            {`${translate.login_signin_header} Councilbox`}
                        </div>
                        <TextInput
                            onKeyUp={this.handleKeyUp}
                            floatingText={translate.login_user}
                            errorText={this.state.errors.user}
                            type="text"
                            value={this.state.user}
                            onChange={(event) => this.setState({
                                user: event.nativeEvent.target.value
                            })}
                        />
                        <TextInput
                            onKeyUp={this.handleKeyUp}
                            floatingText={translate.login_password}
                            type="password"
                            errorText={this.state.errors.password}
                            value={this.state.password}
                            onChange={(event) => this.setState({
                                password: event.nativeEvent.target.value
                            })}
                        />
                        <div style={{marginTop: '3em'}}>
                            <BasicButton
                                text="Entrar"
                                color={primary}
                                textStyle={{color: 'white', fontWeight: '700'}}
                                textPosition="before"
                                onClick={this.login}
                                fullWidth={true}
                                icon={<ButtonIcon color='white' type="arrow_forward" />}
                            />
                            <Link to="/">¿Has olvidado tu contraseña?"</Link>  
                        </div>
                    </Card>
                </div>
            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(mainActions, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(graphql(login, {options: {errorPolicy: 'all'}})(Login));