import React from "react";
import { FabButton, Icon, LoadingMainApp } from "../../../displayComponents";
import LiveHeader from "./LiveHeader";
import { darkGrey, lightGrey } from "../../../styles/colors";
import { graphql } from "react-apollo";
import { councilLiveQuery } from "../../../queries";
import AgendaManager from "./AgendaManager";
import ParticipantsLive from "./ParticipantsLive";
import ParticipantsManager from "./participants/ParticipantsManager";
import CommentWall from "./CommentWall";
import { showVideo } from "../../../utils/CBX";
import { Tooltip, Badge } from "material-ui";
import { bHistory } from '../../../containers/App';
import { checkCouncilState } from '../../../utils/CBX';
import { config, videoVersions } from '../../../config';
import CMPVideoIFrame from './video/CMPVideoIFrame';
import { useOldState } from "../../../hooks";
const calcMinWidth = () => window.innerWidth * 0.33 > 450 ? 33 : 100 / (window.innerWidth / 450);
const calcMinHeight = () => window.innerHeight * 0.42 > 300? "42vh" : '300px';

let minVideoWidth = calcMinWidth();
let minVideoHeight = calcMinHeight();

const CouncilLivePage = ({ translate, data, ...props}) => {
	const [state, setState] = useOldState({
		participants: true,
		wall: false,
		unreadComments: 0,
		videoURL: '',
		wallTooltip: false,
		videoWidth: minVideoWidth,
		videoHeight: minVideoHeight,
		fullScreen: false
	});
	const agendaManager = React.useRef(null);
	const company = props.companies.list[props.companies.selected];

	React.useEffect(() => {
		if(!data.loading){
			checkCouncilState(
				{
					state: data.council.state,
					id: data.council.id
				},
				company,
				bHistory,
				"live"
			);
		}

	}, [data.loading]);

	const updateMinSizes = React.useCallback(() => {
		minVideoWidth = calcMinWidth();
		minVideoHeight = calcMinHeight();
		if (!state.fullScreen) {
			setState({
				videoWidth: minVideoWidth,
				videoHeight: minVideoHeight,
			});
		}
	}, [window.innerHeight, window.innerWidth]);

	React.useEffect(() => {
		window.addEventListener('resize', updateMinSizes);
	}, [updateMinSizes]);

	const setVideoURL = url => {
		setState({
			videoURL: url
		})
	}

	const toggleScreens = () => {
		const cb = () => {
			setState({
				participants: !state.participants,
				videoWidth: minVideoWidth,
				videoHeight: minVideoHeight,
				fullScreen: false
			});
		}

		if(agendaManager.current){
			if(agendaManager.current.wrappedInstance){
				if(agendaManager.current.wrappedInstance.state.editedVotings){
					return agendaManager.current.wrappedInstance.showVotingsAlert(cb);
				} else {
					return cb();
				}
			}
		}
		cb();
	}

	const updateState = object => {
		setState({
			...object
		});
	};

	const checkLoadingComplete = () => {
		return data.council && props.companies.list;
	};

	const toggleWall = () => {
		setState({ wall: !state.wall });
	}

	const toggleFullScreen = () => {
		if (state.fullScreen) {
			setState({
				videoWidth: minVideoWidth,
				videoHeight: minVideoHeight,
				fullScreen: false,
				participants: false
			});
		} else {
			setState({
				videoWidth: 94,
				videoHeight: "100%",
				fullScreen: true
			});
		}
	};

	const { council } = data;

	if (!checkLoadingComplete()) {
		return <LoadingMainApp />;
	}


	return (
		<div
			style={{
				height: "100%",
				width: "100vw",
				overflow: "hidden",
				backgroundColor: 'white',
				fontSize: "1em",
				position: "relative"
			}}
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
					right: state.fullScreen? "5%" : "2%",
					display: "flex",
					flexDirection: "column",
					zIndex: 2
				}}
			>
				{(council.state === 20 || council.state === 30) &&
					<Tooltip title={`${translate.wall} - (ALT + W)`} open={state.wallTooltip}>
						<div>
							{state.unreadComments > 0 ?
								<Badge
									classes={{
										badge: 'fadeToggle'
									}}
									badgeContent={
										<span
											style={{
												color: "white",
												fontWeight: "700",
											}}
										>
											{state.unreadComments}
										</span>
									}
									color="secondary"
								>
									<div style={{ marginBottom: "0.3em" }}>
										<FabButton
											mode="intermitent"
											icon={
												<Icon className="material-icons">
													chat
												</Icon>
											}
											onClick={toggleWall}
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
										onClick={toggleWall}
									/>
								</div>
							}
						</div>
					</Tooltip>
				}
				<Tooltip
					title={
						state.participants
							? translate.agenda
							: translate.participants
					}
				>
					<div>
						<FabButton
							icon={
								<React.Fragment>
									<Icon className="material-icons">
										{state.participants
											? "developer_board"
											: "group"}
									</Icon>
									<Icon className="material-icons">
										{state.participants
											? "keyboard_arrow_left"
											: "keyboard_arrow_right"}
									</Icon>
								</React.Fragment>
							}
							onClick={toggleScreens}
						/>
					</div>
				</Tooltip>
			</div>

			<CommentWall
				translate={translate}
				open={state.wall}
				council={council}
				unreadComments={state.unreadComments}
				updateState={updateState}
				requestClose={toggleWall}
			/>

			<div
				style={{
					display: "flex",
					width: "100%",
					height: "calc(100% - 3em)",
					flexDirection: "row",
					overflow: "hidden"
				}}
			>
				{showVideo(council) && (
					<div
						style={{
							display: "flex",
							flexDirection: state.fullScreen
								? "row"
								: "column",
							width: `${state.videoWidth}%`,
							height: "100%",
							overflow: "hidden",
							position: "relative",
							backgroundColor: darkGrey,
						}}
					>
						{state.fullScreen && (
							<div
								style={{
									height: "100%",
									width: "5%",
									overflow: "hidden",
									backgroundColor: darkGrey
								}}
							>
								<ParticipantsLive
									councilId={props.councilID}
									council={council}
									videoURL={state.videoURL}
									translate={translate}
									videoFullScreen={state.fullScreen}
									toggleFullScreen={toggleFullScreen}
								/>
							</div>
						)}

						{
							<React.Fragment>
								<div
									style={{
										height: state.videoHeight,
										width: "100%",
										overflow: 'hidden',
										backgroundColor: darkGrey,
										position: "relative",
										transition: 'width 0.8s, height 0.6s',
										transitionTimingFunction: 'ease'
									}}
								>
									{config.videoEnabled && config.videoVersion === videoVersions.CMP &&
										<CMPVideoIFrame
											council={council}
											translate={translate}
											videoURL={state.videoURL}
											setVideoURL={setVideoURL}
										/>
									}
									{council.room && council.room.htmlVideoCouncil && config.videoEnabled && config.videoVersion !== videoVersions.CMP &&
										<div
											style={{ height: '100%', width: '100%' }}
											dangerouslySetInnerHTML={{ __html: council.room.htmlVideoCouncil }}
										/>
									}

									<Tooltip title={`ALT + T`}>
										<div
											style={{
												borderRadius: "5px",
												cursor: "pointer",
												position: "absolute",
												right: "5%",
												top: "20px",
												backgroundColor:
													"rgba(0, 0, 0, 0.5)",
												width: "2.5em",
												height: "2.5em",
												display: "flex",
												alignItems: "center",
												justifyContent: "center"
											}}
											onClick={toggleFullScreen}
										>
											<Icon
												className="material-icons"
												style={{ color: lightGrey }}
											>
												{state.fullScreen
													? "zoom_out"
													: "zoom_in"}
											</Icon>
										</div>
									</Tooltip>
								</div>
							</React.Fragment>
						}
						{!state.fullScreen && (
							<div
								style={{
									height: `calc(100% - ${minVideoHeight})`,
									width: "100%",
									overflow: "hidden",
									backgroundColor: darkGrey
								}}
							>
								<ParticipantsLive
									councilId={props.councilID}
									council={council}
									videoURL={state.videoURL}
									translate={translate}
									videoFullScreen={state.fullScreen}
									toggleFullScreen={toggleFullScreen}
								/>
							</div>
						)}
					</div>
				)}

				<div
					style={{
						width: `${
							showVideo(council)
								? 100 - state.videoWidth - '0.5'
								: 100
							}%`,
						height: "100%"
					}}
				>
					{state.participants && !state.fullScreen ? (
						<ParticipantsManager
							translate={translate}
							participants={
								data.council.participants
							}
							council={council}
						/>
					) : (
							<AgendaManager
								ref={agendaManager}
								recount={data.councilRecount}
								council={council}
								company={company}
								translate={translate}
								fullScreen={state.fullScreen}
								refetch={data.refetch}
								openMenu={() =>
									setState({
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

export default graphql(councilLiveQuery, {
	name: "data",
	options: props => ({
		variables: {
			councilID: props.councilID
		},
		pollInterval: 10000
	})
})(CouncilLivePage);

