import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as mainActions from "../../actions/mainActions";
import logo from "../../assets/img/logo.png";
import icono from "../../assets/img/logo-icono.png";
import { Icon } from "../../displayComponents";
import withWindowSize from "../../HOCs/withWindowSize";
import { primary, getPrimary, getSecondary } from "../../styles/colors";
import { IconButton } from "material-ui";

class Header extends React.PureComponent {
	logout = () => {
		const { participant, council } = this.props;
		this.props.actions.logoutParticipant(participant, council);
	};

	render() {
		const { logoutButton, windowSize, primaryColor } = this.props;
		const { council } = this.props;


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
					background: primaryColor ? primaryColor : `linear-gradient(to right, ${getSecondary()}, ${getPrimary()})`,
					color: primaryColor ? getPrimary() : "white"
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
					{
						council ?
						<img
							src={council.company.logo ? council.company.logo : windowSize !== "xs" ? logo : icono}
							className="App-logo"
							style={{
								height: "2.2em",
								marginLeft: "2em"
							}}
							alt="logo"
						/>
						:

						<img
							src={windowSize !== "xs" ? logo : icono}
							className="App-logo"
							style={{
								height: "2.2em",
								marginLeft: "2em"
							}}
							alt="logo"
						/>
					}
				</div>

                {(council && council.name) &&
                    <div>
                        {council.name}
                    </div>
                }

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
									color: primaryColor ? primary : 'white',
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
