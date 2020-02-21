import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { CardPageLayout, TextInput, Scrollbar, SelectInput } from '../../../displayComponents';
import MenuSuperiorTabs from '../../dashboard/MenuSuperiorTabs';
import withTranslations from '../../../HOCs/withTranslations';
import { Icon, MenuItem, Card, CardHeader, IconButton } from 'material-ui';
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

const DividerContenido = ({ titulo, contenido }) => {


    return (
        <div style={{ borderBottom: "1px solid" + getPrimary(), }}></div>
    )
}

export default withTranslations()(withApollo(FileInformacion));