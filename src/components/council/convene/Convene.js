import React, { Component } from "react";
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
import { Typography } from "material-ui";
import AttachmentDownload from "../../attachments/AttachmentDownload";
import Scrollbar from "react-perfect-scrollbar";
import { councilDetails, downloadConvenePDF } from "../../../queries";
import * as CBX from '../../../utils/CBX';


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


class Convene extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			downloadingPDF: false
		};
	}

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
			<Scrollbar>
				{council.attachments.length > 0 && (
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
				<div
					dangerouslySetInnerHTML={{ __html: council.emailText }}
					style={{
						padding: "2em",
						margin: "0 auto"
					}}
				/>
			</Scrollbar>
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
})(withApollo(Convene));
