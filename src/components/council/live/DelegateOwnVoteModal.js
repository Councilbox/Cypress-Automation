import React from 'react';
import { Typography, Card, MenuItem } from 'material-ui';
import { graphql, withApollo } from 'react-apollo';
import { toast } from 'react-toastify';
import {
	AlertConfirm,
	Icon,
	LoadingSection,
	ParticipantRow,
	TextInput,
	Scrollbar,
	LiveToast
} from '../../../displayComponents';
import { participantsToDelegate } from '../../../queries';
import { DELEGATION_USERS_LOAD } from '../../../constants';
import { addDelegation } from '../../../queries/liveParticipant';

const DelegateOwnVoteModal = ({
	translate, participant, show, client, council, inModal, setInModal, ...props
}) => {
	const [data, setData] = React.useState({});
	const [loading, setLoading] = React.useState(true);
	const [filters, setFilters] = React.useState({
		text: ''
	});
	const [options, setOptions] = React.useState({
		offset: 0,
		limit: DELEGATION_USERS_LOAD,
		orderBy: 'surname',
		orderDirection: 'asc'
	});

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: participantsToDelegate,
			variables: buildVariables()
		});

		setData(response.data);
		setLoading(false);
	}, [filters.text, participant.id]);

	const getMore = React.useCallback(async () => {
		if (options.offset !== 0) {
			const response = await client.query({
				query: participantsToDelegate,
				variables: buildVariables()
			});
			setData({
				...data,
				liveParticipantsToDelegate: {
					...data.liveParticipantsToDelegate,
					list: [
						...data.liveParticipantsToDelegate.list,
						...response.data.liveParticipantsToDelegate.list
					]
				}
			});
			setLoading(false);
		}
	}, [options.offset]);

	React.useEffect(() => {
		getMore();
	}, [getMore]);

	React.useEffect(() => {
		getData();
	}, [getData]);

	const buildVariables = () => {
		const variables = {
			councilId: council.id,
			participantId: participant.id,
		};

		if (filters.text) {
			variables.filters = [{
				field: 'fullName',
				text: filters.text.trim()
			}];
		}

		variables.options = options;
		return variables;
	};

	const loadMore = () => {
		setOptions({
			offset: data.liveParticipantsToDelegate.list.length,
			limit: DELEGATION_USERS_LOAD
		});
	};

	const close = () => {
		props.requestClose();
	};

	const delegateVote = async id => {
		if (props.addRepresentative) {
			props.addRepresentative(id);
		} else {
			const response = await props.delegateVote(
				{
					variables: {
						participantId: participant.id,
						delegateId: id
					}
				}
			);
			if (!response.errors) {
				props.refetch();
				close();
			} else if (response.errors[0].code === 710) {
				toast(
					<LiveToast
						id="error-toast"
						message={translate.just_delegate_vote}
					/>,
					{
						position: toast.POSITION.TOP_RIGHT,
						autoClose: true,
						className: 'errorToast'
					}
				);
			} else if (response.errors[0].code === 711) {
				toast(
					<LiveToast
						message={translate.number_of_delegated_votes_exceeded}
						id="error-toast"
					/>,
					{
						position: toast.POSITION.TOP_RIGHT,
						autoClose: true,
						className: 'errorToast'
					}
				);
			} else if (response.errors[0].code === 715) {
				toast(
					<LiveToast
						id="error-toast"
						message={translate.cant_delegate_has_delegated_votes}
					/>,
					{
						position: toast.POSITION.TOP_RIGHT,
						autoClose: true,
						className: 'errorToast'
					}
				);
			}
		}
	};

	const updateFilterText = text => {
		setOptions({
			offset: 0,
			limit: DELEGATION_USERS_LOAD
		});
		setFilters({ text });
	};

	function renderBody() {
		const participants = loading ? [] : data.liveParticipantsToDelegate.list;
		const { total } = loading ? 0 : data.liveParticipantsToDelegate;
		const rest = total - participants.length - 1;

		return (
			<div style={{ width: '600px' }}>
				<TextInput
					adornment={<Icon>search</Icon>}
					floatingText={' '}
					type="text"
					value={filters.text}
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
					{loading ? (
						<LoadingSection />
					) : (
						<Scrollbar>
							{participants.length > 0 ? (
								<React.Fragment>
									{participants.map(liveParticipant => {
										if (liveParticipant.id !== participant.id) {
											return (
												<ParticipantRow
													key={`delegateVote_${liveParticipant.id
														}`}
													council={council}
													toDelegate={true}
													participant={liveParticipant}
													onClick={() => delegateVote(liveParticipant.id)}
												/>
											);
										}
										return false;
									})}
									{participants.length < total && (
										<Card
											style={{
												width: '90%',
												border: '2px solid grey',
												margin: 'auto',
												marginBottom: '1.2em',
												marginTop: '0.6em',
												cursor: 'pointer',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center'
											}}
											elevation={1}
											onClick={loadMore}
										>
											<MenuItem style={{
												padding: 0, width: '100%', height: '2em', display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'center'
											}}>
												{`DESCARGAR ${rest > DELEGATION_USERS_LOAD ?
													`${1} de ${rest} RESTANTES`
													: translate.all_plural.toLowerCase()
													}`}
												{loading
													&& <div>
														<LoadingSection size={25} />
													</div>
												}
											</MenuItem>
										</Card>
									)}
								</React.Fragment>
							) : (
								<Typography>{translate.no_results}</Typography>
							)}
						</Scrollbar>
					)}
				</div>
			</div>
		);
	}
	if (inModal) {
		return (<div>{renderBody()}</div>);
	}
	return (
		<AlertConfirm
			requestClose={close}
			open={show}
			buttonCancel={translate.close}
			bodyText={renderBody()}
			title={translate.to_delegate_vote}
		/>
	);
};


export default graphql(addDelegation, {
	name: 'delegateVote'
})(withApollo(DelegateOwnVoteModal));
