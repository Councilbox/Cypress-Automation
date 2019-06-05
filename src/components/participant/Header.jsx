import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as mainActions from "../../actions/mainActions";
import logo from "../../assets/img/logo.png";
import icono from "../../assets/img/logo-icono.png";
import { Icon } from "../../displayComponents";
import withWindowSize from "../../HOCs/withWindowSize";
import { getPrimary } from "../../styles/colors";
import { IconButton, Tooltip } from "material-ui";
import { councilIsFinished } from '../../utils/CBX';
import { isMobile } from "react-device-detect";
// import * as CBX from '../../../utils/CBX';



class Header extends React.Component {
	componentDidUpdate() {
		if (this.props.council) {
			if (councilIsFinished(this.props.council)) {
				this.logout();
			}
		}
	}

	logout = () => {
		const { participant, council } = this.props;
		this.props.actions.logoutParticipant(participant, council);
	};


	render() {
		const { logoutButton, windowSize, primaryColor, titleHeader } = this.props;
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
					borderBottom: '1px solid gainsboro',
					alignItems: "center",
					background: 'white',
					color: getPrimary()
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						height: "100%",
						width: windowSize === "xs" ? '5em' : '15em',
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



				{(council && council.autoClose !== 1) &&
					<Marquee
						isMobile={isMobile}
					>
						{titleHeader}
					</Marquee>
				}


				{(council && council.name) && council.autoClose === 1 &&
					<div
						style={{
							width: windowSize === "xs" ? '65%' : "35%",
							display: 'flex',
							justifyContent: 'center'
						}}
					>
						<Tooltip title={council.name}>
							<div style={{
								color: primary,
								fontWeight: '700',
								fontSize: '1.1em',
								whiteSpace: 'nowrap',
								overflow: 'hidden',
								textOverflow: 'ellipsis'
							}}>
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
						width: windowSize === "xs" ? '5em' : '15em',
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
			</header >
		);
	}
}


const Marquee = ({ children, isMobile }) => {
	const [state, setState] = React.useState({
		stop: false
	});

	const stylesMove = {
		display: 'inline-block',
		paddingLeft: '100%',
		textIndent: '0',
		animation: 'marquee 30s linear infinite', //TODO Hacer algo para calcular los segundos
		marginBottom: '0'
	}
	const stylesNoMove = {
		marginBottom: '0',
		textAlign: 'center'
	}
	let style = {}
	let title 
	
	if (children !== undefined && children !== null && children[0] !== undefined) {
		if (isMobile) {
			if (children.length > 20) {
				style = stylesMove
			} else {
				style = stylesNoMove
			}
		} else {
			if (children.length > 45) {
				style = stylesMove
			} else {
				style = stylesNoMove
			}
		}
		
		title = children[0].agendaSubject
	}

	const toggle = () => {
		setState({
			stop: !state.stop
		})
	}

	return (
		<div className={'marquee'} style={{
			width: '45%',
			margin: '0 auto',
			whiteSpace: 'nowrap',
			overflow: 'hidden',
			boxSizing: 'border-box'
		}}
			onClick={toggle}
		>
			<p style={state.stop ? stylesNoMove : style}>
				{title}
			</p>
		</div>
	)
}

const mapStateToProps = state => ({
	main: state.main
});

const mapDispatchToProps = dispatch => {
	return {
		actions: bindActionCreators(mainActions, dispatch)
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withWindowSize(Header));
