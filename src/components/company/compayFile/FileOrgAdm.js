import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { CardPageLayout, TextInput, Scrollbar, SelectInput } from '../../../displayComponents';
import MenuSuperiorTabs from '../../dashboard/MenuSuperiorTabs';
import withTranslations from '../../../HOCs/withTranslations';
import { Icon, MenuItem, Card, CardHeader, IconButton } from 'material-ui';
import { getPrimary } from '../../../styles/colors';
import { Collapse } from 'material-ui';



const FileOrgAdm = ({ translate, ...props }) => {
    const [state, setState] = React.useState({
        filterText: ""
    });
    const [modal, setModal] = React.useState(false);
    const [selecteOptionMenu, setSelecteOptionMenu] = React.useState('Informacion');
    const [expandedCard, setExpandedCard] = React.useState(false);
    const [expanded, setExpanded] = React.useState(false);
    // necesito council
    console.log(props)
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


export default withTranslations()(withApollo(FileOrgAdm));