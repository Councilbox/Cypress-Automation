import { withApollo } from 'react-apollo';
import { Table, TableRow, TableCell } from 'material-ui';
import React from 'react';
import gql from 'graphql-tag';
import JSONPretty from 'react-json-pretty';
import { moment } from '../../../../../containers/App';
import { LoadingSection } from '../../../../../displayComponents';
import { getLogText } from '../../../../council/live/video/videoParticipants/ParticipantHistoryModal';

const participantHistory = gql`
	query participantHistory($participantId: Int!) {
		participantHistory(participantId: $participantId) {
			date
			type
			trackInfo
			id
			typeText
		}
	}
`;

const ParticipantVideoLogs = ({ participantId, translate, client }) => {
	const [loading, setLoading] = React.useState(true);
	const [data, setData] = React.useState(null);

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: participantHistory,
			variables: {
				participantId
			}
		});

		setData(response.data);
		setLoading(false);
	}, [participantId]);

	React.useEffect(() => {
		getData();
	}, [getData]);

	if (loading) {
		return <LoadingSection />;
	}


	return (
		<Table
			headers={[
				{ name: translate.table_councils_date },
				{ name: translate.connection_type },
				{ name: translate.test_browser },
				{ name: translate.os },
				{ name: translate.ip }
			]}
		>
			{data.participantHistory.map(history => (
				<LogRow key={history.id} translate={translate} data={history} />
			))}
		</Table>
	);
};

const LogRow = ({ data, translate }) => {
	const [expanded, setExpanded] = React.useState(false);

	return (
		<>
			<TableRow key={`history_${data.id}`} onClick={() => setExpanded(!expanded)}>
				<TableCell>
					{moment(
						new Date(data.date)
					).format('LLL')}
				</TableCell>
				<TableCell>
					{getLogText(data.typeText, translate)}
				</TableCell>
				<TableCell>
					{`${data.trackInfo.ua.browser
						.name || '-'} ${data
							.trackInfo.ua.browser
							.version || '-'}`}
				</TableCell>
				<TableCell>
					{`${data.trackInfo.ua.os
						.name || '-'} ${data
							.trackInfo.ua.os.version
						|| '-'}`}
				</TableCell>
				<TableCell>
					{data.trackInfo.ip}
				</TableCell>
			</TableRow>
			{expanded
				&& <JSONPretty id="json-pretty" data={data.trackInfo}></JSONPretty>
			}
		</>
	);
};

export default withApollo(ParticipantVideoLogs);
