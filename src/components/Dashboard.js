import React from 'react';
import * as mainActions from '../actions/mainActions';
import * as companyActions from '../actions/companyActions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Grid, Row, Col} from "react-bootstrap";
import { lightGrey, darkGrey, turquoise } from '../styles/colors';
import FontIcon from 'material-ui/FontIcon';
import { RaisedButton } from 'material-ui';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps){
        if(!this.props.company.id && nextProps.company.id){
            this.props.companyActions.getRecount(nextProps.company.id);
        }
    }

    render() {

        return (
            <div style={{overflowY: 'auto', width: '100%', backgroundColor: 'white', padding: 0, height: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column'}} className="container-fluid">
                <div className="row" style={{width: '100%'}}> 
                    <div style={{width: '100%', backgroundColor: lightGrey, display: 'flex', alignItems: 'center', flexDirection: 'column', paddingBottom: '5em'}}> 
                        <div style={{padding: '1em', paddingTop: '2em'}}>Bienvenido a CouncilBox {this.props.user.name}.</div>
                        <div style={{fontWeight: '700', color: darkGrey, padding: '2em', fontSize: '1em', paddingTop: '0.5em'}}>Te recomendamos que comiences revisando la configuración de tu empresa</div>
                        <div style={{width: '90%'}}>
                            <div className="col-lg-3 col-md-6 col-xs-6" style={{margin: 0, padding: 0}}>
                                <div style={{paddingLeft: '1.5em', paddingRight: '1.5em', backgroundColor: darkGrey, height: '10em', color: turquoise, fontWeight: '700', border: `1px solid ${lightGrey}`, paddingRight: '1em', paddingTop: '3em', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                    DATOS BÁSICOS
                                    <FontIcon className="material-icons" color={'grey'} style={{fontSize: '2em', color: 'white'}}>work</FontIcon>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-6 col-xs-6" style={{margin: 0, padding: 0}}>
                                <div style={{paddingLeft: '1em', backgroundColor: darkGrey, height: '10em', color: turquoise, fontWeight: '700', border: `1px solid ${lightGrey}`, paddingRight: '1em', paddingTop: '3em', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                    ESTATUTO
                                    <FontIcon className="material-icons" color={'grey'} style={{fontSize: '2em', color: 'white'}}>gavel</FontIcon>
                                </div>
                                <div style={{display: 'flex', alignItems: 'center', backgroundColor: 'purple', border: `1px solid ${lightGrey}`, color: 'white', fontWeight: '700'}}>
                                    <RaisedButton
                                        label="Revisa tus estatutos"
                                        fullWidth={true}
                                        backgroundColor={'purple'}
                                        style={{width: '90%'}}
                                        labelStyle={{color: 'white', fontWeight: '500', textTransform: 'none'}}
                                        labelPosition="after"
                                        icon={<FontIcon className="material-icons">edit</FontIcon>}
                                    />
                                </div> 
                            </div>

                            <div className="col-lg-3 col-md-6 col-xs-6" style={{margin: 0, padding: 0}}>
                                <div style={{paddingLeft: '1em', backgroundColor: darkGrey, height: '10em', color: turquoise, fontWeight: '700', border: `1px solid ${lightGrey}`, paddingRight: '1em', paddingTop: '3em', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                    CENSOS
                                    <FontIcon className="material-icons" color={'grey'} style={{fontSize: '2em', color: 'white'}}>person</FontIcon>
                                </div>
                                <div style={{display: 'flex', alignItems: 'center', backgroundColor: turquoise, border: `1px solid ${lightGrey}`, borderLeft: 0, color: 'white', fontWeight: '700'}}>
                                <RaisedButton
                                        label="Crear un censo"
                                        fullWidth={true}
                                        backgroundColor={turquoise}
                                        style={{width: '90%'}}
                                        labelStyle={{color: 'white', fontWeight: '500', textTransform: 'none'}}
                                        labelPosition="after"
                                        icon={<FontIcon className="material-icons">control_point</FontIcon>}
                                    />
                                </div> 
                            </div>

                            <div className="col-lg-3 col-md-6 col-xs-6" style={{margin: 0, padding: 0}}>
                                <div style={{paddingLeft: '1em', backgroundColor: darkGrey, height: '10em', color: turquoise, fontWeight: '700', border: `1px solid ${lightGrey}`, paddingRight: '1em', paddingTop: '3em', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                    BORRADORES
                                    <FontIcon className="material-icons" color={'grey'} style={{fontSize: '2em', color: 'white'}}>class</FontIcon>
                                </div>
                            </div>               
                        </div>
                    </div>
                    <div style={{width: '100%', backgroundColor: 'white'}}>
                        <div className="col-lg-6 col-md-6" style={{padding: '2em', paddingLeft: '10%', paddingRight: '10%', borderRight: `1px solid ${lightGrey}`}}>
                            <h4>Conferencia Rápida</h4>
                            <SelectField
                                floatingLabelText="Censo"
                                value={0}
                                fullWidth={true}                            
                                onChange={this.handleCensusChange}
                                errorText=""
                            >   
                                <MenuItem value={0} primaryText="Censo" />
                            </SelectField><br />
                            <SelectField
                                floatingLabelText="Sin contraseña"
                                value={0}
                                fullWidth={true}
                                onChange={this.handleCensusChange}
                                errorText=""
                            >   
                                <MenuItem value={0} primaryText="Sin contraseña" />
                            </SelectField><br/>
                            <RaisedButton
                                label="ABRIR SALA"
                                fullWidth={true}
                                backgroundColor={'transparent'}
                                style={{backgroundColor: 'transparent', border: '1px solid purple', marginRight: '2em'}}
                                labelStyle={{color: 'purple', fontWeight: '700', fontSize: '0.8em', textTransform: 'none'}}
                                labelPosition="before"
                                onClick={this.login}
                            />
                        </div>
                            <div className ="col-lg-6 col-md-6" style = {{padding: '2em', paddingLeft: '10%', paddingRight: '10%', borderLeft: `1px solid ${lightGrey}`, borderTop: `1px solid ${lightGrey}`}} >
                            <h4>Programar reunión</h4>
                            <SelectField
                                floatingLabelText="Consejo de administración"
                                value={0}
                                fullWidth={true}                            
                                onChange={this.handleCensusChange}
                                errorText=""
                            >   
                                <MenuItem value={0} primaryText="Consejo de administración" />
                            </SelectField><br />
                            <SelectField
                                floatingLabelText="Fecha"
                                value={0}
                                fullWidth={true}
                                onChange={this.handleCensusChange}
                                errorText=""
                            >   
                                <MenuItem value={0} primaryText="Fecha" />
                            </SelectField><br/>
                            <RaisedButton
                                label="Organizar Reunión"
                                fullWidth={true}
                                backgroundColor={'transparent'}
                                style={{backgroundColor: 'transparent', border: `1px solid ${turquoise}`, marginRight: '2em'}}
                                labelStyle={{color: turquoise, fontWeight: '700', fontSize: '0.8em'}}
                                labelPosition="before"
                                onClick={this.login}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(mainActions, dispatch),
        companyActions: bindActionCreators(companyActions, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(Dashboard);