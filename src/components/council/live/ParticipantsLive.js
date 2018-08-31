import React from "react";
import {
	darkGrey,
	getSecondary,
	lightGrey,
} from "../../../styles/colors";
import {
	CollapsibleSection,
	Icon,
	LoadingSection,
	Grid,
	GridItem,
	AlertConfirm
} from "../../../displayComponents";
import { compose, graphql } from "react-apollo";
import {
	changeRequestWord,
	videoParticipants,
	banParticipant
} from "../../../queries";
import Scrollbar from "react-perfect-scrollbar";
import { Tooltip } from "material-ui";
import {
	exceedsOnlineTimeout,
	participantIsBlocked
} from "../../../utils/CBX";
import VideoParticipantMenu from "./videoParticipants/VideoParticipantMenu";
import ChangeRequestWordButton from "./videoParticipants/ChangeRequestWordButton";
import VideoParticipantsStats from "./videoParticipants/VideoParticipantsStats";
import ParticipantHistoryModal from "./videoParticipants/ParticipantHistoryModal";


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
					let banned = 0;
					nextProps.data.videoParticipants.list.forEach(
						participant => {
							if (participantIsBlocked(participant)) {
								banned++;
							}
							if (
								exceedsOnlineTimeout(
									participant.lastDateConnection
								)
							) {
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
				style={{
					display: "flex",
					flexDirection: "row",
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
				<GridItem xs={4} lg={4} md={4}>
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
				<GridItem
					xs={1}
					lg={1}
					md={1}
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
					xs={1}
					lg={1}
					md={1}
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

		return (
			<div
				style={{
					backgroundColor: darkGrey,
					width: "100%",
					height: "calc(100vh - 45vh - 6em)",
					padding: "0.75em",
					position: "relative",
					overflow: "hidden"
				}}
			>
				<Scrollbar option={{ suppressScrollX: true }}>
					{videoParticipants.list.map(participant => {
						return this._participantEntry(participant);
					})}
				</Scrollbar>
			</div>
		);
	};

	render() {
		const { videoFullScreen, translate } = this.props;

		if (videoFullScreen) {
			return <div style={{ height: "100%" }}>{this._button()}</div>;
		}
		return (
			<div>
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
