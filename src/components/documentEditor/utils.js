import React from 'react';
import { blocks } from './actBlocks';
import iconVotaciones from '../../assets/img/handshake.svg';
import iconAsistentes from '../../assets/img/meeting.svg';
import iconAgendaComments from '../../assets/img/speech-bubbles-comment-option.svg';
import { getAgendaResult, hasVotation } from '../../utils/CBX';
import iconDelegaciones from '../../assets/img/networking.svg';
import { TAG_TYPES } from '../company/drafts/draftTags/utils';
import { translations } from './translations';

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
            language: 'es',
            secondaryLanguage: 'en',
            ...options,
        }
    });
}

export const buildDocBlock = (item, data, translate = {}, secondaryTranslate = {}) => {
    const texts = translations['es'];
    const secondaryTexts = translations['en'];

    const blockTypes = {
        text: () => ({
            ...item,
            id: Math.random().toString(36).substr(2, 9),
            label: texts.textBlock,
            text: texts.insertText,
            secondaryText: secondaryTexts.insertText,
        }),
        title: () => ({
            ...item,
            id: Math.random().toString(36).substr(2, 9),
            text: `<h4 style="font-weight: 700;">${data.council.name}</h4>`,
            secondaryText: `<h4 style="font-weight: 700;">${data.council.name}</h4>`,
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
            let puntos = `<b>${texts.agenda}</b> </br>`
            data.agendas.forEach((element, index) => {
                puntos += (index + 1) + "- " + element.agendaSubject + "</br>";
            });
            return {
                ...item,
                id: Math.random().toString(36).substr(2, 9),
                label: translate.agenda,
                text: puntos,
                secondaryText: `
                    <b>${secondaryTexts.agenda}</b> </br>
                    ${data.agendas.reduce((acc, curr) => {
                        return `${acc} ${curr.orderIndex} - ${curr.agendaSubject}</br>`
                    }, '')}
                `
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
            label: texts.delegationsList,
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
            text: `<b>${texts.agendaIntro}</b>`,
            secondaryText: `<b>${texts.agendaIntro}</b>`,
        }),
        cert_header: () => ({
            ...item
        }),
        cert_footer: () => ({
            ...item
        }),
        cert_title: () => ({
            ...item
        }),
        cert_agenda: () => ({
            ...item,
            label: "agenda",
            type: 'certAgenda',
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
    const texts = translations['es'];
    const secondaryTexts = translations['en'];

    return agenda.map((point, index) => ({
        id: Math.random().toString(36).substr(2, 9),
        label: `${texts.includePoint} ${point.orderIndex}`,
        text: "",
        editButton: false,
        type: 'certAgenda',
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
    const texts = translations['es'];
    const secondaryTexts = translations['en'];

    let newArray = [
        {
            id: Math.random().toString(36).substr(2, 9),
            label: texts.agenda,
            type: 'introAgenda',
            editButton: true,
            text: texts.agendaIntro,
            secondaryText: secondaryTexts.agendaIntro,
        }
    ];

    agenda.forEach((element, index) => {
        newArray = newArray.concat([
            {
                id: Math.random().toString(36).substr(2, 9),
                label: `${texts.agendaPoint} ${(index + 1)} - ${texts.title}`,
                text: '<b>' + (index + 1) + " - " + element.agendaSubject + "</b>",
                secondaryText: '<b>' + (index + 1) + " - " + element.agendaSubject + "</b>",
                editButton: true,
                type: 'agendaSubject',
                noBorrar: false,
                editButton: true
            },
            {
                id: Math.random().toString(36).substr(2, 9),
                label: `${texts.agendaPoint} ${(index + 1)} - ${texts.description}`,
                text: element.description,
                secondaryText: element.description,
                editButton: true,
                type: 'description',
                noBorrar: false,
                editButton: true
            },
            {
                id: Math.random().toString(36).substr(2, 9),
                label: `${texts.agendaPoint} ${(index + 1)} - ${texts.commentsAndAgreements}`,
                text: element.comment || '',
                secondaryText: element.comment || '',
                editButton: true,
                type: 'comment',
                noBorrar: true
            }
        ]);


        if(hasVotation(element.subjectType)){
            newArray = newArray.concat([
                {
                    id: Math.random().toString(36).substr(2, 9),
                    label: `${texts.agendaPoint} ${index + 1} - ${texts.votes}`,
                    editButton: false,
                    type: "votes",
                    noBorrar: true,
                    editButton: false,
                    text: `
                        <div style="padding: 10px;border: solid 1px #BFBFBF;font-size: 11px">
                            <b>${texts.votings}: </b>
                            <br> ${
                                texts.inFavor.toUpperCase()}: ${
                                getAgendaResult(element, 'POSITIVE')} | ${
                                texts.against.toLowerCase()}: ${
                                getAgendaResult(element, 'NEGATIVE')} | ${texts.abstentions.toUpperCase()}:
                            ${getAgendaResult(element, 'ABSTENTION')} | ${texts.noVote.toUpperCase()}: ${getAgendaResult(element, 'NO_VOTE')}
                            <br>
                        </div>`,
                    secondaryText: `
                    <div style="padding: 10px;border: solid 1px #BFBFBF;font-size: 11px">
                        <b>${secondaryTexts.votings}: </b>
                        <br> ${
                            secondaryTexts.inFavor.toUpperCase()}: ${
                            getAgendaResult(element, 'POSITIVE')} | ${
                            secondaryTexts.against.toLowerCase()}: ${
                            getAgendaResult(element, 'NEGATIVE')} | ${secondaryTexts.abstentions.toUpperCase()}:
                        ${getAgendaResult(element, 'ABSTENTION')} | ${secondaryTexts.noVote.toUpperCase()}: ${getAgendaResult(element, 'NO_VOTE')}
                        <br>
                    </div>`
                },
                {
                    id: Math.random().toString(36).substr(2, 9),
                    label: `${texts.agendaPoint} ${index + 1} - ${texts.votersList}`,
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

            if(data.council.statute.existsComments === 1){
                newArray = newArray.concat([
                    {
                        id: Math.random().toString(36).substr(2, 9),
                        label: `${texts.agendaPoint} ${index + 1} - ${texts.comments}`,
                        text: '',
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
            }
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
            blocks.AGENDA_LIST,
            blocks.AGENDA,
            blocks.ACT_CONCLUSION,
            blocks.ATTENDANTS_LIST,
            blocks.DELEGATION_LIST
        ],
        certificate: [
            blocks.CERT_TITLE,
            blocks.CERT_HEADER,
            blocks.CERT_AGENDA,
            blocks.CERT_FOOTER
        ],
    }

    if(!CBX_DOCS[type]){
        throw new Error('Invalid doc type');
    }

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