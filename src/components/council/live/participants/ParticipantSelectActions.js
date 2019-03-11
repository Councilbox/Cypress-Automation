import React from "react";
import { graphql } from "react-apollo";
import * as CBX from "../../../../utils/CBX";
import { isLandscape } from "../../../../utils/screen";
import { getPrimary, getSecondary } from "../../../../styles/colors";
import { PARTICIPANT_STATES } from "../../../../constants";
import { changeParticipantState } from "../../../../queries/liveParticipant";
import { FilterButton, Grid, GridItem } from "../../../../displayComponents";
import AddRepresentativeModal from "../AddRepresentativeModal";
import DelegateOwnVoteModal from "../DelegateOwnVoteModal";
import DelegateVoteModal from "../DelegateVoteModal";
import FontAwesome from "react-fontawesome";
import StateIcon from "./StateIcon";


class ParticipantSelectActions extends React.Component {
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
		const landscape = isLandscape() || window.innerWidth > 700;
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
				<GridItem xs={12} md={12} lg={12} >
					{CBX.canHaveRepresentative(participant) &&
						<div className="listInModalLive" style={{ display: 'flex', alignItems: 'center' }}>

							{!(participant.delegatedVotes.length > 0) && (
								<FilterButton
									tooltip={translate.add_representative}
									loading={loading === 4}
									size="100%"
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
									<div style={{ display: 'flex', width: '30%' }}>
										<StateIcon
											translate={translate}
											state={PARTICIPANT_STATES.REPRESENTATED}
											color={secondary}
											hideTooltip={true}
										/>
									</div>
									<div style={{ display: 'flex', width: '70%' }}>
										<span style={{ fontSize: '0.9em' }}>{translate.add_representative}</span>
									</div>
								</FilterButton>
							)}
						</div>
					}
					{CBX.canDelegateVotes(council.statute, participant) && (
						<div className="listInModalLive" style={{ display: 'flex', alignItems: 'center' }}>
							<FilterButton
								tooltip={translate.to_delegate_vote}
								loading={loading === 5}
								size="100%"
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
								<div style={{ display: 'flex', width: '30%' }}>
									<StateIcon
										translate={translate}
										state={PARTICIPANT_STATES.DELEGATED}
										color={secondary}
										hideTooltip={true}
									/>
								</div>
								<div style={{ display: 'flex', width: '70%' }}>
									<span style={{ fontSize: '0.9em' }}>{translate.to_delegate_vote}</span>
								</div>
							</FilterButton>
						</div>
					)}
					{CBX.canAddDelegateVotes(council.statute, participant) && (
						<div className="listInModalLive" style={{ display: 'flex', alignItems: 'center' }}>
							<FilterButton
								tooltip={translate.add_delegated}
								loading={loading === 6}
								size="100%"
								onClick={() => {
									this.setState({
										delegateVote: true
									})
								}
								}
								active={
									participant.state ===
									PARTICIPANT_STATES.DELEGATED
								}
							>
								<div style={{ display: 'flex', width: '30%', padding: '0.5em' }}>
									<FontAwesome
										name={"user"}
										style={{
											// position: "absolute",
											color: secondary,
											fontSize: "1.5em"
										}}
									/>
									<FontAwesome
										name={"mail-reply"}
										style={{
											position: "absolute",
											color: primary,
											top: "20px",
											left: "28px"
											// right: "0.7em",
											// fontSize: "0.8em"
										}}
									/>
								</div>
								<div style={{ display: 'flex', width: '70%' }}>
									<span style={{ fontSize: '0.9em' }}>{translate.add_delegated}</span>
								</div>
							</FilterButton>
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
						participant.state === PARTICIPANT_STATES.NO_PARTICIPATE ||
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
})(ParticipantSelectActions);


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