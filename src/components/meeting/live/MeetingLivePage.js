import React from "react";
import { LoadingMainApp } from "../../../displayComponents";
import LiveHeader from "../../council/live/LiveHeader";
import { lightGrey } from "../../../styles/colors";
import { bHistory } from '../../../containers/App';
import { compose, graphql } from "react-apollo";
import {
	councilLiveQuery,
	iframeURLTEMP,
	majorityTypes,
	quorumTypes,
	votingTypes
} from "../../../queries";
import withSharedProps from '../../../HOCs/withSharedProps';
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
		/*window.addEventListener("beforeunload", (ev) => {
         ev.preventDefault();
         return ev.returnValue = 'Are you sure you want to close?';
         });*/
	}

	componentWillUnmount() {
		//window.removeListener('beforeunload');
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

	render() {
		const { translate, company } = this.props;

		return (
			<div
				style={{
					height: "100vh",
					overflow: "hidden",
					backgroundColor: lightGrey,
					fontSize: "1em"
				}}
			>
				<LiveHeader
					logo={!!company? company.logo : logo}
					companyName={!!company && company.businessName}
					councilName={'Meeting'}
					translate={translate}
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
						src={`https://${this.state.url}?rand=${Date.now()}`}
						allowFullScreen="true"
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

export default (withSharedProps()(MeetingLivePage));


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