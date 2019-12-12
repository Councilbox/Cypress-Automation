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
	CloseIcon,
	Scrollbar
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
import { PARTICIPANT_STATES, PARTICIPANT_ERRORS, PARTICIPANT_TYPE } from "../../../../constants";
import { useOldState, useHoverRow } from "../../../../hooks";
import SignatureButton from "./SignatureButton";
import { client } from "../../../../containers/App";
import gql from "graphql-tag";

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

	const showStateMenu = () => {
		return !(participant.representatives && participant.representatives.length > 0);
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

	console.log(participant);

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
				alignContent: "stretch",
				marginTop: "30px",
				padding: isMobile ? "" : props.windowSize === 'xs' ? '1.3em' : "1em",
			}}
		>
			<Scrollbar>
				<div style={{ height: '100%', display: 'flex', alignItems: 'center', }}>
					<div style={{ width: "100%", padding: "0.5em", height: "100%", }}>
						<Grid style={{ boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)", border: CBX.hasHisVoteDelegated(participant) ? "" : 'solid 1px #61abb7', borderRadius: '4px', padding: "1em" }}>
							<GridItem xs={12} md={4} lg={4}>
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
							</GridItem>
							<GridItem xs={12} md={8} lg={8}>
								{participant.personOrEntity !== 1 &&
									<div style={{ display: "flex", alignItems: "center" }}>
										{showStateMenu() &&
											<DropDownMenu
												claseHover={"classHover"}
												color="transparent"
												textStyle={{ boxShadow: "none", margin: "0px" }}
												// textStyle={{ boxShadow: "none", height: '100%', fontSize: "24px", minWidth: "24px", padding: "0", margin: "0px" }}
												buttonStyle={{ background: "white" }}
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
										}
										<div style={{ paddingLeft: landscape ? '1em' : "0", marginBottom: "0.5em" }}>
											<b>{`${translate.current_status}:  `}</b>
											{translate[CBX.getParticipantStateField(participant)]}
										</div>
									</div>
								}
								<div style={{}}>
									<ParticipantSelectActions
										participant={participant}
										council={props.council}
										translate={translate}
										refetch={data.refetch}
									/>
								</div>
								<Grid style={{ marginTop: "1em", display: "flex" }}>
									<GridItem xs={12} md={7} lg={5} style={{}}>
										{CBX.showSendCredentials(participant.state) &&
											<div style={{}}>
												<ResendCredentialsModal
													participant={participant}
													council={props.council}
													translate={translate}
													security={props.council.securityType > 0}
													refetch={data.refetch}
												/>
											</div>
										}
									</GridItem>
									<GridItem xs={12} md={5} lg={5}>
										{!CBX.isRepresented(participant) && props.council.councilType < 2 && !CBX.hasHisVoteDelegated(participant) && participant.personOrEntity !== 1 &&
											<div>
												<BasicButton
													text={participant.signed ? translate.user_signed : translate.to_sign}
													fullWidth
													buttonStyle={{ marginRight: "10px", width: "150px", border: `1px solid ${participant.signed ? primary : secondary}`, borderRadius: '4px', }}
													type="flat"
													color={secondary}
													onClick={openSignModal}
													textStyle={{ color: 'white', fontWeight: '700' }} //color: participant.signed ? primary : secondary
												/>
											</div>
										}
									</GridItem>
								</Grid>
							</GridItem>
						</Grid>

						{CBX.hasHisVoteDelegated(participant) &&
							<Grid style={{ marginBottom: "1em", display: "flex", alignItems: "center", boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)", border: 'solid 1px #61abb7', borderRadius: '4px', padding: "1em", marginTop: "1em", justifyContent: "space-between" }}>
								<GridItem xs={12} md={4} lg={3}>
									<div style={{ display: "flex" }}>
										<div style={{ color: secondary, position: "relative", width: "1.5em" }}>
											<i
												className={"fa fa-user-o"}
												style={{ position: "absolute", left: "0", top: "0", fontSize: "19px" }}
											/>
											<i
												className={"fa fa-user"}
												style={{ position: "absolute", right: "4px", bottom: "4px" }}
											/>
										</div>
										<div style={{
											whiteSpace: 'nowrap',
											overflow: 'hidden',
											textOverflow: 'ellipsis'
										}}>
											Representado por : <b>{participant.representative.name + " " + participant.representative.surname} </b>
										</div>
									</div>
								</GridItem>
								<GridItem xs={12} md={3} lg={3} style={{ display: "flex", justifyContent: props.innerWidth < 960 ? "" : "center", }}>
									<div style={{ display: "flex", alignItems: "center", overflow: "hidden" }}>
										<div style={{ display: "flex" }}>
											<StateIcon
												translate={translate}
												state={participant.representative.state}
												ratio={0.9}
												styles={{ display: "flex", alignItems: "center", paddingLeft: "0px" }}
											/>
										</div>
										<div style={{
											width: "100%",
											whiteSpace: 'nowrap',
											overflow: 'hidden',
											textOverflow: 'ellipsis'
										}}>
											{translate[CBX.getParticipantStateField(participant.representative)]}
										</div>
									</div>
								</GridItem>
								<GridItem xs={12} md={5} lg={6}>
									<Grid style={{}}>
										<GridItem xs={12} md={9} lg={6} style={{}}>
											<div style={{ marginRight: "1em", borderRadius: "4px", }}>
												<ResendCredentialsModal
													participant={participant}
													council={props.council}
													translate={translate}
													security={props.council.securityType > 0}
													refetch={data.refetch}
												/>
											</div>
										</GridItem>
										<GridItem xs={12} md={5} lg={5}>
											<div>
												<BasicButton
													text={participant.signed ? translate.user_signed : translate.to_sign}
													fullWidth
													buttonStyle={{ borderRadius: "4px", marginRight: "10px", width: "150px", border: `1px solid ${participant.signed ? primary : secondary}` }}
													type="flat"
													color={secondary}
													onClick={openSignModal}
													textStyle={{ color: "white", fontWeight: '700' }}
												/>
											</div>
										</GridItem>
									</Grid>
								</GridItem>
							</Grid>
						}
					</div>
				</div>


				{/* <div>
					<Grid >
						<GridItem xs={landscape ? 12 : 12} md={4} style={{ marginBottom: "0.8em", padding: "0" }}>
							<div style={{ width: "100%", borderBottom: "1px solid gainsboro", textAlign: "center", marginBottom: "0.8em" }}>
								<h4 style={{ width: '100%' }}>Info</h4>
							</div>
							<div style={{ display: "flex", padding: "5px" }} >
								<GridItem xs={landscape ? 2 : 12} md={2} style={{ textAlign: "center" }}>
									<TypeIcon
										translate={translate}
										type={participant.type}
										ratio={1.3}
									/>
								</GridItem>
								<GridItem xs={landscape ? 3 : 12} md={10} style={{ display: 'flex', ...(isMobile ? { justifyContent: 'left' } : {}) }}>
									<div style={{ marginLeft: isMobile ? "1em" : "2em", width: "100%", overflow: "hidden" }}>
										<Typography variant="body2" >
											<div style={{ paddingLeft: '1em' }}>
											</div>
											<div >
												<ParticipantDisplay
													participant={participant}
													translate={translate}
													refetch={data.refetch}
													council={props.council}
												/>
											</div>
										</Typography>
									</div>
								</GridItem>
							</div>
						</GridItem>
						<GridItem xs={landscape ? 12 : 12} md={4} style={{ marginBottom: "0.8em", padding: "0" }}>
							<div style={{ width: "100%", borderBottom: "1px solid gainsboro", textAlign: "center", minHeight: '2px', marginBottom: "0.8em" }}>
								{participant.personOrEntity !== 1 &&
									<h4 style={{ width: '100%' }}>{translate.state}</h4>
								}
							</div>
							<div style={{ display: "flex", padding: "5px" }} >
								{participant.personOrEntity !== 1 &&
									<React.Fragment>
										<GridItem xs={landscape ? 1 : 12} md={3}>
											<div>
												{showStateMenu() &&
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
												}
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
										<GridItem xs={landscape ? 3 : 12} md={9} style={{ display: 'flex', ...(isMobile ? { justifyContent: 'center' } : {}) }}>
											<div style={{ marginLeft: '1.3em', width: "100%" }}>
												<Typography variant="body2" >
													<div style={{ paddingLeft: landscape ? '1em' : "0", marginBottom: "0.5em" }}>
														<b>{`${translate.current_status}:  `}</b>
														{translate[CBX.getParticipantStateField(participant)]}
													</div>
													{showStateMenu() &&
														<div style={{ paddingLeft: '1em', display: isMobile ? "none" : "block" }}>
															<ParticipantStateSelector
																inDropDown={true}
																participant={participant}
																council={props.council}
																translate={translate}
																refetch={data.refetch}
															/>
														</div>
													}
												</Typography>

											</div>
										</GridItem>
									</React.Fragment>
								}
							</div>
						</GridItem>
						<GridItem xs={landscape ? 12 : 12} md={4} style={{ marginBottom: "0.8em", padding: "0" }}>
							<div style={{ width: "100%", borderBottom: "1px solid gainsboro", textAlign: "center", marginBottom: "0.8em" }}>
								<h4 style={{ width: '100%' }}>{translate.actions}</h4>
							</div>
							<div style={{ display: "flex", padding: "5px" }} >
								<GridItem xs={landscape ? 3 : 12} md={11} style={{ marginLeft: isMobile ? "0" : "25px" }}>
									<React.Fragment>
										<ParticipantSelectActions
											participant={participant}
											council={props.council}
											translate={translate}
											refetch={data.refetch}
										/>
									</React.Fragment>
								</GridItem>
							</div>
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
									<React.Fragment>
										<RepresentativeMenu
											council={props.council}
											translate={translate}
											data={data}
											participant={participant}
										/>
									</React.Fragment>
									{CBX.hasHisVoteDelegated(participant) && (
										<React.Fragment>
											<Typography variant="subheading">
												{translate.voting_delegate}
											</Typography>
											<ParticipantTable
												representative={true}
												translate={translate}
												participants={[participant.representative]}
											/>
										</React.Fragment>
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
									margin: "0"
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
										{!CBX.isRepresented(participant) && props.council.councilType < 2 && !CBX.hasHisVoteDelegated(participant) && participant.personOrEntity !== 1 &&
											<div>
												<SignatureButton
													participant={participant}
													open={openSignModal}
													translate={translate}
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
										liveMobil={isMobile}
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
				</div> */}
			</Scrollbar>
		</div>
	);
}


const setMainRepresentative = gql`
	mutation setMainRepresentative($participantId: Int!, $representativeId: Int!){
				setMainRepresentative(participantId: $participantId, representativeId: $representativeId){
				success
			}
			}
		`;

const RepresentativeMenu = ({ participant, translate, data, ...props }) => {
	const [signatureModal, setSignatureModal] = React.useState(false);
	const representative = CBX.getMainRepresentative(participant);
	const secondary = getSecondary();

	const appointRepresentative = async () => {
		const response = await client.mutate({
			mutation: setMainRepresentative,
			variables: {
				participantId: participant.id,
				representativeId: representative.id
			}
		});

		if (response.data) {
			data.refetch();
		}
	}

	if (!representative) {
		return <span />
	}

	return (
		<div style={{ marginBottom: '1em' }}>
			<Typography variant="subheading">
				{translate.representative}
			</Typography>
			<div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
				{`${representative.name} ${representative.surname}`}
				{participant.state !== PARTICIPANT_STATES.DELEGATED ?
					<React.Fragment>
						{CBX.showSendCredentials(representative.state) &&
							<div>
								<ResendCredentialsModal
									participant={representative}
									council={props.council}
									translate={translate}
									security={props.council.securityType > 0}
									refetch={data.refetch}
								/>
							</div>
						}

						{/* <div style={{ paddingLeft: '1em', display: isMobile ? "none" : "block" }}>
							<ParticipantStateSelector
								inDropDown={true}
								participant={{
									...representative,
									delegatedVotes: participant.delegatedVotes
								}}
								council={props.council}
								translate={translate}
								refetch={data.refetch}
							/>
						</div> */}
						{!CBX.isRepresented(representative) && props.council.councilType < 2 && !CBX.hasHisVoteDelegated(representative) &&
							<div>
								<SignatureButton
									participant={representative}
									open={() => setSignatureModal(true)}
									translate={translate}
								/>
							</div>
						}
						<DropDownMenu
							claseHover={"classHover"}
							color="transparent"
							id={'dropdownEstados'}
							style={{ paddingLeft: '0px', paddingRight: '0px' }}
							icon={
								<StateIcon
									translate={translate}
									state={representative.state}
									ratio={1.3}
								/>
							}
							items={
								<React.Fragment>
									<ParticipantStateList
										participant={representative}
										council={props.council}
										translate={translate}
										refetch={data.refetch}
										inDropDown={true}
									/>
								</React.Fragment>
							}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
						/>
						{signatureModal &&
							<SignatureModal
								show={signatureModal}
								council={props.council}
								participant={representative}
								refetch={data.refetch}
								requestClose={() => setSignatureModal(false)}
								translate={translate}
							/>
						}
					</React.Fragment>
					:
					<BasicButton
						text="Otogar voto"
						color="white"
						textStyle={{ color: secondary }}
						onClick={appointRepresentative}
						buttonStyle={{ border: `1px solid ${secondary}` }}
					/>
				}
			</div>
		</div>
	)
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


const HoverableRow = ({ primary, participant, quitDelegatedVote, enableActions, representative }) => {
	const [showActions, rowHandlers] = useHoverRow();

	return (
		<TableRow {...rowHandlers}>
			<TableCell style={{ padding: "0.2em" }}>
				{`${participant.name} ${participant.surname}`}
			</TableCell>
			<TableCell style={{ padding: "0.2em" }}>{`${
				participant.dni
				}`}</TableCell>
			<TableCell style={{ padding: "0.2em" }}>{`${
				participant.position
				}`}</TableCell>
			<TableCell style={{ padding: "0.2em" }}>{!representative && participant.numParticipations}</TableCell>
			<TableCell style={{ padding: "0.2em" }}>
				<div style={{ width: '4em' }}>
					{(showActions && enableActions) && (
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
