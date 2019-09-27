import React from 'react';
import { getPrimary, getSecondary } from '../../../../styles/colors';
import RichTextInput from '../../../../displayComponents/RichTextInput';
import { Button, Collapse } from 'material-ui';
import { DRAFT_TYPES } from '../../../../constants';
import iconVotaciones from '../../../../assets/img/handshake.svg';
import { BasicButton } from '../../../../displayComponents';
import { Dialog, DialogTitle, DialogContent } from 'material-ui';
import LoadDraft from '../../../company/drafts/LoadDraft';
import { ActContext } from '../OrdenarPrueba';
import withSharedProps from '../../../../HOCs/withSharedProps';
import { changeVariablesToValues } from '../../../../utils/CBX';


const Block = ({ expand, setExpand, company, translate, ...props }) => {
    const [hoverFijo, setHoverFijo] = React.useState(false);
    const [text, setText] = React.useState("");
    const [draftModal, setDraftModal] = React.useState(false);
    const actData = React.useContext(ActContext);
    const editor = React.useRef();


    const loadDraft = async draft => {
        const correctedText = await changeVariablesToValues(draft.text, {
            company: actData.data.council.companyId,
            council: actData.data.council
        }, translate);

        props.updateCouncilActa(props.id, correctedText);
        editor.current.paste(correctedText);
        setDraftModal(false);
    };

    const openDraftModal = () => {
        setDraftModal(true);
    }

    const closeDraftModal = () => {
        setDraftModal(false);
    }


    const hoverAndSave = id => {
        if (hoverFijo) {
            props.updateCouncilActa(id, text);
        }
        setHoverFijo(!hoverFijo)
    }

    if(props.value.originalName === 'voting'){
        return (
            <CajaBorderIzq
                itemInfo={288}
                icon={iconVotaciones}
                id={props.id}
                colorBorder={props.value.colorBorder}
                stylesBody={{ width: "98%" }}
                removeBlock={props.removeBlock}
                borrar={true}
            >
                <div >
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#a09aa0' }}>{props.value.label}</div>
                </div>
            </CajaBorderIzq>
        )

    }

    const renderEditor = () => {
        return (
            <RichTextInput
                noBordes={true}
                ref={editor}
                value={props.value.text || ''}
                translate={translate}
                // tags={generateActTags(editInfo.originalName, { council, company }, translate)}
                //errorText={props.state.errors === undefined ? "" : props.state.errors[props.editInfo.originalName]}
                onChange={value => setText(value)}
                loadDraft={
                    <BasicButton
                        text={translate.load_draft}
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
                        onClick={openDraftModal}
                    />
                }
            />
        )
    }


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
                            {renderEditor()}
                        </div>
                    </React.Fragment>
                </Collapse>
                :
                hoverFijo ?
                    <div style={{ marginTop: "1em", cursor: "default" }} className="editorText" >
                        {renderEditor()}
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
            {draftModal &&
                <Dialog
                    open={draftModal}
                    maxWidth={false}
                    onClose={closeDraftModal}
                >
                    <DialogTitle>{translate.load_draft}</DialogTitle>
                    <DialogContent style={{ width: "800px" }}>
                        <LoadDraft
                            translate={translate}
                            companyId={actData.data.council.companyId}
                            loadDraft={loadDraft}
                            statute={actData.data.council.statute}
                            statutes={actData.data.companyStatutes}
                            //draftType={state.draftType}
                        />
                    </DialogContent>
                </Dialog>
            }
        </div>
    )
}


export const CajaBorderIzq = ({ colorBorder, children, addItem, itemInfo, icon, stylesBody, borrar, removeBlock, id }) => {

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
                                    <i className="fa fa-trash-o" style={{ cursor: "pointer", color: colorBorder }} onClick={() => removeBlock(id)}>
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

export default withSharedProps()(Block);