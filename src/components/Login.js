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
                    creds: {
                        user: this.state.user,
                        password: this.state.password
                    }
                }
            });
            this.props.actions.loginSuccess(response.data.login);
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
        return(
            <div>
                <Grid className="show-grid">
                    <Row>
                        <Col xs={12} md={5} mdPush={1} style={{ color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '4em'}}>
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
                                    onClick={this.login}
                                    labelPosition={'before'}
                                />
                                <Link to="/signup">
                                    <BasicButton
                                        text="Dar de alta mi empresa"
                                        color={'white'}
                                        textStyle={{color: 'purple', fontWeight: '700', fontSize: '0.8em', textTransform: 'none'}}
                                        textPosition="before"
                                    />
                                </Link>
                            </div>
                        </Col>
                        <Col xs={12} md={4} mdOffset={2}>
                            <Card style={{marginTop: '4em'}}>
                                <CardHeader
                                    title="Accede a tu cuenta"
                                    titleColor="purple"
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
                                        color={'purple'}
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
                        </Col>
                    </Row>
                </Grid>
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
  mutation Login($creds: Credentials) {
    login(creds: $creds)
  }
`;

export default connect(null, mapDispatchToProps)(graphql(submitRepository)(Login));
//export default connect(null, mapDispatchToProps)(Login);