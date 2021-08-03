import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { Card } from 'material-ui';
import DelegationsRestrictionModal from './DelegationsRestrictionModal';
import {
	AlertConfirm, BasicButton, SectionTitle, ButtonIcon
} from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';
import { isMobile } from '../../../utils/screen';


const councilDelegates = gql`
	query CouncilDelegates($councilId: Int!){
		councilDelegates(councilId: $councilId){
			participant {
				id
				name
				surname
			}
		}
	}
`;

const addCouncilDelegateMutation = gql`
	mutation AddCouncilDelegate($councilId: Int!, $participantId: Int!){
		addCouncilDelegate(councilId: $councilId, participantId: $participantId){
			success
		}
	}
`;

const removeCouncilDelegateMutation = gql`
	mutation RemoveCouncilDelegate($councilId: Int!, $participantId: [Int]){
		removeCouncilDelegate(councilId: $councilId, participantId: $participantId){
			success
		}
	}
`;

const DelegationRestriction = ({
	translate, council, client, fullScreen
}) => {
	const [participants, setParticipants] = React.useState([]);
	const [modal, setModal] = React.useState(false);
	const [selectedIds, setselectedIds] = React.useState(new Map());
	const [warningModal, setWarningModal] = React.useState(false);
	const primary = getPrimary();

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: councilDelegates,
			variables: {
				councilId: council.id
			}
		});

		setParticipants(response.data.councilDelegates.map(item => item.participant));
	}, [council.id]);

	const openSelectModal = () => {
		setModal(true);
	};

	const closeModal = () => {
		setModal(false);
	};

	const openDeleteWarning = participant => {
		setWarningModal(participant);
	};

	const closeDeleteWarning = () => {
		setWarningModal(false);
	};

	const addCouncilDelegate = async participantId => {
		const response = await client.mutate({
			mutation: addCouncilDelegateMutation,
			variables: {
				councilId: council.id,
				participantId
			}
		});

		if (response.data.addCouncilDelegate) {
			getData();
		}
	};

	const renderWarningText = () => (
		<div>
			{warningModal.id ?
				<text dangerouslySetInnerHTML={{ __html: translate.remove_delegation_restriction_warning.replace('{{name}}', warningModal.name).replace('{{surname}}', warningModal.surname || '') }}></text>
				: translate.this_options_delete_delegation_restriction
			}
		</div>
	);

	const removeCouncilDelegate = async participantId => {
		let arrayIds = [];
		if (selectedIds.size > 0) {
			arrayIds = Array.from(selectedIds.keys());
		}
		const response = await client.mutate({
			mutation: removeCouncilDelegateMutation,
			variables: {
				councilId: council.id,
				participantId: selectedIds.size > 0 ? arrayIds : [participantId]
			}
		});

		if (response.data.removeCouncilDelegate.success) {
			setselectedIds(new Map());
			getData();
			setWarningModal(false);
		}
	};

	const selectAll = () => {
		const newSelected = new Map();
		if (selectedIds.size !== participants.length) {
			participants.forEach(participant => {
				newSelected.set(participant.id, 'selected');
			});
		}

		setselectedIds(newSelected);
	};

	React.useEffect(() => {
		getData();
	}, [getData]);


	const renderBody = () => {
		if (!isMobile) {
			return (
				<div style={{ width: '100%', height: '100%' }}>
					<SectionTitle
						text={`${translate.can_receive_delegations}: `}
						color={primary}
						style={{
							// marginTop: '1.6em'
						}}
					/>
					<div style={{ paddingBottom: '1em' }}>
						<div style={{ display: 'flex' }}>
							<div style={{ width: '135px' }}>
								<BasicButton
									color={'transparent'}
									textStyle={{
										color: getPrimary(),
										fontSize: '0.9em',
										textTransform: 'none',
										fontWeight: '500',
										minWidth: '100px'
									}}
									icon={<ButtonIcon type="person_add" color={getPrimary()} />}
									textPosition="after"
									buttonStyle={{
										marginRight: '1em',
										borderRadius: '1px',
										marginBottom: '0.5em',
										border: `2px solid ${getPrimary()}`
									}}
									onClick={openSelectModal}
									text={translate.select}
								>
								</BasicButton>
								{participants.length > 0
									&& <BasicButton
										color={'white'}
										textStyle={{
											color: primary,
											fontSize: '0.9em',
											textTransform: 'none',
											fontWeight: '500',
											borderRadius: '2px',
											border: `solid 2px ${primary}`,
											minWidth: '125px'
										}}
										textPosition="after"
										buttonStyle={{
											marginRight: '1em',
											borderRadius: '1px',
											boxShadow: 'none'
										}}
										icon={<ButtonIcon type="people_alt" color={getPrimary()} />}
										text={translate.all_plural}
										onClick={() => {
											selectAll();
											setWarningModal(true);
										}}
									>
									</BasicButton>
								}
							</div>
							<div style={{ width: '100%' }}>
								{participants.map(participant => (
									<Etiqueta
										participant={participant}
										removeCouncilDelegate={removeCouncilDelegate}
										openDeleteWarning={openDeleteWarning}
										council={council}
										key={`participant_${participant.id}`}
										translate={translate}
									/>
								))}
								{participants.length === 0
									&& <Etiqueta
										empty={true}
										council={council}
										translate={translate}
									/>
								}
							</div>
						</div>
					</div>
					<DelegationsRestrictionModal
						translate={translate}
						council={council}
						open={modal}
						addCouncilDelegate={addCouncilDelegate}
						requestClose={closeModal}
						participantsTable={participants}
					/>
					<AlertConfirm
						requestClose={closeDeleteWarning}
						open={!!warningModal}
						title={translate.warning}
						acceptAction={() => removeCouncilDelegate(warningModal.id)}
						buttonAccept={translate.accept}
						buttonCancel={translate.cancel}
						bodyText={renderWarningText()}
					/>
				</div>
			);
		}
		return (
			<div style={{ width: '100%', height: '100%' }}>
				<SectionTitle
					text={`${translate.can_receive_delegations}: `}
					color={primary}
					style={{
						// marginTop: '1.6em'
					}}
				/>
				<div style={{ paddingBottom: '1em' }}>
					<BasicButton
						color={'white'}
						textStyle={{
							color: primary,
							fontWeight: '700',
							fontSize: '0.9em',
							textTransform: 'none'
						}}
						textPosition="after"
						buttonStyle={{
							marginRight: '1em',
							border: `2px solid ${primary}`
						}}
						onClick={openSelectModal}
						text={translate.add}
					>
					</BasicButton>
				</div>
				{participants.map(participant => (
					<div key={`participant_${participant.id}`}>
						<Card style={{
							padding: '1em', display: 'flex', justifyContent: 'space-between', marginBottom: '1em'
						}}>
							<div>
								<div><b> {translate.name} </b>: {participant.name}</div>
								<div><b> {translate.surname || ''} </b>: {participant.surname || ''}</div>
							</div>
							<div style={{ display: 'flex', alignItems: 'center' }} >
								<i
									className={'fa fa-times'}
									style={{ color: '#000000de' }}
									onClick={() => {
										if (council.state < 5) {
											removeCouncilDelegate(participant.id);
										} else {
											openDeleteWarning(participant.id);
										}
									}}
								>
								</i>

							</div>

						</Card>
					</div>
				))}
				<DelegationsRestrictionModal
					translate={translate}
					council={council}
					open={modal}
					addCouncilDelegate={addCouncilDelegate}
					requestClose={closeModal}
					participantsTable={participants}
				/>
				<AlertConfirm
					requestClose={closeDeleteWarning}
					open={!!warningModal}
					title={translate.warning}
					acceptAction={() => removeCouncilDelegate(warningModal)}
					buttonAccept={translate.accept}
					buttonCancel={translate.cancel}
					bodyText={renderWarningText()}
				/>
			</div>
		);
	};

	return (
		fullScreen ?
			<div>
				{renderBody()}
			</div>
			: <div style={{
				padding: '1em', paddingLeft: 0, marginTop: '1em', maxWidth: isMobile ? '100%' : '70%'
			}}>
				{renderBody()}
			</div>
	);
};

const Etiqueta = ({
	participant, removeCouncilDelegate, openDeleteWarning, council, empty, translate
}) => {
	if (empty) {
		return (
			<div
				color={'white'}
				style={{
					background: 'white',
					color: 'black',
					fontSize: '0.9em',
					textTransform: 'none',
					fontWeight: '500',
					cursor: 'initial',
					marginRight: '1em',
					borderRadius: '1px',
					// border: 'solid 1px #f0f3f6',
					display: 'inline-block',
					marginBottom: '0.5em',
					minWidth: '100px'
				}}
			>
				<div style={{
					padding: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center'
				}}>
					<div style={{ marginLeft: '15px', marginRight: '15px' }}>
						{translate.all_plural}
					</div>
				</div>
			</div>
		);
	}
	return (
		<div
			color={'white'}
			style={{
				background: 'white',
				color: 'black',
				fontSize: '0.9em',
				textTransform: 'none',
				fontWeight: '500',
				cursor: 'initial',
				marginRight: '1em',
				borderRadius: '1px',
				boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)',
				border: 'solid 1px #f0f3f6',
				display: 'inline-block',
				marginBottom: '0.5em',
				minWidth: '100px'
			}}
		>
			<div style={{
				padding: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center'
			}}>
				<div style={{
					marginLeft: '15px',
					whiteSpace: 'nowrap',
					overflow: 'hidden',
					textOverflow: 'ellipsis',
					maxWidth: '160px'
				}}>
					{`${participant.name} ${participant.surname}` || ''}
				</div>
				<div style={{ marginLeft: '5px', marginRight: '3px', display: 'flex' }}>
					<ButtonIcon
						type="cancel"
						style={{ cursor: 'pointer' }}
						color={getPrimary()}
						onClick={() => {
							if (council.state !== 0) {
								openDeleteWarning(participant);
							} else {
								removeCouncilDelegate(participant.id);
							}
						}} />
				</div>
			</div>
		</div>
	);
};


export default withApollo(DelegationRestriction);
