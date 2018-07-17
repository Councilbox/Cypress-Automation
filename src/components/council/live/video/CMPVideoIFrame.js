import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const CMPVideoIFrame = ({ council, translate, data }) => {
    if(!data.loading){
        return (
            <div style={{width: '100%', height: '100%'}}>
                <iframe
                    title="meetingScreen"
                    allow="geolocation; microphone; camera"
                    scrolling="no"
                    className="temp_video"
                    src={`https://${data.roomVideoURL}?rand=${Date.now()}`}
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

const videoURL = gql`
    query RoomVideoURL($councilId: Int!, $participantId: String!){
        roomVideoURL(councilId: $councilId, participantId: $participantId)
    }
`;

export default graphql(videoURL, {
    options: props => ({
        variables: {
            councilId: props.council.id,
            participantId: 'Mod'
        }
    })
})(CMPVideoIFrame);