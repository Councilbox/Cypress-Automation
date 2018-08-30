import React from "react";
import { Card, Typography } from "material-ui";
import withTranslations from "../../../HOCs/withTranslations";
import { councilIsPreparing, checkForUnclosedBraces } from "../../../utils/CBX";
import CouncilState from "../login/CouncilState";
import AssistanceOption from "./AssistanceOption";
import { compose, graphql } from "react-apollo";
import { setAssistanceIntention, setAssistanceComment } from "../../../queries/liveParticipant";
import { PARTICIPANT_STATES } from "../../../constants";
import { BasicButton, ButtonIcon, NotLoggedLayout, Scrollbar, DateWrapper, SectionTitle, Checkbox } from '../../../displayComponents';
import RichTextInput from "../../../displayComponents/RichTextInput";
import DelegateVoteModal from "../../council/live/DelegateVoteModal";
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
		height: "calc(100% - 3em)",
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
		height: '100%'
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
	};

	static getDerivedStateFromProps(nextProps, prevState) {
		return {
			participant: nextProps.participant
		};
	}

	selectSimpleOption = async option => {
		const { setAssistanceIntention, refetch } = this.props;

		const response = await setAssistanceIntention({
			variables: {
				assistanceIntention: option
			}
		});
		console.log(response);
		if (response) {
			if(response.data.setAssistanceIntention.success){
				this.setState({
					participant: {
						...this.state.participant,
						assistanteIntention: option
					}
				})
			}
			refetch();
		}
	}

	saveAssistanceComment = async () => {
		const { setAssistanceComment } = this.props;
		const { assistanceComment } = this.state.participant;

		if(!checkForUnclosedBraces(assistanceComment)){
			this.setState({
				savingAssistanceComment: true
			})

			await setAssistanceComment({
				variables: {
					assistanceComment: assistanceComment
				}
			});

			this.setState({
				savingAssistanceComment: false
			})
		}else{
			this.setState({
				commentError: true
			})
			toast.error(this.props.translate.revise_text);
		}

	}

	selectDelegation = async (a, b, delegate) => {
		const { setAssistanceIntention, refetch } = this.props;

		const response = await setAssistanceIntention({
			variables: {
				assistanceIntention: PARTICIPANT_STATES.DELEGATED,
				representativeId: delegate
			}
		});

		if (response) {
			refetch();
		}
	}

	showDelegation = () => {
		this.setState({
			delegationModal: true
		})
	}

	render() {
		const { council, company, translate } = this.props;
		const { representative, ...participant } = this.state.participant;
		const selectSimpleOption = this.selectSimpleOption;
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
							<div style={{height: '100%', width: '680px', maxWidth: '98vw'}}>
								<div style={{height: '4em', borderBottom: '1px solid gainsboro', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1.2em'}}>
									<Typography variant="title" style={{fontWeight: '700', fontSize: '1.35rem'}}>
										{council.name}
									</Typography>
								</div>
								<div style={{
									height: 'calc(100% - 7.5em)',
									width: '100%',
									overflow: 'hidden'
								}}>
									<Scrollbar>
										<div style={{height: '100%', padding: '1.2em', width: '100%'}}>
											<Typography variant="subheading" style={{fontWeight: '700', marginBottom: '1.2em'}}>
												{translate.welcome} {participant.name} {participant.surname}
											</Typography>
											<SectionTitle
												text={translate.council_info}
												color={primary}
											/>
											<p style={{marginTop: '1em'}}>{`${council.street}, ${council.country}`}</p>
											<p>{translate['1st_call_date']}: <DateWrapper date={council.dateStart} format={'LLL'} /></p>
											<hr />

											<SectionTitle
												text={`${translate.indicate_status}:`}
												color={primary}
											/>
											<AssistanceOption
												title={translate.attend_remotely_through_cbx}
												select={() => {
													selectSimpleOption(PARTICIPANT_STATES.REMOTE)
												}}
												value={PARTICIPANT_STATES.REMOTE}
												selected={participant.assistanceIntention}
											/>
											<AssistanceOption
												title={translate.attending_in_person}
												//subtitle={translate.attending_in_person_subtitle}
												select={() => {
													selectSimpleOption(PARTICIPANT_STATES.PHYSICALLY_PRESENT)
												}}
												value={PARTICIPANT_STATES.PHYSICALLY_PRESENT}
												selected={participant.assistanceIntention}

											/>
											<AssistanceOption
												title={translate.not_attending}
												select={() => {
													selectSimpleOption(PARTICIPANT_STATES.NO_PARTICIPATE)
												}}
												value={PARTICIPANT_STATES.NO_PARTICIPATE}
												selected={participant.assistanceIntention}
											/>
											{
												canDelegate && <AssistanceOption
													title={translate.want_to_delegate_in}
													select={this.showDelegation}
													value={PARTICIPANT_STATES.DELEGATED}
													selected={participant.assistanceIntention}
												/>
											}
											{representative &&
												<DelegationItem participant={representative} />
											}
											<br />

											<h4>{translate.attendance_comment}:</h4>
											<RichTextInput
												errorText={this.state.commentError}
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
											<br/>
										</div>
									</Scrollbar>
								</div>
								<div style={styles.buttonSection}>
									<BasicButton
										text={translate.send}
										color={primary}
										floatRight
										textStyle={{
											color: "white",
											fontWeight: "700"
										}}
										onClick={this.saveAssistanceComment}
										icon={<ButtonIcon type="save" color="white" />}
									/>
								</div>
								<DelegateVoteModal
									show={this.state.delegationModal}
									council={council}
									participant={participant}
									delegateVote={this.selectDelegation}
									requestClose={() => this.setState({ delegationModal: false })}
									translate={translate}
								/>
							</div>
						) : (
								<CouncilState council={council} company={company} isAssistance />
							)}
					</Card>
				</div>
			</NotLoggedLayout>
		);
	}
}

/*
			<div style={styles.viewContainer}>
				<Header logoutButton={false} participant={participant} council={council} />
				<div style={styles.mainContainer}>
					
				</div>
			</div>
*/

export default compose(graphql(setAssistanceIntention, {
	name: "setAssistanceIntention"
}), graphql(setAssistanceComment, {
	name: "setAssistanceComment"
}))(withTranslations()(Assistance));
