import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { Grid, GridItem, MenuItem, SelectInput } from '../../../../../displayComponents';
import { updateAgenda } from '../../../../../queries/agenda';
import { isCustomPoint } from '../../../../../utils/CBX';
import { AGENDA_STATES } from '../../../../../constants';

const AgendaDefaultVoteEditor = ({ client, council }) => {
	const [data, setData] = React.useState(null);
	const [loading, setLoading] = React.useState(true);

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: gql`
				query agendas($councilId: Int!) {
					agendas(councilId: $councilId) {
						id
						orderIndex
						agendaSubject
						subjectType
						defaultVote
						votingState
						items {
							value
							id
						}
					}
				}
			`,
			variables: {
				councilId: council.id
			}
		});
		setData(response.data);
		setLoading(false);
	}, [council.id]);

	const updateDefaultVote = async ({ agendaId, vote }) => {
		await client.mutate({
			mutation: updateAgenda,
			variables: {
				agenda: {
					id: agendaId,
					defaultVote: vote,
					councilId: council.id
				}
			}
		});
		getData();
	};

	React.useEffect(() => {
		getData();
	}, [getData]);

	return (
		<Grid style={{ overflow: 'hidden', marginTop: '1em' }}>
			{!loading
				&& <>
					{data.agendas && data.agendas.length > 0 ?
						data.agendas.map(agenda => (
							<Grid
								key={agenda.id}
							>
								<GridItem xs={6} md={6} lg={6} style={{ height: '3.2em', display: 'flex', alignItems: 'center' }}>
									{agenda.agendaSubject}
								</GridItem>
								<GridItem xs={6} md={6} lg={6}
									style={{ display: 'flex', alignItems: 'center' }}
								>
									{!isCustomPoint(agenda.subjectType) ?
										<SelectInput
											disabled={agenda.votingState !== AGENDA_STATES.INITIAL}
											style={{
												maxWidth: '20em'
											}}
											onChange={async event => {
												updateDefaultVote({
													agendaId: agenda.id,
													vote: event.target.value
												});
											}}
											value={agenda.defaultVote}
										>
											<MenuItem
												value={-1}
											>
												Voto por defecto de la reunión
											</MenuItem>
											<MenuItem
												value={1}
											>
												A favor
											</MenuItem>
											<MenuItem
												value={0}
											>
												En contra
											</MenuItem>
											<MenuItem
												value={2}
											>
												Abstención
											</MenuItem>
										</SelectInput>
										:
										<SelectInput
											style={{
												maxWidth: '20em'
											}}
											disabled={agenda.votingState !== AGENDA_STATES.INITIAL}
											onChange={async event => {
												updateDefaultVote({
													agendaId: agenda.id,
													vote: event.target.value
												});
											}}
											value={agenda.defaultVote}
										>
											{agenda.items.map(item => (
												<MenuItem
													key={item.id}
													value={item.id}
												>
													{item.value}
												</MenuItem>
											))}
											<MenuItem
												value={-1}
											>
												Voto por defecto de la reunión
											</MenuItem>
										</SelectInput>
									}
								</GridItem>
							</Grid>
						))
						:
						'No hay puntos del día'
					}
				</>
			}
		</Grid>
	);
};

export default withApollo(AgendaDefaultVoteEditor);
