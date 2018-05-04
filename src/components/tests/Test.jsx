import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FontAwesome from 'react-fontawesome';
import { Grid, Typography } from 'material-ui';
import Header from '../Header';
import { LoadingMainApp } from '../../displayComponents';
import { darkGrey, lightGrey } from '../../styles/colors';
import withWindowSize from '../../HOCs/withWindowSize';
import withTranslations from '../../HOCs/withTranslations';
import * as mainActions from '../../actions/mainActions';

const styles = {
    viewContainer: {
        width: '100vw',
        height: '100vh'
    },
    portrait: {
        mainContainer: {
            width: '100%',
            height: 'calc(100% - 48px)',
            display: 'flex',
            flexDirection: 'column'
        },
        actionsBar: {
            width: '100%',
            height: '100px',
            backgroundColor: darkGrey,
            display: 'flex',
            flexDirection: 'row'
        },
        container: {
            width: '100%',
            height: '100%',
            backgroundColor: lightGrey
        },
        actionsBarItem: {
            width: '25%',
            height: '100%',
            border: '2px solid white'
        }
    },
    landscape: {
        mainContainer: {
            width: '100%',
            height: 'calc(100% - 48px)',
            display: 'flex',
            flexDirection: 'row'
        },
        actionsBar: {
            width: '400px',
            height: '100%',
            backgroundColor: darkGrey,
            display: 'flex',
            flexDirection: 'column'
        },
        container: {
            width: '100%',
            height: '100%',
            backgroundColor: lightGrey
        },
        actionsBarItem: {
            width: '100%',
            height: '25%',
            border: '2px solid white'
        }
    }
}

class Test extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            language: this.props.match.params.language
        }
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if (prevState.language === nextProps.translate.selectedLanguage) {
            return {
               loading : false
            };
        }

        return null;
    }

    componentDidMount(){
        if (this.state.language !== this.props.translate.selectedLanguage) {
            this.props.actions.setLanguage(this.props.match.params.language)
        }
    }

    render() {
        const { translate, windowSize } = this.props;

        if(this.state.loading) return(<LoadingMainApp/>);

        return (
            <div style={styles.viewContainer}>
                <Header />
                <div style={(windowSize === 'xs')? styles.portrait.mainContainer : styles.landscape.mainContainer}>
                    <div style={(windowSize === 'xs')? styles.portrait.actionsBar : styles.landscape.actionsBar}>
                        <div style={(windowSize === 'xs')? styles.portrait.actionsBarItem : styles.landscape.actionsBarItem}>
                            <Grid container spacing={0} style={{height: '100%'}}>
                                <Grid item xs={(windowSize === 'xs')? 12 : 6} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                    <FontAwesome 
                                        name={"laptop"}
                                        style={{fontSize: '3.5em', color: 'white'}}
                                    />
                                    <Typography variant="subheading" style={{color: 'white'}}>
                                        {translate.compatible}
                                    </Typography>
                                </Grid>

                                {windowSize !== 'xs' &&
                                    <Grid item xs={6}>
                                
                                    </Grid>
                                }
                            </Grid>
                        </div>

                        <div style={(windowSize === 'xs')? styles.portrait.actionsBarItem : styles.landscape.actionsBarItem}>
                            <Grid container spacing={0} style={{height: '100%'}}>
                                <Grid item xs={(windowSize === 'xs')? 12 : 6} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                    <FontAwesome 
                                        name={"headphones"}
                                        style={{fontSize: '3.5em', color: 'white'}}
                                    />
                                    <Typography variant="subheading" style={{color: 'white'}}>
                                        {translate.compatible}
                                    </Typography>
                                </Grid>
                                {windowSize !== 'xs' &&
                                    <Grid item xs={6}>
                                
                                    </Grid>
                                }
                            </Grid>
                        </div>

                        <div style={(windowSize === 'xs')? styles.portrait.actionsBarItem : styles.landscape.actionsBarItem}>
                            <Grid container spacing={0} style={{height: '100%'}}>
                                <Grid item xs={(windowSize === 'xs')? 12 : 6} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                    <FontAwesome 
                                        name={"camera"}
                                        style={{fontSize: '3.5em', color: 'white'}}
                                    />
                                    <Typography variant="subheading" style={{color: 'white'}}>
                                        {translate.compatible}
                                    </Typography>
                                </Grid>
                                {windowSize !== 'xs' &&
                                    <Grid item xs={6}>
                                
                                    </Grid>
                                }
                            </Grid>
                        </div>

                        <div style={(windowSize === 'xs')? styles.portrait.actionsBarItem : styles.landscape.actionsBarItem}>
                            <Grid container spacing={0} style={{height: '100%'}}>
                                <Grid item xs={(windowSize === 'xs')? 12 : 6} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                    <FontAwesome 
                                        name={"microphone"}
                                        style={{fontSize: '3.5em', color: 'white'}}
                                    />
                                    <Typography variant="subheading" style={{color: 'white'}}>
                                        {translate.compatible}
                                    </Typography>
                                </Grid>
                                {windowSize !== 'xs' &&
                                    <Grid item xs={6}>
                                
                                    </Grid>
                                }
                            </Grid>
                        </div>
                    </div>

                    <div style={(windowSize === 'xs')? styles.portrait.container : styles.landscape.container}>
                    
                    </div>
                </div>
            </div>            
        );
    }
}


const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(mainActions, dispatch)
});

export default connect(null, mapDispatchToProps)(withTranslations()(withWindowSize(Test)));