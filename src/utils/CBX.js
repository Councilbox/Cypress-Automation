import React from 'react';
import fileSize from 'filesize';
import {
	MAX_COUNCIL_FILE_SIZE,
	PARTICIPANT_STATES,
	SEND_TYPES,
	MAJORITY_TYPES,
	DRAFT_TYPES,
	USER_ACTIVATIONS,
	COUNCIL_STATES,
	AGENDA_STATES,
	SIGNATURE_PARTICIPANTS_STATES,
	AGENDA_TYPES,
	VOTE_VALUES,
	CUSTOM_AGENDA_VOTING_TYPES,
	PARTICIPANT_TYPE,
	COUNCIL_TYPES,
	GOVERNING_BODY_TYPES,
	ACTIVE_STATES
} from '../constants';
import dropped from '../assets/img/dropped.png';
import delivered from '../assets/img/delivered.png';
import invalidEmailAddress from '../assets/img/invalid_email_address.png';
import notSent from '../assets/img/not_sent.png';
import opened from '../assets/img/opened.png';
import pendingShipping from '../assets/img/pending_shipping.png';
import spam from '../assets/img/spam.png';
import LiveUtil from './live';
import { LiveToast } from '../displayComponents';
import { moment, client, store } from '../containers/App';
import { query } from '../components/company/drafts/companyTags/CompanyTags';
import { TAG_TYPES } from '../components/company/drafts/draftTags/utils';

export const canReorderPoints = council => council.statute.canReorderPoints === 1;

export const formatInt = (num, char = ' ') => {
	if (!num) {
		return 0;
	}

	if (num < 1000) {
		return num;
	}

	let newNum = num.toString().split('').reverse().join('')
		.replace(/(?=\d*\.?)(\d{3})/g, `$1${char}`);
	newNum = newNum.split('').reverse().join('').replace(/^[\.]/, '');
	return newNum;
};

export const getPercentage = (num, total, decimals = 3) => {
	if (!num) {
		return 0;
	}

	const percentage = ((num * 100) / (total)).toFixed(decimals);
	const zero = 0;
	if (Number.isNaN(Number(percentage))) {
		return zero.toFixed(decimals);
	}
	return percentage;
};

export const filterDelegatedVotes = vote => vote.state !== PARTICIPANT_STATES.REPRESENTATED;

export const getActiveVote = agendaVoting => {
	if (!agendaVoting.fixed && agendaVoting.numParticipations > 0) {
		return agendaVoting;
	}

	const activedDelegated = agendaVoting.delegatedVotes.find(vote => !vote.fixed);
	return activedDelegated || agendaVoting;
};

export const getTermsURL = language => {
	switch (language) {
		case 'es':
		case 'gal':
		case 'eu':
		case 'cat':
			return 'https://www.councilbox.com/politica-de-privacidad/';
		default:
			return 'https://www.councilbox.com/en/privacy-policy/';
	}
};


export const showNumParticipations = (numParticipations, company, statute) => {
	if (statute && statute.decimalDigits && statute.decimalDigits) {
		return formatInt(numParticipations / (10 ** statute.decimalDigits));
	}

	if (company && company.id === 546) {
		return formatInt(numParticipations, '.');
	}

	if (!company || !company.type) {
		return formatInt(numParticipations);
	}

	if (company.type === 10) {
		return numParticipations / 1000;
	}

	return formatInt(numParticipations);
};

export const splitExtensionFilename = filename => {
	const array = filename.split('.');
	if (array.length < 2) {
		return 'That`s not a filename';
	}
	return {
		filename: array.slice(0, -1).join('.'),
		extension: array[array.length - 1]
	};
};

export const showAddCouncilAttachment = () => true;

export const hasAccessKey = council => {
	if (!council || !Object.prototype.hasOwnProperty.call(council, 'securityType')) {
		throw new Error('Council securityType missing!');
	}

	return (council.securityType === 1 || council.securityType === 2);
};

export const canAddCouncilAttachment = (council, filesize) => (
	(council.attachments.reduce((a, b) => a + parseInt(b.filesize, 10), 0)
		+ filesize) < MAX_COUNCIL_FILE_SIZE
);

export const trialDaysLeft = (company, date, trialDays) => {
	const left = trialDays - date(new Date()).diff(date(company.creationDate), 'days');
	return left <= 0 || Number.isNaN(Number(left)) ? 0 : left;
};

export const councilStarted = council => council.councilStarted === 1;

export const existsQualityVote = statute => statute.existsQualityVote === 1;

export const showAgendaVotingsToggle = (council, agenda) => (
	council.councilStarted === 1
	&& agenda.subjectType !== 0
	&& agenda.votingState !== 2
);

export const showSendCredentials = participantState => participantState !== PARTICIPANT_STATES.PRESENT
	&& participantState !== PARTICIPANT_STATES.PHYSICALLY_PRESENT
	&& participantState !== PARTICIPANT_STATES.DELEGATED
	&& participantState !== PARTICIPANT_STATES.REPRESENTATED;

export const showAgendaVotingsTable = agenda => (
	agenda.votingState > 0
	&& agenda.subjectType !== 0
);

export const getAgendaTotalVotes = agenda => agenda.positiveVotings + agenda.positiveManual + agenda.negativeVotings + agenda.negativeManual + agenda.abstentionVotings + agenda.abstentionManual + agenda.noVoteVotings + agenda.noVoteManual;

export const getAgendaResult = (agenda, type, data = {}) => {
	const totalVotes = getAgendaTotalVotes(agenda);
	const types = {
		POSITIVE: `${showNumParticipations(agenda.positiveVotings + agenda.positiveManual, data.company, data.council ? data.council.statute : {})} (${getPercentage((agenda.positiveVotings + agenda.positiveManual), (totalVotes))}%)`,
		NUM_POSITIVE: `${agenda.recount.numPositive} (${getPercentage((agenda.recount.numPositive), (agenda.recount.numTotal))}%)`,
		NEGATIVE: `${showNumParticipations(agenda.negativeVotings + agenda.negativeManual, data.company, data.council ? data.council.statute : {})} (${getPercentage((agenda.negativeVotings + agenda.negativeManual), (totalVotes))}%)`,
		NUM_NEGATIVE: `${agenda.recount.numNegative} (${getPercentage((agenda.recount.numNegative), (agenda.recount.numTotal))}%)`,
		ABSTENTION: `${showNumParticipations(agenda.abstentionVotings + agenda.abstentionManual, data.company, data.council ? data.council.statute : {})} (${getPercentage((agenda.abstentionVotings + agenda.abstentionManual), (totalVotes))}%)`,
		NO_VOTE: `${showNumParticipations(agenda.noVoteVotings + agenda.noVoteManual, data.company, data.council ? data.council.statute : {})} (${getPercentage((agenda.noVoteVotings + agenda.noVoteManual), (totalVotes))}%)`,
		NUM_NO_VOTE: `${agenda.recount.numNoVote} (${getPercentage((agenda.recount.numNoVote), (agenda.recount.numTotal))}%)`,
	};

	return types[type];
};

export const userCanCreateCompany = (user, companies) => {
	if (user.actived === USER_ACTIVATIONS.FREE_TRIAL) {
		if (companies) {
			if (companies.length >= 1) {
				return false;
			}
		}
		return true;
	}
	return user.actived === USER_ACTIVATIONS.PREMIUM;
};

export const agendaVotingsOpened = agenda => agenda.votingState === AGENDA_STATES.DISCUSSION || agenda.votingState === 4;

export const agendaClosed = agenda => agenda.pointState === AGENDA_STATES.CLOSED;

export const councilHasVideo = council => council.councilType === 0 || council.councilType === 5;
export const canAddTranslator = council => councilHasVideo(council) && council.room?.type === 'SHUTTER';

export const censusHasParticipations = census => census.quorumPrototype === 1;

export const checkForUnclosedBraces = text => {
	if (text) {
		const open = text.split('{').length - 1;
		const close = text.split('}').length - 1;
		return open !== close;
	}

	return false;
};

export const councilHasParticipations = council => council.statute.quorumPrototype === 1;

export const hasVotation = pointType => pointType !== AGENDA_TYPES.INFORMATIVE;

export const pointIsClosed = agendaPoint => {
	if (hasVotation(agendaPoint.subjectType)) {
		return agendaPoint.votingState === 2 && agendaPoint.pointState === 2;
	}
	return agendaPoint.pointState === 2;
};

export const copyStringToClipboard = str => {
	const el = document.createElement('textarea');
	el.value = str;
	el.setAttribute('readonly', '');
	el.style = { position: 'absolute', left: '-9999px' };
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);
};

export const majorityNeedsInput = majorityType => majorityType === MAJORITY_TYPES.PERCENTAGE
	|| majorityType === MAJORITY_TYPES.NUMBER
	|| majorityType === MAJORITY_TYPES.FRACTION;

export const haveQualityVoteConditions = (agenda, council) => ((agenda.subjectType === AGENDA_TYPES.PUBLIC_ACT || agenda.subjectType === AGENDA_TYPES.PUBLIC_VOTING)
	&& (agenda.majorityType === 1) && (agenda.votingsRecount.positiveVotings + agenda.votingsRecount.positiveManual) === (agenda.votingsRecount.negativeVotings
		+ agenda.votingsRecount.negativeManual) && council.statute.existsQualityVote === 1);

export const canEditPresentVotings = agenda => (agenda.votingState === AGENDA_STATES.DISCUSSION
	|| agenda.votingState === 4) &&
	(
		agenda.subjectType === AGENDA_TYPES.FAKE_PUBLIC_VOTING
		|| agenda.subjectType === AGENDA_TYPES.PRIVATE_VOTING
		|| agenda.subjectType === AGENDA_TYPES.CUSTOM_PRIVATE
		|| agenda.subjectType === AGENDA_TYPES.CUSTOM_PUBLIC
	);

export const approvedByQualityVote = agenda => {
	if (agenda && agenda.qualityVoteSense) {
		return agenda.qualityVoteSense === VOTE_VALUES.POSITIVE;
	}
	return false;
};

export const voteValuesText = vote => {
	switch (vote) {
		case VOTE_VALUES.NO_VOTE:
			return 'no_vote';
		case VOTE_VALUES.NEGATIVE:
			return 'against_btn';
		case VOTE_VALUES.POSITIVE:
			return 'in_favor_btn';
		case VOTE_VALUES.ABSTENTION:
			return 'abstention';
		default:
			return '-';
	}
};

export const isMajorityPercentage = majorityType => majorityType === 0;

export const isMajorityFraction = majorityType => majorityType === 5;

export const isMajorityNumber = majorityType => majorityType === 6;

export const quorumNeedsInput = quorumType => quorumType === 0 || quorumType === 2 || quorumType === 3;

export const isQuorumPercentage = quorumType => quorumType === 0;

export const isQuorumFraction = quorumType => quorumType === 2;

export const isQuorumNumber = quorumType => quorumType === 3;

export const voteAllAtOnce = data => data.council.councilType === 3;

export const showNoVoteButton = ({ config, statute }) => {
	if (statute.hideNoVoteButton === 1) {
		return true;
	}

	if (statute.hideNoVoteButton === 0) {
		return false;
	}

	if (statute.hideNoVoteButton === -1 && config.hideNoVoteButton) {
		return false;
	}

	return true;
};

export const showAbstentionButton = ({ config, statute }) => {
	if (statute.hideAbstentionButton === 1) {
		return true;
	}

	if (statute.hideAbstentionButton === 0) {
		return false;
	}

	if (statute.hideAbstentionButton === -1 && config.hideAbstentionButton) {
		return false;
	}

	return true;
};

export const findOwnVote = (votings, participant) => {
	if (participant.delegateId) {
		return null;
	}

	if (participant.type !== PARTICIPANT_TYPE.REPRESENTATIVE && participant.numParticipations > 0) {
		return votings.find(voting => (
			voting.participantId === participant.id
		));
	}

	return votings.find(voting => (
		((voting.participantId === participant.id && voting.numParticipations > 0)
			|| (voting.delegateId === participant.id &&
				((voting.numParticipations > 0 && voting.author.state === PARTICIPANT_STATES.REPRESENTATED)
					|| voting.author.state !== PARTICIPANT_STATES.REPRESENTATED
				))
		) && !voting.author.voteDenied && !voting.fixed));
};

export const hasAct = statute => statute.existsAct === 1;

export const councilHasComments = statute => statute.existsComments === 1;

export const canDelegateVotes = (statute, participant, ownedVotes) => (statute.existsDelegatedVote === 1
	&& !(participant.hasDelegatedVotes)
	&& participant.type !== PARTICIPANT_TYPE.GUEST
	&& (participant.numParticipations > 0 || ownedVotes?.meta?.totalRepresentedVotes > 0
		|| participant.represented?.length > 0
	)
);

export const canAddDelegateVotes = (statute, participant) => (
	statute.existsDelegatedVote === 1
	&& (participant.type === PARTICIPANT_TYPE.PARTICIPANT || participant.type === PARTICIPANT_TYPE.REPRESENTATIVE)
	&& (participant.state !== PARTICIPANT_STATES.DELEGATED && participant.state !== PARTICIPANT_STATES.REPRESENTATED)
	&& participant.personOrEntity !== 1
);

export const commentWallDisabled = council => council.wallActive !== 1 || council.state === COUNCIL_STATES.PAUSED;

export const canHaveRepresentative = participant => participant.type === PARTICIPANT_TYPE.PARTICIPANT || participant.type === PARTICIPANT_TYPE.REPRESENTATED;

export const delegatedVotesLimitReached = (statute, length) => (
	statute.existMaxNumDelegatedVotes === 1
	&& length >= statute.maxNumDelegatedVotes
);

export const isCustomPoint = subjectType => {
	const customPoint = CUSTOM_AGENDA_VOTING_TYPES.find(type => subjectType === type.value);
	return !!customPoint;
};

export const isMaxGrantedWordsError = error => error.message === 'Too many granted words';

export const getMaxGrantedWordsMessage = (error, translate) => {
	const { maxGrantedWords } = error.originalError.data;
	return translate.initial_granted_word_error.replace('5', maxGrantedWords);
};

export const isConfirmationRequest = subjectType => subjectType === AGENDA_TYPES.CONFIRMATION_REQUEST;

export const hasParticipations = (statute = {}) => statute.quorumPrototype === 1;

export const canBePresentWithRemoteVote = statute => statute.existsPresentWithRemoteVote === 1;

export const isAnonym = subjectType => subjectType === AGENDA_TYPES.PRIVATE_VOTING || subjectType === AGENDA_TYPES.CUSTOM_PRIVATE;
export const getSMSStatusByCode = reqCode => {
	const status = {
		22: 'Entregado',
		20: 'Enviado',
		'-2': <span style={{ color: 'red' }}>Número no válido</span>,
		default: <span style={{ color: 'red' }}>Fallido</span>
	};

	return status[reqCode] ? status[reqCode] : status.default;
};

export const filterAgendaVotingTypes = (votingTypes, _, council = {}) => {
	if (council.councilType === 2) {
		return votingTypes.filter(type => (
			type.label !== 'text'
			&& type.label !== 'custom_nominal_point'
			&& type.label !== 'custom_anonym_point'
			&& type.label !== 'custom_public_point' && type.value !== AGENDA_TYPES.CONFIRMATION_REQUEST
		));
	}

	if (council.councilType === 3) {
		return votingTypes.filter(type => type.label === 'private_votation');
	}
	return votingTypes.filter(type => type.value !== AGENDA_TYPES.CUSTOM_NOMINAL
		&& type.value !== AGENDA_TYPES.CUSTOM_PRIVATE
		&& type.value !== AGENDA_TYPES.CUSTOM_PUBLIC
		&& type.value !== AGENDA_TYPES.CONFIRMATION_REQUEST);
};

export const hasSecondCall = statute => {
	if (!statute) {
		return false;
	}
	return statute.existsSecondCall === 1;
};

export const checkMinimumDistanceBetweenCalls = (
	firstCall,
	secondCall,
	statute
) => {
	const firstDate = moment(
		new Date(firstCall).toISOString(),
		moment.ISO_8601
	);
	const secondDate = moment(
		new Date(secondCall).toISOString(),
		moment.ISO_8601
	);
	const difference = secondDate.diff(firstDate, 'minutes');
	return difference >= statute.minimumSeparationBetweenCall;
};

export const buildDateFromDateTime = (date, time) => {
	const newDate = moment(date);
	const timeSegments = time.split(':');

	newDate.set({
		hours: timeSegments[0],
		minutes: timeSegments[1]
	});

	return newDate.toISOString();
};

export const checkSecondDateAfterFirst = (firstDate, secondDate) => {
	const first = moment(new Date(firstDate).toISOString(), moment.ISO_8601);
	const second = moment(new Date(secondDate).toISOString(), moment.ISO_8601);
	const difference = second.diff(first, 'minutes');
	return difference > 0;
};

export const addMinimumDistance = (date, statute) => {
	const momentDate = moment(new Date(date).toISOString());
	return momentDate.add(statute.minimumSeparationBetweenCall, 'minutes');
};

export const replaceSpecials = string => {
	const specials = ['-', '[', ']', '/', '{', '}', '(', ')', '*', '+', '?', '.', '\\', '^', '$', '|'];
	const regex = RegExp(`[${specials.join('\\')}]`, 'g');
	return string.replace(regex, '\\$&');
};


export const getArticles = () => {
	const articles = {
		el: language => {
			const languages = {
				es: 'El',
				en: 'The',
				gal: 'O',
				cat: 'El',
				pt: 'O'
			};
			return languages[language];
		},
		la: language => {
			const languages = {
				es: 'La',
				en: 'The',
				gal: 'A',
				cat: 'La',
				pt: 'A'
			};
			return languages[language];
		},
		los: language => {
			const languages = {
				es: 'Los',
				en: 'The',
				gal: 'Os',
				cat: 'Els',
				pt: 'Os'
			};
			return languages[language];
		},
		las: language => {
			const languages = {
				es: 'Las',
				en: 'The',
				gal: 'As',
				cat: 'Les',
				pt: 'As'
			};
			return languages[language];
		}
	};

	return articles;
};

export const getDecides = () => {
	const articles = {
		decide: language => {
			const languages = {
				es: 'decide',
				en: 'decides',
				gal: 'decide',
				cat: 'decideix',
				pt: 'decide'
			};
			return languages[language];
		},
		acuerda: language => {
			const languages = {
				es: 'acuerda',
				en: 'agrees',
				gal: 'acorda',
				cat: 'acorda',
				pt: 'concorda'
			};
			return languages[language];
		},
		acuerdan: language => {
			const languages = {
				es: 'acuerdan',
				en: 'agrees',
				gal: 'acordan',
				cat: 'acordan',
				pt: 'concordan'
			};
			return languages[language];
		}
	};

	return articles;
};

export const generateGBDecidesText = (translate, type) => {
	const articles = getArticles();
	const decides = getDecides();

	const labels = {
		1: `${articles.el(translate.selectedLanguage)} ${translate[GOVERNING_BODY_TYPES.ONE_PERSON.label]} ${decides.decide(translate.selectedLanguage)}`,
		2: `${articles.el(translate.selectedLanguage)} ${translate[GOVERNING_BODY_TYPES.ONE_ENTITY.label]} ${decides.decide(translate.selectedLanguage)}`,
		3: `${articles.los(translate.selectedLanguage)} ${translate[GOVERNING_BODY_TYPES.JOINT_ADMIN.label]} ${decides.acuerdan(translate.selectedLanguage)}`,
		4: `${articles.el(translate.selectedLanguage)} ${translate[GOVERNING_BODY_TYPES.SOLIDARY_ADMIN.label]} ${decides.decide(translate.selectedLanguage)}`,
		5: `${articles.el(translate.selectedLanguage)} ${translate[GOVERNING_BODY_TYPES.COUNCIL.label]} ${decides.acuerda(translate.selectedLanguage)}`
	};

	return labels[type] ? labels[type] : labels[0];
};

export const generateGBAgreements = (translate, type) => {
	const labels = {
		0: '',
		1: '',
		2: '',
		3: translate.jointly_decides,
		4: translate.in_solidarity_decides,
		5: ''
	};

	return labels[type] ? labels[type] : labels[0];
};


export const getGoverningText = (translate, type) => {
	const articles = getArticles();

	const labels = {
		0: `${translate[GOVERNING_BODY_TYPES.NONE.label]}`,
		1: `${articles.el(translate.selectedLanguage)} ${translate[GOVERNING_BODY_TYPES.ONE_PERSON.label]}`,
		2: `${articles.el(translate.selectedLanguage)} ${translate[GOVERNING_BODY_TYPES.ONE_ENTITY.label]}`,
		3: `${articles.los(translate.selectedLanguage)} ${translate[GOVERNING_BODY_TYPES.JOINT_ADMIN.label]}`,
		4: `${articles.el(translate.selectedLanguage)} ${translate[GOVERNING_BODY_TYPES.SOLIDARY_ADMIN.label]}`,
		5: `${articles.el(translate.selectedLanguage)} ${translate[GOVERNING_BODY_TYPES.COUNCIL.label]}`
	};

	return labels[type] ? labels[type] : labels[0];
};


const sir = {
	es: 'D. / D.ª',
	en: 'Sir / Madam',
	pt: 'D. / D.ª',
	cat: 'D. / D.ª',
	gal: 'D. / D.ª'
};

export const generateGBSoleDecidesText = (translate, type) => {
	const labels = {
		0: `${translate.the_general_meeting} ${translate.agrees}`,
		1: `${translate.the_general_meeting} ${translate.agrees}`,
		6: `${translate.the_sole_shareholder} ${translate.agrees}`,
		7: `${translate.the_sole_shareholder} ${translate.agrees}`,
		8: `${translate.the_sole_shareholder} ${translate.agrees}`,
		9: `${translate.the_sole_shareholder} ${translate.agrees}`
	};

	return labels[type] ? labels[type] : labels[0];
};

export const generateGBSoleProposeText = (translate, type) => {
	const labels = {
		0: translate.the_general_meeting,
		1: translate.the_general_meeting,
		6: translate.the_sole_shareholder,
		7: translate.the_sole_shareholder,
		8: translate.the_sole_shareholder,
		9: translate.the_sole_shareholder
	};

	return labels[type] ? labels[type] : labels[0];
};

export const getGoverningBodySignatories = (translate, type, data) => {
	const blankSpaces = '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';
	const labels = {
		0: () => '',
		1: () => `${sir[translate.selectedLanguage]} ${data.name} ${data.surname || ''}`,
		2: () => `${sir[translate.selectedLanguage]} ${data.name} ${data.surname || ''}`,
		3: () => data.list.filter(admin => admin.sign).reduce((acc, curr, index, array) => `${acc}${curr.name} ${curr.surname || ''}${(index < array.length - 1) ? blankSpaces : ''}`, ''),
		4: () => data.list.filter(admin => admin.sign).reduce((acc, curr, index, array) => `${acc}${curr.name} ${curr.surname || ''}${(index < array.length - 1) ? blankSpaces : ''}`, ''),
		5: () => data.list.filter(admin => admin.sign).reduce((acc, curr, index, array) => `${acc}${curr.name} ${curr.surname || ''}${(index < array.length - 1) ? blankSpaces : ''}`, ''),
	};


	return labels[type] ? labels[type]() : labels[0]();
};

export const generateAgendaText = (translate, agenda) => agenda.reduce((acc, curr, index) => `${acc}<br/>${index + 1}. ${curr.agendaSubject}`, '');

export const buildDelegationsString = (delegated, council, translate) => {
	if (!delegated || delegated.length === 0) {
		return '';
	}

	const texts = {
		es: 'titular de',
		en: 'owner of',
		gal: 'dono de',
		cat: 'con',
		pt: 'proprietário de'
	};

	return delegated.reduce((acc, vote) => `${acc}<p style="border: 1px solid black; padding: 5px;">-${vote.name} ${vote.surname || ''} ${texts[council.language]} ${vote.numParticipations} ${council.quorumPrototype === 1 ? translate.census_type_social_capital.toLowerCase() : translate.votes.toLowerCase()} ${translate.delegates.toLowerCase()} ${vote.representative && vote.representative.name} ${(vote.representative && vote.representative.surname) || ''} </p><br/>`, '');
};

export const buildAttendantString = ({
	attendant, council, total, type
}) => {
	if (type === 'counselors') {
		return `${sir[council.language]} ${attendant.name} ${attendant.surname || ''}`;
	}

	const texts = {
		es: `${sir[council.language]} NAME SURNAME titular de SHARES ${type === 'partners' ? 'participaciones' : 'acciones'}, representando el PERCENTAGE% de capital social `,
		en: `${sir[council.language]} NAME SURNAME owner of SHARES ${type === 'partners' ? 'participations' : 'shares'}, representing the PERCENTAGE% of the total shares `,
		gal: `${sir[council.language]} NAME SURNAME dono de SHARES ${type === 'partners' ? 'participacións' : 'accións'}, representando o PERCENTAGE% do capital social `,
		cat: `${sir[council.language]}  NAME SURNAME con SHARES ${type === 'partners' ? 'participaciones' : 'ações'}, representant el PERCENTAGE% de l'capital social `,
		pt: `${sir[council.language]} NAME SURNAME proprietário de SHARES ${type === 'partners' ? 'participacions' : 'accions'}, representando o PERCENTAGE% do capital social `,
	};

	const representativeOf = {
		es: 'representante de ',
		en: 'representative of ',
		gal: 'representante de ',
		cat: 'representant de ',
		pt: 'representante de ',
	};

	const representativeText = {
		es: `RNAME RSURNAME con SHARES ${type === 'partners' ? 'participaciones' : 'acciones'}, representando el PERCENTAGE% de capital social `,
		en: `RNAME RSURNAME with SHARES ${type === 'partners' ? 'participations' : 'shares'}, representing PERCENTAGE% of the total shares `,
		gal: `RNAME RSURNAME con SHARES ${type === 'partners' ? 'participacións' : 'accións'}, representando o PERCENTAGE% do capital social `,
		cat: `RNAME RSURNAME con SHARES ${type === 'partners' ? 'participaciones' : 'ações'}, representant el PERCENTAGE% de l'capital social `,
		pt: `RNAME RSURNAME con SHARES ${type === 'partners' ? 'participacions' : 'accions'}, representando o PERCENTAGE% do capital social `,
	};

	if (attendant.type === PARTICIPANT_TYPE.REPRESENTATIVE) {
		return `${sir[council.language]} ${attendant.name} ${attendant.surname || ''} ${representativeOf[council.language]} ${attendant.delegationsAndRepresentations.reduce((acc, representated, index) => (acc + (index > 0 ? ',' : ' ') + representativeText[council.language].replace('RNAME RSURNAME ', `${representated.name} ${representated.surname ? `${representated.surname} ` : ''}`)
			.replace('SHARES', representated.socialCapital)
			.replace('PERCENTAGE', ((representated.socialCapital / total) * 100).toFixed(2))), '')}`;
	}

	return texts[council.language]
		.replace('NAME SURNAME', `${attendant.name} ${attendant.surname || ''}`)
		.replace('SHARES', attendant.socialCapital)
		.replace('PERCENTAGE', ((attendant.socialCapital / total) * 100).toFixed(2));
};

export const isActiveState = state => ACTIVE_STATES.findIndex(item => state === item) !== -1;

export const buildAttendantsString = ({ council, total, type }) => (acc, curr) => {
	if (!hasParticipations(council)) {
		return `${acc}${curr.name} ${curr.surname || ''} <br/>`;
	}
	return acc + buildAttendantString({
		attendant: curr, council, total, type
	});
};

export const isAdmin = user => user.roles === 'admin' || user.roles === 'devAdmin';

export const isOrganization = company => company.id === company.corporationId;

export const showOrganizationDashboard = (company, config, user = {}) => (company.type === 12 && (config.oneOnOneDashboard || config.newDashboard)) || (isOrganization(company) && config.organizationDashboard && isAdmin(user));

export const generateCompanyAdminsText = ({ council, company, list }) => {
	const data = company.governingBodyData;
	const governingType = company.governingBodyType;

	const admins = {
		es: 'Administradores',
		en: 'Administrators',
		gal: 'Administradores',
		cat: 'Administradors',
		pt: 'Administradores'
	};

	const buildMultipleAdmins = adminList => adminList.reduce((acc, curr, index, array) => `${acc}${sir[council.language]} ${curr.name} ${curr.surname || ''}${(index < array.length - 1) ? list ? '<br>' : ', ' : ''}`, list ? `${admins[council.language]}: <br>` : '');

	const labels = {
		0: () => '',
		1: () => `${data.name} ${data.surname || ''}`,
		2: () => `${data.name} ${data.surname || ''}`,
		3: () => buildMultipleAdmins(data.list),
		4: () => buildMultipleAdmins(data.list),
		5: () => buildMultipleAdmins(data.list),
	};

	return labels[governingType] ? labels[governingType]() : labels[0]();
};

export const hasRightToVote = participant => participant.numParticipations > 0;

export const checkIfHasVote = attendant => (hasRightToVote(attendant) || attendant.socialCapital > 0)
	|| attendant.delegationsAndRepresentations
		.filter(item => item.state === PARTICIPANT_STATES.REPRESENTATED && (hasRightToVote(item) || item.socialCapital > 0)).length > 0;

export const buildGuestString = ({ guest, council }) => {
	const inQualityOf = {
		es: 'en su calidad de',
		en: 'in quality of',
		gal: 'na sua calidade de',
		cat: 'en la seva qualitat de',
		pt: 'na sua capacidade como'
	};

	return `${sir[council.language]} ${guest.name} ${guest.surname || ''} ${guest.position ? `${inQualityOf[council.language]} ${guest.position}` : ''}`;
};

export const buildShareholdersList = ({ council, total, type }) => {
	if (!council.attendants || council.attendants.length === 0) {
		return '';
	}

	const shareholdersText = {
		es: 'Accionistas',
		en: 'Shareholders',
		gal: 'Accionistas',
		cat: 'Accionistes',
		pt: 'Acionistas'
	};

	const partnersText = {
		es: 'Socios',
		en: 'Partners',
		gal: 'Socios',
		cat: 'Socis',
		pt: 'Parceiros'
	};

	const counselorsList = {
		es: 'Consejeros',
		en: 'Counselors',
		gal: 'Conselleiros',
		cat: 'Consellers',
		pt: 'Conselheiros'
	};

	return council.attendants.filter(checkIfHasVote)
		.reduce((acc, curr) => `${acc}<br>${buildAttendantString({
			attendant: curr, total, council, type
		})}`, `${type === 'partners' ?
			partnersText[council.language]
			: type === 'counselors' ?
				counselorsList[council.language]
				: shareholdersText[council.language]}:`);
};


export const buildGuestList = ({ council, total }) => {
	if (!council.attendants || council.attendants.length === 0) {
		return '';
	}

	const otherAttendants = {
		es: 'Otros asistentes',
		en: 'Other attendants',
		gal: 'Outros asistentes',
		cat: 'Altres assistents',
		pt: 'Outros atendentes'
	};

	return council.attendants.filter(attendant => !checkIfHasVote(attendant))
		.reduce((acc, curr) => `${acc}<br>${buildGuestString({ guest: curr, total, council })}`, `${otherAttendants[council.language]}:`);
};

export const changeVariablesToValues = async (initialText, data, translate) => {
	let text = initialText;
	if (!data || !data.company || !data.council) {
		throw new Error('Missing data');
	}

	const state = store.getState();
	const company = state.companies.list[state.companies.selected];

	if (!text) {
		return '';
	}

	if (company) {
		const response = await client.query({
			query,
			variables: {
				companyId: company.id
			}
		});

		const { companyTags } = response.data;

		if (companyTags && companyTags.length > 0) {
			companyTags.forEach(tag => {
				text = text.replace(new RegExp(`{{${replaceSpecials(tag.key)}}}`, 'g'), tag.value);
			});
		}
	}

	if (data.council.dateStart) {
		const replaced = /<span id="{{dateFirstCall}}">(.*?|\n)<\/span>/.test(text);

		if (replaced) {
			text = text.replace(
				/<span id="{{dateFirstCall}}">(.*?|\n)<\/span>/ig,
				`<span id="{{dateFirstCall}}">${moment(
					new Date(data.council.dateStart).toISOString(),
					moment.ISO_8601
				).format('LLL')
				}</span>`
			);
		} else {
			text = text.replace(
				/{{dateFirstCall}}/g,
				`<span id="{{dateFirstCall}}">${moment(
					new Date(data.council.dateStart).toISOString(),
					moment.ISO_8601
				).format('LLL')
				}</span>`
			);
		}
	}

	if (data.council.dateStart2NdCall) {
		const replaced = /<span id="{{dateSecondCall}}">(.*?|\n)<\/span>/.test(text);

		if (replaced) {
			text = text.replace(
				/<span id="{{dateSecondCall}}">(.*?|\n)<\/span>/ig,
				`<span id="{{dateSecondCall}}">${moment(
					new Date(data.council.dateStart).toISOString(),
					moment.ISO_8601
				).format('LLL')
				}</span>`
			);
		} else {
			text = text.replace(
				/{{dateSecondCall}}/g,
				`<span id="{{dateSecondCall}}">${moment(
					new Date(data.council.dateStart2NdCall).toISOString(),
					moment.ISO_8601
				).format('LLL')
				}</span>`
			);
		}
	}

	text = text.replace(/{{now}}/g, moment().format('LL'));
	text = text.replace(/{{signatories}}/g, getGoverningBodySignatories(translate, data.company.governingBodyType, data.company.governingBodyData));
	text = text.replace(/{{convene}}/g, data.council.emailText);
	text = text.replace(/{{numPresentOrRemote}}/g, data.council.numPresentAttendance + data.council.numRemoteAttendance);
	text = text.replace(/{{numRepresented}}/g, data.council.numDelegatedAttendance);
	text = text.replace(/{{numParticipants}}/g, data.council.numTotalAttendance);
	text = text.replace(/{{percentageSCPresent}}/g, `${data.council.percentageSCPresent}%`);
	text = text.replace(/{{percentageSCRepresented}}/g, `${data.council.percentageSCDelegated}%`);
	text = text.replace(/{{percentageSCTotal}}/g, `${data.council.percentageSCTotal}%`);
	text = text.replace(/{{numParticipationsPresent}}/g, data.council.numParticipationsPresent);
	text = text.replace(/{{numParticipationsRepresented}}/g, data.council.numParticipationsRepresented);
	text = text.replace(/{{delegations}}/, buildDelegationsString(data.council.delegatedVotes, data.council, translate));
	text = text.replace(/{{dateRealStart}}/g, data.council.dateRealStart ? moment(new Date(data.council.dateRealStart).toISOString(),
		moment.ISO_8601).format('LLL') : '');
	text = text.replace(/{{dateSecondCall}}/g, data.council.dateStart2NdCall ? moment(new Date(data.council.dateStart2NdCall).toISOString(),
		moment.ISO_8601).format('LLL') : '');
	text = text.replace(/{{dateEnd}}/g, data.council.dateEnd ? moment(new Date(data.council.dateEnd).toISOString(),
		moment.ISO_8601).format('LLL') : '');
	text = text.replace(/{{firstOrSecondCall}}/g, data.council.firstOrSecondConvene === 1 ?
		translate.first_call
		:
		data.council.firstOrSecondCall === 2 ?
			translate.second_call
			:
			''
	);

	const base = data.council.partTotal;

	text = text.replace(/{{president}}/g, data.council.president);
	text = text.replace(/{{secretary}}/g, data.council.secretary);
	text = text.replace(/{{address}}/g, `${data.council.street} ${data.council.country}`);
	text = text.replace(/{{business_name}}/g, data.company.businessName);
	text = text.replace(/{{city}}/g, data.council.city);
	text = text.replace(/{{attendants|Attendants}}/g, data.council.attendants ? data.council.attendants.reduce(buildAttendantsString(data.council, base), '') : '');

	if (data.council.street) {
		const replaced = /<span id="{{street}}">(.*?|\n)<\/span>/.test(text);

		if (replaced) {
			text = text.replace(
				/<span id="{{street}}">(.*?|\n)<\/span>/ig,
				`<span id="{{street}}">${data.council.remoteCelebration === 1 ? translate.remote_celebration : data.council.street
				}</span>`
			);
		} else {
			text = text.replace(
				/{{street}}/g,
				`<span id="{{street}}">${data.council.remoteCelebration === 1 ? translate.remote_celebration : data.council.street
				}</span>`
			);
		}
	}

	text = text.replace(/{{GBdecides}}/g, generateGBDecidesText(translate, data.company.governingBodyType));
	text = text.replace(/{{GoverningBody}}/g, getGoverningText(translate, data.company.governingBodyType));
	text = text.replace(/{{GM\/SoleDecides}}/g, generateGBSoleDecidesText(translate, data.company.type));
	text = text.replace(/{{GM\/SolePropose}}/g, generateGBSoleProposeText(translate, data.company.type));
	text = text.replace(/{{GBAgreements}}/g, generateGBAgreements({ translate, company: data.company.governingBodyType }));
	text = text.replace(/{{companyAdmins}}/, generateCompanyAdminsText({ translate, company: data.company, council: data.council }));
	text = text.replace(/{{shareholdersList}}/, buildShareholdersList({ council: data.council, total: base }));
	text = text.replace(/{{companyAdminsList}}/, generateCompanyAdminsText({
		translate, company: data.company, council: data.council, list: true
	}));
	text = text.replace(/{{guestList}}/, buildGuestList({ council: data.council, total: base }));
	text = text.replace(/{{partnersList}}/, buildShareholdersList({ council: data.council, total: base, type: 'partners' }));
	text = text.replace(/{{counselorsList}}/, buildShareholdersList({ council: data.council, total: base, type: 'counselors' }));


	text = text.replace(/{{Agenda}}|{{agenda}}/g, data.council.agenda ? generateAgendaText(translate, data.council.agenda) : '');
	text = text.replace(/{{dateEnd}}/g, moment(new Date(data.council.dateEnd)).format('LLL'));
	text = text.replace(/{{numberOfShares}}/g, data.council.currentQuorum);
	text = text.replace(/{{percentageOfShares}}/g, (data.council.currentQuorum / (parseInt(base, 10) * 100)).toFixed(3));
	text = text.replace(/{{country_state}}/g, data.council.countryState);
	if (data.votings) {
		text = text.replace(/{{positiveVotings}}/g, data.votings.positive);
		text = text.replace(/{{negativeVotings}}/g, data.votings.negative);
		text = text.replace(/{{positiveSCTotal}}/g, data.votings.SCFavorTotal);
		text = text.replace(/{{negativeSCTotal}}/g, data.votings.SCAgainstTotal);
		text = text.replace(/{{abstentionSCTotal}}/g, data.votings.SCAbstentionTotal);
		text = text.replace(/{{positiveSCPresent}}/g, data.votings.SCFavorPresent);
		text = text.replace(/{{negativeSCPresent}}/g, data.votings.SCAgainstTotal);
		text = text.replace(/{{abstentionSCPresent}}/g, data.votings.SCAbstentionTotal);
		text = text.replace(/{{numPositive}}/g, data.votings.numPositive);
		text = text.replace(/{{numAbstention}}/g, data.votings.numAbstention);
		text = text.replace(/{{numNegative}}/g, data.votings.numNegative);
		text = text.replace(/{{numNoVote}}/g, data.votings.numNoVote);
	} else {
		// text = text.replace(/{{positiveVotings}}/g, 0);
		// text = text.replace(/{{negativeVotings}}/g, 0);
	}
	return text;
};

export const getTagVariablesByDraftType = (draftType, translate) => {
	const tags = {
		dateFirstCall: {
			value: '{{dateFirstCall}}',
			label: translate['1st_call_date']
		},
		dateSecondCall: {
			value: '{{dateSecondCall}}',
			label: translate['2nd_call_date']
		},
		businessName: {
			value: '{{business_name}}',
			label: translate.business_name
		},
		street: {
			value: '{{street}}',
			label: translate.new_location_of_celebrate
		},
		city: {
			value: '{{city}}',
			label: translate.company_new_locality
		},
		countryState: {
			value: '{{country_state}}',
			label: translate.company_new_country_state
		},
		now: {
			value: '{{now}}',
			label: translate.actual_date
		},
		dateRealStart: {
			value: '{{dateRealStart}}',
			label: translate.date_real_start
		},
		firstOrSecondCall: {
			value: '{{firstOrSecondCall}}',
			label: translate.first_or_second_call
		},
		president: {
			value: '{{president}}',
			label: translate.president
		},
		secretary: {
			value: '{{secretary}}',
			label: translate.secretary
		},
		numPresentOrRemote: {
			value: '{{numPresentOrRemote}}',
			label: translate.number_attentands_in_person
		},
		numRepresented: {
			value: '{{numRepresented}}',
			label: 'Nº de asistentes representados' // TRADUCCION
		},
		numParticipants: {
			value: '{{numParticipants}}',
			label: 'Nº de asistentes totales' // TRADUCCION
		},
		numParticipationsPresent: {
			value: '{{numParticipationsPresent}}',
			label: translate.number_shares_personally
		},
		numParticipationsRepresented: {
			value: '{{numParticipationsRepresented}}',
			label: translate.number_shares_represented,
		},
		percentageSCPresent: {
			value: '{{percentageSCPresent}}',
			label: translate.percentage_shares_personally,
		},
		percentageSCRepresented: {
			value: '{{percentageSCRepresented}}',
			label: translate.percentage_shares_represented
		},
		percentageSCTotal: {
			value: '{{percentageSCTotal}}',
			label: translate.percentage_quorum
		},
		convene: {
			value: '{{convene}}',
			label: 'Texto de la convocatoria' // TRADUCCION
		},
		numberOfShares: {
			value: '{{numberOfShares}}',
			label: translate.number_of_participations
		},
		percentageOfShares: {
			value: '{{percentageOfShares}}',
			label: translate.social_capital_percentage
		},
		dateEnd: {
			value: '{{dateEnd}}',
			label: translate.date_end
		},
		governingBody: {
			value: '{{GoverningBody}}',
			label: translate.governing_body
		},
		gbDecides: {
			value: '{{GBdecides}}',
			label: '[Órgano de gobierno] decide'// TRADUCCION
		},
		soleDecides: {
			value: '{{GM/SoleDecides}}',
			label: '[Junta Gral./Socio/Accionista único] decide'// TRADUCCION
		},
		solePropose: {
			value: '{{GM/SolePropose}}',
			label: '[Junta Gral./Socio/Accionista único] propone'// TRADUCCION
		},
		positiveVotings: {
			value: '{{positiveVotings}}',
			label: translate.positive_votings
		},
		negativeVotings: {
			value: '{{negativeVotings}}',
			label: translate.negative_votings
		},
		numPositive: {
			value: '{{numPositive}}',
			label: translate.num_positive
		},
		numNegative: {
			value: '{{numNegative}}',
			label: translate.num_negative
		},
		numAbstention: {
			value: '{{numAbstention}}',
			label: translate.num_abstention
		},
		numNoVote: {
			value: '{{numNoVote}}',
			label: translate.num_no_vote
		},
		positiveSCTotal: {
			value: '{{positiveSCTotal}}',
			label: '% a favor / total capital social'
		},
		negativeSCTotal: {
			value: '{{negativeSCTotal}}',
			label: '% en contra / total capital social'
		},
		abstentionSCTotal: {
			value: '{{abstentionSCTotal}}',
			label: '% abstención / total capital social'
		},
		positiveSCPresent: {
			value: '{{positiveSCPresent}}',
			label: '% a favor / capital social presente'
		},
		negativeSCPresent: {
			value: '{{negativeSCPresent}}',
			label: '% en contra / capital social presente'
		},
		abstentionSCPresent: {
			value: '{{abstentionSCPresent}}',
			label: '% abstención / capital social presente'
		},
		gbAgreements: {
			value: '{{GBAgreements}}',
			label: '[Solidariamente/Mancomunadamente]'
		},
		agenda: {
			value: '{{Agenda}}',
			label: translate.agenda
		},
		signatories: {
			value: '{{signatories}}',
			label: translate.signatories
		},
		attendants: {
			value: '{{attendants}}',
			label: translate.census_type_assistants
		},
		shareholdersList: {
			value: '{{shareholdersList}}',
			label: 'Lista de accionistas'// TRADUCCION
		},
		partnersList: {
			value: '{{partnersList}}',
			label: 'Lista de socios'// TRADUCCION
		},
		counselorsList: {
			value: '{{counselorsList}}',
			label: 'Lista de consejeros'// TRADUCCION
		},
		guestList: {
			value: '{{guestList}}',
			label: 'Lista de otros asistentes'// TRADUCCION
		},
		companyAdmins: {
			value: '{{companyAdmins}}',
			label: 'Administradores de la entidad'// TRADUCCION
		},
		companyAdminsList: {
			value: '{{companyAdminsList}}',
			label: 'Listado de administradores'// TRADUCCION
		},
		delegations: {
			value: '{{delegations}}',
			label: translate.delegations
		}
	};

	const handler = {
		get: (target, name) => {
			if (!target[name]) {
				throw new Error('Invalid tag');
			}

			return target[name];
		}
	};

	const smartTags = new Proxy(tags, handler);


	const types = {
		[DRAFT_TYPES.CONVENE_HEADER]: [
			smartTags.dateFirstCall,
			smartTags.dateSecondCall,
			smartTags.businessName,
			smartTags.street,
			smartTags.city,
			smartTags.countryState,
			smartTags.governingBody
		],

		[DRAFT_TYPES.AGENDA]: [
			smartTags.city,
			smartTags.countryState
		],

		[DRAFT_TYPES.INTRO]: [
			smartTags.businessName,
			smartTags.now,
			smartTags.dateRealStart,
			smartTags.dateFirstCall,
			smartTags.dateSecondCall,
			smartTags.firstOrSecondCall,
			smartTags.city,
			smartTags.street,
			smartTags.governingBody,
			smartTags.president,
			smartTags.secretary,
			smartTags.attendants,
			smartTags.delegations,
			smartTags.numPresentOrRemote,
			smartTags.numRepresented,
			smartTags.numParticipants,
			smartTags.numParticipationsPresent,
			smartTags.numParticipationsRepresented,
			smartTags.percentageSCPresent,
			smartTags.percentageSCRepresented,
			smartTags.percentageSCTotal,
			smartTags.convene
		],

		[DRAFT_TYPES.CONSTITUTION]: [
			smartTags.businessName,
			smartTags.governingBody,
			smartTags.president,
			smartTags.secretary,
			smartTags.street,
			smartTags.city,
			smartTags.dateRealStart,
			smartTags.now,
			smartTags.attendants,
			smartTags.delegations,
			smartTags.numPresentOrRemote,
			smartTags.numRepresented,
			smartTags.numParticipants,
			smartTags.numParticipationsPresent,
			smartTags.numParticipationsRepresented,
			smartTags.percentageSCPresent,
			smartTags.percentageSCRepresented,
			smartTags.percentageSCTotal,
			smartTags.numberOfShares,
			smartTags.percentageOfShares
		],

		[DRAFT_TYPES.CONCLUSION]: [
			smartTags.dateEnd,
			smartTags.governingBody,
			smartTags.president,
			smartTags.secretary
		],

		[DRAFT_TYPES.CERTIFICATE_HEADER]: [
			smartTags.dateFirstCall,
			smartTags.dateSecondCall,
			smartTags.dateRealStart,
			smartTags.businessName,
			smartTags.street,
			smartTags.city,
			smartTags.countryState,
			smartTags.governingBody,
			smartTags.president,
			smartTags.secretary,
			smartTags.attendants,
			smartTags.convene,
			smartTags.agenda,
			smartTags.percentageSCPresent,
			smartTags.percentageSCRepresented,
			smartTags.percentageSCTotal,
			smartTags.numPresentOrRemote,
			smartTags.numRepresented,
			smartTags.numParticipants,
		],

		[DRAFT_TYPES.CERTIFICATE_FOOTER]: [
			smartTags.dateFirstCall,
			smartTags.dateSecondCall,
			smartTags.dateEnd,
			smartTags.businessName,
			smartTags.street,
			smartTags.city,
			smartTags.countryState,
			smartTags.now,
			smartTags.president,
			smartTags.secretary,
			smartTags.signatories,
			smartTags.attendants
		],

		[DRAFT_TYPES.COMMENTS_AND_AGREEMENTS]: [
			smartTags.dateFirstCall,
			smartTags.businessName,
			smartTags.street,
			smartTags.now,
			smartTags.governingBody,
			smartTags.gbDecides,
			smartTags.soleDecides,
			smartTags.solePropose,
			smartTags.gbAgreements,
			smartTags.positiveVotings,
			smartTags.negativeVotings,
			smartTags.numPositive,
			smartTags.numNegative,
			smartTags.numAbstention,
			smartTags.numNoVote,
			smartTags.positiveSCTotal,
			smartTags.negativeSCTotal,
			smartTags.abstentionSCTotal,
			smartTags.positiveSCPresent,
			smartTags.negativeSCPresent,
			smartTags.abstentionSCPresent
		]
	};

	return types[draftType] ? types[draftType] : Object.keys(tags).map(key => tags[key]);
};

export const isRepresentative = participant => participant.type === 2;

export const isRepresented = participant => participant.state === PARTICIPANT_STATES.REPRESENTATED;

export const getSendType = value => SEND_TYPES[value];

export const removeHTMLTags = string => string.replace(/<(?:.|\n)*?>/gm, '').replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec)).replace(/&nbsp;/g, ' ');

export const councilHasActPoint = council => council.approveActDraft === 1;

export const getActPointSubjectType = () => 2;

export const generateStatuteTag = (statute, translate) => ({
	[`statute_${statute.statuteId}`]: {
		label: translate[statute.title] || statute.title,
		name: `statute_${statute.statuteId}`,
		type: TAG_TYPES.STATUTE
	}
});

export const generateInitialDates = statute => {
	if (statute.existsAdvanceNoticeDays === 1) {
		const momentDate = moment(new Date().toISOString());
		const dates = {
			dateStart: momentDate.add(statute.advanceNoticeDays, 'days').toISOString()
		};
		if (hasSecondCall(statute)) {
			dates.dateStart2NdCall = addMinimumDistance(dates.dateStart, statute);
		}

		return dates;
	}
	return {
		dateStart: new Date(),
		...(hasSecondCall(statute) ? { dateStart2NdCall: new Date() } : {})
	};
};

export const checkMinimumAdvance = (date, statute) => {
	if (statute.existsAdvanceNoticeDays === 1) {
		const firstDate = moment(
			new Date(date).toISOString(),
			moment.ISO_8601
		);
		const secondDate = moment(
			new Date().toISOString(),
			moment.ISO_8601
		);
		const difference = firstDate.diff(secondDate, 'days');
		return difference >= statute.advanceNoticeDays;
	}

	return true;
};

export const showUserUniqueKeyMessage = council => council.securityType === 1 || council.securityType === 2;

export const councilIsNotified = council => council.state === 10;

export const councilIsInTrash = council => council.state === COUNCIL_STATES.CANCELED;

export const councilRoomOpened = council => council.state >= COUNCIL_STATES.ROOM_OPENED;

export const councilIsNotLiveYet = council => (
	council.state < COUNCIL_STATES.ROOM_OPENED
	&& council.state > COUNCIL_STATES.CANCELED
);

export const checkRepeatedItemValue = items => {
	const differentValues = new Map();
	const found = new Set();
	items.forEach((item, index) => {
		if (item.value) {
			if (differentValues.has(item.value)) {
				found.add(differentValues.get(item.value));
				found.add(index);
			}
			differentValues.set(item.value, index);
		}
	});
	return Array.from(found.values());
};

export const councilIsPreparing = council => (
	council.state === COUNCIL_STATES.PREPARING || council.state === COUNCIL_STATES.SAVED
);

export const councilIsLive = council => (
	councilRoomOpened(council)
	&& council.state < COUNCIL_STATES.FINISHED
);

export const councilIsFinished = council => (
	council.state >= COUNCIL_STATES.FINISHED
	&& council.state !== COUNCIL_STATES.NOT_CELEBRATED
);

export const councilIsNotCelebrated = council => council.state === COUNCIL_STATES.NOT_CELEBRATED || council.active === 0;

export const councilHasAssistanceConfirmation = council => council.confirmAssistance === 1;

export const printPrettyFilesize = filesize => fileSize(filesize);

export const isPresentVote = vote => vote.presentVote === 5 || vote.presentVote === 7;

export const addDecimals = (num, fixed) => {
	const numString = num.toString();
	return numString.slice(0, numString.indexOf('.') + fixed + 1);
};

function s2ab(s) {
	const buf = new ArrayBuffer(s.length);
	const view = new Uint8Array(buf);
	for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
	return buf;
}

export const unaccent = string => {
	if (!string) {
		return '';
	}
	return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

function dataURItoBlob(dataURI) {
	const byteString = atob(dataURI);
	const arrayBuffer = new ArrayBuffer(byteString.length);
	const ia = new Uint8Array(arrayBuffer);
	for (let i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}
	return arrayBuffer;
}

export const downloadFile = (base64, filetype, filename) => {
	const bufferArray = dataURItoBlob(base64);

	if (window.navigator.msSaveOrOpenBlob) {
		const fileData = [bufferArray];
		const blobObject = new Blob(fileData, {
			type: 'data:application/stream;base64'
		});
		return window.navigator.msSaveOrOpenBlob(blobObject, filename);
	}

	let blob;
	if (filetype === 'excel') {
		blob = new Blob([s2ab(atob(bufferArray))], {
			type: ''
		});
	} else {
		blob = new Blob([bufferArray], {
			type: filetype
		});
	}

	const objectUrl = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.style.cssText = 'display: none';
	document.body.appendChild(a);
	a.href = objectUrl;
	a.download = filename;// .replace(/\./, '');
	a.click();

	return true;
};

export const getSignerStatusTranslateField = status => {
	switch (status) {
		case SIGNATURE_PARTICIPANTS_STATES.IN_QUEUE:
			return 'in_queue';
		case SIGNATURE_PARTICIPANTS_STATES.SENT:
			return 'sent';
		case SIGNATURE_PARTICIPANTS_STATES.OPENED:
			return 'opened';
		case SIGNATURE_PARTICIPANTS_STATES.SIGNING:
			return 'signing';
		case SIGNATURE_PARTICIPANTS_STATES.SIGNED:
			return 'signed';
		case SIGNATURE_PARTICIPANTS_STATES.EXPIRED:
			return 'expired';
		case SIGNATURE_PARTICIPANTS_STATES.CANCELED:
			return 'canceled';
		case SIGNATURE_PARTICIPANTS_STATES.REJECTED:
			return 'rejected';
		default:
			return 'error';
	}
};

export const checkCouncilState = (council, company, bHistory, expected) => {
	switch (council.state) {
		case COUNCIL_STATES.DRAFT:
			if (expected !== 'draft') {
				bHistory.replace(`/company/${company.id}/council/${council.id}`);
			}
			break;
		case COUNCIL_STATES.PRECONVENE:
			if (expected !== 'draft') {
				bHistory.replace(`/company/${company.id}/council/${council.id}`);
			}
			break;
		case COUNCIL_STATES.SAVED:
			if (expected !== 'convened' && expected !== 'live') {
				bHistory.replace(
					`/company/${company.id}/council/${council.id}/prepare`
				);
			}
			break;
		case COUNCIL_STATES.PREPARING:
			if (expected !== 'convened' && expected !== 'live') {
				bHistory.replace(
					`/company/${company.id}/council/${council.id}/prepare`
				);
			}
			break;
		case COUNCIL_STATES.ROOM_OPENED:
		case COUNCIL_STATES.PAUSED:
		case COUNCIL_STATES.APPROVING_ACT_DRAFT:
			if (expected !== 'live') {
				bHistory.replace(
					`/company/${company.id}/council/${council.id}/live`
				);
			}
			break;
		case COUNCIL_STATES.FINISHED:
		case COUNCIL_STATES.APPROVED:
		case COUNCIL_STATES.FINAL_ACT_SENT:
		case COUNCIL_STATES.CANCELED:
		case COUNCIL_STATES.NOT_CELEBRATED:
		case COUNCIL_STATES.FINISHED_WITHOUT_ACT:
			if (expected !== 'finished') {
				bHistory.replace(
					`/company/${company.id}/council/${council.id}/finished`
				);
			}
			break;
		default:
			break;
	}
};

export const participantIsTranslator = participant => participant.type === PARTICIPANT_TYPE.TRANSLATOR;
export const participantIsGuest = participant => participant.type === PARTICIPANT_TYPE.GUEST ||
	participantIsTranslator(participant);
export const participantIsRepresentative = participant => participant.type === PARTICIPANT_TYPE.REPRESENTATIVE;

export const getAttendanceIntentionTooltip = intention => {
	switch (intention) {
		case PARTICIPANT_STATES.REMOTE:
			return 'remote_assistance_short';

		case PARTICIPANT_STATES.PHYSICALLY_PRESENT:
			return 'confirmed_assistance';

		case PARTICIPANT_STATES.NO_PARTICIPATE:
			return 'no_assist_assistance';

		case PARTICIPANT_STATES.DELEGATED:
			return 'delegated_in';

		case PARTICIPANT_STATES.SENT_VOTE_LETTER:
			return 'vote_letter_sent';

		case PARTICIPANT_STATES.EARLY_VOTE:
			return 'participant_vote_fixed';
		default:
			return '';
	}
};

export const getAttendanceIntentionIcon = (intention, style) => {
	switch (intention) {
		case PARTICIPANT_STATES.REMOTE:
			return <i className={'fa fa-globe'} style={style}></i>;
		case PARTICIPANT_STATES.PHYSICALLY_PRESENT:
			return <i className={'fa fa-user'} style={style}></i>;
		case PARTICIPANT_STATES.DELEGATED:
			return <i className={'fa fa-users'} style={style}></i>;
		case PARTICIPANT_STATES.NO_PARTICIPATE:
			return <i className={'fa fa-times'} style={style}></i>;
		case PARTICIPANT_STATES.EARLY_VOTE:
		case PARTICIPANT_STATES.SENT_VOTE_LETTER:
			return <i className="material-icons" style={{ ...style, transform: 'scale(0.8)' }}>how_to_vote</i>;
		default:
			return 'fa fa-question';
	}
};

export const getEmailIconByReqCode = reqCode => {
	switch (reqCode) {
		case -1:
			return notSent;
		case 0:
			return notSent;

		case 20:
			return pendingShipping;

		case 22:
			return delivered;

		case 25:
			return opened;

		case 32:
			return 'clicked';

		case 35:
			return spam;

		case 36:
			return invalidEmailAddress;

		case 37:
		case 39:
		case 40:
			return dropped;
		default:
			return null;
	}
};

export const agendaPointOpened = agenda => agenda.pointState === AGENDA_STATES.DISCUSSION;

export const agendaPointNotOpened = agenda => agenda.pointState === AGENDA_STATES.INITIAL;

export const getAgendaTypeLabel = agenda => {
	switch (agenda.subjectType) {
		case AGENDA_TYPES.INFORMATIVE:
			return 'informative';
		case AGENDA_TYPES.PUBLIC_VOTING:
			return 'public_votation';
		case AGENDA_TYPES.PUBLIC_ACT:
			return 'public_act';
		case AGENDA_TYPES.FAKE_PUBLIC_VOTING:
			return 'fake_public_votation';
		case AGENDA_TYPES.PRIVATE_ACT:
			return 'public_act';
		case AGENDA_TYPES.PRIVATE_VOTING:
			return 'private_votation';
		case AGENDA_TYPES.CUSTOM_PUBLIC:
			return 'custom_point';
		case AGENDA_TYPES.CUSTOM_PRIVATE:
			return 'custom_point';
		case AGENDA_TYPES.CUSTOM_NOMINAL:
			return 'custom_point';
		case AGENDA_TYPES.CONFIRMATION_REQUEST:
			return 'confirmation_request';
		default:
			return 'custom_point';
	}
};

export const getTranslationReqCode = reqCode => {
	switch (reqCode) {
		case 'ALL':
			return 'all_plural';
		case -1:
			return 'tooltip_failed_shipping';
		case 0:
			return 'tooltip_not_sent';
		case 20:
			return 'tooltip_pending_shipping';
		case 22:
			return 'tooltip_inbox';
		case 25:
			return 'tooltip_opened';
		case 32:
			return 'clicked';
		case 35:
			return 'tooltip_spam';
		case 36:
			return 'tooltip_invalid_email_address';
		case 37:
			return 'tooltip_dropped';
		case 40:
			return 'tooltip_dropped';
		default:
			return '';
	}
};

export const printSessionExpiredError = () => {
	const messages = {
		es: 'Su sesión ha caducado',
		en: 'Session expired',
		cat: 'La seva sessió ha caducat',
		gl: 'A súa sesión caducou',
		pt: 'A sua sessão expirou'
	};
	const selectedLanguage = sessionStorage.getItem('language');
	if (selectedLanguage) {
		return messages[selectedLanguage];
	}
	return messages.es;
};

export const printCifAlreadyUsed = () => {
	// vat_previosly_save
	const messages = {
		pt: 'Este NIF já foi previamente guardado',
		es: 'Este CIF ha sido guardado previamente',
		en: ' This VAT has been previously saved',
		cat: 'Aquest CIF ha estat guardat prèviament',
		gal: 'Este CIF foi gardado previamente'
	};
	const selectedLanguage = sessionStorage.getItem('language');
	if (selectedLanguage) {
		return messages[selectedLanguage];
	}
	return messages.es;
};

export const printTrialEnded = () => {
	// vat_previosly_save
	const messages = {
		pt: 'Período de prova finalizado',
		es: 'Período de prueba finalizado',
		en: ' Trial period ended',
		cat: 'Període de prova finalitzat',
		gal: 'Período de proba finalizado'
	};
	const selectedLanguage = sessionStorage.getItem('language');
	if (selectedLanguage) {
		return messages[selectedLanguage];
	}
	return messages.es;
};

export const showVideo = council => (council.state >= 20 && council.state <= 30) && councilHasVideo(council);

export const getMainRepresentative = participant => ((participant.representatives && participant.representatives.length > 0) ? participant.representatives[0] : null);

export const canAddPoints = council => council.statute.canAddPoints === 1;

export const hasHisVoteDelegated = participant => participant.state === 4;

export const getParticipantStateString = state => {
	switch (state) {
		case PARTICIPANT_STATES.REMOTE:
			return 'REMOTE';

		case PARTICIPANT_STATES.PRESENT:
			return 'PRESENT';

		case PARTICIPANT_STATES.REPRESENTATED:
			return 'REPRESENTATED';

		case PARTICIPANT_STATES.DELEGATED:
			return 'DELEGATED';

		case PARTICIPANT_STATES.PHYSICALLY_PRESENT:
			return 'PHYSICALLY_PRESENT';

		case PARTICIPANT_STATES.NO_PARTICIPATE:
			return 'NO_PARTICIPATE';

		case PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE:
			return 'PRESENT_WITH_REMOTE_VOTE';

		default:
			return 'INVALID_STATE';
	}
};

export const multipleGoverningBody = type => !![
	GOVERNING_BODY_TYPES.COUNCIL,
	GOVERNING_BODY_TYPES.JOINT_ADMIN,
	GOVERNING_BODY_TYPES.SOLIDARY_ADMIN
].find(item => type === item.value);

export const getParticipantStateField = participant => {
	switch (participant.state) {
		case 0:
			return 'remote_assistance';
		case 1:
			return 'physically_present_assistance';
		case 2:
			return 'representated';
		case 4:
			return 'delegated';
		case 5:
			return 'physically_present_assistance';
		case 6:
			return 'no_participate';
		case 7:
			return 'physically_present_with_remote_vote';
		case 8:
			return 'participant_vote_fixed';
		case 11:
			return 'left_the_council';

		default:
			return 'remote_assistance';
	}
};

export const isAskingForWord = participant => participant.requestWord === 1;

export const participantIsBlocked = participant => participant.blocked === 1;

export const participantNeverConnected = participant => participant.online === 0;

export const canUnblockParticipant = council => council.statute.canUnblock === 1;

export const haveGrantedWord = participant => participant.requestWord === 2;

export const exceedsOnlineTimeout = date => {
	const timeout = -moment(new Date(date)).diff(moment(), 'seconds');
	return timeout > 15;
};

export const formatCountryName = (country, language) => {
	const texts = {
		es: {
			ES: 'España',
			Spain: 'España'
		},
		gal: {
			ES: 'España',
			Spain: 'España'
		},
		cat: {
			ES: 'Espanya',
			Spain: 'Espanya'
		},
		pt: {
			ES: 'Espanha',
			Spain: 'Espanha'
		},
		en: {
			ES: 'Spain',
			Spain: 'Spain'
		}
	};

	return (texts[language] && texts[language][country]) ? texts[language][country] : country;
};

export const checkRequiredFields = (translate, draft, updateErrors, corporation, toast) => {
	const errors = {
		title: '',
		text: '',
		statuteId: '',
		type: '',
		votingType: '',
		majority: '',
		majorityDivider: '',
		majorityType: ''
	};

	let hasError = false;

	if (!draft.title) {
		hasError = true;
		errors.title = translate.required_field;
	}

	if (draft.text && checkForUnclosedBraces(draft.text)) {
		errors.text = true;
		hasError = true;
		toast(
			<LiveToast
				message={translate.revise_text}
				id="text-error-toast"
			/>,
			{
				position: toast.POSITION.TOP_RIGHT,
				autoClose: true,
				className: 'errorToast'
			}
		);
	}

	if (draft.secondaryText && checkForUnclosedBraces(draft.secondaryText)) {
		errors.secondaryText = true;
		hasError = true;
		toast(
			<LiveToast
				message={translate.revise_text}
				id="text-error-toast"
			/>,
			{
				position: toast.POSITION.TOP_RIGHT,
				autoClose: true,
				className: 'errorToast'
			}
		);
	}

	updateErrors(errors);
	return hasError;
};

export const removeTypenameField = object => {
	const { __typename, ...rest } = object;
	return rest;
};

export const cleanAgendaObject = agenda => {
	const {
		attachments, ballots, items, options, __typename, votings, qualityVoteSense, votingsRecount, ...clean
	} = agenda;
	return clean;
};

export const checkHybridConditions = council => {
	if (council.councilType !== 3) {
		return false;
	}

	if (checkSecondDateAfterFirst(council.closeDate, new Date())) {
		return true;
	}

	return false;
};

export const prepareTextForFilename = text => {
	if (!text) return '';
	return text.replace(/ /g, '_').replace(/\./g, '_');
};

export const formatSize = size => {
	const mb = 1024 ** 2;
	const kb = 1024;

	if ((size >= 1024) ^ 2) {
		return `${Math.ceil((size / mb) * 100) / 100} MB`;
	}

	if (size >= 1024) {
		return `${Math.ceil((size / kb) * 100) / 100} KB`;
	}

	return `${size} Bytes`;
};

export const calculateMajorityAgenda = (agenda, company, council, recount) => {
	let specialSL = false;
	if (company.type === 1 && council.statute.quorumPrototype === 1) {
		specialSL = true;
	}
	return LiveUtil.calculateMajority(specialSL, recount.partTotal, agenda.presentCensus + agenda.currentRemoteCensus, agenda.majorityType, agenda.majority, agenda.majorityDivider, agenda.negativeVotings + agenda.negativeManual, council.statute.quorumPrototype);
};

export const cleanVotesValue = value => {
	return !value || Number.isNaN(Number(value)) ? '' : parseInt(value, 10);
};

export const calculateQuorum = (council, recount) => {
	let base;
	if (council.statute.quorumPrototype === 1) {
		base = recount ? recount.socialCapitalTotal : 0;
	} else {
		base = recount ? recount.numTotal : 0;
	}

	if (council.firstOrSecondConvene === 1) {
		return LiveUtil.calculateQuorum(base, council.statute.firstCallQuorumType, council.statute.firstCallQuorum, council.statute.firstCallQuorumDivider);
	}

	return LiveUtil.calculateQuorum(base, council.statute.secondCallQuorumType, council.statute.secondCallQuorum, council.statute.secondCallQuorumDivider);
};

export const isAppointment = council => council.councilType === COUNCIL_TYPES.ONE_ON_ONE;

export const councilHasSession = council => !((council.councilType > 1
	&& council.councilType !== COUNCIL_TYPES.BOARD_WITHOUT_SESSION
	&& council.councilType !== COUNCIL_TYPES.ONE_ON_ONE
) || (council.councilType === COUNCIL_TYPES.NO_VIDEO && council.autoClose === 1));

