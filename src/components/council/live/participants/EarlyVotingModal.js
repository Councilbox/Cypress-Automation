import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { BasicButton, AlertConfirm, LoadingSection } from '../../../../displayComponents';
import { getSecondary, getPrimary } from '../../../../styles/colors';
import { ConfigContext } from '../../../../containers/AppControl';
import { AGENDA_STATES, AGENDA_TYPES, VOTE_VALUES } from '../../../../constants';
import { VotingButton } from '../../../participant/agendas/VotingMenu';
import { isConfirmationRequest, isCustomPoint, showAbstentionButton } from '../../../../utils/CBX';


const EarlyVotingModal = props => {
	const [modal, setModal] = React.useState(false);
	const config = React.useContext(ConfigContext);

	if (!config.earlyVoting) {
		return null;
	}

	return (
		<>
			<BasicButton
				color="white"
				text={props.translate.anticipate_vote}
				type="flat"
				id="participant-early-voting-button"
				buttonStyle={{
					border: `1px solid ${getSecondary()}`,
					marginTop: '0.3em',
					...props.buttonStyle,
				}}
				onClick={() => setModal(!modal)}
				textStyle={{
					color: getSecondary(),
					...props.textStyle
				}}
			/>
			<AlertConfirm
				open={modal}
				requestClose={() => setModal(false)}
				title={props.translate.set_direction_of_vote}
				bodyText={<EarlyVotingBody {...props} />}
			/>
		</>
	);
};

const EarlyVotingBody = withApollo(({
	council, participant, translate, client
}) => {
	const [data, setData] = React.useState(null);
	const [loading, setLoading] = React.useState(true);
	const config = React.useContext(ConfigContext);

	const getData = async () => {
		const response = await client.query({
			query: gql`
				query agendas($councilId: Int!, $participantId: Int!){
					agendas(councilId: $councilId){
						id
						agendaSubject
						subjectType
						votingState
						items {
							id
							value
						}
						options {
							id
							maxSelections
							minSelections
						}
					}
					proxyVotes(participantId: $participantId){
						value
						agendaId
						id
					}
				}
			`,
			variables: {
				councilId: council.id,
				participantId: participant.id
			}
		});

		setData(response.data);
		setLoading(false);
	};

	const getProxyVote = (agendaId, value, custom) => {
		const vote = data.proxyVotes.find(proxy => {
			if (!custom) {
				return proxy.agendaId === agendaId;
			}
			return proxy.agendaId === agendaId && value === proxy.value;
		});

		if (!vote) {
			return false;
		}

		return vote;
	};

	const getProxyVotes = agendaId => {
		return data.proxyVotes.filter(proxy => proxy.agendaId === agendaId);
	};

	const deleteProxyVote = async (agendaId, participantId) => {
		await client.mutate({
			mutation: gql`
				mutation DeleteProxyVote( $agendaId: Int!, $participantId: Int!){
					deleteProxyVote(agendaId: $agendaId, participantId: $participantId){
						success
					}
				}
			`,
			variables: {
				agendaId,
				participantId
			}
		});

		getData();
	};

	const setVotingRightDenied = async agendaId => {
		await client.mutate({
			mutation: gql`
				mutation SetVotingRightDenied($participantId: Int!, $agendaId: Int!){
					setVotingRightDenied(participantId: $participantId, agendaId: $agendaId){
						id
					}
				}
			`,
			variables: {
				participantId: participant.id,
				agendaId
			}
		});
		getData();
	};

	const setEarlyVote = async (agendaId, value) => {
		await client.mutate({
			mutation: gql`
				mutation SetEarlyVote($participantId: Int!, $agendaId: Int!, $value: Int!){
					setProxyVote(participantId: $participantId, agendaId: $agendaId, value: $value){
						id
					}
				}
			`,
			variables: {
				participantId: participant.id,
				agendaId,
				value
			}
		});
		getData();
	};

	React.useEffect(() => {
		getData();
	}, [council.id]);

	const renderPointTitle = (point, index) => (
		<div style={{ display: 'flex', alignItems: 'center' }}>
			<div style={{ fontWeight: '700', marginTop: '1em' }}>{point.agendaSubject}</div>
			{!!getProxyVote(point.id)
				&& <div style={{ marginLeft: '10px', marginTop: '10px' }}>
					<BasicButton
						color="white"
						id={`early-voting-delete-${index}`}
						text={translate.delete}
						backgroundColor={{
							border: `1px solid ${getSecondary()}`,
							borderRadius: '4px',
							marginTotop: '0.3em',
							color: getSecondary(),
							backgroundColor: 'white',
							outline: '0px',
						}}
						onClick={() => deleteProxyVote(point.id, participant.id)}
					/>
				</div>
			}
		</div>
	);


	return (
		<>
			{loading ?
				<LoadingSection />
				: data.agendas.filter(point => point.subjectType !== AGENDA_TYPES.INFORMATIVE).map((point, index) => {
					const disabled = point.votingState !== AGENDA_STATES.INITIAL;

					if (isConfirmationRequest(point.subjectType)) {
						return (
							<div key={`point_${point.id}`}>
								{renderPointTitle(point, index)}
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
										const proxyVote = getProxyVote(point.id, vote.value);
										const active = vote.value === proxyVote.value;
										return (
											<div
												key={`vote_${vote.value}`}
												id={`early-vote-option-${vote.value}-point-${index}`}
												style={{
													marginRight: '0.2em',
													borderRadius: '3px',
													display: 'flex',
													cursor: 'pointer',
													alignItems: 'center',
													justifyContent: 'center'
												}}
												onClick={() => {
													setEarlyVote(point.id, vote.value);
												}}
											>
												<VotingButton
													text={vote.label}
													selected={active}
													disabledColor={disabled ? 'grey' : null}
													disabled={disabled}
													icon={<i className={vote.icon} aria-hidden="true" style={{ marginLeft: '0.2em', color: active ? getPrimary() : 'silver' }}></i>}
												/>
											</div>
										);
									})}
									<VotingButton
										text={translate.cant_vote_this_point}
										id={`early-vote-cant-vote-point-${index}`}
										selected={getProxyVote(point.id, null) ? getProxyVote(point.id, null).value === null : false}
										disabledColor={disabled ? 'grey' : null}
										disabled={disabled}
										onClick={() => setVotingRightDenied(point.id)}
									/>
								</div>
							</div>
						);
					}

					if (!isCustomPoint(point.subjectType)) {
						const options = [{
							value: VOTE_VALUES.POSITIVE,
							label: translate.in_favor_btn,
							icon: 'fa fa-check'
						}, {
							value: VOTE_VALUES.NEGATIVE,
							label: translate.against_btn,
							icon: 'fa fa-times'
						}];

						if (showAbstentionButton({ config, statute: council.statute })) {
							options.push({
								value: VOTE_VALUES.ABSTENTION,
								label: translate.abstention_btn,
								icon: 'fa fa-circle-o'
							});
						}

						return (
							<div key={`point_${point.id}`}>
								{renderPointTitle(point, index)}
								<div>
									{options.map(vote => {
										const proxyVote = getProxyVote(point.id, vote.value);
										const active = vote.value === proxyVote.value;
										return (
											<div
												key={`vote_${vote.value}`}
												id={`early-vote-option-${vote.value}-point-${index}`}
												style={{
													marginRight: '0.2em',
													borderRadius: '3px',
													display: 'flex',
													cursor: 'pointer',
													alignItems: 'center',
													justifyContent: 'center'
												}}
												onClick={() => {
													setEarlyVote(point.id, vote.value);
												}}
											>
												<VotingButton
													text={vote.label}
													selected={active}
													disabledColor={disabled ? 'grey' : null}
													disabled={disabled}
													icon={<i className={vote.icon} aria-hidden="true" style={{ marginLeft: '0.2em', color: active ? getPrimary() : 'silver' }}></i>}
												/>
											</div>
										);
									})}
									<VotingButton
										text={translate.cant_vote_this_point}
										id={`early-vote-cant-vote-point-${index}`}
										selected={getProxyVote(point.id, null) ? getProxyVote(point.id, null).value === null : false}
										disabledColor={disabled ? 'grey' : null}
										disabled={disabled}
										onClick={() => setVotingRightDenied(point.id)}
									/>
								</div>
							</div>
						);
					}

					const selections = getProxyVotes(point.id).length;
					const getRemainingOptions = () => {
						if (((point.options.minSelections - selections) < 0)) {
							return point.options.minSelections;
						}
						return point.options.minSelections - selections;
					};

					const disableCustom = (selections >= point.options.maxSelections
						|| (selections[0] && selections[0].value === -1)) || disabled;

					return (
						<div key={`point_${point.id}`} style={{ marginTop: '1.3em' }}>
							{renderPointTitle(point, index)}
							{(point.options.maxSelections > 1)
								&& < div > {
									translate.can_select_between_min_max
										.replace('{{min}}', point.options.minSelections)
										.replace('{{max}}', point.options.maxSelections)
								}
								</div>
							}
							<div>
								{(selections < point.options.minSelections && point.options.minSelections > 1)
									&& <React.Fragment>{translate.need_select_more.replace('{{options}}', getRemainingOptions())}</React.Fragment>
								}
							</div>
							<div>
								{point.items.map((item, itemIndex) => {
									const proxyVote = getProxyVote(point.id, item.id, true);
									const active = proxyVote.value === item.id;
									return (
										<VotingButton
											key={`voting_${item.id}`}
											disabled={disableCustom && !active}
											disabledColor={disableCustom && !active}
											id={`early-vote-option-${itemIndex}-point-${index}`}

											styleButton={{ padding: '0', width: '100%' }}
											selectedCheckbox={active}
											onClick={() => {
												if (!active) {
													setEarlyVote(point.id, item.id);
												}
											}}
											text={item.value}
										/>
									);
								})}
								{showAbstentionButton({ config, statute: council.statute }) && (
									<VotingButton
										text={translate.abstention_btn}
										id={`early-vote-option-abstention-point-${index}`}
										disabled={disableCustom && getProxyVote(point.id, -1, true).value !== -1}
										disabledColor={disableCustom && getProxyVote(point.id, -1, true).value !== -1}
										selected={getProxyVote(point.id, -1) ? getProxyVote(point.id, -1, true).value === -1 : false}
										onClick={() => {
											if (getProxyVote(point.id, -1, true).value !== -1) {
												setEarlyVote(point.id, -1);
											}
										}}
									/>
								)}
								<VotingButton
									text={translate.cant_vote_this_point}
									id={`early-vote-cant-vote-point-${index}`}
									selected={getProxyVote(point.id, null) ? getProxyVote(point.id, null).value === null : false}
									disabledColor={disabled ? 'grey' : null}
									disabled={disabled}
									onClick={() => setVotingRightDenied(point.id)}
								/>
							</div>
						</div>
					);
				})
			}
		</>
	);
});

export default EarlyVotingModal;
