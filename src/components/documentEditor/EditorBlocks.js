import iconVotaciones from '../../assets/img/handshake.svg';
import iconAsistentes from '../../assets/img/meeting.svg';
import iconDelegaciones from '../../assets/img/networking.svg';
import { getAgendaResult, hasVotation } from '../../utils/CBX';

//TRADUCCION
// expand: true
export const getBlocks = translate => ({
    TEXT: {
        id: Math.random().toString(36).substr(2, 9),
        label: "Bloque de texto",
        text: 'Inserte el texto',
        type: "text",
        editButton: true
    },
    ACT_TITLE: {
        id: Math.random().toString(36).substr(2, 9),
        label: "Titulo de la reunion",
        text: "<b>Titulo de la reunion</b>",
        type: 'title',
        noBorrar: true
    },
    ACT_INTRO: intro => ({
        id: Math.random().toString(36).substr(2, 9),
        label: 'intro',
        text: intro,
        type: 'intro',
        editButton: true,
        noBorrar: true
    }),
    ACT_CONSTITUTION: constitution => ({
        id: Math.random().toString(36).substr(2, 9),
        label: 'constitution',
        text: constitution,
        type: 'constitution',
        editButton: true,
        noBorrar: true
    }),
    ACT_CONCLUSION: conclusion => ({
        id: Math.random().toString(36).substr(2, 9),
        label: 'conclusion',
        text: conclusion,
        type: 'conclusion',
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
            type: 'agenda',
            noBorrar: true,
        }
    },
    AGENDA_INTRO: {
        id: Math.random().toString(36).substr(2, 9),
        label: "entrar",
        text: "<b>A continuación se entra a debatir el primer punto del Orden del día</b>",
        type: 'introAgenda',
        noBorrar: false,
        editButton: true
    },
    ATTENDANTS_LIST: {
        id: Math.random().toString(36).substr(2, 9),
        label: translate.assistants_list,
        text: '',
        editButton: false,
        logic: true,
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
                type: 'agendaSubject',
                noBorrar: false,
                editButton: false
            },
            {
                id: Math.random().toString(36).substr(2, 9),
                label: "Punto " + (index + 1) + " - " + translate.description,
                text: element.description,
                editButton: true,
                type: 'description',
                noBorrar: true,
                editButton: false
            },
            {
                id: Math.random().toString(36).substr(2, 9),
                label: "Punto " + (index + 1) + " - Toma de acuerdos",
                text: element.comment,
                editButton: true,
                type: 'comment',
                noBorrar: true
            }
        ]);

        if(hasVotation(element.subjectType)){
            newArray = newArray.concat([
                {
                    id: Math.random().toString(36).substr(2, 9),
                    label: "Punto " + (index + 1) + " - Votos", text: "<b>Votos</b> </br> A FAVOR, EN CONTRA, ABSTENCIÓN",
                    editButton: false,
                    type: "votes",
                    noBorrar: true,
                    editButton: false,
                    logic: false,
                    text: `
                        <div style="padding: 10px;border: solid 1px #BFBFBF;font-size: 11px">
                            <b>Votaciones: </b>
                            <br> A FAVOR: ${getAgendaResult(element, 'POSITIVE')} | EN CONTRA: ${getAgendaResult(element, 'NEGATIVE')} | ABSTENCIONES:
                            ${getAgendaResult(element, 'ABSTENTION')} | NO VOTAN: ${getAgendaResult(element, 'NO_VOTE')}
                            <br>
                        </div>`
                },
                {
                    id: Math.random().toString(36).substr(2, 9),
                    label: "Punto " + (index + 1) + " - Listado de votantes",
                    text: "",
                    editButton: false,
                    type: 'voting',
                    noBorrar: false,
                    editButton: false,
                    data: {
                        agendaId: element.id
                    },
                    logic: true,
                    icon: iconVotaciones,
                    colorBorder: '#866666'
                }
            ])
        }

        newArray = newArray.concat([
            {
                id: Math.random().toString(36).substr(2, 9),
                label: "Punto " + (index + 1) + " - Comentarios",
                text: "<b>Comentarios</b> </br>" + element.description,
                editButton: false,
                type: 'agendaComments',
                colorBorder:"#b39a5b",
                noBorrar: false,
                data: {
                    agendaId: element.id
                },
                editButton: false
            }
        ])
    });

    const block = {
        id: Math.random().toString(36).substr(2, 9),
        label: "agreements",
        editButton: true,
        type: 'agreements',
        noBorrar: true,
        editButton: false,
        text: '',
        items: newArray,
        expand: true
    }

    return block;
}