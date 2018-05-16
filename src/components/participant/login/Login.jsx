import React, { Component } from 'react';
import withWindowSize from '../../../HOCs/withWindowSize';
import withWindowOrientation from '../../../HOCs/withWindowOrientation';
import { ButtonIcon } from '../../../displayComponents';
import { primary, getSecondary } from '../../../styles/colors';
import { Tooltip, IconButton } from 'material-ui';
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
            urlToken: null
        }
    }

    render() {
        const { participant, council, company, windowSize, windowOrientation } = this.props;
        return (
            <div style={styles.viewContainer}>
                <Header/>
                <div style={styles.mainContainer}>
                    {(windowSize === 'xs' && windowOrientation === "landscape") ?
                        <div style={styles.splittedLoginContainer}>
                            <div style={styles.councilInfoContainer}>
                                <img src={company.logo} alt="company_logo"/>
                            </div>

                            <div style={styles.loginFormContainer}>
                            
                            </div>
                        </div>
                    :
                        <div style={styles.loginContainer}>
                            <div style={styles.councilInfoContainer}>
                                <img src={company.logo} alt="company_logo"/>
                                <h3>{council.name}</h3>
                                <h5>{moment(new Date(council.dateStart)).format('LLL')}</h5>
                            </div>

                            <div style={styles.loginFormContainer}>
                            
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default withWindowOrientation(withWindowSize(ParticipantLogin));