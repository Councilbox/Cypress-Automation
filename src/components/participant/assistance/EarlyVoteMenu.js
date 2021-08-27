import React from 'react';
import { withApollo } from 'react-apollo';
import { VotingButton } from '../agendas/VotingMenu';
import { VOTE_VALUES, AGENDA_TYPES, PARTICIPANT_TYPE } from '../../../constants';
import { getPrimary } from '../../../styles/colors';
import { isConfirmationRequest, isCustomPoint } from '../../../utils/CBX';
import { LoadingSection } from '../../../displayComponents';
import { useCouncilAgendas } from '../../../hooks';

const EarlyVoteMenu = ({
	selected, setSelected, state, setState, translate, client, council, participant
}) => {
	const { data, loading } = useCouncilAgendas({
		councilId: council.id,
		participantId: participant.id,
		client
	});

	React.useEffect(() => {
		if (!loading) {
			if (data.proxyVotes) {
				data.proxyVotes.forEach(vote => {
					const { __typename, id, ...rest } = vote;

					if (vote.value > 10) {
						selected.set(`${vote.agendaId}_${vote.value}_${vote.participantId}`, rest);
					} else {
						selected.set(`${vote.agendaId}_${vote.participantId}`, rest);
					}
				});
				setSelected(new Map(selected));
				setState({
					...state,
					earlyVotes: Array.from(selected.values())
				});
			}
		}
	}, [loading, data]);

	const isActive = (agendaId, value) => {
		const point = selected.get(agendaId);

		if (!point) {
			return false;
		}

		return point.value === value;
	};

	const cleanCustomPointSelections = (selectionsMap, point, participantInfo) => {
		const newMap = new Map(selectionsMap);
		point.items.forEach(item => {
			newMap.delete(`${point.id}_${item.id}_${participantInfo.id}`);
		});

		return newMap;
	};

	const earlyVoteMenu = participantInfo => (
		data.agendas.filter(point => point.subjectType !== AGENDA_TYPES.INFORMATIVE).map(point => {
			if (isConfirmationRequest(point.subjectType)) {
				return (
					<div key={`point_${point.id}`}>
						<div style={{ fontWeight: '700', marginTop: '1em' }}>{point.agendaSubject}</div>
						<div>
							{[{
								value: VOTE_VALUES.POSITIVE,
								label: translate.accept,
								icon: 'fa fa-check'
							}, {
								value: VOTE_VALUES.NEGATIVE,
								label: translate.refuse,
								icon: 'fa fa-times'
							}].map(vote => {
								const active = isActive(`${point.id}_${participantInfo.id}`, vote.value);
								return (
									<div
										key={`vote_${vote.value}`}
										style={{
											marginRight: '0.2em',
											borderRadius: '3px',
											display: 'flex',
											cursor: 'pointer',
											alignItems: 'center',
											justifyContent: 'center'
										}}
										onClick={() => {
											setSelected(new Map(selected.set(`${point.id}_${participantInfo.id}`, {
												value: vote.value,
												agendaId: point.id,
												participantId: participantInfo.id
											})));
											// setEarlyVote(point.id, vote)
										}}
									>
										<VotingButton
											text={vote.label}
											selected={active}
											icon={<i className={vote.icon} aria-hidden="true" style={{ marginLeft: '0.2em', color: active ? getPrimary() : 'silver' }}></i>}
										/>
									</div>
								);
							})}
						</div>
					</div>
				);
			}

			if (!isCustomPoint(point.subjectType)) {
				return (
					<div key={`point_${point.id}`}>
						<div style={{ fontWeight: '700', marginTop: '1em' }}>{point.agendaSubject}</div>
						<div>
							{[{
								value: VOTE_VALUES.POSITIVE,
								label: translate.in_favor_btn,
								icon: 'fa fa-check'
							}, {
								value: VOTE_VALUES.NEGATIVE,
								label: translate.against_btn,
								icon: 'fa fa-times'
							}, {
								value: VOTE_VALUES.ABSTENTION,
								label: translate.abstention_btn,
								icon: 'fa fa-circle-o'
							}].map(vote => {
								const active = isActive(`${point.id}_${participantInfo.id}`, vote.value);
								return (
									<div
										key={`vote_${vote.value}`}
										style={{
											marginRight: '0.2em',
											borderRadius: '3px',
											display: 'flex',
											cursor: 'pointer',
											alignItems: 'center',
											justifyContent: 'center'
										}}
										onClick={() => {
											setSelected(new Map(selected.set(`${point.id}_${participantInfo.id}`, {
												value: vote.value,
												agendaId: point.id,
												participantId: participantInfo.id
											})));
											// setEarlyVote(point.id, vote)
										}}
									>
										<VotingButton
											text={vote.label}
											selected={active}
											icon={<i className={vote.icon} aria-hidden="true" style={{ marginLeft: '0.2em', color: active ? getPrimary() : 'silver' }}></i>}
										/>
									</div>
								);
							})}
						</div>
					</div>
				);
			}

			let selections = point.items.reduce((acc, curr) => {
				const key = `${point.id}_${curr.id}_${participantInfo.id}`;
				if (isActive(key, curr.id)) {
					acc += 1;
					return acc;
				}
				return acc;
			}, 0);

			const abstentionKey = `${point.id}_abstention_${participantInfo.id}`;

			if (selected.get(abstentionKey)) {
				selections += 1;
			}

			const disabled = selections >= point.options.maxSelections;
			return (
				<div key={`point_${point.id}`} style={{ marginTop: '1.3em' }}>
					<div style={{ fontWeight: '700', marginTop: '1em' }}>{point.agendaSubject}</div>
					<div>
						{point.items.map(item => {
							const key = `${point.id}_${item.id}_${participantInfo.id}`;
							const active = isActive(key, item.id);
							return (
								<VotingButton
									key={key}
									disabled={disabled && !active}
									disabledColor={disabled && !active}
									styleButton={{ padding: '0', width: '100%' }}
									selectedCheckbox={active}
									onClick={() => {
										if (active) {
											selected.delete(key);
											setSelected(new Map(selected));
										} else {
											selected.delete(abstentionKey);
											setSelected(new Map(selected.set(key, {
												value: item.id,
												agendaId: point.id,
												participantId: participantInfo.id
											})));
										}
									}}
									text={item.value}
								/>
							);
						})}
						<VotingButton
							disabled={disabled && !selected.get(abstentionKey)}
							disabledColor={disabled && !selected.get(abstentionKey)}
							styleButton={{ padding: '0', width: '100%' }}
							selectedCheckbox={!!selected.get(abstentionKey)}
							onClick={() => {
								if (selected.get(abstentionKey)) {
									selected.delete(abstentionKey);
									setSelected(new Map(selected));
								} else {
									const newMap = cleanCustomPointSelections(selected, point, participantInfo);
									newMap.set(abstentionKey, {
										value: -1,
										agendaId: point.id,
										participantId: participantInfo.id
									});
									setSelected(newMap);
								}
							}}
							text={translate.abstention_btn}
						/>
					</div>
				</div>
			);
		})
	);

	if (loading) {
		return <LoadingSection />;
	}


	return (
		participant.type === PARTICIPANT_TYPE.REPRESENTATIVE ?
			participant.represented.map(item => (
				<>
					<div>
						{`${item.name} ${item.surname}`}
					</div>
					{earlyVoteMenu(item)}
				</>
			))
			: earlyVoteMenu(participant)
	);
};

export default withApollo(EarlyVoteMenu);
