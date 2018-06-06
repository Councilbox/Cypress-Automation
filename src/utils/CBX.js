import {
	MAX_COUNCIL_ATTACHMENTS,
	MAX_COUNCIL_FILE_SIZE,
	PARTICIPANT_STATES,
	SEND_TYPES,
	COUNCIL_STATES,
	AGENDA_TYPES,
	VOTE_VALUES
} from "../constants";
import moment from "moment";
import dropped from "../assets/img/dropped.png";
import delivered from "../assets/img/delivered.png";
import invalidEmailAddress from "../assets/img/invalid_email_address.png";
import notSent from "../assets/img/not_sent.png";
import opened from "../assets/img/opened.png";
import pendingShipping from "../assets/img/pending_shipping.png";
import spam from "../assets/img/spam.png";
import LiveUtil from './live';

export const canReorderPoints = council => {
	return council.statute.canReorderPoints === 1;
};

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

export const agendaVotingsOpened = agenda => {
	return agenda.votingState !== 0;
};
export const agendaClosed = agenda => {
	return agenda.pointState === 2;
};

export const councilHasVideo = council => {
	return council.councilType === 0;
};

export const censusHasParticipations = census => {
	return census.quorumPrototype === 1;
};

export const councilHasParticipations = council => {
	return council.statute.quorumPrototype === 1;
};

export const hasVotation = pointType => {
	return pointType === 1 || pointType === 3 || pointType === 5;
};

export const pointIsClosed = agendaPoint => {
	if (hasVotation(agendaPoint.subjectType)) {
		return agendaPoint.votingState === 2 && agendaPoint.pointState === 2;
	}
	return agendaPoint.pointState === 2;
};

export const majorityNeedsInput = majorityType => {
	return majorityType === 0 || majorityType === 5 || majorityType === 6;
};

export const haveQualityVoteConditions = (agenda, council) => {
	return (agenda.subjectType === AGENDA_TYPES.PUBLIC_ACT || agenda.subjectType === AGENDA_TYPES.PUBLIC_VOTING) &&
			(agenda.majorityType === 1) && (agenda.positiveVotings + agenda.positiveManual) === (agenda.negativeVotings +
			agenda.negativeManual) && council.statute.existsQualityVote;
};

export const approvedByQualityVote = (agenda, qualityVoteId) => {
	if(agenda.votings && qualityVoteId){
		const qualityVote = agenda.votings.find(item => item.participantId === qualityVoteId);
		if(qualityVote){
			if(qualityVote.vote === VOTE_VALUES.POSITIVE){
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
		participant.state !== 3 &&
		participant.type === 0
	);
};

export const canHaveRepresentative = participant => {
	return participant.type === 0 && participant.state !== 3;
};

export const delegatedVotesLimitReached = (statute, length) => {
	return (
		statute.existMaxNumDelegatedVotes === 1 &&
		length >= statute.maxNumDelegatedVotes
	);
};

export const canBePresentWithRemoteVote = statute => {
	return statute.existsPresentWithRemoteVote === 1;
};

export const filterAgendaVotingTypes = (votingTypes, statute) => {
	if (statute.existsPresentWithRemoteVote === 1) {
		return votingTypes.filter(
			type => type.label === "text" || type.label === "public_votation"
		);
	}
	return votingTypes;
};

export const hasSecondCall = statute => {
	return statute.existsSecondCall === 1;
};

export const checkMinimunDistanceBetweenCalls = (
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

export const addMinimunDistance = (date, statute) => {
	const momentDate = moment(new Date(date).toISOString());
	return momentDate.add(statute.minimumSeparationBetweenCall, "minutes");
};

export const changeVariablesToValues = (text, data) => {
	if (!data || !data.company || !data.council) {
		throw new Error("Missing data");
	}

	if (!text) {
		return "";
	}

	text = text.replace(
		"{{dateFirstCall}}",
		moment(
			new Date(data.council.dateStart).toISOString(),
			moment.ISO_8601
		).format("LLL")
	);
	text = text.replace("{{business_name}}", data.company.businessName);
	text = text.replace("{{city}}", data.council.city);
	text = text.replace("{{street}}", data.council.street);
	text = text.replace("{{country_state}}", data.council.countryState);
	if (data.votings) {
		text = text.replace("{{positiveVotings}}", data.votings.positive);
		text = text.replace("{{negativeVotings}}", data.votings.negative);
	}
	return text;
};

export const hasParticipations = (statute = {}) => {
	return statute.quorumPrototype === 1;
};

export const isRepresentative = participant => {
	return participant.type === 2;
};

export const isRepresented = participant => {
	return participant.state === 2;
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
	return council.state === COUNCIL_STATES.NOT_CELEBRATED;
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
	return vote.presentVote === 1;
};

export const addDecimals = (num, fixed) => {
	num = num.toString();
	return num.slice(0, num.indexOf(".") + fixed + 1);
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
		let blob = new Blob([bufferArray], {
			type: filetype
		});
		let objectUrl = URL.createObjectURL(blob);

		let a = document.createElement("a");
		a.style.cssText = "display: none";
		document.body.appendChild(a);
		a.href = objectUrl;
		a.download = filename;
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

export const checkCouncilState = (council, company, bHistory, expected) => {
	switch (council.state) {
		case 0:
			if (expected !== "draft") {
				bHistory.push(`/company/${company.id}/council/${council.id}`);
			}
			break;
		case 5:
			if (expected !== "convened") {
				bHistory.push(
					`/company/${company.id}/council/${council.id}/prepare`
				);
			}
			break;
		case 10:
			if (expected !== "convened") {
				bHistory.push(
					`/company/${company.id}/council/${council.id}/prepare`
				);
			}
			break;
		case 20:
			if (expected !== "live") {
				bHistory.push(
					`/company/${company.id}/council/${council.id}/live`
				);
			}
			break;
		default:
			return;
	}
};

export const participantIsGuest = participant => {
	return participant.type === 1;
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
	return agenda.pointState !== 2;
};

export const agendaPointNotOpened = agenda => {
	return agenda.pointState === 0;
};

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

export const showVideo = council => {
	return council.state === 20 && council.councilType === 0;
};

export const canAddPoints = council => {
	return council.statute.canAddPoints === 1;
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

export const checkRequiredFields = (translate, draft, updateErrors) => {
	let errors = {
		title: "",
		description: "",
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

	if (!draft.description) {
		hasError = true;
		errors.description = translate.required_field;
	}

	if (!draft.text) {
		hasError = true;
		errors.text = translate.required_field;
	}

	if (draft.type === -1) {
		hasError = true;
		errors.type = translate.required_field;
	}

	if (draft.statuteId === -1) {
		hasError = true;
		errors.statuteId = translate.required_field;
	}

	if (draft.type === 1 && draft.votationType === -1) {
		hasError = true;
		errors.votationType = translate.required_field;
	}

	if (hasVotation(draft.votationType) && draft.majorityType === -1) {
		hasError = true;
		errors.majorityType = translate.required_field;
	}

	if (majorityNeedsInput(draft.majorityType) && !draft.majority) {
		hasError = true;
		errors.majority = translate.required_field;
	}

	if (isMajorityFraction(draft.majorityType) && !draft.majorityDivider) {
		hasError = true;
		errors.majorityDivider = translate.required_field;
	}

	updateErrors(errors);

	return hasError;
};

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
	if(company.type === 1 && council.quorumPrototype === 1){
		specialSL = true;
	}
	return LiveUtil.calculateMajority(specialSL, recount.partTotal, agenda.presentCensus + agenda.currentRemoteCensus, agenda.majorityType, agenda.majority, agenda.majorityDivider, agenda.negativeVotings + agenda.negativeManual, council.quorumPrototype);
}
