import React from "react";
import { lightGrey } from "../../../styles/colors";
import { bHistory } from '../../../containers/App';
import withSharedProps from '../../../HOCs/withSharedProps';
import withWindowSize from '../../../HOCs/withWindowSize';
import { Icon } from '../../../displayComponents';
import { ConfigContext } from "../../../containers/AppControl";
import { useOldState } from "../../../hooks";
//import { useAdom } from 'adom-client';

let logo;
import("../../../assets/img/logo-white.png").then(data => logo = data);

const minVideoWidth = 30;
const minVideoHeight = "50%";

const rand = Date.now();

const MeetingLivePage = ({ data }) => {
	const [state, setState] = useOldState({
		participants: false,
		confirmModal: false,
		selectedPoint: 0,
		addParticipantModal: false,
		showParticipants: false,
		videoWidth: minVideoWidth,
		videoHeight: minVideoHeight,
		fullScreen: false,
		url: sessionStorage.getItem('meetingUrl'),
	});
	//const config = React.useContext(ConfigContext);
	//const adom = useAdom();

	//console.log(adom);

	const init = () => {
		//adom.initialize();
	}

	React.useEffect(() => {
		if(!state.url){
			bHistory.push('/');
		}
		return () => sessionStorage.removeItem('meetingUrl');
	}, [state.url]);

	const closeAddParticipantModal = () => {
		setState({
			addParticipantModal: false
		});
	};

	const checkVideoFlags = () => {
		const council = data.council;
		return council.state === 20 && council.councilType === 0;
	};

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
				<Icon
					className="material-icons"
					style={{
						fontSize: "1.5em",
						color: 'white',
						cursor: "pointer"
					}}
					onClick={bHistory.goBack}
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
			{!!state.url &&
				<iframe
					title="meetingScreen"
					allow="geolocation; microphone; camera"
					scrolling="no"
					className="temp_video"
					src={`https://${state.url}?rand=${rand}`}
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


export default (withSharedProps()(withWindowSize(MeetingLivePage)));