import React from "react";
import { Card, Typography } from "material-ui";
import withTranslations from "../../../HOCs/withTranslations";
import { councilIsPreparing, checkForUnclosedBraces } from "../../../utils/CBX";
import CouncilState from "../login/CouncilState";
import AssistanceOption from "./AssistanceOption";
import { compose, graphql, withApollo } from "react-apollo";
import { setAssistanceIntention, setAssistanceComment } from "../../../queries/liveParticipant";
import { PARTICIPANT_STATES } from "../../../constants";
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
import gql from "graphql-tag";


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

class Assistance extends React.Component {
	state = {
		participant: {},
		savingAssistanceComment: false,
		delegationModal: false,
		assistanceIntention: PARTICIPANT_STATES.REMOTE,
		delegateId: null,
		noAttendWarning: false,
		delegateInfoUser: null
	};

	static getDerivedStateFromProps(nextProps, prevState) {
		if (!prevState.participant.id) {
			return {
				participant: nextProps.participant,
				assistanceIntention: nextProps.participant.assistanceIntention,
			};
		}

		if (prevState.participant.delegateId !== nextProps.delegateId) {
			if (nextProps.participant.representative) {
				return {
					participant: nextProps.participant,
					delegateInfoUser: nextProps.participant.representative
				};
			}
			return {
				participant: nextProps.participant,
			};
		}
		return null;
	}

	selectSimpleOption = async option => {
		const { setAssistanceIntention, refetch } = this.props;
		const quitRepresentative = option !== PARTICIPANT_STATES.DELEGATED;

		const response = await setAssistanceIntention({
			variables: {
				assistanceIntention: option,
				representativeId: quitRepresentative ? null : this.state.participant.delegateId
			}
		});

		if (response) {
			if (response.data.setAssistanceIntention.success) {
				this.setState({
					participant: {
						...this.state.participant,
						assistanteIntention: option,
						...(quitRepresentative ? { representative: null } : {})
					}
				})
			}
			await refetch();
		}
	}

	sendAttendanceIntention = async () => {
		this.setState({
			loading: true
		});
		const { setAssistanceComment } = this.props;
		const { assistanceComment } = this.state.participant;
		const { setAssistanceIntention, refetch } = this.props;

		if (!checkForUnclosedBraces(assistanceComment)) {
			if (this.state.delegateId !== null) {
				const response = await setAssistanceIntention({
					variables: {
						assistanceIntention: PARTICIPANT_STATES.DELEGATED,
						representativeId: this.state.delegateId
					}
				});
			} else {
				await this.selectSimpleOption(this.state.assistanceIntention);
			}

			await setAssistanceComment({
				variables: {
					assistanceComment: assistanceComment || ''
				}
			});

			this.setState({
				loading: false,
				success: true
			})
			this.props.refetch();
		} else {
			this.setState({
				commentError: true
			})
			toast(
				<LiveToast
					message={this.props.translate.revise_text}
				/>, {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: true,
					className: "errorToast"
				}
			);
		}
	}

	resetButtonStates = () => {
		this.setState({
			success: false,
			savingAssistanceComment: false,
		});
	}

	showWarning = () => {
		this.setState({
			noAttendWarning: true
		});
	}

	selectDelegation = async delegateId => {
		const delegateInfoUser = this.props.data.liveParticipantsToDelegate.list.find(user => user.id === delegateId);
		this.setState({
			delegateId: delegateId,
			delegationModal: false,
			delegateInfoUser: delegateInfoUser,
			assistanceIntention: PARTICIPANT_STATES.DELEGATED
		});
	}

	showDelegation = () => {
		this.setState({
			delegationModal: true
		})
	}

	render() {
		const { council, company, translate } = this.props;
		const { representative, ...participant } = this.state.participant;
		let canDelegate = canDelegateVotes(council.statute, participant);

		return (
			<NotLoggedLayout
				translate={this.props.translate}
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
													refetch={this.props.refetch}
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
														<AssistanceOption
															title={translate.attend_remotely_through_cbx}
															select={() => {
																this.setState({
																	assistanceIntention: PARTICIPANT_STATES.REMOTE,
																	delegateId: null
																})
															}}
															value={PARTICIPANT_STATES.REMOTE}
															selected={this.state.assistanceIntention}
														/>
														<AssistanceOption
															title={translate.attending_in_person}
															//subtitle={translate.attending_in_person_subtitle}
															select={() => {
																this.setState({
																	assistanceIntention: PARTICIPANT_STATES.PHYSICALLY_PRESENT,
																	delegateId: null
																})
																//selectSimpleOption(PARTICIPANT_STATES.PHYSICALLY_PRESENT)
															}}
															value={PARTICIPANT_STATES.PHYSICALLY_PRESENT}
															selected={this.state.assistanceIntention}

														/>
														<AssistanceOption
															title={translate.not_attending}
															select={() => {
																this.showWarning();
																this.setState({
																	assistanceIntention: PARTICIPANT_STATES.NO_PARTICIPATE,
																	delegateId: null
																})
																//selectSimpleOption(PARTICIPANT_STATES.NO_PARTICIPATE)
															}}
															value={PARTICIPANT_STATES.NO_PARTICIPATE}
															selected={this.state.assistanceIntention}
														/>
														{canDelegate &&
															<AssistanceOption
																title={translate.want_to_delegate_in}
																select={this.showDelegation}
																value={PARTICIPANT_STATES.DELEGATED}
																selected={this.state.assistanceIntention}
															/>
														}
														{this.state.delegateInfoUser && this.state.assistanceIntention === 4 ?
															<DelegationItem participant={this.state.delegateInfoUser} /> : ""
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
															errorText={this.state.commentError}
															translate={translate}
															value={
																!!participant.assistanceComment
																	? participant.assistanceComment
																	: ""
															}
															onChange={value =>
																this.setState({
																	participant: {
																		...this.state.participant,
																		assistanceComment: value
																	}
																})
															}
														/>
													</Card>
													{this.state.noAttendWarning &&
														<NoAttendDelegationWarning
															translate={translate}
															requestClose={() => this.setState({noAttendWarning: false})}
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
											text={this.state.success? translate.tooltip_sent : translate.send}
											color={primary}
											floatRight
											success={this.state.success}
											reset={this.resetButtonStates}
											textStyle={{
												color: "white",
												fontWeight: "700"
											}}
											loading={this.state.loading}
											onClick={this.sendAttendanceIntention}
											icon={<ButtonIcon type="save" color="white" />}
										/>
									</div>
								}
								<DelegateOwnVoteAttendantModal
									show={this.state.delegationModal}
									council={council}
									participant={participant}
									addRepresentative={this.selectDelegation}
									requestClose={() => this.setState({ delegationModal: false })}
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
}


const DelegationSection = ({ participant, translate, refetch}) => {
	const [delegation, setDelegation] = React.useState(null);

	const closeConfirm = () => {
		setDelegation(null);
	}

	return (
		<Card style={{ padding: '1.5em', width: '100%', marginBottom: "1em" }}>
			<div style={{ borderBottom: '1px solid gainsboro', width: '100%', marginBottom: "1em" }}>
				<SectionTitle
					text={`${'Votos delegados en usted'}:`/*TRADUCCION*/}
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

			{participant.delegatedVotes.map(vote => {
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
						<span>{vote.name}</span>
						<div>
							<BasicButton
								text="Rechazar"//TRADUCCION
								textStyle={{color: secondary}}
								color="transparent"
								loadingColor={secondary}
								onClick={() => setDelegation(vote)}
								buttonStyle={{border: `1px solid ${secondary}`}}
							/>
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
