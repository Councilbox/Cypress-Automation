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
import { compose, graphql } from "react-apollo";
import { changeRequestWord, videoParticipants, banParticipant } from "../../../queries";
import { Tooltip } from "material-ui";
import { exceedsOnlineTimeout, participantIsBlocked, isAskingForWord } from "../../../utils/CBX";
import VideoParticipantMenu from "./videoParticipants/VideoParticipantMenu";
import ChangeRequestWordButton from "./videoParticipants/ChangeRequestWordButton";
import VideoParticipantsStats from "./videoParticipants/VideoParticipantsStats";
import ParticipantHistoryModal from "./videoParticipants/ParticipantHistoryModal";
import MuteToggleButton from './videoParticipants/MuteToggleButton';
import { isMobile } from 'react-device-detect';


class ParticipantsLive extends React.Component {
	state = {
		online: "-",
		offline: "-",
		broadcasting: "-",
		banned: "-",
		banParticipant: false
	};

	static getDerivedStateFromProps(nextProps, prevState) {
		if (!nextProps.data.loading) {
			if (nextProps.data.videoParticipants) {
				if (nextProps.data.videoParticipants.list.length > 0) {
					let online = 0;
					let offline = 0;
					let broadcasting = 0;
					let askingForWord = 0;
					let banned = 0;
					nextProps.data.videoParticipants.list.forEach(
						participant => {
							if (participantIsBlocked(participant)) {
								banned++;
							}
							if(isAskingForWord(participant)){
								askingForWord++;
							}
							if (exceedsOnlineTimeout(participant.lastDateConnection)) {
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
						banned
					};
				}
			}
		}
		return null;
	}

	banParticipant = async () => {
		const response = await this.props.banParticipant({
			variables: {
				participantId: this.state.banParticipant.id
			}
		});

		if (response) {
			if (response.data.banParticipant.success) {
				this.props.data.refetch();
				this.setState({
					banParticipant: false
				});
			}
		}
	};

	_participantVideoIcon = participant => {
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
						color: this.participantLiveColor(
							participant.lastDateConnection
						)
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
					color: this.participantLiveColor(
						participant.lastDateConnection
					)
				}}
			>
				videocam
			</Icon>
		);
	};

	_participantEntry = participant => {
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
					{this._participantVideoIcon(participant)}
					<Tooltip
						title={`${participant.name} ${participant.surname}`}
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
							{`${participant.name} ${participant.surname}`}
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
						translate={this.props.translate}
						participant={participant}
						refetch={this.props.data.refetch}
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
						translate={this.props.translate}
						participant={participant}
						refetch={this.props.data.refetch}
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
						council={this.props.council}
						participant={participant}
						refetch={this.props.data.refetch}
						setBanParticipant={() =>
							this.setState({ banParticipant: participant })
						}
						setParticipantHistory={() =>
							this.setState({ participantHistory: participant })
						}
						translate={this.props.translate}
					/>
				</GridItem>
			</Grid>
		);
	};

	participantLiveColor = date => {
		if (exceedsOnlineTimeout(date)) {
			return "crimson";
		}
		return getSecondary();
	};

	_button = () => {
		const videoParticipants = !this.props.data.videoParticipants
			? []
			: this.props.data.videoParticipants.list;

		return (
			<VideoParticipantsStats
				videoFullScreen={this.props.videoFullScreen}
				translate={this.props.translate}
				stats={{
					...this.state,
					total: videoParticipants.length
				}}
				toggleFullScreen={this.props.toggleFullScreen}
			/>
		);
	};

	_section = () => {
		const { videoParticipants } = this.props.data;

		if (!this.props.data.videoParticipants) {
			return <LoadingSection />;
		}

		return <div style={{ backgroundColor: darkGrey, width: "100%", height: "calc(100vh - 45vh - 4em)", padding: "0.75em", position: "relative", overflow: "hidden" }}>
				<Scrollbar>
					{videoParticipants.list.map(participant => {
						return this._participantEntry(participant);
					})}
				</Scrollbar>
			</div>;
	};

	render() {
		const { videoFullScreen, translate } = this.props;
		const CMPVideo = this.props.videoURL && this.props.videoURL.includes('councilbox');

		if (videoFullScreen) {
			return <div style={{ height: "100%" }}>{
				CMPVideo && this._button()
			}</div>;
		}
		return (
			<div style={{height: '100%'}}>
				{CMPVideo &&
					<React.Fragment>
						<CollapsibleSection
							trigger={this._button}
							controlled={true}
							collapse={this._section}
							open={true}
							style={{ cursor: 'auto'}}
						/>
						<AlertConfirm
							requestClose={() =>
								this.setState({ banParticipant: false })
							}
							open={this.state.banParticipant}
							acceptAction={this.banParticipant}
							buttonAccept={translate.accept}
							buttonCancel={translate.cancel}
							bodyText={
								<div>
									{!!this.state.banParticipant &&
										`${translate.want_eject} ${
											this.state.banParticipant.name
										} ${this.state.banParticipant.surname} ${
											translate.from_room
										}?`
									}
								</div>
							}
							title={translate.attention}
						/>
						{!!this.state.participantHistory && (
							<ParticipantHistoryModal
								requestClose={() =>
									this.setState({ participantHistory: false })
								}
								participant={this.state.participantHistory}
								translate={translate}
							/>
						)}
					</React.Fragment>
				}
			</div>
		);
	}
}

export default compose(
	graphql(videoParticipants, {
		options: props => ({
			variables: {
				councilId: props.councilId
			},
			fetchPolicy: "network-only",
			notifyOnNetworkStatusChange: true,
			pollInterval: 5000
		})
	}),

	graphql(changeRequestWord, {
		name: "changeRequestWord"
	}),

	graphql(banParticipant, {
		name: "banParticipant"
	})
)(ParticipantsLive);
