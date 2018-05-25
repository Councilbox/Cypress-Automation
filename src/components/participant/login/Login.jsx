import React, { Component } from 'react';
import { Card } from 'material-ui';
import withTranslations from '../../../HOCs/withTranslations';
import { councilIsStarted } from '../../../utils/CBX'; 
import Header from '../Header';
import LoginForm from './LoginForm';
import CouncilState from './CouncilState';
import background from '../../../assets/img/signup3.jpg';

const styles = {
    viewContainer: {
        width: '100vw',
        height: '100vh',
        position: 'relative'
    },
    mainContainer: {
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
        const { participant, council, company, translate } = this.props;
        return (
            <div style={styles.viewContainer}>
                <Header/>
                <div style={styles.mainContainer}>
                    <Card style={styles.cardContainer}>
                        {councilIsStarted(council) ?
                            <LoginForm participant={participant} council={council} company={company}/>
                            :
                            <CouncilState council={council}/>
                        }
                    </Card>
                </div>
            </div>
        </div>);
    }
}

export default withTranslations()(ParticipantLogin);