export const MAX_FILE_SIZE = 10240;
export const MAX_COUNCIL_FILE_SIZE = 10240;
export const MAX_COUNCIL_ATTACHMENTS = 5;
export const ALPHA_RELEASE_DATE = '10/26/2018';

export const agendaTypes = [
	"text",
	"public_voting",
	"public_act",
	"fake_public_votation",
	"private_act",
	"private_voting"
];

export const COUNCIL_TYPES = {
	FORMAL: 0,
	NO_VIDEO: 1
}

export const DRAFTS_LIMITS = [25, 50, 100, 250];
export const CENSUS_LIMITS = [25, 50, 100, 250];
export const PARTICIPANTS_LIMITS = [25, 50, 100, 250];
export const DELEGATION_USERS_LOAD = 25;

export const VOTE_VALUES = {
	VOTED: -2,
	NO_VOTE: -1,
	NEGATIVE: 0,
	POSITIVE: 1,
	ABSTENTION: 2
};

export const USER_ACTIVATIONS = {
	NOT_CONFIRMED: 0,
	CONFIRMED: 1,
	PREMIUM: 2,
	FREE_TRIAL: 3
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

export const MAJORITY_TYPES = {
	SIMPLE: 1,
	ABSOLUTE: 2,
	TWO_THIRDS: 4,
	PERCENTAGE: 0,
	FRACTION: 5,
	NUMBER: 6
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

export const COUNCIL_EVIDENCES = [
	'START_COUNCIL',
	'OPEN_POINT_DISCUSSION',
	'CLOSE_POINT_DISCUSSION',
	'OPEN_VOTING',
	'CLOSE_VOTING',
	'REOPEN_VOTING',
	'END_COUNCIL',
	'VOTE',
	'UPDATE_VOTE',
	'PARTICIPANT_LOGIN',
	'PARTICIPANT_CONNECT',
	'PARTICIPANT_DISCONNECT'
];

export const USER_EVIDENCES = [
	'LOGIN'
]

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

export const PARTICIPANT_TYPE = {
	PARTICIPANT: 0,
	GUEST: 1,
	REPRESENTATIVE: 2,
	REPRESENTATED: 3
};

export const AGENDA_TYPES = {
	INFORMATIVE: 0,
	PUBLIC_VOTING: 1,
	PUBLIC_ACT: 2,
	FAKE_PUBLIC_VOTING: 3,
	PRIVATE_ACT: 4,
	PRIVATE_VOTING: 5,
	CUSTOM_PUBLIC: 8,
	CUSTOM_PRIVATE: 7,
	CUSTOM_NOMINAL: 6
};

//CONTINUATION OF AGENDA_TYPES
export const CUSTOM_AGENDA_VOTING_TYPES = [
	{
		label: 'public_voting',
		value: 6
	},
	{
		label: 'private_voting',
		value: 7
	},
	{
		label: 'fake_public_votation',
		value: 8
	}
];

export const GOVERNING_BODY_TYPES = {
	NONE: {
		value: 0,
		label: 'Ninguno'
	},
	ONE_PERSON: {
		value: 1,
		label: 'Administrador único'
	},
	ONE_ENTITY: {
		value: 2,
		label: 'Ad. único persona jurídica'
	},
	JOINT_ADMIN: {
		value: 3,
		label: 'Administrador mancomunado'
	},
	SOLIDARY_ADMIN: {
		value: 4,
		label: 'Administrador solidario'
	},
	COUNCIL: {
		value: 5,
		label: 'Consejo de administra'
	}
}

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

export const SIGNATURE_STATES = {
	DRAFT: 0,
	SENT: 10,
	COMPLETED: 20,
	ARCHIVED: 30
};

export const SIGNATURE_PARTICIPANTS_STATES = {
	IN_QUEUE: 0,
	SENT: 5,
	OPENED: 10,
	SIGNING: 12,
	SIGNED: 15,
	EXPIRED: 20,
	CANCELED: 25,
	REJECTED: 30,
	ERROR: 35
};
