import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { CardPageLayout, TextInput, Scrollbar, SelectInput } from '../../../displayComponents';
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

export default withTranslations()(withApollo(FileLibrosOfi));