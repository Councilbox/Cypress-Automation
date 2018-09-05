import React from 'react';
import { graphql, compose } from 'react-apollo';
import { Tooltip } from 'material-ui';
import { CircularProgress } from "material-ui/Progress";
import gql from 'graphql-tag';
import { checkIsWebRTCCompatibleBrowser } from '../../../../utils/webRTC';
import DetectRTC from 'detectrtc';

class RecordingButton extends React.Component {

    state = {
        loading: false
    }

    componentDidMount(){
        DetectRTC.load();
    }

    toggleRecordings = async () => {
        this.setState({
            loading: true
        });

        const variables = {
            councilId: this.props.council.id
        }

        const response = this.props.data.sessionStatus.record?
            await this.props.stopRecording({variables})
        :
            await this.props.startRecording({variables});

        console.log(response);

        if(response){
            await this.props.data.refetch();
            this.setState({
                loading: false
            });
        }
    }

    render() {
        const { sessionStatus } = this.props.data;

        console.log(this.props);

        if(!sessionStatus || !checkIsWebRTCCompatibleBrowser(DetectRTC)){
            return <span />
        }

        const { record } = sessionStatus;

        return (
            <Tooltip title={record? 'Parar grabación' : 'Iniciar grabación'} /*TRADUCCION*/>
                <div
                    style={{
                        position: 'absolute',
                        top: '10%',
                        left: '10%',
                        fontSize: '1.4em',
                        cursor: 'pointer'
                    }}
                    onClick={this.toggleRecordings}
                >
                    {this.state.loading?
                        <CircularProgress size={20} thickness={7} color={'secondary'} />
                    :
                        record?
                            <i className="fa fa-dot-circle-o fadeToggle" style={{color: 'red'}}/>
                        :
                            <i className="fa fa-circle" style={{color: 'red'}}/>
                    }
                    
                
                </div>
            </Tooltip>
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
    graphql(startRecording, {
        name: 'startRecording'
    }),
    graphql(stopRecording, {
        name: 'stopRecording'
    })
)(RecordingButton);
