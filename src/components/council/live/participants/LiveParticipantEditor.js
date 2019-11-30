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

						{CBX.isRepresented(participant)?
							<ParticipantBlock
								{...props}
								participant={participant.representative}
								translate={translate}
								active={true}
								openSignModal={openSignModal}
								data={data}
								stateText={translate.represented_by}
							/>
							:
							(participant.representatives && participant.representatives.length > 0) &&
								<ParticipantBlock
									{...props}
									participant={participant.representatives[0]}
									translate={translate}
									active={false}
									openSignModal={openSignModal}
									action={
										<GrantVoteButton
											participant={participant}
											refetch={data.refetch}
											representative={participant.representatives[0]}
											translate={translate}
										/>
									}
									data={data}
									stateText={translate.represented_by}
								/>
						}

						{CBX.hasHisVoteDelegated(participant) &&
							<ParticipantBlock
								{...props}
								active={true}
								participant={participant.representative}
								translate={translate}
								openSignModal={openSignModal}
								data={data}
								stateText={translate.delegated_in}
							/>
						}
					</div>
				</div>
			</Scrollbar>
		</div>
	);
}

const ParticipantBlock = ({ children, translate, data, action, active, openSignModal, stateText, participant, ...props }) => {
	const secondary = getSecondary();
	const primary = getPrimary();

	return (
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
						{`${stateText}:`}
						<b>{`${participant.name} ${participant.surname || ''}`}</b>
					</div>
				</div>
			</GridItem>
			<GridItem xs={12} md={3} lg={3} style={{ display: "flex", justifyContent: props.innerWidth < 960 ? "" : "center", }}>
				<div style={{ display: "flex", alignItems: "center", overflow: "hidden" }}>
					<div style={{ display: "flex" }}>
						<StateIcon
							translate={translate}
							state={participant.state}
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
						{translate[CBX.getParticipantStateField(participant)]}
					</div>
				</div>
			</GridItem>
			<GridItem xs={12} md={5} lg={6}>
				<Grid style={{}}>
					{active &&
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
					}
					
					<GridItem xs={12} md={5} lg={5}>
						{action ||
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
						}
					</GridItem>
				</Grid>
			</GridItem>
		</Grid>
	)
}


const setMainRepresentative = gql`
	mutation setMainRepresentative($participantId: Int!, $representativeId: Int!){
		setMainRepresentative(participantId: $participantId, representativeId: $representativeId){
		success
	}
}`;


const GrantVoteButton = ({ participant, representative, refetch }) => {
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
			refetch();
		}
	}

	return (
		<BasicButton
			text="Otogar voto"
			color="white"
			textStyle={{ color: secondary }}
			onClick={appointRepresentative}
			buttonStyle={{ border: `1px solid ${secondary}` }}
		/>
	)
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