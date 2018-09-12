import React, { Component, Fragment } from "react";
import {
	resendRoomEmails
} from "../../../../../queries/liveParticipant";
import {
	CustomDialog,
	BasicButton,
	Tooltip
} from "../../../../../displayComponents";
import { getPrimary, getSecondary } from "../../../../../styles/colors";
import { Card } from "material-ui";
import FontAwesome from "react-fontawesome";
import { graphql } from "react-apollo";
import { moment } from "../../../../../containers/App";


class ResendCredentialsModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modal: false
		};
	}

	close = () => {
		this.setState({ modal: false });
	};

	resend = async () => {
		const response = await this.props.resendRoomEmails({
			variables: {
				councilId: this.props.participant.councilId,
				timezone: moment().utcOffset(),
				participantsIds: [this.props.participant.id]
			}
		});
		if (!response.errors) {
			this.props.refetch();
			this.close();
		}
	};

	openModal = () => {
		this.setState({ modal: true });
	};

	render() {
		const { translate, participant } = this.props;
		const primary = getPrimary();
		const translation = translate.sure_send_video.replace(
			"{{name}}",
			`${participant.name} ${participant.surname}`
		);

		return (
			<Fragment>
				<ResendButton
					action={this.openModal}
					translate={translate}
					active={participant.signed === 1}
				/>
				<CustomDialog
					title={translate.attention}
					requestClose={this.close}
					open={this.state.modal}
					actions={
						<Fragment>
							<BasicButton
								text={translate.cancel}
								textStyle={{
									textTransform: "none",
									fontWeight: "700"
								}}
								onClick={this.close}
							/>
							<BasicButton
								text={translate.continue}
								textStyle={{
									color: "white",
									textTransform: "none",
									fontWeight: "700"
								}}
								buttonStyle={{ marginLeft: "1em" }}
								color={primary}
								onClick={() => {
									this.resend();
								}}
							/>
						</Fragment>
					}
				>
					<div style={{ width: "400px" }}>{translation}</div>
				</CustomDialog>
			</Fragment>
		);
	}
}

const ResendButton = ({ active, action, translate }) => {
	return (
		// <Tooltip title={translate.send_video_credentials}>
			<Card
				style={{
					margin: "2px 1em 0 0",
					justifyContent: "center",
					cursor: "pointer",
					outline: 0,
					border: `1px solid ${getSecondary()}`,
					borderRadius: "2px",
					backgroundColor: getSecondary(),
					marginLeft:'0.5em'
				}}
				elevation={active ? 0 : 1}
				tabIndex="0"
				onClick={action}
			>
				<FontAwesome
					name={"share-square"}
					style={{
						cursor: "pointer",
						fontSize: "1.2em",
						padding: "0.3em 0.4em",
						color: "white",
					}}
				/>
				<span style={{color: 'white', paddingRight: '0.5em'}}>{translate.send_video_credentials}</span>
			</Card>
		// </Tooltip>
	);
};

export default graphql(resendRoomEmails, {
	name: "resendRoomEmails",
	options: {
		errorPolicy: "all"
	}
})(ResendCredentialsModal);
