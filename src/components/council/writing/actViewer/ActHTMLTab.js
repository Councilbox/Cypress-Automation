import React from 'react';
import { graphql } from 'react-apollo';
import { councilActEmail } from '../../../../queries';
import { LoadingSection, DropDownMenu, BasicButton } from '../../../../displayComponents';
import { Paper } from 'material-ui';
import withWindowSize from '../../../../HOCs/withWindowSize';
import DownloadActPDF from './DownloadActPDF';
import DownloadActWord from './DownloadActWord';
import { ConfigContext } from '../../../../containers/AppControl';
import { getSecondary } from '../../../../styles/colors';
import ExportActToMenu from './ExportActToMenu';


class ActHTML extends React.Component {
	state = {
		loading: false,
	};

	componentDidMount() {
		this.props.data.refetch();
	}

	render() {
		if (this.props.data.loading) {
			return (
				<LoadingSection />
			);
		}

		return (
			<ConfigContext.Consumer>
				{config => (
					<React.Fragment>
						{config.exportActToWord?
							<div style={{display: 'flex'}}>
								<ExportActToMenu
									translate={this.props.translate}
									council={this.props.council}
									html={this.props.data.councilAct.emailAct}
								/>
								<BasicButton
									text="Añadir adjunto al acta"
									textStyle={{color: getSecondary()}}
								/>
							</div>
						:
							<DownloadActPDF
								translate={this.props.translate}
								council={this.props.council}
							/>
						}
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
				)}

			</ConfigContext.Consumer>
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
})(withWindowSize(ActHTML));