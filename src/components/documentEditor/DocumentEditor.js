import React from 'react';
import { arrayMove } from "react-sortable-hoc";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { Card } from 'material-ui';
import { Grid, Scrollbar, LoadingSection, BasicButton } from '../../displayComponents';
import { getPrimary, getSecondary } from '../../styles/colors';
import withSharedProps from '../../HOCs/withSharedProps';
import { withApollo } from "react-apollo";
import gql from 'graphql-tag';
import { changeVariablesToValues, checkForUnclosedBraces } from '../../utils/CBX';
import { toast } from 'react-toastify';
import imgIzq from "../../assets/img/TimbradoCBX.jpg";
import Lupa from '../../displayComponents/Lupa';
import textool from '../../assets/img/text-tool.svg'
import { getBlocks, generateAgendaBlocks } from './EditorBlocks';
import AgreementsBlock from './AgreementsBlock';
import Block, { BorderBox } from './Block';
import AgreementsPreview from './AgreementsPreview';
import DownloadDoc from './DownloadDoc';
import OptionsMenu from './OptionsMenu';
import { buildDocVariable } from './utils';
import { getTranslations } from '../../queries';
import { buildTranslateObject } from '../../actions/mainActions';


// https://codesandbox.io/embed/react-sortable-hoc-2-lists-5bmlq para mezclar entre 2 ejemplo --collection--

const agendaBlocks = ['agendaSubject', 'description', 'comment', 'voting', 'votes', 'agendaComments'];
const defaultTemplates = {
    "0": ['title', "intro", "agenda", 'constitution',
        'agreements',
        'conclusion', 'attendants', 'delegations'
    ],
    "default1": ["intro", "constitution", "conclusion"],
    "default2": ["intro", "constitution", "conclusion"]
}


export const ActContext = React.createContext();
const DocumentEditor = ({ translate, company, data, updateDocument, client, ...props }) => {
    const [template, setTemplate] = React.useState(0);
    const [colapse, setColapse] = React.useState(false);
    const [options, setOptions] = React.useState(data.council.act.document? { ...data.council.act.document.options } : {
        stamp: true,
        doubleColumn: false
    });
    const [secondaryTranslate, setSecondaryTranslate] = React.useState(null);
    const [column, setColumn] = React.useState(1);
    const [edit, setEdit] = React.useState(true);
    const [ocultar, setOcultar] = React.useState(true);
    const [preview, setPreview] = React.useState('');
    const [doc, setDoc] = React.useState({ items: [], });
    const [arrastrables, setArrastrables] = React.useState({ items: [] });
    const [state, setState] = React.useState({
        loadDraft: false,
        load: 'intro',
        draftType: null,
        updating: false,
        disableButtons: false,
        text: "",
        errors: {},
        sendActDraft: false,
        finishActModal: false
    });

    const primary = getPrimary();
    const secondary = getSecondary();

    const handleChange = event => {
        setEdit(event.target.checked);
    };

    React.useEffect(() => {
        const { draggables, doc } = generateDraggable(data, translate);
        setDoc(doc);
        setArrastrables(draggables);
    }, [data.council.id])

    React.useEffect(() => {
        if(options.doubleColumn){
            getSecondaryLanguage('en');
        }

    }, [options.doubleColumn])

    const changeToColumn = index => {
        if(index === 1){
            const { draggables, doc } = generateDraggable(data, translate);
            setDoc(doc);
            setArrastrables(draggables);
        }
        if(index === 2) {
            const { draggables, doc } = generateDraggable(data, secondaryTranslate);
            setDoc(doc);
            setArrastrables(draggables);
        }
        setColumn(index);
    }


    const getSecondaryLanguage = async language => {
        const response = await client.query({
            query: getTranslations,
            variables: {
                language
            }
        });

        const secondaryTranslate = buildTranslateObject(response.data.translations);
        setSecondaryTranslate(secondaryTranslate);
        rebuildBlockSecondaryTranslation(translate, secondaryTranslate);
    }


    const rebuildBlockSecondaryTranslation = (translate, secondaryTranslate) => {
        const newItems = doc.items.map(item => {
            return {
                ...item,
                secondaryText: item.buildDefaultValue? item.buildDefaultValue(data, secondaryTranslate) : item.secondaryText
            }
        });
        setDoc({ items: newItems });
    }


    const generateDraggable = (data, translate) => {
        const blocks = getBlocks(translate);
        const { agendas, council } = data;
        const { act } = council;
        ///let objetoArrayAct = Object.entries(act);
        let items = [
            blocks.TEXT,
            blocks.ACT_TITLE(data.council),
            blocks.ACT_INTRO(act.intro),
            blocks.ACT_CONSTITUTION(act.constitution),
            blocks.ACT_CONCLUSION(act.conclusion),
            blocks.AGENDA_LIST(agendas),
            generateAgendaBlocks(translate, agendas),
            blocks.ATTENDANTS_LIST,
            blocks.DELEGATION_LIST
        ];

        let template = defaultTemplates[0];

        if(doc.items.length > 0){
            template = doc.items.map(item => item.type);
        } else {
            if(act.document) {
                template = act.document.items.map(item => item.type);
            }
        }

        return buildDocModules(template, items, agendas, act, translate);
    }

    const buildDocModules = (orden, array, agendas, act, translate) => {
        if(doc.items.length > 0){
            return {
                draggables: {
                    items: [...array.filter(value => (
                        value.type === 'text' ||
                        (!agendaBlocks.includes(value.type) && !orden.includes(value.type)))
                    )]
                },
                doc: {
                    items: [...doc.items]
                }
            };
        }

        if(act.document) {
            return {
                draggables: {
                    items: [...array.filter(value => (
                        value.type === 'text' ||
                        (!agendaBlocks.includes(value.type) && !orden.includes(value.type)))
                    )]
                },
                doc: {
                    items: [...act.document.items]
                }
            };
        } else {
            let auxTemplate = [];
            let auxTemplate2 = { items: array }

            if (orden !== undefined) {
                orden.forEach(element => {
                    if (element === 'agreements') {
                        auxTemplate = [...auxTemplate, generateAgendaBlocks(translate, agendas)];
                    } else {
                        const block = array.find(item => item.type === element);
                        if (block) {
                            auxTemplate.push(block);
                        }
                    }
                });

                return {
                    draggables: { items: [...auxTemplate2.items.filter(value => !agendaBlocks.includes(value.type) && !orden.includes(value.type)),] },
                    doc: {
                        items: auxTemplate
                    }
                };
            } else {
                return {
                    draggables: { items: [...doc.items, ...arrastrables.items] },
                    doc: {
                        items: auxTemplate
                    }
                };
            }
        }
    }

    const addItem = id => {
        if (doc.items[0] === undefined) {
            doc.items = new Array;
        };
        let resultado = arrastrables.items.find(arrastrable => arrastrable.id === id);
        let arrayArrastrables
        if (resultado.type !== "text") {
            arrayArrastrables = arrastrables.items.filter(arrastrable => arrastrable.id !== id)
        } else {
            arrayArrastrables = arrastrables.items
            resultado = {
                id: Math.random().toString(36).substr(2, 9),
                label: "Bloque de texto",
                defaultValue: translate => translate.title,
                text: 'Inserte el texto',
                secondaryText: 'Insert text',
                type: "text",
                editButton: true
            }
        }
        setArrastrables({ items: arrayArrastrables });
        doc.items.push(resultado);
        setDoc(doc);
    }


    const onSortEnd = ({ oldIndex, newIndex }) => {
        setDoc(({ items }) => ({
            items: arrayMove(items, oldIndex, newIndex),
        }));
    };

    const shouldCancelStart = event => {
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
    };


    const updateCouncilActa = (id, newText) => {
        let indexItemToEdit = doc.items.findIndex(item => item.id === id);
        doc.items[indexItemToEdit][column === 2? 'secondaryText' : 'text'] = newText;
    }

    const updateBlock = (id, block) => {
        let indexItemToEdit = doc.items.findIndex(item => item.id === id);
        doc.items[indexItemToEdit] = block;
        setDoc({ ...doc });
    }


    const remove = (id, index) => {
        let resultado = doc.items.find(item => item.id === id);
        let arrayDoc;

        if (resultado.type !== "bloqueDeTexto") {
            arrayDoc = doc.items.filter(item => item.id !== id)
            arrastrables.items.push(resultado)
        } else {
            arrayDoc = doc.items.filter(item => item.id !== id)
        }
        setDoc({ items: arrayDoc });
        setArrastrables(arrastrables)
    };

    const moveUp = (id, index) => {
        if (index > 0) {
            setDoc(({ items }) => ({
                items: arrayMove(items, index, (index - 1)),
            }));
        }
    };

    const generatePreview = async () => {
        const response = await client.mutate({
            mutation: gql`
                mutation ACTHTML($doc: Document, $councilId: Int!){
                    generateActHTML(document: $doc, councilId: $councilId)
                }
            `,
            variables: {
                doc: buildDocVariable(doc, options),
                councilId: data.council.id
            }
        });
        setPreview(response.data.generateActHTML);
    }

    const moveDown = (id, index) => {
        if ((index + 1) < doc.items.length) {
            setDoc(({ items }) => ({
                items: arrayMove(items, index, (index + 1)),
            }));
        }
    };


    const changeTemplate = (event, agendas) => {
        // if (template !== event.target.value) {
        //     setTemplate(event.target.value)
        //     renderTemplate(event.target.value, agendas)
        // }
    };


    return (
        <ActContext.Provider value={data}>
            <div style={{ width: "100%", height: "100%" }}>
                <div style={{ display: "flex", height: "100%" }}>
                    <div style={{ width: "700px", overflow: "hidden", height: "calc( 100% - 3em )", display: colapse ? "none" : "" }}>
                        <div style={{ width: "98%", display: "flex", padding: "1em 1em " }}>
                            <i className="material-icons" style={{ color: primary, fontSize: '14px', cursor: "pointer", paddingRight: "0.3em", marginTop: "4px" }} onClick={() => setOcultar(!ocultar)}>
                                help
                            </i>
                            {ocultar &&
                                <div style={{
                                    fontSize: '13px',
                                    color: '#a09aa0'
                                }}>
                                    Personaliza y exporta el acta de la reunión a través de los bloques inferiores. Desplázalos hasta el acta y edita el texto que necesites
                                </div>
                            }
                        </div>
                        <div style={{ height: "calc( 100% - 3em )", borderRadius: "8px", }}>
                            <Scrollbar>
                                <Grid style={{ justifyContent: "space-between", width: "98%", padding: "1em", paddingTop: "1em", paddingBottom: "3em" }}>
                                    <React.Fragment>
                                        {/*TRADUCCION*/}
                                        <OptionsMenu
                                            translate={translate}
                                            options={options}
                                            setOptions={setOptions}
                                        />
                                        {arrastrables.items.filter(item => !item.logic).map((item, index) => {
                                            return (
                                                <BorderBox
                                                    key={item.id}
                                                    addItem={addItem}
                                                    id={item.id}
                                                >
                                                    <div >
                                                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#a09aa0' }}>{translate[item.label] || item.label}</div>
                                                    </div>
                                                </BorderBox>
                                            )
                                        })}
                                        <BloquesAutomaticos
                                            addItem={addItem}
                                            automaticos={arrastrables}
                                            translate={translate}
                                        >
                                        </BloquesAutomaticos>
                                    </React.Fragment>
                                </Grid>
                            </Scrollbar>
                        </div>
                    </div>
                    <div style={{ width: "100%", position: colapse && "relative", height: "calc( 100% - 3em )", justifyContent: colapse ? 'center' : "", display: colapse ? 'flex' : "" }}>
                        {!colapse &&
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "1em 0em " }}>
                                <div style={{ display: "flex" }}>
                                    <DownloadDoc
                                        translate={translate}
                                        doc={doc}
                                        options={options}
                                        council={data.council}
                                    />
                                    <BasicButton
                                        text={translate.save}
                                        color={primary}
                                        onClick={() => updateDocument({
                                            items: doc.items,
                                            options
                                        })}
                                        textStyle={{
                                            color: "white",
                                            fontSize: "0.9em",
                                            textTransform: "none"
                                        }}
                                        textPosition="after"
                                        iconInit={<i style={{ marginRight: "0.3em", fontSize: "18px" }} className="fa fa-floppy-o" aria-hidden="true"></i>}
                                        buttonStyle={{
                                            marginRight: "1em",
                                            boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.08)',
                                            borderRadius: '3px'
                                        }}
                                    />
                                    {/* <BasicButton
                                        text={translate.save}
                                        color={primary}
                                        onClick={generatePreview}
                                        textStyle={{
                                            color: "white",
                                            fontSize: "0.9em",
                                            textTransform: "none"
                                        }}
                                        textPosition="after"
                                        iconInit={<i style={{ marginRight: "0.3em", fontSize: "18px" }} className="fa fa-floppy-o" aria-hidden="true"></i>}
                                        buttonStyle={{
                                            marginRight: "1em",
                                            boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.08)',
                                            borderRadius: '3px'
                                        }}
                                    /> */}
                                    {/* <BasicButton
                                        text={'Enviar a revision'}
                                        color={primary}
                                        textStyle={{
                                            color: "white",
                                            fontSize: "0.9em",
                                            textTransform: "none",
                                            whiteSpace: "nowrap"
                                        }}
                                        textPosition="after"
                                        iconInit={<i style={{ marginRight: "0.3em", fontSize: "18px" }} className="fa fa-floppy-o" aria-hidden="true"></i>}
                                        onClick={() => setState({
                                            sendActDraft: true
                                        })}
                                        buttonStyle={{
                                            marginRight: "1em",
                                            boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.08)',
                                            borderRadius: '3px'
                                        }}
                                    /> */}
                                    <BasicButton
                                        text={'Finalizar'}
                                        color={secondary}
                                        textStyle={{
                                            color: "white",
                                            fontSize: "0.9em",
                                            textTransform: "none"
                                        }}
                                        textPosition="after"
                                        iconInit={<i style={{ marginRight: "0.3em", fontSize: "18px" }} className="fa fa-floppy-o" aria-hidden="true"></i>}
                                        buttonStyle={{
                                            marginRight: "1em",
                                            boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.08)',
                                            borderRadius: '3px'
                                        }}
                                    />
                                </div>
                                <div style={{ display: "flex" }}>
                                    {options.doubleColumn &&
                                        <React.Fragment>
                                            <BasicButton
                                                text={'Columna 1'}
                                                color={column === 1? secondary : 'white'}
                                                textStyle={{
                                                    color: column === 1? 'white' : "black",
                                                    fontWeight: "700",
                                                    fontSize: "0.9em",
                                                    textTransform: "none"
                                                }}
                                                textPosition="after"
                                                onClick={() => changeToColumn(1) }
                                                buttonStyle={{
                                                    boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.08)',
                                                    borderRadius: '3px',
                                                    borderTopRightRadius: '0px',
                                                    borderBottomRightRadius: '0px',
                                                    borderRight: '1px solid #e8eaeb'
                                                }}
                                            />
                                            <BasicButton
                                                text={'Columna 2'}
                                                color={column === 2? secondary : 'white'}
                                                textStyle={{
                                                    color: column === 2? 'white' : "black",
                                                    fontWeight: "700",
                                                    fontSize: "0.9em",
                                                    textTransform: "none"
                                                }}
                                                textPosition="after"
                                                onClick={() => changeToColumn(2) }
                                                buttonStyle={{
                                                    boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.08)',
                                                    borderRadius: '3px',
                                                    borderTopRightRadius: '0px',
                                                    borderBottomRightRadius: '0px',
                                                    borderRight: '1px solid #e8eaeb'
                                                }}
                                            />
                                        </React.Fragment>
                                    }
                                    <BasicButton
                                        text={''}
                                        color={"white"}
                                        textStyle={{
                                            color: "black",
                                            fontWeight: "700",
                                            fontSize: "0.9em",
                                            textTransform: "none"
                                        }}
                                        textPosition="after"
                                        iconInit={
                                            <Lupa color={'blue'} width={'20px'} height={'20px'} />
                                        }
                                        onClick={() => { setColapse(!colapse); setEdit(false) }}
                                        buttonStyle={{
                                            boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.08)',
                                            borderRadius: '3px',
                                            borderTopRightRadius: '0px',
                                            borderBottomRightRadius: '0px',
                                            borderRight: '1px solid #e8eaeb'
                                        }}
                                    /><BasicButton
                                        text={''}
                                        color={"white"}
                                        textStyle={{
                                            color: "black",
                                            fontWeight: "700",
                                            fontSize: "0.9em",
                                            textTransform: "none"
                                        }}
                                        textPosition="after"
                                        iconInit={<object type="image/svg+xml" data={textool} onClick={() => setEdit(!edit)} />}
                                        onClick={() => setEdit(!edit)}
                                        buttonStyle={{
                                            marginRight: "1em",
                                            boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.08)',
                                            borderRadius: '3px',
                                            borderTopLeftRadius: '0px',
                                            borderBottomLeftRadius: '0px'
                                        }}
                                    />
                                </div>
                            </div>
                        }
                        <div style={{ position: "absolute", top: "7px", right: "15px" }}>
                            {colapse &&
                                <BasicButton
                                    text={''}
                                    color={"white"}
                                    textStyle={{
                                        color: "black",
                                        fontWeight: "700",
                                        fontSize: "0.9em",
                                        textTransform: "none"
                                    }}
                                    textPosition="after"
                                    iconInit={
                                        <Lupa color={'red'} width={'60px'} height={'60px'} />
                                    }
                                    onClick={() => setColapse(!colapse)}
                                    buttonStyle={{
                                        boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.08)',
                                        borderRadius: '3px',
                                        borderTopRightRadius: '0px',
                                        borderBottomRightRadius: '0px',
                                        borderRight: '1px solid #e8eaeb'
                                    }}
                                />
                            }
                        </div>
                        <div style={{ height: "100%", marginTop: colapse && '2em', borderRadius: "8px", background: "white", maxWidth: colapse ? "210mm" : "", width: colapse ? "100%" : "" }}>
                            <Scrollbar>
                                {preview ?
                                    <div dangerouslySetInnerHTML={{ __html: preview }} />
                                    :
                                    <div style={{ display: "flex", height: "100%" }} >
                                        <div style={{ width: "20%", maxWidth: "95px" }}>
                                            {options.stamp &&
                                                <Timbrado
                                                    colapse={colapse}
                                                    edit={edit}
                                                />
                                            }
                                        </div>
                                        <div style={{ width: "100%" }}>
                                            <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
                                                <div style={{ width: "13%", marginTop: "1em", marginRight: "4em", maxWidth: "125px" }}>
                                                    <img style={{ width: "100%" }} src={company.logo}></img>
                                                </div>
                                            </div>
                                            <div style={{ padding: "1em", paddingLeft: "0.5em", marginRight: "3em", marginBottom: "3em" }} className={"actaLienzo"}>
                                                <SortableList
                                                    axis={"y"}
                                                    lockAxis={"y"}
                                                    items={doc.items}
                                                    updateCouncilActa={updateCouncilActa}
                                                    updateBlock={updateBlock}
                                                    state={state}
                                                    setState={setState}
                                                    edit={edit}
                                                    translate={translate}
                                                    offset={0}
                                                    column={column}
                                                    onSortEnd={onSortEnd}
                                                    helperClass="draggable"
                                                    shouldCancelStart={event => shouldCancelStart(event)}
                                                    moveUp={moveUp}
                                                    moveDown={moveDown}
                                                    remove={remove}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                }
                            </Scrollbar>
                        </div>
                    </div>
                </div>
            </div>
        </ActContext.Provider>
    )
}

const Timbrado = ({ colapse, edit }) => {
    const [imgIzqCbx, setImgIzqCbx] = React.useState(2)

    React.useEffect(() => {
        if (document.getElementsByClassName("actaLienzo")[0]) {
            if (Math.ceil(document.getElementsByClassName("actaLienzo")[0].scrollHeight / 995) >= 2) {
                setImgIzqCbx(Math.ceil(document.getElementsByClassName("actaLienzo")[0].scrollHeight / 995))
            }
        }
    }, [document.getElementsByClassName("actaLienzo")[0], colapse, edit])

    return (
        new Array(imgIzqCbx).fill(0).map((option, index) =>
            <img style={{ width: "100%", }} src={imgIzq} key={index}></img>
        )
    )
}


const SortableList = SortableContainer(({ items, column, updateCouncilActa, updateBlock, state, setState, edit, translate, offset = 0, moveUp, moveDown, remove }) => {
    console.log(column);
    
    if (edit) {
        return (
            <div >
                {items &&
                    items.map((item, index) => (
                        <DraggableBlock
                            key={`item-${item.id}`}
                            updateCouncilActa={updateCouncilActa}
                            updateBlock={updateBlock}
                            state={state}
                            column={column}
                            setState={setState}
                            edit={edit}
                            translate={translate}
                            index={offset + index}
                            value={item}
                            id={item.id}
                            indexItem={index}
                            moveUp={moveUp}
                            moveDown={moveDown}
                            remove={remove}
                            name={item.name}
                            noBorrar={item.noBorrar}
                            expand={item.expand}
                        />
                    ))
                }
            </div>
        );
    } else {
        return (
            <div>
                {items &&
                    items.map((item, index) => (
                        <NoDraggableBlock
                            key={`item-${item.id}`}
                            updateCouncilActa={updateCouncilActa}
                            edit={edit}
                            translate={translate}
                            index={offset + index}
                            value={item}
                            column={column}
                            id={item.id}
                            indexItem={index}
                            moveUp={moveUp}
                            moveDown={moveDown}
                            remove={remove}
                            logic={item.logic}
                        />
                    ))
                }
            </div>
        );
    }
});


const DraggableBlock = SortableElement(props => {
    const [expand, setExpand] = React.useState(false);
    const [hover, setHover] = React.useState(false);

    const onMouseEnter = () => {
        setHover(true)
    }
    const onMouseLeave = () => {
        setHover(false)
    }
    const blockFijoTomadeAcuerdos = {
        value:{
        id: Math.random().toString(36).substr(2, 9),
        label: "Toma de acuerdos",
        editButton: true,
        type: 'Toma de acuerdos',
        noBorrar: true,
        editButton: false,
        text: '',
        expand: true}
    }

    return (
        props.value !== undefined && props.value.text !== undefined &&
        <div
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            key={props.id}
            style={{
                opacity: 1,
                width: "100%",
                display: "flex",
                listStyleType: "none",
                borderRadius: "4px",
                cursor: "grab",
                marginBottom: "0.8em",
                position: "relative",
                boxShadow: '0 2px 4px 5px rgba(0, 0, 0, 0.11)',
                background: "white"
            }}
            className="draggable"
        >
            <div style={{ paddingRight: "4px", background: props.value.colorBorder ? props.value.colorBorder : getPrimary(), borderRadius: "15px", }}></div>
            <div style={{ marginLeft: "4px", width: '95%', minHeight: "90px" }}>
                <div style={{ width: "25px", cursor: "pointer", position: "absolute", top: "5px", right: "0", right: "35px" }}>
                    {props.expand &&
                        <IconsDragActions
                            turn={"expand"}
                            clase={`fa fa-times ${props.id}`}
                            aria-hidden="true"
                            click={() => setExpand(!expand)}
                            id={props.id}
                            indexItem={props.indexItem}
                            expand={expand}
                        />
                    }
                </div>
                <div style={{ width: "25px", cursor: "pointer", position: "absolute", top: "5px", right: "0", }}>
                    {!props.noBorrar &&
                        <IconsDragActions
                            turn={"cross"}
                            clase={`fa fa-times ${props.id}`}
                            aria-hidden="true"
                            click={props.remove}
                            id={props.id}
                            indexItem={props.indexItem}
                        />
                    }
                </div>
                <div style={{ width: "25px", cursor: "pointer", position: "absolute", top: !props.noBorrar ? "35px" : '10px', right: "1px", }}>
                    <div>
                        <IconsDragActions
                            turn={"up"}
                            aria-hidden="true"
                            click={props.moveUp}
                            id={props.id}
                            indexItem={props.indexItem}
                        />
                    </div>
                    <div>
                        <IconsDragActions
                            turn={"down"}
                            aria-hidden="true"
                            click={props.moveDown}
                            id={props.id}
                            indexItem={props.indexItem}
                        />
                    </div>
                </div>
                {props.value.type === 'agreements' ?
                    !expand ?
                        <AgreementsBlock
                            item={props.value}
                            column={props.column}
                            updateBlock={props.updateBlock}
                            translate={props.translate}
                            remove={props.remove}
                        />
                        :
                        <Block
                            {...blockFijoTomadeAcuerdos}
                        />
                    :
                    <Block
                        {...props}
                    />

                }
            </div>
        </div>
    );
});

const NoDraggableBlock = props => {
    if (props.logic) {
        return (
            props.value !== undefined && props.value.text !== undefined &&
            <BorderBox
                itemInfo={288}
                icon={props.value.icon}
                id={props.id}
                colorBorder={props.value.colorBorder}
                stylesBody={{ width: "98%" }}
                noIcon={true}
            >
                <div >
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#a09aa0' }}>{props.value.label}</div>
                </div>
            </BorderBox>
        );
    } else {
        return (
            props.value !== undefined && props.value.text !== undefined &&
            <React.Fragment>
                {props.value.type === 'agreements' ?
                    <Card
                        key={props.id}
                        style={{
                            boxShadow: "none",
                            margin: "3px",
                            paddingLeft: "15px",
                            paddingTop: "5px",
                        }}
                    >
                        <AgreementsPreview
                            column={props.column}
                            item={props.value}
                            translate={props.translate}
                        />
                    </Card>
                    :
                    <Card
                        key={props.id}
                        style={{
                            boxShadow: "none",
                            margin: "3px",
                            paddingLeft: "15px",
                            paddingTop: "5px",
                        }}
                    >
                        <div style={{}}>
                            <div style={{}}
                                dangerouslySetInnerHTML={{
                                    __html: props.column === 2? props.value.secondaryText : props.value.text
                                }}>
                            </div>

                        </div>
                    </Card>
                }
            </React.Fragment>

        );
    }

}

const BloquesAutomaticos = ({ colorBorder, children, automaticos, addItem, translate }) => {
    const [open, setOpen] = React.useState(true)
    return (
        <div style={{ width: "100%", background: "white", boxShadow: " 0 2px 4px 5px rgba(0, 0, 0, 0.11)", borderRadius: "4px", marginBottom: "0.8em", }}>
            <div style={{ width: "100%", display: "flex", }}>
                <div style={{ paddingRight: "4px", }}></div>
                <div style={{ marginLeft: "0.5em", paddingTop: "0.8em", paddingBottom: "0.8em", width: "100%" }}>
                    <div style={{ width: "100%", fontSize: '16px', color: '#a09aa0', display: "flex", fontWeight: "bold" }}>
                        <div style={{ marginRight: "1em", width: "15em" }}>Bloques  automáticos</div>
                        <div style={{ display: "flex", width: "100%" }}>
                            <div>
                                <i className="material-icons" style={{ color: getPrimary(), fontSize: '14px', cursor: "pointer", paddingRight: "0.3em", marginTop: "4px" }} onClick={() => setOpen(!open)}>
                                    help
							</i>
                            </div>
                            {open &&
                                <div style={{ fontSize: "10px", color: "#a09aa0", fontWeight: "100" }}>Este tipo de bloques son generados automáticamente por el sistema y no necesitan edición.</div>
                            }
                        </div>
                    </div>
                    <div style={{ width: "100%", marginTop: "0.5em" }}>
                        {automaticos.items.filter(item => item.logic === true).map((item, index) => {
                            return (
                                <CajaBloquesAutomaticos
                                    key={item.id + index + "automaticos"}
                                    item={item}
                                    addItem={addItem}
                                    translate={translate}
                                    itemInfo={item.id}
                                />
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

const CajaBloquesAutomaticos = ({ colorBorder, children, item, addItem, itemInfo, translate }) => {
    return (
        <div style={{ display: "flex", width: "100%", marginBottom: "0.8em" }}>
            <div style={{ color: getPrimary(), fontWeight: "bold", fontSize: '16px', display: "flex" }}>
                <div>
                    <img src={item.icon} />
                </div>
            </div>
            <div style={{ justifyContent: "space-between", display: "flex", width: "100%" }}>
                <div style={{ marginLeft: "0.3em", width: "100%", whiteSpace: 'nowrap', fontSize: ' 16px', overflow: 'hidden', textOverflow: 'ellipsis', color: "#000000" }}>
                    {translate[item.label] || item.label}
                </div>
                <div style={{ marginLeft: "0.3em", marginRight: "0.3em" }}>
                    <i className="material-icons" style={{ cursor: "pointer", color: "#979797" }} onClick={() => addItem(itemInfo)}>
                        arrow_right_alt
        </i>
                </div>
            </div>
        </div>
    )
}



export const IconsDragActions = ({ clase, click, id, indexItem, turn, expand }) => {
    const [hover, setHover] = React.useState(false);

    const onMouseEnter = () => {
        setHover(true)
    }
    const onMouseLeave = () => {
        setHover(false)
    }

    if (turn === "up") {
        return (
            <i
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                className={"material-icons"}
                style={{ background: hover && "gainsboro", borderRadius: "20px", color: "#a09aa0", transform: 'rotate(-90deg)' }}
                aria-hidden="true"
                onClick={() => click(id, indexItem)}
            >
                arrow_right_alt
            </i>
        )
    }
    else if (turn === 'expand') {
        return (
            <i
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                className={"fa fa-compress"}
                style={{ background: hover && "gainsboro", borderRadius: "20px", color: expand ? "black": "#a09aa0", padding: "5px", fontSize: "16px",  }}
                aria-hidden="true"
                onClick={() => click(id, indexItem)}
            >
            </i>
        )
    }
    else if (turn === 'cross') {
        return (
            <i
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                className={"material-icons"}
                style={{ background: hover && "gainsboro", borderRadius: "20px", color: "#a09aa0" }}
                aria-hidden="true"
                onClick={() => click(id, indexItem)}
            >
                clear
            </i>
        )
    }
    else {
        return (
            <i
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                className={"material-icons"}
                style={{ background: hover && "gainsboro", borderRadius: "20px", color: "#a09aa0", transform: 'rotate(90deg)' }}
                aria-hidden="true"
                onClick={() => click(id, indexItem)}
            >
                arrow_right_alt
            </i>
        )
    }
}

export default withApollo(withSharedProps()(DocumentEditor)); 