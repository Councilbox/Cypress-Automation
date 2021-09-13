import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import gql from 'graphql-tag';
import { darkGrey } from '../../../../styles/colors';
import { ConfigContext } from '../../../../containers/AppControl';
import AdminAnnouncement from '../adminAnnouncement/AdminAnnouncement';
import { useInterval, useRoomUpdated } from '../../../../hooks';
import { LoadingSection } from '../../../../displayComponents';
import { COUNCIL_STATES } from '../../../../constants';
import PausedCouncilPage from './PausedCouncilPage';


const CMPVideoIFrame = props => {
	const [loading, setLoading] = React.useState(true);
	const [data, setData] = React.useState(null);
	const config = React.useContext(ConfigContext);
	const adminId = React.useRef(sessionStorage.getItem('adminId') || Date.now());

	if (!sessionStorage.getItem('adminId')) {
		sessionStorage.setItem('adminId', adminId.current);
	}

	React.useEffect(() => {
		if (!data) {
			fetchVideoURL();
		}
	}, [data]);

	React.useEffect(() => {
		if (!loading) {
			if (data.errors) {
				props.setVideoURL(data.errors[0].message === 'Admin already in the room' ? 'Admin already logued' : 'Error');
			} else {
				sendAdminPing();
				props.setVideoURL(data.roomVideoURL);
			}
		}
	}, [loading]);

	useInterval(async () => {
		if (data && data.roomVideoURL) {
			sendAdminPing();
		} else {
			setLoading(true);
			await fetchVideoURL();
			setLoading(false);
		}
	}, 10000);

	const fetchVideoURL = async () => {
		setLoading(true);
		const response = await props.client.query({
			query: videoURL,
			variables: {
				councilId: props.council.id,
				participantId: 'Mod',
				adminId: sessionStorage.getItem('adminId'),
			},
		});
		setData({
			...response.data,
			errors: response.errors
		});
		setLoading(false);
	};

	useRoomUpdated({ refetch: fetchVideoURL, props, participant: null });

	const sendAdminPing = () => {
		props.adminPing({
			variables: {
				councilId: props.council.id,
				adminId: sessionStorage.getItem('adminId')
			}
		});
	};

	if (loading) {
		return <LoadingSection />;
	}

	if (props.council.state === COUNCIL_STATES.PAUSED) {
		return (
			<PausedCouncilPage council={props.council} translate={props.translate} />
		);
	}

	return (
		<div style={{ width: '100%', height: '100%', position: 'relative' }}>
			<AdminAnnouncement
				translate={props.translate}
				council={props.council}
				context={config}
				closeButton
				isAdmin={true}
			/>
			{!!data.roomVideoURL && config.video ?
				<React.Fragment>
					<iframe
						id="admin-room-iframe"
						title="meetingScreen"
						allow="geolocation; microphone; camera"
						scrolling="no"
						className="temp_video"
						src={`https://${data.roomVideoURL}?rand=${adminId.current}`}
						allowFullScreen={true}
						style={{
							border: 'none !important'
						}}
					>
						Something wrong...
					</iframe>
				</React.Fragment>
				: <div
					style={{
						width: '100%',
						backgroundColor: darkGrey,
						height: '100%',
						color: 'white'
					}}
				>
					{props.videoURL === 'Admin already logued' ?
						<AdminAlreadyLoguedScreen translate={props.translate} />
						: <CMPVideoError translate={props.translate} />
					}
				</div>
			}
		</div>
	);
};

const AdminAlreadyLoguedScreen = ({ translate }) => (
	<div style={{
		width: '100%', height: '100%', padding: '2em', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'
	}}>
		<div style={{ fontWeight: '700' }}>
			{translate.mod_already_streaming_retrying}
		</div>
		<div style={{ marginTop: '0.6em' }}>
			<LoadingSection size={20} />
		</div>
	</div>
);

const CMPVideoError = ({ translate }) => (
	<div style={{
		width: '100%', height: '100%', padding: '2em', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'
	}}>
		<div style={{ fontWeight: '700' }}>
			{translate.something_failed_cmp}
		</div>
		<div style={{ marginTop: '0.6em' }}>
			<LoadingSection size={20} />
		</div>
	</div>
);

const videoURL = gql`
	query RoomVideoURL($councilId: Int!, $participantId: String!, $adminId: String){
		roomVideoURL(councilId: $councilId, participantId: $participantId, adminId: $adminId)
	}
`;


const adminPing = gql`
	mutation AdminPing($councilId: Int!, $adminId: String!){
		adminPing(councilId: $councilId, adminId: $adminId){
			success
		}
	}
`;

export const roomUpdateSubscription = gql`
	subscription RoomUpdated($councilId: Int!){
		roomUpdated(councilId: $councilId){
			videoLink
			platformVideo
			type
			action
			videoConfig
		}
	}
`;

export default compose(
	graphql(adminPing, {
		name: 'adminPing'
	}),
	graphql(roomUpdateSubscription, {
		name: 'subs',
		options: props => ({
			variables: {
				councilId: props.council.id
			}
		})
	})
)(withApollo(CMPVideoIFrame));
