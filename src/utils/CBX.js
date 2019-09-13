import {
	MAX_COUNCIL_ATTACHMENTS,
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
	GOVERNING_BODY_TYPES
} from "../constants";
import dropped from "../assets/img/dropped.png";
import React from 'react';
import delivered from "../assets/img/delivered.png";
import invalidEmailAddress from "../assets/img/invalid_email_address.png";
import notSent from "../assets/img/not_sent.png";
import opened from "../assets/img/opened.png";
import pendingShipping from "../assets/img/pending_shipping.png";
import spam from "../assets/img/spam.png";
import LiveUtil from './live';
import { LiveToast } from '../displayComponents';
import { moment, client, store } from '../containers/App';
import { query } from "../components/company/drafts/companyTags/CompanyTags";

export const canReorderPoints = council => {
	return council.statute.canReorderPoints === 1;
};

export const splitExtensionFilename = (filename) => {
	const array = filename.split('.');
	if (array.length < 2) {
		return 'That`s not a filename';
	}
	return {
		filename: array.slice(0, -1).join('.'),
		extension: array[array.length - 1]
	}
}

export const showAddCouncilAttachment = attachments => {
	return attachments.length < MAX_COUNCIL_ATTACHMENTS;
};

export const canAddCouncilAttachment = (council, filesize) => {
	return (
		council.attachments.reduce((a, b) => a + parseInt(b.filesize, 10), 0) +
		filesize <
		MAX_COUNCIL_FILE_SIZE
	);
};

export const trialDaysLeft = (company, moment, trialDays) => {
	const left = trialDays - moment(new Date()).diff(moment(company.creationDate), 'days');

	return left <= 0 || isNaN(left) ? 0 : left;
}

export const councilStarted = council => {
	return council.councilStarted === 1;
};

export const existsQualityVote = statute => {
	return statute.existsQualityVote === 1;
};

export const showAgendaVotingsToggle = (council, agenda) => {
	return (
		council.councilStarted === 1 &&
		agenda.subjectType !== 0 &&
		agenda.votingState !== 2
	);
};

export const showSendCredentials = participantState => {
	return participantState !== PARTICIPANT_STATES.PRESENT &&
		participantState !== PARTICIPANT_STATES.PHYSICALLY_PRESENT &&
		participantState !== PARTICIPANT_STATES.DELEGATED &&
		participantState !== PARTICIPANT_STATES.REPRESENTATED;
}

export const showAgendaVotingsTable = agenda => {
	return (
		agenda.votingState > 0 &&
		agenda.subjectType !== 0
	)
}

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
}

export const agendaVotingsOpened = agenda => {
	return agenda.votingState === AGENDA_STATES.DISCUSSION || agenda.votingState === 4;
};
export const agendaClosed = agenda => {
	return agenda.pointState === AGENDA_STATES.CLOSED;
};

export const councilHasVideo = council => {
	return council.councilType === 0;
};

export const censusHasParticipations = census => {
	return census.quorumPrototype === 1;
};

export const checkForUnclosedBraces = text => {
	if (text) {
		const open = text.split('{').length - 1;
		const close = text.split('}').length - 1;
		return open !== close;
	}

	return false;
}

export const councilHasParticipations = council => {
	return council.statute.quorumPrototype === 1;
};

export const hasVotation = pointType => {
	return pointType !== AGENDA_TYPES.INFORMATIVE;
};

export const pointIsClosed = agendaPoint => {
	if (hasVotation(agendaPoint.subjectType)) {
		return agendaPoint.votingState === 2 && agendaPoint.pointState === 2;
	}
	return agendaPoint.pointState === 2;
};

export const copyStringToClipboard = str => {
	var el = document.createElement('textarea');
	el.value = str;
	el.setAttribute('readonly', '');
	el.style = { position: 'absolute', left: '-9999px' };
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);
}

export const majorityNeedsInput = majorityType => {
	return majorityType === MAJORITY_TYPES.PERCENTAGE
		|| majorityType === MAJORITY_TYPES.NUMBER
		|| majorityType === MAJORITY_TYPES.FRACTION;
};

export const haveQualityVoteConditions = (agenda, council) => {
	return (agenda.subjectType === AGENDA_TYPES.PUBLIC_ACT || agenda.subjectType === AGENDA_TYPES.PUBLIC_VOTING) &&
		(agenda.majorityType === 1) && (agenda.positiveVotings + agenda.positiveManual) === (agenda.negativeVotings +
			agenda.negativeManual) && council.statute.existsQualityVote;
};

export const canEditPresentVotings = agenda => {
	return (agenda.votingState === AGENDA_STATES.DISCUSSION ||
		agenda.votingState === 4) && (
		agenda.subjectType === AGENDA_TYPES.FAKE_PUBLIC_VOTING ||
		agenda.subjectType === AGENDA_TYPES.PRIVATE_VOTING ||
		agenda.subjectType === AGENDA_TYPES.CUSTOM_PRIVATE ||
		agenda.subjectType === AGENDA_TYPES.CUSTOM_PUBLIC);
}

export const approvedByQualityVote = (agenda, qualityVoteId) => {
	if (agenda.votings && qualityVoteId) {
		const qualityVote = agenda.votings.find(item => {
			return item.participantId === qualityVoteId
		});
		if (qualityVote) {
			if (qualityVote.vote === VOTE_VALUES.POSITIVE) {
				return true;
			}
		}
	}
	return false;
}

export const isMajorityPercentage = majorityType => {
	return majorityType === 0;
};

export const isMajorityFraction = majorityType => {
	return majorityType === 5;
};

export const isMajorityNumber = majorityType => {
	return majorityType === 6;
};

export const quorumNeedsInput = quorumType => {
	return quorumType === 0 || quorumType === 2 || quorumType === 3;
};

export const isQuorumPercentage = quorumType => {
	return quorumType === 0;
};

export const isQuorumFraction = quorumType => {
	return quorumType === 2;
};

export const isQuorumNumber = quorumType => {
	return quorumType === 3;
};

export const hasAct = statute => {
	return statute.existsAct === 1;
};

export const councilHasComments = statute => {
	return statute.existsComments === 1;
};

export const canDelegateVotes = (statute, participant) => {
	return (
		statute.existsDelegatedVote === 1 &&
		!(participant.delegatedVotes.filter(p => p.state !== PARTICIPANT_STATES.REPRESENTATED).length > 0) &&
		participant.type !== PARTICIPANT_TYPE.GUEST
	);
};
export const canAddDelegateVotes = (statute, participant) => {
	return (
		statute.existsDelegatedVote === 1 &&
		(participant.type === PARTICIPANT_TYPE.PARTICIPANT || participant.type === PARTICIPANT_TYPE.REPRESENTATIVE) &&
		(participant.state !== PARTICIPANT_STATES.DELEGATED && participant.state !== PARTICIPANT_STATES.REPRESENTATED) &&
		participant.personOrEntity !== 1
	);
};

export const canHaveRepresentative = participant => {
	return participant.type === PARTICIPANT_TYPE.PARTICIPANT || participant.type === PARTICIPANT_TYPE.REPRESENTATED;
};

export const delegatedVotesLimitReached = (statute, length) => {
	return (
		statute.existMaxNumDelegatedVotes === 1 &&
		length >= statute.maxNumDelegatedVotes
	);
};

export const isCustomPoint = subjectType => {
	const customPoint = CUSTOM_AGENDA_VOTING_TYPES.find(type => subjectType === type.value);
	return !!customPoint;
}

export const canBePresentWithRemoteVote = statute => {
	return statute.existsPresentWithRemoteVote === 1;
};

export const isAnonym = subjectType => {
	return subjectType === AGENDA_TYPES.PRIVATE_VOTING || subjectType === AGENDA_TYPES.CUSTOM_PRIVATE;
}
export const getSMSStatusByCode = reqCode => {
    const status = {
        22: 'Entregado',
        20: 'Enviado',
        '-2': <span style={{color: 'red'}}>Número no válido</span>,
        default: <span style={{color: 'red'}}>Fallido</span>
    }

    return status[reqCode]? status[reqCode] : status.default;
}

export const filterAgendaVotingTypes = (votingTypes, statute = {}, council = {}) => {
	if (statute.existsPresentWithRemoteVote === 1 && council.councilType < 2) {
		return votingTypes.filter(
			type => type.label === "text" || type.label === "public_votation"
		);
	}

	if(council.councilType === 2){
		return votingTypes.filter(type =>
			type.label !== 'text' &&
			type.label !== 'custom_nominal_point' &&
			type.label !== 'custom_anonym_point' &&
			type.label !== 'custom_public_point');
	}

	if(council.councilType === 3){
		return votingTypes.filter(type => type.label === 'private_votation');
	}
	return votingTypes.filter(type => type.label !== 'custom_nominal_point' && type.label !== 'custom_anonym_point' && type.label !== 'custom_public_point');
};

export const hasSecondCall = statute => {
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
	const difference = secondDate.diff(firstDate, "minutes");
	return difference >= statute.minimumSeparationBetweenCall;
};

export const checkSecondDateAfterFirst = (firstDate, secondDate) => {
	const first = moment(new Date(firstDate).toISOString(), moment.ISO_8601);
	const second = moment(new Date(secondDate).toISOString(), moment.ISO_8601);
	const difference = second.diff(first, "minutes");
	return difference > 0;
};

export const addMinimumDistance = (date, statute) => {
	const momentDate = moment(new Date(date).toISOString());
	return momentDate.add(statute.minimumSeparationBetweenCall, "minutes");
};

export const replaceSpecials = string => {
	const specials = ["-", "[", "]", "/", "{", "}", "(", ")", "*", "+", "?", ".", "\\", "^", "$", "|"];
	const regex = RegExp('[' + specials.join('\\') + ']', 'g');
	return string.replace(regex, "\\$&");
}


export const getArticles = () => {
	const articles = {
		el: language => {
			const languages = {
				es: 'El',
				en: 'The',
				gal: 'O',
				cat: "El",
				pt: 'O'
			}
			return languages[language];
		},
		la: language => {
			const languages = {
				es: 'La',
				en: 'The',
				gal: 'A',
				cat: "La",
				pt: 'A'
			}
			return languages[language];
		},
		los: language => {
			const languages = {
				es: 'Los',
				en: 'The',
				gal: 'Os',
				cat: 'Els',
				pt: 'Os'
			}
			return languages[language];
		},
		las: language => {
			const languages = {
				es: 'Las',
				en: 'The',
				gal: 'As',
				cat: 'Les',
				pt: 'As'
			}
			return languages[language];
		}
	}

	return articles;
}

export const getDecides = () => {
	const articles = {
		decide: language => {
			const languages = {
				es: 'decide',
				en: 'decides',
				gal: 'decide',
				cat: "decideix",
				pt: 'decide'
			}
			return languages[language];
		},
		acuerda: language => {
			const languages = {
				es: 'acuerda',
				en: 'agrees',
				gal: 'acorda',
				cat: "acorda",
				pt: 'concorda'
			}
			return languages[language];
		},
		acuerdan: language => {
			const languages = {
				es: 'acuerdan',
				en: 'agrees',
				gal: 'acordan',
				cat: "acordan",
				pt: 'concordan'
			}
			return languages[language];
		}
	}

	return articles;
}

export const generateGBDecidesText = (translate, type) => {
	const articles = getArticles();
	const decides = getDecides();

	const labels = {
		1: `${articles.el(translate.selectedLanguage)} ${translate[GOVERNING_BODY_TYPES.ONE_PERSON.label]} ${decides.decide(translate.selectedLanguage)}`,
		2: `${articles.el(translate.selectedLanguage)} ${translate[GOVERNING_BODY_TYPES.ONE_ENTITY.label]} ${decides.decide(translate.selectedLanguage)}`,
		3: `${articles.los(translate.selectedLanguage)} ${translate[GOVERNING_BODY_TYPES.JOINT_ADMIN.label]} ${decides.acuerdan(translate.selectedLanguage)}`,
		4: `${articles.el(translate.selectedLanguage)} ${translate[GOVERNING_BODY_TYPES.SOLIDARY_ADMIN.label]} ${decides.decide(translate.selectedLanguage)}`,
		5: `${articles.el(translate.selectedLanguage)} ${translate[GOVERNING_BODY_TYPES.COUNCIL.label]} ${decides.acuerda(translate.selectedLanguage)}`
	}

	return labels[type]? labels[type] : labels[0];
}

export const generateGBAgreements = (translate, type) => {
	const labels = {
		0: '',
		1: '',
		2: '',
		3: translate.jointly_decides,
		4: translate.in_solidarity_decides,
		5: ''
	}

	return labels[type]? labels[type] : labels[0];
}


export const getGoverningText = (translate, type) => {
	const articles = getArticles();

	const labels = {
		0: `${translate[GOVERNING_BODY_TYPES.NONE.label]}`,
		1: `${articles.el(translate.selectedLanguage)} ${translate[GOVERNING_BODY_TYPES.ONE_PERSON.label]}`,
		2: `${articles.el(translate.selectedLanguage)} ${translate[GOVERNING_BODY_TYPES.ONE_ENTITY.label]}`,
		3: `${articles.los(translate.selectedLanguage)} ${translate[GOVERNING_BODY_TYPES.JOINT_ADMIN.label]}`,
		4: `${articles.el(translate.selectedLanguage)} ${translate[GOVERNING_BODY_TYPES.SOLIDARY_ADMIN.label]}`,
		5: `${articles.el(translate.selectedLanguage)} ${translate[GOVERNING_BODY_TYPES.COUNCIL.label]}`
	}

	return labels[type]? labels[type] : labels[0];
}

export const generateGBSoleDecidesText = (translate, type) => {
	const labels = {
		0: `${translate.the_general_meeting} ${translate.agrees}`,
		1: `${translate.the_general_meeting} ${translate.agrees}`,
		6: `${translate.the_sole_shareholder} ${translate.agrees}`,
		7: `${translate.the_sole_shareholder} ${translate.agrees}`,
		8: `${translate.the_sole_shareholder} ${translate.agrees}`,
		9: `${translate.the_sole_shareholder} ${translate.agrees}`
	}

	return labels[type]? labels[type] : labels[0];
}

export const generateGBSoleProposeText = (translate, type) => {
	const labels = {
		0: translate.the_general_meeting,
		1: translate.the_general_meeting,
		6: translate.the_sole_shareholder,
		7: translate.the_sole_shareholder,
		8: translate.the_sole_shareholder,
		9: translate.the_sole_shareholder
	}

	return labels[type]? labels[type] : labels[0];
}

export const getGoverningBodySignatories = (translate, type, data) => {
	const blankSpaces = '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';
	const labels = {
		0: () => '',
		1: () => {
			return `${data.name} ${data.surname}`;
		},
		2: () => {
			return `${data.name} ${data.surname}`;
		},
		3: () => {
			return data.list.filter(admin => admin.sign).reduce((acc, curr, index, array) => acc + `${curr.name} ${curr.surname}${(index < array.length -1)? blankSpaces : ''}`, '');
		},
		4: () => {
			return data.list.filter(admin => admin.sign).reduce((acc, curr, index, array) => acc + `${curr.name} ${curr.surname}${(index < array.length - 1)? blankSpaces : ''}`, '');
		},
		5: () => {
			return data.list.filter(admin => admin.sign).reduce((acc, curr, index, array) => acc + `${curr.name} ${curr.surname}${(index < array.length - 1)? blankSpaces : ''}`, '');
		},
	}


	return labels[type]? labels[type]() : labels[0]();
}

export const generateAgendaText = (translate, agenda) => {
	return agenda.reduce((acc, curr, index) => acc + `<br/>${index + 1}. ${curr.agendaSubject}`, '');
}



export const changeVariablesToValues = async (text, data, translate) => {
	if (!data || !data.company || !data.council) {
		throw new Error("Missing data");
	}

	const state = store.getState();
	const company = state.companies.list[state.companies.selected];

	if (!text) {
		return "";
	}


	if(company){
		const response = await client.query({
			query,
			variables: {
				companyId: company.id
			}
		});

		const { companyTags } = response.data;

		if(companyTags && companyTags.length > 0){
			companyTags.forEach(tag => {
				text = text.replace(new RegExp(`{{${replaceSpecials(tag.key)}}}`, 'g'), tag.value);
			})
		}
	}

	if (data.council.dateStart) {
		const replaced = /<span id="{{dateFirstCall}}">(.*?|\n)<\/span>/.test(text);

		if (replaced) {
			text = text.replace(
				/<span id="{{dateFirstCall}}">(.*?|\n)<\/span>/ig,
				`<span id="{{dateFirstCall}}">${
				moment(
					new Date(data.council.dateStart).toISOString(),
					moment.ISO_8601
				).format("LLL")
				}</span>`
			);
		} else {
			text = text.replace(
				/{{dateFirstCall}}/g
				,
				`<span id="{{dateFirstCall}}">${
				moment(
					new Date(data.council.dateStart).toISOString(),
					moment.ISO_8601
				).format("LLL")
				}</span>`
			);
		}
	}

	if (data.council.dateStart2NdCall) {
		const replaced = /<span id="{{dateSecondCall}}">(.*?|\n)<\/span>/.test(text);

		if (replaced) {
			text = text.replace(
				/<span id="{{dateSecondCall}}">(.*?|\n)<\/span>/ig,
				`<span id="{{dateSecondCall}}">${
				moment(
					new Date(data.council.dateStart).toISOString(),
					moment.ISO_8601
				).format("LLL")
				}</span>`
			);
		} else {
			text = text.replace(
				/{{dateSecondCall}}/g
				,
				`<span id="{{dateSecondCall}}">${
				moment(
					new Date(data.council.dateStart2NdCall).toISOString(),
					moment.ISO_8601
				).format("LLL")
				}</span>`
			);
		}
	}

	text = text.replace(/{{now}}/g, new moment().format('LLL'));
	text = text.replace(/{{signatories}}/g, getGoverningBodySignatories(translate, data.company.governingBodyType, data.company.governingBodyData));

	text = text.replace(/{{convene}}/g, data.council.emailText);

	text = text.replace(/{{numPresentOrRemote}}/g, data.council.numPresentAttendance + data.council.numRemoteAttendance);
	text = text.replace(/{{numRepresented}}/g, data.council.numDelegatedAttendance);
	text = text.replace(/{{numParticipants}}/g, data.council.numTotalAttendance);
	text = text.replace(/{{percentageSCPresent}}/g, data.council.percentageSCPresent);
	text = text.replace(/{{percentageSCRepresented}}/g, data.council.percentageSCDelegated);
	text = text.replace(/{{percentageSCTotal}}/g, data.council.percentageSCTotal);
	text = text.replace(/{{numParticipationsPresent}}/g, data.council.numParticipationsPresent);
	text = text.replace(/{{numParticipationsRepresented}}/g, data.council.numParticipationsRepresented);


	text = text.replace(/{{dateRealStart}}/g, !!data.council.dateRealStart ? moment(new Date(data.council.dateRealStart).toISOString(),
		moment.ISO_8601).format("LLL") : '');
	text = text.replace(/{{dateEnd}}/g, !!data.council.dateEnd ? moment(new Date(data.council.dateEnd).toISOString(),
		moment.ISO_8601).format("LLL") : '');
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
	text = text.replace(/{{address}}/g, `${data.council.street} ${data.council.country}`)
	text = text.replace(/{{business_name}}/g, data.company.businessName);
	text = text.replace(/{{city}}/g, data.council.city);
	text = text.replace(/{{attendants}}/g, data.council.attendants? data.council.attendants.reduce((acc, curr, index) => acc + `${index > 0? ', ' : ' '} ${curr.name} ${curr.surname}`, '') : '');

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
				/{{street}}/g
				,
				`<span id="{{street}}">${data.council.remoteCelebration === 1 ? translate.remote_celebration : data.council.street
				}</span>`
			);
		}
	}

	text = text.replace(/{{GBdecides}}/g, generateGBDecidesText(translate, data.company.governingBodyType));
	text = text.replace(/{{GoverningBody}}/g, getGoverningText(translate, data.company.governingBodyType));
	text = text.replace(/{{GM\/SoleDecides}}/g, generateGBSoleDecidesText(translate, data.company.type));
	text = text.replace(/{{GM\/SolePropose}}/g, generateGBSoleProposeText(translate, data.company.type));
	text = text.replace(/{{GBAgreements}}/g, generateGBAgreements(translate, data.company.governingBodyType));

	text = text.replace(/{{Agenda}}/g, data.council.agenda? generateAgendaText(translate, data.council.agenda) : '');

	text = text.replace(/{{dateEnd}}/g, moment(new Date(data.council.dateEnd)).format("LLL"));
	text = text.replace(/{{numberOfShares}}/g, data.council.currentQuorum);
	text = text.replace(/{{percentageOfShares}}/g, (data.council.currentQuorum / parseInt(base, 10) * 100).toFixed(3));
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
		//text = text.replace(/{{positiveVotings}}/g, 0);
		//text = text.replace(/{{negativeVotings}}/g, 0);
	}
	return text;
};

export const getTagVariablesByDraftType = (draftType, translate) => {
	const tags = {
		dateFirstCall: {
			value: '{{dateFirstCall}}',
			label: translate["1st_call_date"]
		},
		dateSecondCall: {
			value: '{{dateSecondCall}}',
			label: translate["2nd_call_date"]
		},
		businessName: {
			value: '{{business_name}}',
			label: translate.business_name
		},
		street: {
			value: `{{street}}`,
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
			label: 'Nº de asistentes personalmente' //TRADUCCION
		},
		numRepresented: {
			value: '{{numRepresented}}',
			label: 'Nº de asistentes representados' //TRADUCCION
		},
		numParticipants: {
			value: '{{numParticipants}}',
			label: 'Nº de asistentes totales' //TRADUCCION
		},
		numParticipationsPresent: {
			value: '{{numParticipationsPresent}}',
			label: 'Nº de participaciones asisten personalmente' //TRADUCCION
		},
		numParticipationsRepresented: {
			value: '{{numParticipationsRepresented}}',
			label: ' Nº de participaciones asisten representadas' //TRADUCCION
		},
		percentageSCPresent: {
			value: '{{percentageSCPresent}}',
			label: '% del capital social que asiste personalmente' //TRADUCCION
		},
		percentageSCRepresented: {
			value: '{{percentageSCRepresented}}',
			label: '% del capital social que asiste representado' //TRADUCCION
		},
		percentageSCTotal: {
			value: '{{percentageSCTotal}}',
			label: '% del capital social que asiste' //TRADUCCION
		},
		convene: {
			value: '{{convene}}',
			label: 'Texto de la convocatoria' //TRADUCCION
		},
		numberOfShares: {
			value: '{{numberOfShares}}',
			label: 'Nº participaciones que asiste del total del capital social'
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
			label: 'Órgano de gobierno'//TRADUCCION
		},
		gbDecides: {
			value: '{{GBdecides}}',
			label: '[Órgano de gobierno] decide'//TRADUCCION
		},
		soleDecides: {
			value: '{{GM/SoleDecides}}',
			label: '[Junta Gral./Socio/Accionista único] decide'//TRADUCCION
		},
		solePropose: {
			value: '{{GM/SolePropose}}',
			label: '[Junta Gral./Socio/Accionista único] propone'//TRADUCCION
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
		}
	}

	const handler = {
		get: (target, name) => {
			if(!target[name]){
				throw new Error('Invalid tag');
			}

			return target[name];
		}
	}

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
	}

	return types[draftType]? types[draftType] : types[DRAFT_TYPES.CONVENE_HEADER];
}

export const hasParticipations = (statute = {}) => {
	return statute.quorumPrototype === 1;
};

export const isRepresentative = participant => {
	return participant.type === 2;
};

export const isRepresented = participant => {
	return participant.state === PARTICIPANT_STATES.REPRESENTATED;
};

export const getSendType = value => {
	return SEND_TYPES[value];
};

export const removeHTMLTags = string => {
	return string.replace(/<(?:.|\n)*?>/gm, "");
};

export const councilHasActPoint = council => {
	return council.approveActDraft === 1;
};

export const getActPointSubjectType = () => {
	return 2;
};

export const generateInitialDates = (statute) => {
	if (statute.existsAdvanceNoticeDays === 1) {
		const momentDate = moment(new Date().toISOString());
		const dates = {
			dateStart: momentDate.add(statute.advanceNoticeDays, "days").toISOString()
		}
		if (hasSecondCall(statute)) {
			dates.dateStart2NdCall = addMinimumDistance(dates.dateStart, statute);
		}

		return dates;
	} else {
		return {
			dateStart: new Date(),
			...(hasSecondCall(statute) ? { dateStart2NdCall: new Date() } : {})
		}
	}
}



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
		const difference = firstDate.diff(secondDate, "days");
		return difference >= statute.advanceNoticeDays;
	}

	return true;
}

export const showUserUniqueKeyMessage = council => {
	return council.securityType === 1 || council.securityType === 2;
};

export const councilIsNotified = council => {
	return council.state === 10;
};

export const councilIsInTrash = council => {
	return council.state === COUNCIL_STATES.CANCELED;
};

export const councilIsNotLiveYet = council => {
	return (
		council.state < COUNCIL_STATES.ROOM_OPENED &&
		council.state > COUNCIL_STATES.CANCELED
	);
};

export const checkRepeatedItemValue = items => {
    const differentValues = new Map();
    let found = new Set();
    items.forEach((item, index) => {
        if(item.value){
            if(differentValues.has(item.value)){
                found.add(differentValues.get(item.value));
                found.add(index);
            }
            differentValues.set(item.value, index);
        }
    });
    return Array.from(found.values());
}

export const councilIsPreparing = council => {
	return (
		council.state === COUNCIL_STATES.PREPARING || council.state === COUNCIL_STATES.SAVED
	);
};

export const councilIsLive = council => {
	return (
		council.state >= COUNCIL_STATES.ROOM_OPENED &&
		council.state < COUNCIL_STATES.FINISHED
	);
};

export const councilIsFinished = council => {
	return (
		council.state >= COUNCIL_STATES.FINISHED &&
		council.state !== COUNCIL_STATES.NOT_CELEBRATED
	);
};

export const councilIsNotCelebrated = council => {
	return council.state === COUNCIL_STATES.NOT_CELEBRATED || council.active === 0;
};

export const councilHasAssistanceConfirmation = council => {
	return council.confirmAssistance === 1;
};

export const printPrettyFilesize = filesize => {
	if (filesize < 1024) {
		return `${filesize} Bytes`;
	}
	if (filesize < 1048576) {
		return `${addDecimals(filesize / 1024, 2)} KBs`;
	}
	if (filesize < 1073741824) {
		return `${addDecimals(filesize / 1048576, 2)} MBs`;
	}
	return `${addDecimals(filesize / 1073741824, 2)} GBs`;
};

export const isPresentVote = vote => {
	return vote.presentVote === 5 || vote.presentVote === 7;
};

export const addDecimals = (num, fixed) => {
	num = num.toString();
	return num.slice(0, num.indexOf(".") + fixed + 1);
};

function s2ab(s) {
	var buf = new ArrayBuffer(s.length);
	var view = new Uint8Array(buf);
	for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
	return buf;
}

export const unaccent = string => {
	if (!string) {
		return '';
	}
	return string.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
};

export const downloadFile = (base64, filetype, filename) => {
	let bufferArray = dataURItoBlob(base64);

	if (window.navigator.msSaveOrOpenBlob) {
		let fileData = [bufferArray];
		let blobObject = new Blob(fileData, {
			type: "data:application/stream;base64"
		});
		return window.navigator.msSaveOrOpenBlob(blobObject, filename);
	} else {
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

		let objectUrl = URL.createObjectURL(blob);

		let a = document.createElement("a");
		a.style.cssText = "display: none";
		document.body.appendChild(a);
		a.href = objectUrl;
		a.download = filename.replace(/\./, '');
		a.click();
	}
};

function dataURItoBlob(dataURI) {
	// convert base64 to raw binary data held in a string
	// doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
	let byteString = atob(dataURI);

	// write the bytes of the string to an ArrayBuffer
	let arrayBuffer = new ArrayBuffer(byteString.length);
	let ia = new Uint8Array(arrayBuffer);
	for (let i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}

	return arrayBuffer;
}

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
}

export const checkCouncilState = (council, company, bHistory, expected) => {
	switch (council.state) {
		case COUNCIL_STATES.DRAFT:
			if (expected !== "draft") {
				bHistory.replace(`/company/${company.id}/council/${council.id}`);
			}
			break;
		case COUNCIL_STATES.PRECONVENE:
			if (expected !== "draft") {
				bHistory.replace(`/company/${company.id}/council/${council.id}`);
			}
			break;
		case COUNCIL_STATES.SAVED:
			if (expected !== "convened" && expected !== "live") {
				bHistory.replace(
					`/company/${company.id}/council/${council.id}/prepare`
				);
			}
			break;
		case COUNCIL_STATES.PREPARING:
			if (expected !== "convened" && expected !== "live") {
				bHistory.replace(
					`/company/${company.id}/council/${council.id}/prepare`
				);
			}
			break;
		case COUNCIL_STATES.ROOM_OPENED:
			if (expected !== "live") {
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
			if (expected !== "finished") {
				bHistory.replace(
					`/company/${company.id}/council/${council.id}/finished`
				);
			}
			break;
		default:
			return;
	}
};

export const participantIsGuest = participant => {
	return participant.type === PARTICIPANT_TYPE.GUEST;
};
export const participantIsRepresentative = participant => {
	return participant.type === PARTICIPANT_TYPE.REPRESENTATIVE;
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
			return "clicked";

		case 35:
			return spam;

		case 36:
			return invalidEmailAddress;

		case 37:
			return dropped;
		default:
			return dropped;
	}
};

export const agendaPointOpened = agenda => {
	return agenda.pointState === AGENDA_STATES.DISCUSSION;
};

export const agendaPointNotOpened = agenda => {
	return agenda.pointState === AGENDA_STATES.INITIAL;
};

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
			return 'fake_public_votation';
		case AGENDA_TYPES.CUSTOM_PRIVATE:
			return 'private_votation';
		case AGENDA_TYPES.CUSTOM_NOMINAL:
			return 'public_votation';
		default:
			return 'custom_point';
	}
}

export const getTranslationReqCode = reqCode => {
	switch (reqCode) {
		case -1:
			return "tooltip_failed_shipping";
		case 0:
			return "tooltip_not_sent";
		case 20:
			return "tooltip_pending_shipping";
		case 22:
			return "tooltip_inbox";
		case 25:
			return "tooltip_opened";
		case 32:
			return "clicked";
		case 35:
			return "tooltip_spam";
		case 36:
			return "tooltip_invalid_email_address";
		case 37:
			return "tooltip_dropped";
		default:
			return;
	}
};

export const printSessionExpiredError = () => {
	const messages = {
		es: "Su sesión ha caducado",
		en: "Session expired",
		cat: "La seva sessió ha caducat",
		gl: "A súa sesión caducou",
		pt: "A sua sessão expirou"
	};
	const selectedLanguage = sessionStorage.getItem("language");
	if (selectedLanguage) {
		return messages[selectedLanguage];
	}
	return messages["es"];
};

export const printCifAlreadyUsed = () => {
	//vat_previosly_save
	const messages = {
		pt: "Este NIF já foi previamente guardado",
		es: "Este CIF ha sido guardado previamente",
		en: " This VAT has been previously saved",
		cat: "Aquest CIF ha estat guardat prèviament",
		gal: "Este CIF foi gardado previamente"
	};
	const selectedLanguage = sessionStorage.getItem("language");
	if (selectedLanguage) {
		return messages[selectedLanguage];
	}
	return messages["es"];
};

export const printTrialEnded = () => {
	//vat_previosly_save
	const messages = {
		pt: "Período de prova finalizado",
		es: "Período de prueba finalizado",
		en: " Trial period ended",
		cat: "Període de prova finalitzat",
		gal: "Período de proba finalizado"
	};
	const selectedLanguage = sessionStorage.getItem("language");
	if (selectedLanguage) {
		return messages[selectedLanguage];
	}
	return messages["es"];
};

export const showVideo = council => {
	return (council.state === 20 || council.state === 30) && council.councilType === 0;
};

export const getMainRepresentative = participant => {
	return (participant.representatives && participant.representatives.length > 0)? participant.representatives[0] : null;
}

export const canAddPoints = council => {
	return council.statute.canAddPoints === 1 && council.councilType < 2;
};

export const hasHisVoteDelegated = participant => {
	return participant.state === 4;
};

export const getParticipantStateString = state => {
	switch (state) {
		case PARTICIPANT_STATES.REMOTE:
			return "REMOTE";

		case PARTICIPANT_STATES.PRESENT:
			return "PRESENT";

		case PARTICIPANT_STATES.REPRESENTATED:
			return "REPRESENTATED";

		case PARTICIPANT_STATES.DELEGATED:
			return "DELEGATED";

		case PARTICIPANT_STATES.PHYSICALLY_PRESENT:
			return "PHYSICALLY_PRESENT";

		case PARTICIPANT_STATES.NO_PARTICIPATE:
			return "NO_PARTICIPATE";

		case PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE:
			return "PRESENT_WITH_REMOTE_VOTE";

		default:
			return "INVALID_STATE";
	}
};

export const getParticipantStateField = participant => {
	switch (participant.state) {
		case 0:
			return "remote_assistance";

		case 1:
			return "physically_present_assistance";

		case 2:
			return "representated";

		case 4:
			return "delegated";

		case 5:
			return "physically_present_assistance";

		case 6:
			return "no_assist_assistance";

		case 7:
			return "physically_present_with_remote_vote";

		default:
			return "remote_assistance";
	}
};

export const isAskingForWord = participant => {
	return participant.requestWord === 1;
};

export const participantIsBlocked = participant => {
	return participant.blocked === 1;
};

export const participantNeverConnected = participant => {
	return participant.online === 0;
}

export const canUnblockParticipant = council => {
	return council.statute.canUnblock === 1;
};

export const haveGrantedWord = participant => {
	return participant.requestWord === 2;
};

export const exceedsOnlineTimeout = date => {
	const timeout = -moment(new Date(date)).diff(moment(), "seconds");
	return timeout > 15;
};

export const checkRequiredFields = (translate, draft, updateErrors, corporation, toast) => {
	let errors = {
		title: "",
		text: "",
		statuteId: "",
		type: "",
		votingType: "",
		majority: "",
		majorityDivider: "",
		majorityType: ""
	};

	let hasError = false;

	if (!draft.title) {
		hasError = true;
		errors.title = translate.required_field;
	}

	if (!draft.text) {
		//hasError = true;
		//errors.text = translate.required_field;
	} else {
		if (checkForUnclosedBraces(draft.text)) {
			errors.text = true;
			hasError = true;
			toast(
				<LiveToast
					message={translate.revise_text}
				/>, {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: true,
					className: "errorToast"
				}
			);
		}
	}

	if (draft.type === -1) {
		hasError = true;
		errors.type = translate.required_field;
	}

	if (draft.statuteId === -1 && !corporation) {
		hasError = true;
		errors.statuteId = translate.required_field;
	}

	if (draft.type === 1 && draft.votationType === -1) {
		hasError = true;
		errors.votationType = translate.required_field;
	}

	if (hasVotation(draft.votationType) && draft.type === 1 && draft.majorityType === -1) {
		hasError = true;
		errors.majorityType = translate.required_field;
		if (majorityNeedsInput(draft.majorityType)) {
			hasError = true;
			errors.majority = translate.required_field;
		}

		if (isMajorityFraction(draft.majorityType) && !draft.majorityDivider) {
			hasError = true;
			errors.majorityDivider = translate.required_field;
		}
	}

	updateErrors(errors);
	return hasError;
};

export const cleanAgendaObject = agenda => {
	const { attachments, ballots, items, options, __typename, votings, ...clean } = agenda;

	return clean;
}

export const formatSize = size => {
	let mb = Math.pow(1024, 2);
	let kb = 1024;

	if ((size >= 1024) ^ 2) {
		return Math.ceil((size / mb) * 100) / 100 + " MB";
	} else if (size >= 1024) {
		return Math.ceil((size / kb) * 100) / 100 + " KB";
	} else {
		return size + " Bytes";
	}
};

export const calculateMajorityAgenda = (agenda, company, council, recount) => {
	let specialSL = false;
	if (company.type === 1 && council.statute.quorumPrototype === 1) {
		specialSL = true;
	}
	return LiveUtil.calculateMajority(specialSL, recount.partTotal, agenda.presentCensus + agenda.currentRemoteCensus, agenda.majorityType, agenda.majority, agenda.majorityDivider, agenda.negativeVotings + agenda.negativeManual, council.statute.quorumPrototype);
}

export const calculateQuorum = (council, recount) => {
	let base;
	if (council.statute.quorumPrototype === 1) {
		base = !!recount ? recount.socialCapitalTotal : 0;
	} else {
		base = !!recount ? recount.numTotal : 0;
	}

	if (council.firstOrSecondConvene === 1) {
		return LiveUtil.calculateQuorum(base, council.statute.firstCallQuorumType, council.statute.firstCallQuorum, council.statute.firstCallQuorumDivider);
	}

	return LiveUtil.calculateQuorum(base, council.statute.secondCallQuorumType, council.statute.secondCallQuorum, council.statute.secondCallQuorumDivider);
}


export const councilHasSession = council => {
	return !((council.councilType === 2) || (council.councilType === COUNCIL_TYPES.NO_VIDEO && council.autoClose === 1))
}

