import React, { Component } from 'react';
import {TextField, RaisedButton, FontIcon, SelectField, MenuItem} from 'material-ui';
import PlaceModal from './PlaceModal';
import DateTimePicker from 'material-ui-datetimepicker';
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog';
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog';
import * as councilActions from '../actions/councilActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class CouncilEditorNotice extends Component {

    constructor(props){
        super(props);
        this.state = {
            placeModal: false,
            data: {
                ...this.props.council.council
            },
            errors: {
                name : '',
                date_start : "",
                date_start_2nd_call : "",
                country : '',
                country_state : '',
                city : '',
                zipcode : '',
                convene_text : '',
                street : '',
            }
        }
    }

    send = () => {
        //change true for checkRequiredFields method
        if(true){
            this.props.actions.saveCouncilData({data: { council: this.state.data}});
            this.props.nextStep();
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            ...this.state,
            data: {
                ...nextProps.council.council
            }
        });
    }

    render(){
        return(
            <div style={{width: '100%', height: '100%', padding: '2em'}}>
                <h4>Fecha, hora y lugar</h4>
                <h5>{`Lugar: ${this.state.data.street}`}</h5>
                <RaisedButton
                    label="Cambiar ubicación"
                    backgroundColor={'purple'}
                    labelStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    labelPosition="after"
                    onClick={() => this.setState({placeModal: true})}
                    icon={<FontIcon className="material-icons">location_on</FontIcon>}
                />
                <RaisedButton
                    label="Siguiente"
                    backgroundColor={'purple'}
                    labelStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    labelPosition="after"
                    onClick={this.send}
                />
                <PlaceModal
                    open={this.state.placeModal}
                    close={() => this.setState({placeModal: false})}
                    place={this.state.place}
                    council={this.props.council}
                />
                <br/>
                <SelectField
                    floatingLabelText="Tipo de reunión"
                    value={this.state.data.council_type}
                    onChange={(event, index) => {
                        console.log(event.nativeEvent)
                        this.setState({
                            ...this.state,
                            data: {
                                ...this.state.data,
                                council_type: index
                            }
                        })}
                    }
                >   
                    <MenuItem value={0} primaryText={'Junta General Ordinaria'} />
                    <MenuItem value={1} primaryText={'Junta General Extraordinaria'} />
                    <MenuItem value={2} primaryText={'Consejo de Administración'} />
                </SelectField>
                <DateTimePicker 
                    onChange={(date) => this.setState({
                        ...this.state,
                        data: {
                            ...this.state.data,
                            date_start: date
                        }
                    })}
                    floatingLabelFixed
                    floatingLabelText = "Fecha"
                    format='DD/MM/YYYY hh:mm'
                    value={this.state.data.date_start}
                    DatePicker={DatePickerDialog}
                    TimePicker={TimePickerDialog}
                />
                <TextField
                    floatingLabelText="Cabecera de convocatoria"
                    floatingLabelFixed={true}
                    type="text"
                    errorText={this.state.errors.header}
                    value={this.state.data.name}
                    onChange={(event) => this.setState({
                        ...this.state,
                        data: {
                            ...this.state.data,
                            name: event.nativeEvent.target.value
                        }
                    })}
                /><br />
                <TextField
                    errorText=''
                    floatingLabelText="Texto convocatoria"
                    multiLine={true}
                    rows={4}
                    value={this.state.data.convene_text}
                />
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(councilActions, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(CouncilEditorNotice);