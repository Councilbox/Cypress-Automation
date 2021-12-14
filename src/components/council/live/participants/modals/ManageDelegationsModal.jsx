import { withApollo } from 'react-apollo';
import React from 'react';
import gql from 'graphql-tag';
import {
	AlertConfirm, TextInput, Icon, BasicButton,
	PaginationFooter, Scrollbar
} from '../../../../../displayComponents';
import participantIcon from '../../../../../assets/img/participant-icon.png';
import arrowDown from '../../../../../assets/img/arrow-down.svg';
import CheckBox from '../../../../../displayComponents/CheckBox';
import { secondary } from '../../../../../styles/colors';
import { isMobile } from '../../../../../utils/screen';
import RemoveDelegationButton from '../RemoveDelegationButton';
import DelegateOwnVoteModal from '../../DelegateOwnVoteModal';
import { useHandleParticipantDelegations } from '../../../../../hooks/liveParticipant';


const LIMIT = 10;

const ManageDelegationsModal = ({
	translate, participant, client, council, refetch
}) => {
	const [showDelegationModal, setShowDelegationsModal] = React.useState(false);
	const [data, setData] = React.useState(null);
	const [page, setPage] = React.useState(1);
	const [warningModal, setWarningModal] = React.useState(false);	
	const [changeDelegationModal, setChangeDelegationModal] = React.useState(false);
	const [loading, setLoading] = React.useState(true);
	const [selectedIds, setSelectedIds] = React.useState(new Set());
	const [filterText, setFilterText] = React.useState('');
	const [multiDelegationsModal, setMultiDelegationsModal] = React.useState(false);
	const {
		loading: loadingRemoveDelegations,
		removeDelegations,
		addDelegations
	} = useHandleParticipantDelegations({ client });

	const getData = React.useCallback(async options => {
		if (!data) {
			setLoading(true);
		}
		const response = await client.query({
			query: gql`
				query ParticipantDelegatedVotes(
					$participantId: Int!
					$filters: [FilterInput]
					$options: OptionsInput
				) {
					participantDelegatedVotes(
						participantId: $participantId
						filters: $filters
						options: $options
					) {
						list {
							id
							name
							surname
							numParticipations
							email
							state
						}
						total
					}
				}
			`,
			variables: {
				participantId: participant.id,
				...(filterText ? {
					filters: [{
						field: 'fullName',
						text: filterText
					}]
				} : {}),
				options: {
					limit: LIMIT,
					offset: (page - 1) * LIMIT
				},
				...options
			}
		});

		setData(response.data.participantDelegatedVotes);
		if (loading) {
			setLoading(false);
		}
	}, [participant.id, filterText, page, client]);

	React.useEffect(() => {
		let timeout;
		if (showDelegationModal) {
			timeout = setTimeout(getData, 450);
		}
		return () => clearTimeout(timeout);
	}, [getData, showDelegationModal]);

	const delegatedVotes = participant.delegatedVotes.filter(d => d.state !== 2);

	const renderWarningModalBody = () => translate.remove_selected_delegations_warning.replace('{{participant}}', `${participant.name} ${participant.surname}`);

	const renderBody = () => (
		<div
			style={{
				display: 'flex', flexDirection: 'column', height: '100%'
			}}
		>
			<div style={{ display: 'flex', flexDirection: 'row' }}>
				<div>
					<img src={participantIcon} />
				</div>
				<p style={{ fontSize: isMobile ? '17px' : '18px', paddingLeft: '1rem' }}>
					{delegatedVotes.length === 1 ?
						`${translate.delegated_vote_from.capitalize()}: ${delegatedVotes[0]?.name} ${delegatedVotes[0]?.surname}`
						:
						`${translate.vote_delegated_from_and_more.replace('{{name}}', `${delegatedVotes[0]?.name} ${delegatedVotes[0]?.surname}`).replace('{{number}}', delegatedVotes.length - 1)}`
					}
				</p>
			</div>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					paddingBottom: '1rem'
				}}>
				<div
					style={{
						paddingLeft: '0.5rem',
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center'
					}}>
					<div style={{ marginRight: '2px' }}>
						<img src={arrowDown}/>
					</div>
					<CheckBox
						value={selectedIds.size === data?.list?.length}
						onChange={() => {
							if (selectedIds.size === data?.list?.length) {
								setSelectedIds(new Set());
							} else {
								setSelectedIds(new Set(data?.list?.map(d => d.id)));
							}
						}}
					/>
					{selectedIds.size > 0 && (
						<>
							<AlertConfirm
								open={warningModal}
								acceptAction={async () => {
									await removeDelegations(Array.from(selectedIds));
									getData();
									refetch();
								}}
								buttonAccept={translate.accept}
								buttonCancel={translate.cancel}
								loadingAction={loading}
								requestClose={() => setWarningModal(false)}
								title={translate.warning}
								bodyText={renderWarningModalBody()}
							/>
							<div style={{paddingRight: '.5rem'}}>
								<BasicButton
									text={translate.remove_delegations}
									color={'white'}
									onClick={() => setWarningModal(true)}
									textPosition="after"
									buttonStyle={{ border: `1px solid ${secondary}` }}
									textStyle={{
										color: secondary,
										fontWeight: '400',
										fontSize: isMobile ? '12px' : '14px',
										textTransform: 'none'
									}}
								/>
							</div>
							<BasicButton
								text={translate.reassign_votes}
								color={'white'}
								onClick={() => {
									setMultiDelegationsModal(true);
								}}
								textPosition="after"
								textStyle={{
									color: '#595959',
									fontWeight: '400',
									fontSize: isMobile ? '12px' : '14px',
									textTransform: 'none'
								}}
							/>
						</>
					)}
				</div>
				<div style={{ width: isMobile ? '%' : '20%' }}>
					<TextInput
						placeholder={translate.search_participant}
						adornment={<Icon>search</Icon>}
						value={filterText}
						onChange={e => setFilterText(e.target.value)}
					/>
				</div>
			</div>
			{multiDelegationsModal && 
				<DelegateOwnVoteModal
					show={multiDelegationsModal}
					council={council}
					addRepresentative={async id => {
						await addDelegations(Array.from(selectedIds), id);
						getData();
						refetch();
						setMultiDelegationsModal(false);
					}}
					participant={{
						id: Array.from(selectedIds)[0]
					}}
					refetch={() => {
						getData();
						refetch();
					}}
					requestClose={() => {
						setMultiDelegationsModal(false);
					}}
					translate={translate}
				/>
			}
			<DelegateOwnVoteModal
				show={changeDelegationModal}
				council={council}
				participant={changeDelegationModal}
				refetch={() => {
					getData();
					refetch();
				}}
				requestClose={() => {
					setChangeDelegationModal(false);
				}}
				translate={translate}
			/>
			<div style={{ height: 'calc( 100% - 5em )', width: '100%' }}>
				<Scrollbar>
					<div style={{ width: '95%' }}>
						{data?.list?.map(d => (
							<div
								key={d.id}
								style={{
									display: 'flex',
									flexDirection: isMobile ? 'column' : 'row',
									alignItems: 'center',
									justifyContent: 'space-between',
									border: '1px solid #61ABB7',
									padding: '1rem',
									margin: '5px',
									borderRadius: '4px',
									boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
									marginRight: isMobile ? '0' : '1.5rem',
								}}
							>
								<div style={{
									display: 'flex', flexDirection: 'row', alignItems: 'center', paddingBottom: isMobile ? '1rem' : '0'
								}}>
									<CheckBox
										onChange={() => {
											if (selectedIds.has(d.id)) {
												selectedIds.delete(d.id);
											 	setSelectedIds(new Set(selectedIds));
											} else {
												selectedIds.add(d.id);
												setSelectedIds(new Set(selectedIds));
											}
										}}
										value={selectedIds.has(d.id)}

									/>
									<p style={{
										marginBottom: '0',
										overflow: 'hidden',
										width: isMobile ? '250px' : null,
										whiteSpace: 'nowrap',
										textOverflow: 'ellipsis',
										flexShrink: 1
									}}>
										{`${translate.delegated_vote_from}: ${d.name} ${d.surname}`}
									</p>
								</div>
								<div style={{ display: 'flex', flexDirection: 'row' }}>
									<div style={{paddingRight: '1rem'}}>
										<RemoveDelegationButton
											delegatedVote={d}
											participant={participant}
											translate={translate}
											refetch={() => {
												getData();
												refetch();
											}}
											raised={true}
										/>
									</div>
									<BasicButton
										text={translate.reassign_vote}
										color={'white'}
										onClick={() => {
											setChangeDelegationModal(d);
										}}
										textPosition="after"
										textStyle={{
											color: '#595959',
											fontWeight: '400',
											fontSize: isMobile ? '12px' : '14px',
											textTransform: 'none'
										}}
									/>
								</div>
							</div>))
						}
					</div>
					<div style={{ margin: '1rem', width: '90%', display: 'flex', justifyContent: 'space-between' }}>
						<PaginationFooter
							page={page}
							translate={translate}
							length={data?.list?.length}
							limit={LIMIT}
							total={data?.total}
							changePage={page => {
								setPage(page);
							}}
						/>
					</div>
				</Scrollbar>
			</div>
		</div>
	);
	return (
		<div onClick={event => event.stopPropagation()}>
			<AlertConfirm
				requestClose={event => {
					event.stopPropagation();
					event.preventDefault();
					setSelectedIds(new Set());
					setShowDelegationsModal(false);
				}}
				open={showDelegationModal}
				bodyStyle={{
					minWidth: isMobile ? '98vw' : '60vw', maxWidth: isMobile ? '98vw' : '60vw', height: '100%', margin: '0 auto'
				}}
				buttonCancel={translate.close}
				title={`${participant.name} ${participant.surname}`}
				bodyText={renderBody()}
				widthModal={{ height: '100%', maxHeight: '650px' }}
			/>
			<BasicButton
				text={`${translate.delegations} (${delegatedVotes?.length})`}
				buttonStyle={{ border: `1px solid ${secondary}`, width: '100%' }}
				type="flat"
				textStyle={{ color: secondary, fontWeight: '700' }}
				color={'white'}
				onClick={event => {
					event.stopPropagation();
					event.preventDefault();
					setShowDelegationsModal(true);
				}}
			/>
		</div>

	);
};

export default withApollo(ManageDelegationsModal);
