import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { CardPageLayout, TextInput, Scrollbar, SelectInput, BasicButton } from '../../../displayComponents';
import MenuSuperiorTabs from '../../dashboard/MenuSuperiorTabs';
import withTranslations from '../../../HOCs/withTranslations';
import { Icon, MenuItem, Card, CardHeader, IconButton, Button } from 'material-ui';
import { getPrimary } from '../../../styles/colors';
import { Collapse } from 'material-ui';



const FileInformacion = ({ translate, ...props }) => {
    const [state, setState] = React.useState({
        filterText: ""
    });
    const [modal, setModal] = React.useState(false);
    const [selecteOptionMenu, setSelecteOptionMenu] = React.useState('Informacion');
    const [expandedCard, setExpandedCard] = React.useState(false);
    const [expanded, setExpanded] = React.useState(false);
    // necesito council

    return (
        <div style={{ height: "100%" }}>
            <div style={{ padding: "0.5em", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                    <BasicButton
                        text={
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <div><i className="fa fa-plus-circle" style={{ color: getPrimary(), paddingRight: "5px", fontSize: "16px" }}></i></div>
                                <div style={{ color: getPrimary(), fontWeight: "bold" }} >{translate.add}</div>
                            </div>
                        }
                        onClick={this.toggle}
                        backgroundColor={{ background: "white", boxShadow: "none" }}
                    >
                    </BasicButton>
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
            </div>
        </div>
    )

}

const DividerContenido = ({ titulo, contenido }) => {


    return (
        <div style={{ borderBottom: "1px solid" + getPrimary(), }}></div>
    )
}

export default withTranslations()(withApollo(FileInformacion));