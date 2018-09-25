import React from "react";
import { graphql } from "react-apollo";
import * as CBX from "../../../../utils/CBX";
import { getPrimary, getSecondary } from "../../../../styles/colors";
import { PARTICIPANT_STATES } from "../../../../constants";
import { changeParticipantState } from "../../../../queries/liveParticipant";
import { FilterButton, Grid, GridItem } from "../../../../displayComponents";
import AddRepresentativeModal from "../AddRepresentativeModal";
import DelegateOwnVoteModal from "../DelegateOwnVoteModal";
import DelegateVoteModal from "../DelegateVoteModal";
import FontAwesome from "react-fontawesome";
import SignatureModal from "./modals/SignatureModal";
import StateIcon from "./StateIcon";

class ParticipantStateSelector extends React.Component {
	state = {
		loading: false,
		delegateVote: false,
		delegateOwnVote: false,
		addRepresentative: false
	};


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

	render() {
		const { translate, participant, council } = this.props;
		const { loading } = this.state;
		const secondary = getSecondary();
		const primary = getPrimary();

		return (
			<Grid
				style={{
					width: "100%",
					display: "flex",
					flexDirection: "row",
					alignItems: "center"
				}}
			>
				<GridItem xs={6} md={6} lg={6}>
					<div style={{display: 'flex', alignItems: 'center'}}>
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
						<span style={{fontSize: '0.9em'}}>{'No participa'}</span>
					</div>
					<div style={{display: 'flex', alignItems: 'center'}}>
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
						<span style={{fontSize: '0.9em'}}>{'Remoto'}</span>
					</div>
					<div style={{display: 'flex', alignItems: 'center'}}>
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
						<span style={{fontSize: '0.9em'}}>Presente</span>
					</div>
				</GridItem>
				<GridItem xs={6} md={6} lg={6}>
					{CBX.canBePresentWithRemoteVote(council.statute) && (
						<div style={{display: 'flex', alignItems: 'center'}}>
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
							<span style={{fontSize: '0.9em'}}>Presente con voto remoto</span>
						</div>
					)}
					{CBX.canHaveRepresentative(participant) &&
						<div style={{display: 'flex', alignItems: 'center'}}>

							{!(participant.delegatedVotes.length > 0) && (
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
							<span style={{fontSize: '0.9em'}}>Añadir representante</span>
						</div>
					}
					{CBX.canDelegateVotes(council.statute, participant) && (
						<div style={{display: 'flex', alignItems: 'center'}}>
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
							<span style={{fontSize: '0.9em'}}>Delegar su voto</span>
						</div>
					)}
					{CBX.canAddDelegateVotes(council.statute, participant) && (
						<div style={{display: 'flex', alignItems: 'center'}}>
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
							<span style={{fontSize: '0.9em'}}>Añadir voto delegado</span>
						</div>
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

				</GridItem>
			</Grid>
		);
	}
}

export default graphql(changeParticipantState, {
	name: "changeParticipantState"
})(ParticipantStateSelector);


/*
<SignatureModal
	show={this.state.signature}
	council={council}
	participant={participant}
	refetch={this.props.refetch}
	requestClose={() => this.setState({ signature: false })}
	translate={translate}
/>
*/