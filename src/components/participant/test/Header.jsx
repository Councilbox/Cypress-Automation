import React from "react";
import logo from "../../../assets/img/logo.png";
import icono from "../../../assets/img/logo-icono.png";
import { Link } from "react-router-dom";
import { Icon } from "../../../displayComponents";
import { bHistory } from "../../../containers/App";
import withWindowSize from "../../../HOCs/withWindowSize";
import { getSecondary, primary } from "../../../styles/colors";
import { IconButton, Tooltip } from "material-ui";

class Header extends React.Component {
	logout = () => {
		this.props.actions.logout();
	};

	goBack = () => {
		bHistory.goBack();
	};

	render() {
		const {
			backButton,
			windowSize,
			helpModal,
			helpModalAction
		} = this.props;

		return (
			<header
				className="App-header"
				style={{
					height: "3em",
					display: "flex",
					flexDirection: "row",
					width: "100%",
					justifyContent: "space-between",
					alignItems: "center",
					backgroundColor: "white"
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						height: "100%",
						alignItems: "center"
					}}
				>
					{backButton && (
						<Tooltip
							title={this.props.translate.back}
							placement="bottom"
						>
							<div
								style={{
									cursor: "pointer",
									width: "2em",
									height: "60%",
									borderRight: "1px solid darkgrey",
									display: "flex",
									alignItems: "center"
								}}
								onClick={this.goBack}
							>
								<Icon
									className="material-icons"
									style={{ color: getSecondary() }}
								>
									keyboard_arrow_left
								</Icon>
							</div>
						</Tooltip>
					)}
					<Link to="/">
						<img
							src={windowSize !== "xs" ? logo : icono}
							className="App-logo"
							style={{
								height: "1.5em",
								marginLeft: "2em"
							}}
							alt="logo"
						/>
					</Link>
				</div>

				<div
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center"
					}}
				>
					{helpModal &&
						windowSize === "xs" && (
							<IconButton
								style={{
									marginRight: "0.5em",
									outline: "0"
								}}
								aria-label="help"
								onClick={helpModalAction}
							>
								<Icon
									className="material-icons"
									style={{
										color: primary,
										fontSize: "0.9em"
									}}
								>
									live_help
								</Icon>
							</IconButton>
						)}
				</div>
			</header>
		);
	}
}

export default withWindowSize(Header);
