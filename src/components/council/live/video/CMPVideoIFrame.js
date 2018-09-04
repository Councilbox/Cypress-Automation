import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Tooltip } from 'material-ui';

const rand = Date.now();

class CMPVideoIFrame extends React.Component {

    toggleRecordings = async () => {
        const variables = {
            councilId: this.props.council.id
        }

        const response = this.props.data.sessionStatus.record?
            await this.props.stopRecording({variables})
        :
            await this.props.startRecording({variables});

        console.log(response);

        if(response){
            const update = await this.props.data.refetch();
            console.log(update);
        }
    }

    render(){
        const { data } = this.props;
        console.log(data.sessionStatus);

        if(!data.loading){
            return (
                <div style={{width: '100%', height: '100%', position: 'relative'}}>
                    <Tooltip title={this.props.data.sessionStatus.record? 'Parar grabación' : 'Iniciar grabación'} /*TRADUCCION*/>
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
                            {this.props.data.sessionStatus.record?
                                <i className="fa fa-dot-circle-o fadeToggle" style={{color: 'red'}}/>
                            :
                                <i className="fa fa-circle" style={{color: 'red'}}/>
                            }
                        
                        </div>
                    </Tooltip>
    
                    <iframe
                        title="meetingScreen"
                        allow="geolocation; microphone; camera"
                        scrolling="no"
                        className="temp_video"
                        src={`https://${data.roomVideoURL}?rand=${rand}`}
                        allowFullScreen="true"
                        style={{
                            border: "none !important"
                        }}
                    >
                        Something wrong...
                    </iframe>
                </div>
            );
        }
        return(
            <div/>
        );
    }
}

const videoURL = gql`
    query RoomVideoURL($councilId: Int!, $participantId: String!){
        roomVideoURL(councilId: $councilId, participantId: $participantId)

        sessionStatus(councilId: $councilId){
            record
        }
    }
`;

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

export default compose(
    graphql(videoURL, {
        options: props => ({
            variables: {
                councilId: props.council.id,
                participantId: 'Mod'
            }
        })
    }),
    graphql(startRecording, {
        name: 'startRecording'
    }),
    graphql(stopRecording, {
        name: 'stopRecording'
    })
)(CMPVideoIFrame);