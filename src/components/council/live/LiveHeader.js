import React from "react";
import { getPrimary } from "../../../styles/colors";
import { bHistory } from "../../../containers/App";
import { AlertConfirm, Icon, BasicButton, ButtonIcon } from "../../../displayComponents";
import { Paper, Tooltip, IconButton } from 'material-ui';
import logo from "../../../assets/img/logo.png";
import conpaasLogo from "../../../assets/img/conpaas_logo.png";
import coeLogo from "../../../assets/img/coe.png";
import icono from "../../../assets/img/logo-icono.png";
import withWindowSize from '../../../HOCs/withWindowSize';
import { variant } from "../../../config";
import { getCustomLogo, getCustomIcon } from "../../../utils/subdomain";


class LiveHeader extends React.Component {
	state = {
		showConfirm: false,
	};

	exitAction = () => {
		bHistory.push("/");
	};

	render() {
		const {
			councilName,
			translate,
			windowSize,
			participants,
			toggleScreens,
		} = this.props;
		const primary = getPrimary();

		return (
			<React.Fragment>
				<Paper
					elevation={0}
					style={{
						background: 'white',
						borderBottom: '1px solid gainsboro',
						display: "flex",
						width: "100%",
						userSelect: "none",
						position: "absolute",
						zIndex: 1000,
						height: "3em",
						alignItems: "center",
						justifyContent: "space-between"
					}}
				>
					<div > {/**style={{ width: "20%" }} */}
					{variant === 'CUSTOM'?
						<div>
							<img
								src={windowSize !== "xs" ? getCustomLogo() : getCustomIcon()}
								className="App-logo"
								style={{
									height: "1.5em",
									marginLeft: "1em",
									// marginLeft: "2em",
									userSelect: 'none'
								}}
								alt="logo"
							/>
						</div>
					:
						<img
							src={windowSize !== "xs" ? logo : icono}
							className="App-logo"
							style={{
								height: "1.5em",
								marginLeft: "2em"
							}}
							alt="logo"
						/>
					}

					</div>
					<div
						style={{
							// marginRight: "10%",
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
						}}
					>{/**style={{width: "35%",}} */}
						<Tooltip title={councilName}>
							<div style={{ textAlign: "center", color: primary, fontWeight: '700', fontSize: '1.1em' }}>
								{councilName}
							</div>
						</Tooltip>
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "flex-end",
							paddingRight: "2em",
							alignItems: "center"
						}}
					>{/**style={{width: "20%",}} */}
						{/*<Icon
                     className="material-icons"
                     style={{fontSize: '1.5em', color: 'white'}}
                     >
                     help
					 </Icon>*/}
						<Icon
							className="material-icons"
							style={{
								fontSize: "1.5em",
								color: primary,
								cursor: "pointer"
							}}
							onClick={() =>
								this.setState({
									showConfirm: true
								})
							}
						>
							exit_to_app
						</Icon>
						<AlertConfirm
							title={translate.exit}
							bodyText={translate.exit_desc}
							acceptAction={this.exitAction}
							buttonCancel={translate.cancel}
							buttonAccept={translate.accept}
							open={this.state.showConfirm}
							requestClose={() =>
								this.setState({
									showConfirm: false
								})
							}
						/>
					</div>
				</Paper>
				<div
					style={{
						height: "3em",
						width: "100%"
					}}
				/>
			</React.Fragment>
		);
	}
}

export default withWindowSize(LiveHeader);
