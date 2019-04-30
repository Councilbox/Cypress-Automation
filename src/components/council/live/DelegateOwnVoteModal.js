import React from "react";
import {
	AlertConfirm,
	Icon,
	LoadingSection,
	ParticipantRow,
	TextInput,
	Scrollbar,
	LiveToast
} from "../../../displayComponents";
import { Typography } from "material-ui";
import { compose, graphql, withApollo } from "react-apollo";
import { participantsToDelegate } from "../../../queries";
import { DELEGATION_USERS_LOAD } from "../../../constants";
import { addDelegation } from "../../../queries/liveParticipant";
import { toast } from "react-toastify";

const DelegateOwnVoteModal = ({ translate, participant, show, client, council, ...props }) => {
	const [data, setData] = React.useState({});
	const [loading, setLoading] = React.useState(true);
	const [filters, setFilters] = React.useState({
		text: ''
	});
	const [options, setOptions] = React.useState({
		offset: 0,
		limit: DELEGATION_USERS_LOAD
	})

	const getData = React.useCallback(async () => {
		setLoading(true);
		const response = await client.query({
			query: participantsToDelegate,
			variables: buildVariables()
		});

		setData(response.data);
		setLoading(false);
	}, [filters.text, participant.id]);

	const getMore = React.useCallback(async () => {
		if(options.offset !== 0){
			setLoading(true);
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
		}

		if(filters.text){
			variables.filters = [{
				field: "fullName",
				text: filters.text
			}]
		}

		variables.options = options;

		console.log(variables);

		return variables;
	}

	const loadMore = () => {
		setOptions({
			offset: data.liveParticipantsToDelegate.list.length,
			limit: DELEGATION_USERS_LOAD
		});
	}

	const close = () => {
		props.requestClose();
	}

	const delegateVote = async id => {
		//For attendance
		if (props.addRepresentative) {
			props.addRepresentative(id);
		} else {
			let response = await props.delegateVote(
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
						message={translate.just_delegate_vote}
					/>, {
						position: toast.POSITION.TOP_RIGHT,
						autoClose: true,
						className: "errorToast"
					}
				)
			} else if (response.errors[0].code === 711) {
				toast(
					<LiveToast
						message={translate.number_of_delegated_votes_exceeded}
					/>, {
						position: toast.POSITION.TOP_RIGHT,
						autoClose: true,
						className: "errorToast"
					}
				)
			} else if (response.errors[0].code === 715) {
				toast(
					<LiveToast
						message={translate.cant_delegate_has_delegated_votes}
					/>, {
						position: toast.POSITION.TOP_RIGHT,
						autoClose: true,
						className: "errorToast"
					}
				)
			}
		}
	}

	const updateFilterText = text => {
		setFilters({ text });
	}

	function _renderBody() {
		const participants = loading
			? []
			: data.liveParticipantsToDelegate.list;
		const { total } = loading
			? 0
			: data.liveParticipantsToDelegate;
		const rest = total - participants.length - 1;

		return (
			<div style={{ width: "600px" }}>
				<TextInput
					adornment={<Icon>search</Icon>}
					floatingText={" "}
					type="text"
					value={filters.text}
					onChange={event => {
						updateFilterText(event.target.value);
					}}
				/>

				<div
					style={{
						height: "300px",
						overflow: "hidden",
						position: "relative"
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
														key={`delegateVote_${
															liveParticipant.id
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
											<div onClick={loadMore}>
												{`DESCARGAR ${
													rest > DELEGATION_USERS_LOAD
														? `${1} de ${DELEGATION_USERS_LOAD} RESTANTES`
														: translate.all_plural.toLowerCase()
													}`}
											</div>
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
			open={show}
			acceptAction={delegateVote}
			buttonAccept={translate.send}
			buttonCancel={translate.close}
			bodyText={_renderBody()}
			title={translate.to_delegate_vote}
		/>
	);

}


export default graphql(addDelegation, {
	name: "delegateVote"
})(withApollo(DelegateOwnVoteModal));
