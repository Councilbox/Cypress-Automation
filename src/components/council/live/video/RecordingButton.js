import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { Tooltip } from 'material-ui';
import { CircularProgress } from 'material-ui/Progress';
import gql from 'graphql-tag';
import DetectRTC from 'detectrtc';
import { checkIsWebRTCCompatibleBrowser } from '../../../../utils/webRTC';
import Tower from '../../../../assets/img/broadcast-tower.svg';
import BroadcastingTower from '../../../../assets/img/broadcasting-tower.svg';
import { usePolling } from '../../../../hooks';
import { AlertConfirm } from '../../../../displayComponents';
import { ConfigContext } from '../../../../containers/AppControl';


const RecordingButton = ({
	data, council, translate, client, ...props
}) => {
	const [loading, setLoading] = React.useState(false);
	const [autoHybridModal, setAutoHybridModal] = React.useState(false);
	const config = React.useContext(ConfigContext);
	const showRecordingButton = (config.recording && (council.fullVideoRecord === 0 || (council.fullVideoRecord === 1 && council.councilStarted === 1)));
	const showStreamingButton = config.streaming && (council.room.videoConfig && (council.room.videoConfig.rtmp || council.room.videoConfig.autoHybrid));

	React.useState(() => {
		DetectRTC.load();
	}, [council.id]);

	React.useEffect(() => {
		if (!data.loading && council.councilStarted === 1) {
			data.refetch();
		}
	}, [council.councilStarted]);

	usePolling(data.refetch, council.councilStarted === 1 ? 60000 : 20000);

	const stopStreamingAlert = async () => {
		if (council.room.videoConfig && council.room.videoConfig.autoHybrid) {
			setAutoHybridModal(council.room.videoConfig.autoHybrid);
		} else {
			stopStreaming();
		}
	};

	const stopStreaming = async () => {
		if (loading) {
			return;
		}

		setLoading(true);
		await client.mutate({
			mutation: gql`
				mutation StopStreaming($councilId: Int!){
					stopStreaming(councilId: $councilId){
						success
					}
				}
			`,
			variables: {
				councilId: council.id
			}
		});
		data.refetch();
		setLoading(false);
		setAutoHybridModal(false);
	};

	const startStreaming = async () => {
		if (loading) {
			return;
		}

		setLoading(true);
		await client.mutate({
			mutation: gql`
				mutation StartStreaming($councilId: Int!){
					startStreaming(councilId: $councilId){
						success
					}
				}
			`,
			variables: {
				councilId: council.id
			}
		});
		data.refetch();
		setLoading(false);
	};

	const toggleRecordings = async () => {
		if (loading) {
			return;
		}
		setLoading(true);

		const variables = {
			councilId: council.id
		};

		const response = data.sessionStatus.record ?
			await props.stopRecording({ variables })
			: await props.startRecording({ variables });
		if (response) {
			await data.refetch();
		}
		setLoading(false);
	};

	const { sessionStatus } = data;
	if (!sessionStatus || !checkIsWebRTCCompatibleBrowser(DetectRTC)) {
		return <span />;
	}

	if ((!config.recording && !config.streaming) || data.sessionStatus.type === 'FIXED') {
		return <span />;
	}

	const { record } = sessionStatus;

	return (
		<>
			{loading ?
				<CircularProgress size={20} thickness={7} color={'secondary'} />
				: <>
					{showRecordingButton
						&& <Tooltip title={council.fullVideoRecord === 1 ?
							translate.full_record : record ? translate.to_stop_recording : translate.to_start_recording}>
							<div
								style={{
									cursor: council.fullVideoRecord === 1 ? 'auto' : 'pointer',
									fontSize: '1.4em',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									padding: '0.4em'
								}}
								{...(council.fullVideoRecord !== 1 ? { onClick: toggleRecordings } : {})}
							>
								{loading ?
									<CircularProgress size={20} thickness={7} color={'secondary'} />
									: record ?
										<i className="fa fa-dot-circle-o fadeToggle" style={{ color: 'red' }} />
										: <i className="fa fa-circle" style={{ color: 'red' }} />
								}
							</div>
						</Tooltip>
					}
					{showStreamingButton
						&& <Tooltip title={sessionStatus.streaming ? translate.stop_broadcasting : translate.start_broadcasting}>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									padding: '0.4em'
								}}
							>
								{sessionStatus.streaming ?
									<img
										src={BroadcastingTower}
										style={{
											width: 'auto',
											height: '17px',
											cursor: 'pointer',
										}}
										onClick={stopStreamingAlert}
									// onClick={stopStreaming}
									/>
									: <img
										src={Tower}
										style={{
											width: 'auto',
											height: '17px',
											cursor: 'pointer',
										}}
										onClick={startStreaming}
									/>
								}
							</div>
						</Tooltip>
					}
					{(council.room.videoConfig && council.room.videoConfig.autoHybrid)
						&& <AlertConfirm
							requestClose={() => setAutoHybridModal(false)}
							open={autoHybridModal}
							acceptAction={stopStreaming}
							buttonAccept={translate.accept}
							buttonCancel={translate.cancel}
							bodyText={
								<div style={{
									margin: '1em', color: 'black', display: 'flex', alignItems: 'center', marginTop: '2em', fontSize: '21px'
								}}>
									<div>
										<i className="fa fa-exclamation-triangle" aria-hidden="true" style={{ color: '#dc7373', fontSize: '25px', marginRight: '22px' }}></i>
									</div>
									<div>Esta acción cortará la emisión a todos los participantes</div>
								</div>
							}
						/>
					}
				</>
			}
		</>
	);
};

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
			type
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
