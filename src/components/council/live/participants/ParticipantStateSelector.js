import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import FontAwesome from 'react-fontawesome';
import * as CBX from '../../../../utils/CBX';
import { isLandscape } from '../../../../utils/screen';
import { getPrimary, getSecondary } from '../../../../styles/colors';
import { PARTICIPANT_STATES } from '../../../../constants';
import { changeParticipantState } from '../../../../queries/liveParticipant';
import { FilterButton, Grid, GridItem } from '../../../../displayComponents';
import AddRepresentativeModal from '../AddRepresentativeModal';
import DelegateOwnVoteModal from '../DelegateOwnVoteModal';
import DelegateVoteModal from '../DelegateVoteModal';
import StateIcon from './StateIcon';
import { removeLiveParticipantSignature } from './modals/SignatureModal';


const ParticipantStateSelector = ({
	participant, translate, council, inDropDown, client, ...props
}) => {
	const [loading, setLoading] = React.useState(false);
	const [delegateVote, setDelegateVote] = React.useState(false);
	const [delegateOwnVote, setDelegateOwnVote] = React.useState(false);
	const [addRepresentative, setAddRepresentative] = React.useState(false);

	const secondary = getSecondary();
	const landscape = isLandscape() || window.innerWidth > 700;
	const primary = getPrimary();

	const handleParticipantState = async state => {
		setLoading(state);
		const response = await props.changeParticipantState({
			variables: {
				participantId: participant.id,
				state
			}
		});

		if (state === PARTICIPANT_STATES.NO_PARTICIPATE && participant.signed) {
			client.mutate({
				mutation: removeLiveParticipantSignature,
				variables: {
					participantId: participant.id
				}
			});
		}

		if (response) {
			setLoading(false);
			props.refetch();
		}
	};

	return (
		<Grid
			style={{
				width: '100%',
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center'
			}}
		>
			<GridItem xs={landscape ? 6 : 12} md={inDropDown ? 12 : 6} lg={inDropDown ? 12 : 6} >
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<FilterButton
						tooltip={translate.change_to_no_participate}
						loading={loading === 0}
						size="2.8em"
						onClick={() => handleParticipantState(6, 0, null)}
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
					<span style={{ fontSize: '0.9em' }}>{translate.wont_participate}</span>
				</div>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<FilterButton
						tooltip={translate.change_to_remote}
						loading={loading === 1}
						size="2.8em"
						onClick={() => handleParticipantState(0, 1, null)}
						active={participant.state === PARTICIPANT_STATES.REMOTE}
					>
						<StateIcon
							translate={translate}
							state={PARTICIPANT_STATES.REMOTE}
							color={secondary}
							hideTooltip={true}
						/>
					</FilterButton>
					<span style={{ fontSize: '0.9em' }}>{translate.remote_participant}</span>
				</div>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<FilterButton
						tooltip={translate.physically_present_assistance}
						loading={loading === 2}
						size="2.8em"
						onClick={() => handleParticipantState(5, 2, null)}
						active={
							participant.state
							=== PARTICIPANT_STATES.PHYSICALLY_PRESENT
						}
					>
						<StateIcon
							translate={translate}
							state={PARTICIPANT_STATES.PHYSICALLY_PRESENT}
							color={secondary}
							hideTooltip={true}
						/>
					</FilterButton>
					<span style={{ fontSize: '0.9em' }}>{translate.customer_present}</span>
				</div>
				{CBX.canBePresentWithRemoteVote(council.statute) && (
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<FilterButton
							tooltip={translate.change_to_present_with_remote_vote}
							loading={loading === 3}
							size="2.8em"
							onClick={() => handleParticipantState(7, 3, null)}
							active={
								participant.state
								=== PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE
							}
						>
							<StateIcon
								translate={translate}
								state={PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE}
								color={secondary}
								hideTooltip={true}
							/>
						</FilterButton>
						<span style={{ fontSize: '0.9em' }}>{translate.physically_present_with_remote_vote}</span>
					</div>
				)}
			</GridItem>
			<GridItem xs={landscape ? 6 : 12} md={6} lg={6} style={{ display: inDropDown ? 'none' : 'block' }}>
				{CBX.canHaveRepresentative(participant)
					&& <div style={{ display: 'flex', alignItems: 'center' }}>

						{!(participant.delegatedVotes.length > 0) && (
							<FilterButton
								tooltip={translate.add_representative}
								loading={loading === 4}
								size="2.8em"
								onClick={() => setAddRepresentative(true)}
							>
								<StateIcon
									translate={translate}
									state={PARTICIPANT_STATES.REPRESENTATED}
									color={secondary}
									hideTooltip={true}
								/>
							</FilterButton>
						)}
						<span style={{ fontSize: '0.9em' }}>{translate.add_representative}</span>
					</div>
				}
				{CBX.canDelegateVotes(council.statute, participant) && (
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<FilterButton
							tooltip={translate.to_delegate_vote}
							loading={loading === 5}
							size="2.8em"
							onClick={() => setDelegateOwnVote(true)}
							active={
								participant.state
								=== PARTICIPANT_STATES.DELEGATED
							}
						>
							<StateIcon
								translate={translate}
								state={PARTICIPANT_STATES.DELEGATED}
								color={secondary}
								hideTooltip={true}
							/>
						</FilterButton>
						<span style={{ fontSize: '0.9em' }}>{translate.to_delegate_vote}</span>
					</div>
				)}
				{CBX.canAddDelegateVotes(council.statute, participant) && (
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<FilterButton
							tooltip={translate.add_delegated}
							loading={loading === 6}
							size="2.8em"
							onClick={() => setDelegateVote(true)}
							active={
								participant.state
								=== PARTICIPANT_STATES.DELEGATED
							}
						>
							<FontAwesome
								name={'user'}
								style={{
									position: 'absolute',
									color: secondary,
									fontSize: '1.5em'
								}}
							/>
							<FontAwesome
								name={'mail-reply'}
								style={{
									position: 'absolute',
									color: primary,
									right: '0.7em',
									fontSize: '0.8em'
								}}
							/>
						</FilterButton>
						<span style={{ fontSize: '0.9em' }}>{translate.add_delegated}</span>
					</div>
				)}

				<AddRepresentativeModal
					show={addRepresentative}
					council={council}
					participant={participant}
					refetch={props.refetch}
					requestClose={() => setAddRepresentative(false)}
					translate={translate}
				/>
				{delegateOwnVote
					&& <DelegateOwnVoteModal
						show={delegateOwnVote}
						council={council}
						participant={participant}
						refetch={props.refetch}
						requestClose={() => setDelegateOwnVote(false)}
						translate={translate}
					/>
				}

				{(participant.state === PARTICIPANT_STATES.REMOTE
					|| participant.state === PARTICIPANT_STATES.NO_PARTICIPATE
					|| participant.state
					=== PARTICIPANT_STATES.PHYSICALLY_PRESENT
					|| participant.state
					=== PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE) && delegateVote && (
					<DelegateVoteModal
						show={delegateVote}
						council={council}
						participant={participant}
						refetch={props.refetch}
						requestClose={() => setDelegateVote(false)}
						translate={translate}
					/>
				)}
			</GridItem>
		</Grid>
	);
};


export default graphql(changeParticipantState, {
	name: 'changeParticipantState'
})(withApollo(ParticipantStateSelector));
