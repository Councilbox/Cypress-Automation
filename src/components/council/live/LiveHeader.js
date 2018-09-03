import React from "react";
import { getPrimary, getSecondary } from "../../../styles/colors";
import { bHistory } from "../../../containers/App";
import { AlertConfirm, Icon } from "../../../displayComponents";
import { Paper } from 'material-ui';
import logo from "../../../assets/img/logo.png";
import icono from "../../../assets/img/logo-icono.png";
import withWindowSize from '../../../HOCs/withWindowSize';

class LiveHeader extends React.Component {
	state = {
		showConfirm: false
	};

	exitAction = () => {
		bHistory.push("/");
	};

	render() {
		const {
			primaryColor,
			companyName,
			councilName,
			translate,
			windowSize,
		} = this.props;
		const primary = getPrimary();
		const secondary = getSecondary();

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
					<div style={{ width: "20%" }}>
						<img
							src={windowSize !== "xs" ? logo : icono}
							className="App-logo"
							style={{
								height: "1.5em",
								marginLeft: "2em"
							}}
							alt="logo"
						/>
					</div>
					<div
						style={{
							width: "50%",
							display: "flex",
							justifyContent: "center",
							marginRight: "10%"
						}}
					>
						<span style={{ alignSelf: "center", color: primary, fontWeight: '700', fontSize: '1.1em' }}>
							{councilName}
						</span>
					</div>
					<div
						style={{
							width: "10%",
							display: "flex",
							flexDirection: "row",
							justifyContent: "flex-end",
							paddingRight: "2em"
						}}
					>
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
