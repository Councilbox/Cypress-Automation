import React from "react";
import {
	AlertConfirm,
	Grid,
	GridItem,
	Icon
} from "../../../../displayComponents/index";
import { Typography } from "material-ui";
import { graphql } from "react-apollo";
import { sendConvene } from "../../../../queries";

class RescheduleModal extends React.Component {
	state = {
		success: "",
		error: "",
		sendAgenda: false,
		dateStart: this.props.council.dateStart,
		dateStart2NdCall: this.props.council.dateStart2NdCall || null,
		error2NdCall: ""
	};

	close = () => {
		this.setState({
			success: false,
			sending: false,
			error: false,
			unsavedChanges: false,
			error2NdCall: ""
		});
		this.props.refetch();
		this.props.requestClose();
	};

	sendConvene = async () => {
		this.setState({
			sending: true
		});
		const response = await this.props.sendConvene({
			variables: {
				councilId: this.props.council.id
			}
		});
		if (response.data.sendConvene.success) {
			this.setState({
				sending: false,
				success: true,
				unsavedChanges: false
			});
		} else {
			this.setState({
				sending: false,
				error: true
			});
		}
	};

	updateState = object => {
		this.setState({
			...object,
			unsavedChanges: true
		});
	};

	_sendConveneBody() {
		const { translate } = this.props;

		if (this.state.sending) {
			return <div>{translate.new_sending_convene}</div>;
		}

		if (this.state.success) {
			return <SuccessMessage message={translate.council_sended} />;
		}

		return (
			<Grid style={{ width: "450px" }}>
				<GridItem xs={12} md={12} lg={12}>
					{translate.proceed_send_convene}
				</GridItem>
			</Grid>
		);
	}

	render() {
		const { translate } = this.props;

		return (
			<AlertConfirm
				requestClose={this.close}
				open={this.props.show}
				acceptAction={
					this.state.success ? () => this.close() : this.sendConvene
				}
				buttonAccept={
					this.state.success ? translate.accept : translate.send
				}
				buttonCancel={translate.close}
				bodyText={this._sendConveneBody()}
				title={translate.reschedule_council}
			/>
		);
	}
}

export default graphql(sendConvene, {
	name: "sendConvene"
})(RescheduleModal);

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
