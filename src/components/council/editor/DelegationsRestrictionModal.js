import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import {
	AlertConfirm,
	Icon,
	LoadingSection,
	ParticipantRow,
	Scrollbar,
	TextInput
} from "../../../displayComponents";
import { DELEGATION_USERS_LOAD } from "../../../constants";
import { Card, MenuItem, Typography } from 'material-ui';
import { councilParticipantsFilterIds } from "../../../queries/councilParticipant";

const DelegationsRestrictionModal = ({ open, data, translate, participantsTable, ...props }) => {
	const loadMore = () => {
		data.fetchMore({
			variables: {
				options: {
					offset: data.councilParticipantsFilterIds.list.length,
					limit: DELEGATION_USERS_LOAD
				}
			},
			updateQuery: (prev, { fetchMoreResult }) => {
				if (!fetchMoreResult) {
					return prev;
				}
				return {
					...prev,
					councilParticipantsFilterIds: {
						...prev.councilParticipantsFilterIds,
						list: [
							...prev.councilParticipantsFilterIds.list,
							...fetchMoreResult.councilParticipantsFilterIds.list
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

	React.useEffect(() => {
		data.refetch()
	}, [ participantsTable ]);


	function _renderBody() {
		const { loading } = data;
		let participants = {}
		if (data.councilParticipantsFilterIds) {
			participants = loading
				? []
				: data.councilParticipantsFilterIds.list;
		}
		const { total } = loading
			? 0
			: data.councilParticipantsFilterIds;
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
												return (
													<React.Fragment key={`delegateVote_${participant.id}`}>
														<ParticipantRow
															council={props.council}
															cantDelegate={false}
															participant={participant}
															onClick={() =>
																props.addCouncilDelegate(participant.id)
															}
														/>
													</React.Fragment>
												);
											})
											}
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
													<MenuItem style={{ padding: 0, width: '100%', height: '2em', display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
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
			open={open}
			buttonCancel={translate.close}
			bodyText={_renderBody()}
			title={translate.to_delegate_vote}
		/>
	);
}


export default graphql(councilParticipantsFilterIds, {
	options: props => ({
		variables: {
			councilId: props.council.id,
			options: {
				limit: DELEGATION_USERS_LOAD,
				offset: 0,
				orderBy: 'fullName',
				orderDirection: 'asc'
			}
		},
		forceFetch: true,
		notifyOnNetworkStatusChange: true
	})
})(withApollo(DelegationsRestrictionModal));