import React from 'react';
import { withApollo } from 'react-apollo';
import { Scrollbar, BasicButton, Grid, GridItem } from '../../../displayComponents';
import withTranslations from '../../../HOCs/withTranslations';
import { getPrimary } from '../../../styles/colors';
import ContentEditable from 'react-contenteditable';


const FileInformacion = ({ translate, data, updateCompanyData, updateCompanyFile, updateCompany, updateFileData, ...props }) => {
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
            <div style={{ padding: '0px 1em 1em', height: '100%', }}>
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
                                        <ContentEditable
                                            html={data.businessName}
                                            onChange={event => {
                                                updateCompanyData({
                                                    businessName: event.target.value
                                                })
                                            }}
                                        />
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
                                        fontWeight: "bold",
                                        marginRight: '1em'
                                    }}>
                                        Domicilio Social
                                    </div>
                                    <ContentEditable
                                        style={{ color: 'black '}}
                                        html={data.address}
                                        onChange={event => {
                                            updateCompanyData({
                                                address: event.target.value
                                            })
                                        }}
                                    />
                                </GridItem>
                                <GridItem xs={12} md={4} lg={4} style={{ display: "flex" }}>
                                    <div style={{
                                        color: primary,
                                        width: '75px',
                                        fontWeight: "bold"
                                    }}>
                                        NIF
                                    </div>
                                    <ContentEditable
                                        html={data.tin}
                                        disabled={true}
                                    />
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
                                    <ContentEditable
                                        style={{ color: 'black', minWidth: '10em'}}
                                        html={data.file.socialCapital || ''}
                                        onChange={event => {
                                            updateFileData({
                                                socialCapital: event.target.value
                                            })
                                        }}
                                    />
                                </GridItem>
                                <GridItem xs={12} md={4} lg={4} style={{ display: "flex" }}>
                                    <div style={{
                                        color: primary,
                                        width: '75px',
                                        fontWeight: "bold"
                                    }}>
                                        CNAE
                                    </div>
                                    <ContentEditable
                                        style={{ color: 'black', minWidth: '10em'}}
                                        html={data.file.CNAE || ''}
                                        onChange={event => {
                                            updateFileData({
                                                CNAE: event.target.value
                                            })
                                        }}
                                    />
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
                                    <ContentEditable
                                        style={{ color: 'black', minWidth: '10em'}}
                                        html={data.file.constitution || ''}
                                        onChange={event => {
                                            updateFileData({
                                                constitution: event.target.value
                                            })
                                        }}
                                    />
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
                                    <ContentEditable
                                        style={{ color: 'black', minWidth: '10em'}}
                                        html={data.file.adaptation || ''}
                                        onChange={event => {
                                            updateFileData({
                                                adaptation: event.target.value
                                            })
                                        }}
                                    />
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
                                    <ContentEditable
                                        style={{ color: 'black', minWidth: '10em'}}
                                        html={data.file.transformation || ''}
                                        onChange={event => {
                                            updateFileData({
                                                transformation: event.target.value
                                            })
                                        }}
                                    />
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
                                    <ContentEditable
                                        style={{ color: 'black', minWidth: '10em'}}
                                        html={data.file.placeOfBusiness || ''}
                                        onChange={event => {
                                            updateFileData({
                                                placeOfBusiness: event.target.value
                                            })
                                        }}
                                    />
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
                                    <ContentEditable
                                        style={{ color: 'black', minWidth: '10em'}}
                                        html={data.file.financialYear || ''}
                                        onChange={event => {
                                            updateFileData({
                                                financialYear: event.target.value
                                            })
                                        }}
                                    />
                                </GridItem>
                            </Grid>
                        </div>
                        <BasicButton
                            text={translate.save}
                            onClick={updateCompany}
                            floatRight={true}
                        />
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