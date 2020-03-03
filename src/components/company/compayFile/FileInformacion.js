import React from 'react';
import { withApollo } from 'react-apollo';
import { TextInput, Scrollbar, BasicButton, Grid, GridItem } from '../../../displayComponents';
import withTranslations from '../../../HOCs/withTranslations';
import { Icon } from 'material-ui';
import { getPrimary } from '../../../styles/colors';


const FileInformacion = ({ translate, data, ...props }) => {
    const [state, setState] = React.useState({
        filterText: ""
    });
    const primary = getPrimary();

    //TRADUCCION
    return (
        <div style={{ height: "100%" }}>
            <div style={{ padding: "0.5em", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                    {/*<BasicButton
                        text={
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <div><i className="fa fa-plus-circle" style={{ color: primary, paddingRight: "5px", fontSize: "16px" }}></i></div>
                                <div style={{ color: primary, fontWeight: "bold" }} >{translate.add}</div>
                            </div>
                        }
                        //onClick={this.toggle}
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
                    /> */}
                </div>
            </div>
            <div style={{ padding: '0px 1em 1em', height: 'calc( 100% - 7em )', }}>
                <Scrollbar >
                    <div style={{ height: "100%" }}>
                        <div style={{
                            padding: "1em"
                        }}>
                            <Grid style={{ marginTop: '0.6em' }}>
                                <GridItem xs={12} md={8} lg={8} style={{ display: "flex" }}>
                                    <div style={{
                                        color: primary,
                                        width: '125px',
                                        fontWeight: "bold",
                                        marginRight: '1em'
                                    }}>
                                        Denominación
                                    </div>
                                    <div style={{
                                        color: "black",
                                    }}>
                                        {data.businessName}
                                    </div>
                                </GridItem>
                            </Grid>
                        </div>
                        <DividerContenido />
                        <div style={{
                            padding: "1em"
                        }}>
                            <Grid style={{ display: "flex" }}>
                                <GridItem xs={12} md={8} lg={8} style={{ display: "flex" }}>
                                    <div style={{
                                        width: "125px",
                                        color: primary,
                                        fontWeight: "bold"
                                    }}>
                                        Domicilio Social
                                    </div>
                                    <div style={{
                                        color: "black",
                                    }}>
                                        {data.street}
                                    </div>
                                </GridItem>
                                <GridItem xs={12} md={4} lg={4} style={{ display: "flex" }}>
                                    <div style={{
                                        color: primary,
                                        width: '75px',
                                        fontWeight: "bold"
                                    }}>
                                        NIF
                                    </div>
                                    <div>
                                        {data.tin}
                                    </div>
                                </GridItem>
                            </Grid>
                            <Grid style={{ marginTop: '0.6em' }}>
                                <GridItem xs={12} md={8} lg={8} style={{ display: "flex" }}>
                                    <div style={{
                                        color: primary,
                                        width: '125px',
                                        fontWeight: "bold",
                                        marginRight: '1em'
                                    }}>
                                        Capital social
                                    </div>
                                    <div style={{
                                        color: "black",
                                    }}>
                                        {data.street}
                                    </div>
                                </GridItem>
                                <GridItem xs={12} md={4} lg={4} style={{ display: "flex" }}>
                                    <div style={{
                                        color: primary,
                                        width: '75px',
                                        fontWeight: "bold"
                                    }}>
                                        CNAE
                                    </div>
                                    <div>
                                        2651
                                    </div>
                                </GridItem>
                            </Grid>
                        </div>
                        <DividerContenido />
                        <div style={{
                            padding: "1em"
                        }}>
                            <Grid style={{ marginTop: '0.6em' }}>
                                <GridItem xs={12} md={8} lg={8} style={{ display: "flex" }}>
                                    <div style={{
                                        color: primary,
                                        width: '125px',
                                        fontWeight: "bold",
                                        marginRight: '1em'
                                    }}>
                                        {translate.constitution}
                                    </div>
                                    <div style={{
                                        color: "black",
                                    }}>
                                        1)
                                    </div>
                                </GridItem>
                            </Grid>
                            <Grid style={{ marginTop: '0.6em' }}>
                                <GridItem xs={12} md={8} lg={8} style={{ display: "flex" }}>
                                    <div style={{
                                        color: primary,
                                        width: '125px',
                                        fontWeight: "bold",
                                        marginRight: '1em'
                                    }}>
                                        Adaptación
                                    </div>
                                    <div style={{
                                        color: "black",
                                    }}>
                                        1)
                                    </div>
                                </GridItem>
                            </Grid>
                            <Grid style={{ marginTop: '0.6em' }}>
                                <GridItem xs={12} md={8} lg={8} style={{ display: "flex" }}>
                                    <div style={{
                                        color: primary,
                                        width: '125px',
                                        fontWeight: "bold",
                                        marginRight: '1em'
                                    }}>
                                        Transformación
                                    </div>
                                    <div style={{
                                        color: "black",
                                    }}>
                                        1)
                                    </div>
                                </GridItem>
                            </Grid>
                            <Grid style={{ marginTop: '0.6em' }}>
                                <GridItem xs={12} md={8} lg={8} style={{ display: "flex" }}>
                                    <div style={{
                                        color: primary,
                                        width: '125px',
                                        fontWeight: "bold",
                                        marginRight: '1em'
                                    }}>
                                        Traslado domicilio social
                                    </div>
                                    <div style={{
                                        color: "black",
                                    }}>
                                        1)
                                    </div>
                                </GridItem>
                            </Grid>
                        </div>
                        <DividerContenido />
                        <div style={{
                            padding: "1em"
                        }}>
                            <Grid style={{ marginTop: '0.6em' }}>
                                <GridItem xs={12} md={8} lg={8} style={{ display: "flex" }}>
                                    <div style={{
                                        color: primary,
                                        width: '125px',
                                        fontWeight: "bold",
                                        marginRight: '1em'
                                    }}>
                                        Ejercicio social
                                    </div>
                                    <div style={{
                                        color: "black",
                                    }}>
                                        1)
                                    </div>
                                </GridItem>
                            </Grid>
                        </div>
                    </div>
                </Scrollbar>
            </div>
        </div>
    )

}

const DividerContenido = ({ titulo, contenido }) => {
    return (
        <div style={{ borderBottom: `1px solid ${getPrimary()}` }}></div>
    )
}

export default withTranslations()(withApollo(FileInformacion));