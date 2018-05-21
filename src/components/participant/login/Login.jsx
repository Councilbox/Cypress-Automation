import React, { Component } from 'react';
import withWindowSize from '../../../HOCs/withWindowSize';
import withWindowOrientation from '../../../HOCs/withWindowOrientation';
import { ButtonIcon } from '../../../displayComponents';
import { primary, getSecondary } from '../../../styles/colors';
import { Tooltip, IconButton } from 'material-ui';
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
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
            email: '',
            password: ''
        }
    }

    getEmailInputValidationState(){
        var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return (regex.test(this.state.email) ? 'success' : 'error');
    }

    handleChange(field, event) {
        const newState = {};
        newState[field] = event.target.value;
        this.setState(newState);
    }

    render() {
        const { participant, council, company, windowSize, windowOrientation } = this.props;
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
                                <FormGroup
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
                                </FormGroup>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withWindowOrientation(withWindowSize(ParticipantLogin));