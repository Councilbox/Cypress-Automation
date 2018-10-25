import React from "react";
import { getPrimary } from "../../../../styles/colors";
import { bHistory } from "../../../../containers/App";
import { AlertConfirm, Icon } from "../../../../displayComponents";
import logo from "../../../../assets/img/logo.png";
import icono from "../../../../assets/img/logo-icono.png";
import withWindowSize from '../../../../HOCs/withWindowSize';

class LiveMobileHeader extends React.Component {
	state = {
		showConfirm: false
	};

	exitAction = () => {
		bHistory.push("/");
	};

	render() {
		const {
			councilName,
			windowSize,
			translate
		} = this.props;
		const primary = getPrimary();

		return (
			<React.Fragment>
				<div
					style={{
						background: 'white',
						color: primary,
						display: "flex",
						borderBottom: '1px solid gainsboro',
						width: "100%",
						userSelect: "none",
						position: "absolute",
						zIndex: 1000,
						height: "3em",
						alignItems: "center",
						justifyContent: "space-between"
					}}
				>
					<div style={{ width: "15%" }}>
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
							width: "40%",
							fontWeight: '700',
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
						}}
					>
						<span style={{ alignSelf: "center" }}>
							{councilName}
						</span>
					</div>
					<div
						style={{
							width: "15%",
							display: "flex",
							flexDirection: "row",
							justifyContent: "flex-end",
							paddingRight: "1em"
						}}
					>
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
				</div>
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

export default withWindowSize(LiveMobileHeader);
