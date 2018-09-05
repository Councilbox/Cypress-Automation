import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import RecordingButton from './RecordingButton';

const rand = Date.now();

class CMPVideoIFrame extends React.Component {


    render(){
        const { data } = this.props;

        if(!data.loading){
            return (
                <div style={{width: '100%', height: '100%', position: 'relative'}}>
                    <RecordingButton
                        council={this.props.council}
                        translate={this.props.translate}
                    />
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
)(CMPVideoIFrame);