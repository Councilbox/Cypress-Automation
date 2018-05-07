import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FontAwesome from 'react-fontawesome';
import { Grid, Typography } from 'material-ui';
import Header from '../Header';
import { LoadingMainApp } from '../../displayComponents';
import { secondary, green, red, darkGrey, lightGrey } from '../../styles/colors';
import withWindowSize from '../../HOCs/withWindowSize';
import withTranslations from '../../HOCs/withTranslations';
import * as mainActions from '../../actions/mainActions';
import * as webRTCUtils from '../../utils/webRTC';
import DetectRTC from 'detectrtc';
const NOT_FOUND = 'NOT_FOUND';
const PERMISSION_DENIED = 'PERMISSION_DENIED';
const AVAILABLE = 'AVAILABLE';
const NOT_AVAILABLE = 'NOT_AVAILABLE';
const COMPATIBLE = 'COMPATIBLE';
const INCOMPATIBLE = 'INCOMPATIBLE';

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
            height: '100%'
        },
        actionBarItemIcon: {
            fontSize: '2em',
            color: 'white'
        },
        actionBarItemIconText: {
            fontSize: '12px',
            color: 'white',
            textAlign: 'center'
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
            height: '25%'
        },
        actionBarItemIcon: {
            fontSize: '4em',
            color: 'white'
        },
        actionBarItemIconText: {
            color: 'white',
            textAlign: 'center'
        },
        actionBarItemText: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
        }
    }
}

const DeviceItem = ({windowSize, status, icon, iconText, text, color, secondaryText}) => {
    return(
        <Fragment>
            <Grid item xs={(windowSize === 'xs')? 12 : 6} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5px'}}>
                    <FontAwesome 
                        name={icon}
                        style={{...(windowSize === 'xs'? styles.portrait.actionBarItemIcon : styles.landscape.actionBarItemIcon), ...((status !== AVAILABLE && status !== COMPATIBLE) && {color:red})}}
                    />
                    {(status === AVAILABLE || status === COMPATIBLE) &&
                        <FontAwesome 
                            name={"check-circle"}
                            style={{position: 'absolute', fontSize: '20px', right: '-5px', top: '-5px', color: green}}
                        />
                    }
                </div>
                <div>
                    <Typography 
                        variant="subheading" 
                        style={{...(windowSize === 'xs'? styles.portrait.actionBarItemIconText : styles.landscape.actionBarItemIconText), color:color, fontWeight: 'bold'}}
                    >
                        {iconText}
                    </Typography>
                </div>
            </Grid>                 

            {windowSize !== 'xs' &&
                <Grid item xs={6} style={styles.landscape.actionBarItemText}>
                    { text }
                </Grid>
            }

            {secondaryText &&
                <Grid item xs={12} style={styles.landscape.actionBarItemText}>
                    { secondaryText }
                </Grid>
            }
        </Fragment>
    )
}

class Test extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            language: this.props.match.params.language,
            detectRTC: DetectRTC
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
        DetectRTC.load(() => {
            this.setState({detectRTC: DetectRTC});
        });
    }

    // RENDER DEVICE ITEMS
    _renderDeviceItem = (status, icon, text, secondaryText) => {
        const { windowSize, translate } = this.props;
        switch(status){
            case AVAILABLE:
                return(
                    <DeviceItem windowSize={windowSize} status={status} icon={icon} iconText={translate.available} color={green} text={text} secondaryText={secondaryText}/>
                )
                break;

            case NOT_AVAILABLE:
                return(
                    <DeviceItem windowSize={windowSize} status={status} icon={icon} iconText={translate.not_available} color={red} text={text} secondaryText={secondaryText}/>
                )
                break;

            case PERMISSION_DENIED:
                return(
                    <DeviceItem windowSize={windowSize} status={status} icon={icon} iconText={translate.no_access} color={red} text={text} secondaryText={secondaryText}/>
                )
                break;

            case NOT_FOUND:
                return(
                    <DeviceItem windowSize={windowSize} status={status} icon={icon} iconText={translate.does_not_have} color={red} text={text} secondaryText={secondaryText}/>
                )
                break;

            case COMPATIBLE:
                return(
                    <DeviceItem windowSize={windowSize} status={status} icon={icon} iconText={translate.compatible} color={green} text={text} secondaryText={secondaryText}/>
                )
                break;

            case INCOMPATIBLE:
                return(
                    <DeviceItem windowSize={windowSize} status={status} icon={icon} iconText={translate.incompatible} color={red} text={text} secondaryText={secondaryText}/>
                )
                break;
        }
    }

    // CHECK DEVICE
    checkDevice = () => {
        const { detectRTC } = this.state;
        const deviceStatus = webRTCUtils.checkIsCompatibleBrowser(detectRTC);
        return deviceStatus;
    }
    _renderThisDeviceItem = () => {
        const { detectRTC } = this.state;
        const deviceStatus = this.checkDevice();
        const status = (webRTCUtils.checkIsCompatibleBrowser(detectRTC) === webRTCUtils.COMPATIBLE) ? COMPATIBLE : INCOMPATIBLE ;
        const icon = (webRTCUtils.checkIsMobileDevice(detectRTC))? "mobile" : "laptop";

        const text = this.buildDeviceText(detectRTC, deviceStatus);
        const secondaryText = this.buildDeviceSecondaryText(detectRTC, deviceStatus);

        return this._renderDeviceItem(status, icon, text, secondaryText);
    }

    buildDeviceText = (detectRTC, deviceStatus) => {
        return (
            <div>
                <span style={(deviceStatus === webRTCUtils.iOS_DEVICE) ? {color: red} : {}}>{detectRTC.osName}</span> <br /> 
                <span style={(deviceStatus === webRTCUtils.UNSUPORTED_WINDOWS_VERSION)? {color: red} : {}}>{detectRTC.osVersion}</span> <br /> 
                <span style={(deviceStatus === webRTCUtils.NOT_COMPATIBLE_BROWSER)? {color: red} : {}}>{`${detectRTC.browser.name} ${detectRTC.browser.version}`}</span>
            </div>
        );
    }

    buildDeviceSecondaryText = (detectRTC, deviceStatus) => {
        const { translate } = this.props;
        switch (deviceStatus) {
            case webRTCUtils.UNSUPORTED_WINDOWS_VERSION:
                return(<div style={{textAlign: 'center', paddingLeft: '5px', paddingRight: '5px'}}>
                            <span>
                                {translate.windows_minimum_version}
                            </span>
                        </div>);
                break;

            case webRTCUtils.NOT_COMPATIBLE_BROWSER:
                return(<div style={{textAlign: 'center', paddingLeft: '5px', paddingRight: '5px'}}>
                            <a href="https://www.google.com/chrome/" target="_blank" style={{color: secondary}}>
                                {translate.we_recommend_google_chrome}
                            </a>
                        </div>);
                break;
        
            default:
                return(<div></div>);
                break;
        }
    }

    // CHECK SPEAKERS
    checkSpeakers = () => {
        let speakersStatus = NOT_AVAILABLE;
        // POSIBILIDADES
        // 1.QUE NO TENGA (NOT_FOUND)
        if(!this.state.detectRTC.hasSpeakers){
            speakersStatus = NOT_FOUND;
        }
        // 2.QUE TENGA (AVAILABLE)
        else if(this.state.detectRTC.hasSpeakers){
            speakersStatus = AVAILABLE;
        }
        return speakersStatus;
    }
    _renderSpeakersItem = () => {
        const status = this.checkSpeakers();
        return this._renderDeviceItem(status, "headphones");
    }

    // CHECK WEBCAM
    checkWebcam = () => {
        let webCamStatus = NOT_AVAILABLE;
        // POSIBILIDADES
        // 1.QUE NO TENGA (NOT_FOUND)
        if(!this.state.detectRTC.hasWebcam){
            webCamStatus = NOT_FOUND;
        }
        // 2.QUE TENGA Y NO TENGA PERMISOS (PERMISSION_DENIED)
        else if(!this.state.detectRTC.isWebsiteHasWebcamPermissions){
            webCamStatus = PERMISSION_DENIED;
        }
        // 3.QUE TENGA Y TENGA PERMISOS (AVAILABLE)
        else if(this.state.detectRTC.hasWebcam && this.state.detectRTC.isWebsiteHasWebcamPermissions){
            webCamStatus = AVAILABLE;
        }
        return webCamStatus;
    }
    _renderWebcamItem = () => {
        const status = this.checkWebcam();
        return this._renderDeviceItem(status, "camera");
    }

    // CHECK MICRO
    checkMicro = () => {
        let microStatus = NOT_AVAILABLE;
        // POSIBILIDADES
        // 1.QUE NO TENGA (NOT_FOUND)
        if(!this.state.detectRTC.hasMicrophone){
            microStatus = NOT_FOUND;
        }
        // 2.QUE TENGA Y NO TENGA PERMISOS (PERMISSION_DENIED)
        else if(!this.state.detectRTC.isWebsiteHasMicrophonePermissions){
            microStatus = PERMISSION_DENIED;
        }
        // 3.QUE TENGA Y TENGA PERMISOS (AVAILABLE)
        else if(this.state.detectRTC.hasMicrophone && this.state.detectRTC.isWebsiteHasMicrophonePermissions){
            microStatus = AVAILABLE;
        }
        return microStatus;
    }
    _renderMicroItem = () => {
        const status = this.checkMicro();
        return this._renderDeviceItem(status, "microphone");
    }

    render() {
        const { translate, windowSize } = this.props;
        const { detectRTC } = this.state;

        if(this.state.loading) return(<LoadingMainApp/>);

        return (
            <div style={styles.viewContainer}>
                <Header />
                <div style={(windowSize === 'xs')? styles.portrait.mainContainer : styles.landscape.mainContainer}>
                    <div style={(windowSize === 'xs')? styles.portrait.actionsBar : styles.landscape.actionsBar}>

                        <div style={{...(windowSize === 'xs'? styles.portrait.actionsBarItem : styles.landscape.actionsBarItem), backgroundColor:'#333333'}}>
                            <Grid container spacing={0} style={{height: '100%'}}>
                                {this._renderThisDeviceItem()}
                            </Grid>
                        </div>

                        <div style={(windowSize === 'xs')? styles.portrait.actionsBarItem : styles.landscape.actionsBarItem}>
                            <Grid container spacing={0} style={{height: '100%'}}>
                                {this._renderSpeakersItem()}
                            </Grid>
                        </div>

                        <div style={{...(windowSize === 'xs'? styles.portrait.actionsBarItem : styles.landscape.actionsBarItem), backgroundColor:'#333333'}}>
                            <Grid container spacing={0} style={{height: '100%'}}>
                                {this._renderWebcamItem()}
                            </Grid>
                        </div>

                        <div style={(windowSize === 'xs')? styles.portrait.actionsBarItem : styles.landscape.actionsBarItem}>
                            <Grid container spacing={0} style={{height: '100%'}}>
                                {this._renderMicroItem()}
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