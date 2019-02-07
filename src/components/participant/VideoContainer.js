import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const rand = Math.random();

const VideoContainer = ({ data, setVideoURL, videoURL, announcement }) => {
    if(!data.loading){
        if(!videoURL){
            setVideoURL(data.participantVideoURL? data.participantVideoURL : 'Error reaching CMP');
        }
        return(
            <iframe
                title="meetingScreen"
                allow="geolocation; microphone; camera"
                scrolling="no"
                className="temp_video"
                src={`https://${data.participantVideoURL}?rand=${rand}`}
                allowFullScreen={true}
                style={{
                    border: "none !important"
                }}
            >
                Something wrong...
            </iframe>
        )
    }

    return <div/>;
}

const videoURLQuery = gql`
    query participantVideoURL($participantId: String!){
        participantVideoURL(participantId: $participantId)
    }
`;

export default graphql(videoURLQuery, {
    options: props => ({
        variables: {
            participantId: props.participant.id
        }
    })
})(VideoContainer);


