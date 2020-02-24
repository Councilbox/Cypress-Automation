import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { CardPageLayout, TextInput, Scrollbar, SelectInput, DropDownMenu, Table } from '../../../displayComponents';
import MenuSuperiorTabs from '../../dashboard/MenuSuperiorTabs';
import withTranslations from '../../../HOCs/withTranslations';
import { Icon, MenuItem, Card, CardHeader, IconButton, TableHead, TableRow, TableCell, TableBody } from 'material-ui';
import { getPrimary, primary } from '../../../styles/colors';
import { Collapse } from 'material-ui';
import Calendar from 'react-calendar';
import { moment } from '../../../containers/App';



const FileCalendario = ({ translate, ...props }) => {
    const [state, setState] = React.useState({
        filterText: ""
    });
    const [modal, setModal] = React.useState(false);
    const [selecteOptionMenu, setSelecteOptionMenu] = React.useState('Informacion');
    const [expandedCard, setExpandedCard] = React.useState(false);
    const [expanded, setExpanded] = React.useState(false);
    // necesito council
    console.log(props)

    // const changeMonthBack = () => {
    //     setDay(false)
    //     let fechaInicio = moment(fechaBusqueda).subtract(1, 'months').startOf('month');
    //     let fechaFin = moment(fechaBusqueda).subtract(1, 'months').endOf('month');
    //     // getReuniones(fechaInicio.toDate(), fechaFin.toDate())
    //     setFechaBusqueda(fechaInicio)
    // }
    // const changeMonthFront = () => {
    //     setDay(false)
    //     let fechaInicio = moment(fechaBusqueda).add(1, 'months').startOf('month');
    //     let fechaFin = moment(fechaBusqueda).add(1, 'months').endOf('month');
    //     // getReuniones(fechaInicio.toDate(), fechaFin.toDate())
    //     setFechaBusqueda(fechaInicio)
    // }

    const getTileClassName = ({ date }) => {
        console.log(date)
        // if (reuniones.length > 0) {
        //     let array = reuniones.find(reunion => {
        //         return moment(reunion.dateStart).format("MMM Do YY") === moment(date).format("MMM Do YY");
        //     })
        //     if (array) {
        //         return 'selectedDate';
        //     }
        // }
        return '';
    }

    console.log(translate)

    return (
        <div style={{ height: "100%" }}>
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
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ paddingRight: "1em", fontSize: "22px" }} >
                        {/* onClick={changeMonthBack} */}
                        <i className="fa fa-angle-left" ></i>
                    </div>
                    <DropDownMenu
                        color="transparent"
                        styleComponent={{ width: "" }}
                        Component={() =>
                            <div
                                style={{
                                    borderRadius: '3px',
                                    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)',
                                    padding: "0.5em 1em"
                                }}
                            >
                                <span style={{ color: getPrimary(), fontWeight: "bold" }}>Diciembre</span>
                            </div>
                        }
                        textStyle={{ color: primary }}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        type="flat"
                        items={
                            <div style={{ padding: "0.5em" }}>
                                <Calendar
                                    showNeighboringMonth={false}
                                    // onChange={onChangeDay}
                                    // value={daySelected}
                                    minDetail={'month'}
                                    tileClassName={date => getTileClassName(date)}
                                // onClickDay={(value) => clickDay(value)}
                                />
                            </div>
                        }
                    />
                    <div style={{ paddingLeft: "1em", fontSize: "22px" }} >
                        {/* onClick={changeMonthFront} */}
                        <i className="fa fa-angle-right" >
                        </i>
                    </div>
                </div>
                <div style={{ marginTop: "1em" }}>
                    <div>
                        <Table
                            style={{ width: "100%", maxWidth: "100%" }}
                        >
                            <TableRow>
                                <TableCell style={{ color: getPrimary(), fontWeight: "bold" }}>Fecha límite </TableCell>
                                <TableCell style={{ color: getPrimary(), fontWeight: "bold" }}>Acción</TableCell>
                                <TableCell style={{ color: getPrimary(), fontWeight: "bold" }}>{translate.description}</TableCell>
                                <TableCell style={{ color: getPrimary(), fontWeight: "bold" }}>Status</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ color: "black" }}>01/12/2016</TableCell>
                                <TableCell style={{ color: "black" }}>Auditores, reelección</TableCell>
                                <TableCell style={{ color: "black" }}>
                                    Auditores que caducaron el 31/12/2015, hasta el 31/12/2016 para renovarlos.. ¿Se han renovado?
                                    </TableCell>
                                <TableCell style={{ color: getPrimary() }}>Definitivo</TableCell>
                            </TableRow>
                        </Table>
                    </div>
                </div>
            </div>
        </div >
    )

}

export default withTranslations()(withApollo(FileCalendario));