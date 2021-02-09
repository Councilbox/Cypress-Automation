import React from "react";
import { graphql } from "react-apollo";
import * as CBX from "../../../../utils/CBX";
import { getLightGrey } from "../../../../styles/colors";
import { PARTICIPANT_STATES } from "../../../../constants";
import { changeParticipantState } from "../../../../queries/liveParticipant";
import { Grid, GridItem, LoadingSection } from "../../../../displayComponents";
import AddRepresentativeModal from "../AddRepresentativeModal";
import DelegateOwnVoteModal from "../DelegateOwnVoteModal";
import DelegateVoteModal from "../DelegateVoteModal";
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
				state
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
		const { translate, participant, council, onlyButtonDelegateVote } = this.props;
		const { loading } = this.state;
		if (onlyButtonDelegateVote) {
			return (
				// CBX.canAddDelegateVotes(council.statute, participant) && (
				// <GridItem xs={12} md={6} lg={4}>
				<div>
					{CBX.canAddDelegateVotes(council.statute, participant) && (
						<ButtonActions
							loading={loading === 6}
							active={participant.state === PARTICIPANT_STATES.DELEGATED}
							onClick={() => {
								this.setState({
									delegateVote: true
								})
							}}
						>
							<div
								style={{ display: "flex", alignItems: "center" }}
							>
								<div style={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
									<span style={{ fontSize: '0.9em' }}>{translate.add_delegated}</span>
								</div>
							</div>
						</ButtonActions>
					)}
					<DelegateVoteModal
						show={this.state.delegateVote}
						council={council}
						participant={participant}
						refetch={this.props.refetch}
						requestClose={() => this.setState({ delegateVote: false })
						}
						translate={translate}
					/>
				</div>
				// </GridItem>
				// )
			);
		}
		return (
			<Grid
				style={{
					marginTop: "1em",
					width: "100%",
					display: "flex",
					flexDirection: "row",
					alignItems: "center"
				}}
			>
				{CBX.canHaveRepresentative(participant) &&
					!(participant.delegatedVotes.length > 0) && (
						<GridItem xs={12} md={6} lg={4}>
							<ButtonActions
								loading={loading === 4}
								onClick={() => this.setState({
									addRepresentative: true
								})
								}

							>
								<div
									style={{ display: "flex", alignItems: "center", overflow: "hidden" }}
								>
									<div style={{ width: "3em" }}>
										<StateIcon
											translate={translate}
											state={PARTICIPANT_STATES.REPRESENTATED}
											color={'black'}
											hideTooltip={true}
											styles={{ padding: "0em" }}
										/>
									</div>
									<div style={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
										<span style={{ fontSize: '0.9em' }}>{participant.representative ? translate.change_representative : translate.add_representative}</span>
									</div>
								</div>
							</ButtonActions>
						</GridItem>
					)
				}
				{CBX.canDelegateVotes(council.statute, participant) && (
					<GridItem xs={12} md={6} lg={4}>
						<ButtonActions
							loading={loading === 5}
							active={participant.state === PARTICIPANT_STATES.DELEGATED}
							onClick={() => this.setState({
								delegateOwnVote: true
							})
							}
						>
							<div
								style={{ display: "flex", alignItems: "center" }}
							>
								<div style={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
									<span style={{ fontSize: '0.9em' }}>{translate.to_delegate_vote}</span>
								</div>
							</div>
						</ButtonActions>
					</GridItem>
				)}
				{CBX.canAddDelegateVotes(council.statute, participant) && (
					<GridItem xs={12} md={6} lg={4}>
						<ButtonActions
							loading={loading === 6}
							active={participant.state === PARTICIPANT_STATES.DELEGATED}
							onClick={() => {
								this.setState({
									delegateVote: true
								})
							}}
						>
							<div
								style={{ display: "flex", alignItems: "center" }}
							>
								<div style={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
									<span style={{ fontSize: '0.9em' }}>{translate.add_delegated}</span>
								</div>
							</div>
						</ButtonActions>
					</GridItem>
				)}

				<AddRepresentativeModal
					show={this.state.addRepresentative}
					council={council}
					participant={participant}
					refetch={this.props.refetch}
					requestClose={() => this.setState({ addRepresentative: false })
					}
					translate={translate}
				/>
				{this.state.delegateOwnVote &&
					<DelegateOwnVoteModal
						show={this.state.delegateOwnVote}
						council={council}
						participant={participant}
						refetch={this.props.refetch}
						requestClose={() => this.setState({ delegateOwnVote: false })
						}
						translate={translate}
					/>
				}

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
							requestClose={() => this.setState({ delegateVote: false })
							}
							translate={translate}
						/>
					)}

			</Grid>
		);
	}
}


// active poner background
const ButtonActions = ({ children, loading, onClick, active }) => (
	<div
		style={{
			display: 'flex',
			alignItems: 'center',
			height: "37px",
			borderRadius: '4px',
			border: 'solid 1px #a09aa0',
			color: 'black',
			padding: "0.3em 1.3em",
			cursor: "pointer",
			marginRight: "0.5em",
			backgroundColor: active ? getLightGrey() : "transparent",
		}}
		onClick={onClick}
	>
		{loading ? (
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center"
				}}
			>
				<LoadingSection size={20} />
			</div>
		) : (
				children
			)}
	</div>
)


export default graphql(changeParticipantState, {
	name: "changeParticipantState"
})(ParticipantSelectActions);
