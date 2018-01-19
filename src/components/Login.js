import React from 'react';
import * as mainActions from '../actions/mainActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Grid, Row, Col } from "react-bootstrap";
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import { TextField, RaisedButton, FlatButton, FontIcon } from 'material-ui';
import { Link } from 'react-router-dom';

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

    login = () => {
        if(!this.checkRequiredFields()){
            this.props.actions.login({
                user: this.state.user,
                password: this.state.password
            });
        }
        
    }

    checkRequiredFields(){
        let errors = {
            user: '',
            password: ''
        };
        let hasError = false;
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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
                                <RaisedButton
                                    label="Solicitar demostración"
                                    backgroundColor={'transparent'}
                                    style={{backgroundColor: 'transparent', border: '1px solid white', marginRight: '2em'}}
                                    labelStyle={{color: 'white', fontWeight: '700', fontSize: '0.8em', textTransform: 'none'}}
                                    labelPosition="before"
                                    onClick={this.login}
                                />
                                <Link to="/signup">
                                    <RaisedButton
                                        label="Dar de alta mi empresa"
                                        backgroundColor={'white'}
                                        labelStyle={{color: 'purple', fontWeight: '700', fontSize: '0.8em', textTransform: 'none'}}
                                        labelPosition="before"
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
                                    <RaisedButton
                                        label="Entrar"
                                        fullWidth={true}
                                        backgroundColor={'purple'}
                                        style={{width: '90%'}}
                                        labelStyle={{color: 'white', fontWeight: '700'}}
                                        labelPosition="before"
                                        onClick={this.login}
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

export default connect(null, mapDispatchToProps)(Login);