import React from "react";
import {
	AlertConfirm,
	Icon,
	LoadingSection,
	ParticipantRow,
	Scrollbar,
	TextInput
} from "../../../displayComponents";
import { graphql } from "react-apollo";
import { participantsToDelegate } from "../../../queries";
import { DELEGATION_USERS_LOAD } from "../../../constants";
import { Card, MenuItem, Typography } from 'material-ui';

const DelegateOwnVoteAttendantModal = ({ show, data, translate, ...props }) => {
	const loadMore = () => {
		data.fetchMore({
			variables: {
				options: {
					offset: data.liveParticipantsToDelegate.list.length,
					limit: DELEGATION_USERS_LOAD
				}
			},
			updateQuery: (prev, { fetchMoreResult }) => {
				if (!fetchMoreResult) {
					return prev;
				}
				return {
					...prev,
					liveParticipantsToDelegate: {
						...prev.liveParticipantsToDelegate,
						list: [
							...prev.liveParticipantsToDelegate.list,
							...fetchMoreResult.liveParticipantsToDelegate.list
						]
					}
				};
			}
		});
	}

	const close = () => {
		props.requestClose();
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
	}

	function _renderBody() {
		const { loading } = data;

		const participants = loading
			? []
			: data.liveParticipantsToDelegate.list;
		const { total } = loading
			? 0
			: data.liveParticipantsToDelegate;
		const rest = total - participants.length - 1;

		return (
			<div >
				<TextInput
					adornment={<Icon>search</Icon>}
					floatingText={" "}
					type="text"
					onChange={event => {
						updateFilterText(event.target.value);
					}}
				/>

				<div
					style={{
						height: "300px",
						padding: '0.5em',
						// overflow: "hidden"
					}}
				>
					{loading ? (
						<LoadingSection />
					) : (
							<div style={{ height: '100%' }}>
								<Scrollbar>
									{participants.length > 0 ? (
										<div style={{ width: "99%" }}>
											{participants.map(participant => {
												if (participant.id !== props.participant.id ) {
													return (
														<React.Fragment key={`delegateVote_${participant.id}`}>
															<ParticipantRow
																council={props.council}
																toDelegate={true}
																cantDelegate={false}
																participant={participant}
																onClick={() =>
																	props.addRepresentative(participant.id)
																}
															/>
														</React.Fragment>
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
													<MenuItem style={{padding: 0, width: '100%', height: '2em', display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
														{`DESCARGAR ${
															rest > DELEGATION_USERS_LOAD
																? `${DELEGATION_USERS_LOAD} de ${rest} RESTANTES`
																: translate.all_plural.toLowerCase()
															}`
														}
														{loading &&
															<div>
																<LoadingSection size={25} />
															</div>
														}
													</MenuItem>
												</Card>
											)}
										</div>
									) : (
											<Typography>{translate.no_results}</Typography>
										)
									}
								</Scrollbar>
							</div>
						)}
				</div>
			</div>
		);
	}

	return (
		<AlertConfirm
			bodyStyle={{ minWidth: "" }}
			classNameDialog={"modalParticipant"}
			requestClose={close}
			open={show}
			buttonCancel={translate.close}
			bodyText={_renderBody()}
			title={translate.to_delegate_vote}
		/>
	);

}

export default graphql(participantsToDelegate, {
	options: props => ({
		variables: {
			councilId: props.council.id,
			participantId: props.participant.id,
			options: {
				offset: 0,
				limit: DELEGATION_USERS_LOAD
			}
		}
	})
})(DelegateOwnVoteAttendantModal);
