import React from "react";
import { LoadingMainApp } from "../../displayComponents";
import { darkGrey, getPrimary } from "../../styles/colors";
import { Redirect } from 'react-router-dom';
import { compose, graphql } from "react-apollo";
import gql from 'graphql-tag';
import withSharedProps from '../../HOCs/withSharedProps';
import LiveHeader from "../council/live/LiveHeader";
import { Paper } from 'material-ui';
let logo;
let icon;
import("../../assets/img/logo-icono.png").then(data => icon = data);
import("../../assets/img/logo-white.png").then(data => logo = data);


class MeetingCreateContainer extends React.Component {

	state = {
		created: false,
		error: false
	}

	async componentDidMount(){
		const response = await this.props.createMeeting();
		console.log(response);
		if(!response.errors){
			sessionStorage.setItem('sessionId', response.data.openMeetingRoom.sessionId);
			sessionStorage.setItem('meetingUrl', response.data.openMeetingRoom.url);
			this.setState({
				created: true
			});
		}else{
			this.setState({
				error: true
			});
		}
	}

	render() {
		console.log(this.props.data);
		const primary = getPrimary();

		if(this.state.error){
			return(
				<div
					style={{
						height: "100vh",
						overflow: "hidden",
						backgroundColor: darkGrey,
						fontSize: "1em"
					}}
				>
					<LiveHeader
						logo={logo}
						councilName={this.props.translate.dashboard_new_meeting}
						translate={this.props.translate}
					/>
					<div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center'}}>
						<Paper
							elevation={8}
							style={{
								width: '450px',
								height: '70%',
								marginTop: '4em',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								paddingTop: '5em'
							}}
						>
							<div>
								<img src={icon} alt="councilbox-icon" style={{ width: 'auto', height: '7em'}} />
							</div>
							<div style={{textAlign: 'center', padding: '1.1em', fontWeight: '700', marginTop: '1em'}}>
								<span style={{fontSize: '1.1em', color: primary}}>ERROR</span><br/>
								HA HABIDO UN PROBLEMA AL CONECTAR CON EL SERVIDOR, POR FAVOR INTÉNTELO MÁS TARDE
							</div>
						</Paper>
					</div>

				</div>
			)
		}

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