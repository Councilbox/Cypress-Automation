import React, { Component } from 'react';
import {TextField, RaisedButton, FontIcon, SelectField, MenuItem} from 'material-ui';
import PlaceModal from './PlaceModal';
import DateTimePicker from 'material-ui-datetimepicker';
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog';
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog';
import * as councilActions from '../actions/councilActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CouncilboxApi from '../api/CouncilboxApi';

class CouncilEditorAgenda extends Component {

    constructor(props){
        super(props);
        this.state = {
            agendas: this.props.council.agendas || [],
            votingTypes: [],
            errors: {
                agenda_subject: '',
                description: ''
            }
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            agendas: nextProps.council.agendas
        })
    }

    async componentDidMount(){
        const votingTypes = await CouncilboxApi.getVotingTypes();
        this.setState({
            votingTypes: votingTypes
        });
    }

    addNewPoint = () => {
        const agendas = [...this.state.agendas];
        agendas.push({agenda_subject: 'prueba de añadir mas'});
        this.setState({
            agendas: agendas
        })
    }

    nextPage = () => {
        if(true){
            //this.props.actions.saveCouncilData();
        }
    }

    _renderAgendaBlock(agenda, index){
        const errors = this.state.errors;
        const agendas = this.state.agendas;

        return(
            <div key={`agenda${Math.random()}`} style={{width: '90%', border: '1px solid purple'}}>
                <TextField
                    floatingLabelText="Título"
                    floatingLabelFixed={true}
                    type="text"
                    errorText={errors.agenda_subject}
                    value={agenda.agenda_subject}
                    onChange={(event) => {
                        agendas[index].agenda_subject = event.nativeEvent.target.value;
                        this.setState({
                            agendas: agendas
                        })
                    }}
                />

               <SelectField
                        floatingLabelText="Tipo"
                        value={agenda.subject_type}
                        onChange={(event, position, value) => {
                            agendas[index].subject_type = value;
                            this.setState({
                                agendas: agendas
                            }) 
                        }}
                    >
                        {this.state.votingTypes.map((voting) => {
                                return <MenuItem value={voting.value} key={`voting${voting.value}`}>{voting.label}</MenuItem>
                            })
                        }
                </SelectField>

                <TextField
                    floatingLabelText="Descripción"
                    floatingLabelFixed={true}
                    type="text"
                    errorText={errors.description}
                    value={agenda.description}
                    onChange={(event) => {
                        agendas[index].description = event.nativeEvent.target.value;
                        this.setState({
                            agendas: agendas
                        })
                    }}
                />
            </div>
        );
    }

    render(){
        return(
            <div style={{width: '100%', height: '100%', padding: '2em'}}>
                AGENDAS
                <RaisedButton
                    label="Añadir punto del día"
                    backgroundColor={'purple'}
                    labelStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    icon={<FontIcon className="material-icons">add</FontIcon>}
                    labelPosition="after"
                    onClick={this.addNewPoint} 
                /> 

                <RaisedButton
                    label="Anterior"
                    backgroundColor={'purple'}
                    labelStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    labelPosition="after"
                    onClick={this.props.previousStep}
                />
                <RaisedButton
                    label="Siguiente"
                    backgroundColor={'purple'}
                    labelStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    labelPosition="after"
                    onClick={this.nextPage}
                />
                {this.state.agendas.map((agenda, index) => {
                    return this._renderAgendaBlock(agenda, index);
                })}
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(councilActions, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(CouncilEditorAgenda);