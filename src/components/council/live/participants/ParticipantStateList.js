import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import * as CBX from '../../../../utils/CBX';
import { getSecondary } from '../../../../styles/colors';
import { PARTICIPANT_STATES } from '../../../../constants';
import { changeParticipantState } from '../../../../queries/liveParticipant';
import {
	FilterButton, Grid, AlertConfirm, DropDownMenu
} from '../../../../displayComponents';
import StateIcon from './StateIcon';
import { useOldState } from '../../../../hooks';
import { removeLiveParticipantSignature } from './modals/SignatureModal';
import { ConfigContext } from '../../../../containers/AppControl';

const getActualParticipant = (participant, representative) => {
	if (CBX.hasHisVoteDelegated(participant)) {
		return participant;
	}

	return representative || participant;
};


const ParticipantStateList = ({
	participant: p, representative, translate, council, inDropDown, client, ...props
}) => {
	const [state, setState] = useOldState({
		loading: false,
		delegateVote: false,
		delegateOwnVote: false,
		addRepresentative: false
	});
	const [leaveAlert, setLeaveAlert] = React.useState(false);
	const config = React.useContext(ConfigContext);
	const secondary = getSecondary();

	const participant = getActualParticipant(p, representative);

	const removeParticipantSignature = async () => {
		await client.mutate({
			mutation: removeLiveParticipantSignature,
			variables: {
				participantId: participant.id
			}
		});
	};

	const updateParticipantState = async (status, index) => {
		setState({
			loading: index
		});

		const response = await props.changeParticipantState({
			variables: {
				participantId: participant.id,
				state: status
			}
		});

		if (status === PARTICIPANT_STATES.NO_PARTICIPATE && participant.signed) {
			removeParticipantSignature();
		}

		if (response) {
			setState({
				loading: false
			});
			props.refetch();
		}
	};


	const { loading } = state;

	return (
		<>
			<AlertConfirm
				title={translate.warning}
				buttonAccept={translate.accept}
				buttonCancel={translate.cancel}
				open={leaveAlert}
				requestClose={event => {
					event.stopPropagation();
					setLeaveAlert(false);
				}}
				acceptAction={event => {
					event.stopPropagation();
					updateParticipantState(PARTICIPANT_STATES.LEFT, 5, null);
					setLeaveAlert(false);
				}}
				bodyText={
					<div style={{ maxWidth: '620px' }} dangerouslySetInnerHTML={{ __html: translate.leaves_the_council_warning }} />
				}
			/>
			<DropDownMenu
				claseHover={'classHover '}
				color="transparent"
				id={`state-selector-${props.id}`}
				style={{ paddingLeft: '0px', paddingRight: '0px' }}
				textStyle={{ boxShadow: 'none', height: '100%', minWidth: '15px' }}
				icon={
					<StateIcon
						translate={translate}
						state={getActualParticipant(participant, representative).state}
						ratio={1.3}
					/>
				}
				items={
					<>
						<Grid
							style={{
								width: '100%',
								display: 'flex',
								flexDirection: 'row',
								minWidth: '17em',
								alignItems: 'center',
								margin: 0
							}}
						>

							<div style={{
								display: 'flex', alignItems: 'center', padding: '0px', width: '100%'
							}}>
								<FilterButton
									styles={{
										width: '100%', border: 'none', boxShadow: 'none', margin: 'none', borderRadius: '0'
									}}
									tooltip={translate.change_to_no_participate}
									loading={loading === 0}
									size="2.8em"
									id={`state-no-participate-${props.id}`}
									onClick={() => updateParticipantState(6, 0, null)}
									active={
										participant.state === PARTICIPANT_STATES.NO_PARTICIPATE
									}
								>
									<div style={{ width: '30%', marginRight: '20px' }}>
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
							{council.councilType !== 1
								&& <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
									<FilterButton
										styles={{
											width: '100%', border: 'none', boxShadow: 'none', margin: 'none', borderRadius: '0'
										}}
										tooltip={translate.change_to_remote}
										loading={loading === 1}
										id={`state-remote-${props.id}`}
										size="2.8em"
										onClick={() => updateParticipantState(0, 1, null)}
										active={participant.state === PARTICIPANT_STATES.REMOTE}
									>
										<div style={{ width: '30%', marginRight: '20px' }}>
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
							}
							<div style={{
								display: 'flex', alignItems: 'center', margin: 'none', borderRadius: '0', width: '100%'
							}}>
								<FilterButton
									styles={{
										width: '100%', border: 'none', boxShadow: 'none', margin: 'none',
									}}
									tooltip={translate.physically_present_assistance}
									loading={loading === 2}
									size="2.8em"
									id={`state-in-person-${props.id}`}
									onClick={() => updateParticipantState(5, 2, null)}
									active={
										participant.state
										=== PARTICIPANT_STATES.PHYSICALLY_PRESENT
									}
								>
									<div style={{ width: '30%', marginRight: '20px' }}>
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
							{((participant.state === PARTICIPANT_STATES.PHYSICALLY_PRESENT
								|| participant.state === PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE
							) && council.councilType < 2 &&
								config.canLeftCouncil
							) && (
								<div style={{
									display: 'flex', alignItems: 'center', margin: 'none', borderRadius: '0', width: '100%'
								}}>
									<FilterButton
										tooltip={translate.change_to_present_with_remote_vote}
										styles={{
											width: '100%', border: 'none', boxShadow: 'none', margin: 'none',
										}}
										loading={loading === 3}
										size="2.8em"
										id={`state-left-${props.id}`}
										onClick={() => setLeaveAlert(true)}
										active={
											participant.state
											=== PARTICIPANT_STATES.LEFT
										}
									>
										<div style={{ width: '30%', marginRight: '20px' }}>
											<StateIcon
												translate={translate}
												state={PARTICIPANT_STATES.LEFT}
												color={secondary}
												hideTooltip={true}
											/>
										</div>
										<div style={{ width: '70%' }}>
											<span style={{ fontSize: '0.9em' }}>{translate.leaves_the_council}</span>
										</div>
									</FilterButton>
								</div>
							)}
							{CBX.canBePresentWithRemoteVote(council.statute) && (
								<div style={{
									display: 'flex', alignItems: 'center', margin: 'none', borderRadius: '0', width: '100%'
								}}>
									<FilterButton
										tooltip={translate.change_to_present_with_remote_vote}
										styles={{
											width: '100%', border: 'none', boxShadow: 'none', margin: 'none',
										}}
										loading={loading === 3}
										id={`state-in-person-remote-vote-${props.id}`}
										size="2.8em"
										onClick={() => updateParticipantState(7, 3, null)}
										active={
											participant.state
											=== PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE
										}
									>
										<div style={{ width: '30%', marginRight: '20px' }}>
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
						</Grid>
					</>
				}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}

			/>
		</>
	);
};


export default graphql(changeParticipantState, {
	name: 'changeParticipantState'
})(withApollo(ParticipantStateList));
