import React from "react";
import { AlertConfirm, Icon, Radio } from "../../../../displayComponents";
import { Typography } from "material-ui";
import { graphql } from "react-apollo";
import { sendVideoEmails } from "../../../../queries";
import { moment } from '../../../../containers/App';

class SendCredentialsModal extends React.Component {
	state = {
		success: "",
		error: "",
		sendAgenda: false,
		sendType: 'all'
	};

	close = () => {
		this.props.requestClose();
		this.setState({
			success: false,
			sending: false,
			error: false,
			sendAgenda: false
		});
	};

	sendAll = () => {
		this.setState({
			sendType: 'all'
		});
	}

	sendNoOpened = () => {
		this.setState({
			sendType: 'noOpened'
		});
	}

	sendVideoEmails = async () => {
		this.setState({
			sending: true
		});
		const response = await this.props.sendVideoEmails({
			variables: {
				councilId: this.props.council.id,
				timezone: moment().utcOffset(),
				type: this.state.sendType
			}
		});
		if (response.data.sendRoomEmails.success) {
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

	_renderBody() {
		const { translate } = this.props;

		if (this.state.sending) {
			return <div>{translate.sending}</div>;
		}

		if (this.state.success) {
			return <SuccessMessage message={translate.sent} />;
		}

		//TRADUCCION
		return (
			<div>
				Enviar a:
				<Radio
					value={"all"}
					checked={this.state.sendType === 'all'}
					onChange={this.sendAll}
					name="sendType"
					label="Todos"
				/>
				<Radio
					value={"noOpened"}
					checked={this.state.sendType === 'noOpened'}
					onChange={this.sendNoOpened}
					name="sendType"
					label='No abrieron email'
				/>
			</div>
		);
	}

	render() {
		const { translate } = this.props;

		return (
			<AlertConfirm
				requestClose={this.close}
				open={this.props.show}
				loadingAction={this.state.sending}
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
				title={translate.send_video_credentials}
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
