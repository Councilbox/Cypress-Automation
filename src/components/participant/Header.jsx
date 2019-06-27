import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as mainActions from "../../actions/mainActions";
import logo from "../../assets/img/logo.png";
import icono from "../../assets/img/logo-icono.png";
import { variant } from "../../config";
import conpaasLogo from "../../assets/img/conpaas_logo.png";
import coeLogo from "../../assets/img/coe.png";
import { Icon, AlertConfirm } from "../../displayComponents";
import withWindowSize from "../../HOCs/withWindowSize";
import { getPrimary, getSecondary } from "../../styles/colors";
import { IconButton, Tooltip, Card, Drawer, withStyles } from "material-ui";
import { councilIsFinished } from '../../utils/CBX';
import { isMobile } from "react-device-detect";
import Convene from "../council/convene/Convene";
// import * as CBX from '../../../utils/CBX';



class Header extends React.Component {

	state = {
		showConvene: false,
		showCouncilInfo: false,
		showParticipantInfo: false,
		drawerTop: false
	}


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

	_renderConveneBody = () => {
		return (
			<div style={{ borderTop: `5px solid ${getPrimary()}`, marginBottom: "1em",  }}>
				<div style={{ marginTop: "1em", marginRight: "1em", justifyContent: "flex-end", display: "flex" }}>
					< i
						className={"fa fa-close"}
						style={{
							cursor: "pointer",
							fontSize: "1.5em",
							color: getSecondary(),
						}}
						onClick={() => this.setState({ drawerTop: false })}
					/>
				</div>
				<div style={{ margin: "0 auto" }}>
					<Convene
						noButtonsDownload={true}
						council={this.props.council}
						translate={this.props.translate}
						agendaNoSession={this.props.agendaNoSession}
					/>
				</div>
			</div >
		)
	}


	calculateParticipantVotes = () => {
		return this.props.participant.delegatedVotes.reduce((a, b) => a + b.numParticipations, this.props.participant.numParticipations);
	}

	_renderParticipantInfo = () => {
		const { translate, participant } = this.props;

		return (
			<div>
				<Card style={{ padding: "20px" }}>
					<div>
						<b>&#8226; {`${translate.name}`}</b>: {`${participant.name} ${participant.surname}`}
					</div>
					<div style={{ marginBottom: '1em' }}>
						<b>&#8226; {`${translate.email}`}</b>: {`${participant.email}`}
					</div>
					<div>
						{`${this.props.translate.you_have_following_delegated_votes}:`}
						{participant.delegatedVotes.map(vote => (
							<div key={`delegatedVote_${vote.id}`}>
								<b>{`${vote.name} ${vote.surname} - Votos `}</b> : {`${vote.numParticipations}`/*TRADUCCION*/}
							</div>
						))}
						<br></br>
					</div>
					{`${this.props.translate.total_votes}: ${this.calculateParticipantVotes()}`}
				</Card>
			</div >
		)
	}


	render() {
		const { logoutButton, windowSize, primaryColor, titleHeader, translate, classes } = this.props;
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
					{variant === 'COE' ?
						<div>
							<img
								src={windowSize !== "xs" ? conpaasLogo : icono}
								className="App-logo"
								style={{
									height: "1.5em",
									marginLeft: "1em",
									// marginLeft: "2em",
									userSelect: 'none'
								}}
								alt="logo"
							/>
							<img
								src={windowSize !== "xs" ? coeLogo : icono}
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
							width: '65%',
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
				<Tooltip title={translate.view_original_convene}>
					<Icon
						onClick={() => this.setState({ drawerTop: !this.state.drawerTop })}
						className="material-icons"
						style={{
							cursor: "pointer",
							color: getPrimary(),
							marginRight: "0.4em",
							width:"30px"
						}}
					>
						list_alt
            		</Icon>
				</Tooltip>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: 'flex-end',
						width: windowSize === "xs" ? '6em' : '15em',
						alignItems: "center"
					}}
				>
					<Tooltip title={translate.participant_data}>
						<Icon
							onClick={() =>
								this.setState({
									showParticipantInfo: true
								})
							}
							className="material-icons"
							style={{
								cursor: 'pointer',
								color: getPrimary(),
								marginRight: "0.4em"
							}}
						>
							person
						</Icon>
					</Tooltip>
					{
						logoutButton && (
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
						)
					}
				</div >
				{/* {this.state.showConvene &&
					<AlertConfirm
						requestClose={() => this.setState({ showConvene: false })}
						open={this.state.showConvene}
						acceptAction={this.closeConveneModal}
						buttonAccept={translate.accept}
						bodyText={this._renderConveneBody()}
						title={translate.original_convene}
					/>
				} */}
				{
					this.state.drawerTop &&
					<Drawer
						className={"drawerConveneRoot"}
						BackdropProps={{
							className: "drawerConvene"
						}}
						classes={{
							paperAnchorTop: classes.paperAnchorTop,
						}}
						anchor="top"
						open={this.state.drawerTop}
						onClose={() => this.setState({ drawerTop: false })}
					>
						{this._renderConveneBody()}
					</Drawer>
				}
				{
					this.state.showParticipantInfo &&
					<AlertConfirm
						requestClose={() => this.setState({ showParticipantInfo: false })}
						open={this.state.showParticipantInfo}
						acceptAction={this.closeParticipantInfoModal}
						buttonAccept={translate.accept}
						bodyText={this._renderParticipantInfo()}
						title={translate.participant_data}
						bodyStyle={{ paddingTop: "5px", margin: "10px" }}
					/>
				}
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
		title = children[0].agendaSubject

		if (isMobile) {
			if (title.length > 20) {
				style = stylesMove
			} else {
				style = stylesNoMove
			}
		} else {
			if (title.length > 45) {
				style = stylesMove
			} else {
				style = stylesNoMove
			}
		}
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

const styles = {
	paperAnchorTop: {
		top: "44px",
		borderBottom: `5px solid ${getPrimary()}`,
	},
	paper: {
		top: "44px",
	}
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
)(withWindowSize(withStyles(styles)(Header)));
