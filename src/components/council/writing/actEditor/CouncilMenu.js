import React from 'react';
import FontAwesome from 'react-fontawesome';
import { MenuItem, Paper } from 'material-ui';
import { DropDownMenu, Icon } from '../../../../displayComponents';
import { getPrimary, getSecondary } from '../../../../styles/colors';
import OriginalConveneModal from '../../live/councilMenu/OriginalConveneModal';
import CouncilInfoModal from '../../live/councilMenu/CouncilInfoModal';
import { ConfigContext } from '../../../../containers/AppControl';

class CouncilMenu extends React.Component {
state = {
	sendCredentials: false,
	sendCredentialsTest: false,
	noCelebrate: false,
	originalConvene: false,
	councilInfo: false,
	announcementModal: false
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
	const { translate } = this.props;
	const primary = getPrimary();
	const secondary = getSecondary();

	return (
		<React.Fragment>
			<ConfigContext.Consumer>
				{() => (
					<DropDownMenu
						color="transparent"
						Component={() => <Paper
							elevation={1}
							style={{
								boxSizing: 'border-box',
								padding: '0',
								width: '5em',
								height: '36px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'flex-end',
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
									onClick={() => this.setState({ originalConvene: true })
									}
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
									onClick={() => this.setState({ councilInfo: true })
									}
								>
									<FontAwesome
										name="info"
										style={{
											marginRight: '0.8em',
											color: secondary
										}}
									/>
									{translate.council_info}
								</MenuItem>
							</React.Fragment>
						}
					/>
				)}
			</ConfigContext.Consumer>
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
			/>
		</React.Fragment>
	);
}
}

export default CouncilMenu;
