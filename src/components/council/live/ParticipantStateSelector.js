import React, { Component } from "react";
import { graphql } from "react-apollo";
import * as CBX from "../../../utils/CBX";
import { getPrimary, getSecondary } from "../../../styles/colors";
import ParticipantStateIcon from "./ParticipantStateIcon";
import { PARTICIPANT_STATES } from "../../../constants";
import { updateLiveParticipant } from "../../../queries";
import { BasicButton, LoadingSection } from "../../../displayComponents";
import AddRepresentativeModal from "./AddRepresentativeModal";
import DelegateOwnVoteModal from "./DelegateOwnVoteModal";
import DelegateVoteModal from "./DelegateVoteModal";

const StateIconButton = ({ loading, action, icon, active }) => (
	<div
		style={{
			border: `1px solid ${getSecondary()}`,
			width: "3.9em",
			backgroundColor: active ? "lightgrey" : "transparent",
			display: "flex",
			alignItems: "center",
			justifyContent: "center"
		}}
		onClick={() => action()}
	>
		{loading ? (
			<div style={{ padding: "0.3em" }}>
				<LoadingSection size={25} />
			</div>
		) : (
			icon
		)}
	</div>
);

class ParticipantStateSelector extends Component {
	updateLiveParticipant = async (
		state,
		index,
		delegate,
		id = this.props.participant.id
	) => {
		const { participant } = this.props;
		this.setState({
			loading: index
		});

		const response = await this.props.updateLiveParticipant({
			variables: {
				participant: {
					id: id,
					state: state,
					delegateId: delegate,
					councilId: participant.councilId
				}
			}
		});

		if (response) {
			this.setState({
				loading: false
			});
			this.props.refetch();
		}
	};

	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			delegateVote: false,
			delegateOwnVote: false,
			addRepresentative: false
		};
	}

	render() {
		const { translate, participant, council } = this.props;
		const { loading } = this.state;

		return (
			<div
				style={{
					width: "100%",
					display: "flex",
					flexDirection: "row"
				}}
			>
				<StateIconButton
					loading={loading === 0}
					active={
						participant.state === PARTICIPANT_STATES.NO_PARTICIPATE
					}
					action={() => this.updateLiveParticipant(6, 0, null)}
					icon={
						<ParticipantStateIcon
							participant={{
								state: PARTICIPANT_STATES.NO_PARTICIPATE
							}}
							tooltip={"change"}
							translate={translate}
						/>
					}
				/>
				<StateIconButton
					loading={loading === 1}
					active={participant.state === PARTICIPANT_STATES.REMOTE}
					action={() => this.updateLiveParticipant(0, 1, null)}
					icon={
						<ParticipantStateIcon
							participant={{ state: PARTICIPANT_STATES.REMOTE }}
							tooltip={"change"}
							translate={translate}
						/>
					}
				/>
				<StateIconButton
					loading={loading === 2}
					active={
						participant.state ===
						PARTICIPANT_STATES.PHYSICALLY_PRESENT
					}
					action={() => this.updateLiveParticipant(5, 2, null)}
					icon={
						<ParticipantStateIcon
							participant={{
								state: PARTICIPANT_STATES.PHYSICALLY_PRESENT
							}}
							tooltip={"change"}
							translate={translate}
						/>
					}
				/>
				{CBX.canBePresentWithRemoteVote(council.statute) && (
					<StateIconButton
						loading={loading === 3}
						active={
							participant.state ===
							PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE
						}
						action={() => this.updateLiveParticipant(7, 3, null)}
						icon={
							<ParticipantStateIcon
								participant={{
									state:
										PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE
								}}
								tooltip={"change"}
								translate={translate}
							/>
						}
					/>
				)}

				{CBX.canHaveRepresentative(participant) &&
					!participant.delegatedVotes.length > 0 && (
						<div
							style={{
								border: `1px solid ${getSecondary()}`,
								width: "3.9em",
								backgroundColor:
									participant.state ===
									PARTICIPANT_STATES.REPRESENTATED
										? "lightgrey"
										: "transparent",
								display: "flex",
								alignItems: "center",
								justifyContent: "center"
							}}
							onClick={() =>
								this.setState({
									addRepresentative: true
								})
							}
						>
							<ParticipantStateIcon
								participant={{
									state: PARTICIPANT_STATES.REPRESENTATED
								}}
								tooltip={"change"}
								translate={translate}
							/>
						</div>
					)}
				{CBX.canDelegateVotes(council.statute, participant) && (
					<React.Fragment>
						<StateIconButton
							loading={loading === 4}
							active={
								participant.state ===
								PARTICIPANT_STATES.DELEGATED
							}
							action={() =>
								this.setState({
									delegateOwnVote: true
								})
							}
							icon={
								<ParticipantStateIcon
									participant={{
										state: PARTICIPANT_STATES.DELEGATED
									}}
									tooltip={"change"}
									translate={translate}
								/>
							}
						/>
						{!CBX.delegatedVotesLimitReached(
							council.statute,
							participant.delegatedVotes.length
						) &&
							participant.state !==
								PARTICIPANT_STATES.DELEGATED && (
								<BasicButton
									text={translate.add_delegated}
									color={"white"}
									onClick={() =>
										this.setState({ delegateVote: true })
									}
									buttonStyle={{
										marginRight: "1em",
										border: `2px solid ${getPrimary()}`
									}}
								/>
							)}
					</React.Fragment>
				)}
				<AddRepresentativeModal
					show={this.state.addRepresentative}
					council={council}
					participant={participant}
					refetch={this.props.refetch}
					requestClose={() =>
						this.setState({ addRepresentative: false })
					}
					translate={translate}
				/>
				<DelegateOwnVoteModal
					show={this.state.delegateOwnVote}
					council={council}
					participant={participant}
					delegateVote={this.updateLiveParticipant}
					refetch={this.props.refetch}
					requestClose={() =>
						this.setState({ delegateOwnVote: false })
					}
					translate={translate}
				/>
				<DelegateVoteModal
					show={this.state.delegateVote}
					council={council}
					participant={participant}
					delegateVote={this.updateLiveParticipant}
					refetch={this.props.refetch}
					requestClose={() => this.setState({ delegateVote: false })}
					translate={translate}
				/>
			</div>
		);
	}
}

export default graphql(updateLiveParticipant, {
	name: "updateLiveParticipant"
})(ParticipantStateSelector);
