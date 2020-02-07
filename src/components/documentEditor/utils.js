import React from 'react';
import { blocks } from './actBlocks';
import iconVotaciones from '../../assets/img/handshake.svg';
import iconAsistentes from '../../assets/img/meeting.svg';
import iconAgendaComments from '../../assets/img/speech-bubbles-comment-option.svg';
import { getAgendaResult, hasVotation } from '../../utils/CBX';
import iconDelegaciones from '../../assets/img/networking.svg';
import { TAG_TYPES } from '../company/drafts/draftTags/utils';

const filterHiddenItems = item => !item.hide;

const flatItems = (acc, curr) => {
    return curr.items ? [
        ...acc,
        ...curr.items.filter(filterHiddenItems)
    ] : [...acc, curr];
}

const prepareColumn = (column, secondary) => {
    return column.reduce(flatItems, []).map(item => ({
        type: item.type,
        text: secondary? item.secondaryText : item.text,
        data: item.data
    }));
}

export const buildDocVariable = (doc, options) => {
    return ({
        fragments: prepareColumn(doc),
        secondaryColumn: options.doubleColumn? prepareColumn(doc, true) : undefined,
        options: {
            ...options,
            language: 'es',
            secondaryLanguage: 'en'
        }
    });
}

export const buildDocBlock = (item, data, translate = {}, secondaryTranslate = {}) => {
    const blockTypes = {
        text: () => ({
            ...item,
            id: Math.random().toString(36).substr(2, 9),
            label: "Bloque de texto", //TRADUCCIÓN
            text: 'Inserte el texto',
            secondaryText: 'Insert text',
        }),
        title: () => ({
            ...item,
            id: Math.random().toString(36).substr(2, 9),
            text: data.council.name,
            secondaryText: data.council.name,
        }),
        intro: () => ({
            ...item,
            id: Math.random().toString(36).substr(2, 9),
            label: 'intro',
            text: data.council.act.intro,
            secondaryText: data.council.act.intro,
        }),
        constitution: () => ({
            ...item,
            id: Math.random().toString(36).substr(2, 9),
            label: 'constitution',
            text: data.council.act.constitution,
            secondaryText: data.council.act.constitution,
        }),
        conclusion: () => ({
            ...item,
            id: Math.random().toString(36).substr(2, 9),
            label: 'conclusion',
            text: data.council.act.conclusion,
            secondaryText: data.council.act.conclusion,
        }),
        agendaList: () => {
            let puntos = `<b>${translate.agenda}</b> </br>`//TRADUCCION
            data.agendas.forEach((element, index) => {
                puntos += (index + 1) + "- " + element.agendaSubject + "</br>";
            });
            return {
                ...item,
                id: Math.random().toString(36).substr(2, 9),
                label: translate.agenda,
                text: puntos,
                secondaryText: `<b>${secondaryTranslate.agenda}</b> </br>
                    ${data.agendas.forEach((element, index) => {
                        puntos += (index + 1) + "- " + element.agendaSubject + "</br>";
                    })}`
            }
        },
        attendants: () => ({
            ...item,
            id: Math.random().toString(36).substr(2, 9),
            label: translate.assistants_list,
            text: '',
            language: translate.selectedLanguage,
            secondaryLanguage:  secondaryTranslate.selectedLanguage,
            icon: iconAsistentes
        }),
        delegations: () => ({
            ...item,
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
        }),
        agreements: () => ({
            ...item,
            label: "entrar",
            items: generateAgendaBlocks(data, translate, secondaryTranslate),
            text: "<b>A continuación se entra a debatir el primer punto del Orden del día</b>",//TRADUCCION
            secondaryText: "<b>Next, the first item on the agenda will be discussed</b>",//TRADUCCION
        }),
        cert_header: () => ({
            ...item
        }),
        cert_footer: () => ({
            ...item
        }),
        cert_agenda: () => ({
            ...item,
            label: "agenda",
            items: generateCertAgendaBlocks(data, translate, secondaryTranslate),
            text: "",
            secondaryText: "",
        })
    }

    if(!blockTypes[item.type]){
        throw new Error('Invalid block type');
    }

    return blockTypes[item.type]();
}

export function generateCertAgendaBlocks(data, translate, secondaryTranslate = {}){
    const agenda = data.agendas;

    console.log(agenda);

    return agenda.map((point, index) => ({
        id: Math.random().toString(36).substr(2, 9),
        label: `Incluir punto ${point.orderIndex}`,
        text: "",
        editButton: false,
        type: 'agendaComments',
        logic: true,
        language: 'es',
        toggleable: true,
        hide: false,
        secondaryLanguage: 'en',
        colorBorder:"#b39a5b",
        noBorrar: false,
        data: {
            agendaId: point.id
        }
    }));
} 


export function generateAgendaBlocks (data, translate, secondaryTranslate = {}){
    const agenda = data.agendas;
    //TRADUCCION
    let newArray = [
        {
            id: Math.random().toString(36).substr(2, 9),
            label: "Intro agenda",//TRADUCCION
            type: 'introAgenda',
            editButton: true,
            text: "<b>A continuación se entra a debatir el primer punto del Orden del día</b>",//TRADUCCION
            secondaryText: "<b>Next, the first item on the agenda will be discussed</b>",//TRADUCCION
        }
    ];

    agenda.forEach((element, index) => {
        newArray = newArray.concat([
            {
                id: Math.random().toString(36).substr(2, 9),
                label: `${translate.agenda_point} ${(index + 1)} - ${translate.title}`,
                text: '<b>' + (index + 1) + " - " + element.agendaSubject + "</b>",
                secondaryText: '<b>' + (index + 1) + " - " + element.agendaSubject + "</b>",
                editButton: true,
                type: 'agendaSubject',
                noBorrar: false,
                editButton: true
            },
            {
                id: Math.random().toString(36).substr(2, 9),
                label: `${translate.agenda_point} ${(index + 1)} - ${translate.description}`,
                text: element.description,
                secondaryText: element.description,
                editButton: true,
                type: 'description',
                noBorrar: false,
                editButton: true
            },
            {
                id: Math.random().toString(36).substr(2, 9),
                label: `${translate.agenda_point} ${(index + 1)} - ${translate.comments_and_agreements}`,
                text: '',
                secondaryText: '',
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
                    text: `
                        <div style="padding: 10px;border: solid 1px #BFBFBF;font-size: 11px">
                            <b>Votaciones: </b>
                            <br> A FAVOR: ${getAgendaResult(element, 'POSITIVE')} | EN CONTRA: ${getAgendaResult(element, 'NEGATIVE')} | ABSTENCIONES:
                            ${getAgendaResult(element, 'ABSTENTION')} | NO VOTAN: ${getAgendaResult(element, 'NO_VOTE')}
                            <br>
                        </div>`,
                    secondaryText: `
                        <div style="padding: 10px;border: solid 1px #BFBFBF;font-size: 11px">
                            <b>Votings: </b>
                            <br> IN FAVOR: ${getAgendaResult(element, 'POSITIVE')} | AGAINST: ${getAgendaResult(element, 'NEGATIVE')} | ABSTENTIONS:
                            ${getAgendaResult(element, 'ABSTENTION')} | NO VOTE: ${getAgendaResult(element, 'NO_VOTE')}
                            <br>
                        </div>`
                },
                {
                    id: Math.random().toString(36).substr(2, 9),
                    label: "Punto " + (index + 1) + " - Listado de votantes",
                    text: "",
                    editButton: false,
                    type: 'voting',
                    toggleable: true,
                    hide: false,
                    noBorrar: false,
                    editButton: false,
                    data: {
                        agendaId: element.id
                    },
                    logic: true,
                    language: 'es',
                    secondaryLanguage: 'en',
                    icon: iconVotaciones,
                    colorBorder: '#866666'
                }
            ]);

            //if(data.council.statute.existsComments !== 1){
                newArray = newArray.concat([
                    {
                        id: Math.random().toString(36).substr(2, 9),
                        label: "Punto " + (index + 1) + " - Comentarios",
                        text: "<b>Comentarios</b> </br>" + element.description,
                        editButton: false,
                        type: 'agendaComments',
                        logic: true,
                        toggleable: false,
                        language: 'es',
                        secondaryLanguage: 'en',
                        colorBorder:"#b39a5b",
                        icon: iconAgendaComments,
                        noBorrar: false,
                        data: {
                            agendaId: element.id
                        },
                        editButton: false
                    }
                ]);
            //}
        }
    });

    return newArray;
}

export const getDefaultTagsByBlockType = (type, translate) => {
    const baseTag = {
        type: TAG_TYPES.DRAFT_TYPE,
        active: true,
    }

    const defaultTags = {
        'intro': {
            intro: {
                ...baseTag,
                name: 'intro',
                label: translate.intro
            }
        },
        'conclusion': {
            conclusion: {
                ...baseTag,
                name: 'conclusion',
                label: translate.conclusion
            }
        },
        'constitution': {
            constitution: {
                ...baseTag,
                name: 'constitution',
                label: translate.constitution
            }
        },
        'cert_header': {
            constitution: {
                ...baseTag,
                name: 'cert_header',
                label: translate.cert_header
            }
        },
        'cert_footer': {
            constitution: {
                ...baseTag,
                name: 'cert_footer',
                label: translate.cert_footer
            }
        }
    }

    return defaultTags[type]? defaultTags[type] : null;
}


export const buildDoc = (data, translate, type) => {
    const CBX_DOCS = {
        act: [
            blocks.ACT_TITLE,
            blocks.ACT_INTRO,
            blocks.ACT_CONSTITUTION,
            blocks.ACT_CONCLUSION,
            blocks.AGENDA_LIST,
            blocks.AGENDA,
            blocks.ATTENDANTS_LIST,
            blocks.DELEGATION_LIST
        ],
        certificate: [
            blocks.ACT_TITLE,
            blocks.CERT_HEADER,
            blocks.CERT_AGENDA,
            blocks.CERT_FOOTER
        ]
    }

    if(!CBX_DOCS[type]){
        throw new Error('Invalid doc type');
    }
    console.log(CBX_DOCS[type].map(item => buildDocBlock(item, data, translate)));

    return CBX_DOCS[type].map(item => buildDocBlock(item, data, translate));

}

export const shouldCancelStart = event => {
    const tagName = event.target.tagName.toLowerCase();

    if (tagName === 'i' && event.target.classList[2] !== undefined) {
        return true
    }
    if (event.target.classList.value === "ql-syntax") {
        return true
    }
    if (event.target.classList.value === "ql-picker-options") {
        return true
    }
    if (event.target.classList.value === "ql-editor" || event.target.classList.value === "ql-toolbar ql-snow") {
        return true
    }
    if (event.path[1].classList.value === "ql-editor" && event.path[0].tagName.toLowerCase() === "p") {
        return true
    }
    if (tagName === 'i' && event.target.classList[2] === undefined) {
        return true
    }

    if (tagName === 'button' ||
        tagName === 'span' ||
        tagName === 'polyline' ||
        tagName === 'path' ||
        tagName === 'pre' ||
        tagName === 'h1' ||
        tagName === 'h2' ||
        tagName === 'li' ||
        tagName === 's' ||
        tagName === 'a' ||
        (tagName === 'p' && event.target.parentElement.classList.value === "ql-editor ql-blank") ||
        tagName === 'u' ||
        tagName === 'line' ||
        tagName === 'strong' ||
        tagName === 'em' ||
        tagName === 'blockquote' ||
        tagName === 'svg') {
        return true
    }
}


export const useDoc = (params = {}) => {
    const [{ doc, options }, updateDoc] = React.useState({});
    const [column, setColumn] = React.useState(1);

    const setOptions = object => {
		updateDoc({
			doc,
			options: {
				...options,
				...object
			}
		});
	}

	const setDoc = value => {
		updateDoc({
			doc: value,
			options
		});
    }

    const updateBlock = (id, object) => {
        const newItems = [...doc];
        let localization = null;
        let i = 0;

        do {
            const block = doc[i];

            if(block.id === id){
                localization = {
                    block: i
                }
            }

            if(block.items && !localization){
                const index = block.items.findIndex(subBlock => subBlock.id === id);
                if(index !== -1){
                    localization = {
                        block: i,
                        subBlock: index
                    }
                }
            }
            i++;
        } while (!localization || i > doc.length);
        
        if(localization){
            if(localization.hasOwnProperty('subBlock')){
                const items = [...newItems[localization.block].items];
                const item = {...newItems[localization.block].items[localization.subBlock], ...object }
                items[localization.subBlock] = item;
                newItems[localization.block] = {
                    ...newItems[localization.block],
                    items
                };
                return setDoc(newItems);
            } else {
                newItems[localization.block] = {
                    ...newItems[localization.block],
                    ...object
                };
                return setDoc(newItems);
            }
        }

        throw new Error('Block ID not found');

    }

    const prepareText = async text => {
        if(params.transformText){
            return await params.transformText(text);
        }

        return text;
    }

    const editBlock = async (id, text) => {
        const prepared = await prepareText(text)
        updateBlock(id, {[column === 2? 'secondaryText' : 'text']: prepared});

        return prepared;
    }

    const toggleBlock = (id, value) => {
        updateBlock(id, { hide: value });
    }

    return {
        doc,
        options,
        setOptions,
        initializeDoc: updateDoc,
        setDoc,
        editBlock,
        toggleBlock,
        column,
        setColumn
    }

}