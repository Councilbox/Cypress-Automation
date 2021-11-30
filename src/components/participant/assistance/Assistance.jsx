import React from 'react';
import { Card, Icon } from 'material-ui';
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { toast } from 'react-toastify';
import withTranslations from '../../../HOCs/withTranslations';
import { checkForUnclosedBraces, councilStarted } from '../../../utils/CBX';
import AssistanceOption from './AssistanceOption';
import {
	setAssistanceIntention as setAssistanceIntentionMutation,
	setAssistanceComment as setAssistanceCommentMutation
} from '../../../queries/liveParticipant';
import { PARTICIPANT_STATES } from '../../../constants';
import {
	BasicButton, ButtonIcon, NotLoggedLayout, LiveToast, Scrollbar, Checkbox, Grid, GridItem
} from '../../../displayComponents';
import RichTextInput from '../../../displayComponents/RichTextInput';
import DelegateOwnVoteAttendantModal from './DelegateOwnVoteAttendantModal';
import RefuseDelegationConfirm from '../delegations/RefuseDelegationConfirm';
import DelegationProxyModal from './DelegationProxyModal';
import { getPrimary } from '../../../styles/colors';
import { participantsToDelegate } from '../../../queries';
import emptyMeetingTable from '../../../assets/img/empty_meeting_table.png';
import MenuSuperiorTabs from '../../dashboard/MenuSuperiorTabs';
import { isMobile } from '../../../utils/screen';
import CouncilState from '../login/CouncilState';
import { moment } from '../../../containers/App';
import AttendanceOptions from './AttendanceOptions';
import VoteLetter from './VoteLetter';
import { ConfigContext } from '../../../containers/AppControl';
import AttendanceConfirmation from './AttendanceConfirmation';

export const AECOC_ID = 286;

const styles = {
	viewContainer: {
		width: '100vw',
		height: '100vh',
		position: 'relative'
	},
	mainContainer: {
		width: '100%',
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
		padding: '0'
	},
	cardContainer: {
		margin: isMobile ? '5px' : '20px',
		maxWidth: '100%',
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

const Assistance = ({
	participant, data, translate, council, company, refetch, setAssistanceComment, setAssistanceIntention
}) => {
	function generateAttendanceData() {
		let defaultIntention;

		switch (council.councilType) {
			case 0:
				defaultIntention = PARTICIPANT_STATES.REMOTE;
				break;
			case 4:
				defaultIntention = PARTICIPANT_STATES.SENT_VOTE_LETTER;
				break;
			default:
				defaultIntention = PARTICIPANT_STATES.PRESENT;
		}

		if (participant.personOrEntity === 1 && !participant.delegateId) {
			return {
				assistanceIntention: null
			};
		}

		const getInitialAttendanceIntention = participantData => {
			if (participantData.assistanceIntention === PARTICIPANT_STATES.DELEGATED && !participantData.representative) {
				return defaultIntention;
			}
			return Number.isNaN(Number(participantData.assistanceIntention)) ? defaultIntention : participantData.assistanceIntention;
		};

		if (participant.represented && participant.represented.length > 0) {
			const represented = participant.represented[0];
			if (represented.assistanceIntention === PARTICIPANT_STATES.DELEGATED) {
				return {
					assistanceIntention: getInitialAttendanceIntention(represented),
					delegateId: represented.delegateId,
					delegateInfoUser: represented.state === PARTICIPANT_STATES.DELEGATED ? represented.representative : null
				};
			}
		}

		return {
			assistanceIntention: getInitialAttendanceIntention(participant),
			delegateId: participant.delegateId,
			delegateInfoUser: participant.representative
		};
	}

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

	const [attendanceConfirmation, setAttendanceConfirmation] = React.useState(false);
	const [selecteAssistance, setSelecteAssistance] = React.useState(translate.council);
	const [openModalFirmasModal, setOpenModalFirmasModal] = React.useState(false);
	const [openModalVoteLetter, setOpenModalVoteLetter] = React.useState(false);
	const [check, setCheck] = React.useState(!council.statute.attendanceText);
	const [checkError, setCheckError] = React.useState(false);
	const config = React.useContext(ConfigContext);


	React.useEffect(() => {
		setSelecteAssistance(translate.council);
	}, [translate.council]);

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
	};

	const selectDelegation = async delegateId => {
		const delegateInfoUser = data.liveParticipantsToDelegate.list.find(user => user.id === delegateId);
		setState({
			...state,
			delegateId,
			locked: false,
			delegationModal: false,
			delegateInfoUser,
			assistanceIntention: PARTICIPANT_STATES.DELEGATED
		});
	};

	const isValidEarlyVoteState = intention => intention === PARTICIPANT_STATES.EARLY_VOTE || intention === PARTICIPANT_STATES.DELEGATED || intention === PARTICIPANT_STATES.SENT_VOTE_LETTER;

	const selectSimpleOption = async (option, signature) => {
		const quitRepresentative = option !== PARTICIPANT_STATES.DELEGATED;
		const response = await setAssistanceIntention({
			variables: {
				assistanceIntention: option,
				representativeId: quitRepresentative ? null : state.participant.delegateId,
				...(signature ? {
					signature
				} : {}),
				...(isValidEarlyVoteState(state.assistanceIntention) ? {
					earlyVotes: state.earlyVotes
				} : {})
			}
		});

		if (response) {
			if (response.data.setAssistanceIntention.success) {
				setState({
					...state,
					participant: {
						...state.participant,
						assistanteIntention: option,
						delegateInfoUser: null,
						...(quitRepresentative ? { representative: null } : {})
					}
				});
			}
			await refetch();
		}
	};

	const openModalFirmas = async () => {
		setOpenModalFirmasModal(true);
	};

	const sendAttendanceIntention = async signature => {
		if (state.assistanceIntention === null || (participant.personOrEntity === 1 && state.delegateId === null)) {
			setState({
				...state,
				error: true,
				invalidIntentioError: true
			});

			return;
		}

		setState({
			...state,
			invalidIntentioError: false,
			loading: true
		});

		const { assistanceComment } = state.participant;

		if (!checkForUnclosedBraces(assistanceComment)) {
			if (participant.state !== PARTICIPANT_STATES.REPRESENTATED) {
				if (state.delegateId !== null) {
					await setAssistanceIntention({
						variables: {
							assistanceIntention: state.assistanceIntention,
							representativeId: state.delegateId,
							...(signature ? {
								signature
							} : {}),
							...(isValidEarlyVoteState(state.assistanceIntention) ? {
								earlyVotes: state.earlyVotes
							} : {})
						}
					});
				} else {
					await selectSimpleOption(state.assistanceIntention, signature);
				}
			}

			if (council.companyId === 708) {
				setAttendanceConfirmation(true);
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
				success: true,
				invalidIntentioError: false,
			});
			refetch();
		} else {
			setState({
				...state,
				commentError: true,
				invalidIntentioError: false,
			});
			toast(
				<LiveToast
					id="error-toast"
					message={translate.revise_text}
				/>,
				{
					position: toast.POSITION.TOP_RIGHT,
					autoClose: true,
					className: 'errorToast'
				}
			);
		}
	};


	const showDelegation = () => {
		setState({
			...state,
			delegationModal: true
		});
	};

	const sendButtonAction = () => {
		if (council.statute.requireProxy && state.assistanceIntention === PARTICIPANT_STATES.DELEGATED) {
			return openModalFirmas();
		}

		if (state.assistanceIntention === PARTICIPANT_STATES.SENT_VOTE_LETTER) {
			return setOpenModalVoteLetter(true);
		}

		return sendAttendanceIntention();
	};

	const calculateVotesTabNumber = () => {
		if (participant.state === PARTICIPANT_STATES.DELEGATED) {
			return participant.delegatedVotes.length + participant.represented.length;
		}

		return participant.delegatedVotes.length;
	};


	const delegatedVotesNumber = calculateVotesTabNumber();

	React.useEffect(() => {
		if (selecteAssistance.includes(translate.representations_delegations)) {
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
								justifyContent: 'center',
								flexDirection: 'column'
							}}
						>
							<div style={{
								width: '100%', textAlign: 'center', marginBottom: '2em'
							}}>
								<img src={emptyMeetingTable} style={{ width: '55%', height: 'auto', margin: 'auto' }} alt="empty-table" />
							</div>
							<div style={{ fontWeight: '700', fontSize: '1.2em' }} >
								{translate.meeting_has_been_deleted}
							</div>
						</div>
					</Card>
				</div>
			</NotLoggedLayout>
		);
	}

	const getReunionActual = () => (
		<div style={{}}>
			{state.invalidIntentioError &&
				<span style={{ color: 'red', fontSize: '16px', fontWeight: '700' }}>{translate.must_select_valid_option}</span>
			}
			<div style={{ marginTop: '2em' }}>
				{council.confirmAssistance !== 0 &&
					<React.Fragment>
						<AttendanceOptions
							translate={translate}
							refetch={refetch}
							setState={setState}
							showDelegationModal={showDelegation}
							state={state}
							participant={participant}
							council={council}
						/>
					</React.Fragment>
				}
				<br />
			</div>

			<div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: isMobile ? 'column' : 'row' }}>
				<div style={{ width: '100%' }}>
					{council.companyId === AECOC_ID ?
						<>
							<AssistanceOption
								translate={translate}
								title={translate.delegate_the_vote_to_another_partner}
								select={() => {
									setState({
										...state,
										assistanceIntention: PARTICIPANT_STATES.NO_PARTICIPATE,
										locked: false,
										noAttendWarning: false,
										delegateId: null
									});
								}}
								value={PARTICIPANT_STATES.NO_PARTICIPATE}
								selected={state.assistanceIntention}
							/>
							{state.assistanceIntention === PARTICIPANT_STATES.NO_PARTICIPATE &&
								<RichTextInput
									errorText={state.commentError}
									translate={translate}
									value={
										participant.assistanceComment
											? participant.assistanceComment
											: ''
									}
									placeholder={council.companyId !== AECOC_ID ? translate.attendance_comment : ''}
									stylesQuill={{ background: '#f0f3f6' }}
									onChange={value => setState({
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
							}
						</>
						:
						(config.attendanceComment && council.confirmAssistance !== 0) &&
						<>
							<div style={{ width: '100%', marginBottom: '1em' }}>
								<div style={{
									color: primary, fontSize: '15px', fontWeight: '700', marginBottom: '0.6em'
								}}>
									{translate.comments}
								</div>
							</div>
							<RichTextInput
								errorText={state.commentError}
								translate={translate}
								disableTags={true}
								value={participant.assistanceComment || ''}
								placeholder={council.companyId !== AECOC_ID ? translate.attendance_comment : ''}
								stylesQuill={{ background: '#f0f3f6' }}
								onChange={value => setState({
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
						</>
					}

				</div>
				<div style={{
					marginLeft: isMobile ? '0' : '5em', marginTop: isMobile ? '1em' : '0', display: 'flex', alignItems: 'flex-end'
				}}>
					<div>
						{council.confirmAssistance !== 0 &&
							<BasicButton
								text={(state.success || state.locked) ? translate.tooltip_sent : translate.send}
								color={(state.locked || !check) ? 'grey' : primary}
								floatRight={!isMobile}
								success={state.success}
								disabled={state.locked}
								reset={resetButtonStates}
								textStyle={{
									color: 'white',
									fontWeight: '700'
								}}
								loading={state.loading}
								onClick={!check ? () => {
									setCheckError(translate.accept_conditions_need);
								} : sendButtonAction}
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
			<VoteLetter
				participant={participant}
				delegation={state.delegateInfoUser}
				setState={setState}
				state={state}
				council={council}
				action={sendAttendanceIntention}
				translate={translate}
				open={openModalVoteLetter}
				requestClose={() => setOpenModalVoteLetter(false)}
			/>
			<DelegationProxyModal
				participant={participant}
				delegation={state.delegateInfoUser}
				council={council}
				action={sendAttendanceIntention}
				translate={translate}
				open={openModalFirmasModal}
				requestClose={() => setOpenModalFirmasModal(false)}
			/>
		</div>
	);

	/*
en las council type === 4 se generan los votos para todos como una sin sesión
al crear una carta de voto se crea un proxy vote,
al borrar una carta de voto se elimina el proxy vote
*/
	const getVotosDelegados = () => {
		const delegatedVotes = participant.delegatedVotes.filter(a => a.state !== PARTICIPANT_STATES.REPRESENTATED);
		return (
			<div>
				{participant.represented.length > 0 &&
					<div style={{ marginTop: '2em' }}>
						<div style={{ width: '100%' }}>
							<div style={{ width: '100%', marginBottom: '1em' }}>
								<div style={{
									color: primary, fontSize: '15px', fontWeight: '700', marginBottom: '1em'
								}}>
									{translate.representative_of}:
								</div>
								<div style={{ display: 'inline-block' }}>
									<DelegationSection
										representations
										delegatedVotes={participant.represented}
										translate={translate}
									/>
								</div>
							</div>
						</div>
					</div>
				}

				<div style={{ marginTop: '2em' }}>
					<div style={{ width: '100%' }}>
						<div style={{ width: '100%', marginBottom: '1em' }}>
							<div style={{
								color: primary, fontSize: '15px', fontWeight: '700', marginBottom: '1em'
							}}>
								{delegatedVotes.length > 0 ?
									<div>{translate.they_have_delegated_votes_to_you}</div>
									:
									<div>{translate.you_have_no_proxy_votes}</div>
								}
							</div>
							<div style={{ display: 'inline-block' }}>
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
		);
	};

	const getHistorialReuniones = () => (
		<div>
			<div style={{ marginTop: '2em' }}>
				<div style={{ width: '100%' }}>
					<div style={{ width: '100%', marginBottom: '1em' }}>
						<div style={{
							color: primary, fontSize: '15px', fontWeight: '700', marginBottom: '0.6em'
						}}>
							{translate.comments}
						</div>
						<div style={{
							color: primary, fontSize: '15px', fontWeight: '700', marginBottom: '0.6em'
						}}>

						</div>
					</div>
				</div>
			</div>
		</div>
	);

	const getDatos = () => {
		switch (selecteAssistance) {
			case translate.council:
				return getReunionActual();
			case `${translate.representations_delegations} (${delegatedVotesNumber})`:
				return getVotosDelegados();
			case 'Historial de reuniones':
				return getHistorialReuniones();
			default:
				break;
		}
	};

	return (
		<NotLoggedLayout
			translate={translate}
			helpIcon={true}
			languageSelector={true}
			council={council}
			participant={participant}
		>
			<div style={styles.mainContainer}>
				<AttendanceConfirmation
					open={attendanceConfirmation}
					requestClose={() => setAttendanceConfirmation(false)}
				/>
				<Card style={{ ...styles.cardContainer, width: isMobile ? '100%' : '70%' }}>
					{!councilStarted(council) ?
						<Scrollbar>
							<div style={{ maxWidth: '98vw', padding: '2em' }}>
								<div style={{ display: 'flex', justifyContent: 'space-between' }}>
									<div style={{ fontSize: '25px', color: primary }}>
										{council.companyId === AECOC_ID ?
											'Sr./Sra.'
											:
											`${translate.hello},`
										} {participant.name} {participant.surname || ''}
									</div>
									<div style={{
										color: primary, fontSize: '30px', display: 'flex', alignItems: 'center'
									}}>
										<Icon className="material-icons" style={{ fontSize: '35px', color: primary }}>
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
								<div style={{ display: 'flex', marginTop: '2em' }}>
									<MenuSuperiorTabs
										items={[
											translate.council,
											`${translate.representations_delegations} (${delegatedVotesNumber})`,
											// 'Historial de reuniones'
										]}
										selected={selecteAssistance}
										setSelect={setSelecteAssistance}
									/>
								</div>
								<Card style={{ marginTop: '1em', borderRadius: '8px' }}>
									<div style={{ padding: '2em 1.5em 1.5em 1.5em' }}>
										<Grid style={{ display: 'flex', justifyContent: 'space-between', color: '#000000' }}>
											<GridItem xs={12} lg={6} style={{
												display: 'flex', fontWeight: 'bold', justifyContent: 'space-between', fontSize: '15px'
											}}>
												{council.name}
											</GridItem>
											<GridItem xs={12} lg={6} style={{ fontStyle: 'italic' }}>
												{translate.field_date} - {moment(council.dateStart).format('LLL')}
											</GridItem>
										</Grid>
										<div style={{ fontStyle: 'italic', color: '#000000', marginTop: '1em' }}>
											{council.street}
										</div>
										{council.statute.attendanceText &&
											<div >
												<div style={{
													display: 'flex', fontWeight: 'bold', justifyContent: 'space-between', fontSize: '15px', color: '#000000', marginTop: '1em'
												}}>
													{translate.participation_conditions}
												</div>
												<div dangerouslySetInnerHTML={{ __html: council.statute.attendanceText }} style={{ marginTop: '.5em', fontSize: '15px' }} />
												<div>
													<Checkbox
														value={check}
														onChange={() => {
															setCheck(!check);
															setCheckError(false);
														}}
														label={translate.accept_participation_conditions}
													/>
												</div>
												{checkError &&
													<span style={{ color: 'red' }}>{checkError}</span>
												}
											</div>
										}
										{getDatos(selecteAssistance)}
									</div>
								</Card>
							</div>
						</Scrollbar>
						:
						<CouncilState
							council={council}
							participant={participant}
							company={company}
							isAssistance
							selectHeadFinished='participacion'
						/>
					}
				</Card>
			</div>
		</NotLoggedLayout>
	);
};


const DelegationSection = ({
	delegatedVotes, translate, refetch, representations
}) => {
	const [delegation, setDelegation] = React.useState(null);

	const closeConfirm = () => {
		setDelegation(null);
	};

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

			{delegatedVotes.map(vote => (
				<Card key={vote.id} style={{
					display: 'flex', color: '#000000', fontSize: '14px', padding: '0.5em 1em', marginBottom: '0.5em'
				}}>
					<div>{vote.name} {vote.surname || ''}</div>
					{!representations &&
						<div>
							<i
								onClick={() => setDelegation(vote)}
								className="fa fa-trash-o"
								style={{
									marginLeft: '1em',
									fontSize: '25px',
									color: '#dc7373',
									cursor: 'pointer'
								}}
							></i>
						</div>
					}
				</Card>
			))}
		</div>
	);
};


export default compose(
	graphql(setAssistanceIntentionMutation, {
		name: 'setAssistanceIntention'
	}), graphql(setAssistanceCommentMutation, {
		name: 'setAssistanceComment'
	}), graphql(participantsToDelegate, {
		options: props => ({
			variables: {
				councilId: props.council.id
			}
		})
	})
)(withTranslations()(Assistance));
