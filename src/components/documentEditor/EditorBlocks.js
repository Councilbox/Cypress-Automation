
export const blocks = {
    TEXT: {
        type: "text",
        editButton: true
    },
    ACT_TITLE: {
        type: 'title',
        editButton: true,
        noBorrar: false
    },
    ACT_INTRO: {
        type: 'intro',
        editButton: true,
        noBorrar: false
    },
    ACT_CONSTITUTION: {
        type: 'constitution',
        editButton: true,
        noBorrar: false
    },
    ACT_CONCLUSION: {
        type: 'conclusion',
        editButton: true,
        noBorrar: false
    },
    AGENDA_LIST: {
        type: 'agendaList',
        noBorrar: false,
        editButton: true,
    },
    AGENDA_INTRO: {
        type: 'introAgenda',
        noBorrar: false,
        editButton: true
    },
    ATTENDANTS_LIST: {
        editButton: false,
        logic: true,
        //language: 'es',
        //secondaryLanguage: 'en',
        type: 'attendants',
        //icon: iconAsistentes,
        colorBorder: "#61abb7"
    },
    DELEGATION_LIST: {
        editButton: false,
        type: 'delegations',
        // language: 'es',
        // secondaryLanguage: 'en',
        logic: true,
        //icon: iconDelegaciones,
        colorBorder: '#7f94b6'
    },
    AGENDA: {
        editButton: true,
        type: 'agreements',
        noBorrar: true,
        editButton: false,
        //items: newArray,
        expand: true
    }
}



// export const generateAgendaBlocks = (translate, agenda, secondaryLanguage = {}) => {
//     const blocks = getBlocks(translate);

//     //TRADUCCION
//     let newArray = [
//         blocks.AGENDA_INTRO
//     ];
//     agenda.forEach((element, index) => {
//         newArray = newArray.concat([
//             {
//                 id: Math.random().toString(36).substr(2, 9),
//                 label: `${translate.agenda_point} ${(index + 1)} - ${translate.title}`,
//                 text: '<b>' + (index + 1) + " - " + element.agendaSubject + "</b>",
//                 secondaryText: '<b>' + (index + 1) + " - " + element.agendaSubject + "</b>",
//                 editButton: true,
//                 type: 'agendaSubject',
//                 noBorrar: false,
//                 editButton: true
//             },
//             {
//                 id: Math.random().toString(36).substr(2, 9),
//                 label: `${translate.agenda_point} ${(index + 1)} - ${translate.description}`,
//                 text: element.description,
//                 secondaryText: element.description,
//                 editButton: true,
//                 type: 'description',
//                 noBorrar: false,
//                 editButton: true
//             },
//             {
//                 id: Math.random().toString(36).substr(2, 9),
//                 label: `${translate.agenda_point} ${(index + 1)} - ${translate.comments_and_agreements}`,
//                 text: '',
//                 secondaryText: '',
//                 editButton: true,
//                 type: 'comment',
//                 noBorrar: true
//             }
//         ]);

//         if(hasVotation(element.subjectType)){
//             newArray = newArray.concat([
//                 {
//                     id: Math.random().toString(36).substr(2, 9),
//                     label: "Punto " + (index + 1) + " - Votos", text: "<b>Votos</b> </br> A FAVOR, EN CONTRA, ABSTENCIÓN",
//                     editButton: false,
//                     type: "votes",
//                     noBorrar: true,
//                     editButton: false,
//                     logic: false,
//                     buildDefaultValue: (data, translate) => {
//                         return (
//                             'JIBIRI JIBIRI'
//                         )
//                     },
//                     text: `
//                         <div style="padding: 10px;border: solid 1px #BFBFBF;font-size: 11px">
//                             <b>Votaciones: </b>
//                             <br> A FAVOR: ${getAgendaResult(element, 'POSITIVE')} | EN CONTRA: ${getAgendaResult(element, 'NEGATIVE')} | ABSTENCIONES:
//                             ${getAgendaResult(element, 'ABSTENTION')} | NO VOTAN: ${getAgendaResult(element, 'NO_VOTE')}
//                             <br>
//                         </div>`,
//                     secondaryText: `
//                         <div style="padding: 10px;border: solid 1px #BFBFBF;font-size: 11px">
//                             <b>Votings: </b>
//                             <br> IN FAVOR: ${getAgendaResult(element, 'POSITIVE')} | AGAINST: ${getAgendaResult(element, 'NEGATIVE')} | ABSTENTIONS:
//                             ${getAgendaResult(element, 'ABSTENTION')} | NO VOTE: ${getAgendaResult(element, 'NO_VOTE')}
//                             <br>
//                         </div>`
//                 },
//                 {
//                     id: Math.random().toString(36).substr(2, 9),
//                     label: "Punto " + (index + 1) + " - Listado de votantes",
//                     text: "",
//                     editButton: false,
//                     type: 'voting',
//                     hide: false,
//                     noBorrar: false,
//                     editButton: false,
//                     data: {
//                         agendaId: element.id
//                     },
//                     logic: true,
//                     language: 'es',
//                     secondaryLanguage: 'en',
//                     icon: iconVotaciones,
//                     colorBorder: '#866666'
//                 }
//             ])
//         }

//         newArray = newArray.concat([
//             {
//                 id: Math.random().toString(36).substr(2, 9),
//                 label: "Punto " + (index + 1) + " - Comentarios",
//                 text: "<b>Comentarios</b> </br>" + element.description,
//                 editButton: false,
//                 type: 'agendaComments',
//                 logic: true,
//                 language: 'es',
//                 secondaryLanguage: 'en',
//                 colorBorder:"#b39a5b",
//                 noBorrar: false,
//                 data: {
//                     agendaId: element.id
//                 },
//                 editButton: false
//             }
//         ])
//     });

//     const block = {
//         id: Math.random().toString(36).substr(2, 9),
//         label: "agreements",
//         editButton: true,
//         type: 'agreements',
//         noBorrar: true,
//         editButton: false,
//         text: '',
//         items: newArray,
//         expand: true
//     }

//     return block;
// }