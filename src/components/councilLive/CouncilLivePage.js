import React, { Component, Fragment } from 'react';
import { LoadingMainApp } from "../displayComponents";
import LiveHeader from './LiveHeader';
import { lightGrey, darkGrey } from '../../styles/colors';
import { FontIcon } from 'material-ui';
import { graphql, compose } from 'react-apollo';
import { councilFullData, participantsQuery, majorities, quorums, votationTypes, getVideoHTML, liveParticipants } from '../../queries';
import AgendaManager from './AgendaManager';
import ParticipantsLive from './ParticipantsLive';

const minVideoWidth = 30;
const minVideoHeight = '50%';

class CouncilLivePage extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            participants: false,
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
    }

    checkVideoFlags = () => {
        const council = this.props.data.councilData;
        return council.state === 20 && council.council_type === 0;

    }

    checkLoadingComplete = () => {
        return this.props.data.loading || this.props.participantList.loading;
    }

    render(){
        const council = this.props.data.councilData;
        const { translate } = this.props;

        if(this.checkLoadingComplete()){
            return(
                <LoadingMainApp />
            );
        }

        return(
            <div style={{height: '100vh', overflow: 'hidden', backgroundColor: lightGrey, fontSize: '0.95em'}}>
                <LiveHeader
                    logo={this.props.company.logo}
                    companyName={this.props.company.business_name}
                    councilName={council.name}
                    translate={translate}
                />
                
                <div style={{display: 'flex', width: '100%', height: '100%', flexDirection: 'row'}}>
                    {this.checkVideoFlags() &&
                        <div style={{display: 'flex', flexDirection: this.state.fullScreen? 'row' : 'column', width: `${this.state.videoWidth}%`, height: '100%', position: 'relative'}}>
                            {this.state.fullScreen && 
                                <div style={{height: '95vh', width: '7%', overflow: 'hidden', backgroundColor: darkGrey}}>
                                    <ParticipantsLive
                                        translate={translate}
                                        participants={this.props.participantList.participants}
                                        councilID={this.props.councilID}
                                    />
                                </div>
                            }
    
                            {this.props.videoHTML.getVideoHTML &&
                                <Fragment>
                                    <div style={{height: this.state.videoHeight, width: '100%', position: 'relative'}}>
                                        {//<div style={{height: '100%', width: '100%'}} dangerouslySetInnerHTML={{__html: this.props.videoHTML.getVideoHTML.html_video_council}}/>
                                        }
                                        {!this.state.fullScreen?
                                            <FontIcon className="material-icons" color={lightGrey} style={{position: 'absolute', right: '10%', bottom: '7%'}} onClick={() => this.setState({videoWidth: 94, videoHeight: '90vh', fullScreen: true})}>zoom_in</FontIcon>
                                        :
                                            <FontIcon className="material-icons" color={lightGrey} style={{position: 'absolute', right: '10%', bottom: '7%'}} onClick={() => this.setState({videoWidth: minVideoWidth, videoHeight: minVideoHeight, fullScreen: false})}>zoom_out</FontIcon>
                                        }
                                    </div>
                                </Fragment>
                            }
                            {!this.state.fullScreen &&
                                <div style={{height: '95vh', width: '100%', overflow: 'hidden', backgroundColor: darkGrey}}>
                                    <ParticipantsLive
                                        translate={translate}
                                        participants={this.props.participantList.participants}
                                        councilID={this.props.councilID}
                                    />
                                </div>
                            }
                        </div>
                    }

                    <div style={{width:`${this.checkVideoFlags()? 100 - this.state.videoWidth : 100}%`, height: '100%'}}>
                        <AgendaManager 
                            council={council}
                            translate={translate}
                            majorities={this.props.majorities.majorities}
                            fullScreen={this.state.fullScreen}
                            refetch={this.props.data.refetch}
                            participants={this.props.participantList.participants}
                            openMenu={() => this.setState({ videoWidth: minVideoWidth, videoHeight: minVideoHeight, fullScreen: false})}
                        />
    
                    </div>
                </div>
            </div>
        );
    }
}

export default  compose(
    graphql(majorities, {
        name: 'majorities'
    }),

    graphql(quorums, {
        name: 'quorums'
    }),

    graphql(getVideoHTML, {
        name: 'videoHTML',
        options: (props) => ({
            variables: {
                councilID: props.councilID
            }
        })
    }),

    graphql(votationTypes, {
        name: 'votations'
    }),

    graphql(participantsQuery, {
        name: "participantList",
        options: (props) => ({
            variables: {
                councilID: props.councilID
            }
        })
    }),

    graphql(councilFullData, {
        name: "data",
        options: (props) => ({
            variables: {
                councilInfo: {
                    companyID: props.companyID,
                    councilID: props.councilID,
                    step: 6
                }
            }
        })
    })
)(CouncilLivePage);

/**
 * 
 */