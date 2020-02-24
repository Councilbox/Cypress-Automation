import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { CardPageLayout, TextInput, Scrollbar, SelectInput } from '../../../displayComponents';
import MenuSuperiorTabs from '../../dashboard/MenuSuperiorTabs';
import withTranslations from '../../../HOCs/withTranslations';
import { Icon, MenuItem, Card, CardHeader, IconButton } from 'material-ui';
import { getPrimary } from '../../../styles/colors';
import { Collapse } from 'material-ui';



const FileAuditoresPode = ({ translate, ...props }) => {
    const [state, setState] = React.useState({
        filterText: ""
    });
    const [expandAuditores, setExpandAuditores] = React.useState(false)
    const [expandPoderes, setExpandPoderes] = React.useState(false)


    return (
        <div style={{ height: "100%" }} >
            <div style={{ padding: "0.5em", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                    <div style={{ padding: "0px 8px", fontSize: "24px", color: "#c196c3" }}>
                        <i className="fa fa-filter"></i>
                    </div>
                    <TextInput
                        placeholder={translate.search}
                        adornment={<Icon style={{ background: "#f0f3f6", paddingLeft: "5px", height: '100%', display: "flex", alignItems: "center", justifyContent: "center" }}>search</Icon>}
                        type="text"
                        value={state.filterText || ""}
                        styleInInput={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.54)", background: "#f0f3f6", marginLeft: "0", paddingLeft: "8px" }}
                        disableUnderline={true}
                        stylesAdornment={{ background: "#f0f3f6", marginLeft: "0", paddingLeft: "8px" }}
                        onChange={event => {
                            setState({
                                ...state,
                                filterText: event.target.value
                            })
                        }}
                    />
                </div>
            </div>
            <div style={{ padding: '0px 1em 1em', height: 'calc( 100% - 7em )', }}>
                <div style={{ height: "100%", }}>
                    <Scrollbar>
                        <div style={{ width: "100%", height: "100%", padding: "0 1em" }}>
                            <div style={{}}>
                                <div style={{ fontWeight: "bold", color: getPrimary(), paddingBottom: "1em", display: "flex", alignItems: "center" }}>
                                    Auditores
                            <i className={'fa fa-plus-circle'} style={{ color: getPrimary(), cursor: "pointer", fontSize: "25px", paddingLeft: "5px" }}></i>
                                </div>
                                <div style={{
                                    boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)",
                                    padding: "1em",
                                    idth: "100%",
                                    maxHeight: expandAuditores ? "100%" : "20em",
                                    overflow: "hidden",
                                    position: "relative",
                                    paddingBottom: "2.5em",
                                    transition: 'max-height 0.5s'
                                }}>
                                    <div style={{ width: "100%", display: "flex", }}>
                                        <div style={{ height: "100%", width: "100%" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: '1em', borderBottom: "1px solid" + getPrimary(), }}>
                                                <div style={{ textTransform: 'uppercase', color: getPrimary(), width: "25%" }}>Nombre</div>
                                                <div style={{ textTransform: 'uppercase', color: getPrimary(), width: "25%" }}>Inscripción en el registro mercantil</div>
                                                <div style={{ textTransform: 'uppercase', color: getPrimary(), width: "25%" }}>Fecha Nomb.</div>
                                                <div style={{ textTransform: 'uppercase', color: getPrimary(), width: "25%" }}>Fecha Caducidad</div>
                                            </div>
                                            <div style={{ color: "black", display: "flex", justifyContent: "space-between", width: "100%", padding: '1em' }}>
                                                <div style={{ width: "25%", marginRight: "0.5em" }}>DELOITTE, S.L.</div>
                                                <div style={{ width: "25%", marginRight: "0.5em" }}>
                                                    1) CERTIF SU - Reelección de auditores de [●] con firma(s) legitimada(s) por el notario de Barcelona D. [●] el [●]
                                                    2) Datos registrales: Registro Mercantil de Barcelona, Tomo: [●], Folio: [●], Hoja: B-[●], Nº inscripción: [●], Fecha inscripción: [●]
                                                </div>
                                                <div style={{ width: "25%", marginRight: "0.5em" }}>27/10/2004 </div>
                                                <div style={{ width: "25%" }}>27/10/2014</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ left: "0", background: "white", width: "100%", color: getPrimary(), display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", position: "absolute", bottom: "0" }}>
                                        <i className={expandAuditores ? "fa fa-angle-up" : "fa fa-angle-down"} onClick={() => setExpandAuditores(!expandAuditores)} style={{ cursor: "pointer", }} ></i>
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginTop: "2em", marginBottom: "1em" }}>
                                <div style={{ fontWeight: "bold", color: getPrimary(), paddingBottom: "1em", display: "flex", alignItems: "center" }}>
                                    Poderes
                            <i className={'fa fa-plus-circle'} style={{ color: getPrimary(), cursor: "pointer", fontSize: "25px", paddingLeft: "5px" }}></i>
                                </div>
                                <div style={{
                                    boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)",
                                    padding: "1em",
                                    width: "100%",
                                    maxHeight: expandPoderes ? "100%" : "20em",
                                    overflow: "hidden",
                                    position: "relative",
                                    paddingBottom: "2.5em",
                                    transition: 'max-height 0.5s'
                                }}>
                                    <div style={{ width: "100%", display: "flex", }}>
                                        <div style={{ height: "100%", width: "100%" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: '1em', borderBottom: "1px solid" + getPrimary(), }}>
                                                <div style={{ textTransform: 'uppercase', color: getPrimary(), width: "20%" }}>NOMBRE</div>
                                                <div style={{ textTransform: 'uppercase', color: getPrimary(), width: "20%" }}>F. Otorgamiento</div>
                                                <div style={{ textTransform: 'uppercase', color: getPrimary(), width: "20%" }}>Forma ejercicio</div>
                                                <div style={{ textTransform: 'uppercase', color: getPrimary(), width: "20%" }}>Tipo poder</div>
                                                <div style={{ textTransform: 'uppercase', color: getPrimary(), width: "20%" }}>Datos registrales</div>
                                            </div>
                                            <div style={{ color: "black", display: "flex", justifyContent: "space-between", width: "100%", padding: '1em', position: "relative" }}>
                                                <div style={{ width: "20%", marginRight: "0.5em" }}>Ana Fuentes</div>
                                                <div style={{ width: "20%", marginRight: "0.5em" }}> 27/10/2004 </div>
                                                <div style={{ width: "20%", marginRight: "0.5em" }}>Solidariamente</div>
                                                <div style={{ width: "20%" }}>P. tributarios</div>
                                                <div style={{ width: "20%" }}>
                                                    1) Escritura de revocación de poderes otorgados …
                                                </div>
                                                <div style={{ color: getPrimary(), position: "absolute", right: "0" }}>
                                                    <i className={"fa fa-eye"} ></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ left: "0", background: "white", width: "100%", color: getPrimary(), display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", position: "absolute", bottom: "0" }}>
                                        <i className={expandPoderes ? "fa fa-angle-up" : "fa fa-angle-down"} onClick={() => setExpandPoderes(!expandPoderes)} style={{ cursor: "pointer" }}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Scrollbar>
                </div >
            </div >
        </div >
    )
}



export default withTranslations()(withApollo(FileAuditoresPode));