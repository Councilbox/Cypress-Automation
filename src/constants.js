export const MAX_FILE_SIZE = 10240;
export const MAX_COUNCIL_FILE_SIZE = 10240;
export const MAX_COUNCIL_ATTACHMENTS = 5;

export const agendaTypes = [
	"text",
	"public_voting",
	"public_act",
	"fake_public_votation",
	"private_act",
	"private_voting"
];

export const DRAFTS_LIMITS = [25, 50, 100, 250];
export const CENSUS_LIMITS = [25, 50, 100, 250];
export const PARTICIPANTS_LIMITS = [25, 50, 100, 250];
export const DELEGATION_USERS_LOAD = 25;

export const VOTE_VALUES = {
	NO_VOTE: -1,
	NEGATIVE: 0,
	POSITIVE: 1,
	ABSTENTION: 2
};

export const EMAIL_TRACK_STATES = {
	FAILED: -1,
	NOT_SENT: 0,
	PENDING_SHIPPING: 20,
	DELIVERED: 22,
	OPENED: 25,
	CLICKED: 32,
	SPAM: 35,
	INVALID_EMAIL_ADDRESS: 36,
	DROPPED: 37
};

export const EMAIL_STATES_FILTERS = {
	FAILED: -1,
	DROPPED: 37,
	INVALID_EMAIL_ADDRESS: 36,
	SPAM: 35,
	PENDING_SHIPPING: 20,
	DELIVERED: 22,
	OPENED: 25
};

export const PARTICIPANT_STATES = {
	REMOTE: 0,
	PRESENT: 1,
	REPRESENTATED: 2,
	DELEGATED: 4,
	PHYSICALLY_PRESENT: 5,
	NO_PARTICIPATE: 6,
	PRESENT_WITH_REMOTE_VOTE: 7
};

export const DRAFT_TYPES = {
	CONVENE_HEADER: 0,
	AGENDA: 1,
	INTRO: 2,
	CONSTITUTION: 3,
	CONCLUSION: 4,
	COMMENTS_AND_AGREEMENTS: 5
};

export const QUORUM_TYPES = [
	{
		value: -1,
		label: 'none'
	}, {
		value: 0,
		label: 'percentage'
	}, {
		value: 1,
		label: 'middle_plus_one'
	}, {
		value: 2,
		label: 'fraction'
	}, {
		value: 3,
		label: 'number'
	}
];

export const SEND_TYPES = [
	"convene",
	"reminder",
	"rescheduled",
	"cancellation",
	"room_access",
	"security",
	"act",
	'welcome',
    'restore_pwd',
    'point',
    'welcome'
];

export const COUNCIL_STATES = {
	CANCELED: -1,
	DRAFT: 0,
	PRECONVENE: 3,
	SAVED: 5,
	PREPARING: 10,
	ROOM_OPENED: 20,
	APPROVING_ACT_DRAFT: 30,
	FINISHED: 40,
	APPROVED: 60,
	FINAL_ACT_SENT: 70,
	NOT_CELEBRATED: 80,
	FINISHED_WITHOUT_ACT: 90,
	MEETING_FINISHED: 100
};

export const AGENDA_TYPES = {
	INFORMATIVE: 0,
	PUBLIC_VOTING: 1,
	PUBLIC_ACT: 2,
	FAKE_PUBLIC_VOTING: 3,
	PRIVATE_ACT: 4,
	PRIVATE_VOTING: 5
};

export const PARTICIPANT_ERRORS = {
	PARTICIPANT_BLOCKED: 470,
	PARTICIPANT_IS_NOT_REMOTE: 471,
	DEADLINE_FOR_LOGIN_EXCEEDED: 472
};

export const AGENDA_STATES = {
	INITIAL: 0,
	DISCUSSION: 1,
	CLOSED: 2
};
