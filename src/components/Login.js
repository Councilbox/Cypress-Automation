import React from 'react';
import * as mainActions from '../actions/mainActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Grid, Row, Col } from "react-bootstrap";
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import { TextField, FlatButton, FontIcon } from 'material-ui';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { getPrimary } from '../styles/colors';
import { BasicButton } from './displayComponents';

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
        if(!this.checkRequiredFields()){
            const response = await this.props.mutate({
                variables: {
                    email: this.state.user,
                    password: this.state.password
                }
            });
            if(response.data.login){
                console.log(response);
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

    render(){
        const primary = getPrimary();
        return(
            <div className="row" style={{width: '100%', fontSize: '0.85em'}}>
                <div className="col-lg-6 col-md-6 col-xs-12" style={{ color: 'white', paddingLeft: '7%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '4em'}}>
                    <div style={{width: '70%'}}>
                        Bienvenido/a <br/>
                        ¿Todavía no dispones de una cuenta en CouncilBox?<br/>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ut volutpat magna, sed auctor ligula. Quisque felis ex, ultricies sit amet dapibus ac, egestas ac ex. Aliquam pellentesque, velit quis tristique faucibus, neque sapien volutpat diam, sed aliquet sem leo ornare eros. Maecenas sed urna magna. Vestibulum vel arcu ac nisl laoreet molestie ut id justo. Mauris sed quam eget lorem egestas pulvinar. Donec mollis diam justo, eget gravida purus ornare a. Curabitur congue lobortis semper. Mauris laoreet, nulla a fermentum pulvinar, tellus lacus cursus ex, non efficitur odio mauris sit amet enim.
                        <br />
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <BasicButton
                                text="Solicitar demostración"
                                color={'transparent'}
                                buttonStyle={{backgroundColor: 'transparent', border: '1px solid white', marginRight: '2em'}}
                                textStyle={{color: 'white', fontWeight: '700', fontSize: '0.8em', textTransform: 'none'}}
                                labelPosition={'before'}
                            />
                            <Link to="/">
                                <BasicButton
                                    text="Dar de alta mi empresa"
                                    color={'white'}
                                    textStyle={{color: primary, fontWeight: '700', fontSize: '0.8em', textTransform: 'none'}}
                                    textPosition="before"
                                />
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 col-md-6 col-xs-12" style={{display: 'flex', justifyContent: 'center', paddingRight: '5%'}}>
                    <Card style={{marginTop: '4em', width: '70%'}} >
                        <CardHeader
                            title="Accede a tu cuenta"
                            titleColor={primary}
                            titleStyle={{fontWeight: '700'}}
                        />
                        <CardText>
                            <TextField
                                floatingLabelText="NOMBRE DE USUARIO"
                                floatingLabelFixed={true}
                                errorText={this.state.errors.user}
                                type="text"
                                value={this.state.user}
                                onChange={(event) => this.setState({
                                    user: event.nativeEvent.target.value
                                })}
                            />
                            <TextField
                                floatingLabelText="CONTRASEÑA"
                                floatingLabelFixed={true}
                                type="password"
                                errorText={this.state.errors.password}
                                value={this.state.password}
                                onChange={(event) => this.setState({
                                    password: event.nativeEvent.target.value
                                })}
                            />
                        </CardText>
                        <CardActions>
                            <BasicButton
                                text="Entrar"
                                color={primary}
                                buttonStyle={{width: '90%'}}
                                textStyle={{color: 'white', fontWeight: '700'}}
                                textPosition="before"
                                onClick={this.login}
                                fullWidth={true}
                                icon={<FontIcon className="material-icons">arrow_forward</FontIcon>}
                            />
                            <FlatButton 
                                label="¿Has olvidado tu contraseña?"
                                labelStyle={{color: 'grey', fontWeight: '700'}}
                            />
                        </CardActions>   
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

const submitRepository = gql `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password){
        token
    }
  }
`;

export default connect(null, mapDispatchToProps)(graphql(submitRepository)(Login));
//export default connect(null, mapDispatchToProps)(Login);