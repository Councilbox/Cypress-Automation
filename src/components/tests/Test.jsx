import React, { Component, Fragment } from 'react';
import { MenuItem } from 'material-ui';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import { BasicButton, Checkbox, LoadingSection, SelectInput, TextInput } from "../../displayComponents";
import { getPrimary } from '../../styles/colors';
import withWindowSize from '../../HOCs/withWindowSize';

const styles = {
    portrait: {
        mainContainer: {
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column'
        },
        actionsBar: {
            width: '100%',
            height: '100px',
            backgroundColor: 'grey'
        },
        container: {
            width: '100%',
            height: '100%',
            backgroundColor: 'green'
        }
    },
    landscape: {
        mainContainer: {
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'row'
        },
        actionsBar: {
            width: '400px',
            height: '100%',
            backgroundColor: 'grey'
        },
        container: {
            width: '100%',
            height: '100%',
            backgroundColor: 'green'
        }
    }
}

class Test extends Component {

    constructor(props) {
        super(props);
        this.state = {
            empty: true
        }
    }

    render() {
        const { translate, countries } = this.props;

        return (
            <div style={(this.props.windowSize == 'xs')? styles.portrait.mainContainer : styles.landscape.mainContainer}>
                <div style={(this.props.windowSize == 'xs')? styles.portrait.actionsBar : styles.landscape.actionsBar}>
                
                </div>

                <div style={(this.props.windowSize == 'xs')? styles.portrait.container : styles.landscape.container}>
                
                </div>
            </div>            
        );
    }
}

export default withWindowSize(Test);