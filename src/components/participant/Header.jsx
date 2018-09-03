import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as mainActions from "../../actions/mainActions";
import logo from "../../assets/img/logo.png";
import icono from "../../assets/img/logo-icono.png";
import { Icon } from "../../displayComponents";
import withWindowSize from "../../HOCs/withWindowSize";
import { getPrimary, getSecondary } from "../../styles/colors";
import { IconButton, Typography, Tooltip } from "material-ui";
import { councilIsFinished } from '../../utils/CBX';

class Header extends React.Component {
	componentDidUpdate(){
		if(this.props.council) {
			if(councilIsFinished(this.props.council)){
				this.logout();
			}
		}
	}

	logout = () => {
		const { participant, council } = this.props;
		this.props.actions.logoutParticipant(participant, council);
	};

	render() {
		const { logoutButton, windowSize, primaryColor } = this.props;
		const { council } = this.props;
		const primary = getPrimary();


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
					background: primaryColor ? primaryColor : `linear-gradient(to right, ${getSecondary()}, ${primary})`,
					color: primaryColor ? getPrimary() : "white"
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						height: "100%",
						width: '15em',
						alignItems: "center"
					}}
				>
					<img
						src={windowSize !== "xs" ? logo : icono}
						className="App-logo"
						style={{
							height: "1.5em",
							marginLeft: "2em"
						}}
						alt="councilbox-logo"
					/>
				</div>



                {(council && council.name) &&
                    <div
						style={{
							width: "35%",
							marginRight: "10%",
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
						}}
					>
						<Tooltip title={council.name}>
							<div style={{ textAlign: "center", color: primary, fontWeight: '700', fontSize: '1.1em' }}>
								{council.name}
							</div>
						</Tooltip>
					</div>
                }
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: 'flex-end',
						width: '15em',
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
