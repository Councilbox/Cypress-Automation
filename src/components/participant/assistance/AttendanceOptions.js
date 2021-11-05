import React from 'react';
import { getPrimary } from '../../../styles/colors';
import { PARTICIPANT_TYPE, PARTICIPANT_STATES } from '../../../constants';
import AssistanceOption from './AssistanceOption';
import DelegationItem from './DelegationItem';
import { canDelegateVotes } from '../../../utils/CBX';
import AddRepresentativeModal from '../../council/live/AddRepresentativeModal';
import NoAttendDelegationWarning from '../delegations/NoAttendDelegationWarning';
import EarlyVoteOption from './EarlyVoteOption';
import FixDelegationVoteButton from './FixDelegationVoteButton';
import { ConfigContext } from '../../../containers/AppControl';
import { isMobile } from '../../../utils/screen';

const AttendanceOptions = ({
	translate, state, setState, council, participant, showDelegationModal, refetch
}) => {
	const primary = getPrimary();
	const config = React.useContext(ConfigContext);

	const canDelegate = canDelegateVotes(council.statute, participant);

	const showAddRepresentative = () => {
		setState({
			...state,
			addRepresentative: true
		});
	};

	const closeAddRepresentative = () => {
		setState({
			...state,
			addRepresentative: false
		});
	};

	const hasOwnVote = () => (
		((participant.numParticipations > 0)
		|| participant.represented.filter(p => (p.numParticipations > 0)).length > 0)
	);

	const checkDelegationConditions = () => config.attendanceDelegationOption && council.statute.existsDelegatedVote === 1 && hasOwnVote();

	if (council.councilType === 4) {
		return (
			<>
				<div style={{ width: '100%', marginBottom: '1em' }}>
					<div style={{
						color: primary, fontSize: '15px', fontWeight: '700', marginBottom: '0.6em',
					}}>
						{translate.wizard_options}
					</div>
				</div>
				<AssistanceOption
					translate={translate}
					title={translate.vote_letter}
					value={PARTICIPANT_STATES.SENT_VOTE_LETTER}
					selected={state.assistanceIntention}
					select={() => {
						setState({
							...state,
							assistanceIntention: PARTICIPANT_STATES.SENT_VOTE_LETTER,
							locked: false,
							delegateId: null
						});
					}}
				/>
				{checkDelegationConditions()
					&& <AssistanceOption
						translate={translate}
						title={translate.want_to_delegate_in}
						select={showDelegationModal}
						disabled={!canDelegate}
						value={PARTICIPANT_STATES.DELEGATED}
						selected={state.assistanceIntention}
						delegationItem={
							state.delegateInfoUser && state.assistanceIntention === 4 ?
								<div style={{ display: 'flex', alignItems: 'center' }}>
									<DelegationItem participant={state.delegateInfoUser} />
									<i className="fa fa-trash-o"
										style={{
											marginLeft: '1em',
											fontSize: '25px',
											color: '#dc7373',
											cursor: 'pointer'
										}}
										onClick={() => setState({
											...state,
											assistanceIntention: PARTICIPANT_STATES.REMOTE,
											locked: false,
											delegateId: null
										})
										}
									></i>
								</div>
								: ''
						}
					/>
				}
			</>
		);
	}

	return (
		<>
			<div style={{ width: '100%', marginBottom: '1em' }}>
				<div style={{
					color: primary, fontSize: '15px', fontWeight: '700', marginBottom: '0.6em',
				}}>
					{translate.indicate_status}
				</div>
			</div>
			{participant.personOrEntity === 0 ?
				<React.Fragment>
					{((council.councilType === 0 || council.councilType === 1) && config.attendanceRemoteOption)
						&& <AssistanceOption
							title={translate.attend_remotely_through_cbx}
							translate={translate}
							select={() => {
								setState({
									...state,
									assistanceIntention: PARTICIPANT_STATES.REMOTE,
									locked: false,
									delegateId: null
								});
							}}
							value={PARTICIPANT_STATES.REMOTE}
							selected={state.assistanceIntention}
						/>
					}
					{(council.remoteCelebration !== 1 && config.attendancePresentOption)
						&& <AssistanceOption
							title={translate.attending_in_person}
							translate={translate}
							select={() => {
								setState({
									...state,
									assistanceIntention: PARTICIPANT_STATES.PHYSICALLY_PRESENT,
									locked: false,
									delegateId: null
								});
							}}
							value={PARTICIPANT_STATES.PHYSICALLY_PRESENT}
							selected={state.assistanceIntention}

						/>
					}
					{config.attendanceNoParticipateOption
						&& <AssistanceOption
							translate={translate}
							title={translate.not_attending}
							select={() => {
								setState({
									...state,
									assistanceIntention: PARTICIPANT_STATES.NO_PARTICIPATE,
									locked: false,
									noAttendWarning: !!((participant.type !== PARTICIPANT_TYPE.REPRESENTATIVE
										&& participant.delegatedVotes.length > 0)
										|| participant.delegatedVotes.length > 1),
									delegateId: null
								});
							}}
							value={PARTICIPANT_STATES.NO_PARTICIPATE}
							selected={state.assistanceIntention}
						/>
					}
				</React.Fragment>
				: <React.Fragment>
					<div onClick={showAddRepresentative}>
						<AssistanceOption
							translate={translate}
							title={participant.representative ? translate.change_representative : translate.add_representative}
							value={PARTICIPANT_STATES.REPRESENTATED}
							selected={state.assistanceIntention !== 4 ? participant.state : null}
							delegationItem={
								participant.representative && state.assistanceIntention !== 4 ?
									<div style={{ display: 'flex', alignItems: 'center' }}>
										<DelegationItem participant={participant.representative} />
										<i className="fa fa-trash-o"
											style={{
												marginLeft: '1em',
												fontSize: '25px',
												color: '#dc7373',
												cursor: 'pointer'
											}}
											onClick={() => setState({
												...state,
												assistanceIntention: PARTICIPANT_STATES.REMOTE,
												locked: false,
												delegateId: null
											})
											}
										></i>
									</div>
									: ''
							}
						/>
					</div>
					{state.addRepresentative
						&& <AddRepresentativeModal
							show={state.addRepresentative}
							council={council}
							participant={participant}
							refetch={refetch}
							requestClose={closeAddRepresentative}
							translate={translate}
						/>
					}
				</React.Fragment>
			}
			{state.noAttendWarning
				&& <NoAttendDelegationWarning
					translate={translate}
					representative={participant.type === PARTICIPANT_TYPE.REPRESENTATIVE}
					requestClose={() => setState({ ...state, noAttendWarning: false })}
				/>
			}
			{(council.statute.canEarlyVote === 1 && hasOwnVote())
				&& <>
					<EarlyVoteOption
						translate={translate}
						state={state}
						council={council}
						participant={participant}
						setState={setState}
					/>

				</>
			}
			{checkDelegationConditions()
				&& <AssistanceOption
					translate={translate}
					title={council.companyId === 286 ?
						'Quiero delegar en el Presidente de AECOC o, en su ausencia, en el Vicepresidente'
						: translate.want_to_delegate_in
					}
					select={showDelegationModal}
					disabled={!canDelegate}
					value={PARTICIPANT_STATES.DELEGATED}
					selected={state.assistanceIntention}
					delegationItem={
						state.delegateInfoUser && state.assistanceIntention === 4 ?
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<DelegationItem participant={state.delegateInfoUser} />
								<i className="fa fa-trash-o"
									style={{
										marginLeft: isMobile ? '.5em' : '1em',
										fontSize: '25px',
										color: '#dc7373',
										cursor: 'pointer'
									}}
									onClick={() => setState({
										...state,
										assistanceIntention: PARTICIPANT_STATES.REMOTE,
										locked: false,
										delegateId: null
									})
									}
								></i>
								{council.statute.canSenseVoteDelegate === 1
									&& <FixDelegationVoteButton
										translate={translate}
										state={state}
										council={council}
										participant={participant}
										setState={setState}
									/>
								}
							</div>
							: ''
					}
				/>
			}
		</>
	);
};

export default AttendanceOptions;
