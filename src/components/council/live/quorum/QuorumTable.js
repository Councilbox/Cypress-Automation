import { Table, TableHead, TableBody, TableCell, TableRow } from 'material-ui';
import React from 'react';
import { COUNCIL_TYPES } from '../../../../constants';
import { showNumParticipations } from '../../../../utils/CBX';

const mainRowsStyle = {
	fontWeight: '700',
	fontSize: '14px'
};

const QuorumTable = ({ translate, data, company, council, hasParticipations, totalVotes, socialCapital }) => {
	const getPercentage = (value, defaultBase) => {
		let base = defaultBase || totalVotes;
		if (hasParticipations) {
			base = defaultBase || socialCapital;
		}

		return ((value / base) * 100).toFixed(3);
	};

	return (
		<>
			<Table style={{ minWidth: '100%' }}>
				<TableHead>
					<TableCell>

					</TableCell>
					<TableCell style={{ fontSize: '16px', fontWeight: '700' }}>
						{translate.participants}
					</TableCell>
					<TableCell style={{ fontSize: '16px', fontWeight: '700' }}>
						{hasParticipations ? translate.census_type_social_capital : translate.votes}
					</TableCell>
					<TableCell style={{ fontSize: '16px', fontWeight: '700' }}>
						%
					</TableCell>
				</TableHead>
				<TableBody>
					<TableRow>
						<TableCell style={mainRowsStyle}>
							Total
						</TableCell>
						<TableCell style={mainRowsStyle}>
							{data.numTotal}
						</TableCell>
						<TableCell style={mainRowsStyle}>
							{showNumParticipations(data.total, company, council.statute)}
						</TableCell>
						<TableCell style={mainRowsStyle}>
							{getPercentage(data.total)}%
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell style={mainRowsStyle}>
							{translate.presents}
						</TableCell>
						<TableCell style={mainRowsStyle}>
							{data.numPresent + data.numRemote + data.numEarlyVotes}
						</TableCell>
						<TableCell style={mainRowsStyle}>
							{showNumParticipations(data.present + data.remote + data.earlyVotes + data.withoutVote, company, council.statute)}
						</TableCell>
						<TableCell style={mainRowsStyle}>
							{getPercentage(data.present + data.remote + data.earlyVotes)}%
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>
							-{translate.face_to_face}
						</TableCell>
						<TableCell>
							{data.numPresent}
						</TableCell>
						<TableCell>
							{showNumParticipations(data.present, company, council.statute)}
						</TableCell>
						<TableCell>
							{getPercentage(data.present)}%
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>
							-{translate.remotes}
						</TableCell>
						<TableCell>
							{data.numRemote}
						</TableCell>
						<TableCell>
							{showNumParticipations(data.remote, company, council.statute)}
						</TableCell>
						<TableCell>
							{getPercentage(data.remote)}%
						</TableCell>
					</TableRow>
					{council.statute.canEarlyVote === 1
						&& <TableRow>
							<TableCell>
								-{council.councilType !== COUNCIL_TYPES.BOARD_WITHOUT_SESSION ? translate.vote_letter : translate.quorum_early_votes}
							</TableCell>
							<TableCell>
								{data.numEarlyVotes}
							</TableCell>
							<TableCell>
								{showNumParticipations(data.earlyVotes, company, council.statute)}
							</TableCell>
							<TableCell>
								{getPercentage(data.earlyVotes)}%
							</TableCell>
						</TableRow>
					}
					<TableRow>
						<TableCell>
							-{translate.no_voting_rights}
						</TableCell>
						<TableCell>
							{data.numWithoutVote}
						</TableCell>
						<TableCell>
							{showNumParticipations(data.withoutVote, company, council.statute)}
						</TableCell>
						<TableCell>
							{getPercentage(data.withoutVote)}%
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell style={mainRowsStyle}>
							{translate.delegated_plural}
						</TableCell>
						<TableCell style={mainRowsStyle}>
							{data.numDelegated}
						</TableCell>
						<TableCell style={mainRowsStyle}>
							{showNumParticipations(data.delegated, company, council.statute)}
						</TableCell>
						<TableCell style={mainRowsStyle}>
							{getPercentage(data.delegated)}%
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell style={mainRowsStyle}>
							{translate.others}
						</TableCell>
						<TableCell style={mainRowsStyle}>
							{data.numOthers}
						</TableCell>
						<TableCell style={mainRowsStyle}>
							-
						</TableCell>
						<TableCell style={mainRowsStyle}>
							-
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</>
	);
};

export default QuorumTable;
