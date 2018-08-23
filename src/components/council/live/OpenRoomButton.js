import React from "react";
import { graphql } from "react-apollo";
import { openCouncilRoom } from "../../../queries/live";
import {
	AlertConfirm,
	BasicButton,
	Checkbox,
	Icon
} from "../../../displayComponents";
import { getPrimary } from "../../../styles/colors";
import { moment } from '../../../containers/App';

class OpenRoomButton extends React.Component {
	state = {
		sendCredentials: true,
		confirmModal: false,
		loading: false
	};

	componentWillReceiveProps(nextProps) {
		if (nextProps.council) {
			this.setState({
				sendCredentials: !nextProps.council.videoEmailsDate
			});
		}
	}

	openCouncilRoom = async () => {
		const { council } = this.props;
		this.setState({
			loading: true
		});
		const response = await this.props.openCouncilRoom({
			variables: {
				councilId: council.id,
				timezone: moment().utcOffset(),
				sendCredentials: this.state.sendCredentials
			}
		});
		if (response.data.openCouncilRoom.success) {
			this.setState({
				confirmModal: false,
			});
			this.props.refetch();
		}
	};

	render() {
		const { translate } = this.props;
		const primary = getPrimary();

		return (
			<React.Fragment>
				<div>
					<BasicButton
						text={translate.open_room}
						color={primary}
						loading={this.state.loading}
						onClick={() => this.setState({ confirmModal: true })}
						textPosition="before"
						icon={
							<Icon
								className="material-icons"
								style={{
									fontSize: "1.1em",
									color: "white"
								}}
							>
								play_arrow
							</Icon>
						}
						buttonStyle={{ width: "11em" }}
						textStyle={{
							color: "white",
							fontSize: "0.75em",
							fontWeight: "700",
							textTransform: "none"
						}}
					/>
				</div>
				<AlertConfirm
					title={translate.open_room}
					bodyText={
						<React.Fragment>
							<div>{translate.open_room_continue}</div>
							<Checkbox
								label={translate.send_video_credentials}
								value={this.state.sendCredentials}
								onChange={(event, isInputChecked) =>
									this.setState({
										sendCredentials: isInputChecked
									})
								}
							/>
							<a
								href="https://video.councilbox.com/#/videoInstructions/es"
								rel="noopener noreferrer"
								target="_blank"
							>
								<div
									dangerouslySetInnerHTML={{
										__html:
											translate.room_permits_firs_time_msg
									}}
									style={{ color: primary }}
								/>
							</a>
						</React.Fragment>
					}
					open={this.state.confirmModal}
					buttonAccept={translate.accept}
					buttonCancel={translate.cancel}
					modal={true}
					acceptAction={this.openCouncilRoom}
					requestClose={() => this.setState({ confirmModal: false })}
				/>
			</React.Fragment>
		);
	}
}

export default graphql(openCouncilRoom, {
	name: "openCouncilRoom"
})(OpenRoomButton);
