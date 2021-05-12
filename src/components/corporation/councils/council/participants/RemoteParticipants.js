import { withApollo } from 'react-apollo';
import React from 'react';
import { Table, TableBody, TableHead, TableRow, TableCell } from 'material-ui';
import { videoParticipants } from '../../../../../queries';
import { AlertConfirm, BasicButton, LoadingMainApp } from '../../../../../displayComponents';
import withTranslations from '../../../../../HOCs/withTranslations';
import { usePolling } from '../../../../../hooks';
import { moment } from '../../../../../containers/App';
import ParticipantVideoLogs from './ParticipantVideoLogs';


const RemoteParticipants = ({ match, translate, client }) => {
	const councilId = +match.params.id;

	const [data, setData] = React.useState({});
	const [loading, setLoading] = React.useState(true);
	const [options] = React.useState({
		banParticipant: false,
		page: 1,
		limit: 20
	});
	const [logsModal, setLogsModal] = React.useState(false);

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: videoParticipants,
			variables: {
				councilId,
				options: {
					limit: options.limit,
					offset: options.limit * (options.page - 1)
				}
			}
		});

		setData(response.data);
		setLoading(false);
	}, [councilId, options]);

	usePolling(getData, 8000);

	React.useEffect(() => {
		getData();
	}, [getData]);


	if (loading) {
		return <LoadingMainApp />;
	}

	console.log(data);

	return (
		<div style={{ height: 'calc(100vh - 3em)' }}>
			<Table>
				<TableHead>
					<TableCell>
						Nombre
					</TableCell>
					<TableCell>
						Estado
					</TableCell>
					<TableCell>
						Última conexión
					</TableCell>
					<TableCell>
						Ver logs
					</TableCell>
				</TableHead>
				<TableBody>
					{data.videoParticipants.list.map(p => (
						<TableRow key={p.id}>
							<TableCell>
								{p.name} {p.surname}
							</TableCell>
							<TableCell>
								{p.online === 1 ? 'Online' : 'Offline'}
							</TableCell>
							<TableCell>
								{moment(p.lastDateConnection).format('LLL')}
							</TableCell>
							<TableCell>
								<BasicButton
									color="white"
									text="Ver logs"
									onClick={() => setLogsModal(p.id)}
								/>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<AlertConfirm
				open={logsModal}
				requestClose={() => setLogsModal(false)}
				buttonCancel={translate.close}
				bodyText={logsModal ?
					<ParticipantVideoLogs
						translate={translate}
						participantId={logsModal}
					/>
					:
					<span/>
				}
				title="Video logs"
			/>
		</div>
	);
};

export default withApollo(withTranslations()(RemoteParticipants));
