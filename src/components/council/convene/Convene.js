import React from "react";
import { graphql, withApollo } from "react-apollo";
import FontAwesome from "react-fontawesome";
import { getPrimary, getSecondary } from "../../../styles/colors";
import gql from "graphql-tag";
import {
	BasicButton,
	ErrorWrapper,
	Grid,
	GridItem,
	LoadingSection
} from "../../../displayComponents";
import { Typography, Paper, Tooltip } from "material-ui";
import AttachmentDownload from "../../attachments/AttachmentDownload";
import { downloadConvenePDF } from "../../../queries";
import * as CBX from '../../../utils/CBX';
import withWindowSize from '../../../HOCs/withWindowSize';


export const conveneDetails = gql`
	query CouncilDetails($councilID: Int!) {
		council(id: $councilID) {
			id
			attachments {
				councilId
				filename
				filesize
				filetype
				id
			}
			emailText
		}
	}
`;


class Convene extends React.Component {
	state = {
		loading: false,
		downloadingPDF: false,
		htmlCopiedTooltip: false
	};

	downloadPDF = async () => {
		this.setState({
			downloadingPDF: true
		})
		const response = await this.props.client.query({
			query: downloadConvenePDF,
			variables: {
				councilId: this.props.council.id
			}
		});

		if (response) {
			if (response.data.downloadConvenePDF) {
				this.setState({
					downloadingPDF: false
				});
				CBX.downloadFile(
					response.data.downloadConvenePDF,
					"application/pdf",
					`${this.props.translate.convene.replace(/ /g, '_')}-${
						this.props.council.name.replace(/ /g, '_')
					}`
				);
			}
		}
	};

	showTooltip = () => {
		this.setState({
			htmlCopiedTooltip: true
		});
		setTimeout(() => this.setState({htmlCopiedTooltip: false}), 3000);
	}

	copyConveneHTML = () => {
		const html = document.createElement('textarea');
		document.body.appendChild(html);
		html.value = this.props.data.council.emailText;
		html.select();
		document.execCommand('copy');
		this.showTooltip();
	}

	render() {
		const secondary = getSecondary();
		const { translate } = this.props;
		const { council, error, loading } = this.props.data;

		if (loading) {
			return <LoadingSection />;
		}

		if (error) {
			return <ErrorWrapper error={error} translate={translate} />;
		}

		return (
			<React.Fragment>
				{council.attachments.length > 0 && !this.props.hideAttachments && (
					<div
						style={{
							paddingTop: "1em 0",
							width: "98%"
						}}
					>
						<Typography
							variant="title"
							style={{ color: getPrimary() }}
						>
							{translate.new_files_title}
						</Typography>
						<div style={{ marginTop: "1em" }}>
							<Grid>
								{council.attachments.map(attachment => {
									return (
										<GridItem
											key={`attachment${attachment.id}`}
										>
											<AttachmentDownload
												attachment={attachment}
												loading={this.state.downloading}
												spacing={0.5}
											/>
										</GridItem>
									);
								})}
							</Grid>
						</div>
					</div>
				)}
				<div>
					<BasicButton
						text={translate.export_convene}
						color={secondary}
						loading={this.state.downloadingPDF}
						buttonStyle={{ marginTop: "0.5em" }}
						textStyle={{
							color: "white",
							fontWeight: "700",
							fontSize: "0.9em",
							textTransform: "none"
						}}
						icon={
							<FontAwesome
								name={"file-pdf-o"}
								style={{
									fontSize: "1em",
									color: "white",
									marginLeft: "0.3em"
								}}
							/>
						}
						textPosition="after"
						onClick={this.downloadPDF}
					/>
					<BasicButton
						text={'Copiar HTML al portapapeles'}//TRADUCCION
						color={secondary}
						buttonStyle={{ marginTop: "0.5em", marginLeft: '0.6em' }}
						textStyle={{
							color: "white",
							fontWeight: "700",
							fontSize: "0.9em",
							textTransform: "none"
						}}
						icon={<i className="fa fa-clipboard" aria-hidden="true" style={{marginLeft: '0.3em'}}></i>}
						textPosition="after"
						onClick={this.copyConveneHTML}
					/>
				</div>
				<Tooltip title={'Html copiado'} open={this.state.htmlCopiedTooltip}>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							marginTop: '0.8em'
						}}
					>
						<Paper
							className={this.props.windowSize !== 'xs'? 'htmlPreview' : ''}
						>
							<div
								dangerouslySetInnerHTML={{ __html: council.emailText }}
								style={{
									padding: "2em",
									cursor: 'pointer',
									margin: "0 auto"
								}}
								onClick={this.copyConveneHTML}
							/>
						</Paper>
					</div>
				</Tooltip>
			</React.Fragment>
		);
	}
}

export default graphql(conveneDetails, {
	name: "data",
	options: props => ({
		variables: {
			councilID: props.council.id
		}
	})
})(withApollo(withWindowSize(Convene)));
