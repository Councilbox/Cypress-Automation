import iconAsistentes from '../../assets/img/meeting.svg';
import iconDelegaciones from '../../assets/img/networking.svg';

export const blocks = {
	TEXT: {
		id: Math.random().toString(36).substr(2, 9),
		secondaryText: 'Insert text',
		type: 'text',
		editButton: true
	},
	ACT_TITLE: {
		id: Math.random().toString(36).substr(2, 9),
		label: 'title',
		type: 'title',
		editButton: true,
	},
	ACT_INTRO: {
		id: Math.random().toString(36).substr(2, 9),
		label: 'intro',
		type: 'intro',
		editButton: true,
	},
	ACT_CONSTITUTION: {
		id: Math.random().toString(36).substr(2, 9),
		label: 'constitution',
		type: 'constitution',
		editButton: true,
	},
	ACT_CONCLUSION: {
		id: Math.random().toString(36).substr(2, 9),
		label: 'conclusion',
		type: 'conclusion',
		editButton: true,
	},
	AGENDA_LIST: {
		id: Math.random().toString(36).substr(2, 9),
		label: 'agenda',
		type: 'agendaList',
		editButton: true,
	},
	ATTENDANTS_LIST: {
		id: Math.random().toString(36).substr(2, 9),
		label: 'assistants_list',
		text: '',
		editButton: false,
		logic: true,
		language: 'es',
		secondaryLanguage: 'en',
		type: 'attendants',
		icon: iconAsistentes,
		colorBorder: '#61abb7'
	},
	DELEGATION_LIST: {
		id: Math.random().toString(36).substr(2, 9),
		label: 'Lista de delegaciones', // TRADUCCION
		text: '',
		editButton: false,
		type: 'delegations',
		language: 'es',
		secondaryLanguage: 'en',
		logic: true,
		icon: iconDelegaciones,
		colorBorder: '#7f94b6'
	},
	AGENDA: {
		id: Math.random().toString(36).substr(2, 9),
		label: 'comments_and_agreements',
		text: '',
		editButton: false,
		hideDelete: true,
		type: 'agreements',
		language: 'es',
		secondaryLanguage: 'en',
	},
	CERT_HEADER: {
		id: Math.random().toString(36).substr(2, 9),
		label: 'header',
		text: '',
		secondaryText: '',
		editButton: true,
		type: 'cert_header',
		language: 'es',
		secondaryLanguage: 'en',
	},
	CERT_TITLE: {
		id: Math.random().toString(36).substr(2, 9),
		label: 'title',
		text: '',
		secondaryText: '',
		hideDelete: true,
		editButton: true,
		type: 'cert_title',
		language: 'es',
		secondaryLanguage: 'en',
	},
	CERT_FOOTER: {
		id: Math.random().toString(36).substr(2, 9),
		label: 'certificate_footer',
		text: '',
		secondaryText: '',
		editButton: true,
		type: 'cert_footer',
		language: 'es',
		secondaryLanguage: 'en',
	},
	CERT_AGENDA: {
		id: Math.random().toString(36).substr(2, 9),
		label: 'agenda',
		text: '',
		secondaryText: '',
		editButton: false,
		hideDelete: true,
		type: 'cert_agenda',
		language: 'es',
		secondaryLanguage: 'en',
	}
};

export const actBlocks = {
	TEXT: blocks.TEXT,
	ACT_TITLE: blocks.ACT_TITLE,
	ACT_INTRO: blocks.ACT_INTRO,
	ACT_CONSTITUTION: blocks.ACT_CONSTITUTION,
	ACT_CONCLUSION: blocks.ACT_CONCLUSION,
	AGENDA_LIST: blocks.ACT_CONCLUSION,
	ATTENDANTS_LIST: blocks.ATTENDANTS_LIST,
	DELEGATION_LIST: blocks.DELEGATION_LIST,
	AGENDA: blocks.AGENDA
};

export const certBlocks = {
	TEXT: blocks.TEXT,
	CERT_HEADER: blocks.CERT_HEADER,
	CERT_AGENDA: blocks.CERT_AGENDA,
	CERT_FOOTER: blocks.CERT_FOOTER

};
