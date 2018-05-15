import React, { Component } from 'react';
import withWindowSize from '../../../HOCs/withWindowSize';
import { ButtonIcon } from '../../../displayComponents';
import { primary, getSecondary } from '../../../styles/colors';
import { Tooltip, IconButton } from 'material-ui';
import Header from '../Header';

const styles = {
    viewContainer: {
        width: '100vw',
        height: '100vh'
    }
};

class ParticipantLogin extends Component {
    constructor(props){
        super(props);        
        this.state = {
            urlToken: this.props.match.params.token
        }
    }

    render() {
        const language = this.props.translate && this.props.translate.selectedLanguage;
        const urlToken = this.state.urlToken;

        return (
            <div style={styles.viewContainer}>
                <Header/>
                <div>ParticipantLogin</div>
                <div>{urlToken}</div>
            </div>
        );
    }
}

export default withWindowSize(ParticipantLogin);