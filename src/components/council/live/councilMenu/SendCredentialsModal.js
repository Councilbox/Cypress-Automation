import React, { Component } from "react";
import { AlertConfirm, Icon } from "../../../../displayComponents";
import { Typography } from "material-ui";
import { graphql } from "react-apollo";
import { sendVideoEmails } from "../../../../queries";

class SendCredentialsModal extends Component {
	close = () => {
		this.props.requestClose();
		this.setState({
			success: false,
			sending: false,
			error: false,
			sendAgenda: false
		});
	};
	sendVideoEmails = async () => {
		this.setState({
			sending: true
		});
		const response = await this.props.sendVideoEmails({
			variables: {
				councilId: this.props.council.id
			}
		});
		if (response.data.sendVideoEmails.success) {
			this.setState({
				sending: false,
				success: true
			});
		} else {
			this.setState({
				sending: false,
				error: true
			});
		}
	};

	constructor(props) {
		super(props);
		this.state = {
			success: "",
			error: "",
			sendAgenda: false
		};
	}

	_renderBody() {
		const { translate } = this.props;

		if (this.state.sending) {
			return <div>{translate.sending}</div>;
		}

		if (this.state.success) {
			return <SuccessMessage message={translate.sent} />;
		}

		return <div>{translate.send_video_credentials_question}</div>;
	}

	render() {
		const { translate } = this.props;

		return (
			<AlertConfirm
				requestClose={this.close}
				open={this.props.show}
				acceptAction={
					this.state.success
						? () => this.close()
						: this.sendVideoEmails
				}
				buttonAccept={
					this.state.success ? translate.accept : translate.send
				}
				buttonCancel={translate.close}
				bodyText={this._renderBody()}
				title={translate.send_convene_reminder}
			/>
		);
	}
}

export default graphql(sendVideoEmails, {
	name: "sendVideoEmails"
})(SendCredentialsModal);

const SuccessMessage = ({ message }) => (
	<div
		style={{
			width: "500px",
			display: "flex",
			alignItems: "center",
			alignContent: "center",
			flexDirection: "column"
		}}
	>
		<Icon
			className="material-icons"
			style={{
				fontSize: "6em",
				color: "green"
			}}
		>
			check_circle
		</Icon>
		<Typography variant="subheading">{message}</Typography>
	</div>
);
