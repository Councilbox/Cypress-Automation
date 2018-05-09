import React, { Component, Fragment } from 'react';
import { LoadingMainApp, Icon, BasicButton } from "../../../displayComponents";
import LiveHeader from './LiveHeader';
import { lightGrey, darkGrey, getSecondary } from '../../../styles/colors';
import { graphql, compose } from 'react-apollo';
import { councilLiveQuery, majorityTypes, quorumTypes, votingTypes } from '../../../queries';
import AgendaManager from './AgendaManager';
import ParticipantsLive from './ParticipantsLive';
import ParticipantsManager from './ParticipantsManager';
import { showVideo } from '../../../utils/CBX';

const minVideoWidth = 30;
const minVideoHeight = '50%';

class CouncilLivePage extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            participants: true,
            confirmModal: false,
            selectedPoint: 0,
            addParticipantModal: false,
            showParticipants: false,
            videoWidth: minVideoWidth,
            videoHeight: minVideoHeight,
            fullScreen: false
        }
    }

    componentDidMount(){
        this.props.data.refetch();
        /*window.addEventListener("beforeunload", (ev) => {  
            ev.preventDefault();
            return ev.returnValue = 'Are you sure you want to close?';
        });*/
    }

    componentWillUnmount(){
        //window.removeListener('beforeunload');
    }

    closeAddParticipantModal = () => {
        this.setState({
            addParticipantModal: false
        });
    };

    checkLoadingComplete = () => {
        return this.props.data.loading && this.props.companies.list;
    };

    handlePageChange = (event) => {
        switch(event.nativeEvent.keyCode){
            case 39:
                this.setState({
                    participants: true
                });
                break;
            case 37:
                this.setState({
                    participants: false
                });
                break;
            default:
                return;
        }
    }

    render(){
        const { council } = this.props.data;
        const { translate } = this.props;

        if(this.checkLoadingComplete()){
            return(
                <LoadingMainApp />
            );
        }

        const company = this.props.companies.list[this.props.companies.selected];        

        return(
            <div 
                style={{height: '100vh', overflow: 'hidden', backgroundColor: lightGrey, fontSize: '1em'}}
                onKeyUp={this.handlePageChange}
                tabIndex="0"
            >
                <LiveHeader
                    logo={company.logo}
                    companyName={company.businessName}
                    councilName={council.name}
                    translate={translate}
                />
                
                <div style={{display: 'flex', width: '100%', height: 'calc(100vh - 3em)', flexDirection: 'row', overflow: 'hidden'}}>
                    {showVideo(council) &&
                        <div style={{display: 'flex', flexDirection: this.state.fullScreen? 'row' : 'column', width: `${this.state.videoWidth}%`, height: '100%', position: 'relative'}}>
                            {this.state.fullScreen && 
                                <div style={{height: '95vh', width: '7%', overflow: 'hidden', backgroundColor: darkGrey}}>
                                    <ParticipantsLive
                                        translate={translate}
                                        participants={this.props.data.council.participants}
                                        councilID={this.props.councilID}
                                    />
                                </div>
                            }
    
                            {council.room.htmlVideoCouncil &&
                                <Fragment>
                                    <div style={{height: this.state.videoHeight, width: '100%', position: 'relative'}}>
                                        <div style={{height: '100%', width: '100%'}} dangerouslySetInnerHTML={{__html: council.room.htmlVideoCouncil}}/>
                                        
                                        {!this.state.fullScreen?
                                            <Icon className="material-icons" style={{position: 'absolute', right: '10%', bottom: '7%', color: lightGrey}} onClick={() => this.setState({videoWidth: 94, videoHeight: '90vh', fullScreen: true})}>zoom_in</Icon>
                                        :
                                            <Icon className="material-icons" style={{position: 'absolute', right: '10%', bottom: '7%', color: lightGrey}} onClick={() => this.setState({videoWidth: minVideoWidth, videoHeight: minVideoHeight, fullScreen: false})}>zoom_out</Icon>
                                        }
                                    </div>
                                </Fragment>
                            }
                            {!this.state.fullScreen &&
                                <div style={{height: '95vh', width: '100%', overflow: 'hidden', backgroundColor: darkGrey}}>
                                    <ParticipantsLive
                                        translate={translate}
                                        participants={this.props.data.council.participants}
                                        councilID={this.props.councilID}
                                    />
                                </div>
                            }
                        </div>
                    }

                    <div style={{width:`${showVideo(council)? 100 - this.state.videoWidth : 100}%`, height: '100%'}}>
                        {/*<div style={{height: '3em'}}>
                            <BasicButton
                                text={this.state.participants? translate.agenda : translate.participants}
                                color={getSecondary()}
                                onClick={() => this.setState({ participants: !this.state.participants})}                                                                    
                                textStyle={{color: 'white', fontSize: '0.75em', fontWeight: '700', textTransform: 'none'}}
                            />
                        </div>*/}
                        {this.state.participants?
                            <div style={{height: 'calc(100vh - 6em)', marginTop: '1.5em'}}>
                                <ParticipantsManager
                                    translate={translate}
                                    participants={this.props.data.council.participants}
                                    council={council}
                                />
                            </div>
                        :
                            <AgendaManager 
                                council={council}
                                company={company}
                                translate={translate}
                                fullScreen={this.state.fullScreen}
                                refetch={this.props.data.refetch}
                                participants={this.props.data.council.participants}
                                openMenu={() => this.setState({ videoWidth: minVideoWidth, videoHeight: minVideoHeight, fullScreen: false})}
                            />
                        }    
                    </div>
                </div>
            </div>
        );
    }
}

export default  graphql(councilLiveQuery, {
    name: "data",
    options: (props) => ({
        variables: {
            councilID: props.councilID,
        }
    })
})(CouncilLivePage);