import { store } from '../containers/App';
import { AGENDA_TYPES } from '../constants';

class LiveUtil {
	static qualityVoteRequirements(agenda, council) {
		return (
			(agenda.subject_type === AGENDA_TYPES.PUBLIC_ACT
				|| agenda.subject_type === AGENDA_TYPES.PUBLIC_VOTING)
				&& agenda.majorityType === 1
				&& agenda.positive_votings + agenda.positive_manual
				=== agenda.negative_votings + agenda.negative_manual
				&& council.statute.exists_quality_vote
		);
	}

	static parsePercentaje(number, divisor) {
		const zero = 0;
		if (!divisor) {
			return zero.toFixed(3);
		}

		return ((number * 100) / divisor).toFixed(3);
	}

	static calculateMayorityAgenda(agenda, council, recount) {
		const { companies } = store.getState();
		const company = companies.list[companies.selected];
		let specialSL = false;
		if (company.type === 1 && council.statute.quorumPrototype === 1) {
			specialSL = true;
		}
		return this.calculateMajority(
			specialSL,
			recount.partTotal,
			agenda.presentCensus + agenda.currentRemoteCensus,
			agenda.majorityType,
			agenda.majority,
			agenda.majorityDivider,
			agenda.negativeVotings + agenda.negativeManual,
			council.statute.quorumPrototype
		);
	}

	static calculateQuorum(base, quorumType, quorum, quorumDivider) {
		switch (quorumType) {
			case 0:
				return Math.ceil((base * quorum) / 100);
			case 1:
				return Math.ceil((base * 50) / 100) + 1;
			case 2:
				return Math.ceil((base * quorum) / quorumDivider);
			case 3:
				return quorum;
			default:
				return 0;
		}
	}

	static calculateMajority(
		specialSL,
		totalVotes,
		votes,
		majorityType,
		majority,
		majorityDivider,
		againstVotes,
		quorumPrototype
	) {
		if (specialSL) {
			return this.calculateMajoritySL(
				totalVotes,
				majorityType,
				majority,
				majorityDivider,
				againstVotes,
				quorumPrototype
			);
		}

		return this.calculateMajorityOther(
			totalVotes,
			votes,
			majorityType,
			majority,
			majorityDivider,
			againstVotes
		);
	}

	static calculateMajorityOther(
		totalVotes,
		votes,
		majorityType,
		majority,
		majorityDivider,
		againstVotes
	) {
		switch (majorityType) {
			case 0:
				return Math.ceil((votes * majority) / 100);
			case 1:
				return againstVotes + 1;
			case 2:
				return Math.ceil((votes * 50) / 100) + 1;
			case 3:
				if ((votes / totalVotes) * 100 >= 50) {
					return Math.ceil((votes * 50) / 100) + 1;
				}
				return Math.ceil((votes * 2) / 3);
			case 4:
				return Math.ceil((votes * 2) / 3);
			case 5:
				return Math.ceil((votes * majority) / majorityDivider);
			case 6:
				return majority;
			default:
				return 0;
		}
	}

	static calculateMajoritySL(
		totalVotes,
		majorityType,
		majority,
		majorityDivider,
		againstVotes,
		quorumPrototype
	) {
		switch (majorityType) {
			case 0:
				return Math.ceil((totalVotes * majority) / 100);
			case 1: {
				const positiveNeeded = againstVotes + 1;
				if (quorumPrototype === 1) {
					const minimumNeeded = Math.ceil(totalVotes / 3);
					const difference = minimumNeeded - againstVotes;
					return againstVotes > (minimumNeeded / 2) ?
						positiveNeeded
						: difference === againstVotes ? difference + 1 : difference;
				}
				return positiveNeeded;
			}
			case 2:
				return Math.ceil((totalVotes * 50) / 100) + 1;
			case 4:
				return Math.ceil((totalVotes * 2) / 3);
			case 5:
				return Math.ceil((totalVotes * majority) / majorityDivider);
			case 6:
				return majority;
			default:
				return 0;
		}
	}
}

export default LiveUtil;
