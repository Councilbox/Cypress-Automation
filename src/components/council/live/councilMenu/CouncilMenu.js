import React from "react";
import { DropDownMenu, Icon } from "../../../../displayComponents";
import FontAwesome from "react-fontawesome";
import { getPrimary, getSecondary } from "../../../../styles/colors";
import { MenuItem, Paper } from "material-ui";
import SendCredentialsModal from "./SendCredentialsModal";
import SendCredentialsTestModal from "./SendCredentialsTestModal";
import AnnouncementModal from './AnnouncementModal';
import NoCelebrateModal from "./NoCelebrateModal";
import OriginalConveneModal from "./OriginalConveneModal";
import CouncilInfoModal from "./CouncilInfoModal";
import { councilHasVideo } from '../../../../utils/CBX';
import { ConfigContext } from '../../../../containers/AppControl';
import SMSManagerModal from "./SMSManagerModal";
import { isMobile } from "../../../../utils/screen";

class CouncilMenu extends React.Component {
	state = {
		sendCredentials: false,
		sendCredentialsTest: false,
		noCelebrate: false,
		originalConvene: false,
		councilInfo: false,
		SMSManager: false,
		announcementModal: false
	};

	showAnnouncementModal = () => {
		this.setState({
			announcementModal: true
		})
	}

	closeAnnouncementModal = () => {
		this.setState({
			announcementModal: false
		})
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
							Component={() =>
								<Paper
									elevation={1}
									style={{
										boxSizing: "border-box",
										padding: "0",
										width: isMobile ? "4em" : '5em',
										height: '36px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										border: `1px solid ${primary}`,
										marginLeft: "0.3em"
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
											name={"bars"}
											style={{
												cursor: "pointer",
												fontSize: "0.8em",
												height: "0.8em",
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
										onClick={() =>
											this.setState({ sendCredentials: true })
										}
									>
										<FontAwesome
											name="paper-plane"
											style={{
												marginRight: "0.8em",
												color: secondary
											}}
										/>
										{translate.send_video_emails}
									</MenuItem>
									{council.securityType === 2 &&
										<MenuItem
											onClick={() =>
												this.setState({ SMSManager: true })
											}
										>
											<i
												className="fa fa-commenting-o"
												aria-hidden="true"
												style={{
													marginRight: "0.8em",
													color: secondary
												}}
											></i>
											{'Administrador de SMS' /*TRADUCCION*/}
										</MenuItem>

									}
									{!(council.state === 20 || council.state === 30) &&
										<React.Fragment>
											<MenuItem
												onClick={() =>
													this.setState({ sendCredentialsTest: true })
												}
											>
												<FontAwesome
													name="flask"
													style={{
														marginRight: "0.8em",
														color: secondary
													}}
												/>
												{translate.send_video_test}
											</MenuItem>
											<MenuItem
												onClick={() =>
													this.setState({ noCelebrate: true })
												}
											>
												<FontAwesome
													name="exclamation-triangle"
													style={{
														marginRight: "0.8em",
														color: "red"
													}}
												/>
												{translate.no_celebrate_council}
											</MenuItem>
										</React.Fragment>
									}
									<MenuItem
										onClick={() =>
											this.setState({ originalConvene: true })
										}
									>
										<FontAwesome
											name="eye"
											style={{
												marginRight: "0.8em",
												color: secondary
											}}
										/>
										{translate.view_original_convene}
									</MenuItem>
									<MenuItem
										onClick={() =>
											this.setState({ councilInfo: true })
										}
									>
										<FontAwesome
											name="info"
											style={{
												marginRight: "0.8em",
												color: secondary
											}}
										/>
										{translate.council_info}
									</MenuItem>
									{councilHasVideo(council) && config.roomAnnouncement &&
										<MenuItem
											onClick={this.showAnnouncementModal}
										>
											<FontAwesome
												name="comments-o"
												style={{
													marginRight: "0.8em",
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
					requestClose={() =>
						this.setState({ sendCredentials: false })
					}
					translate={translate}
				/>
				<SMSManagerModal
					council={council}
					translate={translate}
					open={this.state.SMSManager}
					requestClose={() => {
						this.setState({ SMSManager: false })
					}}
				/>
				<AnnouncementModal
					show={this.state.announcementModal}
					council={this.props.council}
					translate={translate}
					requestClose={this.closeAnnouncementModal}
				/>
				<SendCredentialsTestModal
					show={this.state.sendCredentialsTest}
					council={this.props.council}
					requestClose={() =>
						this.setState({ sendCredentialsTest: false })
					}
					translate={translate}
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
					requestClose={() =>
						this.setState({ originalConvene: false })
					}
					translate={translate}
				/>
				<CouncilInfoModal
					show={this.state.councilInfo}
					council={this.props.council}
					requestClose={() => this.setState({ councilInfo: false })}
					translate={translate}
				/>
			</React.Fragment>
		);
	}
}

export default CouncilMenu;
