import React from "react";
import { lightGrey } from "../../../styles/colors";
import { bHistory } from '../../../containers/App';
import withSharedProps from '../../../HOCs/withSharedProps';
import withWindowSize from '../../../HOCs/withWindowSize';
import { Icon } from '../../../displayComponents';

let logo;
import("../../../assets/img/logo-white.png").then(data => logo = data);

const minVideoWidth = 30;
const minVideoHeight = "50%";


class MeetingLivePage extends React.Component {

	state = {
		participants: false,
		confirmModal: false,
		selectedPoint: 0,
		addParticipantModal: false,
		showParticipants: false,
		videoWidth: minVideoWidth,
		videoHeight: minVideoHeight,
		fullScreen: false,
		url: sessionStorage.getItem('meetingUrl'),
	};

	componentDidMount() {
		if(!this.state.url){
			bHistory.push('/');
		}
	}

	componentWillUnmount() {
		sessionStorage.removeItem('meetingUrl');
	}

	closeAddParticipantModal = () => {
		this.setState({
			addParticipantModal: false
		});
	};

	checkVideoFlags = () => {
		const council = this.props.data.council;
		return council.state === 20 && council.councilType === 0;
	};

	rand = Date.now();

	render() {
		return (
			<div
				style={{
					height: "100vh",
					overflow: "hidden",
					backgroundColor: lightGrey,
					fontSize: "1em"
				}}
			>
			<div
				elevation={0}
				style={{
					background: '#212121',
					display: "flex",
					width: "100%",
					userSelect: "none",
					position: "absolute",
					zIndex: 1000,
					height: "3em",
					alignItems: "center",
					justifyContent: "space-between"
				}}
			>
					<div style={{ width: "20%" }}>
						<img
							src={logo}
							className="App-logo"
							style={{
								height: "1.5em",
								marginLeft: "2em"
							}}
							alt="logo"
						/>
					</div>
					<div
						style={{
							width: "35%",
							marginRight: "10%",
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
						}}
					>
					</div>
					<div
						style={{
							width: "10%",
							display: "flex",
							flexDirection: "row",
							justifyContent: "flex-end",
							paddingRight: "2em"
						}}
					>
						{/*<Icon
                     className="material-icons"
                     style={{fontSize: '1.5em', color: 'white'}}
                     >
                     help
                     </Icon>*/}
						<Icon
							className="material-icons"
							style={{
								fontSize: "1.5em",
								color: 'white',
								cursor: "pointer"
							}}
							onClick={() =>
								bHistory.goBack()
							}
						>
							exit_to_app
						</Icon>
					</div>
				</div>
				<div
					style={{
						height: "3em",
						width: "100%"
					}}
				/>
				<div
					style={{
						display: "flex",
						width: "100%",
						height: "calc(100vh - 3em)",
						flexDirection: "row"
					}}
				>
				{!!this.state.url &&
					<iframe
						title="meetingScreen"
						allow="geolocation; microphone; camera"
						scrolling="no"
						className="temp_video"
						src={`https://${this.state.url}?rand=${this.rand}`}
						allowFullScreen={true}
						style={{
							border: "none !important"
						}}
					>
						Something wrong...
					</iframe>
				}
				</div>
			</div>
		);
	}
}

export default (withSharedProps()(withWindowSize(MeetingLivePage)));


/* graphql(councilLiveQuery, {
	name: "data",
	options: props => ({
		variables: {
			councilID: props.councilID
		}
	})
}),

graphql(iframeURLTEMP, {
	name: "room",
	options: props => ({
		variables: {
			councilId: props.councilID,
			participantId: "Mod"
		}
	})
}) */