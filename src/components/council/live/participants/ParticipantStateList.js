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


class ParticipantStateList extends React.Component {
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
		const { translate, participant, council, inDropDown } = this.props;
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
				<GridItem xs={landscape ? 6 : 12} md={inDropDown ? 12 : 6} lg={inDropDown ? 12 : 6} style={{padding: "0px" }}>
					<div style={{ display: 'flex', alignItems: 'center', width: '11em', padding: "0px" }}>
						<FilterButton
							styles={{ width: '100%', border: 'none', boxShadow: 'none',margin: "none", borderRadius: "0" }}
							tooltip={translate.change_to_no_participate}
							loading={loading === 0}
							size="2.8em"
							onClick={() => this.changeParticipantState(6, 0, null)}
							active={
								participant.state === PARTICIPANT_STATES.NO_PARTICIPATE
							}
						>
							<div style={{ width: '30%', marginRight: "20px" }}>
								<StateIcon
									translate={translate}
									state={PARTICIPANT_STATES.NO_PARTICIPATE}
									color={secondary}
									hideTooltip={true}
								/>
							</div>
							<div style={{ width: '70%' }}>
								<span style={{ fontSize: '0.9em' }}>{translate.wont_participate}</span>
							</div>
						</FilterButton>
					</div>
					<div style={{ display: 'flex', alignItems: 'center', width: '11em' }}>
						<FilterButton
							styles={{ width: "100%", border: "none", boxShadow: "none",margin: "none" , borderRadius: "0"}}
							tooltip={translate.change_to_remote}
							loading={loading === 1}
							size="2.8em"
							onClick={() => this.changeParticipantState(0, 1, null)}
							active={participant.state === PARTICIPANT_STATES.REMOTE}
						>
							<div style={{ width: '30%', marginRight: "20px" }}>
								<StateIcon
									translate={translate}
									state={PARTICIPANT_STATES.REMOTE}
									color={secondary}
									hideTooltip={true}
								/>
							</div>
							<div style={{ width: '70%' }}>
								<span style={{ fontSize: '0.9em' }}>{translate.remote_participant}</span>
							</div>
						</FilterButton>
					</div>
					<div style={{ display: 'flex', alignItems: 'center', width: '11em',margin: "none", borderRadius: "0" }}>
						<FilterButton
							styles={{ width: "100%", border: "none", boxShadow: "none" }}
							tooltip={translate.physically_present_assistance}
							loading={loading === 2}
							size="2.8em"
							onClick={() => this.changeParticipantState(5, 2, null)}
							active={
								participant.state ===
								PARTICIPANT_STATES.PHYSICALLY_PRESENT
							}
						>
							<div style={{ width: '30%', marginRight: "20px" }}>
								<StateIcon
									translate={translate}
									state={PARTICIPANT_STATES.PHYSICALLY_PRESENT}
									color={secondary}
									hideTooltip={true}
								/>
							</div>
							<div style={{ width: '70%' }}>
								<span style={{ fontSize: '0.9em' }}>Presente</span>
							</div>
						</FilterButton>
					</div>
				</GridItem>
			</Grid>
		);
	}
}

export default graphql(changeParticipantState, {
	name: "changeParticipantState"
})(ParticipantStateList);


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