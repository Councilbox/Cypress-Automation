import React from "react";
import { Card, Typography } from "material-ui";
import withTranslations from "../../../HOCs/withTranslations";
import { councilIsPreparing, checkForUnclosedBraces } from "../../../utils/CBX";
import CouncilState from "../login/CouncilState";
import AssistanceOption from "./AssistanceOption";
import { compose, graphql } from "react-apollo";
import { setAssistanceIntention, setAssistanceComment } from "../../../queries/liveParticipant";
import { PARTICIPANT_STATES } from "../../../constants";
import { BasicButton, ButtonIcon, NotLoggedLayout, Scrollbar, DateWrapper, SectionTitle, LiveToast } from '../../../displayComponents';
import RichTextInput from "../../../displayComponents/RichTextInput";
import DelegateOwnVoteAttendantModal from "./DelegateOwnVoteAttendantModal";
import DelegationItem from "./DelegationItem";
import { canDelegateVotes } from "../../../utils/CBX"
import { primary } from "../../../styles/colors";
import { toast } from 'react-toastify';


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
		idDelegate: null
	};

	static getDerivedStateFromProps(nextProps, prevState) {
		console.log("====getDerivedStateFromProps====")
		if (!prevState.participant.id) {
			return {
				participant: nextProps.participant,
				assistanceIntention: nextProps.participant.assistanceIntention,
			};
		}
		console.log(nextProps.participant);
		if (prevState.participant.delegateId !== nextProps.delegateId) {
			return {
				participant: nextProps.participant
			};
		}
		return null;
	}

	selectSimpleOption = async option => {
		console.log("====selectSimpleOption====")
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

	saveAssistanceComment = async () => {
		console.log("====saveAssistanceComment====")
		const { setAssistanceComment } = this.props;
		const { assistanceComment } = this.state.participant;

		console.log(this.state.assistanceIntention);
		await this.selectSimpleOption(this.state.assistanceIntention);

		if (!checkForUnclosedBraces(assistanceComment)) {
			this.setState({
				savingAssistanceComment: true
			})

			await setAssistanceComment({
				variables: {
					assistanceComment: assistanceComment || ''
				}
			});

			this.setState({
				savingAssistanceComment: false,
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

	selectDelegation = async delegateId => {
		console.log("====selectDelegation====")
		this.setState({
			idDelegate: delegateId
		})
		const { setAssistanceIntention, refetch } = this.props;

		// const response = await setAssistanceIntention({
		// 	variables: {
		// 		assistanceIntention: PARTICIPANT_STATES.DELEGATED,
		// 		representativeId: delegateId
		// 	}
		// });

		// if (response) {

		this.setState({
			idDelegate: delegateId,
			delegationModal: false,
			assistanceIntention: PARTICIPANT_STATES.DELEGATED,
		})

		// }
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
															assistanceIntention: PARTICIPANT_STATES.REMOTE
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
															assistanceIntention: PARTICIPANT_STATES.PHYSICALLY_PRESENT
														})
														//selectSimpleOption(PARTICIPANT_STATES.PHYSICALLY_PRESENT)
													}}
													value={PARTICIPANT_STATES.PHYSICALLY_PRESENT}
													selected={this.state.assistanceIntention}

												/>
												<AssistanceOption
													title={translate.not_attending}
													select={() => {
														this.setState({
															assistanceIntention: PARTICIPANT_STATES.NO_PARTICIPATE
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
												{/* { this.state.idDelegate &&
													<DelegationItem participant={representative} />
												} */}
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
											<br />
										</div>
									</Scrollbar>
								</div>
								<div style={styles.buttonSection}>
									<BasicButton
										text={translate.send}
										color={primary}
										floatRight
										success={this.state.success}
										reset={this.resetButtonStates}
										textStyle={{
											color: "white",
											fontWeight: "700"
										}}
										loading={this.state.savingAssistanceComment}
										onClick={this.saveAssistanceComment}
										icon={<ButtonIcon type="save" color="white" />}
									/>
								</div>
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


export default compose(graphql(setAssistanceIntention, {
	name: "setAssistanceIntention"
}), graphql(setAssistanceComment, {
	name: "setAssistanceComment"
}))(withTranslations()(Assistance));
