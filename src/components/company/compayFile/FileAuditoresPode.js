import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { CardPageLayout, TextInput, BasicButton, Scrollbar, DateTimePicker, SelectInput } from '../../../displayComponents';
import MenuSuperiorTabs from '../../dashboard/MenuSuperiorTabs';
import withTranslations from '../../../HOCs/withTranslations';
import { Icon, MenuItem, Card, CardHeader, IconButton } from 'material-ui';
import { getPrimary } from '../../../styles/colors';
import ContentEditable from 'react-contenteditable';



const FileAuditoresPode = props => {
    return (
        <div style={{ height: "100%" }} >
            <div style={{ padding: "0.5em", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
            </div>
            <div style={{ padding: '0px 1em 1em', height: '100%', }}>
                <div style={{ height: "100%", }}>
                    <Scrollbar>
                        <div style={{ width: "100%", padding: "0 1em" }}>
                            <AuditorsForm
                                {...props}
                            />
                            <PowersForm
                                {...props}
                            />
                            <BasicButton
                                text={props.translate.save}
                                loading={props.updateState === 'LOADING'}
                                success={props.updateState === 'SUCCESS'}
                                color={getPrimary()}
                                textStyle={{
                                    color: 'white',
                                    fontWeight: '700'
                                }}
                                onClick={props.updateCompany}
                                floatRight={true}
                            />
                        </div>
                    </Scrollbar>
                </div>
            </div>
        </div>
    )
}

const AuditorsForm = ({ data, updateFileData, translate, ...props}) => {
    const auditors = (data.file && data.file.auditors)? data.file.auditors : [];
    const primary = getPrimary();


    const addRow = () => {
        const newAuditors = [...auditors, { aqui: 'otro'}];
        updateFileData({
            auditors: newAuditors
        })
    }

    const deleteRow = index => {
        let newAuditors = [...auditors];
        newAuditors.splice(index, 1);
        updateFileData({
            auditors: newAuditors
        })
    }

    const updateAuditor = (newData, index) => {
        const list = [...auditors];
        list[index] = {
            ...list[index],
            ...newData
        }

        updateFileData({
            auditors: [...list]
        })
    }



    return (
        <>
            <div style={{}}>
                <div style={{ fontWeight: "bold", color: primary, paddingBottom: "1em", display: "flex", alignItems: "center" }}>
                    Auditores
                    <i
                        className={'fa fa-plus-circle'}
                        onClick={addRow}
                        style={{ color: primary, cursor: "pointer", fontSize: "25px", paddingLeft: "5px" }}
                    />
                </div>
                <div style={{
                    boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)",
                    padding: "1em",
                    idth: "100%",
                    //maxHeight: expandAuditores ? "100%" : "20em",
                    overflow: "hidden",
                    position: "relative",
                    paddingBottom: "2.5em",
                    transition: 'max-height 0.5s'
                }}>
                    <div style={{ width: "100%", display: "flex", }}>
                        <div style={{ height: "100%", width: "100%" }}>
                            <div style={{ display: "flex", width: "100%", padding: '1em', borderBottom: "1px solid" + primary, }}>
                                <div style={{ textTransform: 'uppercase', color: primary, width: "20%",  }}>{translate.name}</div>
                                <div style={{ textTransform: 'uppercase', color: primary, width: "25%",  }}>Inscripción en el registro mercantil</div>
                                <div style={{ textTransform: 'uppercase', color: primary, width: "20%",  }}>Fecha Nomb.</div>
                                <div style={{ textTransform: 'uppercase', color: primary, width: "20%",  }}>Fecha Caducidad</div>
                            </div>
                            {auditors.length > 0?
                                auditors.map((auditor, index) => (
                                    <div style={{ color: "black", display: "flex", width: "100%", padding: '1em' }}>
                                        <div style={{ width: "20%", paddingTop: '8px'}}>
                                            <ContentEditable
                                                style={{ color: 'black', maxWidth: '90%', borderBottom: '1px solid black'}}
                                                html={auditor.name || ''}
                                                onChange={event => {
                                                    updateAuditor({
                                                        name: event.target.value
                                                    }, index)
                                                }}
                                            />
                                        </div>
                                        <div style={{ width: "25%", paddingTop: '8px' }}>
                                            <ContentEditable
                                                style={{ color: 'black', maxWidth: '90%', borderBottom: '1px solid black'}}
                                                html={auditor.commercialRegistry || ''}
                                                onChange={event => {
                                                    updateAuditor({
                                                        commercialRegistry: event.target.value
                                                    }, index)
                                                }}
                                            />
                                        </div>
                                        <div style={{ width: "20%" }}>
                                            <div style={{width: '14em'}}>
                                                <DateTimePicker
                                                    format="L"
                                                    onlyDate
                                                    style={{width: '10em'}}
                                                    onChange={date => {
                                                        let dateString = null;
                                                        if(date){
                                                            const newDate = new Date(date);
                                                            dateString = newDate.toISOString();
                                                        }
                                                        updateAuditor({
                                                            nameDate: dateString
                                                        }, index)
                                                    }}
                                                    
                                                    value={auditor.nameDate? auditor.nameDate : null}
                                                />
                                            </div>
                                        </div>
                                        <div style={{ width: "20%" }}>
                                            <div style={{width: '14em'}}>

                                                <DateTimePicker
                                                    format="L"
                                                    style={{width: '10em'}}
                                                    onlyDate
                                                    onChange={date => {
                                                        let dateString = null;
                                                        if(date){
                                                            const newDate = new Date(date);
                                                            dateString = newDate.toISOString();
                                                        }
                                                        updateAuditor({
                                                            expireDate: dateString
                                                        }, index)
                                                    }}
                                                    value={auditor.expireDate? auditor.expireDate : null}
                                                />
                                            </div>
                                        </div>
                                        <div style={{ background: "white", width: "10%", color: primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "25px" }}>
                                            <i className={"fa fa-times-circle"} onClick={() => deleteRow(index)} style={{ cursor: "pointer", }} ></i>
                                        </div>
                                    </div>
                                ))
                            :
                                <div style={{marginTop:'1em'}}>
                                    {translate.no_results}
                                </div>
                            }
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const PowersForm = ({ data, updateFileData, translate, ...props}) => {
    const powers = (data.file && data.file.powers)? data.file.powers : [];
    const primary = getPrimary();

    const addRow = () => {
        const newPowers = [...powers, { aqui: 'otro'}];
        updateFileData({
            powers: newPowers
        })
    }

    const deleteRow = index => {
        let newPowers = [...powers];
        newPowers.splice(index, 1);
        updateFileData({
            powers: newPowers
        })
    }

    const updatePower = (newData, index) => {
        const list = [...powers];
        list[index] = {
            ...list[index],
            ...newData
        }

        updateFileData({
            powers: [...list]
        })
    }



    return (
        <>
            <div style={{ marginTop: "2em", marginBottom: "1em" }}>
                <div style={{ fontWeight: "bold", color: primary, paddingBottom: "1em", display: "flex", alignItems: "center" }}>
                    Poderes
                    <i
                        className={'fa fa-plus-circle'}
                        onClick={addRow}
                        style={{ color: primary, cursor: "pointer", fontSize: "25px", paddingLeft: "5px" }}
                    />
                </div>
                <div style={{
                    boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)",
                    padding: "1em",
                    width: "100%",
                    //maxHeight: expandPoderes ? "100%" : "20em",
                    overflow: "hidden",
                    position: "relative",
                    paddingBottom: "2.5em",
                    transition: 'max-height 0.5s'
                }}>
                    <div style={{ width: "100%", display: "flex", }}>
                        <div style={{ height: "100%", width: "100%" }}>

                        <div style={{ display: "flex", width: "100%", padding: '1em', borderBottom: "1px solid" + primary, }}>
                                <div style={{ textTransform: 'uppercase', color: primary, width: "20%" }}>{translate.name}</div>
                                <div style={{ textTransform: 'uppercase', color: primary, width: "15%" }}>F. Otorgamiento</div>
                                <div style={{ textTransform: 'uppercase', color: primary, width: "20%" }}>Forma ejercicio</div>
                                <div style={{ textTransform: 'uppercase', color: primary, width: "20%" }}>Tipo poder</div>
                                <div style={{ textTransform: 'uppercase', color: primary, width: "20%" }}>Datos registrales</div>
                            </div>
                            {powers.length > 0?
                                powers.map((power, index) => (
                                    <div style={{ color: "black", display: "flex", width: "100%", padding: '1em' }}>
                                        <div style={{ width: "20%", paddingTop: '8px'}}>
                                            <ContentEditable
                                                style={{ color: 'black', maxWidth: '90%', borderBottom: '1px solid black'}}
                                                html={power.name || ''}
                                                onChange={event => {
                                                    updatePower({
                                                        name: event.target.value
                                                    }, index)
                                                }}
                                            />
                                        </div>
                                        <div style={{ width: "15%" }}>
                                            <div style={{width: '10em'}}>
                                                <DateTimePicker
                                                    format="L"
                                                    onlyDate
                                                    style={{width: '10em'}}
                                                    onChange={date => {
                                                        let dateString = null;
                                                        if(date){
                                                            const newDate = new Date(date);
                                                            dateString = newDate.toISOString();
                                                        }
                                                        updatePower({
                                                            grantDate: dateString
                                                        }, index)
                                                    }}
                                                    
                                                    value={power.grantDate? power.grantDate : null}
                                                />
                                            </div>
                                        </div>
                                        <div style={{ width: "20%", paddingTop: '8px'}}>
                                            <ContentEditable
                                                style={{ color: 'black', maxWidth: '90%', borderBottom: '1px solid black'}}
                                                html={power.way || ''}
                                                onChange={event => {
                                                    updatePower({
                                                        way: event.target.value
                                                    }, index)
                                                }}
                                            />
                                        </div>
                                        <div style={{ width: "20%", paddingTop: '8px'}}>
                                            <ContentEditable
                                                style={{ color: 'black', maxWidth: '90%', borderBottom: '1px solid black'}}
                                                html={power.type || ''}
                                                onChange={event => {
                                                    updatePower({
                                                        type: event.target.value
                                                    }, index)
                                                }}
                                            />
                                        </div>
                                        <div style={{ width: "20%", paddingTop: '8px'}}>
                                            <ContentEditable
                                                style={{ color: 'black', maxWidth: '90%', borderBottom: '1px solid black'}}
                                                html={power.data || ''}
                                                onChange={event => {
                                                    updatePower({
                                                        data: event.target.value
                                                    }, index)
                                                }}
                                            />
                                        </div>
                                        <div style={{ background: "white", width: "10%", color: primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "25px" }}>
                                            <i className={"fa fa-times-circle"} onClick={() => deleteRow(index)} style={{ cursor: "pointer", }} ></i>
                                        </div>
                                    </div>
                                ))
                            :
                                <div style={{marginTop:'1em'}}>
                                    {translate.no_results}
                                </div>
                            }                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}





export default withTranslations()(withApollo(FileAuditoresPode));