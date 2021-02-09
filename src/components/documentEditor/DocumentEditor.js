import React from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { Card } from 'material-ui';
import { withApollo } from 'react-apollo';
import { getPrimary } from '../../styles/colors';
import withSharedProps from '../../HOCs/withSharedProps';
import { getBlocks, generateAgendaBlocks } from './actBlocks';
import AgreementsBlock from './AgreementsBlock';
import Block, { BorderBox } from './Block';
import AgreementsPreview from './AgreementsPreview';
import { getTranslations } from '../../queries';
import { buildTranslateObject } from '../../actions/mainActions';


// https://codesandbox.io/embed/react-sortable-hoc-2-lists-5bmlq para mezclar entre 2 ejemplo --collection--

const agendaBlocks = ['agendaSubject', 'description', 'comment', 'voting', 'votes', 'agendaComments'];
const defaultTemplates = {
    0: ['title', 'intro', 'agenda', 'constitution',
        'agreements',
        'conclusion', 'attendants', 'delegations'
    ],
    default1: ['intro', 'constitution', 'conclusion'],
    default2: ['intro', 'constitution', 'conclusion']
};


export const ActContext = React.createContext();
const DocumentEditor = ({ translate, company, data, updateDocument, client, ...props }) => {
    const [options, setOptions] = React.useState(data.council.act.document ? { ...data.council.act.document.options } : {
        stamp: true,
        doubleColumn: false
    });
    const [secondaryTranslate, setSecondaryTranslate] = React.useState(null);
    const [doc, setDoc] = React.useState({ items: [], });
    const [arrastrables, setArrastrables] = React.useState({ items: [] });

    const generateDraggable = () => {
        const blocks = getBlocks(translate);
        const { agendas, council } = data;
        const { act } = council;
        /// let objetoArrayAct = Object.entries(act);
        const items = [
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

        const buildDocModules = (orden, array, agendas, act) => {
            if (doc.items.length > 0) {
                return {
                    draggables: {
                        items: [...array.filter(value => (
                            value.type === 'text'
                            || (!agendaBlocks.includes(value.type) && !orden.includes(value.type))))]
                    },
                    doc: {
                        items: [...doc.items]
                    }
                };
            }

            if (act.document) {
                return {
                    draggables: {
                        items: [...array.filter(value => (
                            value.type === 'text'
                            || (!agendaBlocks.includes(value.type) && !orden.includes(value.type))))]
                    },
                    doc: {
                        items: [...act.document.items]
                    }
                };
            }
            let auxTemplate = [];
            const auxTemplate2 = { items: array };

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
                    draggables: { items: [...auxTemplate2.items.filter(value => !agendaBlocks.includes(value.type) && !orden.includes(value.type))] },
                    doc: {
                        items: auxTemplate
                    }
                };
            }
            return {
                draggables: { items: [...doc.items, ...arrastrables.items] },
                doc: {
                    items: auxTemplate
                }
            };
        };

        let template = defaultTemplates[0];

        if (doc.items.length > 0) {
            template = doc.items.map(item => item.type);
        } else if (act.document) {
            template = act.document.items.map(item => item.type);
        }

        return buildDocModules(template, items, agendas, act, translate);
    };

    const rebuildBlockSecondaryTranslation = () => {
        const newItems = doc.items.map(item => ({
            ...item,
            secondaryText: item.buildDefaultValue ? item.buildDefaultValue(data, secondaryTranslate) : item.secondaryText
        }));
        setDoc({ items: newItems });
    };

    React.useEffect(() => {
        const { draggables, doc: draggleDoc } = generateDraggable(data, translate);
        setDoc(draggleDoc);
        setArrastrables(draggables);
    }, [data.council.id]);

    const getSecondaryLanguage = async language => {
        const response = await client.query({
            query: getTranslations,
            variables: {
                language
            }
        });

        const secondaryTranslateData = buildTranslateObject(response.data.translations);
        setSecondaryTranslate(secondaryTranslateData);
        rebuildBlockSecondaryTranslation(translate, secondaryTranslate);
    };

    React.useEffect(() => {
        if (options.doubleColumn) {
            getSecondaryLanguage('en');
        }
    }, [options.doubleColumn]);

    return (
        <ActContext.Provider value={data}>

        </ActContext.Provider>
    );
};


const SortableList = SortableContainer(({ items, column, updateCouncilActa, updateBlock, state, setState, edit, translate, offset = 0, moveUp, moveDown, remove }) => {
    if (edit) {
        return (
            <div >
                {items
                    && items.map((item, index) => (
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
    }
    return (
        <div>
            {items
                && items.map((item, index) => (
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
});


const DraggableBlock = SortableElement(props => {
    const [expand, setExpand] = React.useState(false);
    const [hover, setHover] = React.useState(false);

    const onMouseEnter = () => {
        setHover(true);
    };
    const onMouseLeave = () => {
        setHover(false);
    };
    const blockFijoTomadeAcuerdos = {
        value: {
            id: Math.random().toString(36).substr(2, 9),
            label: 'Toma de acuerdos',
            editButton: true,
            type: 'Toma de acuerdos',
            noBorrar: true,
            text: '',
            expand: true
        }
    };

    return (
        props.value !== undefined && props.value.text !== undefined
        && <div
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            key={props.id}
            style={{
                opacity: 1,
                width: '100%',
                display: 'flex',
                listStyleType: 'none',
                borderRadius: '4px',
                cursor: 'grab',
                marginBottom: '0.8em',
                position: 'relative',
                boxShadow: '0 2px 4px 5px rgba(0, 0, 0, 0.11)',
                background: 'white'
            }}
            className="draggable"
        >
            <div style={{ paddingRight: '4px', background: props.value.colorBorder ? props.value.colorBorder : getPrimary(), borderRadius: '15px', }}></div>
            <div style={{ marginLeft: '4px', width: '95%', minHeight: '90px' }}>
                <div style={{ width: '25px', cursor: 'pointer', position: 'absolute', top: '5px', right: '35px' }}>
                    {props.expand
                        && <IconsDragActions
                            turn={'expand'}
                            clase={`fa fa-times ${props.id}`}
                            aria-hidden="true"
                            click={() => setExpand(!expand)}
                            id={props.id}
                            indexItem={props.indexItem}
                            expand={expand}
                        />
                    }
                </div>
                <div style={{ width: '25px', cursor: 'pointer', position: 'absolute', top: '5px', right: '0', }}>
                    {!props.noBorrar
                        && <IconsDragActions
                            turn={'cross'}
                            clase={`fa fa-times ${props.id}`}
                            aria-hidden="true"
                            click={props.remove}
                            id={props.id}
                            indexItem={props.indexItem}
                        />
                    }
                </div>
                <div style={{ width: '25px', cursor: 'pointer', position: 'absolute', top: !props.noBorrar ? '35px' : '10px', right: '1px', }}>
                    <div>
                        <IconsDragActions
                            turn={'up'}
                            aria-hidden="true"
                            click={props.moveUp}
                            id={props.id}
                            indexItem={props.indexItem}
                        />
                    </div>
                    <div>
                        <IconsDragActions
                            turn={'down'}
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
                        : <Block
                            {...blockFijoTomadeAcuerdos}
                        />
                    : <Block
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
            props.value !== undefined && props.value.text !== undefined
            && <BorderBox
                itemInfo={288}
                icon={props.value.icon}
                id={props.id}
                colorBorder={props.value.colorBorder}
                stylesBody={{ width: '98%' }}
                noIcon={true}
            >
                <div >
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#a09aa0' }}>{props.value.label}</div>
                </div>
            </BorderBox>
        );
    }
    return (
        props.value !== undefined && props.value.text !== undefined
        && <React.Fragment>
            {props.value.type === 'agreements' ?
                <Card
                    key={props.id}
                    style={{
                        boxShadow: 'none',
                        margin: '3px',
                        paddingLeft: '15px',
                        paddingTop: '5px',
                    }}
                >
                    <AgreementsPreview
                        column={props.column}
                        item={props.value}
                        translate={props.translate}
                    />
                </Card>
                : <Card
                    key={props.id}
                    style={{
                        boxShadow: 'none',
                        margin: '3px',
                        paddingLeft: '15px',
                        paddingTop: '5px',
                    }}
                >
                    <div style={{}}>
                        <div style={{}}
                            dangerouslySetInnerHTML={{
                                __html: props.column === 2 ? props.value.secondaryText : props.value.text
                            }}>
                        </div>

                    </div>
                </Card>
            }
        </React.Fragment>

    );
};

const BloquesAutomaticos = ({ automaticos, addItem, translate }) => {
    const [open, setOpen] = React.useState(true);
    return (
        <div style={{ width: '100%', background: 'white', boxShadow: ' 0 2px 4px 5px rgba(0, 0, 0, 0.11)', borderRadius: '4px', marginBottom: '0.8em', }}>
            <div style={{ width: '100%', display: 'flex', }}>
                <div style={{ paddingRight: '4px', }}></div>
                <div style={{ marginLeft: '0.5em', paddingTop: '0.8em', paddingBottom: '0.8em', width: '100%' }}>
                    <div style={{ width: '100%', fontSize: '16px', color: '#a09aa0', display: 'flex', fontWeight: 'bold' }}>
                        <div style={{ marginRight: '1em', width: '15em' }}>Bloques  automáticos</div>
                        <div style={{ display: 'flex', width: '100%' }}>
                            <div>
                                <i className="material-icons" style={{ color: getPrimary(), fontSize: '14px', cursor: 'pointer', paddingRight: '0.3em', marginTop: '4px' }} onClick={() => setOpen(!open)}>
                                    help
							</i>
                            </div>
                            {open
                                && <div style={{ fontSize: '10px', color: '#a09aa0', fontWeight: '100' }}>Este tipo de bloques son generados automáticamente por el sistema y no necesitan edición.</div>
                            }
                        </div>
                    </div>
                    <div style={{ width: '100%', marginTop: '0.5em' }}>
                        {automaticos.items.filter(item => item.logic === true).map((item, index) => (
                            <CajaBloquesAutomaticos
                                key={`${item.id + index}automaticos`}
                                item={item}
                                addItem={addItem}
                                translate={translate}
                                itemInfo={item.id}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const CajaBloquesAutomaticos = ({ item, addItem, itemInfo, translate }) => (
    <div style={{ display: 'flex', width: '100%', marginBottom: '0.8em' }}>
        <div style={{ color: getPrimary(), fontWeight: 'bold', fontSize: '16px', display: 'flex' }}>
            <div>
                <img src={item.icon} />
            </div>
        </div>
        <div style={{ justifyContent: 'space-between', display: 'flex', width: '100%' }}>
            <div style={{ marginLeft: '0.3em', width: '100%', whiteSpace: 'nowrap', fontSize: ' 16px', overflow: 'hidden', textOverflow: 'ellipsis', color: '#000000' }}>
                {translate[item.label] || item.label}
            </div>
            <div style={{ marginLeft: '0.3em', marginRight: '0.3em' }}>
                <i className="material-icons" style={{ cursor: 'pointer', color: '#979797' }} onClick={() => addItem(itemInfo)}>
                    arrow_right_alt
        </i>
            </div>
        </div>
    </div>
);


export const IconsDragActions = ({ click, id, indexItem, turn, expand }) => {
    const [hover, setHover] = React.useState(false);

    const onMouseEnter = () => {
        setHover(true);
    };
    const onMouseLeave = () => {
        setHover(false);
    };

    if (turn === 'up') {
        return (
            <i
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                className={'material-icons'}
                style={{ background: hover && 'gainsboro', borderRadius: '20px', color: '#a09aa0', transform: 'rotate(-90deg)' }}
                aria-hidden="true"
                onClick={() => click(id, indexItem)}
            >
                arrow_right_alt
            </i>
        );
    }
    if (turn === 'expand') {
        return (
            <i
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                className={'fa fa-compress'}
                style={{ background: hover && 'gainsboro', borderRadius: '20px', color: expand ? 'black' : '#a09aa0', padding: '5px', fontSize: '16px', }}
                aria-hidden="true"
                onClick={() => click(id, indexItem)}
            >
            </i>
        );
    }
    if (turn === 'cross') {
        return (
            <i
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                className={'material-icons'}
                style={{ background: hover && 'gainsboro', borderRadius: '20px', color: '#a09aa0' }}
                aria-hidden="true"
                onClick={() => click(id, indexItem)}
            >
                clear
            </i>
        );
    }

    return (
        <i
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={'material-icons'}
            style={{ background: hover && 'gainsboro', borderRadius: '20px', color: '#a09aa0', transform: 'rotate(90deg)' }}
            aria-hidden="true"
            onClick={() => click(id, indexItem)}
        >
            arrow_right_alt
        </i>
    );
};

export default withApollo(withSharedProps()(DocumentEditor));
