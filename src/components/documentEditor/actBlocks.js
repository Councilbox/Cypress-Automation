import iconVotaciones from '../../assets/img/handshake.svg';
import iconAsistentes from '../../assets/img/meeting.svg';
import iconDelegaciones from '../../assets/img/networking.svg';

export const blocks = {
    TEXT: {
        id: Math.random().toString(36).substr(2, 9),
        secondaryText: 'Insert text',
        type: "text",
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
        colorBorder: "#61abb7"
    },
    DELEGATION_LIST: {
        id: Math.random().toString(36).substr(2, 9),
        label: "Lista de delegaciones",
        text: "",
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
        text: "",
        editButton: false,
        hideDelete: true,
        type: 'agreements',
        language: 'es',
        secondaryLanguage: 'en',
    }
}
