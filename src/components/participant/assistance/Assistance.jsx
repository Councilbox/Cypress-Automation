import React from "react";
import { Card, Typography } from "material-ui";
import withTranslations from "../../../HOCs/withTranslations";
import { councilIsPreparing, checkForUnclosedBraces } from "../../../utils/CBX";
import CouncilState from "../login/CouncilState";
import AssistanceOption from "./AssistanceOption";
import { compose, graphql, withApollo } from "react-apollo";
import { setAssistanceIntention, setAssistanceComment } from "../../../queries/liveParticipant";
import { PARTICIPANT_STATES, PARTICIPANT_TYPE } from "../../../constants";
import { BasicButton, ButtonIcon, NotLoggedLayout, Scrollbar, DateWrapper, SectionTitle, LiveToast } from '../../../displayComponents';
import RichTextInput from "../../../displayComponents/RichTextInput";
import DelegateOwnVoteAttendantModal from "./DelegateOwnVoteAttendantModal";
import RefuseDelegationConfirm from '../delegations/RefuseDelegationConfirm';
import NoAttendDelegationWarning from '../delegations/NoAttendDelegationWarning';
import DelegationItem from "./DelegationItem";
import { canDelegateVotes } from "../../../utils/CBX"
import { primary, secondary } from "../../../styles/colors";
import { toast } from 'react-toastify';
import { participantsToDelegate } from "../../../queries";
import AddRepresentativeModal from "../../council/live/AddRepresentativeModal";
import emptyMeetingTable from "../../../assets/img/empty_meeting_table.png";


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
		padding: "10px"
	},
	cardContainer: {
		margin: "20px",
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
		assistanceIntention: participant.assistanceIntention || PARTICIPANT_STATES.REMOTE,
		delegateId: participant.state === PARTICIPANT_STATES.REPRESENTATED? participant.delegateId : null,
		noAttendWarning: false,
		delegateInfoUser: participant.representative
	});

	React.useEffect(() => {
		setState({
			...state,
			assistanceIntention: participant.assistanceIntention || PARTICIPANT_STATES.REMOTE,
			delegateId: participant.state === PARTICIPANT_STATES.REPRESENTATED? participant.delegateId : null,
			delegateInfoUser: participant.representative
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


	const sendAttendanceIntention = async () => {
		setState({
			...state,
			loading: true
		});
		const { assistanceComment } = state.participant;
		if (!checkForUnclosedBraces(assistanceComment)) {
			if(participant.state !== PARTICIPANT_STATES.REPRESENTATED){
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

	const showDelegation = () => {
		setState({
			...state,
			delegationModal: true
		});
	}

	let canDelegate = canDelegateVotes(council.statute, participant);

	if(council.active === 0){
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
							<div style={{width: '100%', marginTop: '5em', textAlign: 'center', marginBottom: '2em'}}>
								<img src={emptyMeetingTable} style={{width: '55%', height: 'auto', margin: 'auto'}} alt="empty-table" />
							</div>
							<div style={{fontWeight: '700', fontSize: '1.2em'}} >
								Lo sentimos, esta reunión ha sido eliminada.{/*TRADUCCION*/}
							</div>
						</div>
					</Card>
				</div>
			</NotLoggedLayout>
		)
	}

	return (
		<NotLoggedLayout
			translate={translate}
			helpIcon={true}
			languageSelector={true}
		>
			<div style={styles.mainContainer}>
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
										{participant.delegatedVotes.length > 0 &&
											<DelegationSection
												participant={participant}
												translate={translate}
												refetch={refetch}
											/>
										}
										{council.confirmAssistance !== 0 &&
											<React.Fragment>
												<Card style={{ padding: '1.5em', width: '100%', marginBottom: "1em" }}>
													<div style={{ borderBottom: '1px solid gainsboro', width: '100%', marginBottom: "1em" }}>
														<SectionTitle
															text={`${translate.indicate_status}:`}
															color={primary}
														/>
													</div>
													{participant.personOrEntity === 0?
														<React.Fragment>
															<AssistanceOption
																title={translate.attend_remotely_through_cbx}
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
															<AssistanceOption
																title={translate.attending_in_person}
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
															<AssistanceOption
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
																	title={participant.representative? translate.change_representative : translate.add_representative}
																	value={PARTICIPANT_STATES.REPRESENTATED}
																	selected={state.assistanceIntention !== 4? participant.state : null}
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
													{((participant.type === PARTICIPANT_TYPE.REPRESENTATIVE) || (participant.numParticipations > 0 || participant.socialCapital > 0)) &&
														<AssistanceOption
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
														requestClose={() => setState({ ...state, noAttendWarning: false})}
													/>
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
										text={state.success || state.locked? translate.tooltip_sent : translate.send}
										color={state.locked? 'grey' : primary}
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
			</div>
		</NotLoggedLayout>
	);
}


const DelegationSection = ({ participant, translate, refetch }) => {
	const [delegation, setDelegation] = React.useState(null);

	const closeConfirm = () => {
		setDelegation(null);
	}

	return (
		<Card style={{ padding: '1.5em', width: '100%', marginBottom: "1em" }}>
			<div style={{ borderBottom: '1px solid gainsboro', width: '100%', marginBottom: "1em" }}>
				<SectionTitle
					text={`${'Representaciones / Delegaciones'}:`/*TRADUCCION*/}
					color={primary}
				/>
			</div>
			{delegation &&
				<RefuseDelegationConfirm
					delegation={delegation}
					translate={translate}
					requestClose={closeConfirm}
					refetch={refetch}
				/>
			}

			{[...participant.delegatedVotes].sort((a, b) => {
				if(a.state === PARTICIPANT_STATES.REPRESENTATED){
					return -1;
				}
				return 1;
			}).map(vote => {
				return (
					<div
						style={{
							width: '100%',
							display: 'flex',
							borderBottom: '1px solid gainsboro',
							justifyContent: 'space-between',
							padding: '0.3em',
							alignItems: 'center'
						}}
						key={vote.id}
					>
						<span>{`${vote.state === PARTICIPANT_STATES.REPRESENTATED? 'Representante de: ' : 'Voto delegado: '}`}<b>{`${vote.name} ${vote.surname}`}</b></span>
						<div>
							{vote.state !== PARTICIPANT_STATES.REPRESENTATED &&
								<BasicButton
									text="Rechazar"//TRADUCCION
									textStyle={{color: secondary}}
									color="transparent"
									loadingColor={secondary}
									onClick={() => setDelegation(vote)}
									buttonStyle={{border: `1px solid ${secondary}`}}
								/>
							}
						</div>
					</div>
				)
			})}
		</Card>
	)
};




export default compose(graphql(setAssistanceIntention, {
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
