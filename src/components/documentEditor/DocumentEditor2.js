import React from 'react';
import { buildDoc, shouldCancelStart } from './utils';
import { arrayMove } from "react-sortable-hoc";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { Card } from 'material-ui';
import { Grid, Scrollbar, LoadingSection, BasicButton, AlertConfirm } from '../../displayComponents';
import { getPrimary, getSecondary } from '../../styles/colors';
import withSharedProps from '../../HOCs/withSharedProps';
import { withApollo } from "react-apollo";
import gql from 'graphql-tag';
import { changeVariablesToValues, checkForUnclosedBraces } from '../../utils/CBX';
import { toast } from 'react-toastify';
import Lupa from '../../displayComponents/Lupa';
import textool from '../../assets/img/text-tool.svg'
//import { getBlocks, generateAgendaBlocks } from './EditorBlocks';
import AgreementsBlock from './AgreementsBlock';
import Block, { BorderBox } from './Block';
import AgreementsPreview from './AgreementsPreview';
import DownloadDoc from './DownloadDoc';
import OptionsMenu from './OptionsMenu';
import { buildDocVariable } from './utils';
import { getTranslations } from '../../queries';
import { buildTranslateObject } from '../../actions/mainActions';
import FinishActModal from '../council/writing/actEditor/FinishActModal';
import Timbrado from './Timbrado';
import DocumentPreview from './DocumentPreview';


const DocumentEditor = ({ translate, company, document, data, blocks, updateDocument, doc, client, setDoc, documentMenu, options, setOptions, ...props }) => {
    const [edit, setEdit] = React.useState(true);
    const [filteredBlocks, setBlocks] = React.useState(filterBlocks(blocks, doc));
    const [preview, setPreview] = React.useState('');
    const [state, setState] = React.useState({
        loadDraft: false,
        load: 'intro',
        draftType: null,
        column: 1,
        hide: true,
        collapse: false,
        updating: false,
        disableButtons: false,
        text: "",
        errors: {},
        sendActDraft: false,
        finishActModal: false
    });
    const scroll = React.useRef(null);

    const { hide, collapse, column } = state;
    const primary = getPrimary();
    const secondary = getSecondary();

    React.useEffect(() => {
        setBlocks(filterBlocks(blocks, doc));
    }, [doc.length]);

    function filterBlocks(blocks, doc) {
        return blocks.filter(block => block.type === 'text' || !doc.find(item => item.type === block.type));
    }

    const changeToColumn = index => {
        setState({
            ...state,
            column: index
        });
    }

    const moveUp = (id, index) => {
        if (index > 0) {
            setDoc(arrayMove(doc, index, (index - 1)));
        }
    }

    const moveDown = (id, index) => {
        if ((index + 1) < doc.length) {
            setDoc(arrayMove(doc, index, (index + 1)));
        }
    }

    const onSortEnd = ({ oldIndex, newIndex }) => {
        setDoc(arrayMove(doc, oldIndex, newIndex));
    }

    const remove = (id, index) => {
        let resultado = doc.find(item => item.id === id);
        let arrayDoc;

        if (resultado.type !== "text") {
            arrayDoc = doc.filter(item => item.id !== id)
            //arrastrables.push(resultado)
        } else {
            arrayDoc = doc.filter(item => item.id !== id)
        }
        setDoc(arrayDoc);
        //setArrastrables(arrastrables)
    };

    const addItem = id => {
        let resultado = blocks.find(arrastrable => arrastrable.id === id);
        // let arrayArrastrables
        // if (resultado.type !== "text") {
        //     //arrayArrastrables = arrastrables.items.filter(arrastrable => arrastrable.id !== id)
        // } else {
        //     arrayArrastrables = arrastrables.items
        //     resultado = {
        //         id: Math.random().toString(36).substr(2, 9),
        //         label: "Bloque de texto",
        //         defaultValue: translate => translate.title,
        //         text: 'Inserte el texto',
        //         secondaryText: 'Insert text',
        //         type: "text",
        //         editButton: true
        //     }
        // }
        //setArrastrables({ items: arrayArrastrables });
        const newDoc = [...doc];
        newDoc.push({
            ...resultado,
            id: Math.random().toString(36).substr(2, 9),
        });
        setDoc(newDoc);
        console.log(scroll.current.scrollbar.scrollToBottom());
    }


    const editBlock = (id, text) => {
        let newItems = [...doc];
        let indexItemToEdit = newItems.findIndex(item => item.id === id);
        const newItem = {...newItems[indexItemToEdit], [column === 2? 'secondaryText' : 'text']: text}
        newItems[indexItemToEdit] = newItem;
        setDoc(newItems);
    }


    return (
        <React.Fragment>
            <div style={{ width: "100%", height: "100%" }}>
                <div style={{ display: "flex", height: "100%" }}>
                    <div style={{ width: "700px", overflow: "hidden", height: "calc( 100% - 3em )", display: collapse ? "none" : "" }}>
                        <div style={{ width: "98%", display: "flex", padding: "1em 1em " }}>
                            <i className="material-icons" style={{ color: primary, fontSize: '14px', cursor: "pointer", paddingRight: "0.3em", marginTop: "4px" }} onClick={() => setState({
                                ...state,
                                hide: !hide
                            })}>
                                help
                            </i>
                            {hide &&
                                <div style={{
                                    fontSize: '13px',
                                    color: '#a09aa0'
                                }}> {/*TRADUCCION*/}
                                    Personaliza y exporta el acta de la reunión a través de los bloques inferiores. Desplázalos hasta el acta y edita el texto que necesites
                                </div>
                            }
                        </div>
                        <div style={{ height: "calc( 100% - 3em )", borderRadius: "8px", }}>
                            <Scrollbar>
                                <Grid style={{ justifyContent: "space-between", width: "98%", padding: "1em", paddingTop: "1em", paddingBottom: "3em" }}>
                                    <React.Fragment>
                                        <OptionsMenu
                                            translate={translate}
                                            options={options}
                                            setOptions={setOptions}
                                        />
                                        {filteredBlocks.filter(item => !item.logic).map((item, index) => {
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
                                        <LogicBlocks
                                            addItem={addItem}
                                            automaticos={filteredBlocks}
                                            translate={translate}
                                        >
                                        </LogicBlocks>
                                    </React.Fragment>
                                </Grid>
                            </Scrollbar>
                        </div>
                    </div>
                    <div style={{ width: "100%", position: collapse && "relative", height: "calc( 100% - 3em )", justifyContent: collapse ? 'center' : "", display: collapse ? 'flex' : "" }}>
                        {!collapse &&
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "1em 0em " }}>
                                <div style={{ display: "flex" }}>
                                    {documentMenu}
                                    {/*MENU EXTERNO*/}
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
                                            <Lupa color={'black'} width={'20px'} height={'20px'} />
                                        }
                                        onClick={() => { setState({
                                            ...state,
                                            collapse: !collapse
                                        }); setEdit(false) }}
                                        buttonStyle={{
                                            boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.08)',
                                            borderRadius: '3px',
                                            borderTopRightRadius: '0px',
                                            borderBottomRightRadius: '0px',
                                            borderRight: '1px solid #e8eaeb'
                                        }}
                                    />
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
                                        iconInit={<img type="image/svg+xml" src={textool} onClick={() => setEdit(!edit)} />}
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
                            {collapse &&
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
                                    onClick={() => setState({
                                        ...state,
                                        collapse: !collapse
                                    })}
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
                        <div style={{ height: "100%", marginTop: collapse && '2em', borderRadius: "8px", background: "white", maxWidth: collapse ? "210mm" : "", width: collapse ? "100%" : "" }}>
                            <Scrollbar ref={scroll}>
                                {preview ?
                                    <DocumentPreview
                                        preview={preview}
                                        translate={translate}
                                        //options={options}
                                        collapse={collapse}
                                        company={company}
                                    />
                                    :
                                    <div style={{ display: "flex", height: "100%" }} >
                                        <div style={{ width: "20%", maxWidth: "95px" }}>
                                            {options.stamp &&
                                                <Timbrado
                                                    collapse={collapse}
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
                                                    items={doc}
                                                    editBlock={editBlock}
                                                    //updateBlock={updateBlock}
                                                    state={state}
                                                    //setState={setState}
                                                    edit={true}
                                                    translate={translate}
                                                    offset={0}
                                                    column={column}
                                                    onSortEnd={onSortEnd}
                                                    helperClass="draggable"
                                                    shouldCancelStart={shouldCancelStart}
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
        </React.Fragment>
    )
}

const SortableList = SortableContainer(({ items, column, editBlock, updateBlock, state, setState, edit, translate, offset = 0, moveUp, moveDown, remove }) => {
    if (edit) {
        return (
            <div>
                {items &&
                    items.map((item, index) => (
                        <DraggableBlock
                            key={`item-${item.id}`}
                            editBlock={editBlock}
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
                            editBlock={editBlock}
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

const LogicBlocks = ({ colorBorder, children, automaticos, addItem, translate }) => {
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
                        {automaticos.filter(item => item.logic === true).map((item, index) => {
                            return (
                                <CajaLogicBlocks
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

const CajaLogicBlocks = ({ colorBorder, children, item, addItem, itemInfo, translate }) => {
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


export default withSharedProps()(DocumentEditor);