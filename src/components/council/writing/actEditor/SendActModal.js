import React from "react";
import {
	AlertConfirm,
	Icon,
	LoadingSection,
	ParticipantRow,
	TextInput,
	SuccessMessage
} from "../../../../displayComponents";
import { Typography, Card } from "material-ui";
import { compose, graphql } from "react-apollo";
import { councilParticipantsActSends } from "../../../../queries";
import { DELEGATION_USERS_LOAD } from "../../../../constants";
import Scrollbar from "react-perfect-scrollbar";
import { checkValidEmail } from '../../../../utils/validation';
import FontAwesome from 'react-fontawesome';
import { sendAct } from '../../../../queries';
import { useOldState } from "../../../../hooks";


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
		if(props.show){
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
		if(check){
			const { __typename, ...data } = participant;
			participants = [...participants, data];
		}else{
			const index = participants.findIndex(item => item.id === participant.id);
			participants.splice(index, 1);
		}
		setState({
			participants
		});
	};

	const isChecked = id => {
		const item = state.participants.find(item => item.id === id);
		return !!item;
	}

	const updateFilterText = async text => {
		await data.refetch({
			filters: [
				{
					field: "fullName",
					text: text
				}
			]
		});
	};

	const addEmail = () => {
		if(checkValidEmail(state.newEmail)){
			if(state.participants.findIndex(item => item === state.newEmail) === -1){
				setState({
					participants: [...state.participants, state.newEmail],
					newEmail: ''
				});
			}else{
				setState({
					errors: {
						newEmail: translate.repeated_email
					}
				});
			}
		}else{
			setState({
				errors: {
					newEmail: translate.tooltip_invalid_email_address
				}
			})
		}
	};

	const deleteEmailFromList = id => {
		const list = state.participants;
		const index = list.find(item => id === item.id);
		list.splice(index, 1);
		setState({
			participants: [...list],
		});
	}

	const _renderEmails = () => {
		return(
			<div style={{width: '100%'}}>
				{state.participants.length > 0?
					state.participants.map((participant, index) => (
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
								name={"times"}
								style={{
									fontSize: "0.9em",
									color: 'red',
									cursor: 'pointer'
								}}
								onClick={() => deleteEmailFromList(participant.id)}
							/>
						</Card>
					))
				:
					<div>
						{translate.not_added}
					</div>
				}
			</div>
		)
	}

	const sendAct = async () => {
		setLoading(true);
		let participantsIds = state.participants.map(participant=>{
			return participant.id;
		});
		const response = await props.sendAct({
			variables: {
				councilId: props.council.id,
				participantsIds
			}
		});
		if(!!response){
			if(!response.data.errors){
				setState({
					success: true
				});

			}
			setLoading(false);
			props.refetch();
			data.refetch();
		}
	}

	const secondStep = () => {
		setState({
			step: 2
		});
	}


	function _modalBody() {
		const { loading } = data;

		const participants = loading
			? []
			: data.councilParticipantsActSends.list;
		const { total } = loading
			? 0
			: data.councilParticipantsActSends;
		const rest = total - participants.length - 1;

		if(state.step === 1){
			return (
				<div style={{ width: "600px" }}>
					<TextInput
						adornment={<Icon>search</Icon>}
						floatingText={" "}
						type="text"
						value={state.filterText}
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
							<Scrollbar option={{ suppressScrollX: true }}>
								{participants.length > 0 ? (
									<div style={{marginTop: '1em', padding: '0.3em'}}>
										{participants.map(participant => {
											return (
												<div style={{display: 'flex', flexDirection: 'row'}} key={`participant_${participant.id}`}>
													<ParticipantRow
														checkBox={true}
														onClick={() => {
															checkRow(participant, !isChecked(participant.id))
														}}
														selected={isChecked(participant.id)}
														onChange={(event, isInputChecked) =>
															checkRow(participant, isInputChecked)
														}
														participant={participant}
													/>
												</div>
											);
										})}
										{participants.length < total - 1 && (
											<Card
												onClick={loadMore}
												style={{
													width: '100%',
													border: '1px solid gainsboro',
													padding: '0.3em',
													marginTop: '0.6em',
													borderRadius: '3px'
												}}
											>
												{`Descargar ${
													rest > DELEGATION_USERS_LOAD
														? `${DELEGATION_USERS_LOAD} de ${rest} restantes`
														: translate.all_plural.toLowerCase()
												}`}
											</Card>
										)}
									</div>
								) : (
									<Typography>{translate.no_results}</Typography>
								)}
							</Scrollbar>
						)}
					</div>
				</div>
			);
		}

		if(state.success){
			return(
				<SuccessMessage />
			)
		}

		return(
			<div style={{ width: "600px" }}>
				{_renderEmails()}
			</div>
		)
	}

	return (
		<AlertConfirm
			requestClose={close}
			open={props.show}
			loading={loading}
			acceptAction={state.step === 1? secondStep : sendAct}
			hideAccept={state.success || (state.step === 2 && state.participants.length < 1)}
			buttonAccept={state.step === 1? translate.continue : translate.send}
			cancelAction={state.success?
				close
			:
				state.step !== 1?
						() => setState({step: 1, success: false})
					:
						null
			}
			buttonCancel={state.success?
				translate.close
			:
				state.step === 1? translate.close : translate.back}
			bodyText={_modalBody()}
			title={translate.sending_the_minutes}
		/>
	);
}


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

	graphql(sendAct, {
		name: 'sendAct'
	})
)(SendActModal);
