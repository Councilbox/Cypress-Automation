import React, { Component, Fragment } from 'react';
import { BasicButton, ButtonIcon, AlertConfirm, TextInput, SelectInput, Radio, LoadingSection } from '../../../../displayComponents';
import { MenuItem } from 'material-ui';
import { graphql, compose } from 'react-apollo';
import { getPrimary } from '../../../../styles/colors';
import { addCensusParticipant } from '../../../../queries';
import { languages } from '../../../../queries/masters';
import { censusHasParticipations } from '../../../../utils/CBX';
import RepresentativeForm from './RepresentativeForm';

class AddCensusParticipantButton extends Component {

    constructor(props){
        super(props);
        this.state = {
            modal: false,
            data: {
                ...newParticipantInitialValues
            },
            representative: {
                hasRepresentative: false,
                language: 'es',
                type: 2
            },
            errors: {},
            representativeErrors: {}
        }
    }

    addCensusParticipant = async () => {
        const { hasRepresentative, ...data } = this.state.representative;
        const representative = this.state.representative.hasRepresentative? {
            ...data,
            companyId: this.props.census.companyId,
            censusId: this.props.census.id
        } : null;

        if(!this.checkRequiredFields()){
            const response = await this.props.addCensusParticipant({
                variables: {
                    participant: {
                        ...this.state.data,
                        companyId: this.props.census.companyId,
                        censusId: this.props.census.id
                    },
                    representative: representative
                }
            });
            if(!response.errors){
                this.props.refetch();
                this.setState({
                    modal: false,
                    data: {
                        ...newParticipantInitialValues
                    },
                    errors: {}
                });
            }
        }
    };


    checkRequiredFields(){
        return false;
    }

    updateState = (object) => {
        this.setState({
            data: {
                ...this.state.data,
                ...object
            }
        });
    };

    updateRepresentative = (object) => {
        this.setState({
            representative: {
                ...this.state.representative,
                ...object
            }
        })
    };

    _renderAddParticipantTypeSelector(){
        const { translate } = this.props;

        return (
            <Fragment>
                <Radio
                    checked={this.state.data.personOrEntity === 0}
                    label={translate.person}
                    onChange={(event) => this.updateState({
                        ...newParticipantInitialValues,
                        personOrEntity: parseInt(event.nativeEvent.target.value, 10),
                    })}
                    value='0'
                    name="personOrEntity"
                />
                <Radio
                    checked={this.state.data.personOrEntity === 1}
                    onChange={(event) => {
                        this.updateState({
                        ...newParticipantInitialValues,
                        personOrEntity: parseInt(event.nativeEvent.target.value, 10),                        
                    })}}
                    value="1"
                    name="personOrEntity"
                    label={translate.entity}
                />
            </Fragment>
        );
    }

    _renderAddParticipantForm(){
        const participant = this.state.data;
        const errors = this.state.errors;
        const { translate } = this.props;

        if(this.props.data.loading){
            return <LoadingSection />
        }

        if(participant.personOrEntity === 1){
            return(
                <div className="row">
                    <div className="col-lg-4 col-md-4 col-xs-12">
                        <TextInput
                            floatingText={translate.entity_name}
                            type="text"
                            errorText={errors.name}
                            value={participant.name}
                            onChange={(event) => this.updateState({
                                name: event.nativeEvent.target.value
                            })}
                        />
                    </div>
                    <div className="col-lg-4 col-md-4 col-xs-12">
                        <TextInput
                            floatingText={translate.cif}
                            type="text"
                            errorText={errors.dni}
                            value={participant.dni}
                            onChange={(event) => this.updateState({
                                dni: event.nativeEvent.target.value
                            })}
                        />
                    </div>
                    <div className="col-lg-3 col-md-3 col-xs-6">                    
                        <TextInput
                            floatingText={translate.position}
                            type="text"
                            errorText={errors.position}
                            value={participant.position}
                            onChange={(event) => this.updateState({
                                position: event.nativeEvent.target.value
                            })}
                        />
                    </div>
                    <div className="col-lg-4 col-md-4 col-xs-12">                    
                        <TextInput
                            floatingText={translate.email}
                            type="text"
                            errorText={errors.email}
                            value={participant.email}
                            onChange={(event) => this.updateState({
                                email: event.nativeEvent.target.value
                            })}
                        />
                    </div>
                    <div className="col-lg-3 col-md-3 col-xs-6">                    
                        <TextInput
                            floatingText={translate.phone}
                            type="text"
                            errorText={errors.phone}
                            value={participant.phone}
                            onChange={(event) => this.updateState({
                                phone: event.nativeEvent.target.value
                            })}
                        />
                    </div>
                    <div className="col-lg-2 col-md-2 col-xs-4">                    
                        <SelectInput
                            floatingText={translate.language}
                            value={participant.language}
                            onChange={(event) => this.updateState({
                                language: event.target.value
                            })}
                        >
                            {this.props.data.languages.map((language) => {
                                    return <MenuItem value={language.column_name} key={`language${language.id}`}>{language.desc}</MenuItem>
                                })
                            }
                        </SelectInput>
                    </div>
                    <div className="col-lg-2 col-md-2 col-xs-4">
                        <TextInput
                            floatingText={translate.votes}
                            type="number"
                            errorText={errors.numParticipations}
                            value={participant.numParticipations}
                            onChange={(event) => this.updateState({
                                numParticipations: event.nativeEvent.target.value
                            })}
                        />
                    </div>
                    <div className="col-lg-2 col-md-2 col-xs-4">                    
                        {censusHasParticipations(this.props.census) &&
                            <TextInput
                                floatingText={translate.social_capital}
                                type="number"
                                errorText={errors.socialCapital}
                                value={participant.socialCapital}
                                onChange={(event) => this.updateState({
                                    socialCapital: event.nativeEvent.target.value
                                })}
                            />
                        }
                    </div>
                </div>
            );
        }

        return(
            <div className="row">
                <div className="col-lg-4 col-md-4 col-xs-12">
                    <TextInput
                        floatingText={translate.name}
                        type="text"
                        errorText={errors.name}
                        value={participant.name}
                        onChange={(event) => this.updateState({
                            name: event.nativeEvent.target.value
                        })}
                    />
                </div>
                <div className="col-lg-4 col-md-4 col-xs-12">                
                    <TextInput
                        floatingText={translate.surname}
                        type="text"
                        errorText={errors.surname}
                        value={participant.surname}
                        onChange={(event) => this.updateState({
                            surname: event.nativeEvent.target.value
                        })}
                    />
                </div>
                <div className="col-lg-4 col-md-4 col-xs-12">                
                    <TextInput
                        floatingText={translate.new_dni}
                        type="text"
                        errorText={errors.dni}
                        value={participant.dni}
                        onChange={(event) => this.updateState({
                            dni: event.nativeEvent.target.value
                        })}
                    />
                </div>
                <div className="col-lg-3 col-md-3 col-xs-12">
                    <TextInput
                        floatingText={translate.position}
                        type="text"
                        errorText={errors.position}
                        value={participant.position}
                        onChange={(event) => this.updateState({
                            position: event.nativeEvent.target.value
                        })}
                    />
                </div>
                <div className="col-lg-4 col-md-4 col-xs-12">                
                    <TextInput
                        floatingText={translate.email}
                        type="text"
                        errorText={errors.email}
                        value={participant.email}
                        onChange={(event) => this.updateState({
                            email: event.nativeEvent.target.value
                        })}
                    />
                </div>
                <div className="col-lg-3 col-md-3 col-xs-6">                
                    <TextInput
                        floatingText={translate.phone}
                        type="text"
                        errorText={errors.phone}
                        value={participant.phone}
                        onChange={(event) => this.updateState({
                            phone: event.nativeEvent.target.value
                        })}
                    />
                </div>
                <div className="col-lg-2 col-md-2 col-xs-4">                
                    <SelectInput
                        floatingText={translate.language}
                        value={participant.language}
                        onChange={(event) => this.updateState({
                            language: event.target.value
                        })}
                    >
                        {this.props.data.languages.map((language) => {
                                return <MenuItem value={language.columnName} key={`language_${language.columnName}`}>{language.desc}</MenuItem>
                            })
                        }
                    </SelectInput>
                </div>
                <div className="col-lg-2 col-md-2 col-xs-4">                
                    <TextInput
                        floatingText={translate.votes}
                        type="number"
                        errorText={errors.numParticipations}
                        value={participant.numParticipations}
                        onChange={(event) => this.updateState({
                            numParticipations: event.nativeEvent.target.value
                        })}
                    />
                </div>
                <div className="col-lg-2 col-md-2 col-xs-4">                
                    {censusHasParticipations(this.props.census) &&
                        <TextInput
                            floatingText={translate.social_capital}
                            type="number"
                            errorText={errors.socialCapital}
                            value={participant.socialCapital}
                            onChange={(event) => this.updateState({
                                socialCapital: event.nativeEvent.target.value
                            })}
                        />
                    }
                </div>
            </div>
        );
    }

    _renderBody(){
        return(
            <Fragment>
                {this._renderAddParticipantTypeSelector()}
                {this._renderAddParticipantForm()}
                <RepresentativeForm
                    translate={this.props.translate}
                    state={this.state.representative}
                    updateState={this.updateRepresentative}
                    errors={this.state.representativeErrors}
                    languages={this.props.data.languages}
                />
            </Fragment>
        )
    }

    render(){
        const { translate } = this.props;
        const primary = getPrimary();

        return(
            <Fragment>
                <BasicButton
                    text={translate.add_participant}
                    color={'white'}
                    textStyle={{color: primary, fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    textPosition="after"
                    icon={<ButtonIcon type="add" color={primary} />}
                    onClick={() => this.setState({modal: true})}
                    buttonStyle={{marginRight: '1em', border: `2px solid ${primary}`}}
                />
                <AlertConfirm
                    requestClose={() => this.setState({modal: false})}
                    open={this.state.modal}
                    fullWidth={false}
                    acceptAction={this.addCensusParticipant}
                    buttonAccept={translate.accept}
                    buttonCancel={translate.cancel}
                    bodyText={this._renderBody()}
                    title={translate.census}
                />
            </Fragment>
        )
    }

}

export default compose(
    graphql(addCensusParticipant, {
        name: 'addCensusParticipant',
        options: {
            errorPolicy: 'all'
        }
    }),
    graphql(languages)
)(AddCensusParticipantButton);

const newParticipantInitialValues = { 
    name: '',
    surname: '',
    position: '',
    email: '',
    phone: '',
    dni: '',
    type: 0,
    delegateId: null,
    numParticipations: 1,
    socialCapital: null,
    uuid: null,
    delegateUuid: null,
    language: 'es',
    city: '',
    personOrEntity: 0 
};