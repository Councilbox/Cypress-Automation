import React, { Component, Fragment } from "react";
import { LoadingMainApp } from "../../../displayComponents";
import LiveHeader from "../../council/live/LiveHeader";
import { darkGrey, lightGrey } from "../../../styles/colors";
import { compose, graphql } from "react-apollo";
import {
	councilLiveQuery,
	iframeURLTEMP,
	majorityTypes,
	quorumTypes,
	votingTypes
} from "../../../queries";
import ParticipantsLive from "../../council/live/ParticipantsLive";

const minVideoWidth = 30;
const minVideoHeight = "50%";

class MeetingLivePage extends Component {
	closeAddParticipantModal = () => {
		this.setState({
			addParticipantModal: false
		});
	};
	checkVideoFlags = () => {
		const council = this.props.data.council;
		return council.state === 20 && council.councilType === 0;
	};
	checkLoadingComplete = () => {
		return this.props.data.loading && this.props.companies.list;
	};

	constructor(props) {
		super(props);
		this.state = {
			participants: false,
			confirmModal: false,
			selectedPoint: 0,
			addParticipantModal: false,
			showParticipants: false,
			videoWidth: minVideoWidth,
			videoHeight: minVideoHeight,
			fullScreen: false
		};
	}

	componentDidMount() {
		this.props.data.refetch();
		/*window.addEventListener("beforeunload", (ev) => {
         ev.preventDefault();
         return ev.returnValue = 'Are you sure you want to close?';
         });*/
	}

	componentWillUnmount() {
		//window.removeListener('beforeunload');
	}

	render() {
		const council = this.props.data.council;
		const { translate } = this.props;
		const roomURL = this.props.room.roomVideoURL;

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
					overflow: "hidden",
					backgroundColor: lightGrey,
					fontSize: "1em"
				}}
			>
				<LiveHeader
					logo={company.logo}
					companyName={company.businessName}
					councilName={'Meeting'}
					translate={translate}
				/>
				<div
					style={{
						display: "flex",
						width: "100%",
						height: "100%",
						flexDirection: "row"
					}}
				>
					<iframe
						title="meetingScreen"
						allow="geolocation; microphone; camera"
						scrolling="no"
						className="temp_video"
						src={`https://cmp.councilbox.com/meet/public?rand=${Date.now()}`}
						allowFullScreen="true"
						style={{
							border: "none !important"
						}}
					>
						Something wrong...
					</iframe>
				</div>
			</div>
		);
	}
}

export default compose(
	graphql(majorityTypes, {
		name: "majorities"
	}),

	graphql(votingTypes, {
		name: "votations"
	}),

	graphql(quorumTypes, {
		name: "quorum"
	}),

	graphql(councilLiveQuery, {
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
	})
)(MeetingLivePage);
