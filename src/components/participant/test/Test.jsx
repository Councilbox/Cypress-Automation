import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Header from './Header.jsx';
import NeedHelpModal from './NeedHelpModal.jsx';
import { LoadingMainApp, BasicButton, ButtonIcon } from '../../../displayComponents';
import { primary } from '../../../styles/colors';
import withWindowSize from '../../../HOCs/withWindowSize';
import withTranslations from '../../../HOCs/withTranslations';
import * as mainActions from '../../../actions/mainActions';
import DetectRTC from 'detectrtc';


const styles = {
    viewContainer: {
        width: '100vw',
        height: '100vh'
    },
    container: {
        width: '100%',
        height: 'calc(100% - 48px)',
        display: 'flex',
        flexDirection: 'row'
    }
}



class Test extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            language: this.props.match.params.language,
            detectRTC: DetectRTC,
            modal: false,
            isiOSDevice: false
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
            const isiOSDevice = (DetectRTC.isMobileDevice && DetectRTC.osName === 'iOS') ? true : false;
            this.setState({
                detectRTC: DetectRTC,
                isiOSDevice: isiOSDevice
            });
        });
    }

    // MODAL
    openModal = () => {
        this.setState({
            modal: true
        });
    }

    closeModal = () => {
        this.setState({
            modal: false
        });
    }

    render() {
        const { translate, windowSize, getTestIframe } = this.props;
        const { detectRTC, isiOSDevice } = this.state;

        if(this.state.loading) return(<LoadingMainApp/>);

        return (
            <div style={styles.viewContainer}>
                <Header helpModal={true} helpModalAction={this.openModal}/>
                
                <div style={styles.container}>
                    {isiOSDevice ? 
                        <div style={{padding: '20px'}}>
                            <div style={{textAlign: 'center'}}>
                                <i className="fa fa-exclamation-triangle" aria-hidden="true" style={{fontSize: '40px'}}></i>
                                <h4 style={{marginTop: '0px'}}>{translate.app_required}</h4>
                            </div>

                            <p>
                                {translate.app_required_msg}
                            </p>

                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                <a 
                                    href="https://itunes.apple.com/es/app/councilbox/id1338823032?mt=8" 
                                    style={{
                                        display: 'inline-block', 
                                        overflow: 'hidden', 
                                        background: 'url(https://linkmaker.itunes.apple.com/assets/shared/badges/es-es/appstore-lrg.svg) no-repeat',
                                        width: '135px',
                                        height: '40px',
                                        backgroundSize: 'contain'
                                    }}
                                >
                                </a>
                            </div>
                        </div>
                        :
                        <iframe 
                            title="testIframe" 
                            allow="geolocation; microphone; camera" 
                            scrolling="no"  
                            src={`https://${getTestIframe.participantTestIframe}?rand=${Math.round(Math.random() * 10000000)}`} 
                            allowFullScreen="true" 
                            style={{border:'none', width: '100%', height: '100%'}}
                        >
                                Something wrong...
                        </iframe>
                    }

                    {/* {windowSize !== 'xs' &&
                        <BasicButton
                            text={translate.need_help}
                            color={'white'}
                            textStyle={{color: primary, fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                            textPosition="after"
                            icon={<ButtonIcon type="message" color={primary} style={{marginLeft: '15px'}}/>}
                            onClick={() => this.setState({modal: true})}
                            buttonStyle={{
                                marginRight: '1em', 
                                border: `2px solid ${primary}`, 
                                boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
                                position: 'absolute', 
                                bottom: '40px',
                                right: '40px'
                            }}
                        /> 
                    } */}
                </div>

                <NeedHelpModal 
                    show = { this.state.modal } 
                    translate = { translate }
                    requestClose = { this.closeModal }    
                    detectRTC = { detectRTC }
                />
            </div>            
        );
    }
}


const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(mainActions, dispatch)
});

const getTestIframe = gql`
    query participantTestIframe($language: String!){
        participantTestIframe(language: $language)
    }
`;

export default graphql(getTestIframe, {
    name: 'getTestIframe',
    options: (props) => ({
        variables: {
            language: props.match.params.language
        }
    })
})(connect(null, mapDispatchToProps)(withTranslations()(withWindowSize(Test))));