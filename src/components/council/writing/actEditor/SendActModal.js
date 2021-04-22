import React from 'react';
import {
	Typography, Card, TableRow, Table, TableCell
} from 'material-ui';
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import FontAwesome from 'react-fontawesome';
import {
	AlertConfirm,
	Icon,
	BasicButton,
	LoadingSection,
	Scrollbar,
	TextInput,
	Checkbox,
	SuccessMessage
} from '../../../../displayComponents';
import { councilParticipantsActSends, sendAct as sendActMutation } from '../../../../queries';
import { DELEGATION_USERS_LOAD } from '../../../../constants';
import { useOldState } from '../../../../hooks';
import { getSecondary } from '../../../../styles/colors';
import { removeTypenameField } from '../../../../utils/CBX';


const SendActModal = ({ translate, data, ...props }) => {
	const [loading, setLoading] = React.useState(false);
	const [state, setState] = useOldState({
		newEmail: '',
		step: 1,
		success: false,
		participants: [],
		errors: {}
	});

	React.useEffect(() => {
		if (props.show) {
			data.refetch();
		}
	}, [props.show]);


	const close = () => {
		props.requestClose();
		setLoading(false);
		setState({
			success: false,
			participants: [],
			errors: {},
			step: 1,
		});
	};

	const loadMore = () => {
		data.fetchMore({
			variables: {
				options: {
					offset: data.councilParticipantsActSends.list.length,
					limit: DELEGATION_USERS_LOAD
				}
			},
			updateQuery: (prev, { fetchMoreResult }) => {
				if (!fetchMoreResult) {
					return prev;
				}
				return {
					...prev,
					councilParticipantsActSends: {
						...prev.councilParticipantsActSends,
						list: [
							...prev.councilParticipantsActSends.list,
							...fetchMoreResult.councilParticipantsActSends
								.list
						]
					}
				};
			}
		});
	};

	const checkRow = (participant, check) => {
		let participants = [...state.participants];
		if (check) {
			participants = [...participants, removeTypenameField(participant)];
		} else {
			const index = participants.findIndex(item => item.id === participant.id);
			participants.splice(index, 1);
		}
		setState({
			participants
		});
	};

	const isChecked = id => {
		const item = state.participants.find(participant => participant.id === id);
		return !!item;
	};

	const updateFilterText = async text => {
		await data.refetch({
			filters: [
				{
					field: 'fullName',
					text
				}
			]
		});
	};

	const deleteEmailFromList = id => {
		const list = state.participants;
		const index = list.find(item => id === item.id);
		list.splice(index, 1);
		setState({
			participants: [...list],
		});
	};

	const renderEmails = () => (
		<div style={{ width: '100%' }}>
			{state.participants.length > 0 ?
				state.participants.map(participant => (
					<Card
						style={{
							width: '98%',
							padding: '0.8em',
							margin: 'auto',
							marginBottom: '0.8em',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							flexDirection: 'row'
						}}
						key={`participants_${participant.id}`}
						elevation={2}
					>
						{participant.email}
						<FontAwesome
							name={'times'}
							style={{
								fontSize: '0.9em',
								color: 'red',
								cursor: 'pointer'
							}}
							onClick={() => deleteEmailFromList(participant.id)}
						/>
					</Card>
				))
				: <div>
					{translate.not_added}
				</div>
			}
		</div>
	);

	const sendAct = async () => {
		setLoading(true);
		const participantsIds = state.participants.map(participant => participant.id);
		const response = await props.sendAct({
			variables: {
				councilId: props.council.id,
				participantsIds
			}
		});
		if (response) {
			if (!response.data.errors) {
				setState({
					success: true
				});
			}
			setLoading(false);
			props.refetch();
			data.refetch();
		}
	};

	const secondStep = () => {
		setState({
			step: 2
		});
	};


	function modalBody() {
		const loadingParticipants = data.loading;
		const participants = loadingParticipants ?
			[]
			: data.councilParticipantsActSends.list;
		const { total } = loadingParticipants ?
			0
			: data.councilParticipantsActSends;
		const rest = total - participants.length - 1;

		if (state.step === 1) {
			return (
				<div style={{ width: '600px' }}>
					<TextInput
						adornment={<Icon>search</Icon>}
						floatingText={' '}
						type="text"
						value={state.filterText}
						onChange={event => {
							updateFilterText(event.target.value);
						}}
					/>
					<div
						style={{
							height: '300px',
							overflow: 'hidden',
							position: 'relative'
						}}
					>
						<Table style={{ width: '600px', margin: '0 auto' }}>
							<TableRow>
								<TableCell style={{ width: '50px', padding: '0px', paddingLeft: '10px' }}></TableCell>
								<TableCell style={{ width: '305px' }}>{translate.participant_data}</TableCell>
								<TableCell>{translate.email}</TableCell>
							</TableRow>
						</Table>

						{loadingParticipants ? (
							<LoadingSection />
						) : (
							<div style={{
								height: 'calc( 100% - 4em )', marginBottom: '0.5em', width: '600px', margin: '0 auto'
							}}>
								<Scrollbar option={{ suppressScrollX: true }}>
									<Table style={{ marginBottom: '1em', width: '600px', margin: '0 auto' }}>
										{participants.length > 0 ? (
											participants.filter(p => !!p.email).map(participant => (
												<TableRow key={participant.id}>
													<TableCell style={{ width: '50px', padding: '0px', paddingLeft: '10px' }}>
														<Checkbox
															value={isChecked(participant.id)}
															onChange={(event, isInputChecked) => checkRow(participant, isInputChecked)
															}
														/>
													</TableCell>
													<TableCell style={{ width: '305px' }}>
														<div style={{
															whiteSpace: 'nowrap',
															overflow: 'hidden',
															textOverflow: 'ellipsis',
															width: '200px',
														}}>
															{`${participant.name} ${participant.surname || ''}`}
														</div>
													</TableCell>
													<TableCell>
														<div style={{
															whiteSpace: 'nowrap',
															overflow: 'hidden',
															textOverflow: 'ellipsis',
															width: '200px',
														}}>
															{participant.email}
														</div>
													</TableCell>
												</TableRow>
											))) : (
											<Typography>{translate.no_results}</Typography>
										)}
									</Table>
								</Scrollbar>
							</div>
						)}
					</div>
					{(participants.length > 0 && (
						participants.length < total - 1 && (
							<div
								style={{
									width: '100%',
									display: 'flex',
									justifyContent: 'flex-end'
								}}
							>
								<BasicButton
									text={
										`DESCARGAR ${rest > DELEGATION_USERS_LOAD ?
											`${DELEGATION_USERS_LOAD} de ${rest} RESTANTES`
											: translate.all_plural.toLowerCase()
										}`
									}
									color={getSecondary()}
									onClick={loadMore}
									textStyle={{ color: 'white' }}
								/>
							</div>
						)
					))}
				</div>
			);
		}

		if (state.success) {
			return (
				<SuccessMessage />
			);
		}

		return (
			<div style={{ width: '600px' }}>
				{renderEmails()}
			</div>
		);
	}

	return (
		<AlertConfirm
			requestClose={close}
			open={props.show}
			loading={loading}
			acceptAction={state.step === 1 ? secondStep : sendAct}
			hideAccept={state.success || (state.step === 2 && state.participants.length < 1)}
			buttonAccept={state.step === 1 ? translate.continue : translate.send}
			cancelAction={state.success ?
				close
				: state.step !== 1 ?
					() => setState({ step: 1, success: false })
					: null
			}
			buttonCancel={state.success ?
				translate.close
				: state.step === 1 ? translate.close : translate.back}
			bodyText={modalBody()}
			title={translate.sending_the_minutes}
		/>
	);
};


export default compose(
	graphql(councilParticipantsActSends, {
		options: props => ({
			variables: {
				councilId: props.council.id,
				options: {
					limit: DELEGATION_USERS_LOAD,
					offset: 0
				}
			}
		})
	}),

	graphql(sendActMutation, {
		name: 'sendAct'
	})
)(SendActModal);
