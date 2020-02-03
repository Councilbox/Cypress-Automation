import React from 'react';
import { blocks } from './EditorBlocks';
import iconVotaciones from '../../assets/img/handshake.svg';
import iconAsistentes from '../../assets/img/meeting.svg';
import { getAgendaResult, hasVotation } from '../../utils/CBX';
import iconDelegaciones from '../../assets/img/networking.svg';

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
        data: item.data,
        language: secondary? item.secondaryLanguage : item.language
    }));
}

export const buildDocVariable = (doc, options) => {
    return ({
        fragments: prepareColumn(doc.items),
        secondaryColumn: options.doubleColumn? prepareColumn(doc.items, true) : undefined,
        options: {
            stamp: options.stamp
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
        introAgenda: () => ({
            ...item,
            id: Math.random().toString(36).substr(2, 9),
            label: "entrar",
            text: "<b>A continuación se entra a debatir el primer punto del Orden del día</b>",//TRADUCCION
            secondaryText: "<b>Next, the first item on the agenda will be discussed</b>",//TRADUCCION
        }),
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
        })
    }

    if(!blockTypes[item.type]){
        throw new Error('Invalid block type');
    }

    return blockTypes[item.type]();
}


export const buildDoc = (data, translate) => {
    const items = [
        blocks.ACT_TITLE,
        blocks.ACT_INTRO,
        blocks.ACT_CONSTITUTION,
        blocks.ACT_CONCLUSION,
        blocks.AGENDA_LIST,
        //blocks.AGENDA,
        blocks.ATTENDANTS_LIST,
        blocks.DELEGATION_LIST
    ];

    const doc = items.map(item => buildDocBlock(item, data, translate));

    return doc;

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


export const useDoc = () => {
    const [{ doc, options }, setDoc] = React.useState({});

    const setOptions = object => {
		setDoc({
			doc,
			options: {
				...options,
				...object
			}
		});
	}

	const updateDoc = value => {
		setDoc({
			doc: value,
			options
		});
    }

    return {
        doc,
        options,
        setDoc,
        setOptions,
        updateDoc
    }

}