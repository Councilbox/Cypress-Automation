import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import { councilActEmail, downloadAct } from '../../../../queries';
import { LoadingSection, BasicButton } from '../../../../displayComponents';
import { Paper } from 'material-ui';
import FontAwesome from "react-fontawesome";
import { getSecondary } from '../../../../styles/colors';
import { downloadFile } from '../../../../utils/CBX';
import withWindowSize from '../../../../HOCs/withWindowSize';


class ActHTML extends React.Component {
	state = {
		loading: false,
		downloadingPDF: false
	};

	downloadPDF = async () => {
		this.setState({
			downloadingPDF: true
		})
		const response = await this.props.client.query({
			query: downloadAct,
			variables: {
				councilId: this.props.council.id
			}
		});

		if (response) {
			if (response.data.downloadAct) {
				this.setState({
					downloadingPDF: false
				});
				downloadFile(
					response.data.downloadAct,
					"application/pdf",
					`${this.props.translate.act.replace(/ /g, '_')}-${
					this.props.council.name.replace(/ /g, '_')
					}`
				);
			}
		}
	};

	componentDidMount() {
		this.props.data.refetch();
	}

	render() {
		const secondary = getSecondary();
		const { translate } = this.props;

		if (this.props.data.loading) {
			return (
				<LoadingSection />
			);
		}

		return (
			<React.Fragment>
				<BasicButton
					text={translate.export_original_act}
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
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						marginTop: '0.8em'
					}}
				>
					<Paper
						className={this.props.windowSize !== 'xs' ? 'htmlPreview' : ''}
					>
						<div
							dangerouslySetInnerHTML={{ __html: this.props.data.councilAct.emailAct }}
							style={{
								padding: "2em",
								margin: "0 auto"
							}}
						/>
					</Paper>
				</div>
			</React.Fragment>
		);
	}
}

export default graphql(councilActEmail, {
	options: props => ({
		variables: {
			councilId: props.council.id
		},
		notifyOnNetworkStatusChange: true
	})
})(withApollo(withWindowSize(ActHTML)));