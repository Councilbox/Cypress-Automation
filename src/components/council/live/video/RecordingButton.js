import React from 'react';
import { graphql, compose, withApollo } from 'react-apollo';
import { Tooltip } from 'material-ui';
import { CircularProgress } from "material-ui/Progress";
import gql from 'graphql-tag';
import { checkIsWebRTCCompatibleBrowser } from '../../../../utils/webRTC';
import DetectRTC from 'detectrtc';
import Tower from '../../../../assets/img/broadcast-tower.svg';
import BroadcastingTower from '../../../../assets/img/broadcasting-tower.svg';


class RecordingButton extends React.Component {

    state = {
        loading: false,
        disabled: false
    }

    timeout = null;

    componentDidMount() {
        DetectRTC.load();
    }

    startFullRecording = async () => {
        const { sessionStatus } = this.props.data;
        if (!sessionStatus || !checkIsWebRTCCompatibleBrowser(DetectRTC)) {
            return;
        }

        if (!sessionStatus.record) {
            setTimeout(async () => {
                await this.startRecording();
                this.setState({
                    disabled: true
                });
            }, 5000);
        }
    }

    stopStreaming = async () => {
        if(this.state.loading){
            return;
        }

        this.setState({
            loading: true
        });
        await this.props.client.mutate({
            mutation: gql`
                mutation StopStreaming($councilId: Int!){
                    stopStreaming(councilId: $councilId){
                        success
                    }
                }
            `,
            variables: {
                councilId: this.props.council.id
            }
        });
        this.props.data.refetch();

        this.setState({
            loading: false
        });
    }

    startStreaming = async () => {
        if(this.state.loading){
            return;
        }

        this.setState({
            loading: true
        });
        await this.props.client.mutate({
            mutation: gql`
                mutation StartStreaming($councilId: Int!){
                    startStreaming(councilId: $councilId){
                        success
                    }
                }
            `,
            variables: {
                councilId: this.props.council.id
            }
        });
        this.props.data.refetch();

        this.setState({
            loading: false
        });
    }

    startRecording = async () => {
        await this.props.startRecording({
            variables: {
                councilId: this.props.council.id
            }
        });
        this.props.data.refetch();
    }

    toggleRecordings = async () => {
        if (!this.state.disabled) {
            this.setState({
                loading: true
            });

            const variables = {
                councilId: this.props.council.id
            }

            const response = this.props.data.sessionStatus.record ?
                await this.props.stopRecording({ variables })
                :
                await this.props.startRecording({ variables });
            if (response) {
                await this.props.data.refetch();
                this.setState({
                    loading: false
                });
            }
        }
    }

    render() {
        const { sessionStatus } = this.props.data;
        if (!sessionStatus || !checkIsWebRTCCompatibleBrowser(DetectRTC)) {
            return <span />
        }

        if (!this.props.config.recording && !this.props.config.streaming) {
            return <span />;
        }

        const { record } = sessionStatus;
        //TRADUCCIÓN
        return (
            <div
                style={{
                    position: 'absolute',
                    top: '20px',
                    left: '2em',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '1.4em',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    padding: '0.2em',
                    borderRadius: '10px'
                }}
            >
                {this.state.loading ? 
                    <CircularProgress size={20} thickness={7} color={'secondary'} />
                :
                    <>
                        {this.props.config.recording &&
                            <Tooltip title={this.props.council.fullVideoRecord === 1 ? this.props.translate.full_record : record ? this.props.translate.to_stop_recording : this.props.translate.to_start_recording}>
                                <div
                                    style={{cursor: this.props.council.fullVideoRecord === 1 ? 'auto' : 'pointer'}}
                                    {...(this.props.council.fullVideoRecord !== 1 ? { onClick: this.toggleRecordings } : {})}
                                >
                                    {this.state.loading ?
                                        <CircularProgress size={20} thickness={7} color={'secondary'} />
                                        :
                                        record ?
                                            <i className="fa fa-dot-circle-o fadeToggle" style={{ color: 'red' }} />
                                            :
                                            <i className="fa fa-circle" style={{ color: 'red' }} />
                                    }
                                </div>
                            </Tooltip>
                        }
                        {this.props.config.streaming &&
                            <Tooltip title={sessionStatus.streaming? 'Para emisión' : 'Iniciar emision'}>
                                {sessionStatus.streaming ?
                                    <img
                                        src={BroadcastingTower}
                                        style={{ width: 'auto', height: '0.8em', marginLeft: '0.4em' }}
                                        onClick={this.stopStreaming}
                                    />
                                    :
                                    <img
                                        src={Tower}
                                        style={{ width: 'auto', height: '0.8em', marginLeft: '0.4em' }}
                                        onClick={this.startStreaming}
                                    />
                                }
                            </Tooltip>
                        }
                    </>
                }
            </div>
            
        )
    }
}

const startRecording = gql`
    mutation StartRecording($councilId: Int!){
        startRecording(councilId: $councilId){
            success
            message
        }
    }
`;

const stopRecording = gql`
    mutation StopRecording($councilId: Int!){
        stopRecording(councilId: $councilId){
            success
            message
        }
    }
`;


const sessionStatus = gql`
    query SessionStatus($councilId: Int!){
        sessionStatus(councilId: $councilId){
            record
            streaming
        }
    }
`;

export default compose(
    graphql(sessionStatus, {
        options: props => ({
            variables: {
                councilId: props.council.id,
            }
        })
    }),
    withApollo,
    graphql(startRecording, {
        name: 'startRecording'
    }),
    graphql(stopRecording, {
        name: 'stopRecording'
    })
)(RecordingButton);
