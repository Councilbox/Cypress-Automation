import assert from 'assert';
import * as CBX from '../utils/CBX';
import * as Pagination from '../utils/pagination';

const votingTypes = [
	{
		value: 0,
		label: 'text'
	},
	{
		value: 1,
		label: 'public_votation'
	},
	{
		value: 3,
		label: 'fake_public_votation'
	},
	{
		value: 5,
		label: 'private_votation'
	}
];

describe('canReorderPoints', () => {
	const council = {
		statute: {
			canReorderPoints: 1
		}
	};
	it('should return true when the statute have canReorderPoints == 1', () => {
		assert.equal(CBX.canReorderPoints(council), true);
	});
});

describe('showAddCouncilAttachments', () => {
	it('should return true when the num of attachments < max permitted files', () => {
		assert.equal(
			CBX.showAddCouncilAttachment([
				{ filesize: 100 },
				{ filesize: 100 },
				{ filesize: 100 },
				{ filesize: 100 },
				{ filesize: 100 }
			]),
			false
		);

		assert.equal(
			CBX.showAddCouncilAttachment({
				attachments: []
			}),
			true
		);
	});
});

describe('canAddCouncilAttachments', () => {
	it('should return true when the total size of the attachments < total permitted size', () => {
		assert.equal(
			CBX.canAddCouncilAttachment(
				{
					attachments: [
						{ filesize: 10000 },
						{ filesize: 10000 },
						{ filesize: 100 }
					]
				},
				1000
			),
			false
		);

		assert.equal(
			CBX.canAddCouncilAttachment(
				{
					attachments: [{ filesize: 1000 }]
				},
				100000
			),
			false
		);

		assert.equal(
			CBX.canAddCouncilAttachment(
				{
					attachments: []
				},
				1000
			),
			true
		);

		assert.equal(
			CBX.canAddCouncilAttachment(
				{
					attachments: [{ filesize: 1000 }]
				},
				1000
			),
			true
		);
	});
});

describe('canToggleAgendaVoting', () => {
	it('should return true if the council is started and the agenda is not informative and is already closed', () => {
		assert.equal(
			CBX.showAgendaVotingsToggle(
				{ councilStarted: 1 },
				{
					subjectType: 0,
					votingState: 0
				}
			),
			false
		);
		assert.equal(
			CBX.showAgendaVotingsToggle(
				{ councilStarted: 0 },
				{
					subjectType: 1,
					votingState: 0
				}
			),
			false
		);
		assert.equal(
			CBX.showAgendaVotingsToggle(
				{ councilStarted: 1 },
				{
					subjectType: 1,
					votingState: 2
				}
			),
			false
		);
		assert.equal(
			CBX.showAgendaVotingsToggle(
				{ councilStarted: 1 },
				{
					subjectType: 1,
					votingState: 0
				}
			),
			true
		);
	});
});

describe('councilHasVideo', () => {
	it('should return true when the councilType === 0', () => {
		assert.equal(
			CBX.councilHasVideo({
				councilType: 1
			}),
			false
		);
		assert.equal(
			CBX.councilHasVideo({
				councilType: 'NO'
			}),
			false
		);
		assert.equal(
			CBX.councilHasVideo({
				councilType: 0
			}),
			true
		);
	});
});

describe('Census has participations', () => {
	it('should return true when the census quorum prototype === 1', () => {
		assert.equal(
			CBX.censusHasParticipations({
				quorumPrototype: 1
			}),
			true
		);
		assert.equal(
			CBX.censusHasParticipations({
				quorumPrototype: 0
			}),
			false
		);
		assert.equal(
			CBX.censusHasParticipations({
				prototype: 0
			}),
			false
		);
	});
});

describe('Point has votations', () => {
	it('should return true when the point type is 1, 3 or 5', () => {
		assert.equal(CBX.hasVotation(1), true);
		assert.equal(CBX.hasVotation(), false);
		assert.equal(CBX.hasVotation(3), true);
		assert.equal(CBX.hasVotation(5), true);
		assert.equal(CBX.hasVotation('False'), false);
	});
});

describe('Majority needs an input from user', () => {
	it('should return true in the cases 0, 5 and 6', () => {
		assert.equal(CBX.majorityNeedsInput('0'), false);
		assert.equal(CBX.majorityNeedsInput(0), true);
		assert.equal(CBX.majorityNeedsInput(5), true);
		assert.equal(CBX.majorityNeedsInput(6), true);
		assert.equal(CBX.majorityNeedsInput(), false);
		assert.equal(CBX.majorityNeedsInput(-1), false);
	});
});

describe('Majority is fraction', () => {
	it('should return true when the value is 5', () => {
		assert.equal(CBX.isMajorityFraction('5'), false);
		assert.equal(CBX.isMajorityFraction(0), false);
		assert.equal(CBX.isMajorityFraction(), false);
		assert.equal(CBX.isMajorityFraction(5), true);
	});
});

describe('Majority is percentage', () => {
	it('should return true when the values is 0', () => {
		assert.equal(CBX.isMajorityPercentage('0'), false);
		assert.equal(CBX.isMajorityPercentage(0), true);
		assert.equal(CBX.isMajorityPercentage(), false);
		assert.equal(CBX.isMajorityPercentage(5), false);
	});
});

describe('Majority is number', () => {
	it('should return true when the values is 6', () => {
		assert.equal(CBX.isMajorityNumber('6'), false);
		assert.equal(CBX.isMajorityNumber(6), true);
		assert.equal(CBX.isMajorityNumber(), false);
		assert.equal(CBX.isMajorityNumber(5), false);
	});
});

describe('Return if the config have exitsAct selected', () => {
	it('should return true when statute.existsAct === 1', () => {
		assert.equal(
			CBX.hasAct({
				existsAct: '1'
			}),
			false
		);
		assert.equal(
			CBX.hasAct({
				existsAct: 0
			}),
			false
		);
		assert.equal(
			CBX.hasAct({
				act: 1
			}),
			false
		);
		assert.equal(
			CBX.hasAct({
				existsAct: 1
			}),
			true
		);
	});
});

describe('Return true is it shouldnt be more pages', () => {
	it('should return true when the num of pages is enough for the total elements', () => {
		assert.equal(Pagination.hasMorePages(3, 16, 5), true);
		assert.equal(Pagination.hasMorePages(3, 15, 5), false);
		assert.equal(Pagination.hasMorePages(3, 14, 5), false);
	});
});

describe('Return a subarray of voting types, depending on the statute config', () => {
	it('should return the correct options from the array', () => {
		assert.deepEqual(
			CBX.filterAgendaVotingTypes(votingTypes, {
				existsPresentWithRemoteVote: 1
			}),
			[
				{
					value: 0,
					label: 'text'
				},
				{
					value: 1,
					label: 'public_votation'
				}
			]
		);
		assert.deepEqual(
			CBX.filterAgendaVotingTypes(votingTypes, {
				existsPresentWithRemoteVote: 0
			}),
			votingTypes
		);
		assert.deepEqual(
			CBX.filterAgendaVotingTypes(votingTypes, {
				existsPresentWithRemoteVote: -1
			}),
			votingTypes
		);
	});
});

describe('Return true if the council statutes have the exists second call activated', () => {
	it('Should return true when is 1 and false otherwise', () => {
		assert.equal(
			CBX.hasSecondCall({
				existsSecondCall: '1'
			}),
			false
		);
		assert.equal(
			CBX.hasSecondCall({
				existsSecondCall: 0
			}),
			false
		);
		assert.equal(
			CBX.hasSecondCall({
				existsSecondCall: 1
			}),
			true
		);
	});
});

describe('Check if the distance between the first and second date exceeds the minimum value set in the statute', () => {
	it('Should return true when is bigger than the minium false otherwise', () => {
		assert.equal(
			CBX.checkMinimumDistanceBetweenCalls(
				'04-10-2018 12:00',
				'04-10-2018 12:30',
				{ minimumSeparationBetweenCall: 10 }
			),
			true
		);
		assert.equal(
			CBX.checkMinimumDistanceBetweenCalls(
				'04-10-2018 12:00',
				'04-10-2018 12:05',
				{ minimumSeparationBetweenCall: 10 }
			),
			false
		);
		assert.equal(
			CBX.checkMinimumDistanceBetweenCalls(
				'04-10-2018 12:00',
				'04-10-2018 12:00',
				{ minimumSeparationBetweenCall: 10 }
			),
			false
		);
		assert.equal(
			CBX.checkMinimumDistanceBetweenCalls(
				'04-10-2018 12:00',
				'04-10-2018 11:00',
				{ minimumSeparationBetweenCall: 10 }
			),
			false
		);
	});
});

describe('Takes a string a returns the same string with all HTML tags stripped', () => {
	it('Should return the correct string', () => {
		assert.equal(CBX.removeHTMLTags('<p>Test string</p>'), 'Test string');
		assert.equal(
			CBX.removeHTMLTags('<p><b>Test <span>string</span></b></p>'),
			'Test string'
		);
		assert.equal(CBX.removeHTMLTags('Test string'), 'Test string');
	});
});

describe('Return if a council have act point', () => {
	it('Should return true when approveActPoint === 1', () => {
		assert.equal(CBX.councilHasActPoint({ approveActDraft: 1 }), true);
		assert.equal(CBX.councilHasActPoint({ approveActDraft: 2 }), false);
		assert.equal(CBX.councilHasActPoint({}), false);
	});
});

describe('Return Formatted filesize to byte, kb, mb or gb', () => {
	it('Should return the correct string', () => {
		assert.equal(CBX.printPrettyFilesize(1023), '1023 Bytes');
		assert.equal(CBX.printPrettyFilesize(1024), '1 KBs');
		assert.equal(CBX.printPrettyFilesize(1048575), '1023.99 KBs');
		assert.equal(CBX.printPrettyFilesize(1048576), '1 MBs');
		assert.equal(CBX.printPrettyFilesize(1073741823), '1023.99 MBs');
		assert.equal(CBX.printPrettyFilesize(1073741824), '1 GBs');
	});
});

describe('Check if the security type needs to show extra info to the user', () => {
	it('should return true when the securityType is either 1 or 2', () => {
		assert.equal(CBX.showUserUniqueKeyMessage({ securityType: 1 }), true);
		assert.equal(CBX.showUserUniqueKeyMessage({ securityType: 2 }), true);
		assert.equal(CBX.showUserUniqueKeyMessage({ securityType: 0 }), false);
		assert.equal(
			CBX.showUserUniqueKeyMessage({ securityType: null }),
			false
		);
	});
});

/*
 - STATUTES

 EXISTE ACTA - DEPENDEN DE ESO ->
 Se incluye en el libro de actas
 Se incluye lista de participantes en acta
 Plantillas de acta

 EXISTE SEGUNDA CONVOCATORIA ->
 Separación mínima entre 1.ª y 2.ª convocatoria1
 Quorum asistencia 2.ª convocatoria

 EXISTE VOTO DELEGADO
 Existe n.º máximo de votos delegados

 SE LIMITA EL ACCESO A SALA DESPUES DEL INICIO REUNIÓN
 Tiempo máximo acceso permitido


 */
