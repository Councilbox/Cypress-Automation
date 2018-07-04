import React from "react";
import {
	BasicButton,
	ButtonIcon,
	ErrorAlert,
	FileUploadButton,
	Grid,
	GridItem,
	LoadingSection,
	ProgressBar
} from "../../../../displayComponents/index";
import { getPrimary, getSecondary, secondary } from "../../../../styles/colors";
import { compose, graphql } from "react-apollo";
import { MAX_FILE_SIZE } from "../../../../constants";
import { Typography } from "material-ui";
import AttachmentList from "../../../attachments/AttachmentList";
import { formatSize, showAddCouncilAttachment } from "../../../../utils/CBX";
import { addCouncilAttachment, councilStepFour, removeCouncilAttachment, updateCouncil} from "../../../../queries";
import CouncilHeader from '../CouncilHeader'


class StepAttachments extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			uploading: false,
			totalSize: 0,
			alert: false
		};
	}

	static getDerivedStateFromProps(nextProps) {
		if (!nextProps.data.council) {
			return null;
		}
		const { attachments } = nextProps.data.council;
		let totalSize = 0;
		if (attachments.length !== 0) {
			if (attachments.length > 1) {
				totalSize = attachments.reduce(
					(a, b) => a + +b.filesize / 1000,
					0
				);
			} else {
				totalSize = attachments[0].filesize / 1000;
			}
		}

		if (attachments) {
			return {
				totalSize: totalSize
			};
		}

		return null;
	}

	componentDidMount() {
		this.props.data.refetch();
	}

	handleFile = async event => {
		const file = event.nativeEvent.target.files[0];
		if (!file) {
			return;
		}
		if (
			file.size / 1000 + parseInt(this.state.totalSize, 10) >
			MAX_FILE_SIZE
		) {
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
				councilId: this.props.councilID
			};

			this.setState({
				uploading: true
			});
			const response = await this.props.addAttachment({
				variables: {
					attachment: fileInfo
				}
			});
			if (response) {
				this.props.data.refetch();
				this.setState({
					uploading: false
				});
			}
		};
	};

	removeCouncilAttachment = async attachmentID => {
		this.props.removeCouncilAttachment({
			variables: {
				attachmentId: attachmentID,
				councilId: this.props.councilID
			},
			refetchQueries: [
				{
					query: councilStepFour,
					name: "data",
					variables: {
						id: this.props.councilID
					}
				}
			]
		});
	};

	updateCouncil = step => {
		const { attachments, __typename, ...council } = this.props.data.council;
		this.props.updateCouncil({
			variables: {
				council: {
					...council,
					step: step
				}
			}
		});
	};

	nextPage = () => {
		if (!this.state.uploading) {
			this.updateCouncil(5);
			this.props.nextStep();
		}
	};

	previousPage = () => {
		if (!this.state.uploading) {
			this.updateCouncil(4);
			this.props.previousStep();
		}
	};

	render() {
		const { translate } = this.props;
		let attachments = [];
		if(!this.props.data.loading){
			attachments = this.props.data.council.attachments;
		}
		const primary = getPrimary();

		return (
			<div
				style={{
					width: "100%",
					height: "100%"
				}}
			>
				<CouncilHeader
					council={!this.props.data.loading? this.props.data.council : { name: ''}}
					translate={translate}
				/>
				<Grid>
					<GridItem xs={12} md={10}>
						<Typography
							variant="subheading"
							style={{ marginTop: "0.5em" }}
						>
							{translate.new_files_desc}
						</Typography>

						<ProgressBar
							value={
								this.state.totalSize > 0
									? (this.state.totalSize / MAX_FILE_SIZE) *
									  100
									: 0
							}
							color={getSecondary()}
							style={{ height: "1.2em" }}
						/>

						<Typography variant="caption">
							{formatSize(this.state.totalSize * 1000)}
						</Typography>
					</GridItem>
					<GridItem xs={12} md={2}>
						{showAddCouncilAttachment(attachments) && (
							<FileUploadButton
								text={translate.new_add}
								style={{
									marginTop: "2em",
									width: "100%"
								}}
								buttonStyle={{ width: "100%" }}
								color={primary}
								textStyle={{
									color: "white",
									fontWeight: "700",
									fontSize: "0.9em",
									textTransform: "none"
								}}
								loading={this.state.uploading}
								icon={
									<ButtonIcon type="publish" color="white" />
								}
								onChange={this.handleFile}
							/>
						)}
					</GridItem>
				</Grid>

				{this.props.data.loading?
						<LoadingSection />
					:
					attachments.length > 0 && (
						<AttachmentList
							attachments={attachments}
							refetch={this.props.data.refetch}
							deleteAction={this.removeCouncilAttachment}
							translate={translate}
						/>
					)	
				}

				<Grid style={{ marginTop: "3em" }}>
					<GridItem xs={12} md={12} lg={12}>
						<div style={{ float: "right" }}>
							<BasicButton
								text={translate.previous}
								color={getSecondary()}
								textStyle={{
									color: "white",
									fontWeight: "700",
									fontSize: "0.9em",
									textTransform: "none"
								}}
								textPosition="after"
								onClick={this.props.previousStep}
							/>
							<BasicButton
								text={translate.save}
								color={secondary}
								textStyle={{
									color: "white",
									fontWeight: "700",
									marginLeft: "0.5em",
									marginRight: "0.5em",
									fontSize: "0.9em",
									textTransform: "none"
								}}
								icon={<ButtonIcon color="white" type="save" />}
								textPosition="after"
								onClick={this.updateCouncil}
							/>
							<BasicButton
								text={translate.next}
								color={primary}
								textStyle={{
									color: "white",
									fontWeight: "700",
									fontSize: "0.9em",
									textTransform: "none"
								}}
								textPosition="after"
								onClick={this.nextPage}
							/>
						</div>
					</GridItem>
				</Grid>

				<ErrorAlert
					title={translate.error}
					bodyText={translate.file_exceeds_rest}
					open={this.state.alert}
					requestClose={() => this.setState({ alert: false })}
					buttonAccept={translate.accept}
				/>
			</div>
		);
	}
}

export default compose(
	graphql(councilStepFour, {
		name: "data",
		options: props => ({
			variables: {
				id: props.councilID
			},
			notifyOnNetworkStatusChange: true
		})
	}),
	graphql(addCouncilAttachment, {
		name: "addAttachment"
	}),

	graphql(updateCouncil, {
		name: "updateCouncil"
	}),

	graphql(removeCouncilAttachment, {
		name: "removeCouncilAttachment"
	})
)(StepAttachments);
