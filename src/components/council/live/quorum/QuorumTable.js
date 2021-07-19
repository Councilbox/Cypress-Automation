import { Table, TableHead, TableBody, TableCell, TableRow } from 'material-ui';
import React from 'react';
import { COUNCIL_TYPES } from '../../../../constants';
import { getSecondary } from '../../../../styles/colors';
import { showNumParticipations } from '../../../../utils/CBX';

const QuorumTable = ({ translate, data, company, council, hasParticipations, totalVotes, socialCapital }) => {
	const mainRowsStyle = {
		fontWeight: '700',
		fontSize: '14px',
		color: getSecondary()
	};

	const paddedRow = {
		paddingLeft: '40px'
	};

	const totalRowStyle = {
		paddingTop: '12px',
		paddingBottom: '12px',
		paddingLeft: '0',
		paddingRight: '0'
	};

	const markedRow = {
		backgroundColor: 'rgba(97, 171, 183, 0.18)',
		padding: '9px',
		fontWeight: '700',
		fontSize: '1.2em',
		display: 'flex',
		alignItems: 'center',
		paddingLeft: '24px',
	};

	const totalRow = {
		backgroundColor: 'rgba(216, 216, 216, 0.4)',
		padding: '9px',
		fontWeight: '700',
		fontSize: '1.2em',
		display: 'flex',
		alignItems: 'center',
		paddingLeft: '24px',
	};

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
							{translate.presents}
						</TableCell>
						<TableCell style={mainRowsStyle}>
							{data.numPresent + data.numRemote + data.numEarlyVotes + data.numWithoutVote}
						</TableCell>
						<TableCell style={mainRowsStyle}>
							{showNumParticipations(data.present + data.remote + data.earlyVotes + data.withoutVote, company, council.statute)}
						</TableCell>
						<TableCell style={mainRowsStyle}>
							{getPercentage(data.present + data.remote + data.earlyVotes + data.withoutVote)}%
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell style={paddedRow}>
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
						<TableCell style={paddedRow}>
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
							<TableCell style={paddedRow}>
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
					{data.numWithoutVote > 0 &&
						<TableRow>
							<TableCell style={paddedRow}>
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
					}
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
					{data.treasuryShares !== 0 &&
						<TableRow>
							<TableCell style={mainRowsStyle}>
								{translate.treasury_shares}
							</TableCell>
							<TableCell style={mainRowsStyle}>
								{'-'}
							</TableCell>
							<TableCell style={mainRowsStyle}>
								{showNumParticipations(data.treasuryShares, company, council.statute)}
							</TableCell>
							<TableCell style={mainRowsStyle}>
								{getPercentage(data.treasuryShares)}%
							</TableCell>
						</TableRow>
					}

					<TableRow>
						<TableCell style={totalRowStyle}>
							<div style={markedRow}>
								Quorum
							</div>
						</TableCell>
						<TableCell style={totalRowStyle}>
							<div style={markedRow}>
								{data.numTotal}
							</div>
						</TableCell>
						<TableCell style={totalRowStyle}>
							<div style={markedRow}>
								{showNumParticipations(data.total, company, council.statute)}
							</div>
						</TableCell>
						<TableCell style={totalRowStyle}>
							<div style={markedRow}>
								{getPercentage(data.total)}%
							</div>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell style={mainRowsStyle}>
							{translate.guests}
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
					<TableRow>
						<TableCell style={totalRowStyle}>
							<div style={totalRow}>
								{translate.attendants_total}
							</div>
						</TableCell>
						<TableCell style={totalRowStyle}>
							<div style={totalRow}>
								{data.numTotal + data.numOthers}
							</div>
						</TableCell>
						<TableCell style={totalRowStyle}>
							<div style={totalRow}>
								-
							</div>
						</TableCell>
						<TableCell style={totalRowStyle}>
							<div style={totalRow}>
								-
							</div>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</>
	);
};

export default QuorumTable;
