import React, { Component } from "react";
import { graphql } from "react-apollo";
import { downloadFile } from "../../../utils/CBX";
import { LoadingSection } from "../../../displayComponents/index";
import { downloadCBXData } from "../../../queries";
import { Tooltip } from "material-ui";
import FontAwesome from "react-fontawesome";
import { getSecondary } from "../../../styles/colors";
import { moment } from "../../../containers/App";

class DownloadCBXDataButton extends Component {

	state = {
		loading: false
	};

	downloadCBXData = async id => {
		this.setState({
			loading: true
		});
		if(this.props.updateState){
			this.props.updateState({loading: true});
		}
		const response = await this.props.downloadCBXData({
			variables: {
				participantId: id,
				timezone: moment().utcOffset()
			}
		});

		if (response) {
			if (response.data.cbxData) {
				downloadFile(
					response.data.cbxData,
					"application/pdf",
					`CbxData_${id}`
				);
				this.setState({
					loading: false
				});
				if(this.props.updateState){
					this.props.updateState({loading: false});
				}
			}
		}
	};

	render() {
		const secondary = getSecondary();

		return (
			<Tooltip title={this.props.translate.download_cbxdata}>
				<div
					onClick={event => {
						event.stopPropagation();
						this.downloadCBXData(this.props.participantId);
					}}
					style={{
						height: "1.8em",
						width: "3em",
						marginLeft: "1.5em",
						backgroundColor: 'white',
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						border: `1px solid ${secondary}`,
						borderRadius: "3px",
						...this.props.style
					}}
				>
					{this.state.loading ? (
						<LoadingSection size={14} color={"secondary"} />
					) : (
						<FontAwesome
							name={"download"}
							style={{
								cursor: "pointer",
								fontSize: "1.1em",
								color: secondary
							}}
						/>
					)}
				</div>
			</Tooltip>
		);
	}
}

export default graphql(downloadCBXData, { name: "downloadCBXData" })(
	DownloadCBXDataButton
);
