import React from "react";
import {
	AlertConfirm,
	Icon,
	LiveToast
} from "../../../../displayComponents";
import RichTextInput from "../../../../displayComponents/RichTextInput";
import { Typography } from "material-ui";
import { graphql } from "react-apollo";
import { noCelebrateCouncil } from "../../../../queries";
import { bHistory } from "../../../../containers/App";
import { checkForUnclosedBraces } from '../../../../utils/CBX';
import { toast } from 'react-toastify';

class NoCelebrateModal extends React.Component {
	state = {
		success: "",
		error: "",
		errorText: '',
		cancelText: "",
		sendAgenda: false
	};

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
		if(this.state.cancelText){
			if(checkForUnclosedBraces(this.state.cancelText)){
				this.setState({
					errorText: true
				});
				toast(
					<LiveToast
						message={this.props.translate.revise_text}
					/>, {
						position: toast.POSITION.TOP_RIGHT,
						autoClose: true,			
						className: "errorToast"
					}
				);
				return;
			}
		}

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
					errorText={this.state.errorText}
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
				requestClose={this.props.requestClose}
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
