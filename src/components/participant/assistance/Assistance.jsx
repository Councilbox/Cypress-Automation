import React from "react";
import { Card, Icon } from "material-ui";
import withTranslations from "../../../HOCs/withTranslations";
import { checkForUnclosedBraces } from "../../../utils/CBX";
import AssistanceOption from "./AssistanceOption";
import { compose, graphql } from "react-apollo";
import { setAssistanceIntention, setAssistanceComment } from "../../../queries/liveParticipant";
import { PARTICIPANT_STATES, PARTICIPANT_TYPE } from "../../../constants";
import { BasicButton, ButtonIcon, NotLoggedLayout, SectionTitle, LiveToast, Scrollbar } from '../../../displayComponents';
import RichTextInput from "../../../displayComponents/RichTextInput";
import DelegateOwnVoteAttendantModal from "./DelegateOwnVoteAttendantModal";
import RefuseDelegationConfirm from '../delegations/RefuseDelegationConfirm';
import NoAttendDelegationWarning from '../delegations/NoAttendDelegationWarning';
import DelegationItem from "./DelegationItem";
import DelegationProxyModal from './DelegationProxyModal';
import { canDelegateVotes } from "../../../utils/CBX"
import { getPrimary } from "../../../styles/colors";
import { toast } from 'react-toastify';
import { participantsToDelegate } from "../../../queries";
import AddRepresentativeModal from "../../council/live/AddRepresentativeModal";
import emptyMeetingTable from "../../../assets/img/empty_meeting_table.png";
import { CONSENTIO_ID } from "../../../config";
import MenuSuperiorTabs from "../../dashboard/MenuSuperiorTabs";
import withWindowSize from "../../../HOCs/withWindowSize";
import { isMobile } from "../../../utils/screen";


const styles = {
	viewContainer: {
		width: "100vw",
		height: "100vh",
		position: "relative"
	},
	mainContainer: {
		width: "100%",
		height: "100%",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		position: "relative",
		padding: '0'
	},
	cardContainer: {
		margin: isMobile? '5px' : "20px",
		maxWidth: "100%",
		height: 'calc(100% - 40px)'
	},
	buttonSection: {
		height: '3.5em',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		paddingRight: '1.2em',
		borderTop: '1px solid gainsboro'
	}
};

const Assistance = ({ participant, data, translate, council, company, refetch, setAssistanceComment, setAssistanceIntention }) => {
	const [state, setState] = React.useState({
		participant: {},
		savingAssistanceComment: false,
		delegationModal: false,
		addRepresentative: false,
		noAttendWarning: false,
		clean: true,
		...generateAttendanceData()
	});
	const primary = getPrimary();

	const [selecteAssistance, setSelecteAssistance] = React.useState('Reunión actual');
	const [openModalFirmasModal, setOpenModalFirmasModal] = React.useState(false);

	function generateAttendanceData() {
		if (participant.represented && participant.represented.length > 0) {
			const represented = participant.represented[0];
			if (represented.assistanceIntention === PARTICIPANT_STATES.DELEGATED) {
				return {
					assistanceIntention: represented.assistanceIntention || PARTICIPANT_STATES.REMOTE,
					delegateId: represented.delegateId,
					delegateInfoUser: represented.representative
				}
			}
		}

		return {
			assistanceIntention: participant.assistanceIntention || PARTICIPANT_STATES.REMOTE,
			delegateId: participant.state === PARTICIPANT_STATES.REPRESENTATED ? participant.delegateId : null,
			delegateInfoUser: participant.representative
		}
	}


	React.useEffect(() => {
		setState({
			...state,
			...generateAttendanceData()
		});
	}, [participant.state]);


	const resetButtonStates = () => {
		setState({
			...state,
			success: false,
			savingAssistanceComment: false,
		});
	}

	const showAddRepresentative = () => {
		setState({
			...state,
			addRepresentative: true
		});
	}

	const closeAddRepresentative = () => {
		setState({
			...state,
			addRepresentative: false
		});
	}

	const selectDelegation = async delegateId => {
		const delegateInfoUser = data.liveParticipantsToDelegate.list.find(user => user.id === delegateId);
		setState({
			...state,
			delegateId: delegateId,
			locked: false,
			delegationModal: false,
			delegateInfoUser: delegateInfoUser,
			assistanceIntention: PARTICIPANT_STATES.DELEGATED
		});
	}

	const selectSimpleOption = async option => {
		const quitRepresentative = option !== PARTICIPANT_STATES.DELEGATED;

		const response = await setAssistanceIntention({
			variables: {
				assistanceIntention: option,
				representativeId: quitRepresentative ? null : state.participant.delegateId
			}
		});

		if (response) {
			if (response.data.setAssistanceIntention.success) {
				setState({
					...state,
					participant: {
						...state.participant,
						assistanteIntention: option,
						...(quitRepresentative ? { representative: null } : {})
					}
				})
			}
			await refetch();
		}
	}

	const openModalFirmas = async () => {
		setOpenModalFirmasModal(true);
		// sendAttendanceIntention();
	}

	const sendAttendanceIntention = async () => {
		setState({
			...state,
			loading: true
		});
		const { assistanceComment } = state.participant;
		if (!checkForUnclosedBraces(assistanceComment)) {
			if (participant.state !== PARTICIPANT_STATES.REPRESENTATED) {
				if (state.delegateId !== null) {
					await setAssistanceIntention({
						variables: {
							assistanceIntention: state.assistanceIntention,
							representativeId: state.delegateId
						}
					});
				} else {
					await selectSimpleOption(state.assistanceIntention);
				}
			}

			await setAssistanceComment({
				variables: {
					assistanceComment: assistanceComment || ''
				}
			});

			setState({
				...state,
				loading: false,
				locked: true,
				success: true
			})
			refetch();
		} else {
			setState({
				...state,
				commentError: true
			})
			toast(
				<LiveToast
					message={translate.revise_text}
				/>, {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: true,
					className: "errorToast"
				}
			);
		}
	}

	const checkDelegationConditions = () => {
		if (participant.type === PARTICIPANT_TYPE.REPRESENTATIVE) {
			return true;
		}
		return ((participant.numParticipations > 0 || participant.socialCapital > 0))
	}

	const showDelegation = () => {
		setState({
			...state,
			delegationModal: true
		});
	}

	let canDelegate = canDelegateVotes(council.statute, participant);
	const delegatedVotesNumber = participant.delegatedVotes.length;

	React.useEffect(() => {
		if(selecteAssistance.includes(translate.representations_delegations)){
			setSelecteAssistance(`${translate.representations_delegations} (${delegatedVotesNumber})`);
		}
	}, [delegatedVotesNumber]);


	if (council.active === 0) {
		return (
			<NotLoggedLayout
				translate={translate}
				helpIcon={true}
				languageSelector={true}
			>
				<div style={styles.mainContainer}>
					<Card style={styles.cardContainer}>
						<div
							style={{
								height: '100%',
								width: window.innerWidth * 0.95 > 680 ? '680px' : '95vw',
								maxWidth: '98vw',
								display: 'flex',
								alignItems: 'center',
								flexDirection: 'column'
							}}
						>
							<div style={{ width: '100%', marginTop: '5em', textAlign: 'center', marginBottom: '2em' }}>
								<img src={emptyMeetingTable} style={{ width: '55%', height: 'auto', margin: 'auto' }} alt="empty-table" />
							</div>
							<div style={{ fontWeight: '700', fontSize: '1.2em' }} >
								Lo sentimos, esta reunión ha sido eliminada.{/*TRADUCCION*/}
							</div>
						</div>
					</Card>
				</div>
			</NotLoggedLayout>
		)
	}


	const getReunionActual = () => {
		return (
			<div style={{}}>
				<div style={{ marginTop: "2em" }}>
					{council.confirmAssistance !== 0 &&
						<React.Fragment>
							{council.companyId === CONSENTIO_ID ?
								<React.Fragment>
									{participant.position === 'B' &&
										<div style={{}}>
											<div style={{ width: '100%', marginBottom: "1em" }}>
												<div style={{ color: primary, fontSize: '15px', fontWeight: '700', marginBottom: '0.6em', }}>
													{translate.indicate_status}
												</div>
											</div>
											{council.statute.existsDelegatedVote === 1 ?
												<React.Fragment>
													<AssistanceOption
														translate={translate}
														title={translate.want_to_delegate_in}
														select={showDelegation}
														disabled={!canDelegate}
														value={PARTICIPANT_STATES.DELEGATED}
														selected={false}
														delegationItem={
															state.delegateInfoUser && state.assistanceIntention === 4 ?
																<div style={{ display: "flex", alignItems: "center" }}>
																	<DelegationItem participant={state.delegateInfoUser} />
																	<i className="fa fa-trash-o"
																		style={{
																			marginLeft: "1em",
																			fontSize: "25px",
																			color: '#dc7373',
																			cursor: 'pointer'
																		}}
																		onClick={() =>
																			setState({
																				...state,
																				assistanceIntention: PARTICIPANT_STATES.REMOTE,
																				locked: false,
																				delegateId: null
																			})
																		}
																	></i>
																</div>
																:
																""
														}
													/>
													{/* {state.delegateInfoUser && state.assistanceIntention === 4 ?
														<DelegationItem participant={state.delegateInfoUser} /> : ""
													} */}
												</React.Fragment>
												:
												<React.Fragment>
													<AssistanceOption
														title={translate.attend_remotely_through_cbx}
														translate={translate}
														select={() => {
															setState({
																...state,
																assistanceIntention: PARTICIPANT_STATES.REMOTE,
																locked: false,
																delegateId: null
															})
														}}
														value={PARTICIPANT_STATES.REMOTE}
														selected={state.assistanceIntention}
													/>
													{council.remoteCelebration !== 1 &&
														<AssistanceOption
															title={translate.attending_in_person}
															translate={translate}
															select={() => {
																setState({
																	...state,
																	assistanceIntention: PARTICIPANT_STATES.PHYSICALLY_PRESENT,
																	locked: false,
																	delegateId: null
																})
															}}
															value={PARTICIPANT_STATES.PHYSICALLY_PRESENT}
															selected={state.assistanceIntention}

														/>
													}

												</React.Fragment>
											}
										</div>
									}
								</React.Fragment>
								:
								<React.Fragment>
									<div style={{}}>
										<div style={{ width: '100%', marginBottom: "1em" }}>
											<div style={{ color: primary, fontSize: '15px', fontWeight: '700', marginBottom: '0.6em', }}>
												{translate.indicate_status}
											</div>
										</div>
										{participant.personOrEntity === 0 ?
											<React.Fragment>
												<AssistanceOption
													title={translate.attend_remotely_through_cbx}
													translate={translate}
													select={() => {
														setState({
															...state,
															assistanceIntention: PARTICIPANT_STATES.REMOTE,
															locked: false,
															delegateId: null
														})
													}}
													value={PARTICIPANT_STATES.REMOTE}
													selected={state.assistanceIntention}
												/>
												{council.remoteCelebration !== 1 &&
													<AssistanceOption
														title={translate.attending_in_person}
														translate={translate}
														select={() => {
															setState({
																...state,
																assistanceIntention: PARTICIPANT_STATES.PHYSICALLY_PRESENT,
																locked: false,
																delegateId: null
															})
														}}
														value={PARTICIPANT_STATES.PHYSICALLY_PRESENT}
														selected={state.assistanceIntention}

													/>
												}
												<AssistanceOption
													translate={translate}
													title={translate.not_attending}
													select={() => {
														setState({
															...state,
															assistanceIntention: PARTICIPANT_STATES.NO_PARTICIPATE,
															locked: false,
															noAttendWarning: (participant.type !== PARTICIPANT_TYPE.REPRESENTATIVE &&
																participant.delegatedVotes.length > 0) ||
																participant.delegatedVotes.length > 1
																?
																true : false,
															delegateId: null
														})
													}}
													value={PARTICIPANT_STATES.NO_PARTICIPATE}
													selected={state.assistanceIntention}
												/>
											</React.Fragment>
											:
											<React.Fragment>
												<div onClick={showAddRepresentative}>
													<AssistanceOption
														translate={translate}
														title={participant.representative ? translate.change_representative : translate.add_representative}
														value={PARTICIPANT_STATES.REPRESENTATED}
														selected={state.assistanceIntention !== 4 ? participant.state : null}
														delegationItem={
															participant.representative && state.assistanceIntention !== 4 ?
																<div style={{ display: "flex", alignItems: "center" }}>
																	<DelegationItem participant={participant.representative} />
																	<i className="fa fa-trash-o"
																		style={{
																			marginLeft: "1em",
																			fontSize: "25px",
																			color: '#dc7373',
																			cursor: 'pointer'
																		}}
																		onClick={() =>
																			setState({
																				...state,
																				assistanceIntention: PARTICIPANT_STATES.REMOTE,
																				locked: false,
																				delegateId: null
																			})
																		}
																	></i>
																</div>
																:
																""
														}
													/>
													{/* {participant.representative && state.assistanceIntention !== 4 &&
														<DelegationItem participant={participant.representative} />
													} */}
												</div>
												{state.addRepresentative &&
													<AddRepresentativeModal
														show={state.addRepresentative}
														council={council}
														participant={participant}
														refetch={refetch}
														requestClose={closeAddRepresentative}
														translate={translate}
													/>
												}
											</React.Fragment>
										}
										{checkDelegationConditions() &&
											<AssistanceOption
												translate={translate}
												title={translate.want_to_delegate_in}
												select={showDelegation}
												disabled={!canDelegate}
												value={PARTICIPANT_STATES.DELEGATED}
												selected={state.assistanceIntention}
												delegationItem={
													state.delegateInfoUser && state.assistanceIntention === 4 ?
														<div style={{ display: "flex", alignItems: "center" }}>
															<DelegationItem participant={state.delegateInfoUser} />
															<i className="fa fa-trash-o"
																style={{
																	marginLeft: "1em",
																	fontSize: "25px",
																	color: '#dc7373',
																	cursor: 'pointer'
																}}
																onClick={() =>
																	setState({
																		...state,
																		assistanceIntention: PARTICIPANT_STATES.REMOTE,
																		locked: false,
																		delegateId: null
																	})
																}
															></i>
														</div>
														:
														""
												}
											/>
										}
										<br />
									</div>

									{state.noAttendWarning &&
										<NoAttendDelegationWarning
											translate={translate}
											representative={participant.type === PARTICIPANT_TYPE.REPRESENTATIVE}
											requestClose={() => setState({ ...state, noAttendWarning: false })}
										/>
									}
								</React.Fragment>

							}
						</React.Fragment>
					}
					<br />
				</div>

				<div style={{ display: "flex", justifyContent: "space-between", flexDirection: isMobile? 'column' : 'row' }}>
					<div style={{ width: "100%" }}>
						<div style={{ width: '100%', marginBottom: "1em" }}>
							<div style={{ color: primary, fontSize: '15px', fontWeight: '700', marginBottom: '0.6em', }}>
								{translate.comments}
							</div>
						</div>
						<RichTextInput
							errorText={state.commentError}
							translate={translate}
							value={
								!!participant.assistanceComment
									? participant.assistanceComment
									: ""
							}
							placeholder={translate.attendance_comment}
							stylesQuill={{ background: "#f0f3f6" }}
							onChange={value =>
								setState({
									...state,
									participant: {
										...state.participant,
										assistanceComment: value
									},
									locked: false
								})
							}
							quillEditorButtonsEmpty={'quillEditorButtonsEmpty'}
						/>
					</div>
					<div style={{ marginLeft: isMobile? '0' : "5em", marginTop: isMobile? '1em' : '0', display: "flex", alignItems: "flex-end" }}>
						<div>
							{council.confirmAssistance !== 0 &&
								<BasicButton
									text={state.success || state.locked ? translate.tooltip_sent : translate.send}
									color={state.locked ? 'grey' : primary}
									floatRight={!isMobile}
									success={state.success}
									disabled={state.locked}
									reset={resetButtonStates}
									textStyle={{
										color: "white",
										fontWeight: "700"
									}}
									loading={state.loading}
									onClick={council.statute.requireProxy? openModalFirmas : sendAttendanceIntention}
									icon={<ButtonIcon type="save" color="white" />}
								/>
							}
						</div>
					</div>
				</div>
				<DelegateOwnVoteAttendantModal
					show={state.delegationModal}
					council={council}
					participant={participant}
					addRepresentative={selectDelegation}
					requestClose={() => setState({ ...state, delegationModal: false })}
					translate={translate}
				/>
				<DelegationProxyModal
					participant={participant}
					delegation={state.delegateInfoUser}
					council={council}
					translate={translate}
					open={openModalFirmasModal}
					requestClose={() => setOpenModalFirmasModal(false)}
				/>
			</div>
		)
	}

	const getVotosDelegados = () => {
		const delegatedVotes = participant.delegatedVotes.filter(a => a.state !== PARTICIPANT_STATES.REPRESENTATED);
		const representations = participant.delegatedVotes.filter(a => a.state === PARTICIPANT_STATES.REPRESENTATED);

		return (
			<div>
				{representations.length > 0 &&
					<div style={{ marginTop: "2em" }}>
						<div style={{ width: "100%" }}>
							<div style={{ width: '100%', marginBottom: "1em" }}>
								<div style={{ color: primary, fontSize: '15px', fontWeight: '700', marginBottom: '1em' }}>
									Representa a:
								</div>
								<div style={{ display: "inline-block" }}>
									<DelegationSection
										delegatedVotes={representations}
										translate={translate}
									/>
								</div>
							</div>
						</div>
					</div>
				}

				<div style={{ marginTop: "2em" }}>
					<div style={{ width: "100%" }}>
						<div style={{ width: '100%', marginBottom: "1em" }}>
							<div style={{ color: primary, fontSize: '15px', fontWeight: '700', marginBottom: '1em' }}>
								{delegatedVotes.length > 0 ?
									<div>Han delegado votos en usted:</div>
									:
									<div>No tienes votos delegados</div>
								}
							</div>
							<div style={{ display: "inline-block" }}>
								<DelegationSection
									delegatedVotes={delegatedVotes}
									translate={translate}
									refetch={refetch}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	const getHistorialReuniones = () => {
		return (
			<div>
				<div style={{ marginTop: "2em" }}>
					<div style={{ width: "100%" }}>
						<div style={{ width: '100%', marginBottom: "1em" }}>
							<div style={{ color: primary, fontSize: '15px', fontWeight: '700', marginBottom: '0.6em', }}>
								{translate.comments}
							</div>
							<div style={{ color: primary, fontSize: '15px', fontWeight: '700', marginBottom: '0.6em', }}>

							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	const getDatos = () => {
		switch (selecteAssistance) {
			case 'Reunión actual':
				return getReunionActual()
			case `${translate.representations_delegations} (${delegatedVotesNumber})`:
				return getVotosDelegados()
			case 'Historial de reuniones':
				return getHistorialReuniones()
			default:
				break;
		}
	}

	return (
		<NotLoggedLayout
			translate={translate}
			helpIcon={true}
			languageSelector={true}
			council={council}
			participant={participant}
		>
			<div style={styles.mainContainer}>
				<Card style={{ ...styles.cardContainer, width: isMobile? '100%' : "80%" }}>
					<Scrollbar>
						<div style={{ maxWidth: '98vw', margin: isMobile? '1em 1em 0em 1em' : "4em 4em 0em 4em" }}>
							<div style={{ display: "flex", justifyContent: "space-between" }}>
								<div style={{ fontSize: "25px", color: primary }}>
									Hola, {participant.name} {participant.surname}
								</div>
								<div style={{ color: primary, fontSize: "30px", display: "flex", alignItems: "center" }}>
									<Icon className="material-icons" style={{ fontSize: "35px", color: primary }}>
										account_circle
									</Icon>
									{/* //////// Dropdown para imagen de arriba a la derecha y opciones */}
									{/* <DropDownMenu
										color="transparent"
										id={"user-menu-trigger"}
										text={
											<Icon className="material-icons" style={{ fontSize:"35px", color: primary }}>
												keyboard_arrow_down
											</Icon>
										}
										textStyle={{ }}
										type="flat"
										icon={
											<Icon className="material-icons" style={{ fontSize:"35px", color: primary }}>
												account_circle
											</Icon>
											// <Avatar src={participant.logo} ></Avatar>
										}
										anchorOrigin={{
											vertical: 'bottom',
											horizontal: 'left',
										}}
										items={
											<React.Fragment>
												<MenuItem >
												asd
												</MenuItem>
												<Divider />
											</React.Fragment>
										}
									/> */}
								</div>
							</div>
							<div style={{ display: "flex", marginTop: '2em', }}>
								<MenuSuperiorTabs
									// TRADUCCION
									items={[
										'Reunión actual',
										`${translate.representations_delegations} (${delegatedVotesNumber})`,
										// 'Historial de reuniones'
									]}
									selected={selecteAssistance}
									setSelect={setSelecteAssistance}
								/>
							</div>
							<Card style={{ marginTop: '1em', borderRadius: '8px' }}>
								<div style={{ padding: "2em 1.5em 1.5em 1.5em" }}>
									<div style={{ display: "flex", justifyContent: "space-between", color: "#000000" }}>
										<div style={{ display: "flex", fontWeight: "bold", justifyContent: "space-between", fontSize: "15px" }}>
											{council.name}
										</div>
										<div style={{ fontStyle: "italic" }}>
											Fecha y hora - 09/01/2020
										</div>
									</div>
									<div style={{ fontStyle: "italic", color: "#000000", marginTop: "1em" }}>
										{council.street}
									</div>
									{getDatos(selecteAssistance)}
								</div>
							</Card>
						</div>
					</Scrollbar>
				</Card>
			</div>
		</NotLoggedLayout>
	);
}


const DelegationSection = ({ delegatedVotes, translate, refetch }) => {
	const [delegation, setDelegation] = React.useState(null);

	const closeConfirm = () => {
		setDelegation(null);
	}

	return (
		<div >

			{delegation &&
				<RefuseDelegationConfirm
					delegation={delegation}
					translate={translate}
					requestClose={closeConfirm}
					refetch={refetch}
				/>
			}

			{delegatedVotes.map(vote => {
				return (
					<Card key={vote.id} style={{ display: "flex", color: "#000000", fontSize: "14px", padding: "0.5em 1em", marginBottom: "0.5em" }}>
						<div>{vote.name} {vote.surname}</div>
						{vote.state !== PARTICIPANT_STATES.REPRESENTATED &&
							<div>
								<i
									onClick={() => setDelegation(vote)}
									className="fa fa-trash-o"
									style={{
										marginLeft: "1em",
										fontSize: "25px",
										color: '#dc7373',
										cursor: 'pointer'
									}}
								></i>
							</div>
						}
					</Card>
				)
			})}
		</div>
	)
};




export default compose(
	graphql(setAssistanceIntention, {
		name: "setAssistanceIntention"
	}), graphql(setAssistanceComment, {
		name: "setAssistanceComment"
	}), graphql(participantsToDelegate, {
		options: props => ({
			variables: {
				councilId: props.council.id
			}
		})
	})
)(withTranslations()(Assistance));



{/* <div style={styles.mainContainer}>
				<Card style={styles.cardContainer}>
					{councilIsPreparing(council) ? (
						<div style={{ height: '100%', width: window.innerWidth * 0.95 > 680 ? '680px' : '95vw', maxWidth: '98vw' }}>
							<div style={{ height: '4em', borderBottom: '1px solid gainsboro', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '2em' }}>
								<Typography variant="title" style={{ fontWeight: '700', fontSize: '1.35rem' }}>
									{council.name}
								</Typography>
							</div>
							<div style={{
								height: 'calc(100% - 7.5em)',
								width: '100%',
								overflow: 'hidden'
							}}>
								<Scrollbar>
									<div style={{ height: '100%', padding: '2em', width: '99%' }}>
										<Typography variant="subheading" style={{ fontWeight: '700', marginBottom: '1.2em' }}>
											{translate.welcome} {participant.name} {participant.surname}
										</Typography>
										<Card style={{ padding: '1.5em', width: '100%', marginBottom: "1em" }}>
											<div style={{ borderBottom: '1px solid gainsboro', width: '100%', }}>
												<SectionTitle
													text={translate.council_info}
													color={primary}
												/>
											</div>
											<p style={{ marginTop: '1em' }}>
												{council.remoteCelebration ?
													translate.remote_celebration
													:
													`${council.street}, ${council.country}`
												}
											</p>
											<p>{translate['1st_call_date']}: <DateWrapper date={council.dateStart} format={'LLL'} /></p>
										</Card>
										{participant.delegatedVotes.filter(d => d.state !== PARTICIPANT_STATES.REPRESENTATED).length > 0 &&
											<DelegationSection
												participant={participant}
												translate={translate}
												refetch={refetch}
											/>
										}
										{participant.represented.length > 0 &&
											<RepresentedSection
												participant={participant}
												translate={translate}
												refetch={refetch}
											/>
										}
										{council.confirmAssistance !== 0 &&
											<React.Fragment>
												{council.companyId === CONSENTIO_ID ?
													<React.Fragment>
														{participant.position === 'B' &&
															<Card style={{ padding: '1.5em', width: '100%', marginBottom: "1em" }}>
																<div style={{ borderBottom: '1px solid gainsboro', width: '100%', marginBottom: "1em" }}>
																	<SectionTitle
																		text={`${translate.indicate_status}:`}
																		color={primary}
																	/>
																</div>
																{council.statute.existsDelegatedVote === 1 ?
																	<React.Fragment>
																		<AssistanceOption
																			translate={translate}
																			title={translate.want_to_delegate_in}
																			select={showDelegation}
																			disabled={!canDelegate}
																			value={PARTICIPANT_STATES.DELEGATED}
																			selected={false}
																		/>
																		{state.delegateInfoUser && state.assistanceIntention === 4 ?
																			<DelegationItem participant={state.delegateInfoUser} /> : ""
																		}
																	</React.Fragment>
																	:
																	<React.Fragment>
																		<AssistanceOption
																			title={translate.attend_remotely_through_cbx}
																			translate={translate}
																			select={() => {
																				setState({
																					...state,
																					assistanceIntention: PARTICIPANT_STATES.REMOTE,
																					locked: false,
																					delegateId: null
																				})
																			}}
																			value={PARTICIPANT_STATES.REMOTE}
																			selected={state.assistanceIntention}
																		/>
																		{council.remoteCelebration !== 1 &&
																			<AssistanceOption
																				title={translate.attending_in_person}
																				translate={translate}
																				select={() => {
																					setState({
																						...state,
																						assistanceIntention: PARTICIPANT_STATES.PHYSICALLY_PRESENT,
																						locked: false,
																						delegateId: null
																					})
																				}}
																				value={PARTICIPANT_STATES.PHYSICALLY_PRESENT}
																				selected={state.assistanceIntention}

																			/>
																		}

																	</React.Fragment>
																}
															</Card>
														}
													</React.Fragment>
													:
													<React.Fragment>
														<Card style={{ padding: '1.5em', width: '100%', marginBottom: "1em" }}>
															<div style={{ borderBottom: '1px solid gainsboro', width: '100%', marginBottom: "1em" }}>
																<SectionTitle
																	text={`${translate.indicate_status}:`}
																	color={primary}
																/>
															</div>
															{participant.personOrEntity === 0 ?
																<React.Fragment>
																	<AssistanceOption
																		title={translate.attend_remotely_through_cbx}
																		translate={translate}
																		select={() => {
																			setState({
																				...state,
																				assistanceIntention: PARTICIPANT_STATES.REMOTE,
																				locked: false,
																				delegateId: null
																			})
																		}}
																		value={PARTICIPANT_STATES.REMOTE}
																		selected={state.assistanceIntention}
																	/>
																	{council.remoteCelebration !== 1 &&
																		<AssistanceOption
																			title={translate.attending_in_person}
																			translate={translate}
																			select={() => {
																				setState({
																					...state,
																					assistanceIntention: PARTICIPANT_STATES.PHYSICALLY_PRESENT,
																					locked: false,
																					delegateId: null
																				})
																			}}
																			value={PARTICIPANT_STATES.PHYSICALLY_PRESENT}
																			selected={state.assistanceIntention}

																		/>
																	}
																	<AssistanceOption
																		translate={translate}
																		title={translate.not_attending}
																		select={() => {
																			setState({
																				...state,
																				assistanceIntention: PARTICIPANT_STATES.NO_PARTICIPATE,
																				locked: false,
																				noAttendWarning: (participant.type !== PARTICIPANT_TYPE.REPRESENTATIVE &&
																					participant.delegatedVotes.length > 0) ||
																					participant.delegatedVotes.length > 1
																					?
																					true : false,
																				delegateId: null
																			})
																		}}
																		value={PARTICIPANT_STATES.NO_PARTICIPATE}
																		selected={state.assistanceIntention}
																	/>
																</React.Fragment>
																:
																<React.Fragment>
																	<div onClick={showAddRepresentative}>
																		<AssistanceOption
																			translate={translate}
																			title={participant.representative ? translate.change_representative : translate.add_representative}
																			value={PARTICIPANT_STATES.REPRESENTATED}
																			selected={state.assistanceIntention !== 4 ? participant.state : null}
																		/>
																		{participant.representative && state.assistanceIntention !== 4 &&
																			<DelegationItem participant={participant.representative} />
																		}
																	</div>
																	{state.addRepresentative &&
																		<AddRepresentativeModal
																			show={state.addRepresentative}
																			council={council}
																			participant={participant}
																			refetch={refetch}
																			requestClose={closeAddRepresentative}
																			translate={translate}
																		/>
																	}
																</React.Fragment>
															}
															{checkDelegationConditions() &&
																<AssistanceOption
																	translate={translate}
																	title={translate.want_to_delegate_in}
																	select={showDelegation}
																	disabled={!canDelegate}
																	value={PARTICIPANT_STATES.DELEGATED}
																	selected={state.assistanceIntention}
																/>
															}

															{state.delegateInfoUser && state.assistanceIntention === 4 ?
																<DelegationItem participant={state.delegateInfoUser} /> : ""
															}
															<br />
														</Card>
														<Card style={{ padding: '1.5em', width: '100%', }}>
															<div style={{ borderBottom: '1px solid gainsboro', width: '100%', marginBottom: "1em" }}>
																<SectionTitle
																	text={`${translate.comments}:`}
																	color={primary}
																/>
															</div>
															<h4 style={{ paddingBottom: "0.6em" }}>{translate.attendance_comment}:</h4>
															<RichTextInput
																errorText={state.commentError}
																translate={translate}
																value={
																	!!participant.assistanceComment
																		? participant.assistanceComment
																		: ""
																}
																onChange={value =>
																	setState({
																		...state,
																		participant: {
																			...state.participant,
																			assistanceComment: value
																		},
																		locked: false
																	})
																}
															/>
														</Card>
														{state.noAttendWarning &&
															<NoAttendDelegationWarning
																translate={translate}
																representative={participant.type === PARTICIPANT_TYPE.REPRESENTATIVE}
																requestClose={() => setState({ ...state, noAttendWarning: false })}
															/>
														}
													</React.Fragment>

												}
											</React.Fragment>
										}
										<br />
									</div>
								</Scrollbar>
							</div>
							{council.confirmAssistance !== 0 &&
								<div style={styles.buttonSection}>
									<BasicButton
										text={state.success || state.locked ? translate.tooltip_sent : translate.send}
										color={state.locked ? 'grey' : primary}
										floatRight
										success={state.success}
										disabled={state.locked}
										reset={resetButtonStates}
										textStyle={{
											color: "white",
											fontWeight: "700"
										}}
										loading={state.loading}
										onClick={sendAttendanceIntention}
										icon={<ButtonIcon type="save" color="white" />}
									/>
								</div>
							}
							<DelegateOwnVoteAttendantModal
								show={state.delegationModal}
								council={council}
								participant={participant}
								addRepresentative={selectDelegation}
								requestClose={() => setState({ ...state, delegationModal: false })}
								translate={translate}
							/>
						</div>
					) : (
							<CouncilState
								council={council}
								participant={participant}
								company={company} isAssistance
							/>
						)}
				</Card>
			</div> */}
