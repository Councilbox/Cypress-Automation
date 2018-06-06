import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as mainActions from "../../actions/mainActions";
import logo from "../../assets/img/logo.png";
import icono from "../../assets/img/logo-icono.png";
import { Link } from "react-router-dom";
import { Icon } from "../../displayComponents";
import withWindowSize from "../../HOCs/withWindowSize";
import { primary } from "../../styles/colors";
import { IconButton } from "material-ui";

class Header extends Component {
	logout = () => {
		const { participant, council } = this.props;
		this.props.actions.logoutParticipant(participant, council);
	};

	render() {
		const language = this.props.translate && this.props.translate.selectedLanguage;
		const { logoutButton, windowSize } = this.props;

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
					{logoutButton && (
						<IconButton
							style={{
								marginRight: "0.5em",
								outline: "0"
							}}
							aria-label="help"
							onClick={this.logout}
						>
							<Icon
								className="material-icons"
								style={{
									color: primary,
									fontSize: "0.9em"
								}}
							>
								exit_to_app
							</Icon>
						</IconButton>
					)}
				</div>
			</header>
		);
	}
}

const mapStateToProps = state => ({
	main: state.main
});

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators(mainActions, dispatch)
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withWindowSize(Header));
