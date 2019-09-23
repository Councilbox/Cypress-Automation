import React from 'react';
import { arrayMove } from "react-sortable-hoc";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { Card, Button, MenuItem, Dialog, DialogTitle, DialogContent, FormControlLabel, Switch } from 'material-ui';
import { Grid, GridItem, Scrollbar, SelectInput, LoadingSection, BasicButton, LiveToast, HelpPopover, ButtonIcon } from '../../../displayComponents';
import { getPrimary, getSecondary } from '../../../styles/colors';
import RichTextInput from '../../../displayComponents/RichTextInput';
import withSharedProps from '../../../HOCs/withSharedProps';
import { withApollo } from "react-apollo";
import gql from 'graphql-tag';
import { DRAFT_TYPES } from '../../../constants';
import LoadDraft from '../../company/drafts/LoadDraft';
import { changeVariablesToValues, checkForUnclosedBraces } from '../../../utils/CBX';
import { toast } from 'react-toastify';
import imgIzq from "../../../assets/img/TimbradoCBX.jpg";
import StepPreview from '../../council/editor/StepPreview';
import preview from '../../../assets/img/preview-1.svg'
import textool from '../../../assets/img/text-tool.svg'
import iconAsistentes from '../../../assets/img/meeting.svg'
import iconDelegaciones from '../../../assets/img/networking.svg'
import iconVotaciones from '../../../assets/img/handshake.svg'


const agendaBlocks = ['agendaSubject', 'description', 'comment', 'voting', 'votes', 'agendaComments'];
const ordenDelDia = [  ];

const defaultTemplates = {
    "0": ["title", "intro", "puntos", 'constitution', 'textOrdenDelDia',
        'tomaAcuerdos',
        'conclusion', 'listaAsistentes'
    ],
    "default1": ["intro", "constitution", "conclusion"],
    "default2": ["intro", "constitution", "conclusion"]
}


const OrdenarPrueba = ({ translate, company, client, ...props }) => {

    const [template, setTemplate] = React.useState(0)
    const [data, setData] = React.useState(false)
    const [colapse, setColapse] = React.useState(false)
    const [edit, setEdit] = React.useState(false)
    const [editInfo, setEditInfo] = React.useState(false)
    const [loading, setLoading] = React.useState(true)
    const [ocultar, setOcultar] = React.useState(true)
    const [agendas, setAgendas] = React.useState({ items: [], });
    const [arrastrables, setArrastrables] = React.useState({ items: [] });
    const [bloque, setBloque] = React.useState("info")
    const [state, setState] = React.useState({
        loadDraft: false,
        load: 'intro',
        draftType: null,
        updating: false,
        disableButtons: false,
        text: "",
        errors: {}
    })

    const handleChange = event => {
        setEdit(event.target.checked);
    };

    React.useEffect(() => {
        getData()
    }, []) //Poner datos de la url


    const getData = async () => {
        const response = await client.query({
            query: CouncilActData,
            variables: {
                companyId: 569, //props.companyID,
                councilID: 7021,//props.councilID,
                options: {
                    limit: 10000,
                    offset: 0
                }
            }
        });

        if (response) {
            setData(response)
            setLoading(false)
            generateArrastrable(response.data.council.act, response.data.agendas, response.data.councilAttendants.list)
        }
    }


    const generateArrastrable = (act, agendas, attendants) => {
        let objetoArrayAct = Object.entries(act);
        let newArray = []
        //Bloque de texto
        newArray.push({ id: Math.random().toString(36).substr(2, 9), name: "Bloque de texto", text: 'Inserte el texto', originalName: "bloqueDeTexto", editButton: true })

        newArray.push({ id: Math.random().toString(36).substr(2, 9), name: "Titulo de la reunion", text: "<b>Titulo de la reunion</b>", originalName: 'title', noBorrar: true })
        objetoArrayAct.forEach(element => {
            if (element[0] !== "id" && element[0] !== '__typename' && element[1] !== "") {
                newArray.push({ id: Math.random().toString(36).substr(2, 9), name: element[0], text: element[1], originalName: element[0], editButton: true, noBorrar: true })
            }
        });
        let puntos = "<b>Para tratar el siguiente Orden de Día </b> </br>"
        agendas.forEach((element, index) => {
            puntos += (index + 1) + "- " + element.agendaSubject + "</br>";
        });
        newArray.push({ id: Math.random().toString(36).substr(2, 9), name: "Orden de día ", text: puntos, originalName: 'puntos', noBorrar: true, expand: true })//TRADUCCION
        newArray.push({ id: Math.random().toString(36).substr(2, 9), name: "", text: "<b>A continuación se entra a debatir el primer punto del Oden del día</b>", originalName: 'textOrdenDelDia', noBorrar: true })//TRADUCCION

        agendas.forEach((element, index) => {
            newArray.push({ id: Math.random().toString(36).substr(2, 9), name: "Punto " + (index + 1) + " - " + translate.title, text: '<b>' + (index + 1) + " - " + element.agendaSubject + "</b>", editButton: true, originalName: 'agendaSubject', noBorrar: true, editButton: false })//TRADUCCION
            // if (element.description) {
            newArray.push({ id: Math.random().toString(36).substr(2, 9), name: "Punto " + (index + 1) + " - " + translate.description, text: element.description, editButton: true, originalName: 'description', noBorrar: true, editButton: false })//TRADUCCION
            // }
            // if (element.comment) {
            newArray.push({ id: Math.random().toString(36).substr(2, 9), name: "Punto " + (index + 1) + " - Toma de acuerdos", text: element.comment, editButton: true, originalName: 'comment', noBorrar: true }) //TRADUCCION
            // }
            newArray.push({ id: Math.random().toString(36).substr(2, 9), name: "Punto " + (index + 1) + " - Votaciones", text: "", editButton: false, originalName: 'voting', noBorrar: true, editButton: false, logic: true, icon: iconVotaciones, colorBorder: '#866666' }) //TRADUCCION
            newArray.push({ id: Math.random().toString(36).substr(2, 9), name: "Punto " + (index + 1) + " - Votos", text: "<b>Votos</b> </br> A FAVOR, EN CONTRA, ABSTENCIÓN", editButton: false, originalName: "votes", noBorrar: true, editButton: false, logic: true })//TRADUCCION
            newArray.push({ id: Math.random().toString(36).substr(2, 9), name: "Punto " + (index + 1) + " - Comentarios", text: "<b>Comentarios</b> </br>" + element.description, editButton: false, originalName: 'agendaComments', noBorrar: true, editButton: false })//TRADUCCION
        });
        let assistants = ""
        attendants.forEach(element => {
            assistants = element.name + " " + element.surname + " con DNI " + element.dni + "  Firma: ..."
        });
        newArray.push({ id: Math.random().toString(36).substr(2, 9), name: translate.assistants_list, text: '', editButton: false, logic: true, originalName: 'listaAsistentes', icon: iconAsistentes, colorBorder: "#61abb7" })
        newArray.push({ id: Math.random().toString(36).substr(2, 9), name: "Lista de delegaciones", text: "", editButton: false, logic: true, icon: iconDelegaciones, colorBorder: '#7f94b6' })
        setArrastrables({ items: newArray })
        ordenarTemplateInit(defaultTemplates[template], newArray, agendas)
    }

    const addItem = (id) => {
        if (agendas.items[0] === undefined) {
            agendas.items = new Array;
        }
        console.log(arrastrables)
        let resultado = arrastrables.items.find(arrastrable => arrastrable.id === id);
        let arrayArrastrables
        // console.log(resultado)
        if (resultado.originalName !== "bloqueDeTexto") {
            arrayArrastrables = arrastrables.items.filter(arrastrable => arrastrable.id !== id)
        } else {
            arrayArrastrables = arrastrables.items
            resultado = { id: Math.random().toString(36).substr(2, 9), name: "Bloque de texto", text: 'Inserte el texto', originalName: "bloqueDeTexto", editButton: true }
        }
        setArrastrables({ items: arrayArrastrables })
        agendas.items.push(resultado)
        setAgendas(agendas)
    }


    const onSortEnd = ({ oldIndex, newIndex }) => {
        setAgendas(({ items }) => ({
            items: arrayMove(items, oldIndex, newIndex),
        }));
    };

    const shouldCancelStart = (event) => {
        if (event.target.tagName.toLowerCase() === 'i' && event.target.classList[2] !== undefined) {
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
        if (event.target.tagName.toLowerCase() === 'i' && event.target.classList[2] === undefined) {
            return true
        }
        if (event.target.tagName.toLowerCase() === 'button' ||
            event.target.tagName.toLowerCase() === 'span' ||
            event.target.tagName.toLowerCase() === 'polyline' ||
            event.target.tagName.toLowerCase() === 'path' ||
            event.target.tagName.toLowerCase() === 'pre' ||
            event.target.tagName.toLowerCase() === 'h1' ||
            event.target.tagName.toLowerCase() === 'h2' ||
            event.target.tagName.toLowerCase() === 'li' ||
            event.target.tagName.toLowerCase() === 's' ||
            event.target.tagName.toLowerCase() === 'a' ||
            event.target.tagName.toLowerCase() === 'u' ||
            event.target.tagName.toLowerCase() === 'line' ||
            event.target.tagName.toLowerCase() === 'strong' ||
            event.target.tagName.toLowerCase() === 'em' ||
            event.target.tagName.toLowerCase() === 'blockquote' ||
            event.target.tagName.toLowerCase() === 'svg') {
            return true
        }

    };


    const updateCouncilActa = (id, newText) => {
        let indexItemToEdit = agendas.items.findIndex(item => item.id === id)
        agendas.items[indexItemToEdit].text = newText
    }

    const checkBraces = () => {
        const act = data.data.council.act;
        let errors = {
            intro: false,
            conclusion: false,
            constitution: false
        };
        let hasError = false;

        if (act.intro) {
            if (checkForUnclosedBraces(act.intro)) {
                errors.intro = true;
                hasError = true;
            }
        }

        if (act.constitution) {
            if (checkForUnclosedBraces(act.constitution)) {
                errors.constitution = true;
                hasError = true;
            }
        }

        if (act.conclusion) {
            if (checkForUnclosedBraces(act.conclusion)) {
                errors.conclusion = true;
                hasError = true;
            }
        }

        if (hasError) {
            toast(
                <LiveToast
                    message={this.props.translate.revise_text}
                />, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: true,
                    className: "errorToast"
                }
            );
        }

        setState({
            disableButtons: hasError,
            errors
        });

        return hasError;
    }



    const remove = (id, index) => {
        let resultado = agendas.items.find(agendas => agendas.id === id);
        let arrayAgendas
        if (resultado.originalName !== "bloqueDeTexto") {
            arrayAgendas = agendas.items.filter(agendas => agendas.id !== id)
            arrastrables.items.push(resultado)
        } else {
            arrayAgendas = agendas.items.filter(agendas => agendas.id !== id)
        }
        setAgendas({ items: arrayAgendas })
        setArrastrables(arrastrables)
    };

    const moveUp = (id, index) => {
        if (index > 0) {
            setAgendas(({ items }) => ({
                items: arrayMove(items, index, (index - 1)),
            }));
        }
    };

    const moveDown = (id, index) => {
        if ((index + 1) < agendas.items.length) {
            setAgendas(({ items }) => ({
                items: arrayMove(items, index, (index + 1)),
            }));
        }
    };


    const changeTemplate = (event, agendas) => {
        if (template !== event.target.value) {
            setTemplate(event.target.value)
            renderTemplate(event.target.value, agendas)
        }
    };


    const renderTemplate = (numTemp, agendas) => {
        ordenarTemplate(defaultTemplates[numTemp], agendas)
    };



    const ordenarTemplate = (orden, agendas) => {
        let auxTemplate = []
        let auxArrastrableQuitar = []
        if (orden !== undefined) {
            orden.forEach(element => {
                if (element === 'tomaAcuerdos') {
                    const bloques = agendaBlocks.map(block => {
                        return arrastrables.items.find(
                            arrastrable =>
                                arrastrable.originalName === block
                        )
                    });
                    auxTemplate = [...auxTemplate, ...bloques];
                } else {
                    auxTemplate.push(
                        arrastrables.items.find(
                            arrastrable =>
                                arrastrable.originalName === element
                        )
                    );
                }
            })
            setArrastrables({ items: [...arrastrables.items.filter(value => !agendaBlocks.includes(value.originalName) && !orden.includes(value.originalName)),] })
            setAgendas({ items: auxTemplate })
        } else {
            setAgendas({ items: [] })
            setArrastrables({ items: [...agendas.items, ...arrastrables.items] })
        }
    }

    const ordenarTemplateInit = (orden, array, agendas) => {
        let auxTemplate = []
        let auxTemplate2 = { items: array }
        let auxArrastrableQuitar = []
        let puntosDelDiaLenght = agendas.length
        if (orden !== undefined) {
            orden.forEach(element => {
                if (element === 'tomaAcuerdos') {
                    agendas.forEach((agenda, index) => {
                        const bloques = agendaBlocks.map(block => {
                            return auxTemplate2.items.find(
                                arrastrable =>
                                    arrastrable.originalName === block && arrastrable.name.includes(`Punto ${index + 1}`)
                            )
                        });
                        auxTemplate = [...auxTemplate, ...bloques];
                    })
                } else {
                    auxTemplate.push(
                        auxTemplate2.items.find(
                            arrastrable =>
                                arrastrable.originalName === element
                        )
                    );
                }
            })
            setArrastrables({ items: [...auxTemplate2.items.filter(value => !agendaBlocks.includes(value.originalName) && !orden.includes(value.originalName)),] })
            setAgendas({ items: auxTemplate })
        } else {
            setAgendas({ items: [] })
            setArrastrables({ items: [...agendas.items, ...arrastrables.items] })
        }
    }

    const loadDraft = async draft => {
        const correctedText = await changeVariablesToValues(draft.text, {
            company: 569,
            council: 7021
        }, translate);

        this[state.load].paste(correctedText);
        setState({
            loadDraft: false
        });
    };

    return (
        <div style={{ width: "100%", height: "100%" }}>
            {loading ?
                <LoadingSection></LoadingSection>
                :
                <React.Fragment>
                    <div style={{ borderBottom: "1px solid gainsboro" }}>{/* height: "3em" */}
                        <div style={{ display: "flex", alignItems: "center", padding: "0px 1em", justifyContent: "space-between" }}>
                            <div>
                                <SelectInput
                                    value={template}
                                    floatingText={'Plantillas'}
                                    onChange={(event) => changeTemplate(event, agendas)}
                                >
                                    <MenuItem value={'none'}> </MenuItem>
                                    <MenuItem value={0}>Default</MenuItem>
                                    {/* <MenuItem value={'default4'}>Vacia</MenuItem> */}
                                </SelectInput>
                            </div>
                            <div style={{ display: "flex", }}>
                                <div style={{ marginRight: "2em", marginTop: "0.4em", }}>
                                    <i className={colapse ? "fa fa-eye-slash" : "fa fa-eye"} style={{ cursor: "pointer" }} onClick={() => setColapse(!colapse)} ></i>
                                </div>
                                <FormControlLabel control={<Switch checked={edit} onChange={event => handleChange(event)} value="edit" />} label="Edit" />
                            </div>
                        </div>
                    </div>
                    <div style={{ display: "flex", height: "100%" }}>
                        <div style={{ width: "40%", overflow: "hidden", height: "calc( 100% - 3em )", display: colapse ? "none" : "" }}>
                            <div style={{ width: "98%", display: "flex", padding: "1em 1em " }}>
                                <i className="material-icons" style={{ color: getPrimary(), fontSize: '14px', cursor: "pointer", paddingRight: "0.3em", marginTop: "4px" }} onClick={() => setOcultar(!ocultar)}>
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
                                            {arrastrables.items.filter(item => !item.logic ).map((item, index) => {
                                                // .filter(item => item.logic === true).map((item, index) => {
                                                return (
                                                    <CajaBorderIzq
                                                        addItem={addItem}
                                                        itemInfo={item.id}
                                                    >
                                                        <div key={index + item.id}>
                                                            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#a09aa0' }}>{item.name}</div>
                                                        </div>
                                                    </CajaBorderIzq>
                                                )
                                            }
                                            )}
                                            <BloquesAutomaticos
                                                addItem={addItem}
                                                automaticos={arrastrables}
                                            >
                                            </BloquesAutomaticos>
                                        </React.Fragment>
                                    </Grid>
                                </Scrollbar>
                            </div>
                        </div>
                        <div style={{ width: colapse ? "100%" : "60%", height: "calc( 100% - 3em )", justifyContent: colapse ? 'center' : "", display: colapse ? 'flex' : "" }}>
                            {!colapse &&
                                <div style={{ display: "flex", justifyContent: "space-between", padding: "1em 0em " }}>
                                    <div style={{ display: "flex" }}>
                                        <BasicButton
                                            text={'Ver PDF'}
                                            color={"white"}
                                            textStyle={{
                                                color: "black",
                                                fontWeight: "700",
                                                fontSize: "0.9em",
                                                textTransform: "none",
                                                whiteSpace: "nowrap"
                                            }}
                                            textPosition="after"
                                            iconInit={<i style={{ marginRight: "0.3em", fontSize: "18px" }} className="fa fa-file-pdf-o" aria-hidden="true"></i>}
                                            // onClick={() => this.setState({ modal: true })}
                                            buttonStyle={{
                                                marginRight: "1em",
                                                boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.08)',
                                                borderRadius: '3px'
                                            }}
                                        />
                                        <BasicButton
                                            text={translate.save}
                                            color={getPrimary()}
                                            textStyle={{
                                                color: "white",
                                                fontSize: "0.9em",
                                                textTransform: "none"
                                            }}
                                            textPosition="after"
                                            iconInit={<i style={{ marginRight: "0.3em", fontSize: "18px" }} className="fa fa-floppy-o" aria-hidden="true"></i>}
                                            // onClick={() => this.setState({ modal: true })}
                                            buttonStyle={{
                                                marginRight: "1em",
                                                boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.08)',
                                                borderRadius: '3px'
                                            }}
                                        />
                                        <BasicButton
                                            text={'Enviar a revision'}
                                            color={getPrimary()}
                                            textStyle={{
                                                color: "white",
                                                fontSize: "0.9em",
                                                textTransform: "none",
                                                whiteSpace: "nowrap"
                                            }}
                                            textPosition="after"
                                            iconInit={<i style={{ marginRight: "0.3em", fontSize: "18px" }} className="fa fa-floppy-o" aria-hidden="true"></i>}
                                            // onClick={() => this.setState({ modal: true })}
                                            buttonStyle={{
                                                marginRight: "1em",
                                                boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.08)',
                                                borderRadius: '3px'
                                            }}
                                        />
                                        <BasicButton
                                            text={'Finalizar'}
                                            color={getSecondary()}
                                            textStyle={{
                                                color: "white",
                                                fontSize: "0.9em",
                                                textTransform: "none"
                                            }}
                                            textPosition="after"
                                            iconInit={<i style={{ marginRight: "0.3em", fontSize: "18px" }} className="fa fa-floppy-o" aria-hidden="true"></i>}
                                            // onClick={() => this.setState({ modal: true })}
                                            buttonStyle={{
                                                marginRight: "1em",
                                                boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.08)',
                                                borderRadius: '3px'
                                            }}
                                        />
                                    </div>
                                    <div style={{ display: "flex" }}>
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
                                            iconInit={<img src={preview} />}
                                            // onClick={() => this.setState({ modal: true })}
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
                                            iconInit={<img src={textool} />}
                                            // onClick={() => this.setState({ modal: true })}
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
                            <div style={{ height: "calc( 100% - 3em )", borderRadius: "8px", background: "white", maxWidth: colapse ? "210mm" : "", width: colapse ? "100%" : "" }}>
                                <Scrollbar>
                                    <div style={{ display: "flex", height: "100%" }}>
                                        <div style={{ width: "20%", maxWidth: "95px" }}>
                                            <img style={{ width: "100%", }} src={imgIzq}></img>
                                        </div>
                                        <div style={{ width: "100%" }}>
                                            <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
                                                <div style={{ width: "13%", marginTop: "1em", marginRight: "4em", maxWidth: "125px" }}>
                                                    <img style={{ width: "100%" }} src={company.logo}></img>
                                                </div>
                                            </div>
                                            <div style={{ padding: "1em", paddingLeft: "0.5em", marginRight: "3em", marginBottom: "3em" }}>
                                                <SortableList
                                                    axis={"y"}
                                                    lockAxis={"y"}
                                                    items={agendas.items}
                                                    updateCouncilActa={updateCouncilActa}
                                                    editInfo={editInfo}
                                                    state={state}
                                                    setState={setState}
                                                    edit={edit}
                                                    translate={translate}
                                                    offset={agendas.items.lenght}
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
                                </Scrollbar>
                            </div>
                        </div>
                    </div>
                    <Dialog
                        open={state.loadDraft}
                        maxWidth={false}
                        onClose={() => setState({ loadDraft: false })}
                    >
                        <DialogTitle>{translate.load_draft}</DialogTitle>
                        <DialogContent style={{ width: "800px" }}>
                            <LoadDraft
                                translate={translate}
                                companyId={props.match.params.company}
                                loadDraft={loadDraft}
                                statute={data.data.council.statute}
                                statutes={data.data.companyStatutes}
                                draftType={state.draftType}
                            />
                        </DialogContent>
                    </Dialog>
                </React.Fragment>
            }
        </div >
    )

}

const Bloques = ({ text, styles, setBloque, selected }) => {
    const [hover, setHover] = React.useState(false);

    const onMouseEnter = () => {
        setHover(true)
    }

    const onMouseLeave = () => {
        setHover(false)
    }

    return (
        <div
            onClick={setBloque}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{
                textDecoration: hover ? `underline ${getSecondary()}` : selected ? `underline ${getSecondary()}` : "",
                padding: "10px 30px 10px 30px",
                borderBottom: "1px solid gainsboro",
                borderRight: "1px solid gainsboro",
                width: "100%",
                textAlign: " center",
                cursor: 'pointer',
                ...styles
            }}
        >
            {text}
        </div>
    );
}


const ActionToInsert = ({ xs, md, lg, addItem, icon, text, name, itemInfo }) => {
    const [hover, setHover] = React.useState(false);

    const onMouseEnter = () => {
        setHover(true)
    }

    const onMouseLeave = () => {
        setHover(false)
    }

    return (
        <GridItem
            key={itemInfo}
            xs={xs}
            md={md}
            lg={lg}
            style={{ overflow: "hidden", marginRight: "1em" }}
        >
            <div
                style={{
                    border: "1px solid gainsboro",
                    borderRadius: "3px",
                    boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
                    // background: hover ? "#dcdcdc59" : "white",
                    background: "white",
                    padding: "1em",
                }}
            >
                <div style={{}}>
                    <div style={{ fontWeight: 700, display: "flex", justifyContent: "space-between" }}>
                        <div style={{ textTransform: "capitalize" }}>
                            {name}
                        </div>
                        <div
                            onMouseEnter={onMouseEnter}
                            onMouseLeave={onMouseLeave}
                            style={{ cursor: "pointer", }}
                            onClick={() => addItem(itemInfo)}
                        >
                            <i className={"fa fa-arrow-right"} style={{ color: hover && "black" }} aria-hidden="true"></i>
                        </div>
                    </div>
                    <div style={{
                        marginTop: "1em",
                        maxHeight: "6.6em",
                        overflow: "hidden",
                        border: "1px solid gainsboro",
                        padding: "1em",
                    }}>
                        <div style={{
                            overflow: "hidden",
                            display: '-webkit-box',
                            WebkitLineClamp: '3',
                            WebkitBoxOrient: 'vertical',
                        }}
                            dangerouslySetInnerHTML={{
                                __html: text
                            }}  >
                        </div>
                    </div>
                </div>
            </div>
        </GridItem>
    );
};


const SortableList = SortableContainer(({ items, updateCouncilActa, editInfo, state, setState, edit, translate, offset = 0, moveUp, moveDown, remove }) => {
    if (edit) {
        return (
            <div >
                {items &&
                    items.map((item, index) => (
                        <DraggableBlock
                            key={`item-${item.id}`}
                            updateCouncilActa={updateCouncilActa}
                            state={state}
                            setState={setState}
                            edit={edit}
                            editInfo={editInfo}
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
            <div >
                {items &&
                    items.map((item, index) => (
                        <NoDraggableBlock
                            key={`item-${item.id}`}
                            updateCouncilActa={updateCouncilActa}
                            edit={edit}
                            translate={translate}
                            index={offset + index}
                            value={item}
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


const DraggableBlock = SortableElement((props) => {
    const [hover, setHover] = React.useState(false);
    const [hoverFijo, setHoverFijo] = React.useState(false);
    const [text, setText] = React.useState("");

    const onMouseEnter = () => {
        setHover(true)
    }
    const onMouseLeave = () => {
        setHover(false)
    }

    const hoverAndSave = (id) => {
        if (hoverFijo) {
            props.updateCouncilActa(id, text);
        }
        setHoverFijo(!hoverFijo)
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
            <div style={{ marginLeft: "4px", width: '95%', minHeight:"90px" }}>
                <div style={{ width: "25px", cursor: "pointer", position: "absolute", top: "5px", right: "0", right: "35px" }}>
                    {props.expand &&
                        < IconsDragActions
                            turn={"expand"}
                            clase={`fa fa-times ${props.id}`}
                            aria-hidden="true"
                            click={props.remove}
                            id={props.id}
                            indexItem={props.indexItem}
                        />
                    }
                </div>
                <div style={{ width: "25px", cursor: "pointer", position: "absolute", top: "5px", right: "0", }}>
                    {!props.noBorrar &&
                        < IconsDragActions
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
                <div style={{ padding: "1em", paddingRight: "1.5em", width: "100%", }}>
                    <div style={{ display: "flex", fontSize: '19px' }}>
                        <div style={{ color: getPrimary(), fontWeight: "bold", display: "flex", paddingRight: "1em", }}>
                            {props.value.icon ?
                                <React.Fragment>
                                    <div>
                                        <img src={props.value.icon} />
                                    </div>
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    <div>Aa</div>
                                    <div>
                                        <i className="fa fa-i-cursor" aria-hidden="true">
                                        </i>
                                    </div>
                                </React.Fragment>
                            }

                        </div>
                        <div style={{ fontWeight: "700" }}>
                            {props.value.name}
                        </div>
                    </div>

                    {hoverFijo ?
                        <div style={{ marginTop: "1em", cursor: "default" }} className="editorText" >
                            <RichTextInput
                                noBordes={true}
                                value={props.value.text || ''}
                                translate={props.translate}
                                // tags={generateActTags(editInfo.originalName, { council, company }, translate)}
                                errorText={props.state.errors === undefined ? "" : props.state.errors[props.editInfo.originalName]}
                                onChange={value => setText(value)}
                                loadDraft={
                                    <BasicButton
                                        text={props.translate.load_draft}
                                        color={getSecondary()}
                                        textStyle={{
                                            color: "white",
                                            fontWeight: "600",
                                            fontSize: "0.8em",
                                            textTransform: "none",
                                            marginLeft: "0.4em",
                                            minHeight: 0,
                                            lineHeight: "1em"
                                        }}
                                        textPosition="after"
                                        onClick={() =>
                                            props.setState({
                                                loadDraft: true,
                                                load: props.name,
                                                draftType: DRAFT_TYPES[props.name.toUpperCase()]
                                            })
                                        }
                                    />
                                }
                            />
                        </div>
                        :
                        <div style={{ marginTop: "1em" }} dangerouslySetInnerHTML={{
                            __html: props.value.text
                        }}>
                        </div>
                    }
                    <div style={{ marginTop: "1em", }}>
                        {props.value.editButton &&
                            <Button style={{ color: getPrimary(), minWidth: "0", padding: "0" }} onClick={() => hoverAndSave(props.id)}>
                                {/* onClick={props.updateCouncilActa} */}
                                {hoverFijo ?
                                    'Editando' //TRANSLATE
                                    :
                                    'Editar' //TRANSLATE
                                }
                            </Button>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
});

const NoDraggableBlock = (props) => {
    // const [hover, setHover] = React.useState(false);

    // const onMouseEnter = () => {
    //     setHover(true)
    // }
    // const onMouseLeave = () => {
    //     setHover(false)
    // }

    if (props.logic) {
        return (
            props.value !== undefined && props.value.text !== undefined &&
            <Card
                // onMouseEnter={onMouseEnter}
                // onMouseLeave={onMouseLeave}
                key={props.id}
                style={{
                    // boxShadow: "0px 0px 5px 0px green",
                    boxShadow: "none",
                    margin: "3px",
                    paddingLeft: "15px",
                    paddingTop: "5px",
                    marginBottom: "1em"
                }}
            >
                <div style={{}}>
                    {/* {hover &&
                        <div style={{ display: "flex" }}>
                            <div style={{ fontWeight: "700" }}>
                                {props.value.name}
                            </div>
                            <div style={{ fontWeight: "700" }}>
                                <HelpPopover
                                    title={"Bloque lógico"}
                                    content={"Este bloque se completará con la informacion adecuada cuando se genere el acta y no tendra el recuadro verde"}
                                >
                                </HelpPopover>
                            </div>
                        </div>
                    } */}
                    <div style={{}}
                        dangerouslySetInnerHTML={{
                            __html: props.value.text
                        }}>
                    </div>

                </div>
            </Card>
        );
    } else {
        return (
            props.value !== undefined && props.value.text !== undefined &&
            <Card
                // onMouseEnter={onMouseEnter}
                // onMouseLeave={onMouseLeave}
                key={props.id}
                style={{
                    // boxShadow: hover ? "0px 0px 5px 0px #f99292d9" : "none",
                    boxShadow: "none",
                    margin: "3px",
                    paddingLeft: "15px",
                    paddingTop: "5px",
                }}
            >
                <div style={{}}>
                    {/* {hover &&
                        <div style={{ display: "flex" }}>
                            <div style={{ fontWeight: "700" }}>
                                {props.value.name}
                            </div>
                            {/* <div style={{ fontWeight: "700" }}>
                                <HelpPopover
                                    title={"s"}
                                    content={"asdas"}
                                >
                                </HelpPopover>
                            </div> */}
                    {/* </div> */}

                    <div style={{}}
                        dangerouslySetInnerHTML={{
                            __html: props.value.text
                        }}>
                    </div>

                </div>
            </Card>
        );
    }

}


const CajaBorderIzq = ({ colorBorder, children, addItem, itemInfo }) => {

    return (
        <div style={{ width: "100%", background: "white", boxShadow: " 0 2px 4px 5px rgba(0, 0, 0, 0.11)", borderRadius: "4px", marginBottom: "0.8em", }}>
            <div style={{ width: "100%", display: "flex", }}>
                <div style={{ paddingRight: "4px", background: getPrimary(), borderRadius: "15px", }}></div>
                <div style={{ marginLeft: "0.5em", paddingTop: "0.8em", paddingBottom: "0.8em", width: "100%" }}>
                    <div style={{ display: "flex", width: "100%" }}>
                        <div style={{ color: getPrimary(), fontWeight: "bold", fontSize: '16px', display: "flex" }}>
                            <div> Aa</div>
                            <div>
                                <i className="fa fa-i-cursor" aria-hidden="true">
                                </i>
                            </div>
                        </div>
                        <div style={{ justifyContent: "space-between", display: "flex", width: "100%" }}>
                            <div style={{ marginLeft: "0.3em", width: "100%", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', }}>
                                {children}
                            </div>
                            <div style={{ marginLeft: "0.3em", marginRight: "0.3em" }}>
                                <i className="material-icons" style={{ cursor: "pointer", color: "#979797" }} onClick={addItem}>
                                    arrow_right_alt
                            </i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const BloquesAutomaticos = ({ colorBorder, children, automaticos, addItem }) => {
    const [open, setOpen] = React.useState(true)
    console.log(automaticos)
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
                                <div style={{ fontSize: "10px", color: "#a09aa0", fontWeight:"100" }}>Este tipo de bloques son generados automáticamente por el sistema y no necesitan edición.</div>
                            }
                        </div>
                    </div>
                    <div style={{ width: "100%", marginTop: "0.5em" }}>
                        {automaticos.items.filter(item => item.logic === true).map((item, index) => {
                            console.log(item)
                            // console.log(delegaciones)
                            return (
                                <CajaBloquesAutomaticos
                                    item={item}
                                    addItem={addItem}
                                />
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

const CajaBloquesAutomaticos = ({ colorBorder, children, item, addItem }) => {
    // console.log(item)
    return (
        <div style={{ display: "flex", width: "100%", marginBottom: "0.8em" }}>
            <div style={{ color: getPrimary(), fontWeight: "bold", fontSize: '16px', display: "flex" }}>
                {/* <div> Aa</div>
                <div>
                    <i className="fa fa-i-cursor" aria-hidden="true">
                    </i>
                </div> */}
                <div>
                    <img src={item.icon} />
                </div>
            </div>
            <div style={{ justifyContent: "space-between", display: "flex", width: "100%" }}>
                <div style={{ marginLeft: "0.3em", width: "100%", whiteSpace: 'nowrap', fontSize: ' 16px', overflow: 'hidden', textOverflow: 'ellipsis', color: "#000000" }}>
                    {item.name}
                </div>
                <div style={{ marginLeft: "0.3em", marginRight: "0.3em" }}>
                    <i className="material-icons" style={{ cursor: "pointer", color: "#979797" }} onClick={addItem}>
                        arrow_right_alt
        </i>
                </div>
            </div>
        </div>
    )
}



const IconsDragActions = ({ clase, click, id, indexItem, turn }) => {
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
                style={{ background: hover && "gainsboro", borderRadius: "10px", color: "#a09aa0", transform: 'rotate(-90deg)' }}
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
                className={"fa fa-arrows-alt"}
                style={{ background: hover && "gainsboro", borderRadius: "10px", color: "#a09aa0" }}
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
                style={{ background: hover && "gainsboro", borderRadius: "10px", color: "#a09aa0" }}
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
                style={{ background: hover && "gainsboro", borderRadius: "10px", color: "#a09aa0", transform: 'rotate(90deg)' }}
                aria-hidden="true"
                onClick={() => click(id, indexItem)}
            >
                arrow_right_alt
            </i>
        )
    }
}


const CouncilActData = gql`
	query CouncilActData($councilID: Int!, $companyId: Int!, $options: OptionsInput ) {
                council(id: $councilID) {
                id
			businessName
			country
			countryState
			currentQuorum
			quorumPrototype
			secretary
			president
			street
			city
			name
			remoteCelebration
			dateStart
			dateStart2NdCall
			dateRealStart
			dateEnd
			qualityVoteId
			firstOrSecondConvene
			act {
                id
				intro
            constitution
            conclusion
        }
			statute {
                id
				statuteId
            prototype
            existsQualityVote
        }
    }

		agendas(councilId: $councilID) {
                id
			orderIndex
			agendaSubject
			subjectType
			abstentionVotings
			abstentionManual
			noVoteVotings
			noVoteManual
			positiveVotings
			positiveManual
			negativeVotings
			negativeManual
			description
			majorityType
			majority
			majorityDivider
			items {
                id
				value
        }
			options {
                id
				maxSelections
        }
			ballots {
                id
				participantId
            weight
            value
            itemId
        }
        numNoVoteVotings
        numPositiveVotings
        numNegativeVotings
        numAbstentionVotings
        numPresentCensus
        presentCensus
        numCurrentRemoteCensus
        currentRemoteCensus
        comment
    }

		councilRecount(councilId: $councilID){
                socialCapitalTotal
			partTotal
			partPresent
			partRemote
			weighedPartTotal
			numTotal
		}

		participantsWithDelegatedVote(councilId: $councilID){
                id
			name
            surname
            dni
			state
			representative {
                id
				name
            surname
        }
    }

		votingTypes {
                label
			value
		}

		councilAttendants(
			councilId: $councilID
			options: $options
		) {
                list {
                id
				name
            surname
            lastDateConnection
            dni
        }
    }

		companyStatutes(companyId: $companyId) {
                id
			title
			censusId
		}

		majorityTypes {
                label
			value
		}
	}
`;

export default withApollo(withSharedProps()(OrdenarPrueba)); 