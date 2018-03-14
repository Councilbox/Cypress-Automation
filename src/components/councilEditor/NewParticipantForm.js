import React, { Component, Fragment } from "react";
import { MenuItem } from 'material-ui';
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';
import { BasicButton, TextInput, SelectInput, Radio, Icon } from '../displayComponents';
import { FormControlLabel } from 'material-ui/Form';
import { getPrimary } from '../../styles/colors';
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { errorHandler, checkValidEmail } from '../../utils';
import CouncilBoxApi from '../../api/CouncilboxApi';
let primary = getPrimary();

class NewParticipantForm extends Component {

    constructor(props){
        super(props);
        this.state = {
            languages: [],
            participantType: 0,
            data: {
                participant: {
                    ...newParticipantInitialValues
                }
            },

            errors: {
                language : '',
                councilId : '',
                numParticipations : '',
                personOrEntity : '',
                name : '',
                dni : '',
                position : '',
                email : '',
                phone : '',
            }
        }
    }

    async componentDidMount(){
        const languages = await CouncilBoxApi.getLanguageList();
        this.setState({
            languages: languages
        });
    }

    sendNewParticipant = async () => {
        if(!this.checkRequiredFields()){
            const participant = this.state.data.participant;
            const { translate } = this.props;

            const response = await this.props.mutate({
                variables: {
                    participant: {
                        ...participant,
                        name: `${participant.name} ${participant.surname}`,
                        councilId: this.props.councilID
                    }
                }
            });
            if (response) {
                if(response.errors){
                    const errorField = errorHandler(response.errors[0].code);
                    this.setState({
                        errors: {
                            ...this.state.errors,
                            email: translate[errorField]
                        }
                    })
                } else {
                    this.props.refetch();
                    this.resetValues();
                    this.props.close();
                }
            }
        }  
    }

    checkRequiredFields() {
        const { participant } = this.state.data;
        
        let errors = {
            name: '',
            surname: '',
            dni: '',
            position: '',
            email: '',
            phone: '',
            language: '',
            numParticipations: ''
        };

        let hasError = false;

        if(!participant.name){
            hasError = true;
            errors.name = 'Este campo es obligatorio';
        }
        
        if(!participant.surname && this.state.participantType === 0){
            hasError = true;
            errors.surname = 'Este campo es obligatorio';
        }

        if(!participant.dni){
            hasError = true;
            errors.dni = 'Este campo es obligatorio';
        }

        if(!participant.position){
            hasError = true;
            errors.position = 'Este campo es obligatorio';
        }

        if(!checkValidEmail(participant.email.toLocaleLowerCase())){
            hasError = true;
            errors.email = 'Se requiere un email válido';
        }

        if(!participant.phone){
            hasError = true;
            errors.phone = 'Este campo es obligatorio';
        }

        if(!participant.language){
            hasError = true;
            errors.language = 'Este campo es obligatorio';
        }

        if(!participant.numParticipations){
            hasError = true;
            errors.numParticipations = 'Este campo es obligatorio';
        }

        this.setState({
            ...this.state,
            errors: errors
        });
        
        return hasError;
    }

    close = () => {
        this.resetValues();
        this.props.close();
    }

    resetValues = () => {
        this.setState({
            data: {
                ...this.props.data,
                participant: {
                    ...newParticipantInitialValues
                }
            }
        })
    }

    _renderAddParticipantButtons(){
        const { translate } = this.props;
        primary = getPrimary();

        return(
            <Fragment>
                <BasicButton
                    text={translate.cancel}
                    color={'white'}
                    textStyle={{color: primary, fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    textPosition="after"
                    onClick={this.close}
                    buttonStyle={{marginRight: '1em'}}
                />
                <BasicButton
                    text={translate.save}
                    color={primary}
                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    icon={<Icon className="material-icons" style={{color: 'white'}}>save</Icon>}
                    textPosition="after"
                    onClick={this.sendNewParticipant} 
                />
            </Fragment>
        );
    }

    _renderAddParticipantTypeSelector(){
        const { translate } = this.props;

        return (
            <Fragment>
                <Radio
                    checked={this.state.participantType === 0}
                    label={translate.person}
                    onChange={(event) => {
                        console.log(event);
                        this.setState({
                            participantType: parseInt(event.target.value, 10),
                            data: {
                                ...this.state.data,
                                participant: {
                                    ...newParticipantInitialValues
                                }
                            }
                        })
                    }}
                    value='0'
                    name={'person_or_entity'}
                    aria-label="A"
                />
                <Radio
                    checked={this.state.participantType === 1}
                    onChange={(event) => {
                        console.log(event);
                        this.setState({
                            participantType: parseInt(event.target.value, 10),
                            data: {
                                ...this.state.data,
                                participant: {
                                    ...newParticipantInitialValues
                                }
                            }
                        })
                    }}
                    value="1"
                    name="person_or_entity"
                    aria-label="B"
                    label={translate.entity_name}
                />

            </Fragment>
        );
    }

    _renderAddParticipantForm(){
        const participant = this.state.data.participant;
        const errors = this.state.errors;
        const { translate } = this.props;

        if(this.state.participantType === 1){
            return(
                <Fragment>
                    <TextInput
                        floatingText={translate.entity_name}
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
                    <TextInput
                        floatingText={translate.cif}
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
                    <TextInput
                        floatingText={translate.position}
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
                    <TextInput
                        floatingText={translate.email}
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
                    <TextInput
                        floatingText={translate.phone}
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
                    <SelectInput
                        floatingText={translate.language}
                        value={participant.language}
                        onChange={(event) => this.setState({
                            ...this.state,
                            data: {
                                ...this.state.data,
                                participant: {
                                    ...this.state.data.participant,
                                    language: event.target.value
                                }
                            }
                        })}
                    >
                        {this.state.languages.map((language) => {
                                return <MenuItem value={language.column_name} key={`language${language.id}`}>{language.desc}</MenuItem>
                            })
                        }
                    </SelectInput>
                    <TextInput
                        floatingText={translate.votes}
                        type="number"
                        errorText={errors.numParticipations}
                        value={participant.numParticipations}
                        onChange={(event) => this.setState({
                            ...this.state,
                            data: {
                                ...this.state.data,
                                participant: {
                                    ...this.state.data.participant,
                                    numParticipations: event.nativeEvent.target.value
                                }
                            }
                        })}
                    />
                </Fragment>
            );
        }

        return(
            <Fragment>
                <TextInput
                    floatingText={translate.name}
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
                <TextInput
                    floatingText={translate.surname}
                    type="text"
                    errorText={errors.surname}
                    value={participant.surname}
                    onChange={(event) => this.setState({
                        ...this.state,
                        data: {
                            ...this.state.data,
                            participant: {
                                ...this.state.data.participant,
                                surname: event.nativeEvent.target.value
                            }
                        }
                    })}
                />
                <TextInput
                    floatingText={translate.new_dni}
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
                <TextInput
                    floatingText={translate.position}
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
                <TextInput
                    floatingText={translate.email}
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
                <TextInput
                    floatingText={translate.phone}
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
                <SelectInput
                    floatingText={translate.language}
                    value={participant.language}
                    onChange={(event) => this.setState({
                        ...this.state,
                        data: {
                            ...this.state.data,
                            participant: {
                                ...this.state.data.participant,
                                language: event.target.value
                            }
                        }
                    })}
                >
                    {this.state.languages.map((language) => {
                            return <MenuItem value={language.column_name} key={`language${language.id}`}>{language.desc}</MenuItem>
                        })
                    }
                </SelectInput>
                <TextInput
                    floatingText={translate.votes}
                    type="number"
                    errorText={errors.numParticipations}
                    value={participant.numParticipations}
                    onChange={(event) => this.setState({
                        ...this.state,
                        data: {
                            ...this.state.data,
                            participant: {
                                ...this.state.data.participant,
                                numParticipations: event.nativeEvent.target.value
                            }
                        }
                    })}
                />
            </Fragment>
        );
    }

    render() {
        const {translate} = this.props;
        return(
            <Dialog
                disableBackdropClick={true}
                onClose={this.props.requestClose}
                open={this.props.show}
            >
                <DialogTitle>
                    {translate.add_participant}
                </DialogTitle>
                <DialogContent>
                    {this._renderAddParticipantTypeSelector()}
                    {this._renderAddParticipantForm()}
                </DialogContent>
                <DialogActions>
                    {this._renderAddParticipantButtons()}
                </DialogActions>
            </Dialog>
        );
    }
}

const addParticipant = gql `
    mutation addParticipant($participant: NewParticipant) {
        addCouncilParticipant(participant: $participant){
            id
        }
    }
`;

export default graphql(addParticipant, {
    options: {
        errorPolicy: 'all'
    }
})(NewParticipantForm);

const newParticipantInitialValues = {
    language : 'es',
    councilId : 2,
    numParticipations : 1,
    personOrEntity : 1,
    name : '',
    dni : '',
    position : '',
    email : '',
    phone : '',
}