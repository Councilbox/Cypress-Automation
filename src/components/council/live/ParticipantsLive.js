import React from "react";
import { darkGrey, getSecondary, lightGrey } from "../../../styles/colors";
import {
	CollapsibleSection,
	Icon,
	Scrollbar,
	LoadingSection,
	Grid,
	GridItem,
	AlertConfirm
} from "../../../displayComponents";
import gql from 'graphql-tag';
import { compose, graphql } from "react-apollo";
import { changeRequestWord, videoParticipants, banParticipant } from "../../../queries";
import { Tooltip } from "material-ui";
import { exceedsOnlineTimeout, participantIsBlocked, isAskingForWord } from "../../../utils/CBX";
import VideoParticipantMenu from "./videoParticipants/VideoParticipantMenu";
import ChangeRequestWordButton from "./videoParticipants/ChangeRequestWordButton";
import VideoParticipantsStats from "./videoParticipants/VideoParticipantsStats";
import ParticipantHistoryModal from "./videoParticipants/ParticipantHistoryModal";
import MuteToggleButton from './videoParticipants/MuteToggleButton';
import { isMobile } from "../../../utils/screen";

const countParticipants = participants => {
	let online = 0;
	let offline = 0;
	let broadcasting = 0;
	let askingForWord = 0;
	let banned = 0;
	let waitingRoom = 0;
	participants.forEach(
		participant => {
			if (participantIsBlocked(participant)) {
				banned++;
			}
			if(isAskingForWord(participant)){
				askingForWord++;
			}
			if(participant.requestWord === 3){
				waitingRoom++;
			}
			if (exceedsOnlineTimeout(participant.lastDateConnection) || participant.online !== 1) {
				offline++;
			} else {
				if (participant.requestWord === 2) {
					broadcasting++;
				}
				online++;
			}
		}
	);
	return {
		online,
		offline,
		broadcasting,
		askingForWord,
		banned,
		waitingRoom
	};
}


const ParticipantsLive = ({ screenSize, data, council, translate, ...props}) => {
	const [stats, setStats] = React.useState({
		online: "-",
		offline: "-",
		broadcasting: "-",
		banned: "-"
	});
	const [options, setOptions] = React.useState({
		banParticipant: false,
		page: 1,
		limit: isMobile? 15 : 10
	});

	React.useEffect(() => {
		if(!data.loading){
			if(data.videoParticipants){
				setStats(countParticipants(data.videoParticipants.list));
			}
		}
	}, [data.loading, data.videoParticipants, setStats]);

	const banParticipant = async () => {
		const response = await props.banParticipant({
			variables: {
				participantId: options.banParticipant.id
			}
		});

		if (response) {
			if (response.data.banParticipant.success) {
				data.refetch();
				setOptions({
					...options,
					banParticipant: false
				});
			}
		}
	}

	const _participantVideoIcon = participant => {
		if (participantIsBlocked(participant)) {
			return (
				<Icon
					className="material-icons"
					style={{
						fontSize: "1.1em",
						marginRight: "0.3em",
						color: "crimson"
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
						fontSize: "1.1em",
						marginRight: "0.3em",
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
					fontSize: "1.1em",
					marginRight: "0.3em",
					color: participantLiveColor(participant)
				}}
			>
				videocam
			</Icon>
		);
	}

	const _participantEntry = participant => {
		return (
			<Grid
				key={`participant${participant.id}`}
				className={isAskingForWord(participant)? "colorToggle" : ''}
				style={{
					display: "flex",
					flexDirection: "row",
					borderRadius: '3px',
					height: "3em",
					padding: "0.5em",
					alignItems: "center"
				}}
			>
				<GridItem
					xs={6}
					lg={6}
					md={6}
					style={{ display: "flex", flexDirection: "row" }}
				>
					{_participantVideoIcon(participant)}
					<Tooltip
						title={`${participant.name} ${participant.surname || ''}`}
					>
						<div
							style={{
								color: "white",
								fontSize: "0.85em",
								marginLeft: "0.5em",
								width: "80%"
							}}
							className="truncate"
						>
							{`${participant.name} ${participant.surname || ''}`}
						</div>
					</Tooltip>
				</GridItem>
				{!isMobile &&
					<GridItem xs={3} lg={3} md={3}>
						<div
							style={{
								color: lightGrey,
								marginLeft: "1em",
								fontSize: "0.8em"
							}}
							className="truncate"
						>
							{participant.position}
						</div>
					</GridItem>
				}
				<GridItem
					xs={isMobile? 2 : 1}
					lg={isMobile? 2 : 1}
					md={isMobile? 2 : 1}
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between"
					}}
				>
					{true && <MuteToggleButton
						translate={translate}
						participant={participant}
						refetch={data.refetch}
					/>}
				</GridItem>
				<GridItem
					xs={isMobile? 2 : 1}
					lg={isMobile? 2 : 1}
					md={isMobile? 2 : 1}
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between"
					}}
				>
					<ChangeRequestWordButton
						translate={translate}
						participant={participant}
						refetch={data.refetch}
					/>
				</GridItem>
				<GridItem
					xs={isMobile? 2 : 1}
					lg={isMobile? 2 : 1}
					md={isMobile? 2 : 1}
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between"
					}}
				>
					<VideoParticipantMenu
						council={council}
						participant={participant}
						refetch={data.refetch}
						setBanParticipant={() =>
							setOptions({ ...options, banParticipant: participant })
						}
						setParticipantHistory={() =>
							setOptions({ ...options, participantHistory: participant })
						}
						translate={translate}
					/>
				</GridItem>
			</Grid>
		);
	}

	const participantLiveColor = participant => {
		if (participant.online !== 1) {
			return "crimson";
		} else {
			if(exceedsOnlineTimeout(participant.lastDateConnection)){
				props.changeParticipantOnlineState({
					variables: {
						participantId: participant.id,
						online: 2
					}
				});
				return 'crimson';
			}
		}
		return getSecondary();
	}

	const _button = () => {
		const videoParticipants = !data.videoParticipants
			? []
			: data.videoParticipants.list;

		return (
			<VideoParticipantsStats
				videoFullScreen={screenSize === 'MAX'}
				translate={translate}
				stats={{
					...stats,
					total: videoParticipants.length
				}}
				toggleFullScreen={props.toggleFullScreen}
			/>
		);
	}

	const _section = () => {
		const { videoParticipants } = data;

		if (!data.videoParticipants) {
			return <LoadingSection />;
		}

		const preparedParticipants = prepareParticipants([...videoParticipants.list]);
		const slicedParticipants = preparedParticipants.slice((options.page - 1) * options.limit, ((options.page - 1) * options.limit) + options.limit);

		return (
			<div style={{ backgroundColor: darkGrey, width: "100%", height: `calc(100vh - ${props.videoHeight} - 5em)`, padding: "0.75em", position: "relative", overflow: "hidden" }}>
				<div style={{height: `calc(100% - ${videoParticipants.list.length > options.limit? '3em' : '0px'})`}}>
					<Scrollbar>
						{slicedParticipants.map(participant => {
							return _participantEntry(participant);
						})}
					</Scrollbar>
				</div>
				{videoParticipants.list.length > options.limit &&
					<div style={{height: '2em', display: 'flex', alignItems: 'center', borderTop: '1px solid gainsboro', width: '100%', justifyContent: 'flex-end', paddingTop: '0.3em'}}>
							{_paginationFooter(videoParticipants)}
					</div>
				}
			</div>
		);
	}

	const _paginationFooter = participants => {
		return (
			<div style={{display: 'flex', color: 'white', fontWeight: '700', alignItems: 'center', paddingTop: '0.5em'}}>
				{options.page > 1 &&
					<div onClick={() => setOptions({ ...options, page: options.page - 1})} style={{color: 'white', userSelect: 'none', fontSize: '1em', border: '1px solid white', padding: '0 0.2em', cursor: 'pointer'}}>{'<'}</div>
				}
				<div style={{margin: '0 0.3em'}}>{options.page}</div>
				{(options.page < (participants.list.length / options.limit)) &&
					<div onClick={() => setOptions({ ...options, page: options.page + 1})} style={{color: 'white', userSelect: 'none', fontSize: '1em', border: '1px solid white', padding: '0 0.2em', cursor: 'pointer'}}>{'>'}</div>
				}

			</div>
		)
	}

	const CMPVideo = true;//this.props.videoURL && this.props.videoURL.includes('councilbox');

	if (screenSize === 'MAX') {
		return <div style={{ height: "100%" }}>{CMPVideo && _button()}</div>;
	}
	return (
		<div style={{height: '100%'}}>
			{CMPVideo &&
				<React.Fragment>
					<CollapsibleSection
						trigger={_button}
						controlled={true}
						collapse={_section}
						open={true}
						style={{ cursor: 'auto'}}
					/>
					<AlertConfirm
						requestClose={() =>
							setOptions({ ...options, banParticipant: false })
						}
						open={options.banParticipant}
						acceptAction={banParticipant}
						buttonAccept={translate.accept}
						buttonCancel={translate.cancel}
						bodyText={
							<div>
								{!!options.banParticipant &&
									`${translate.want_eject} ${
										options.banParticipant.name
									} ${options.banParticipant.surname || ''} ${
										translate.from_room
									}?`
								}
							</div>
						}
						title={translate.attention}
					/>
					{!!options.participantHistory && (
						<ParticipantHistoryModal
							requestClose={() =>
								setOptions({ ...options, participantHistory: false })
							}
							participant={options.participantHistory}
							translate={translate}
						/>
					)}
				</React.Fragment>
			}
		</div>
	);

}

const prepareParticipants = participants => {
	return participants.sort((a, b) => {
		if(a.online === 1 && b.online !== 1) {
			return -1;
		}
		if(a.online !== 1 && b.online === 1){
			return 1;
		}
		return 0;
	})
}

const changeParticipantOnlineState = gql`
    mutation changeParticipantOnlineState($participantId: Int!, $online: Int!){
        changeParticipantOnlineState(participantId: $participantId, online: $online){
            success
            message
        }
    }
`;

export default compose(
	graphql(videoParticipants, {
		options: props => ({
			variables: {
				councilId: props.councilId
			},
			fetchPolicy: "network-only",
			notifyOnNetworkStatusChange: true,
			pollInterval: 8000
		})
	}),

	graphql(changeRequestWord, {
		name: "changeRequestWord"
	}),

	graphql(banParticipant, {
		name: "banParticipant"
	}),

	graphql(changeParticipantOnlineState, {
		name: 'changeParticipantOnlineState'
	})
)(ParticipantsLive);
