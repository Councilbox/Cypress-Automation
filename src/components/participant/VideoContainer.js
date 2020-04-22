import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { roomUpdateSubscription } from '../council/live/video/CMPVideoIFrame';
import { useRoomUpdated } from '../../hooks';

const rand = Math.random();

const VideoContainer = ({ data, setVideoURL, videoURL, announcement, ...props }) => {
    useRoomUpdated({
        refetch: data.refetch,
        props,
        participant: props.participant
    });


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
                    border: "none !important",
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

export default compose(
    graphql(videoURLQuery, {
        options: props => ({
            variables: {
                participantId: props.participant.id
            }
        })
    }),
    graphql(roomUpdateSubscription, {
        name: 'subs',
        options: props => ({
			variables: {
				councilId: props.council.id
			}
		})
    })
)(VideoContainer);