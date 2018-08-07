import React from "react";
import ReactDOM from "react-dom";
import { FabButton, Icon, LoadingMainApp } from "../../../displayComponents";
import LiveHeader from "./LiveHeader";
import { darkGrey, lightGrey } from "../../../styles/colors";
import { graphql } from "react-apollo";
import { councilLiveQuery } from "../../../queries";
import AgendaManager from "./AgendaManager";
import ParticipantsLive from "./ParticipantsLive";
import ParticipantsManager from "./ParticipantsManager";
import CommentWall from "./CommentWall";
import { showVideo } from "../../../utils/CBX";
import { Tooltip, Badge } from "material-ui";
import { bHistory } from '../../../containers/App';
import { checkCouncilState } from '../../../utils/CBX';
import { config, videoVersions } from '../../../config';
import { Collapse } from 'react-collapse';
import CMPVideoIFrame from './video/CMPVideoIFrame';
const minVideoWidth = 30;
const minVideoHeight = "60vh";

class CouncilLivePage extends React.Component {
	state = {
		participants: false,
		confirmModal: false,
		selectedPoint: 0,
		wall: false,
		unreadComments: 0,
		addParticipantModal: false,
		videoWidth: minVideoWidth,
		videoHeight: minVideoHeight,
		fullScreen: false
	};

	componentDidMount() {
		this.props.data.refetch();
	}

	componentDidUpdate(){
		if(!this.props.data.loading){
			const company = this.props.companies.list[
				this.props.companies.selected
			];
			checkCouncilState(
				{
					state: this.props.data.council.state,
					id: this.props.data.council.id
				},
				company,
				bHistory,
				"live"
			);
		}
	}

	closeAddParticipantModal = () => {
		this.setState({
			addParticipantModal: false
		});
	};

	updateState = object => {
		this.setState({
			...object
		});
	};

	checkLoadingComplete = () => {
		return this.props.data.loading && this.props.companies.list;
	};

	handleKeyPress = event => {
		const key = event.nativeEvent;
		if (key.altKey) {
			if (key.code === "KeyW") {
				this.setState({ wall: !this.state.wall });
			}
			if (key.code === "KeyT") {
				this.toggleFullScreen();
			}
		} else {
			switch (key.keyCode) {
				case 39:
					this.setState({
						participants: true
					});
					break;
				case 37:
					this.setState({
						participants: false
					});
					ReactDOM.findDOMNode(this.div).focus();
					break;
				default:
					return;
			}
		}
	};

	toggleFullScreen = () => {
		if (this.state.fullScreen) {
			this.setState({
				videoWidth: minVideoWidth,
				videoHeight: minVideoHeight,
				fullScreen: false,
				participants: false
			});
		} else {
			this.setState({
				videoWidth: 94,
				videoHeight: "calc(100vh - 3em)",
				fullScreen: true
			});
		}
	};

	render() {
		const { council } = this.props.data;
		const { translate } = this.props;
		console.log(config);
		console.log(config.videoVersion === 'CMP');
        console.log(config.videoVersion === videoVersions.CMP);
        console.log(config.videoEnabled && config.videoVersion === videoVersions.CMP);

		if (this.checkLoadingComplete()) {
			return <LoadingMainApp />;
		}

		const company = this.props.companies.list[
			this.props.companies.selected
		];

		return (
			<div
				style={{
					height: "100vh",
					width: "100vw",
					overflow: "hidden",
					backgroundColor: lightGrey,
					fontSize: "1em",
					position: "relative"
				}}
				tabIndex="0"
				onKeyUp={this.handleKeyPress}
				ref={ref => (this.div = ref)}
			>
				<LiveHeader
					logo={!!company && company.logo}
					companyName={!!company && company.businessName}
					councilName={council.name}
					translate={translate}
				/>

				<div
					style={{
						position: "absolute",
						bottom: "5%",
						right: "2%",
						display: "flex",
						flexDirection: "column",
						zIndex: 2
					}}
				>
					<Tooltip title={`${translate.wall} - (ALT + W)`}>
						<div>
							{this.state.unreadComments > 0 ?
								<Badge
									badgeContent={
										<span
											style={{
												color: "white",
												fontWeight: "700",
											}}
										>
											{this.state.unreadComments}
										</span>
									}
									color="secondary"
								>
									<div style={{ marginBottom: "0.3em" }}>
										<FabButton
											icon={
												<Icon className="material-icons">
													chat
												</Icon>
											}
											updateState={this.updateState}
											onClick={() =>
												this.setState({
													wall: true
												})
											}
										/>
									</div>
								</Badge>
							:
								<div style={{ marginBottom: "0.3em" }}>
									<FabButton
										icon={
											<Icon className="material-icons">
												chat
											</Icon>
										}
										updateState={this.updateState}
										onClick={() =>
											this.setState({
												wall: true
											})
										}
									/>
								</div>
							}
						</div>
					</Tooltip>
					<Tooltip
						title={
							this.state.participants
								? translate.agenda
								: translate.participants
						}
					>
						<div>
							<FabButton
								icon={
									<React.Fragment>
										<Icon className="material-icons">
											{this.state.participants
												? "developer_board"
												: "group"}
										</Icon>
										<Icon className="material-icons">
											{this.state.participants
												? "keyboard_arrow_left"
												: "keyboard_arrow_right"}
										</Icon>
									</React.Fragment>
								}
								onClick={() => {
									this.setState({
										participants: !this.state.participants,
										videoWidth: minVideoWidth,
										videoHeight: minVideoHeight,
										fullScreen: false
									});
								}}
							/>
						</div>
					</Tooltip>
				</div>

				<CommentWall
					translate={translate}
					open={this.state.wall}
					council={council}
					unreadComments={this.state.unreadComments}
					updateState={this.updateState}
					requestClose={() => this.setState({ wall: false })}
				/>

				<div
					style={{
						display: "flex",
						width: "100%",
						height: "calc(100vh - 3em)",
						flexDirection: "row",
						overflow: "hidden"
					}}
				>
					{showVideo(council) && (
						<div
							style={{
								display: "flex",
								flexDirection: this.state.fullScreen
									? "row"
									: "column",
								width: `${this.state.videoWidth}%`,
								height: "calc(100vh - 3em)",
								overflow: "hidden",
								position: "relative"
							}}
						>
							{this.state.fullScreen && (
								<div
									style={{
										height: "calc(100vh - 3em)",
										width: "5%",
										overflow: "hidden",
										backgroundColor: darkGrey
									}}
								>
									<ParticipantsLive
										councilId={this.props.councilID}
										council={council}
										translate={translate}
										videoFullScreen={this.state.fullScreen}
										toggleFullScreen={this.toggleFullScreen}
									/>
								</div>
							)}

							{
								<React.Fragment>
									<div
										style={{
											height: this.state.videoHeight,
											width: "100%",
											overflow: 'hidden',
											position: "relative",
											transition: 'width 0.8s, height 0.6s',
											transitionTimingFunction: 'ease'
										}}
									>
										{config.videoEnabled && config.videoVersion === videoVersions.CMP &&
											<CMPVideoIFrame
												council={council}
											/>
										}
										{council.room && council.room.htmlVideoCouncil && config.videoEnabled && config.videoVersion !== videoVersions.CMP &&
											<div
												style={{height: '100%', width: '100%'}}
												dangerouslySetInnerHTML={{__html: council.room.htmlVideoCouncil}}
											/>
										}

										<Tooltip title={`ALT + T`}>
											<div
												style={{
													borderRadius: "5px",
													cursor: "pointer",
													position: "absolute",
													right: "5%",
													bottom: "7%",
													backgroundColor:
														"rgba(0, 0, 0, 0.5)",
													width: "2.5em",
													height: "2.5em",
													display: "flex",
													alignItems: "center",
													justifyContent: "center"
												}}
												onClick={this.toggleFullScreen}
											>
												<Icon
													className="material-icons"
													style={{ color: lightGrey }}
												>
													{this.state.fullScreen
														? "zoom_out"
														: "zoom_in"}
												</Icon>
											</div>
										</Tooltip>
									</div>
								</React.Fragment>
							}
							{!this.state.fullScreen && (
								<div
									style={{
										height: "calc(100vh - 3em)",
										width: "100%",
										overflow: "hidden",
										backgroundColor: darkGrey
									}}
								>
									<ParticipantsLive
										councilId={this.props.councilID}
										council={council}
										translate={translate}
										videoFullScreen={this.state.fullScreen}
										toggleFullScreen={this.toggleFullScreen}
									/>
								</div>
							)}
						</div>
					)}

					<div
						style={{
							width: `${
								showVideo(council)
									? 100 - this.state.videoWidth
									: 100
							}%`,
							height: "calc(100vh - 3em)"
						}}
					>
						{this.state.participants && !this.state.fullScreen ? (
							<div
								style={{
									height: "calc(100vh - 6.5em)",
									marginTop: "3em"
								}}
							>
								<ParticipantsManager
									translate={translate}
									participants={
										this.props.data.council.participants
									}
									council={council}
								/>
							</div>
						) : (
							<AgendaManager
								ref={agendaManager =>
									(this.agendaManager = agendaManager)
								}
								recount={this.props.data.councilRecount}
								council={council}
								company={company}
								translate={translate}
								fullScreen={this.state.fullScreen}
								refetch={this.props.data.refetch}
								openMenu={() =>
									this.setState({
										videoWidth: minVideoWidth,
										videoHeight: minVideoHeight,
										fullScreen: false
									})
								}
							/>
						)}
					</div>
				</div>
			</div>
		);
	}
}

export default graphql(councilLiveQuery, {
	name: "data",
	options: props => ({
		variables: {
			councilID: props.councilID
		},
		pollInterval: 10000
	})
})(CouncilLivePage);
