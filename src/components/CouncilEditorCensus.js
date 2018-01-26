import React, { Component, Fragment } from 'react';
import {Card, CardText, TextField, RaisedButton, RadioButton, RadioButtonGroup, IconButton, FontIcon, Checkbox, SelectField, MenuItem, Dialog} from 'material-ui';
import PlaceModal from './PlaceModal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as councilActions from '../actions/councilActions';
import DateTimePicker from 'material-ui-datetimepicker';
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog'
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog';
import DeleteForever from 'material-ui/svg-icons/action/delete-forever';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import CouncilBoxApi from '../api/CouncilboxApi';

class CouncilEditorCensus extends Component {

    constructor(props){
        super(props);
        this.state = {
            placeModal: false,
            censusChangeAlert: false,
            addParticipantModal: false,
            participantType: 0,
            languages: [],
            censusChangeId: '',
            data: {
                censuses: this.props.council.censuses || [],
                participant: {
                    language : 'es',
                    council_id : this.props.council.id,
                    num_participations : 1,
                    person_or_entity : 1,
                    name : '',
                    dni : '',
                    position : '',
                    email : '',
                    phone : '',
                }
            },
            errors: {
                participant: {
                    language : '',
                    council_id : '',
                    num_participations : '',
                    person_or_entity : '',
                    name : '',
                    dni : '',
                    position : '',
                    email : '',
                    phone : ''
                }
            }
        }
    }

    async componentDidMount(){
        const languages = await CouncilBoxApi.getLanguageList();
        this.setState({
            languages: languages
        });
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.council.censuses){
            this.setState({
                ...this.state,
                data: {
                    ...this.state.data,
                    censuses: nextProps.censuses
                }
            })
        }
    }

    handleCensusChange = (event, index, value) => {
        if(value !== this.props.council.council.selected_census_id){
            this.setState({
                censusChangeAlert: true,
                censusChangeId: value
            });
        }
        
    }

    sendCensusChange = () => {
        this.props.actions.sendCensusChange({
            census_id: this.state.censusChangeId,
            council_id: this.props.council.council.id,
            company_id: this.props.council.council.company_id
        });

        this.setState({
            censusChangeAlert: false
        });
    }

    sendNewParticipant = () => {
        const participant = this.state.data.participant;

        this.props.actions.sendNewParticipant({
            data:{
                participant: {
                    ...participant,
                    name: `${participant.name} ${participant.lastname}`,
                    council_id: this.props.council.council.id
                }
            }
        });
    }


    deleteParticipant = (id) => {
        this.props.actions.deleteParticipant({
            data: {
                id: id,
                council_id: this.props.council.council.id
                }
            }
        );
    }
    
    _renderDeleteIcon(participantID){
        return(
            <IconButton 
                iconStyle={{color: 'purple'}}
                onClick={() => this.deleteParticipant(participantID)}
            >
                <DeleteForever />
            </IconButton>
        );
    }

    _renderCensusChangeButtons(){
        return(
            <Fragment>
                <RaisedButton
                    label="Cancelar"
                    backgroundColor={'white'}
                    labelStyle={{color: 'purple', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    labelPosition="after"
                    onClick={() => this.setState({censusChangeAlert: false})}
                    style={{marginRight: '1em'}}
                />
                <RaisedButton
                    label="Si, quiero cambiar el censo"
                    backgroundColor={'purple'}
                    labelStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    icon={<FontIcon className="material-icons">cached</FontIcon>}
                    labelPosition="after"
                    onClick={this.sendCensusChange} 
                />
            </Fragment>
        );
    }

    _renderAddParticipantButtons(){
        return(
            <Fragment>
                <RaisedButton
                    label="Cancelar"
                    backgroundColor={'white'}
                    labelStyle={{color: 'purple', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    labelPosition="after"
                    onClick={() => this.setState({addParticipantModal: false})}
                    style={{marginRight: '1em'}}
                />
                <RaisedButton
                    label="Guardar"
                    backgroundColor={'purple'}
                    labelStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    icon={<FontIcon className="material-icons">save</FontIcon>}
                    labelPosition="after"
                    onClick={this.sendNewParticipant} 
                />
            </Fragment>
        );
    }

    _renderAddParticipantTypeSelector(){
        return (
            <RadioButtonGroup 
                name="Persona Física o jurídica"
                valueSelected={this.state.participantType}
                onChange={(event, value) => this.setState({
                    participantType: value
                })}
                style={{display: 'flex', flexDirection: 'row'}}
            >
                <RadioButton
                    value={0}
                    label="Persona Física"
                    style={{padding: 0, margin: '1em', width: '50%'}}
                />
                <RadioButton
                    value={1}
                    label="Persona Jurídica"
                    style={{padding: 0, margin: '1em', width: '50%'}}
                />
            </RadioButtonGroup>
        );
    }

    _renderAddParticipantForm(){
        const participant = this.state.data.participant;
        const errors = this.state.errors.participant;

        if(this.state.participantType === 1){
            return(
                <Fragment>
                    <TextField
                        floatingLabelText="Razón Social"
                        floatingLabelFixed={true}
                        type="text"
                        errorText={errors.name}
                        value={participant.name}
                        onChange={(event) => this.setState({
                            ...this.state,
                            data: {
                                ...this.state.data,
                                participant: {
                                    ...this.state.data.participant,
                                    name: event.nativeEvent.target.value
                                }
                            }
                        })}
                    />
                    <TextField
                        floatingLabelText="CIF"
                        floatingLabelFixed={true}
                        type="text"
                        errorText={errors.dni}
                        value={participant.dni}
                        onChange={(event) => this.setState({
                            ...this.state,
                            data: {
                                ...this.state.data,
                                participant: {
                                    ...this.state.data.participant,
                                    dni: event.nativeEvent.target.value
                                }
                            }
                        })}
                    />
                    <TextField
                        floatingLabelText="Cargo"
                        floatingLabelFixed={true}
                        type="text"
                        errorText={errors.position}
                        value={participant.position}
                        onChange={(event) => this.setState({
                            ...this.state,
                            data: {
                                ...this.state.data,
                                participant: {
                                    ...this.state.data.participant,
                                    position: event.nativeEvent.target.value
                                }
                            }
                        })}
                    />
                    <TextField
                        floatingLabelText="E-mail"
                        floatingLabelFixed={true}
                        type="text"
                        errorText={errors.email}
                        value={participant.email}
                        onChange={(event) => this.setState({
                            ...this.state,
                            data: {
                                ...this.state.data,
                                participant: {
                                    ...this.state.data.participant,
                                    email: event.nativeEvent.target.value
                                }
                            }
                        })}
                    />
                    <TextField
                        floatingLabelText="Teléfono"
                        floatingLabelFixed={true}
                        type="text"
                        errorText={errors.phone}
                        value={participant.phone}
                        onChange={(event) => this.setState({
                            ...this.state,
                            data: {
                                ...this.state.data,
                                participant: {
                                    ...this.state.data.participant,
                                    phone: event.nativeEvent.target.value
                                }
                            }
                        })}
                    />
                    <SelectField
                        floatingLabelText="Idioma"
                        value={participant.language}
                        onChange={(event, index, value) => this.setState({
                            ...this.state,
                            data: {
                                ...this.state.data,
                                participant: {
                                    ...this.state.data.participant,
                                    language: value
                                }
                            }
                        })}
                    >
                        {this.state.languages.map((language) => {
                                return <MenuItem value={language.column_name} key={`language${language.id}`}>{language.desc}</MenuItem>
                            })
                        }
                    </SelectField>
                    <TextField
                        floatingLabelText="Votos"
                        floatingLabelFixed={true}
                        type="number"
                        errorText={errors.num_participations}
                        value={participant.num_participations}
                        onChange={(event) => this.setState({
                            ...this.state,
                            data: {
                                ...this.state.data,
                                participant: {
                                    ...this.state.data.participant,
                                    num_participations: event.nativeEvent.target.value
                                }
                            }
                        })}
                    />
                </Fragment>
            );
        }

        return(
            <Fragment>
                <TextField
                    floatingLabelText="Nombre"
                    floatingLabelFixed={true}
                    type="text"
                    errorText={errors.name}
                    value={participant.name}
                    onChange={(event) => this.setState({
                        ...this.state,
                        data: {
                            ...this.state.data,
                            participant: {
                                ...this.state.data.participant,
                                name: event.nativeEvent.target.value
                            }
                        }
                    })}
                />
                <TextField
                    floatingLabelText="Apellidos"
                    floatingLabelFixed={true}
                    type="text"
                    errorText={errors.lastname}
                    value={participant.lastname}
                    onChange={(event) => this.setState({
                        ...this.state,
                        data: {
                            ...this.state.data,
                            participant: {
                                ...this.state.data.participant,
                                lastname: event.nativeEvent.target.value
                            }
                        }
                    })}
                />
                <TextField
                    floatingLabelText="DNI/NIF"
                    floatingLabelFixed={true}
                    type="text"
                    errorText={errors.dni}
                    value={participant.dni}
                    onChange={(event) => this.setState({
                        ...this.state,
                        data: {
                            ...this.state.data,
                            participant: {
                                ...this.state.data.participant,
                                dni: event.nativeEvent.target.value
                            }
                        }
                    })}
                />
                <TextField
                    floatingLabelText="Cargo"
                    floatingLabelFixed={true}
                    type="text"
                    errorText={errors.position}
                    value={participant.position}
                    onChange={(event) => this.setState({
                        ...this.state,
                        data: {
                            ...this.state.data,
                            participant: {
                                ...this.state.data.participant,
                                position: event.nativeEvent.target.value
                            }
                        }
                    })}
                />
                <TextField
                    floatingLabelText="E-mail"
                    floatingLabelFixed={true}
                    type="text"
                    errorText={errors.email}
                    value={participant.email}
                    onChange={(event) => this.setState({
                        ...this.state,
                        data: {
                            ...this.state.data,
                            participant: {
                                ...this.state.data.participant,
                                email: event.nativeEvent.target.value
                            }
                        }
                    })}
                />
                <TextField
                    floatingLabelText="Teléfono"
                    floatingLabelFixed={true}
                    type="text"
                    errorText={errors.phone}
                    value={participant.phone}
                    onChange={(event) => this.setState({
                        ...this.state,
                        data: {
                            ...this.state.data,
                            participant: {
                                ...this.state.data.participant,
                                phone: event.nativeEvent.target.value
                            }
                        }
                    })}
                />
                <SelectField
                    floatingLabelText="Idioma"
                    value={participant.language}
                    onChange={(event, index, value) => this.setState({
                        ...this.state,
                        data: {
                            ...this.state.data,
                            participant: {
                                ...this.state.data.participant,
                                language: value
                            }
                        }
                    })}
                >
                    {this.state.languages.map((language) => {
                            return <MenuItem value={language.column_name} key={`language${language.id}`}>{language.desc}</MenuItem>
                        })
                    }
                </SelectField>
                <TextField
                    floatingLabelText="Votos"
                    floatingLabelFixed={true}
                    type="number"
                    errorText={errors.num_participations}
                    value={participant.num_participations}
                    onChange={(event) => this.setState({
                        ...this.state,
                        data: {
                            ...this.state.data,
                            participant: {
                                ...this.state.data.participant,
                                num_participations: event.nativeEvent.target.value
                            }
                        }
                    })}
                />
            </Fragment>
        );
    }

    render(){
        return(
            <div style={{width: '100%', height: '100%', padding: '2em'}}>
                <SelectField
                    floatingLabelText="Censo actual"
                    value={this.props.council.council.selected_census_id}
                    onChange={this.handleCensusChange}
                >
                    {this.props.council.censuses &&
                        this.props.council.censuses.map((census) => {
                            return <MenuItem value={census.id} key={`census${census.id}`}>{census.census_name}</MenuItem>
                        })
                    }
                </SelectField>
                <RaisedButton
                    label="Añadir participante"
                    backgroundColor={'purple'}
                    labelStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    icon={<FontIcon className="material-icons">add</FontIcon>}
                    labelPosition="after"
                    onClick={() => this.setState({ addParticipantModal: true})} 
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
                    onClick={this.props.nextStep}
                />
                <Table>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn>Datos del participante</TableHeaderColumn>
                            <TableHeaderColumn>DNI/NIF</TableHeaderColumn>
                            <TableHeaderColumn>E-mail</TableHeaderColumn>
                            <TableHeaderColumn>Nº de teléfono</TableHeaderColumn>
                            <TableHeaderColumn>Cargo</TableHeaderColumn>
                            <TableHeaderColumn>Votos</TableHeaderColumn>
                            <TableHeaderColumn>Eliminar</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {this.props.council.participants.map((participant) => {
                            return(
                                <TableRow
                                    selectable={false}
                                    hoverable
                                    key={`participant${participant.id}`}  
                                >
                                    <TableRowColumn>{participant.name}</TableRowColumn>
                                    <TableRowColumn>{participant.dni}</TableRowColumn>
                                    <TableRowColumn>{participant.email}</TableRowColumn>
                                    <TableRowColumn>{participant.phone}</TableRowColumn>
                                    <TableRowColumn>{participant.position}</TableRowColumn>     
                                    <TableRowColumn>{participant.num_participations}</TableRowColumn>
                                    <TableRowColumn>{this._renderDeleteIcon(participant.id)}</TableRowColumn>
                                                                   
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
                <Dialog
                    actions={this._renderCensusChangeButtons()}
                    modal={false}
                    title="Cambio de Censo"
                    open={this.state.censusChangeAlert}
                    onRequestClose={() => this.setState({censusChangeAlert: false})}
                    >
                    Se cambiará el listado actual de participantes por el listado de participantes del nuevo censo seleccionado, por lo que se perderán los datos de los participantes introducidos manualmente.<br/>¿Desea continuar?
                </Dialog>
                <Dialog
                    actions={this._renderAddParticipantButtons()}
                    modal={true}
                    title="Añadir participante"
                    open={this.state.addParticipantModal}
                    >
                    {this._renderAddParticipantTypeSelector()}
                    {this._renderAddParticipantForm()}
                </Dialog>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(councilActions, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(CouncilEditorCensus);