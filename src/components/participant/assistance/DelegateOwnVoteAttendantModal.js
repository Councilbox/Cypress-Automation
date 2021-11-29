import React from 'react';
import { graphql } from 'react-apollo';
import { Card, MenuItem, Typography } from 'material-ui';
import {
	AlertConfirm,
	Icon,
	LoadingSection,
	ParticipantRow,
	Scrollbar,
	TextInput,
	Grid,
	GridItem
} from '../../../displayComponents';
import { participantsToDelegate } from '../../../queries';
import { DELEGATION_USERS_LOAD } from '../../../constants';
import { getPrimary } from '../../../styles/colors';

const DelegateOwnVoteAttendantModal = ({
	show, data, translate, ...props
}) => {
	const loadMore = () => {
		data.fetchMore({
			variables: {
				options: {
					offset: data.liveParticipantsToDelegate.list.length,
					limit: DELEGATION_USERS_LOAD,
					orderBy: 'surname',
					orderDirection: 'asc'
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
	};

	const close = () => {
		props.requestClose();
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

	function renderBody() {
		const { loading } = data;

		const participants = loading ?
			[]
			: data.liveParticipantsToDelegate.list;
		const { total } = loading ?
			0
			: data.liveParticipantsToDelegate;
		const rest = total - participants.length - 1;

		return (
			<div >
				<TextInput
					disableUnderline={true}
					adornment={<Icon>search</Icon>}
					floatingText={' '}
					type="text"
					styleInInput={{
						fontSize: '12px', color: 'rgba(0, 0, 0, 0.54)', background: '#f0f3f6', paddingLeft: '5px'
					}}
					stylesAdornment={{ background: '#f0f3f6', marginLeft: '0', paddingLeft: '4px' }}
					onChange={event => {
						updateFilterText(event.target.value);
					}}
				/>

				<div
					style={{
						height: '300px',
					}}
				>
					{loading ? (
						<LoadingSection />
					) : (
						<div style={{ height: '100%' }}>
							<Scrollbar>
								{participants.length > 0 ? (
									<div style={{ display: 'flex', flexDirection: 'column' }}>
										<Grid style={{ padding: '10px' }}>
											{participants.map(participant => {
												if (participant.id !== props.participant.id) {
													return (
														<GridItem xs={12} md={4} lg={4} key={`delegateVote_${participant.id}`}>
															<React.Fragment >
																<ParticipantRow
																	council={props.council}
																	toDelegate={true}
																	order="surname"
																	cantDelegate={false}
																	participant={participant}
																	onClick={() => props.addRepresentative(participant.id)}
																	stylesPaper={{ borderRadius: '5px', width: '100%' }}
																/>
															</React.Fragment>
														</GridItem>
													);
												}
												return false;
											})}
										</Grid>
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
													}`
													}
													{loading
														&& <div>
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
			bodyStyle={{ minWidth: '' }}
			classNameDialog={'modalParticipant'}
			requestClose={close}
			open={show}
			buttonCancel={translate.close}
			bodyText={renderBody()}
			title={
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<div>
						{translate.to_delegate_vote}
					</div>
					<div style={{
						fontSize: '15px', color: '#0000005e', display: 'flex', alignItems: 'center'
					}}>
						<i className="material-icons" style={{
							color: getPrimary(), fontSize: '14px', paddingRight: '0.3em', cursor: 'pointer'
						}} >
help
						</i>
						{translate.select_who_will_be_delegate}
					</div>
				</div>
			}
		/>
	);
};

export default graphql(participantsToDelegate, {
	options: props => ({
		variables: {
			councilId: props.council.id,
			// participantId: props.participant.id,
			options: {
				offset: 0,
				limit: DELEGATION_USERS_LOAD,
				orderBy: 'surname',
				orderDirection: 'asc'
			}
		}
	})
})(DelegateOwnVoteAttendantModal);
