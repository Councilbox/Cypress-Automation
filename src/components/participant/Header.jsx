import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as mainActions from "../../actions/mainActions";
import logo from "../../assets/img/logo.png";
import icon from "../../assets/img/logo-icono.png";
import { Icon, AlertConfirm } from "../../displayComponents";
import withWindowSize from "../../HOCs/withWindowSize";
import { getPrimary, getSecondary } from "../../styles/colors";
import { IconButton, Tooltip, Card, Drawer, withStyles } from "material-ui";
import { councilIsFinished, showNumParticipations } from '../../utils/CBX';
import Convene from "../council/convene/Convene";
import { useOldState } from "../../hooks";
import withSharedProps from "../../HOCs/withSharedProps";
import { COUNCIL_TYPES, PARTICIPANT_STATES } from "../../constants";
import { getCustomLogo, getCustomIcon } from "../../utils/subdomain";
import { withApollo } from "react-apollo";
import gql from "graphql-tag";
import { isMobile } from "../../utils/screen";
import { HEADER_HEIGHT } from "../../styles/constants";


const Header = ({ participant, council, translate, logoutButton, windowSize, primaryColor, titleHeader, classes, info, ...props }) => {
	const [state, setState] = useOldState({
		showConvene: false,
		showCouncilInfo: false,
		showParticipantInfo: false,
		drawerTop: false
	});
	const [exitModal, setExitModal] = React.useState(false);
	const primary = getPrimary();
	const secondary = getSecondary();
	const customLogo = getCustomLogo();
	const customIcon = getCustomIcon();

	React.useEffect(() => {
		if (council && councilIsFinished(council)) {
			logout();
		}
	}, [council]);

	const logout = () => {
		props.actions.logoutParticipant(participant, council);
	}

	const leaveRoom = async () => {
		await props.client.mutate({
			mutation: gql`
				mutation LeaveRoom {
					participantLeaveRoom{
						success
					}
				}
			`
		});
		props.actions.logoutParticipant(participant, council);
	}

	const _renderConveneBody = () => {
		return (
			<div style={{ borderTop: `5px solid ${primary}`, marginBottom: "1em", }}>
				<div style={{ marginTop: "1em", marginRight: "1em", justifyContent: "flex-end", display: "flex" }}>
					< i
						className={"fa fa-close"}
						style={{
							cursor: "pointer",
							fontSize: "1.5em",
							color: secondary
						}}
						onClick={() => setState({ drawerTop: false })}
					/>
				</div>
				<div style={{ margin: "0 auto" }}>
					<Convene
						noButtonsDownload={true}
						council={council}
						translate={translate}
						agendaNoSession={props.agendaNoSession}
					/>
				</div>
			</div>
		)
	}


	const calculateParticipantVotes = () => {
		return showNumParticipations(participant.delegatedVotes.reduce((a, b) => a + b.numParticipations, participant.numParticipations), council.company, council.statute);
	}

	const _renderParticipantInfo = () => {
		const delegations = participant.delegatedVotes.filter(vote => vote.state === PARTICIPANT_STATES.DELEGATED);
		const representations = participant.delegatedVotes.filter(vote => vote.state === PARTICIPANT_STATES.REPRESENTATED);

		//TRADUCCION
		return (
			<div>
				<Card style={{ padding: "20px" }}>
					<div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
						<b>&#8226; {`${translate.name}`}</b>: {`${participant.name} ${participant.surname || ''}`}
					</div>
					<div style={{ marginBottom: '1em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
						<b>&#8226; {`${translate.email}`}</b>: {`${participant.email}`}
					</div>
					{participant.voteDenied &&
						<div style={{ marginBottom: '1em' }}>
							Su derecho a voto <strong>ha sido denegado</strong>
							{participant.voteDeniedReason &&
								<div>{`El motivo indicado es: ${participant.voteDeniedReason}`}</div>
							}
						</div>
					}

					{delegations.length > 0 &&
						translate.you_have_following_delegated_votes
					}
					{delegations.map(vote => (
						<div key={`delegatedVote_${vote.id}`} style={{ padding: '0.3em', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
							<span>{`${vote.name} ${vote.surname || ''} - ${translate.votes}: ${showNumParticipations(vote.numParticipations, council.company, council.statute)}`}</span>
							{vote.voteDenied &&
								<span style={{ color: 'red', marginLeft: '0.6em' }}>(Voto denegado)</span>
							}
						</div>
					)
					)}
					{representations.length > 0 &&
						translate.representative_of
					}
					{representations.map(vote => (
						<div key={`delegatedVote_${vote.id}`} style={{ padding: '0.3em', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
							<span>{`${vote.name} ${vote.surname || ''} - ${translate.votes}: ${showNumParticipations(vote.numParticipations, council.company, council.statute)}`}</span>
							{vote.voteDenied &&
								<span style={{ color: 'red', marginLeft: '0.6em' }}>(Voto denegado)</span>
							}
						</div>
					)
					)}
					{council.councilType !== COUNCIL_TYPES.ONE_ON_ONE &&
						`${translate.total_votes}: ${calculateParticipantVotes()}`
					}
				</Card>
			</div>
		)
	}

	return (
		<header
			className="App-header"
			style={{
				height: HEADER_HEIGHT,
				display: "flex",
				flexDirection: "row",
				width: "100%",
				justifyContent: "space-between",
				borderBottom: '1px solid gainsboro',
				alignItems: "center",
				background: 'white',
				color: primary
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					height: "100%",
					width: windowSize === "xs" ? '5em' : '15em',
					alignItems: "center",
				}}
			>
				<div style={{ position: "relative" }}>
					<img
						src={windowSize !== "xs" ? customLogo ? customLogo : logo : customIcon ? customIcon : icon}
						className="App-logo"
						style={{
							height: "1.5em",
							marginLeft: "1em",
							// marginLeft: "2em",
							userSelect: 'none'
						}}
						alt="logo"
					>
					</img>
				</div>
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
			{council &&
				<Tooltip title={translate.view_original_convene}>
					<Icon
						onClick={() => setState({ drawerTop: !state.drawerTop })}
						className="material-icons"
						style={{
							cursor: "pointer",
							color: primary,
							marginRight: "0.4em",
							width: "30px"
						}}
					>
						list_alt
					</Icon>
				</Tooltip>
			}
			{council &&
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: 'flex-end',
						width: windowSize === "xs" ? '6em' : '15em',
						alignItems: "center"
					}}
				>
					{participant &&
						<Tooltip title={translate.participant_data}>
							<Icon
								onClick={() =>
									setState({
										showParticipantInfo: true
									})
								}
								className="material-icons"
								style={{
									cursor: 'pointer',
									color: primary,
									marginRight: "0.4em"
								}}
							>
								person
						</Icon>
						</Tooltip>
					}
					{(council && logoutButton) && (
						<>
							<AlertConfirm
								bodyText={translate.participant_leave_room_warning}
								title={translate.warning}
								acceptAction={leaveRoom}
								open={exitModal}
								requestClose={() => setExitModal(false)}
								buttonCancel={translate.cancel}
								buttonAccept={translate.exit}
							/>
							<IconButton
								style={{
									marginRight: "0.5em",
									outline: "0"
								}}
								aria-label="help"
								onClick={() => setExitModal(true)}
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
						</>
					)
					}
				</div>
			}

			{(council) &&
				<Drawer
					className={"drawerConveneRoot"}
					BackdropProps={{
						className: "drawerConvene"
					}}
					classes={{
						paperAnchorTop: classes.paperAnchorTop,
					}}
					anchor="top"
					open={state.drawerTop}
					transitionDuration={0}
					onClose={() => setState({ drawerTop: false })}
				>
					{_renderConveneBody()}
				</Drawer>
			}
			{state.showParticipantInfo &&
				<AlertConfirm
					requestClose={() => setState({ showParticipantInfo: false })}
					open={state.showParticipantInfo}
					acceptAction={() => setState({ showParticipantInfo: false })}
					buttonAccept={translate.accept}
					bodyText={_renderParticipantInfo()}
					title={translate.participant_data}
					bodyStyle={{ paddingTop: "5px", margin: "10px" }}
				/>
			}
		</header>
	);

}



const Marquee = ({ children, isMobile }) => {
	const [state, setState] = React.useState({
		stop: false
	});

	const stylesMove = {
		display: 'inline-block',
		paddingLeft: '100%',
		textIndent: '0',
		animation: 'marquee 30s linear infinite',
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

export default withApollo(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(withWindowSize(withStyles(styles)(withSharedProps()(Header)))));
