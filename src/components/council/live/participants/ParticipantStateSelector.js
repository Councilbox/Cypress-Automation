import React, { Component } from "react";
import { graphql } from "react-apollo";
import * as CBX from "../../../../utils/CBX";
import { getPrimary, getSecondary } from "../../../../styles/colors";
import ParticipantStateIcon from "../ParticipantStateIcon";
import { PARTICIPANT_STATES } from "../../../../constants";
import { updateLiveParticipant } from "../../../../queries";
import { FilterButton } from "../../../../displayComponents";
import AddRepresentativeModal from "../AddRepresentativeModal";
import DelegateOwnVoteModal from "../DelegateOwnVoteModal";
import DelegateVoteModal from "../DelegateVoteModal";
import FontAwesome from "react-fontawesome";
import SignatureModal from "./modals/SignatureModal";

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
				<FilterButton
					tooltip={translate.change_to_no_participate}
					loading={loading === 0}
					size="2.8em"
					onClick={() => this.updateLiveParticipant(6, 0, null)}
					active={
						participant.state === PARTICIPANT_STATES.NO_PARTICIPATE
					}
				>
					<div
						style={{
							position: "relative",
							display: "flex",
							alignItems: "center",
							justifyContent: "center"
						}}
					>
						<ParticipantStateIcon
							noTooltip={true}
							participant={{
								state: PARTICIPANT_STATES.NO_PARTICIPATE
							}}
							translate={translate}
						/>
					</div>
				</FilterButton>
				<FilterButton
					tooltip={translate.change_to_remote}
					loading={loading === 1}
					size="2.8em"
					onClick={() => this.updateLiveParticipant(0, 1, null)}
					active={participant.state === PARTICIPANT_STATES.REMOTE}
				>
					<div
						style={{
							position: "relative",
							display: "flex",
							alignItems: "center",
							justifyContent: "center"
						}}
					>
						<ParticipantStateIcon
							noTooltip={true}
							participant={{
								state: PARTICIPANT_STATES.REMOTE
							}}
							translate={translate}
						/>
					</div>
				</FilterButton>
				<FilterButton
					tooltip={translate.physically_present_assistance}
					loading={loading === 2}
					size="2.8em"
					onClick={() => this.updateLiveParticipant(5, 2, null)}
					active={
						participant.state ===
						PARTICIPANT_STATES.PHYSICALLY_PRESENT
					}
				>
					<div
						style={{
							position: "relative",
							display: "flex",
							alignItems: "center",
							justifyContent: "center"
						}}
					>
						<ParticipantStateIcon
							noTooltip={true}
							participant={{
								state: PARTICIPANT_STATES.PHYSICALLY_PRESENT
							}}
							translate={translate}
						/>
					</div>
				</FilterButton>
				{CBX.canBePresentWithRemoteVote(council.statute) && (
					<FilterButton
						tooltip={translate.change_to_present_with_remote_vote}
						loading={loading === 3}
						size="2.8em"
						onClick={() => this.updateLiveParticipant(7, 3, null)}
						active={
							participant.state ===
							PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE
						}
					>
						<div
							style={{
								position: "relative",
								display: "flex",
								alignItems: "center",
								justifyContent: "center"
							}}
						>
							<ParticipantStateIcon
								noTooltip={true}
								participant={{
									state:
										PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE
								}}
								translate={translate}
							/>
						</div>
					</FilterButton>
				)}

				{CBX.canHaveRepresentative(participant) &&
					!participant.delegatedVotes.length > 0 && (
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
							<div
								style={{
									position: "relative",
									display: "flex",
									alignItems: "center",
									justifyContent: "center"
								}}
							>
								<ParticipantStateIcon
									noTooltip={true}
									participant={{
										state: PARTICIPANT_STATES.REPRESENTATED
									}}
									translate={translate}
								/>
							</div>
						</FilterButton>
					)}
				{CBX.canDelegateVotes(council.statute, participant) && (
					<React.Fragment>
						{!participant.delegatedVotes.length > 0 &&
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
								<div
									style={{
										position: "relative",
										display: "flex",
										alignItems: "center",
										justifyContent: "center"
									}}
								>
									<ParticipantStateIcon
										noTooltip={true}
										participant={{
											state: PARTICIPANT_STATES.DELEGATED
										}}
										translate={translate}
									/>
								</div>
							</FilterButton>

						}
						{participant.state !== PARTICIPANT_STATES.DELEGATED && (
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
								<div
									style={{
										position: "relative",
										display: "flex",
										alignItems: "center",
										justifyContent: "center"
									}}
								>
									<FontAwesome
										name={"user"}
										style={{
											position: "absolute",
											color: secondary,
											fontSize: "1.75em"
										}}
									/>
									<FontAwesome
										name={"mail-reply"}
										style={{
											position: "absolute",
											color: primary,
											right: "-0.8em",
											fontSize: "1em"
										}}
										onClick={this.props.requestClose}
									/>
								</div>
							</FilterButton>
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
				<SignatureModal
					show={this.state.signature}
					council={council}
					participant={participant}
					delegateVote={this.saveSignature}
					refetch={this.props.refetch}
					requestClose={() => this.setState({ signature: false })}
					translate={translate}
				/>
			</div>
		);
	}
}

export default graphql(updateLiveParticipant, {
	name: "updateLiveParticipant"
})(ParticipantStateSelector);
