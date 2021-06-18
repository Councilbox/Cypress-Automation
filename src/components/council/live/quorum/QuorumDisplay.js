import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import {
	Table, TableBody, TableHead, TableRow, TableCell, MenuItem
} from 'material-ui';
import {
	showNumParticipations,
	councilHasSession,
	hasParticipations,
	hasVotation,
	isConfirmationRequest,
	isCustomPoint,
	getPercentage as calculatePercentage,
	getAgendaTotalVotes
} from '../../../../utils/CBX';
import { getSecondary } from '../../../../styles/colors';
import { useDownloadHTMLAsPDF, usePolling } from '../../../../hooks';
import { AlertConfirm, BasicButton, DropDownMenu } from '../../../../displayComponents';
import { moment } from '../../../../containers/App';
import { COUNCIL_TYPES } from '../../../../constants';
import MenuSuperiorTabs from '../../../dashboard/MenuSuperiorTabs';
import QuorumTable from './QuorumTable';
import { SERVER_URL } from '../../../../config';


const QuorumDisplay = ({
	council, recount, translate, company
}) => {
	const secondary = getSecondary();
	const [modal, setModal] = React.useState(false);

	const councilStarted = () => (council.state === 20 || council.state === 30) && council.councilStarted === 1;

	if (council.councilType === COUNCIL_TYPES.ONE_ON_ONE) {
		return null;
	}

	return (
		<>
			{council.statute.quorumPrototype === 0 ?
				<b>{`${translate.current_quorum}: ${showNumParticipations(recount.partRightVoting, company, council.statute)} (${calculatePercentage(recount.partRightVoting, (recount.partTotal || 1))}%)${(councilStarted() && council.councilStarted === 1 && councilHasSession(council)) ?
					` / ${translate.initial_quorum}: ${council.initialQuorum ? showNumParticipations(council.initialQuorum, company, council.statute) : showNumParticipations(council.currentQuorum, company, council.statute)
					} (${calculatePercentage(council.initialQuorum, (recount.partTotal || 1))}%)`
					: ''
					}`}</b>
				: <b>{`${translate.current_quorum}: ${showNumParticipations(recount.socialCapitalRightVoting, company, council.statute)
					} (${calculatePercentage(recount.socialCapitalRightVoting, (recount.socialCapitalTotal || 1))}%)${(councilStarted() && council.councilStarted === 1 && councilHasSession(council)) ?
						` / ${translate.initial_quorum}: ${council.initialQuorum ? showNumParticipations(council.initialQuorum, company, council.statute)
							: showNumParticipations(council.currentQuorum, company, council.statute)
						} (${calculatePercentage(council.initialQuorum, (recount.socialCapitalTotal || 1))}%)`
						: ''
					}`}</b>
			}
			<div
				style={{ color: secondary, paddingLeft: '0.6em', cursor: 'pointer' }}
				onClick={() => setModal(true)}
			>
				<i
					className="fa fa-info"
					aria-hidden="true"
				></i>
			</div>
			{modal
				&& <AlertConfirm
					title={'Quorum info'}
					open={modal}
					bodyStyle={{ height: '650px', minWidth: '50vw' }}
					bodyText={
						<QuorumDetails
							council={council}
							recount={recount}
							company={company}
							translate={translate}
							socialCapital={recount.socialCapitalTotal}
							totalVotes={recount.partTotal}
						/>
					}
					buttonCancel={translate.close}
					cancelAction={() => setModal(false)}
					requestClose={() => setModal(false)}
				/>
			}
		</>
	);
};

export const QuorumDetails = withApollo(({
	council, renderVotingsTable, agendas = [], company, translate, recount, totalVotes, socialCapital, client
}) => {
	const [data, setData] = React.useState(null);
	const [loading, setLoading] = React.useState(true);
	const secondary = getSecondary();
	const [selectedTab, setSelectedTab] = React.useState(translate.current_quorum);
	const { downloadHTMLAsPDF } = useDownloadHTMLAsPDF();

	const SC = hasParticipations(council.statute);

	const getPercentage = (value, defaultBase) => {
		let base = defaultBase || totalVotes;
		if (SC) {
			base = defaultBase || socialCapital;
		}

		return ((value / base) * 100).toFixed(3);
	};

	const downloadPDF = async () => {
		await downloadHTMLAsPDF({
			name: `Quorum_${council.name.replace(/\s/g, '_')}_${moment().format('DD/MM/YYYY_hh_mm_ss')}`,
			companyId: council.companyId,
			html: document.getElementById('quorumTable').innerHTML
		});
	};

	const downloadExcel = async () => {
		const token = sessionStorage.getItem('token');
		const apiToken = sessionStorage.getItem('apiToken');
		const participantToken = sessionStorage.getItem('participantToken');
		const response = await fetch(`${SERVER_URL}/council/${council.id}/resultsExcel`, {
			method: 'GET',
			headers: new Headers({
				'x-jwt-token': token || (apiToken || participantToken),
				'Content-type': 'application/json'
			})
		});

		if (response.status === 200) {
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `${translate.results} ${council.id}.xlsx`;
			document.body.appendChild(a);
			a.click();
			a.remove();
		}
	};

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: gql`
				query ActualQuorumRecount($councilId: Int!){
					initialQuorumRecount(councilId: $councilId){
						remote
						numRemote
						delegated
						numDelegated
						earlyVotes
						numEarlyVotes
						present
						withoutVote
						numWithoutVote
						numPresent
						treasuryShares
						numTotal
						others
						numOthers
						total
					}
					actualQuorumRecount(councilId: $councilId){
						remote
						numRemote
						delegated
						numDelegated
						earlyVotes
						numEarlyVotes
						present
						withoutVote
						numWithoutVote
						treasuryShares
						numPresent
						numTotal
						others
						numOthers
						total
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

	React.useEffect(() => {
		getData();
	}, [getData]);

	usePolling(getData, council.state < 40 ? 10000 : 60000);

	if (loading) {
		return '';
	}

	return (
		<div style={{ fontSize: '1em', height: '100%' }}>
			<div style={{ fontSize: '13px', display: 'inline-block' }}>
				<MenuSuperiorTabs
					items={[
						translate.current_quorum,
						translate.initial_quorum,
					]}
					selected={selectedTab}
					setSelect={setSelectedTab}
				/>
			</div>
			<div>
				<div style={{
					width: '100%',
					display: 'flex',
					justifyContent: 'flex-end',
					alignItems: 'center',
					marginBottom: '1em'
				}}>
					<DropDownMenu
						color="transparent"
						id={'user-menu-trigger'}
						loading={loading}
						loadingColor={secondary}
						text={translate.to_export}
						textStyle={{ color: secondary }}
						type="flat"
						buttonStyle={{ border: `1px solid ${secondary}` }}
						icon={
							<i className="fa fa-download" style={{
								fontSize: '1em',
								color: secondary,
								marginLeft: '0.3em'
							}}
							/>
						}
						items={
							<React.Fragment>
								<MenuItem onClick={downloadPDF}>
									<div
										style={{
											width: '100%',
											display: 'flex',
											flexDirection: 'row',
											justifyContent: 'space-between'
										}}
									>
										<i className="fa fa-file-pdf-o" style={{
											fontSize: '1em',
											color: secondary,
											marginLeft: '0.3em'
										}}
										/>
										<span style={{ marginLeft: '2.5em', marginRight: '0.8em' }}>
											PDF
										</span>
									</div>
								</MenuItem>
							</React.Fragment>
						}
					/>
					<BasicButton
						onClick={downloadExcel}
					/>
				</div>
			</div>
			<div style={{}}>
				<div id="quorumTable" style={{}}>
					<QuorumTable
						data={{
							...recount,
							...(selectedTab === translate.current_quorum ?
								data.actualQuorumRecount : data.initialQuorumRecount)
						}}
						hasParticipations={SC}
						translate={translate}
						totalVotes={totalVotes}
						socialCapital={socialCapital}
						company={company}
						council={council}
					/>
					{renderVotingsTable
						&& <Table style={{ marginTop: '3em' }}>
							<TableHead>
								<TableCell style={{ fontSize: '16px', fontWeight: '700' }}>
									{translate.title}
								</TableCell>
								<TableCell colSpan={2} style={{ fontSize: '16px', fontWeight: '700' }}>
									{translate.in_favor_btn}
								</TableCell>
								<TableCell colSpan={2} style={{ fontSize: '16px', fontWeight: '700' }}>
									{translate.against_btn}
								</TableCell>
								<TableCell colSpan={2} style={{ fontSize: '16px', fontWeight: '700' }}>
									{translate.abstention_btn}
								</TableCell>
							</TableHead>
							<TableBody>
								{agendas.map(point => {
									const pointTotalVotes = getAgendaTotalVotes(point);
									return (<TableRow key={point.id}>
										<TableCell>
											<div className="truncate" style={{ width: '6em' }}>
												{point.agendaSubject.substr(0, 10)}
											</div>
										</TableCell>
										{(hasVotation(point.subjectType) && !isCustomPoint(point.subjectType)) ?
											<>
												{isConfirmationRequest(point.subjectType) ?
													<>
														<TableCell>
															{point.positiveVotings + point.positiveManual}
														</TableCell>
														<TableCell>
															{`${getPercentage(point.positiveVotings + point.positiveManual, point.positiveVotings + point.positiveManual + point.negativeVotings + point.negativeManual + point.noVoteVotings + point.noVoteManual)}%`}
														</TableCell>
														<TableCell>
															{point.negativeVotings + point.negativeManual}
														</TableCell>
														<TableCell>
															{`${getPercentage(point.negativeVotings + point.negativeManual, point.positiveVotings + point.positiveManual + point.negativeVotings + point.negativeManual + point.noVoteVotings + point.noVoteManual)}%`}
														</TableCell>
														<TableCell colSpan={2} align="center">
															-
														</TableCell>
													</>
													: <>
														<TableCell>
															{showNumParticipations(point.positiveVotings + point.positiveManual, company, council.statute)}
														</TableCell>
														<TableCell>
															{`${getPercentage(point.positiveVotings + point.positiveManual, pointTotalVotes)}%`}
														</TableCell>
														<TableCell>
															{showNumParticipations(point.negativeVotings + point.negativeManual, company, council.statute)}
														</TableCell>
														<TableCell>
															{`${getPercentage(point.negativeVotings + point.negativeManual, pointTotalVotes)}%`}
														</TableCell>
														<TableCell>
															{showNumParticipations(point.abstentionVotings + point.abstentionManual, company, council.statute)}
														</TableCell>
														<TableCell>
															{`${getPercentage(point.abstentionVotings + point.abstentionManual, pointTotalVotes)}%`}
														</TableCell>
													</>
												}
											</>
											: <>
												<TableCell colSpan={2} align="center">
													-
												</TableCell>
												<TableCell colSpan={2} align="center">
													-
												</TableCell>
												<TableCell colSpan={2} align="center">
													-
												</TableCell>
											</>

										}

									</TableRow>);
								}
								)}
							</TableBody>
						</Table>
					}
				</div>
			</div>
		</div>
	);
});

export default QuorumDisplay;
