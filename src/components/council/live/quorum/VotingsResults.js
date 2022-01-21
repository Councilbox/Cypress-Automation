import { TableHead, TableCell, Table, TableBody, TableRow } from 'material-ui';
import React from 'react';
import { ConfigContext } from '../../../../containers/AppControl';
import { getAgendaTotalVotes, hasVotation, isConfirmationRequest, isCustomPoint, showNumParticipations } from '../../../../utils/CBX';

const VotingsResults = ({ translate, agendas, company, council, socialCapital, totalVotes, hasParticipations }) => {
	const config = React.useContext(ConfigContext);

	const getPercentage = (value, defaultBase) => {
		let base = defaultBase || totalVotes;
		if (hasParticipations) {
			base = defaultBase || socialCapital;
		}

		return ((value / base) * 100).toFixed(3);
	};

	const calculateAbstention = point => {
		const abstentionTotal = point.abstentionVotings + point.abstentionManual;

		if (config.combineAbstentionNoVote) {
			return abstentionTotal + point.noVoteVotings + point.noVoteManual;
		}

		return abstentionTotal;
	};

	return (
		<Table style={{ marginTop: '3em' }}>
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
											{showNumParticipations(calculateAbstention(point), company, council.statute)}
										</TableCell>
										<TableCell>
											{`${getPercentage(calculateAbstention(point), pointTotalVotes)}%`}
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
	);
};

export default VotingsResults;
