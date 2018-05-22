import React, { Component } from 'react';
import withWindowSize from '../../../HOCs/withWindowSize';
import withWindowOrientation from '../../../HOCs/withWindowOrientation';
import withTranslations from '../../../HOCs/withTranslations';
import { ButtonIcon, TextInput } from '../../../displayComponents';
import { primary, getSecondary } from '../../../styles/colors';
import { Tooltip, IconButton, TextField } from 'material-ui';
import { checkValidEmail } from '../../../utils/validation';
import moment from 'moment';
import Header from '../Header';

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
        backgroundColor: 'yellow'
    },
    loginContainer:{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        backgroundColor: 'blue'
    },
    splittedLoginContainer: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        backgroundColor: 'red'
    },
    councilInfoContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'brown'
    },
    loginFormContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '200px',
        height: '90px',
        backgroundColor: 'purple'
    }
};

class ParticipantLogin extends Component {
    constructor(props){
        super(props);        
        this.state = {
            urlToken: null,
            email: props.participant.email,
            password: '',
            errors: {
                email: '',
                password: ''
            }
        }
    }

    checkFieldsValidationState(){
        const { translate } = this.props;

        let errors = {
            email: '',
            password: ''
        };

        //CHECK REQUIRED
        errors.email = (!this.state.email.length > 0) ? translate.field_required : '';

        errors.password = (!this.state.password.length > 0) ? translate.field_required : '';

        // CHECK VALID EMAIL
        const validEmail = checkValidEmail(this.state.email);
        errors.email = (!validEmail) ? translate.tooltip_invalid_email_address : ''

        this.setState({
            ...this.state,
            errors: errors
        });
    }

    handleChange(field, event) {
        const newState = {};
        newState[field] = event.target.value;
        this.setState(newState, this.checkFieldsValidationState);
    }

    render() {
        const { participant, council, company, windowSize, windowOrientation, translate } = this.props;
        return (
            <div style={styles.viewContainer}>
                <Header/>
                <div style={styles.mainContainer}>
                    <div style={(windowSize === 'xs' && windowOrientation === "landscape") ? styles.splittedLoginContainer : styles.loginContainer}>
                        <div style={styles.councilInfoContainer}>
                            <img src={company.logo} alt="company_logo"/>
                            <h3>{council.name}</h3>
                            <h5>{moment(new Date(council.dateStart)).format('LLL')}</h5>
                        </div>

                        <div style={styles.loginFormContainer}>
                            <form>
                                <TextInput
                                    onKeyUp={this.handleKeyUp}
                                    floatingText={translate.email}
                                    type="email"
                                    errorText={this.state.errors.email}
                                    value={this.state.email}
                                    onChange={(event) => this.handleChange('email', event)}
                                    required={true}
                                />
                                {/* <FormGroup
                                    controlId="formBasicText"
                                    validationState={this.getEmailInputValidationState()}
                                >
                                    <ControlLabel>Email</ControlLabel>
                                    <FormControl
                                        type="email"
                                        value={this.state.email}
                                        placeholder="Enter email"
                                        onChange={(event) => this.handleChange('email', event)}
                                    />
                                    <HelpBlock>Validation is based on is valid email.</HelpBlock>
                                </FormGroup> */}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTranslations()(withWindowOrientation(withWindowSize(ParticipantLogin)));