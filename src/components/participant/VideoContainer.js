import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import gql from 'graphql-tag';
import { roomUpdateSubscription } from '../council/live/video/CMPVideoIFrame';
import { useRoomUpdated } from '../../hooks';
import { COUNCIL_STATES } from '../../constants';
import PausedCouncilPage from '../council/live/video/PausedCouncilPage';

const rand = Math.random();

const videoURLQuery = gql`
	query participantVideoURL($participantId: Int!){
		participantVideoURL(participantId: $participantId)
	}
`;

const VideoContainer = ({
	setVideoURL, videoURL, announcement, client, ...props
}) => {
	const [url, setUrl] = React.useState(null);
	const [loading, setLoading] = React.useState(true);

	const updateUrl = async newUrl => {
		if (newUrl) {
			if (newUrl !== url) {
				setUrl(newUrl);
			}
			if (loading) {
				setLoading(false);
			}
		} else {
			setTimeout(getData, 5000);
		}
	};

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: videoURLQuery,
			variables: {
				participantId: +props.participant.id
			}
		});

		updateUrl(response.data.participantVideoURL);
	}, [props.participant.id]);

	useRoomUpdated({
		refetch: updateUrl,
		props,
		participant: props.participant
	});

	const { requestWord } = props.participant;

	React.useEffect(() => {
		getData();
	}, [requestWord, getData]);

	if (props.council.state === COUNCIL_STATES.PAUSED) {
		return (
			<PausedCouncilPage
				council={props.council}
				translate={props.translate}
			/>
		);
	}


	if (!loading) {
		if (!videoURL) {
			setVideoURL(url || 'Error reaching CMP');
		}
		return (
			<iframe
				title="meetingScreen"
				allow="geolocation; microphone; camera; autoplay; display-capture"
				scrolling="no"
				className="temp_video"
				src={`https://${url}?rand=${rand}`}
				allowFullScreen={true}
				style={{
					border: 'none !important',
				}}
			>
Something wrong...
			</iframe>
		);
	}

	return <div/>;
};

export default compose(
	graphql(roomUpdateSubscription, {
		name: 'subs',
		options: props => ({
			variables: {
				councilId: props.council.id
			}
		})
	}),
	withApollo
)(VideoContainer);
