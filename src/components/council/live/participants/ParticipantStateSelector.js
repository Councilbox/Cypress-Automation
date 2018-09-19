import React, { Component } from "react";
import { graphql } from "react-apollo";
import * as CBX from "../../../../utils/CBX";
import { getPrimary, getSecondary } from "../../../../styles/colors";
import { PARTICIPANT_STATES } from "../../../../constants";
import { changeParticipantState } from "../../../../queries/liveParticipant";
import { FilterButton } from "../../../../displayComponents";
import AddRepresentativeModal from "../AddRepresentativeModal";
import DelegateOwnVoteModal from "../DelegateOwnVoteModal";
import DelegateVoteModal from "../DelegateVoteModal";
import FontAwesome from "react-fontawesome";
import SignatureModal from "./modals/SignatureModal";
import StateIcon from "./StateIcon";

class ParticipantStateSelector extends Component {
	changeParticipantState = async (state, index) => {
		const { participant } = this.props;
		this.setState({
			loading: index
		});

		const response = await this.props.changeParticipantState({
			variables: {
				participantId: participant.id,
				state: state
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
		const secondary = getSecondary();
		const primary = getPrimary();

		return (
			<div
				style={{
					width: "100%",
					display: "flex",
					flexDirection: "row",
					alignItems: "center"
				}}
			>
				<SignatureModal
					show={this.state.signature}
					council={council}
					participant={participant}
					refetch={this.props.refetch}
					requestClose={() => this.setState({ signature: false })}
					translate={translate}
				/>
				<FilterButton
					tooltip={translate.change_to_no_participate}
					loading={loading === 0}
					size="2.8em"
					onClick={() => this.changeParticipantState(6, 0, null)}
					active={
						participant.state === PARTICIPANT_STATES.NO_PARTICIPATE
					}
				>
					<StateIcon
						translate={translate}
						state={PARTICIPANT_STATES.NO_PARTICIPATE}
						color={secondary}
						hideTooltip={true}
					/>
				</FilterButton>
				<FilterButton
					tooltip={translate.change_to_remote}
					loading={loading === 1}
					size="2.8em"
					onClick={() => this.changeParticipantState(0, 1, null)}
					active={participant.state === PARTICIPANT_STATES.REMOTE}
				>
					<StateIcon
						translate={translate}
						state={PARTICIPANT_STATES.REMOTE}
						color={secondary}
						hideTooltip={true}
					/>
				</FilterButton>
				<FilterButton
					tooltip={translate.physically_present_assistance}
					loading={loading === 2}
					size="2.8em"
					onClick={() => this.changeParticipantState(5, 2, null)}
					active={
						participant.state ===
						PARTICIPANT_STATES.PHYSICALLY_PRESENT
					}
				>
					<StateIcon
						translate={translate}
						state={PARTICIPANT_STATES.PHYSICALLY_PRESENT}
						color={secondary}
						hideTooltip={true}
					/>
				</FilterButton>
				{CBX.canBePresentWithRemoteVote(council.statute) && (
					<FilterButton
						tooltip={translate.change_to_present_with_remote_vote}
						loading={loading === 3}
						size="2.8em"
						onClick={() => this.changeParticipantState(7, 3, null)}
						active={
							participant.state ===
							PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE
						}
					>
						<StateIcon
							translate={translate}
							state={PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE}
							color={secondary}
							hideTooltip={true}
						/>
					</FilterButton>
				)}
				{CBX.canHaveRepresentative(participant) &&
					!(participant.delegatedVotes.length > 0) && (
						<FilterButton
							tooltip={translate.add_representative}
							loading={loading === 4}
							size="2.8em"
							onClick={() =>
								this.setState({
									addRepresentative: true
								})
							}
							active={
								participant.state ===
								PARTICIPANT_STATES.REPRESENTATED
							}
						>
							<StateIcon
								translate={translate}
								state={PARTICIPANT_STATES.REPRESENTATED}
								color={secondary}
								hideTooltip={true}
							/>
						</FilterButton>
					)}
				{CBX.canDelegateVotes(council.statute, participant) && (
					<FilterButton
						tooltip={translate.to_delegate_vote}
						loading={loading === 5}
						size="2.8em"
						onClick={() =>
							this.setState({
								delegateOwnVote: true
							})
						}
						active={
							participant.state ===
							PARTICIPANT_STATES.DELEGATED
						}
					>
						<StateIcon
							translate={translate}
							state={PARTICIPANT_STATES.DELEGATED}
							color={secondary}
							hideTooltip={true}
						/>
					</FilterButton>
				)}
				{CBX.canAddDelegateVotes(council.statute, participant) && (
					<FilterButton
						tooltip={translate.add_delegated}
						loading={loading === 6}
						size="2.8em"
						onClick={() =>
							this.setState({
								delegateVote: true
							})
						}
						active={
							participant.state ===
							PARTICIPANT_STATES.DELEGATED
						}
					>
						<FontAwesome
							name={"user"}
							style={{
								position: "absolute",
								color: secondary,
								fontSize: "1.5em"
							}}
						/>
						<FontAwesome
							name={"mail-reply"}
							style={{
								position: "absolute",
								color: primary,
								right: "0.7em",
								fontSize: "0.8em"
							}}
						/>
					</FilterButton>
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
					refetch={this.props.refetch}
					requestClose={() =>
						this.setState({ delegateOwnVote: false })
					}
					translate={translate}
				/>
				{(participant.state === PARTICIPANT_STATES.REMOTE ||
					participant.state ===
					PARTICIPANT_STATES.PHYSICALLY_PRESENT ||
					participant.state ===
					PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE) && (
						<DelegateVoteModal
							show={this.state.delegateVote}
							council={council}
							participant={participant}
							refetch={this.props.refetch}
							requestClose={() =>
								this.setState({ delegateVote: false })
							}
							translate={translate}
						/>
					)}
			</div>
		);
	}
}

export default graphql(changeParticipantState, {
	name: "changeParticipantState"
})(ParticipantStateSelector);
