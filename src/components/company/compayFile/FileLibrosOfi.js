import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { CardPageLayout, TextInput, Scrollbar, SelectInput, BasicButton } from '../../../displayComponents';
import MenuSuperiorTabs from '../../dashboard/MenuSuperiorTabs';
import withTranslations from '../../../HOCs/withTranslations';
import { Icon, MenuItem, Card, CardHeader, IconButton } from 'material-ui';
import { getPrimary } from '../../../styles/colors';
import { Collapse } from 'material-ui';



const FileLibrosOfi = ({ translate, ...props }) => {
    const [state, setState] = React.useState({
        filterText: ""
    });
    const [modal, setModal] = React.useState(false);
    const [selecteOptionMenu, setSelecteOptionMenu] = React.useState('Informacion');
    const [expandedCard, setExpandedCard] = React.useState(false);
    const [expanded, setExpanded] = React.useState(false);
    // necesito council
    console.log(props)


    const clickMobilExpand = event => {
        setExpandedCard(!expandedCard)
        if (expanded) {
            setExpanded(!expanded)
        }
    }

    return (
        <div style={{ height: "100%" }}>
            <div style={{ padding: "0.5em", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                    {/* <BasicButton
                        text={
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <div><i className="fa fa-plus-circle" style={{ color: getPrimary(), paddingRight: "5px", fontSize: "16px" }}></i></div>
                                <div style={{ color: getPrimary(), fontWeight: "bold" }} >{translate.add}</div>
                            </div>
                        }
                        //onClick={this.toggle}
                        backgroundColor={{ background: "white", boxShadow: "none" }}
                    /> */}
                    {/* </BasicButton>
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
                    /> */}
                </div>
            </div>
            <div style={{ padding: '0px 1em 1em', height: 'calc( 100% - 7em )', }}>
                <div style={{ height: "100%", }}>
                    <div style={{ padding: "0 1em", fontWeight: "bold", color: getPrimary(), display: "flex", justifyContent: "space-between", paddingLeft: '24px', paddingRight: '24px' }}>
                        <div style={{ width: '15%', display: "flex", cursor: 'pointer' }} onClick={() => alert('add minutes book')}>
                            <div style={{ border: "1px solid" + getPrimary(), padding: "0.6em 5px", display: 'flex' }}>
                                Libros de Actas
                                <div><i className="fa fa-plus-circle" style={{ color: getPrimary(), paddingRight: "5px", marginLeft: '5px', fontSize: "16px" }}></i></div>
                            </div>
                        </div>
                        <div style={{ width: '15%' }}>F. Apertura</div>
                        <div style={{ width: '15%' }}>F. Cierre</div>
                        <div style={{ width: '15%' }}>F. legalización</div>
                        <div style={{ width: '15%' }}>F. Devolución</div>
                        <div style={{ width: '15%' }}>Comentarios</div>
                    </div>
                    <Scrollbar>
                        <div style={{ width: "100%", height: "calc( 100% - 3em )", padding: "0 1em" }}>
                            <div>
                                <Card style={{ marginTop: "1em" }}>
                                    <div style={{ position: "relative" }}>
                                        <div style={{ color: 'black', display: "flex", justifyContent: "space-between", color: "black", fontSize: "15px", paddingLeft: '24px', paddingRight: '24px', paddingTop: "3em", paddingBottom: "3em" }}>
                                            <div style={{ width: '15%' }}>Libro de Actas</div>
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
                        </div>
                    </Scrollbar>
                </div>
            </div>
        </div>
    )

}

export default withTranslations()(withApollo(FileLibrosOfi));