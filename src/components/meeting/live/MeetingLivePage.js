import React from "react";
import { LoadingMainApp } from "../../../displayComponents";
import LiveHeader from "../../council/live/LiveHeader";
import { lightGrey } from "../../../styles/colors";
import { compose, graphql } from "react-apollo";
import {
	councilLiveQuery,
	iframeURLTEMP,
	majorityTypes,
	quorumTypes,
	votingTypes
} from "../../../queries";
import withSharedProps from '../../../HOCs/withSharedProps';

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
		fullScreen: false
	};

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
		return this.props.data.loading;
	};

	render() {
		const { translate, company } = this.props;

		if (this.checkLoadingComplete()) {
			return <LoadingMainApp />;
		}
		

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
					logo={!!company && company.logo}
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
)(withSharedProps()(MeetingLivePage));
