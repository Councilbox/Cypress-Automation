import React from 'react';
import { getPrimary, getSecondary } from '../../../../styles/colors';
import RichTextInput from '../../../../displayComponents/RichTextInput';
import { Button, Collapse } from 'material-ui';
import { DRAFT_TYPES } from '../../../../constants';
import iconVotaciones from '../../../../assets/img/handshake.svg';
import { BasicButton } from '../../../../displayComponents';


const Block = ({ expand, hoverFijo, hoverAndSave, setText, ...props }) => {
    console.log(props);
    return (
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
                    {props.value.label}
                </div>
            </div>
            {props.expand ?
                // Este es el que tiene que montar los demas puntos dentro
                <Collapse in={expand} timeout="auto" unmountOnExit>
                    <React.Fragment>
                        <div style={{ marginTop: "1em" }} dangerouslySetInnerHTML={{
                            __html: props.value.text
                        }}>
                        </div>
                        <div>
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
                        <CajaBorderIzq
                            itemInfo={288}
                            icon={iconVotaciones}
                            colorBorder={'#866666'}
                            stylesBody={{ width: "98%" }}
                            borrar={true}
                        >
                            <div >
                                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#a09aa0' }}>Votaciones del punto</div>
                            </div>
                        </CajaBorderIzq>
                    </React.Fragment>
                </Collapse>
                :
                hoverFijo ?
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
                    }}></div>
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
    )
}

export const CajaBorderIzq = ({ colorBorder, children, addItem, itemInfo, icon, stylesBody, borrar }) => {

    return (
        <div style={{ width: "100%", background: "white", boxShadow: " 0 2px 4px 5px rgba(0, 0, 0, 0.11)", borderRadius: "4px", marginBottom: "0.8em", ...stylesBody }}>
            <div style={{ width: "100%", display: "flex", }}>
                <div style={{ paddingRight: "4px", background: colorBorder ? colorBorder : getPrimary(), borderRadius: "15px", }}></div>
                <div style={{ marginLeft: "0.5em", paddingTop: "0.8em", paddingBottom: "0.8em", width: "100%" }}>
                    <div style={{ display: "flex", width: "100%" }}>
                        <div style={{ color: getPrimary(), fontWeight: "bold", fontSize: '16px', display: "flex" }}>
                            {icon ?
                                <React.Fragment>
                                    <div>
                                        <img src={icon} />
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
                        <div style={{ justifyContent: "space-between", display: "flex", width: "100%" }}>
                            <div style={{ marginLeft: "0.3em", width: "100%", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', }}>
                                {children}
                            </div>
                            <div style={{ marginLeft: "0.3em", marginRight: "0.3em" }}>
                                {borrar ?
                                    <i className="fa fa-trash-o" style={{ cursor: "pointer", color: colorBorder }} >
                                    </i>
                                    :
                                    <i className="material-icons" style={{ cursor: "pointer", color: "#979797" }} onClick={() => addItem(itemInfo)}>
                                        arrow_right_alt
                            </i>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Block