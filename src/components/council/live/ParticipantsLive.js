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
import { isMobile } from 'react-device-detect';



class ParticipantsLive extends React.Component {
	state = {
		online: "-",
		offline: "-",
		broadcasting: "-",
		banned: "-",
		banParticipant: false,
		page: 1,
		limit: isMobile? 15 : 10
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
						color: this.participantLiveColor(participant)
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
					color: this.participantLiveColor(participant)
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

	participantLiveColor = participant => {
		if (participant.online !== 1) {
			return "crimson";
		} else {
			if(exceedsOnlineTimeout(participant.lastDateConnection)){
				this.props.changeParticipantOnlineState({
					variables: {
						participantId: participant.id,
						online: 2
					}
				});
				return 'crimson';
			}
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

		const preparedParticipants = prepareParticipants([...videoParticipants.list]);
		const slicedParticipants = preparedParticipants.slice((this.state.page - 1) * this.state.limit, ((this.state.page - 1) * this.state.limit) + this.state.limit);

		return (
			<div style={{ backgroundColor: darkGrey, width: "100%", height: `calc(100vh - ${!isMobile? '45vh' : '17vh'} - 5em)`, padding: "0.75em", position: "relative", overflow: "hidden" }}>
				<div style={{height: `calc(100% - ${videoParticipants.list.length > 10? '1.5em' : '0px'})`}}>
					<Scrollbar>
						{slicedParticipants.map(participant => {
							return this._participantEntry(participant);
						})}
					</Scrollbar>
				</div>
				{videoParticipants.list.length > this.state.limit &&
					<div style={{height: '2em', display: 'flex', alignItems: 'center', borderTop: '1px solid gainsboro', width: '100%', justifyContent: 'flex-end', paddingTop: '0.3em'}}>
							{this._paginationFooter(videoParticipants)}
					</div>
				}
			</div>
		);
	};

	_paginationFooter = participants => {
		return (
			<div style={{display: 'flex', color: 'white', fontWeight: '700', alignItems: 'center', paddingTop: '0.5em'}}>
				{this.state.page > 1 &&
					<div onClick={() => this.setState({page: this.state.page - 1})} style={{color: 'white', userSelect: 'none', fontSize: '1em', border: '1px solid white', padding: '0 0.2em', cursor: 'pointer'}}>{'<'}</div>
				}
				<div style={{margin: '0 0.3em'}}>{this.state.page}</div>
				{(this.state.page < (participants.list.length / this.state.limit)) &&
					<div onClick={() => this.setState({page: this.state.page + 1})} style={{color: 'white', userSelect: 'none', fontSize: '1em', border: '1px solid white', padding: '0 0.2em', cursor: 'pointer'}}>{'>'}</div>
				}

			</div>
		)
	}

	render() {
		const { videoFullScreen, translate } = this.props;
		const CMPVideo = true;//this.props.videoURL && this.props.videoURL.includes('councilbox');

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
