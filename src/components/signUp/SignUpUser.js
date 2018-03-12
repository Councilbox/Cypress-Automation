import React, { Component } from 'react';
import { Grid, Row, Col } from "react-bootstrap";
import { Icon, BasicButton, TextInput } from '../displayComponents';
import { checkValidEmail } from '../../utils';
import { getPrimary } from '../../styles/colors';

class SignUpUser extends Component {

    constructor(props){
        super(props);
        this.state = {
            data: {
                firstName: this.props.company.firstName || '',
                lastName: this.props.company.lastName || '',
                phoneNumber: this.props.company.phoneNumber || '',
                email: this.props.company.email || '',
                username: this.props.company.username || '',
                password: this.props.company.password || ''
            },
            errors: {
                firstName: '',
                lastName: '',
                phoneNumber: '',
                email: '',
                username: '',
                password: ''
            }
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
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            username: '',
            password: ''
        };

        let hasError = false;

        if(!this.state.data.firstName.length > 0){
            hasError = true;
            errors.firstName = 'Este campo es obligatorio'
        }

        if(!checkValidEmail(this.state.data.email.toLowerCase())){
            hasError = true;
            errors.email = 'Por favor introduce un email válido'
        }

        if(!this.state.data.lastName.length > 0){
            hasError = true;
            errors.lastName = 'Este campo es obligatorio'
        }

        if(!this.state.data.phoneNumber.length > 0){
            hasError = true;
            errors.phoneNumber = 'Este campo es obligatorio'
        }
        
        if(!this.state.data.email.length > 0){
            hasError = true;
            errors.email = 'Este campo es obligatorio'
        }

        if(!this.state.data.username.length > 0){
            hasError = true;
            errors.username = 'Este campo es obligatorio'
        }
        
        if(!this.state.data.password.length > 0){
            hasError = true;
            errors.password = 'Este campo es obligatorio'
        }

        console.log(errors);

        this.setState({
            ...this.state,
            errors: errors
        });
        
        return hasError;
    }

    render(){
        const primary = getPrimary();
        const { translate } = this.props;

        return(
            <div>
                {translate.user_data}
                <Grid>
                    <Row style={{width: '75%'}}>
                        <Col xs={12} md={6}>
                            <TextInput
                                floatingText={translate.name}
                                type="text"
                                value={this.state.data.firstName}
                                errorText={this.state.errors.firstName}
                                onChange={(event) => this.setState({
                                    ...this.state,
                                    data: {
                                        ...this.state.data,
                                        firstName: event.nativeEvent.target.value
                                    }
                                })}
                            />
                        </Col>
                        <Col xs={12} md={6}>
                            <TextInput
                                floatingText={translate.new_surname}
                                type="text"
                                value={this.state.data.lastName}
                                errorText={this.state.errors.lastName}
                                onChange={(event) => this.setState({
                                    ...this.state,
                                    data: {
                                        ...this.state.data,
                                        lastName: event.nativeEvent.target.value
                                    }
                                })}
                            />
                        </Col>
                        <Col xs={12} md={6}>
                            <TextInput
                                floatingText={translate.phone}
                                type="text"
                                value={this.state.data.phoneNumber}
                                errorText={this.state.errors.phoneNumber}
                                onChange={(event) => this.setState({
                                    ...this.state,
                                    data: {
                                        ...this.state.data,
                                        phoneNumber: event.nativeEvent.target.value
                                    }
                                })}
                            />
                        </Col>
                        <Col xs={12} md={6}>
                            <TextInput
                                floatingText={translate.email}
                                type="text"
                                value={this.state.data.email}
                                errorText={this.state.errors.email}
                                onChange={(event) => this.setState({
                                    ...this.state,
                                    data: {
                                        ...this.state.data,
                                        email: event.nativeEvent.target.value
                                    }
                                })}
                            />
                        </Col>
                        <Col xs={12} md={6}>
                            <TextInput
                                floatingText={translate.username}
                                type="text"
                                value={this.state.data.username}
                                errorText={this.state.errors.username}
                                onChange={(event) => this.setState({
                                    ...this.state,
                                    data: {
                                        ...this.state.data,
                                        username: event.nativeEvent.target.value
                                    }
                                })}
                            />
                        </Col>
                        <Col xs={12} md={6}>
                            <TextInput
                                floatingText={translate.password}
                                type="password"
                                value={this.state.data.password}
                                errorText={this.state.errors.password}
                                onChange={(event) => this.setState({
                                    ...this.state,
                                    data: {
                                        ...this.state.data,
                                        password: event.nativeEvent.target.value
                                    }
                                })}
                            />
                        </Col>
                        <Col md={5} />
                        <Col xs={12} md={3}>
                            <BasicButton
                                text={translate.next}
                                fullWidth={true}
                                color={primary}
                                style={{color: 'white', fontWeight: '700'}}
                                position="before"
                                onClick={this.nextPage}
                                icon={<Icon className="material-icons" style={{color: 'white'}}>arrow_forward</Icon>}
                            />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default SignUpUser;