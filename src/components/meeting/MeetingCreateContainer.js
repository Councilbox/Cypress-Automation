import React from "react";
import { LoadingMainApp } from "../../displayComponents";
import { Redirect } from 'react-router-dom';
import { compose, graphql } from "react-apollo";
import gql from 'graphql-tag';
import withSharedProps from '../../HOCs/withSharedProps';
let logo;
import("../../assets/img/logo-white.png").then(data => logo = data);


class MeetingCreateContainer extends React.Component {

	state = {
		created: false
	}

	async componentDidMount(){
		const response = await this.props.createMeeting();
		if(!response.errors){
			sessionStorage.setItem('sessionId', response.data.openMeetingRoom.sessionId);
			sessionStorage.setItem('meetingUrl', response.data.openMeetingRoom.url);
			this.setState({
				created: true
			});
		}
	}

	render() {
        console.log(this.props.data);
		if(!this.state.created){
            return <LoadingMainApp />
        }

		return (
			<Redirect to="/meeting" />
		);
	}
}

const createMeeting = gql`
    mutation CreateMeetingRoom{
        openMeetingRoom{
            sessionId
            url
        }
    }
`;

export default compose(
	graphql(createMeeting, {
		name: 'createMeeting'
	})
)(withSharedProps()(MeetingCreateContainer));


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