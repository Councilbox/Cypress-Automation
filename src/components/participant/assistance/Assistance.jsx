import React, { Component } from "react";
import { Card } from "material-ui";
import withTranslations from "../../../HOCs/withTranslations";
import { councilIsPreparing } from "../../../utils/CBX";
import Header from "../Header";
import CouncilState from "../login/CouncilState";
import background from "../../../assets/img/signup3.jpg";
import AssistanceOption from "./AssistanceOption";
import { compose, graphql } from "react-apollo";
import { setAssistanceIntention, setAssistanceComment } from "../../../queries/liveParticipant";
import { PARTICIPANT_STATES } from "../../../constants";
import { RichTextInput, BasicButton, ButtonIcon } from '../../../displayComponents'
import DelegateVoteModal from "../../council/live/DelegateVoteModal";
import DelegationItem from "./DelegationItem";
import {canDelegateVotes} from "../../../utils/CBX"
import { primary } from "../../../styles/colors";

const styles = {
	viewContainer: {
		width: "100vw",
		height: "100vh",
		position: "relative"
	},
	mainContainer: {
		width: "100%",
		height: "calc(100% - 48px)",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		position: "relative",
		backgroundImage: `url(${background})`,
		padding: "10px"
	},
	cardContainer: {
		margin: "20px",
		padding: "20px",
		maxWidth: "100%"
	}
};

class Assistance extends Component {
	constructor(props) {
		super(props);
		this.state = {
			participant: {},
			savingAssistanceComment: false,
			delegationModal: false
		};
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		return {
			participant: nextProps.participant
		};
	}

	selectSimpleOption = async (option) => {
		const { setAssistanceIntention, refetch } = this.props;

		const response = await setAssistanceIntention({
			variables: {
				assistanceIntention: option
			}
		});
		if (response) {
			refetch();
		}
	}

	saveAssistanceComment = async () => {
		const { setAssistanceComment } = this.props;
		const { assistanceComment } = this.state.participant;

		this.setState({
			savingAssistanceComment: true
		})

		const response = await setAssistanceComment({
			variables: {
				assistanceComment: assistanceComment
			}
		});

		this.setState({
			savingAssistanceComment: false
		})
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
			<div style={styles.viewContainer}>
				<Header logoutButton={false} participant={participant} council={council} />
				<div style={styles.mainContainer}>
					<Card style={styles.cardContainer}>
						{councilIsPreparing(council) ? (
							<div>
								<h3>{council.name}</h3>
								<p>{`${council.street}, ${council.country}`}</p>
								<p>{translate['1st_call_date']}: {council.dateStart}</p>
								<hr />
								<p>{translate.welcome} {participant.name} {participant.surname}</p>
								<h4>{translate.indicate_status}:</h4>
								<AssistanceOption
									title={translate.attend_remotely_through_cbx}
									select={() => {
										selectSimpleOption(PARTICIPANT_STATES.REMOTE)
									}}
									selected={participant.assistanceIntention === PARTICIPANT_STATES.REMOTE}
								/>
								<AssistanceOption
									title={translate.attending_in_person}
									subtitle={translate.attending_in_person_subtitle}
									select={() => {
										selectSimpleOption(PARTICIPANT_STATES.PHYSICALLY_PRESENT)
									}}
									selected={participant.assistanceIntention === PARTICIPANT_STATES.PHYSICALLY_PRESENT}

								/>
								<AssistanceOption
									title={translate.not_attending}
									select={() => {
										selectSimpleOption(PARTICIPANT_STATES.NO_PARTICIPATE)
									}}
									selected={participant.assistanceIntention === PARTICIPANT_STATES.NO_PARTICIPATE}
								/>
								{
									canDelegate && <AssistanceOption
										title={translate.want_to_delegate_in}
										select={this.showDelegation}
										selected={participant.assistanceIntention === PARTICIPANT_STATES.DELEGATED}
									/>
								}
								{representative &&
									<DelegationItem participant={representative} />
								}
								<br />

								<h4>{translate.attendance_comment}:</h4>
								<RichTextInput
									errorText=""
									value={
										!!participant.assintanceComment
											? participant.assintanceComment
											: ""
									}
									onChange={value =>
										this.setState({
											participant: {
												...this.state.participant,
												assintanceComment: value
											}
										})
									}
								/>
								<br/>
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
			</div>
		);
	}
}

export default compose(graphql(setAssistanceIntention, {
	name: "setAssistanceIntention"
}), graphql(setAssistanceComment, {
	name: "setAssistanceComment"
}))(withTranslations()(Assistance));
