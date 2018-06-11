import React, { Component } from "react";
import { compose, graphql } from "react-apollo";
import {
	CollapsibleSection,
	FileUploadButton,
	Icon
} from "../../../displayComponents";
import AttachmentList from "../../attachments/AttachmentList";
import { darkGrey } from "../../../styles/colors";
import { addAgendaAttachment, removeAgendaAttachment } from "../../../queries";
import { MAX_FILE_SIZE } from "../../../constants";
import { LIVE_COLLAPSIBLE_HEIGHT } from "../../../styles/constants";

class AgendaAttachmentsManager extends Component {

	handleFile = async event => {
		const file = event.nativeEvent.target.files[0];
		if (!file) {
			return;
		}
		if (file.size / 1000 + this.state.totalSize > MAX_FILE_SIZE) {
			this.setState({
				alert: true
			});
			return;
		}
		let reader = new FileReader();
		reader.readAsBinaryString(file);

		reader.onload = async event => {
			let fileInfo = {
				filename: file.name,
				filetype: file.type,
				filesize: event.loaded,
				base64: btoa(event.target.result),
				state: 0,
				agendaId: this.props.agendaID,
				councilId: this.props.councilID
			};

			this.setState({
				uploading: true
			});
			const response = await this.props.addAgendaAttachment({
				variables: {
					attachment: fileInfo
				}
			});
			if (response) {
				this.props.refetch();
				this.setState({
					uploading: false
				});
			}
		};
	};
	removeAgendaAttachment = async attachmentID => {
		this.setState({
			loadingId: attachmentID
		});

		const response = await this.props.removeAgendaAttachment({
			variables: {
				attachmentId: attachmentID,
				agendaId: this.props.agendaID
			}
		});

		if (response) {
			const refetch = await this.props.refetch();
			if (refetch) {
				this.setState({ loadingId: "" });
			}
		}
	};
	_button = () => {
		const { attachments } = this.props;

		return (
			<div
				style={{
					height: LIVE_COLLAPSIBLE_HEIGHT,
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center"
				}}
			>
				<div
					style={{
						width: "25%",
						height: LIVE_COLLAPSIBLE_HEIGHT,
						display: "flex",
						alignItems: "center",
						paddingLeft: "1.5em"
					}}
				>
					<Icon className="material-icons" style={{ color: "grey" }}>
						description
					</Icon>
					<span
						style={{
							marginLeft: "0.7em",
							color: darkGrey,
							fontWeight: "700"
						}}
					>{`${attachments.length}`}</span>
				</div>
				<div
					style={{
						width: "25%",
						display: "flex",
						justifyContent: "flex-end",
						paddingRight: "2em"
					}}
				>
					<Icon className="material-icons" style={{ color: "grey" }}>
						keyboard_arrow_down
					</Icon>
				</div>
			</div>
		);
	};
	_section = () => {
		const { attachments, translate } = this.props;

		return (
			<AttachmentList
				attachments={attachments}
				translate={translate}
				loadingId={this.state.loadingId}
				deleteAction={this.removeAgendaAttachment}
			/>
		);
	};

	constructor(props) {
		super(props);
		this.state = {
			open: false,
			loadingId: ""
		};
	}

	render() {
		return (
			<div
				style={{
					width: "100%",
					backgroundColor: "lightgrey",
					position: "relative"
				}}
			>
				<CollapsibleSection
					trigger={this._button}
					collapse={this._section}
				/>
				<div
					style={{
						overflow: "hidden",
						height: "30px",
						position: "absolute",
						top: "5px",
						left: "5em",
						margin: 0,
						padding: 0,
						display: "flex",
						alignItems: "center",
						justfiyContent: "center"
					}}
				>
					<FileUploadButton
						color={"lightgrey"}
						textStyle={{
							color: "white",
							fontWeight: "700",
							fontSize: "0.9em",
							textTransform: "none"
						}}
						buttonStyle={{
							maxWidth: "1em",
							height: "100%",
							marginTop: "5px"
						}}
						flat
						icon={
							<Icon
								className="material-icons"
								style={{
									fontSize: "1.5em",
									color: "grey"
								}}
							>
								control_point
							</Icon>
						}
						onChange={this.handleFile}
					/>
				</div>
			</div>
		);
	}
}

export default compose(
	graphql(addAgendaAttachment, {
		name: "addAgendaAttachment"
	}),

	graphql(removeAgendaAttachment, {
		name: "removeAgendaAttachment"
	})
)(AgendaAttachmentsManager);
