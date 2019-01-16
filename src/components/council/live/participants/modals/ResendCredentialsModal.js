import React from "react";
import {
	resendRoomEmails
} from "../../../../../queries/liveParticipant";
import {
	CustomDialog,
	BasicButton
} from "../../../../../displayComponents";
import { getPrimary, getSecondary } from "../../../../../styles/colors";
import { Card } from "material-ui";
import FontAwesome from "react-fontawesome";
import { graphql } from "react-apollo";
import { moment } from "../../../../../containers/App";
import { isMobile } from 'react-device-detect';


class ResendCredentialsModal extends React.Component {
	state = {
		modal: false
	};

	close = () => {
		this.setState({ modal: false });
	};

	resend = async () => {
		const response = await this.props.resendRoomEmails({
			variables: {
				councilId: this.props.council.id,
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
			<React.Fragment>
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
						<React.Fragment>
							<BasicButton
								text={translate.cancel}
								type="flat"
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
						</React.Fragment>
					}
				>
					<div style={{ width: "400px" }}>{translation}</div>
				</CustomDialog>
			</React.Fragment>
		);
	}
}

const ResendButton = ({ active, action, translate }) => {
	return (
		// <Tooltip title={translate.send_video_credentials}>
			<BasicButton
				buttonStyle={{
					border: `1px solid ${getSecondary()}`,
					marginRight :'0.5em'
				}}
				color={'white'}
				elevation={active ? 0 : 1}
				tabIndex="0"
				type="flat"
				onClick={action}
				text={
					<React.Fragment>
						<FontAwesome
							name={"share-square"}
							style={{
								cursor: "pointer",
								fontSize: "1.2em",
								marginRight: '0.2em',
								color: getSecondary()
							}}
						/>
						<span style={{color: getSecondary()}}>{isMobile? 'Reenviar'/*TRADUCCION*/ : translate.send_video_credentials}</span>
					</React.Fragment>
				}
			>
			</BasicButton>
		// </Tooltip>
	);
};

export default graphql(resendRoomEmails, {
	name: "resendRoomEmails",
	options: {
		errorPolicy: "all"
	}
})(ResendCredentialsModal);
