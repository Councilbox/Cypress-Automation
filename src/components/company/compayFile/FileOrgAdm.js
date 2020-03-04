import React from 'react';
import { withApollo } from 'react-apollo';
import { Scrollbar, BasicButton } from '../../../displayComponents';
import withTranslations from '../../../HOCs/withTranslations';
import GoverningBodyForm from '../settings/GoverningBodyForm';



const FileOrgAdm = ({ translate, data, updateCompanyData, updateCompany, ...props }) => {
    return (
        <div style={{ height: "100%" }}>
            <div style={{ padding: "0.5em", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                {/* <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
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
                </div> */}
            </div>
            <div style={{ padding: '0px 1em 1em', height: 'calc( 100% - 7em )', }}>
                <div style={{ height: "100%", }}>
                    <Scrollbar>
                        <div style={{ width: "100%", height: "100%", padding: "0 1em" }}>
                            <GoverningBodyForm translate={translate} state={data} updateState={updateCompanyData} />
                        </div>
                        <BasicButton
                            text={translate.save}
                            onClick={updateCompany}
                        />
                    </Scrollbar>
                </div>
            </div>
        </div>
    )
}


export default withTranslations()(withApollo(FileOrgAdm));


/*
<div style={{ height: "10em", boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)", padding: "1em", width: "100%" }}>
                                <div style={{ height: "calc( 100% - 2em )", width: "100%", display: "flex", }}>
                                    <div style={{ height: "100%", width: "100%" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: '1em' }}>
                                            <div style={{ textTransform: 'uppercase', color: primary, width: "25%" }}>Nombre</div>
                                            <div style={{ textTransform: 'uppercase', color: primary, width: "25%" }}>Nif</div>
                                            <div style={{ textTransform: 'uppercase', color: primary, width: "25%" }}>e-Mail</div>
                                            <div style={{ textTransform: 'uppercase', color: primary, width: "25%" }}>Teléfono</div>
                                        </div>
                                        <div style={{ color: "black", display: "flex", justifyContent: "space-between", borderBottom: "1px solid" + primary, width: "100%", padding: '1em' }}>
                                            <div style={{ width: "25%" }}>Aaron Fuentes</div>
                                            <div style={{ width: "25%" }}>2323432424V</div>
                                            <div style={{ width: "25%" }}>aaron-fuentes@cocodin.com</div>
                                            <div style={{ width: "25%" }}>66666</div>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "8em" }}>
                                        <i className={'fa fa-plus-circle'} style={{ color: primary, fontSize: '35px', cursor: "pointer" }}></i>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: "2em", height: "100%" }}>
                                <div style={{ fontWeight: "bold", color: primary, paddingBottom: "1em" }}>
                                    Administradores
                                </div>
                                <div
                                    style={{
                                        height: "calc( 100% - 10em )",
                                        boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)",
                                        padding: "1em",
                                        width: "100%",
                                        maxHeight: expandAdministradores ? "100%" : "20em",
                                        overflow: "hidden",
                                        position: "relative",
                                        paddingBottom: "2.5em",
                                        transition: 'max-height 0.5s'
                                    }}
                                >
                                    <div style={{ height: "calc( 100% - 2em )", width: "100%", display: "flex", }}>
                                        <div style={{ height: "100%", width: "100%" }}>
                                            <div style={{ color: "black", display: "flex", justifyContent: "space-between", borderBottom: "1px solid" + primary, width: "100%", padding: '1em' }}>
                                                <div style={{ textTransform: 'uppercase', color: primary, width: "25%" }}>Nombre</div>
                                                <div style={{ width: "25%" }}>Aaron</div>
                                                <div style={{ width: "25%" }}>Aaron</div>
                                                <div style={{ width: "25%" }}>Aaron</div>
                                            </div>
                                            <div style={{ color: "black", display: "flex", justifyContent: "space-between", borderBottom: "1px solid" + primary, width: "100%", padding: '1em' }}>
                                                <div style={{ textTransform: 'uppercase', color: primary, width: "25%" }}>Nif</div>
                                                <div style={{ width: "25%" }}>Aaron</div>
                                                <div style={{ width: "25%" }}>Aaron</div>
                                                <div style={{ width: "25%" }}>Aaron</div>
                                            </div>
                                            <div style={{ color: "black", display: "flex", justifyContent: "space-between", borderBottom: "1px solid" + primary, width: "100%", padding: '1em' }}>
                                                <div style={{ textTransform: 'uppercase', color: primary, width: "25%" }}>CARGO</div>
                                                <div style={{ width: "25%" }}>Aaron</div>
                                                <div style={{ width: "25%" }}>Aaron</div>
                                                <div style={{ width: "25%" }}>Aaron</div>
                                            </div>
                                            <div style={{ color: "black", display: "flex", justifyContent: "space-between", borderBottom: "1px solid" + primary, width: "100%", padding: '1em' }}>
                                                <div style={{ textTransform: 'uppercase', color: primary, width: "25%" }}>DOMICILIO</div>
                                                <div style={{ width: "25%" }}>Aaron</div>
                                                <div style={{ width: "25%" }}>Aaron</div>
                                                <div style={{ width: "25%" }}>Aaron</div>
                                            </div>
                                            <div style={{ color: "black", display: "flex", justifyContent: "space-between", borderBottom: "1px solid" + primary, width: "100%", padding: '1em' }}>
                                                <div style={{ textTransform: 'uppercase', color: primary, width: "25%" }}>FECHA NOMBRAMIENTO</div>
                                                <div style={{ width: "25%" }}>Aaron</div>
                                                <div style={{ width: "25%" }}>Aaron</div>
                                                <div style={{ width: "25%" }}>Aaron</div>
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "8em" }}>
                                            <i className={'fa fa-plus-circle'} style={{ color: primary, fontSize: '35px', cursor: "pointer" }}></i>
                                        </div>
                                    </div>
                                    <div style={{ left: "0", background: "white", width: "100%", color: primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", position: "absolute", bottom: "0" }}>
                                        <i className={expandAdministradores ? "fa fa-angle-up" : "fa fa-angle-down"} onClick={() => setExpandAdministradores(!expandAdministradores)} style={{ cursor: "pointer" }}></i>
                                    </div>
                                </div>
                            </div>

*/