import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { TableCell, TableRow } from 'material-ui';
import React from 'react';
import { AlertConfirm, EnhancedTable } from '../../../../../displayComponents';
import { PARTICIPANT_STATES } from '../../../../../constants';
import OwnedVotesRecountSection from './OwnedVotesRecountSection';

const getTypeText = type => {
	switch (type) {
		case PARTICIPANT_STATES.DELEGATED:
			return 'delegation';
		case PARTICIPANT_STATES.REPRESENTATED:
			return 'representation';
		default:
			return 'other';
	}
};

const OwnedVotingRightsPoint = ({
	participant, translate, client, open, agenda, requestClose, council
}) => {
	const [data, setData] = React.useState(null);
	const [loading, setLoading] = React.useState(true);

	const getData = React.useCallback(async options => {
		if (!data) {
			setLoading(true);
		}
		const response = await client.query({
			query: gql`
				query participantOwnedVotingRights(
					$participantId: Int!
					$agendaId: Int!
					$filters: [FilterInput]
					$options: OptionsInput
				) {
					participantOwnedVotingRights(
						participantId: $participantId
						agendaId: $agendaId
						filters: $filters
						options: $options
					) {
						list {
							id
							name
							surname
							numParticipations
							email
							state
						}
						total
						meta
					}
				}
			`,
			variables: {
				participantId: participant.id,
				agendaId: agenda.id,
				options: {
					limit: 15,
					offset: 0
				},
				...options
			}
		});

		setData(response.data);

		if (loading) {
			setLoading(false);
		}
	}, [participant.id]);

	React.useEffect(() => {
		if (open) {
			getData();
		}
	}, [getData, open]);

	const meta = data?.participantOwnedVotingRights?.meta;

	return (
		<>
			<AlertConfirm
				open={open}
				PaperProps={{
					style: {
						minHeight: '80vh',
						minWidth: 'clamp(300px, 920px, 100%)'
					}
				}}
				title={'Votos en posesión'}
				requestClose={requestClose}
				bodyText={
					<>
						{meta
							&& <OwnedVotesRecountSection
								ownedVotesMeta={meta}
								participant={participant}
								council={council}
								translate={translate}
							/>
						}
						{data?.participantOwnedVotingRights?.list
						&& <EnhancedTable
							translate={translate}
							defaultLimit={15}
							defaultFilter={'fullName'}
							page={1}
							length={data.participantOwnedVotingRights?.list.length}
							total={data.participantOwnedVotingRights.total}
							refetch={getData}
							headers={[
								{
									text: translate.name,
									name: 'fullName',
									canOrder: true
								},
								{
									text: translate.type,
									name: 'state',
									canOrder: true
								},
								{
									name: 'numParticipations',
									text: translate.num_participations,
									canOrder: true
								},
							]}
						>
							{data?.participantOwnedVotingRights?.list?.map(vote => (
								<TableRow
									key={vote.id}
								>
									<TableCell>
										{vote.name} {vote.surname || ''}
									</TableCell>
									<TableCell>
										{translate[getTypeText(vote.state)]}
									</TableCell>
									<TableCell>
										{vote.numParticipations}
									</TableCell>
								</TableRow>
							))}
						</EnhancedTable>}
					</>
				}
			/>
		</>
	);
};

export default withApollo(OwnedVotingRightsPoint);
