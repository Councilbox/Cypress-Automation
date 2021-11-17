import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { TableCell, TableRow } from 'material-ui';
import React from 'react';
import RemoveDelegationButton from '../RemoveDelegationButton';
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

const OwnedVotesModal = ({
	participant, translate, client, open, requestClose, council
}) => {
	const [data, setData] = React.useState(null);
	const [loading, setLoading] = React.useState(true);

	const getData = React.useCallback(async options => {
		if (!data) {
			setLoading(true);
		}
		const response = await client.query({
			query: gql`
				query participantOwnedVotes(
					$participantId: Int!
					$filters: [FilterInput]
					$options: OptionsInput
				) {
					participantOwnedVotes(
						participantId: $participantId
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

	const meta = data?.participantOwnedVotes?.meta;

	return (
		<>
			<AlertConfirm
				open={open}
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
						{data?.participantOwnedVotes?.list
						&& <EnhancedTable
							translate={translate}
							defaultLimit={15}
							defaultFilter={'fullName'}
							page={1}
							length={data.participantOwnedVotes?.list.length}
							total={data.participantOwnedVotes.total}
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
								{ name: '' }
							]}
						>
							{data?.participantOwnedVotes?.list?.map(vote => (
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
									<TableCell>
										{vote.state === PARTICIPANT_STATES.DELEGATED
											&& <RemoveDelegationButton
												delegatedVote={vote}
												participant={participant}
												translate={translate}
												refetch={getData}
											/>
										}
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

export default withApollo(OwnedVotesModal);
