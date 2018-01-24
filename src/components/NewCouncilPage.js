import React from 'react';
import * as mainActions from '../actions/mainActions';
import * as companyActions from '../actions/companyActions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Card, CardText, TextField, RaisedButton, FontIcon, Checkbox, SelectField, MenuItem} from 'material-ui';
import { lightGrey } from '../styles/colors';
import {Step, Stepper, StepLabel, StepContent} from 'material-ui/Stepper';
import DateTimePicker from 'material-ui-datetimepicker';
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog'
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog';

class NewCouncilPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            stepIndex: 0,
            data: {
                place: 'Aquí',
                date: null
            },
            errors: {
                place: ''
            }
        };
    }

    nextStep = () => {
        const index = this.state.stepIndex + 1;
        this.setState({stepIndex: index})
    }

    send = () => {
        if (true) {
            this.setState({success: true});
        }
    }

    setDate = (dateTime) => {
        this.setState({
            ...this.state,
            data: {
                ...this.state.data,
                date: dateTime
            }
        })
    };

    render() {
        return(
            <div style = {{display: 'flex', flexDirection: 'column', backgroundColor: lightGrey, height: '100%', alignItems: 'center', justifyContent: 'flex'}} >
                <h3>Crear junta</h3>
                <Card style={{width: '95%', padding: 0, borderRadius: '0.3em', overflow: 'hidden'}} containerStyle={{padding: 0}}>
                    <CardText style={{padding: 0}}>
                        <div style={{display: 'flex', flexDirection: 'row', height:'75vh'}}>
                            <div style={{backgroundColor: 'lightgrey', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '1em', width: '12em', height: '100%'}}>
                                <Stepper activeStep={this.state.stepIndex} orientation="vertical">
                                    <Step>
                                        <StepLabel>Convocatoria</StepLabel>
                                    </Step>
                                    <Step>
                                        <StepLabel>Censo</StepLabel>
                                    </Step>
                                    <Step>
                                        <StepLabel>Orden del día</StepLabel>
                                    </Step>
                                    <Step>
                                        <StepLabel>Documentación</StepLabel>
                                    </Step>
                                    <Step>
                                        <StepLabel>Opciones</StepLabel>
                                    </Step>
                                    <Step>
                                        <StepLabel>Previsualización</StepLabel>
                                    </Step>
                                </Stepper>
                            </div>
                            <div style={{width: '100%', height: '100%', padding: '2em'}}>
                                <h4>Fecha, hora y lugar</h4>
                                <h5>{`Fecha: ${'jibiri'}`}</h5>
                                <RaisedButton
                                    label="Cambiar ubicación"
                                    backgroundColor={'purple'}
                                    labelStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                                    labelPosition="after"
                                    onClick={this.endForm}
                                    icon={<FontIcon className="material-icons">location_on</FontIcon>}
                                />
                                <br/>
                            <SelectField
                                floatingLabelText="Tipo de reunión"
                            >   
                                <MenuItem value={0} primaryText={'Junta General Ordinaria'} />
                                <MenuItem value={1} primaryText={'Junta General Extraordinaria'} />
                                <MenuItem value={2} primaryText={'Consejo de Administración'} />
                            </SelectField>
                            <DateTimePicker 
                                onChange={this.setDate}
                                value={this.state.data.date}
                                DatePicker={DatePickerDialog}
                                TimePicker={TimePickerDialog}
                            />
                            <TextField
                                floatingLabelText="Cabecera de convocatoria"
                                floatingLabelFixed={true}
                                type="text"
                                errorText={this.state.errors.header}
                                value={this.state.data.header}
                                onChange={(event) => this.setState({
                                    ...this.state,
                                    data: {
                                        ...this.state.data,
                                        header: event.nativeEvent.target.value
                                    }
                                })}
                            />
                            </div>
                        </div>
                    </CardText>
                </Card>
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

export default connect(null, mapDispatchToProps)(NewCouncilPage);

/*                                <TextField
                                    floatingLabelText="Lugar"
                                    floatingLabelFixed={true}
                                    type="text"
                                    disabled
                                    underlineStyle={{borderBottom: '3px solid purple'}}
                                    errorText={this.state.errors.place}
                                    value={this.state.data.place}
                                    onChange={(event) => this.setState({
                                        ...this.state,
                                        data: {
                                            ...this.state.data,
                                            address: event.nativeEvent.target.value
                                        }
                                    })}
                                />*/