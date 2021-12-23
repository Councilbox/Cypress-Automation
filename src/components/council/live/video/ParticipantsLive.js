import React from 'react';
import gql from 'graphql-tag';
import { graphql, withApollo } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { Tooltip } from 'material-ui';
import { darkGrey, lightGrey, turquoise } from '../../../../styles/colors';
import {
	CollapsibleSection,
	Icon,
	Scrollbar,
	LoadingSection,
	Grid,
	GridItem,
	AlertConfirm
} from '../../../../displayComponents';
import { changeRequestWord, videoParticipants as videoParticipantsQuery, banParticipant as banParticipantMutation } from '../../../../queries';
import {
	exceedsOnlineTimeout, participantIsBlocked, isAskingForWord, formatCountryName, councilStarted
} from '../../../../utils/CBX';
import VideoParticipantMenu from './videoParticipants/VideoParticipantMenu';
import ChangeRequestWordButton from './videoParticipants/ChangeRequestWordButton';
import VideoParticipantsStats from './videoParticipants/VideoParticipantsStats';
import ParticipantHistoryModal from './videoParticipants/ParticipantHistoryModal';
import { isMobile } from '../../../../utils/screen';
import { usePolling } from '../../../../hooks';
import imgCouncilbox from '../../../../assets/img/imago-councilbox-inverse-mini.png';
import imgCouncilbox2 from '../../../../assets/img/logo-white-mini.png';
import { COUNCIL_STATES } from '../../../../constants';

const ParticipantsLive = ({
	screenSize, council, translate, client, ...props
}) => {
	const [stats, setStats] = React.useState({
		online: '-',
		offline: '-',
		broadcasting: '-',
		banned: '-'
	});
	const [data, setData] = React.useState({});
	const [loading, setLoading] = React.useState(true);
	const [options, setOptions] = React.useState({
		banParticipant: false,
		page: 1,
		limit: isMobile ? 15 : 20
	});

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: videoParticipantsQuery,
			variables: {
				councilId: props.councilId,
				options: {
					limit: options.limit,
					offset: options.limit * (options.page - 1)
				}
			}
		});

		setData(response.data);
		setStats(response.data.videoParticipantsStats);
		setLoading(false);
	}, [council.id, options]);

	usePolling(getData, 8000);

	React.useEffect(() => {
		getData();
	}, [getData]);

	const checkParticipantsStatus = async participants => {
		const offline = participants.filter(participant => (
			((participant.online !== 2 && exceedsOnlineTimeout(participant.lastDateConnection))
				|| (participant.online === 2 && !councilStarted(council))
			)));
		if (offline.length > 0) {
			await client.mutate({
				mutation: gql`
					mutation CheckParticipantsOnlineState($councilId: Int!){
						checkParticipantsOnlineState(councilId: $councilId){
							success
						}
					}
				`,
				variables: {
					councilId: council.id
				}
			});
		}
	};

	React.useEffect(() => {
		if (!loading) {
			if (data.videoParticipants) {
				checkParticipantsStatus(data.videoParticipants.list);
			}
		}
	}, [loading, data.videoParticipants, setStats]);

	const banParticipant = async () => {
		const response = await props.banParticipant({
			variables: {
				participantId: options.banParticipant.id
			}
		});

		if (response) {
			if (response.data.banParticipant.success) {
				getData();
				setOptions({
					...options,
					banParticipant: false
				});
			}
		}
	};

	const participantLiveColor = participant => {
		if (participant.online !== 1) {
			return 'crimson';
		}
		if (!participant.videoParticipant) {
			return turquoise;
		}

		if (participant.videoParticipant && council.room && council.room.videoConfig) {
			const videoConfig = council.room.videoConfig ? council.room.videoConfig : {};
			const { videoParticipant } = participant;

			if ((videoConfig.rtmp && videoConfig.viewerURL)
				|| videoConfig.autoHybrid
				|| videoConfig.fixedURL
				|| council.room.videoLink) {
				if (participant.requestWord !== 2) {
					return turquoise;
				}
				if (videoParticipant.online === 1) {
					return turquoise;
				}
				return 'darkorange';
			}

			if (videoParticipant.online === 1) {
				return turquoise;
			}
			return 'darkorange';
		}

		return turquoise;
	};

	const participantVideoIcon = participant => {
		if (participantIsBlocked(participant)) {
			return (
				<Icon
					className="material-icons"
					style={{
						fontSize: '1.1em',
						marginRight: '0.3em',
						color: 'crimson'
					}}
				>
					block
				</Icon>
			);
		}

		if (participant.requestWord !== 2) {
			return (
				<Icon
					className="material-icons"
					style={{
						fontSize: '1.1em',
						marginRight: '0.3em',
						color: participantLiveColor(participant)
					}}
				>
					language
				</Icon>
			);
		}
		return (
			<Icon
				className="material-icons"
				style={{
					fontSize: '1.1em',
					marginRight: '0.3em',
					color: participantLiveColor(participant)
				}}
			>
				videocam
			</Icon>
		);
	};

	const participantEntry = participant => (
		<Grid
			key={`participant${participant.id}`}
			className={(isAskingForWord(participant) && participant.online === 1) ? 'colorToggle' : ''}
			style={{
				display: 'flex',
				flexDirection: 'row',
				borderRadius: '3px',
				height: '3em',
				padding: '0.5em',
				alignItems: 'center'
			}}
		>
			<GridItem
				xs={4}
				lg={5}
				md={5}
				style={{ display: 'flex', flexDirection: 'row' }}
			>
				{participantVideoIcon(participant)}
				<Tooltip
					title={`${participant.name} ${participant.surname || ''}`}
				>
					<div
						style={{
							color: 'white',
							fontSize: '0.85em',
							marginLeft: '0.5em',
							width: '80%'
						}}
						className="truncate"
					>
						{`${participant.name} ${participant.surname || ''}`}<br />
						{(participant.geoLocation && participant.geoLocation.city)
							&& <span style={{ fontSize: '0.85em' }}>
								{`${participant.geoLocation.ip || participant.geoLocation.query}, ${formatCountryName(participant.geoLocation.country, translate.selectedLanguage)}`}
							</span>
						}
					</div>
				</Tooltip>
			</GridItem>
			{council.state !== COUNCIL_STATES.PAUSED
				&& <>
					{!isMobile
						&& <GridItem xs={3} lg={3} md={3}>
							<div
								style={{
									color: lightGrey,
									marginLeft: '1em',
									fontSize: '0.8em'
								}}
								className="truncate"
							>
								{participant.position}
							</div>
						</GridItem>
					}
					<GridItem
						xs={isMobile ? 2 : 1}
						lg={isMobile ? 2 : 1}
						md={isMobile ? 2 : 1}
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between'
						}}
					>
					</GridItem>
					<GridItem
						xs={isMobile ? 2 : 1}
						lg={isMobile ? 2 : 1}
						md={isMobile ? 2 : 1}
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between'
						}}
					>
						{/* <MuteToggleButton
							translate={translate}
							participant={participant}
							refetch={getData}
						/> */}
					</GridItem>
					<GridItem
						xs={isMobile ? 2 : 1}
						lg={isMobile ? 2 : 1}
						md={isMobile ? 2 : 1}
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between'
						}}
					>
						<ChangeRequestWordButton
							translate={translate}
							participant={participant}
							refetch={getData}
						/>
					</GridItem>
					<GridItem
						xs={isMobile ? 2 : 1}
						lg={isMobile ? 2 : 1}
						md={isMobile ? 2 : 1}
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between'
						}}
					>
						<VideoParticipantMenu
							council={council}
							participant={participant}
							refetch={getData}
							setBanParticipant={() => setOptions({ ...options, banParticipant: participant })
							}
							setParticipantHistory={() => setOptions({ ...options, participantHistory: participant })
							}
							translate={translate}
						/>
					</GridItem>
				</>
			}
		</Grid>
	);

	const button = () => (
		<VideoParticipantsStats
			videoFullScreen={screenSize === 'MAX'}
			translate={translate}
			council={council}
			stats={stats}
			toggleFullScreen={props.toggleFullScreen}
		/>
	);

	const paginationFooter = participants => (
		<div style={{
			display: 'flex', color: 'white', fontWeight: '700', alignItems: 'center', paddingTop: '0.5em'
		}}>
			{options.page > 1
				&& <div onClick={() => setOptions({ ...options, page: options.page - 1 })} style={{
					color: 'white', userSelect: 'none', fontSize: '1em', border: '1px solid white', padding: '0 0.2em', cursor: 'pointer'
				}}>{'<'}</div>
			}
			<div style={{ margin: '0 0.3em' }}>{options.page}</div>
			{(options.page < (participants.total / options.limit))
				&& <div onClick={() => setOptions({ ...options, page: options.page + 1 })} style={{
					color: 'white', userSelect: 'none', fontSize: '1em', border: '1px solid white', padding: '0 0.2em', cursor: 'pointer'
				}}>{'>'}</div>
			}
		</div>
	);


	const section = () => {
		const { videoParticipants } = data;

		if (!data.videoParticipants) {
			return <LoadingSection />;
		}

		return (
			<div style={{
				backgroundColor: darkGrey, width: '100%', height: isMobile ? '430px' : `calc(100vh - ${props.videoHeight} - 5em)`, padding: '0.75em', position: 'relative', overflow: 'hidden'
			}}>
				<div style={{ height: `calc(100% - ${videoParticipants.total > options.limit ? '4em' : '2em'})` }}>
					<Scrollbar>
						{videoParticipants.list.map(participant => participantEntry(participant))}
					</Scrollbar>
				</div>
				{videoParticipants.total > options.limit
					&& <div style={{
						height: '2em', display: 'flex', alignItems: 'center', borderTop: '1px solid gainsboro', width: '100%', justifyContent: 'flex-end', paddingTop: '0.3em'
					}}>
						{paginationFooter(videoParticipants)}
					</div>
				}
				<div style={{
					display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '3px'
				}}>
					<div style={{ width: '17px', marginRight: '5px', display: 'flex' }}>
						<img src={imgCouncilbox} style={{ width: '100%' }}></img>
					</div>
					<div style={{ width: '84px', display: 'flex', marginTop: '1px' }}>
						<img src={imgCouncilbox2} style={{ width: '100%' }}></img>
					</div>
				</div>
			</div>
		);
	};

	const CMPVideo = true;// this.props.videoURL && this.props.videoURL.includes('councilbox');

	if (screenSize === 'MAX') {
		return <div style={{ height: '100%' }}>{CMPVideo && button()}</div>;
	}
	return (
		<div style={{}}>
			{CMPVideo
				&& <div style={{}}>
					<CollapsibleSection
						trigger={button}
						controlled={true}
						collapse={section}
						open={true}
						style={{ cursor: 'auto' }}
					/>
					<AlertConfirm
						requestClose={() => setOptions({ ...options, banParticipant: false })
						}
						open={options.banParticipant}
						acceptAction={banParticipant}
						buttonAccept={translate.accept}
						buttonCancel={translate.cancel}
						bodyText={
							<div>
								{!!options.banParticipant
									&& `${translate.want_eject} ${options.banParticipant.name
									} ${options.banParticipant.surname || ''} ${translate.from_room
									}?`
								}
							</div>
						}
						title={translate.attention}
					/>
					{!!options.participantHistory && (
						<ParticipantHistoryModal
							requestClose={() => setOptions({ ...options, participantHistory: false })
							}
							participant={options.participantHistory}
							translate={translate}
						/>
					)}
				</div>
			}
		</div>
	);
};

const changeParticipantOnlineState = gql`
	mutation changeParticipantOnlineState($participantId: Int!, $online: Int!){
		changeParticipantOnlineState(participantId: $participantId, online: $online){
			success
			message
		}
	}
`;

export default compose(
	withApollo,
	graphql(changeRequestWord, {
		name: 'changeRequestWord'
	}),
	graphql(banParticipantMutation, {
		name: 'banParticipant'
	}),
	graphql(changeParticipantOnlineState, {
		name: 'changeParticipantOnlineState'
	})
)(ParticipantsLive);
