import React, { Component, Fragment } from "react";
import { RadioButton, RadioButtonGroup, FontIcon, MenuItem, Dialog} from 'material-ui';
import { BasicButton, TextInput, SelectInput } from '../displayComponents';
import { primary } from '../../styles/colors';
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { urlParser, errorHandler } from '../../utils';
import CouncilBoxApi from '../../api/CouncilboxApi';

class NewParticipantForm extends Component {

    constructor(props){
        super(props);
        this.state = {
            languages: [],
            participantType: 0,
            data: {
                participant: {
                    language : 'es',
                    council_id : 2,
                    lastname: '',
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
                language : '',
                council_id : '',
                num_participations : '',
                person_or_entity : '',
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
        if(this.checkRequiredFields()){
            const participant = this.state.data.participant;
            const { translate } = this.props;

            const response = await this.props.mutate({
                variables: {
                    data : urlParser({
                        data: {
                            participant: {
                                ...participant,
                                name: `${participant.name} ${participant.lastname}`,
                                council_id: this.props.councilID
                            }
                        }
                    })
                }
            });

            if (response) {
                if(response.data.addParticipant.code === 200){
                    this.props.refetch();
                    this.props.close();
                } else {
                    const errorField = errorHandler(response.data.addParticipant.code);
                    this.setState({
                        errors: {
                            ...this.state.errors,
                            email: translate[errorField]
                        }
                    })
                }
            }
        }  
    }

    checkRequiredFields(){
        return true;
    }


    _renderAddParticipantButtons(){
        const { translate } = this.props;

        return(
            <Fragment>
                <BasicButton
                    text={translate.cancel}
                    color={'white'}
                    textStyle={{color: primary, fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    textPosition="after"
                    onClick={this.props.close}
                    buttonStyle={{marginRight: '1em'}}
                />
                <BasicButton
                    text={translate.save}
                    color={primary}
                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    icon={<FontIcon className="material-icons">save</FontIcon>}
                    textPosition="after"
                    onClick={this.sendNewParticipant} 
                />
            </Fragment>
        );
    }

    _renderAddParticipantTypeSelector(){
        const { translate } = this.props;

        return (
            <RadioButtonGroup 
                name={translate.person_or_entity}
                valueSelected={this.state.participantType}
                onChange={(event, value) => this.setState({
                    participantType: value
                })}
                style={{display: 'flex', flexDirection: 'row'}}
            >
                <RadioButton
                    value={0}
                    label={translate.person}
                    style={{padding: 0, margin: '1em', width: '50%'}}
                />
                <RadioButton
                    value={1}
                    label={translate.entity}
                    style={{padding: 0, margin: '1em', width: '50%'}}
                />
            </RadioButtonGroup>
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
                    </SelectInput>
                    <TextInput
                        floatingText={translate.votes}
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
                </SelectInput>
                <TextInput
                    floatingText={translate.votes}
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


    render() {
        const {translate} = this.props;
        return(
            <Dialog
                actions={this._renderAddParticipantButtons()}
                modal={true}
                title={translate.add_participant}
                open={this.props.show}
                autoScrollBodyContent
                >
                {this._renderAddParticipantTypeSelector()}
                {this._renderAddParticipantForm()}
            </Dialog>
        );
    }
}

const addParticipant = gql `
    mutation addParticipant($data: String!) {
        addParticipant(data: $data){
            code
            msg
        }
    }
`;

export default graphql(addParticipant)(NewParticipantForm);