import React from 'react';
import FontAwesome from 'react-fontawesome';
import { MenuItem, Paper } from 'material-ui';
import { withApollo } from 'react-apollo';
import { DropDownMenu, Icon } from '../../../../displayComponents';
import { getPrimary, getSecondary } from '../../../../styles/colors';
import SendCredentialsModal from './SendCredentialsModal';
import { moment } from '../../../../containers/App';
import AnnouncementModal from './AnnouncementModal';
import NoCelebrateModal from './NoCelebrateModal';
import OriginalConveneModal from './OriginalConveneModal';
import CouncilInfoModal from './CouncilInfoModal';
import { councilHasVideo, councilIsLive, councilStarted } from '../../../../utils/CBX';
import { ConfigContext } from '../../../../containers/AppControl';
import SMSManagerModal from './SMSManagerModal';
import { isMobile } from '../../../../utils/screen';
import { useDownloadCouncilAttendants } from '../../writing/actEditor/DownloadAttendantsPDF';
import PauseCouncilModal from './PauseCouncilModal';


class CouncilMenu extends React.Component {
state = {
	sendCredentials: false,
	sendCredentialsTest: false,
	noCelebrate: false,
	originalConvene: false,
	pauseModal: false,
	councilInfo: false,
	SMSManager: false,
	announcementModal: false,
	pausingCouncil: false
};

showAnnouncementModal = () => {
	this.setState({
		announcementModal: true
	});
}

closeAnnouncementModal = () => {
	this.setState({
		announcementModal: false
	});
}

render() {
	const { translate, council } = this.props;
	const primary = getPrimary();
	const secondary = getSecondary();

	return (
		<React.Fragment>
			<ConfigContext.Consumer>
				{config => (
					<DropDownMenu
						color="transparent"
						id="council-menu"
						Component={() => <Paper
							elevation={1}
							style={{
								boxSizing: 'border-box',
								padding: '0',
								width: isMobile ? '4em' : '5em',
								height: '36px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								border: `1px solid ${primary}`,
								marginLeft: '0.3em'
							}}
						>
							<MenuItem
								style={{
									width: '100%',
									height: '100%',
									margin: 0,
									padding: 0,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center'
								}}
							>
								<FontAwesome
									name={'bars'}
									style={{
										cursor: 'pointer',
										fontSize: '0.8em',
										height: '0.8em',
										color: primary
									}}
								/>
								<Icon
									className="material-icons"
									style={{ color: primary }}
								>
									keyboard_arrow_down
								</Icon>
							</MenuItem>
						</Paper>
						}
						textStyle={{ color: primary }}
						type="flat"
						icon={
							<Icon
								className="material-icons"
								style={{ color: primary }}
							>
								keyboard_arrow_down
							</Icon>
						}
						items={
							<React.Fragment>
								<MenuItem
									onClick={() => this.setState({ sendCredentials: true })}
									id="council-menu-send-credentials"
								>
									<FontAwesome
										name="paper-plane"
										style={{
											marginRight: '0.8em',
											color: secondary
										}}
									/>
									{translate.send_video_emails}
								</MenuItem>
								{council.securityType === 2
									&& <MenuItem
										onClick={() => this.setState({ SMSManager: true })}
										id="council-menu-sms-menu"
									>
										<i
											className="fa fa-commenting-o"
											aria-hidden="true"
											style={{
												marginRight: '0.8em',
												color: secondary
											}}
										></i>
										{'SMS'}
									</MenuItem>
								}
								{!(council.state === 20 || council.state === 30)
									&& <MenuItem
										onClick={() => this.setState({ noCelebrate: true })}
										id="council-menu-cancel-council"
									>
										<FontAwesome
											name="exclamation-triangle"
											style={{
												marginRight: '0.8em',
												color: 'red'
											}}
										/>
										{translate.no_celebrate_council}
									</MenuItem>
								}
								<MenuItem
									onClick={() => this.setState({ originalConvene: true })}
									id="council-menu-convene"
								>
									<FontAwesome
										name="eye"
										style={{
											marginRight: '0.8em',
											color: secondary
										}}
									/>
									{translate.view_original_convene}
								</MenuItem>
								<MenuItem
									onClick={() => this.setState({ councilInfo: true })}
									id="council-menu-council-info"
								>
									<FontAwesome
										name="info"
										style={{
											marginRight: '0.8em',
											width: '15px',
											display: 'flex',
											justifyContent: 'center',
											color: secondary
										}}
									/>
									{translate.council_info}
								</MenuItem>
								{councilIsLive(council)
									&& <>
										<DownloadAttendantsButton
											translate={translate}
											council={council}
										/>
									</>
								}
								{(councilHasVideo(council) && councilStarted(council) && council.state === 20)
									&& <MenuItem
										onClick={() => this.setState({ pauseModal: true })}
										id="council-menu-pause-council"
									>
										<FontAwesome
											name={'pause-circle-o'}
											style={{
												marginRight: '0.8em',
												color: secondary
											}}
										/>
										{translate.pause_council}
									</MenuItem>
								}

								{councilHasVideo(council) && config.roomAnnouncement
									&& <MenuItem
										onClick={this.showAnnouncementModal}
										id="council-menu-announcement"
									>
										<FontAwesome
											name="comments-o"
											style={{
												marginRight: '0.8em',
												color: secondary
											}}
										/>
										{translate.show_announcement}
									</MenuItem>
								}
							</React.Fragment>
						}
					/>
				)}
			</ConfigContext.Consumer>
			<SendCredentialsModal
				show={this.state.sendCredentials}
				council={this.props.council}
				requestClose={() => this.setState({ sendCredentials: false })
				}
				translate={translate}
			/>
			<SMSManagerModal
				council={council}
				translate={translate}
				open={this.state.SMSManager}
				requestClose={() => {
					this.setState({ SMSManager: false });
				}}
			/>
			<PauseCouncilModal
				council={council}
				refetch={this.props.refetch}
				translate={translate}
				open={this.state.pauseModal}
				requestClose={() => this.setState({ pauseModal: false })}
			/>
			<AnnouncementModal
				show={this.state.announcementModal}
				council={this.props.council}
				translate={translate}
				requestClose={this.closeAnnouncementModal}
			/>
			<NoCelebrateModal
				show={this.state.noCelebrate}
				council={this.props.council}
				requestClose={() => this.setState({ noCelebrate: false })}
				translate={translate}
			/>
			<OriginalConveneModal
				show={this.state.originalConvene}
				council={this.props.council}
				requestClose={() => this.setState({ originalConvene: false })
				}
				translate={translate}
			/>
			<CouncilInfoModal
				show={this.state.councilInfo}
				council={this.props.council}
				requestClose={() => this.setState({ councilInfo: false })}
				translate={translate}
				logo={this.props.logo}
			/>
		</React.Fragment>
	);
}
}

const DownloadAttendantsButton = withApollo(({ council, client, translate }) => {
	const { downloadPDF } = useDownloadCouncilAttendants(client);
	const secondary = getSecondary();

	return (
		<MenuItem
			onClick={() => downloadPDF(
				council,
				`${translate.assistants_list.replace(/ /g, '_')}-${council.name.replace(/ /g, '_').replace(/\./, '')}_${moment().format('YYYY_MM_DD_HH_mm_ss')}`
			)}
			id="council-menu-download-attentands"
		>
			<FontAwesome
				name="users"
				style={{
					marginRight: '0.8em',
					color: secondary
				}}
			/>
			{translate.export_participants}
		</MenuItem>
	);
});

export default withApollo(CouncilMenu);
