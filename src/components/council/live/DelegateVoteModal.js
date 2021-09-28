import React from 'react';
import { Typography, Card, MenuItem } from 'material-ui';
import { withApollo, graphql } from 'react-apollo';
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
import { participantsWhoCanDelegate } from '../../../queries';
import { DELEGATION_USERS_LOAD } from '../../../constants';
import { delegatedVotesLimitReached } from '../../../utils/CBX';
import { addDelegation as addDelegationMutation } from '../../../queries/liveParticipant';

const DelegateVoteModal = ({
	translate, participant, client, council, ...props
}) => {
	const [data, setData] = React.useState({});
	const [loading, setLoading] = React.useState(true);
	const [filters, setFilters] = React.useState({
		text: ''
	});
	const [options, setOptions] = React.useState({
		offset: 0,
		limit: DELEGATION_USERS_LOAD
	});

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

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: participantsWhoCanDelegate,
			variables: buildVariables()
		});

		setData(response.data);
		setLoading(false);
	}, [filters.text, participant.id]);

	const getMore = React.useCallback(async () => {
		if (options.offset !== 0) {
			const response = await client.query({
				query: participantsWhoCanDelegate,
				variables: buildVariables()
			});
			setData({
				...data,
				liveParticipantsWhoCanDelegate: {
					...data.liveParticipantsWhoCanDelegate,
					list: [
						...data.liveParticipantsWhoCanDelegate.list,
						...response.data.liveParticipantsWhoCanDelegate.list
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

	const loadMore = () => {
		setOptions({
			offset: data.liveParticipantsWhoCanDelegate.list.length,
			limit: DELEGATION_USERS_LOAD
		});
	};

	const close = () => {
		props.requestClose();
	};

	const addDelegation = async id => {
		const response = await props.addDelegation(
			{
				variables: {
					participantId: id,
					delegateId: participant.id
				}
			}
		);

		if (!response.errors) {
			props.refetch();
			close();
		} else if (response.errors[0].code === 710) {
			toast(
				<LiveToast
					message={translate.just_delegate_vote}
					id="error-toast"
				/>, {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: true,
					className: 'errorToast'
				}
			);
		} else if (response.errors[0].code === 711) {
			toast(
				<LiveToast
					id="error-toast"
					message={translate.number_of_delegated_votes_exceeded}
				/>, {
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
				/>, {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: true,
					className: 'errorToast'
				}
			);
		}
	};

	const updateFilterText = text => {
		setOptions({
			offset: 0,
			limit: DELEGATION_USERS_LOAD
		});
		setFilters({ text });
	};


	function modalBody() {
		const participants = loading ? [] : data.liveParticipantsWhoCanDelegate.list;
		const { total } = loading ? 0 : data.liveParticipantsWhoCanDelegate;
		const rest = total - participants.length - 1;

		if (participants !== undefined && participants.delegatedVotes !== undefined && delegatedVotesLimitReached(council.statute, participant.delegatedVotes.filter(p => p.type !== 3).length)) {
			return (
				<div>
					{translate.number_of_delegated_votes_exceeded}
				</div>
			);
		}

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
						<Scrollbar option={{ suppressScrollX: true }}>
							{participants.length > 0 ? (
								<React.Fragment>
									{participants.map(liveParticipant => {
										if (liveParticipant.id !== participant.id) {
											return (
												<ParticipantRow
													key={`delegateParticipant_${liveParticipant.id}`}
													participant={liveParticipant}
													onClick={() => addDelegation(liveParticipant.id)
													}
												/>
											);
										}
										return false;
									})}
									{participants.length < total - 1 && (
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
												{`DESCARGAR ${
													rest > DELEGATION_USERS_LOAD ?
														`${DELEGATION_USERS_LOAD} de ${rest} RESTANTES`
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

	return (
		<AlertConfirm
			requestClose={close}
			open={props.show}
			buttonCancel={translate.close}
			bodyText={modalBody()}
			title={translate.to_delegate_vote}
		/>
	);
};

export default graphql(addDelegationMutation, {
	name: 'addDelegation'
})(withApollo(DelegateVoteModal));
