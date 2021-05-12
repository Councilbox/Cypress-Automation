import { withApollo } from 'react-apollo';
import React from 'react';
import { Table, TableBody, TableHead, TableRow, TableCell } from 'material-ui';
import { videoParticipants } from '../../../../../queries';
import { AlertConfirm, BasicButton, LoadingMainApp, PaginationFooter, TextInput } from '../../../../../displayComponents';
import withTranslations from '../../../../../HOCs/withTranslations';
import { usePolling } from '../../../../../hooks';
import { moment } from '../../../../../containers/App';
import ParticipantVideoLogs from './ParticipantVideoLogs';
import { Link } from 'react-router-dom';


const RemoteParticipants = ({ match, translate, client }) => {
	const councilId = +match.params.id;

	const [data, setData] = React.useState({});
	const [loading, setLoading] = React.useState(true);
	const [options, setOptions] = React.useState({
		banParticipant: false,
		page: 1,
		limit: 20
	});
	const [filter, setFilter] = React.useState(null);
	const [logsModal, setLogsModal] = React.useState(false);

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: videoParticipants,
			variables: {
				councilId,
				...(filter ? {
					filters: {
						field: 'fullName',
						text: filter
					}
				} : {}),
				options: {
					limit: options.limit,
					offset: options.limit * (options.page - 1)
				}
			}
		});

		setData(response.data);
		setLoading(false);
	}, [councilId, options, filter]);

	usePolling(getData, 8000);

	React.useEffect(() => {
		const timeout = setTimeout(() => getData(), 350);
		return () => {
			clearTimeout(timeout);
		};
	}, [getData]);


	if (loading) {
		return <LoadingMainApp />;
	}

	return (
		<div style={{ height: 'calc(100vh - 3em)' }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', padding: '1em' }}>
				<Link to={`/council/${councilId}`} style={{ fontSize: '20px' }}>
					Volver
				</Link>
				<div style={{ maxWidth: '20em' }}>
					<TextInput
						floatingText="Buscar por nombre"
						value={filter}
						onChange={event => {
							setFilter(event.target.value);
						}}
					/>
				</div>
			</div>
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
			<div style={{ padding: '1em' }}>
				<PaginationFooter
					page={options.page}
					translate={translate}
					length={data.videoParticipants.list.length}
					total={data.videoParticipants.total}
					limit={20}
					changePage={setOptions}
					md={12}
					xs={12}
				/>
			</div>
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
