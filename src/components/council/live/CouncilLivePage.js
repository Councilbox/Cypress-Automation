import React from "react";
import { DisabledSection, FabButton, Icon, LoadingMainApp } from "../../../displayComponents";
import LiveHeader from "./LiveHeader";
import { darkGrey, lightGrey } from "../../../styles/colors";
import { graphql } from "react-apollo";
import { councilLiveQuery } from "../../../queries";
import AgendaManager from "./AgendaManager";
import ParticipantsLive from "./ParticipantsLive";
import ParticipantsManager from "./participants/ParticipantsManager";
import CommentWall from "./CommentWall";
import { showVideo, councilHasSession, showNumParticipations, formatInt } from "../../../utils/CBX";
import { Tooltip, Badge, Tabs, Tab } from "material-ui";
import { bHistory } from '../../../containers/App';
import { checkCouncilState } from '../../../utils/CBX';
import { config, videoVersions } from '../../../config';
import CMPVideoIFrame from './video/CMPVideoIFrame';
import { useOldState } from "../../../hooks";
import { isMobile } from '../../../utils/screen';
import QuorumDisplay from "./quorum/QuorumDisplay";
import { COUNCIL_STATES } from "../../../constants";
import ResumeCouncilButton from "./menus/ResumeCouncilButton";
const calcMinWidth = () => window.innerWidth * 0.38 > 450 ? 35 : 100 / (window.innerWidth / 450);
const calcMinHeight = () => "42vh";

let minVideoWidth = calcMinWidth();
let minVideoHeight = calcMinHeight();

const initScreenSizes = size => {
	const sizes = {
		'MIN': () => {
			localStorage.setItem('screenSize', 'MIN');
			return ({
				videoWidth: minVideoWidth,
				videoHeight: minVideoHeight,
				fullScreen: false,
				participants: false,
				screenSize: 'MIN'
			})
		},
		'MED': () => {
			localStorage.setItem('screenSize', 'MED');
			return {
				videoWidth: minVideoWidth * 1.40,
				videoHeight: '56vh',
				fullScreen: false,
				participants: false,
				screenSize: 'MED'
			}
		},
		'MAX': () => {
			localStorage.setItem('screenSize', 'MAX');
			return {
				fullScreen: true,
				videoWidth: 94,
				videoHeight: '100%',
				participants: false,
				screenSize: 'MAX'
			}
		}
	}

	return sizes[size] ? sizes[size]() : sizes['MIN']();
}



const CouncilLivePage = ({ translate, data, ...props }) => {
	const [state, setState] = useOldState({
		participants: true,
		wall: false,
		unreadComments: 0,
		videoURL: '',
		wallTooltip: false,
		...initScreenSizes(localStorage.getItem('screenSize') || 'MIN')
	});
	const agendaManager = React.useRef(null);
	const company = props.companies.list[props.companies.selected];

	React.useEffect(() => {
		if (!data.loading) {
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

	}, [data.loading, data.council]);

	const updateMinSizes = React.useCallback(() => {
		minVideoWidth = calcMinWidth();
		minVideoHeight = calcMinHeight();
		if (!state.screenSize === 'MIN') {
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

	const toggleScreens = screen => {
		const cb = () => {
			setState({
				participants: screen,
				videoWidth: minVideoWidth,
				videoHeight: minVideoHeight,
				fullScreen: false
			});
		}

		if (agendaManager.current) {
			if (agendaManager.current.wrappedInstance) {
				if (agendaManager.current.wrappedInstance.state.editedVotings) {
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
		if (state.screenSize === 'MIN') {
			setState(initScreenSizes('MED'));
		}

		if (state.screenSize === 'MED') {
			setState(initScreenSizes('MAX'));
		}

		if (state.screenSize === 'MAX') {
			setState(initScreenSizes('MIN'));
		}
	};
	const { council } = data;

	const councilStartedState = () => {
		return council.state >= 20 && council.state <= 30;
	}


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
				council={council}
				translate={translate}
				participants={state.participants}
				toggleScreens={toggleScreens}
				recount={data.councilRecount}
				refetch={data.refetch}
			/>

			<div
				style={{
					position: "absolute",
					bottom: "5%",
					right: state.fullScreen ? "5%" : "2%",
					display: "flex",
					flexDirection: "column",
					zIndex: 2
				}}
			>
				{(councilStartedState() && council.wallActive === 1) &&
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
									videoHeight={state.videoHeight}
									screenSize={state.screenSize}
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
									{(config.videoEnabled && config.videoVersion === videoVersions.CMP) &&
										<CMPVideoIFrame
											council={council}
											translate={translate}
											videoURL={state.videoURL}
											setVideoURL={setVideoURL}
										/>
									}
									{(council.room && council.room.htmlVideoCouncil && config.videoEnabled && config.videoVersion !== videoVersions.CMP) &&
										<div
											style={{ height: '100%', width: '100%' }}
											dangerouslySetInnerHTML={{ __html: council.room.htmlVideoCouncil }}
										/>
									}
									<div
										style={{
											borderRadius: "5px",
											cursor: "pointer",
											position: "absolute",
											right: "5%",
											top: "16px",
											backgroundColor:
												"rgba(0, 0, 0, 0.5)",
											width: "2.9em",
											height: "2.9em",
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
								</div>
							</React.Fragment>
						}
						{!state.fullScreen && (
							<div
								style={{
									height: `calc(100% - ${state.videoHeight})`,
									width: "100%",
									overflow: "hidden",
									backgroundColor: darkGrey
								}}
							>
								<ParticipantsLive
									councilId={props.councilID}
									council={council}
									videoURL={state.videoURL}
									videoHeight={state.videoHeight}
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
						height: "100%",
						marginLeft: "5px",
						position: 'relative'
					}}
				>
					{isMobile ?
						state.participants && !state.fullScreen ? (
							<ParticipantsManager
								translate={translate}
								participants={data.council.participants}
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
							)
						:
						<React.Fragment>
							{!state.fullScreen &&
								<Tabs value={state.participants ? 0 : 1}>
									<Tab label={translate.participants} onClick={() => toggleScreens(true)} />
									<Tab label={translate.agenda} onClick={() => toggleScreens(false)} id={'ordenDelDiaParticipantesButton'} />
									<div style={{
										width: '100%',
										display: 'flex',
										justifyContent: 'flex-end',
										alignItems: 'center',
										paddingRight: '1em'
									}}>
										{data.councilRecount &&
											<>
												<QuorumDisplay
													company={company}
													recount={data.councilRecount}
													council={council}
													translate={translate}
												/>
											</>

										}

									</div>
								</Tabs>
							}
							<div style={{ height: "100%" }}>
								{(state.participants && !state.fullScreen) &&
									<div style={{ height: "calc( 100% - 2em )" }}>
										<ParticipantsManager
											stylesDiv={{ margin: "0", height: "calc( 100% - 1.8em )", borderTop: "1px solid #e7e7e7", width: "100%" }}
											translate={translate}
											participants={data.council.participants}
											council={council}
										/>
									</div>
								}
								{(!state.participants || state.fullScreen) &&
									<div style={{ height: "calc( 100% - 2em )", position: 'relative' }}>
										{council.state === COUNCIL_STATES.PAUSED &&
											<DisabledSection>
												<div style={{marginBottom: '1em'}}>
													{translate.council_paused}
												</div>
												<ResumeCouncilButton
													council={council}
													translate={translate}
													refetch={data.refetch}
												/>
											</DisabledSection>
										}
										<div style={{ borderTop: "1px solid #e7e7e7", height: "calc( 100% - 1.8em )", width: "100%" }}>
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
										</div>
									</div>
								}
							</div>
						</React.Fragment>
					}
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

