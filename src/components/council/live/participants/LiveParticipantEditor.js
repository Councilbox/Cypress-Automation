import React from "react";
import { compose, graphql } from "react-apollo";
import { liveParticipant, updateParticipantSends } from "../../../../queries";
import { isLandscape } from "../../../../utils/screen";
import { isMobile } from 'react-device-detect';
import { getPrimary, getSecondary } from "../../../../styles/colors";
import {
	Typography,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell
} from "material-ui";
import {
	Grid,
	GridItem,
	BasicButton,
	LoadingSection,
	DropDownMenu,
	ParticipantDisplay,
	RefreshButton,
	CloseIcon
} from "../../../../displayComponents";
import * as CBX from "../../../../utils/CBX";
import SignatureModal from "./modals/SignatureModal";
import withWindowSize from '../../../../HOCs/withWindowSize';
import ParticipantStateSelector from "./ParticipantStateSelector";
import ParticipantStateList from "./ParticipantStateList";
import NotificationsTable from "../../../notifications/NotificationsTable";
import { changeParticipantState } from "../../../../queries/liveParticipant";
import StateIcon from "./StateIcon";
import TypeIcon from "./TypeIcon";
import ParticipantSelectActions from "./ParticipantSelectActions";
import DownloadCBXDataButton from "../../prepare/DownloadCBXDataButton";
import ResendCredentialsModal from "./modals/ResendCredentialsModal";
import { PARTICIPANT_STATES } from "../../../../constants";
import { useOldState } from "../../../../hooks";

const LiveParticipantEditor = ({ data, translate, ...props }) => {
	const [state, setState] = useOldState({
		loadingSends: false,
		showSignatureModal: false,
		visib: false
	});
	const primary = getPrimary();
	const secondary = getSecondary();
	const landscape = isLandscape() || window.innerWidth > 700;

	const openSignModal = () => {
		setState({
			showSignatureModal: true
		});
	}

	const closeSignModal = () => {
		setState({
			showSignatureModal: false
		});
	}

	const refreshEmailStates = async () => {
		setState({
			loadingSends: true
		});
		const response = await props.updateParticipantSends({
			variables: {
				participantId: data.liveParticipant.id
			}
		});

		if (response.data.updateParticipantSends.success) {
			data.refetch();
			setState({
				loadingSends: false
			});
		}
	};

	const removeDelegatedVote = async id => {
		const response = await props.changeParticipantState({
			variables: {
				participantId: id,
				state: 0
			}
		});

		if (response) {
			data.refetch();
		}
	}

	const handleToggleVisib = () => {
		const visib = !state.visib;
		setState({
			visib
		});
	}

	if (!data.liveParticipant) {
		return <LoadingSection />;
	}

	let participant = { ...data.liveParticipant };

	participant.representing = participant.delegatedVotes.find(vote => vote.state === PARTICIPANT_STATES.REPRESENTATED);
	participant.delegatedVotes = participant.delegatedVotes.filter(vote => vote.state !== PARTICIPANT_STATES.REPRESENTATED);

	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				paddingTop: '2em',
				display: "flex",
				flexDirection: "column",
				justifyContent: "flex-start",
				alignItems: "stretch",
				overflow: 'auto',
				alignContent: "stretch",
				marginTop: "30px",
				padding: props.windowSize === 'xs' ? '1.3em' : "1em",
			}}
		>
			<div>
				<Grid >
					<GridItem xs={landscape ? 12 : 6} md={4}
						style={{
							display: isMobile ? "none" : "flex",
							textAlign: "center",
							borderBottom: '1px solid #ddd',
							marginBottom: "0.8em",
							paddingBottom: "0.5em"
						}}>
						<h4 style={{ width: '100%' }}>Info</h4>
					</GridItem>
					<GridItem xs={landscape ? 12 : 6} md={4}
						style={{
							display: isMobile ? "none" : "flex",
							textAlign: "center",
							borderBottom: '1px solid #ddd',
							marginBottom: "0.8em",
							paddingBottom: "0.5em"
						}}>
						{participant.personOrEntity !== 1 &&
							<h4 style={{ width: '100%' }}>{translate.state}</h4>
						}
					</GridItem>
					<GridItem xs={landscape ? 12 : 6} md={4}
						style={{
							display: isMobile ? "none" : "flex",
							textAlign: "center",
							borderBottom: '1px solid #ddd',
							marginBottom: "0.8em",
							paddingBottom: "0.5em"
						}}>
						<h4 style={{ width: '100%' }}>{translate.actions}</h4>
					</GridItem>
					<GridItem xs={landscape ? 12 : 12} md={4} style={{ display: 'flex',marginBottom: "0.8em" }}>
						<GridItem xs={landscape ? 2 : 12} xs={3} md={2} style={{ textAlign: "center", display : isMobile ? "none": "block" }}>
							<TypeIcon
								translate={translate}
								type={participant.type}
								ratio={1.3}
							/>
						</GridItem>
						<GridItem xs={landscape ? 3 : 12} xs={9} md={10} style={{ marginLeft: isMobile ? '1.3em': "2.3em" , display: 'flex', ...(isMobile ? { justifyContent: 'left' } : {}) }}>
							<div style={{ marginLeft: "-1.4em" }}>
								<Typography variant="body2" >
									<div style={{ paddingLeft: '1em' }}>
									</div>
									<div >
										<ParticipantDisplay
											participant={participant}
											translate={translate}
											council={props.council}
										/>
									</div>
								</Typography>

							</div>
						</GridItem>
					</GridItem>
					<GridItem xs={landscape ? 12 : 12} md={4} style={{ display: 'flex',marginBottom: "0.8em" }}>
					{participant.personOrEntity !== 1 &&
						<React.Fragment>
							<GridItem xs={landscape ? 1 : 12} xs={3} md={3}>
								<div >
									<DropDownMenu
										claseHover={"classHover"}
										color="transparent"
										id={'dropdownEstados'}
										style={{ paddingLeft: '0px', paddingRight: '0px' }}
										icon={
											<StateIcon
												translate={translate}
												state={participant.state}
												ratio={1.3}
											/>
										}
										items={
											<React.Fragment>
												<ParticipantStateList
													participant={participant}
													council={props.council}
													translate={translate}
													refetch={props.refetch}
													inDropDown={true}
												/>
											</React.Fragment>
										}
										anchorOrigin={{
											vertical: 'bottom',
											horizontal: 'left',
										}}
									/>
								</div>
								<div
									style={{

										marginTop: "1em"
									}}
								>
								</div>
								<div
									style={{
										marginLeft: isMobile ? '0' : "0",
										marginTop: "0.5em"
									}}
								>
								</div>
							</GridItem>
							<GridItem xs={landscape ? 3 : 12} xs={9} md={9} style={{ display: 'flex', ...(isMobile ? { justifyContent: 'center' } : {}) }}>
								<div style={{ marginLeft: '1.3em', width: "100%" }}>
									<Typography variant="body2" >
										<div style={{ paddingLeft: landscape ? '1em' : "0", height: "45px", marginBottom: "0.5em" }}>
											<b>{`${translate.current_status}:  `}</b>
											{translate[CBX.getParticipantStateField(participant)]}
										</div>
										<div style={{ paddingLeft: '1em', display: isMobile ? "none": "block" }}>
											<ParticipantStateSelector
												inDropDown={true}
												participant={participant}
												council={props.council}
												translate={translate}
												refetch={data.refetch}
											/>
										</div>
									</Typography>

								</div>
							</GridItem>
						</React.Fragment>
					}
					</GridItem>
					<GridItem xs={landscape ? 12 : 12} md={4} style={{ display: 'flex',marginBottom: "0.8em" }}>
						<GridItem xs={landscape ? 3 : 12} xs={12} md={11} style={{ marginLeft: isMobile ? "0" : "25px" }}>
							<React.Fragment>
								<ParticipantSelectActions
									participant={participant}
									council={props.council}
									translate={translate}
									refetch={data.refetch}
								/>
							</React.Fragment>
						</GridItem>
					</GridItem>
				</Grid>
			</div>
			<hr
				style={{
					width: "100%"
				}}>
			</hr>
			<div
				style={{
					minHeight: 0,
					paddingRight: "0.5em"
				}}
			>
				<Grid>
					{(CBX.isRepresented(participant) ||
						CBX.hasHisVoteDelegated(participant)) && (
							<GridItem xs={12} lg={12} md={12}>
								{CBX.isRepresented(participant) && (
									<Typography variant="subheading">
										{translate.represented_by}
									</Typography>
								)}
								{CBX.hasHisVoteDelegated(participant) && (
									<Typography variant="subheading">
										{translate.voting_delegate}
									</Typography>
								)}
								{participant.representative && (
									<ParticipantTable
										representative={true}
										translate={translate}
										participants={[participant.representative]}
									/>
								)}
							</GridItem>
						)}

					{participant.representing && (
						<React.Fragment>
							<GridItem xs={12} lg={12} md={12} style={{ marginBottom: '1em' }}>
								<Typography variant="subheading">
									{'Representando a'}
								</Typography>
								<ParticipantTable
									translate={translate}
									participants={[participant.representing]}
									enableActions
									quitDelegatedVote={removeDelegatedVote}
									primary={primary}
								/>
							</GridItem>
						</React.Fragment>
					)}
					{participant.delegatedVotes.length > 0 && (
						<React.Fragment>
							<GridItem xs={12} lg={12} md={12}>
								<Typography variant="subheading">
									{translate.delegated_votes}
								</Typography>
								<ParticipantTable
									translate={translate}
									participants={participant.delegatedVotes}
									enableActions
									quitDelegatedVote={removeDelegatedVote}
									primary={primary}
								/>
							</GridItem>
						</React.Fragment>
					)}

					{!!participant.assistanceComment &&
						<GridItem xs={12} md={12} lg={12}>
							<Typography
								variant="subheading"
								style={{
									marginRight: "1em"
								}}
							>
								{translate.assistance_comment}
							</Typography>
							<div dangerouslySetInnerHTML={{ __html: participant.assistanceComment }} />
						</GridItem>
					}
					<React.Fragment>
						<GridItem
							xs={12}
							lg={12}
							md={12}
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								margin:"0"
							}}
						>
							<Grid>
								{!isMobile &&
									<GridItem xs={12} md={3} lg={2}
										style={{
											display: "flex"
										}}
									>
										<Typography
											variant="subheading"
											style={{
												marginRight: "1em"
											}}
										>
											{translate.sends}
										</Typography>
										<RefreshButton
											tooltip={translate.refresh_emails}
											loading={state.loadingSends}
											onClick={refreshEmailStates}
										/>
									</GridItem>
								}
								<GridItem xs={12} md={9} lg={10}
									style={{
										display: "flex",
										justifyContent: 'flex-end',
										marginLeft: isMobile ? '0' : "0",
										marginLeft: "auto"
									}}
								>
									{CBX.showSendCredentials(participant.state) &&
										<div>
											<ResendCredentialsModal
												participant={participant}
												council={props.council}
												translate={translate}
												security={props.council.securityType > 0}
												refetch={data.refetch}
											/>
										</div>
									}
									{!CBX.isRepresented(participant) && !CBX.hasHisVoteDelegated(participant) && participant.personOrEntity !== 1 &&
										<div>
											<BasicButton
												text={participant.signed ? translate.user_signed : translate.to_sign}
												fullWidth
												buttonStyle={{ marginRight: "10px", width: "150px", border: `1px solid ${participant.signed ? primary : secondary}` }}
												type="flat"
												color={"white"}
												onClick={openSignModal}
												textStyle={{ color: participant.signed ? primary : secondary, fontWeight: '700' }}
											/>
										</div>
									}
									{state.showSignatureModal &&
										<SignatureModal
											show={state.showSignatureModal}
											council={props.council}
											participant={participant}
											refetch={data.refetch}
											requestClose={closeSignModal}
											translate={translate}
										/>
									}

									{!isMobile &&
										<DownloadCBXDataButton
											style={{ width: "5.85em", marginLeft: "0px", height: "2.45em" }}
											translate={translate}
											participantId={participant.id}
										/>
									}
								</GridItem>
								{isMobile &&
									<GridItem xs={12} md={3} lg={2}
										style={{
											display: "flex"
										}}
									>
										<Typography
											variant="subheading"
											style={{
												marginRight: "1em"
											}}
										>
											{translate.sends}
										</Typography>
										<RefreshButton
											tooltip={translate.refresh_emails}
											loading={state.loadingSends}
											onClick={refreshEmailStates}
										/>
									</GridItem>
								}
							</Grid>
						</GridItem>
						{participant.notifications.length > 0 ? (
							<GridItem xs={12} lg={12} md={12}>
								<NotificationsTable
									notifications={participant.notifications}
									translate={translate}
									handleToggleVisib={handleToggleVisib}
									visib={state.visib}
								/>
							</GridItem>
						) : (
							<GridItem xs={12} md={12} lg={12}>
								{translate.no_files_sent}
							</GridItem>
						)
					}
					</React.Fragment>
				</Grid>
			</div>
		</div>
	);
}


const ParticipantTable = ({
	participants,
	representative,
	translate,
	enableActions,
	quitDelegatedVote,
	primary
}) => (
		<Table style={{ maxWidth: "100%", width: "100%" }}>
			<TableHead>
				<TableRow>
					<TableCell style={{ padding: "0.2em" }}>
						{translate.name}
					</TableCell>
					<TableCell style={{ padding: "0.2em" }}>
						{translate.dni}
					</TableCell>
					<TableCell style={{ padding: "0.2em" }}>
						{translate.position}
					</TableCell>
					<TableCell style={{ padding: "0.2em" }}>
						{!representative && translate.votes}
					</TableCell>
					<TableCell style={{ padding: "0.2em" }}>
					</TableCell>
				</TableRow>
			</TableHead>
			<TableBody style={{ height: "100px", overflowY: 'auto', overflowX: 'hidden' }}>
				{participants.map((participant, index) => (
					<HoverableRow
						key={`del_${index}`}
						primary={primary}
						participant={participant}
						enableActions={enableActions}
						representative={representative}
						quitDelegatedVote={quitDelegatedVote}
					/>
				))}
			</TableBody>
		</Table>
	);

class HoverableRow extends React.PureComponent {
	state = {
		showActions: false
	};

	mouseEnterHandler = () => {
		this.setState({ showActions: true });
	};

	mouseLeaveHandler = () => {
		this.setState({ showActions: false });
	};

	render() {
		const {
			primary,
			participant,
			quitDelegatedVote,
			enableActions
		} = this.props;
		const { showActions } = this.state;

		return (
			<TableRow
				onMouseOver={this.mouseEnterHandler}
				onMouseLeave={this.mouseLeaveHandler}>
				<TableCell style={{ padding: "0.2em" }}>
					{`${participant.name} ${participant.surname}`}
				</TableCell>
				<TableCell style={{ padding: "0.2em" }}>{`${
					participant.dni
					}`}</TableCell>
				<TableCell style={{ padding: "0.2em" }}>{`${
					participant.position
					}`}</TableCell>
				<TableCell style={{ padding: "0.2em" }}>{!this.props.representative && participant.numParticipations}</TableCell>
				<TableCell style={{ padding: "0.2em" }}>
					<div style={{ width: '4em' }}>
						{showActions &&
							enableActions && (
								<CloseIcon
									style={{ color: primary }}
									onClick={event => {
										quitDelegatedVote(participant.id);
										event.stopPropagation();
									}}
								/>
							)}
					</div>
				</TableCell>
			</TableRow>
		);
	}
}

export default compose(
	graphql(liveParticipant, {
		options: props => ({
			variables: {
				participantId: props.id
			},
			notifyOnNetworkStatusChange: true
		})
	}),
	graphql(changeParticipantState, {
		name: "changeParticipantState"
	}),
	graphql(updateParticipantSends, {
		name: "updateParticipantSends"
	})
)(withWindowSize(LiveParticipantEditor));
