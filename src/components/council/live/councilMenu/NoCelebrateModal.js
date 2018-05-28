import React, { Component } from "react";
import {
	AlertConfirm,
	Icon,
	RichTextInput
} from "../../../../displayComponents";
import { Typography } from "material-ui";
import { graphql } from "react-apollo";
import { noCelebrateCouncil } from "../../../../queries";
import { bHistory } from "../../../../containers/App";

class NoCelebrateModal extends Component {
	close = () => {
		this.props.requestClose();
		this.setState(
			{
				success: false,
				sending: false,
				error: false,
				cancelText: "",
				sendAgenda: false
			},
			() => bHistory.push("/")
		);
	};
	noCelebrateCouncil = async () => {
		this.setState({
			sending: true
		});
		const response = await this.props.noCelebrateCouncil({
			variables: {
				councilId: this.props.council.id,
				comment: this.state.cancelText
			}
		});
		if (response.data.noCelebrateCouncil.success) {
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
			cancelText: "",
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

		return (
			<div style={{ width: "650px" }}>
				<RichTextInput
					floatingText={translate.live_no_celebrate}
					type="text"
					value={this.state.cancelText}
					onChange={value => {
						this.setState({
							cancelText: value
						});
					}}
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
				acceptAction={
					this.state.success
						? () => this.close()
						: this.noCelebrateCouncil
				}
				buttonAccept={
					this.state.success
						? translate.accept
						: translate.no_celebrate
				}
				buttonCancel={translate.close}
				bodyText={this._renderBody()}
				title={translate.send_convene_reminder}
			/>
		);
	}
}

export default graphql(noCelebrateCouncil, {
	name: "noCelebrateCouncil"
})(NoCelebrateModal);

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
