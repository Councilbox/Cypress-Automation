import React from "react";
import { graphql } from "react-apollo";
import * as CBX from "../../../../utils/CBX";
import { isLandscape } from "../../../../utils/screen";
import { getSecondary } from "../../../../styles/colors";
import { PARTICIPANT_STATES } from "../../../../constants";
import { changeParticipantState } from "../../../../queries/liveParticipant";
import { FilterButton, Grid, GridItem } from "../../../../displayComponents";
import StateIcon from "./StateIcon";
import { useOldState } from "../../../../hooks";

const ParticipantStateList = ({ participant, translate, council, inDropDown, ...props }) => {
	const [state, setState] = useOldState({
		loading: false,
		delegateVote: false,
		delegateOwnVote: false,
		addRepresentative: false
	});
	const secondary = getSecondary();
	const landscape = isLandscape() || window.innerWidth > 700;


	const changeParticipantState = async (state, index) => {
		setState({
			loading: index
		});

		const response = await props.changeParticipantState({
			variables: {
				participantId: participant.id,
				state: state
			}
		});

		if (response) {
			setState({
				loading: false
			});
			props.refetch();
		}
	};

	const { loading } = state;

	return (
		<Grid
			style={{
				width: "100%",
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				margin: 0
			}}
		>
			<GridItem xs={landscape ? 6 : 12} md={inDropDown ? 12 : 6} lg={inDropDown ? 12 : 6} style={{padding: "0px" }}>
				<div style={{ display: 'flex', alignItems: 'center',  padding: "0px", width: '100%' }}>
					<FilterButton
						styles={{ width: '100%', border: 'none', boxShadow: 'none',margin: "none", borderRadius: "0" }}
						tooltip={translate.change_to_no_participate}
						loading={loading === 0}
						size="2.8em"
						onClick={() => changeParticipantState(6, 0, null)}
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
				<div style={{ display: 'flex', alignItems: 'center', width: '11em', width: '100%' }}>
					<FilterButton
						styles={{ width: "100%", border: "none", boxShadow: "none", margin: "none", borderRadius: "0"}}
						tooltip={translate.change_to_remote}
						loading={loading === 1}
						size="2.8em"
						onClick={() => changeParticipantState(0, 1, null)}
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
				<div style={{ display: 'flex', alignItems: 'center', margin: "none", borderRadius: "0", width: '100%' }}>
					<FilterButton
						styles={{ width: "100%", border: "none", boxShadow: "none", margin: "none", }}
						tooltip={translate.physically_present_assistance}
						loading={loading === 2}
						size="2.8em"
						onClick={() => changeParticipantState(5, 2, null)}
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
							<span style={{ fontSize: '0.9em' }}>{translate.physically_present_assistance}</span>
						</div>
					</FilterButton>
				</div>
				{CBX.canBePresentWithRemoteVote(council.statute) && (
					<div style={{ display: 'flex', alignItems: 'center', margin: "none", borderRadius: "0" }}>
						<FilterButton
							tooltip={translate.change_to_present_with_remote_vote}
							styles={{ width: "100%", border: "none", boxShadow: "none", margin: "none", }}
							loading={loading === 3}
							size="2.8em"
							onClick={() => changeParticipantState(7, 3, null)}
							active={
								participant.state ===
								PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE
							}
						>
							<div style={{ width: '30%', marginRight: "20px" }}>
								<StateIcon
									translate={translate}
									state={PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE}
									color={secondary}
									hideTooltip={true}
								/>
							</div>
							<div style={{ width: '70%' }}>
								<span style={{ fontSize: '0.9em' }}>{translate.physically_present_with_remote_vote}</span>
							</div>
						</FilterButton>
					</div>
				)}
			</GridItem>
		</Grid>
	);
}


export default graphql(changeParticipantState, {
	name: "changeParticipantState"
})(ParticipantStateList);