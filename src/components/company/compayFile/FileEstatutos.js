import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { CardPageLayout, TextInput, Scrollbar, SelectInput } from '../../../displayComponents';
import MenuSuperiorTabs from '../../dashboard/MenuSuperiorTabs';
import withTranslations from '../../../HOCs/withTranslations';
import { Icon, MenuItem, Card, CardHeader, IconButton } from 'material-ui';
import { getPrimary } from '../../../styles/colors';
import { Collapse } from 'material-ui';



const FileCompany = ({ translate, ...props }) => {
    const [state, setState] = React.useState({
        filterText: ""
    });
    const [modal, setModal] = React.useState(false);
    const [selecteOptionMenu, setSelecteOptionMenu] = React.useState('Informacion');
    const [expandedCard, setExpandedCard] = React.useState(false);
    const [expanded, setExpanded] = React.useState(false);
    // necesito council
    console.log(props)

    const getInformacion = () => {

        return (
            <Scrollbar >

                <div style={{ height: "100%" }}>
                    <div style={{
                        padding: "1em"
                    }}>
                        <div style={{ display: "flex" }} >
                            <div style={{
                                width: "25%",
                                color: getPrimary(),
                                fontWeight: "bold"
                            }}>
                                Denominación
                </div>
                            <div style={{
                                color: "black",
                            }}>
                                Olivo Ventures Limited SL Sociedad Unipersonal
                </div>
                        </div>
                    </div>
                    <DividerContenido />
                    <div style={{
                        padding: "1em"
                    }}>
                        <div style={{ display: "flex" }} >
                            <div style={{
                                width: "25%",
                                color: getPrimary(),
                                fontWeight: "bold"
                            }}>
                                Denominación
                </div>
                            <div style={{
                                color: "black",
                            }}>
                                Olivo Ventures Limited SL Sociedad Unipersonal
                </div>
                        </div>
                    </div>
                    <DividerContenido />
                </div>

            </Scrollbar>
        )
    }

    const OrgAdministracion = () => {

        return (
            <div style={{ height: "100%", }}>
                <Scrollbar>
                    <div style={{}}>
                        <div style={{ fontWeight: "bold", color: getPrimary() }}>
                            Órgano de gobierno
                    </div>
                        <div style={{ display: "flex" }}>
                            <SelectInput
                                styles={{ width: "300px" }}
                            >
                                <MenuItem value={1}>1</MenuItem>
                            </SelectInput>
                        </div>
                    </div>
                    <div style={{ height: "10em", boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)", padding: "1em", width: "100%" }}>
                        <div style={{ height: "calc( 100% - 2em )", width: "100%", display: "flex", }}>
                            <div style={{ height: "100%", width: "100%" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: '1em' }}>
                                    <div style={{ textTransform: 'uppercase', color: getPrimary(), width: "25%" }}>Nombre</div>
                                    <div style={{ textTransform: 'uppercase', color: getPrimary(), width: "25%" }}>Nif</div>
                                    <div style={{ textTransform: 'uppercase', color: getPrimary(), width: "25%" }}>e-Mail</div>
                                    <div style={{ textTransform: 'uppercase', color: getPrimary(), width: "25%" }}>Teléfono</div>
                                </div>
                                <div style={{ color: "black", display: "flex", justifyContent: "space-between", borderBottom: "1px solid" + getPrimary(), width: "100%", padding: '1em' }}>
                                    <div style={{ width: "25%" }}>Aaron Fuentes</div>
                                    <div style={{ width: "25%" }}>2323432424V</div>
                                    <div style={{ width: "25%" }}>aaron-fuentes@cocodin.com</div>
                                    <div style={{ width: "25%" }}>66666</div>
                                </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "8em" }}>
                                <i className={'fa fa-plus-circle'} style={{ color: getPrimary(), fontSize: '35px', cursor: "pointer" }}></i>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: "2em", height: "100%" }}>
                        <div style={{ fontWeight: "bold", color: getPrimary(), paddingBottom: "1em" }}>
                            Administradores
                    </div>
                        <div style={{ height: "calc( 100% - 10em )", boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)", padding: "1em", width: "100%" }}>
                            <div style={{ height: "calc( 100% - 2em )", width: "100%", display: "flex", }}>
                                <div style={{ height: "100%", width: "100%" }}>
                                    <Scrollbar>
                                        <div style={{ color: "black", display: "flex", justifyContent: "space-between", borderBottom: "1px solid" + getPrimary(), width: "100%", padding: '1em' }}>
                                            <div style={{ textTransform: 'uppercase', color: getPrimary(), width: "25%" }}>Nombre</div>
                                            <div style={{ width: "25%" }}>Aaron</div>
                                            <div style={{ width: "25%" }}>Aaron</div>
                                            <div style={{ width: "25%" }}>Aaron</div>
                                        </div>
                                        <div style={{ color: "black", display: "flex", justifyContent: "space-between", borderBottom: "1px solid" + getPrimary(), width: "100%", padding: '1em' }}>
                                            <div style={{ textTransform: 'uppercase', color: getPrimary(), width: "25%" }}>Nif</div>
                                            <div style={{ width: "25%" }}>Aaron</div>
                                            <div style={{ width: "25%" }}>Aaron</div>
                                            <div style={{ width: "25%" }}>Aaron</div>
                                        </div>
                                        <div style={{ color: "black", display: "flex", justifyContent: "space-between", borderBottom: "1px solid" + getPrimary(), width: "100%", padding: '1em' }}>
                                            <div style={{ textTransform: 'uppercase', color: getPrimary(), width: "25%" }}>CARGO</div>
                                            <div style={{ width: "25%" }}>Aaron</div>
                                            <div style={{ width: "25%" }}>Aaron</div>
                                            <div style={{ width: "25%" }}>Aaron</div>
                                        </div>
                                        <div style={{ color: "black", display: "flex", justifyContent: "space-between", borderBottom: "1px solid" + getPrimary(), width: "100%", padding: '1em' }}>
                                            <div style={{ textTransform: 'uppercase', color: getPrimary(), width: "25%" }}>DOMICILIO</div>
                                            <div style={{ width: "25%" }}>Aaron</div>
                                            <div style={{ width: "25%" }}>Aaron</div>
                                            <div style={{ width: "25%" }}>Aaron</div>
                                        </div>
                                        <div style={{ color: "black", display: "flex", justifyContent: "space-between", borderBottom: "1px solid" + getPrimary(), width: "100%", padding: '1em' }}>
                                            <div style={{ textTransform: 'uppercase', color: getPrimary(), width: "25%" }}>FECHA NOMBRAMIENTO</div>
                                            <div style={{ width: "25%" }}>Aaron</div>
                                            <div style={{ width: "25%" }}>Aaron</div>
                                            <div style={{ width: "25%" }}>Aaron</div>
                                        </div>
                                    </Scrollbar >
                                </div>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "8em" }}>
                                    <i className={'fa fa-plus-circle'} style={{ color: getPrimary(), fontSize: '35px', cursor: "pointer" }}></i>
                                </div>
                            </div>
                            <div style={{ width: "100%", color: getPrimary(), display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" }}>
                                <i className={"fa fa-angle-down"} ></i>
                            </div>
                        </div>
                    </div>
                </Scrollbar>
            </div >
        )
    }


    const clickMobilExpand = event => {
        setExpandedCard(!expandedCard)
        if (expanded) {
            setExpanded(!expanded)
        }
    }

    const librosOficiales = () => {

        return (
            <div style={{ height: "100%", }}>
                <div style={{ fontWeight: "bold", color: getPrimary(), display: "flex", justifyContent: "space-between", paddingLeft: '24px', paddingRight: '24px' }}>
                    <div style={{ width: '15%', display: "flex" }}>
                        <div style={{ border: "1px solid" + getPrimary(), padding: "0px 5px" }}>
                            Libros de Actas
                        </div>
                    </div>
                    <div style={{ width: '15%' }}>F. Apertura</div>
                    <div style={{ width: '15%' }}>F. Cierre</div>
                    <div style={{ width: '15%' }}>F. legalización</div>
                    <div style={{ width: '15%' }}>F. Devolución</div>
                    <div style={{ width: '15%' }}>Comentarios</div>
                </div>
                <Scrollbar>
                    <div>
                        <Card style={{ marginTop: "1em" }}>
                            <div style={{ position: "relative" }}>
                                <div style={{ color: 'black', display: "flex", justifyContent: "space-between", color: "black", fontSize: "15px", paddingLeft: '24px', paddingRight: '24px', paddingTop: "3em", paddingBottom: "3em" }}>
                                    <div style={{ width: '15%' }}>Libros de Actas</div>
                                    <div style={{ width: '15%' }}>F. Apertura</div>
                                    <div style={{ width: '15%' }}>F. Cierre</div>
                                    <div style={{ width: '15%' }}>F. legalización</div>
                                    <div style={{ width: '15%' }}>F. Devolución</div>
                                    <div style={{ width: '15%' }}>Comentarios</div>
                                </div>
                                <IconButton
                                    style={{ top: '35px', position: "absolute", right: "2px" }}
                                    onClick={(event) => clickMobilExpand(event)}
                                    aria-expanded={expandedCard}
                                    aria-label="Show more"
                                    className={"expandButtonModal"}
                                >
                                    <i
                                        className={"fa fa-angle-down"}
                                        style={{
                                            color: getPrimary(),
                                            transform: expandedCard ? "rotate(180deg)" : "rotate(0deg)",
                                            transition: "all 0.3s"
                                        }}
                                    />
                                </IconButton>
                            </div>
                            <Collapse in={expandedCard} timeout="auto" unmountOnExit>
                                <div style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: "0em", paddingBottom: "1em" }}>asdasdasdasdasda</div>
                            </Collapse>
                        </Card>
                    </div>
                </Scrollbar>
            </div >
        )
    }

    const auditoresPoderes = () => {

        return (
            <div style={{ height: "100%", }}>
                <Scrollbar>
                    <div style={{}}>
                        <div style={{ fontWeight: "bold", color: getPrimary(), paddingBottom: "1em", display: "flex", alignItems: "center" }}>
                            Auditores
                            <i className={'fa fa-plus-circle'} style={{ color: getPrimary(), cursor: "pointer", fontSize: "25px", paddingLeft: "5px" }}></i>
                        </div>
                        <div style={{ boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)", padding: "1em", width: "100%" }}>
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
                            <div style={{ width: "100%", color: getPrimary(), display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" }}>
                                <i className={"fa fa-angle-down"} ></i>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: "2em", marginBottom: "1em" }}>
                        <div style={{ fontWeight: "bold", color: getPrimary(), paddingBottom: "1em", display: "flex", alignItems: "center" }}>
                            Poderes
                            <i className={'fa fa-plus-circle'} style={{ color: getPrimary(), cursor: "pointer", fontSize: "25px", paddingLeft: "5px" }}></i>
                        </div>
                        <div style={{ boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)", padding: "1em", width: "100%" }}>
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
                            <div style={{ width: "100%", color: getPrimary(), display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" }}>
                                <i className={"fa fa-angle-down"} ></i>
                            </div>
                        </div>
                    </div>

                </Scrollbar>
            </div >
        )
    }
    const estatutos = () => {

        return (
            <div style={{ height: "100%", }}>
                <Scrollbar>
                    <div>
                        <div style={{ borderBottom: "1px solid" + getPrimary(), display: "flex" }}>
                            <div style={{ display: "flex", padding: "1em" }} >
                                <div style={{ marginRight: "1em", color: getPrimary(), fontWeight: "bold" }}>Denominación</div>
                                <div style={{ marginRight: "1em" }}>
                                    Artículo 1 - Denominación social:
                                    La Sociedad se denominará "XXXX, S.L." y se regirá por los presentes Estatutos y por las demás disposiciones legales que le sean aplicables."
                                </div>
                                <div style={{ width: "5em" }}>
                                    <i className={"fa fa-eye"} style={{ color: getPrimary(), }} ></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </Scrollbar>
            </div >
        )
    }

    return (
        <CardPageLayout title={'Ficha de council'} disableScroll avatar={'asdasd'}>
            {/* company.icon */}
            <div style={{ padding: '1em', height: '100%', paddingTop: "0px" }}>
                <div style={{ display: "flex", padding: '1em', justifyContent: "space-between", paddingTop: "0px", alignItems: "center" }}>
                    <div style={{ fontSize: "13px", }}>
                        <MenuSuperiorTabs
                            items={['Informacion', 'Org. Administración', 'Libros oficiales', 'Auditores y Poderes', 'Estatutos', 'Calendario']}
                            setSelect={setSelecteOptionMenu}
                            selected={selecteOptionMenu}
                        />
                    </div>
                </div>
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
                    {selecteOptionMenu === 'Informacion' &&
                        getInformacion()
                    }
                    {selecteOptionMenu === 'Org. Administración' &&
                        OrgAdministracion()
                    }
                    {selecteOptionMenu === 'Libros oficiales' &&
                        librosOficiales()
                    }
                    {selecteOptionMenu === 'Auditores y Poderes' &&
                        auditoresPoderes()
                    }
                    {selecteOptionMenu === 'Estatutos' &&
                        estatutos()
                    }
                </div>
            </div>
        </CardPageLayout>
    )
}

const DividerContenido = ({ titulo, contenido }) => {


    return (
        <div style={{ borderBottom: "1px solid" + getPrimary(), }}></div>
    )
}

export default withTranslations()(withApollo(FileCompany));