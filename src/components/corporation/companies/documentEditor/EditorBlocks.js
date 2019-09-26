import iconVotaciones from '../../../../assets/img/handshake.svg';
import iconAsistentes from '../../../../assets/img/meeting.svg';
import iconDelegaciones from '../../../../assets/img/networking.svg';

//TRADUCCION
export const getBlocks = translate => ({
    TEXT: {
        id: Math.random().toString(36).substr(2, 9),
        label: "Bloque de texto",
        text: 'Inserte el texto',
        originalName: "text",
        editButton: true
    },
    ACT_TITLE: {
        id: Math.random().toString(36).substr(2, 9),
        label: "Titulo de la reunion",
        text: "<b>Titulo de la reunion</b>",
        originalName: 'title',
        noBorrar: true
    },
    ACT_INTRO: intro => ({
        id: Math.random().toString(36).substr(2, 9),
        label: 'intro',
        text: intro,
        originalName: 'intro',
        editButton: true,
        noBorrar: true
    }),
    ACT_CONSTITUTION: constitution => ({
        id: Math.random().toString(36).substr(2, 9),
        label: 'constitution',
        text: constitution,
        originalName: 'constitution',
        editButton: true,
        noBorrar: true
    }),
    ACT_CONCLUSION: conclusion => ({
        id: Math.random().toString(36).substr(2, 9),
        label: 'conclusion',
        text: conclusion,
        originalName: 'conclusion',
        editButton: true,
        noBorrar: true
    }),
    AGENDA_LIST: agenda => {
        let puntos = "<b>Para tratar el siguiente Orden de Día </b> </br>"
        agenda.forEach((element, index) => {
            puntos += (index + 1) + "- " + element.agendaSubject + "</br>";
        });
        return {
            id: Math.random().toString(36).substr(2, 9),
            label: translate.agenda,
            text: puntos,
            originalName: 'agenda',
            noBorrar: true,
            expand: true
        }
    },
    AGENDA_INTRO: {
        id: Math.random().toString(36).substr(2, 9),
        label: "entrar",
        text: "<b>A continuación se entra a debatir el primer punto del Orden del día</b>",
        originalName: 'introAgenda',
        noBorrar: false,
        editButton: true
    },
    ATTENDANTS_LIST: {
        id: Math.random().toString(36).substr(2, 9),
        label: translate.assistants_list,
        text: '',
        editButton: false,
        logic: true,
        originalName: 'attendants',
        icon: iconAsistentes,
        colorBorder: "#61abb7"
    },
    DELEGATION_LIST: {
        id: Math.random().toString(36).substr(2, 9),
        label: "Lista de delegaciones",
        text: "",
        editButton: false,
        originalName: 'delegations',
        logic: true,
        icon: iconDelegaciones,
        colorBorder: '#7f94b6'
    }
})




export const generateAgendaBlocks = (translate, agenda) => {
    const blocks = getBlocks(translate);

    //TRADUCCION
    let newArray = [
        blocks.AGENDA_INTRO
    ];
    agenda.forEach((element, index) => {
        newArray = newArray.concat([
            {
                id: Math.random().toString(36).substr(2, 9),
                label: "Punto " + (index + 1) + " - " + translate.title,
                text: '<b>' + (index + 1) + " - " + element.agendaSubject + "</b>",
                editButton: true,
                originalName: 'agendaSubject',
                noBorrar: false,
                editButton: false
            },
            {
                id: Math.random().toString(36).substr(2, 9),
                label: "Punto " + (index + 1) + " - " + translate.description,
                text: element.description,
                editButton: true,
                originalName: 'description',
                noBorrar: true,
                editButton: false
            },
            {
                id: Math.random().toString(36).substr(2, 9),
                label: "Punto " + (index + 1) + " - Toma de acuerdos",
                text: element.comment,
                editButton: true,
                originalName: 'comment',
                noBorrar: true
            },
            {
                id: Math.random().toString(36).substr(2, 9),
                label: "Punto " + (index + 1) + " - Votos", text: "<b>Votos</b> </br> A FAVOR, EN CONTRA, ABSTENCIÓN",
                editButton: false,
                originalName: "votes",
                noBorrar: true,
                editButton: false,
                logic: true
            },
            {
                id: Math.random().toString(36).substr(2, 9),
                label: "Punto " + (index + 1) + " - Votaciones",
                text: "",
                editButton: false,
                originalName: 'voting',
                noBorrar: false,
                editButton: false,
                logic: true,
                icon: iconVotaciones,
                colorBorder: '#866666'
            },
            {
                id: Math.random().toString(36).substr(2, 9),
                label: "Punto " + (index + 1) + " - Comentarios",
                text: "<b>Comentarios</b> </br>" + element.description,
                editButton: false,
                originalName: 'agendaComments',
                noBorrar: true,
                editButton: false
            }
        ])
    });

    const block = {
        id: Math.random().toString(36).substr(2, 9),
        label: "agreements",
        editButton: true,
        originalName: 'agreements',
        noBorrar: true,
        editButton: false,
        text: '',
        items: newArray
    }

    return block;
}