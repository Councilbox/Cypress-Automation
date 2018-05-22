import React, { Component } from 'react';
import withWindowSize from '../../../HOCs/withWindowSize';
import withWindowOrientation from '../../../HOCs/withWindowOrientation';
import withTranslations from '../../../HOCs/withTranslations';
import { ButtonIcon, TextInput, BasicButton } from '../../../displayComponents';
import { getPrimary, getSecondary, lightGrey } from '../../../styles/colors';
import { Card, Tooltip } from 'material-ui';
import { checkValidEmail } from '../../../utils/validation';
import moment from 'moment';
import Header from '../Header';
import background from '../../../assets/img/signup3.jpg';

const styles = {
    viewContainer: {
        width: '100vw',
        height: '100vh', 
        position: 'relative'
    },
    mainContainer:{
        width: '100%',
        height: 'calc(100% - 48px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        backgroundImage: `url(${background})`
    },
    cardContainer: {
        margin: '20px',
        padding: '20px'
    },
    loginContainer:{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
    },
    splittedLoginContainer: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
    },
    councilInfoContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '15px',
        textAlign: 'center'
    },
    loginFormContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '15px'
    },
    enterButtonContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '35px'
    }
};

class ParticipantLogin extends Component {
    constructor(props){
        super(props);        
        this.state = {
            urlToken: null,
            email: props.participant.email,
            password: '',
            showPassword: false,
            errors: {
                email: '',
                password: ''
            }
        }
    }

    checkFieldsValidationState = () => {
        const { translate, council } = this.props;

        let errors = {
            email: '',
            password: ''
        };

        //CHECK REQUIRED
        errors.email = (!this.state.email.length > 0) ? translate.field_required : '';

        if(council.securityType === 0){
            errors.password = '';
        }
        else{
            errors.password = (!this.state.password.length > 0) ? translate.field_required : '';
        }

        // CHECK VALID EMAIL
        const validEmail = checkValidEmail(this.state.email);
        errors.email = (!validEmail) ? translate.tooltip_invalid_email_address : ''

        this.setState({
            ...this.state,
            errors: errors
        });

        return (errors.email === '' && errors.password === '');
    }

    handleChange = (field, event) => {
        const newState = {};
        newState[field] = event.target.value;
        this.setState(newState, this.checkFieldsValidationState);
    }

    login = () => {
        const isValidForm = this.checkFieldsValidationState();
    }

    handleKeyUp = (event) => {
        if(event.nativeEvent.keyCode === 13){
            this.login();
        }
    };

    render() {
        const { participant, council, company, windowSize, windowOrientation, translate } = this.props;
        const { email, password, errors, showPassword } = this.state;
        const primaryColor = getPrimary();
        const secondaryColor = getSecondary();
        return (
            <div style={styles.viewContainer}>
                <Header/>
                <div style={styles.mainContainer}>
                    <Card style={styles.cardContainer}>
                        <div style={(windowSize === 'xs' && windowOrientation === "landscape") ? styles.splittedLoginContainer : styles.loginContainer}>
                            <div style={styles.councilInfoContainer}>
                                <Tooltip 
                                    title={council.businessName} 
                                    placement={"top"}
                                    enterDelay={300}
                                    leaveDelay={300}
                                >
                                    <img src={company.logo} alt="company_logo"/>
                                </Tooltip>
                                <h3 style={{color: secondaryColor}}>{council.name}</h3>
                                <span>{moment(new Date(council.dateStart)).format('LLL')}</span>
                            </div>

                            <div style={styles.loginFormContainer}>
                                <form>
                                    <TextInput
                                        onKeyUp={this.handleKeyUp}
                                        floatingText={translate.email}
                                        type="email"
                                        errorText={errors.email}
                                        value={email}
                                        onChange={(event) => this.handleChange('email', event)}
                                        required={true}
                                        disabled={true}
                                    />

                                    {(council.securityType !== 0) &&
                                        <TextInput
                                            onKeyUp={this.handleKeyUp}
                                            floatingText={translate.login_password}
                                            type={showPassword ? "text" : "password"}
                                            errorText={errors.password}
                                            value={password}
                                            onChange={(event) => this.handleChange('password', event)}
                                            required={true}
                                            showPassword={showPassword}
                                            passwordToggler={() => this.setState({showPassword: !showPassword})}
                                        />
                                    }


                                    <div style={styles.enterButtonContainer}>
                                        <BasicButton
                                            text={translate.enter_room}
                                            color={primaryColor}
                                            textStyle={{color: 'white', fontWeight: '700'}}
                                            textPosition="before"
                                            fullWidth={true}
                                            icon={<ButtonIcon color='white' type="directions_walk" />}
                                            onClick={this.login}
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }
}

export default withTranslations()(withWindowOrientation(withWindowSize(ParticipantLogin)));