import React, { Component, Fragment } from 'react';
import { graphql } from 'react-apollo';
import { AlertConfirm, SelectInput, TextInput, RichTextInput, AgendaNumber } from '../displayComponents';
import { MenuItem } from 'material-ui';
import { addAgenda } from '../../queries';


class NewAgendaPointModal extends Component {

    constructor(props){
        super(props);
        this.state = {
            newPoint: {
                agendaSubject: '',
                subjectType: '',
                description: ''
            },

            newPointModal: false,

            errors: {
                agendaSubject: '',
                subjectType: '',
                description: ''
            }
        }
    }
    
    addAgenda = async () => {
        const { newPoint } = this.state;
        const response = await this.props.addAgenda({
            variables: {
                agenda: {
                    councilId: this.props.councilID,
                    subjectType: newPoint.subjectType,
                    sortable: 1,
                    majorityType: 1,
                    majority: 1,
                    majorityDivider: 3,
                    description: newPoint.description,
                    agendaSubject: newPoint.agendaSubject,
                    orderIndex: this.props.agendas.length + 1
                }
            }
        })
        if(response){
            this.props.refetch();
            this.setState({
                newPoint: {
                    agendaSubject: '',
                    subjectType: '',
                    description: ''
                },
    
                newPointModal: false,
    
                errors: {
                    agendaSubject: '',
                    subjectType: '',
                    description: ''
                }

            })
        }
    }

    _renderNewPointBody = () => {
        const { translate } = this.props;
        const errors = this.state.errors;
        const agenda = this.state.newPoint;
        
        return(
            <Fragment>
                <div className="row"> 
                    <div className="col-lg-6 col-md-6 col-xs-12">
                        <TextInput
                            floatingText={translate.convene_header}
                            type="text"
                            errorText={errors.agendaSubject}
                            value={agenda.agendaSubject}
                            onChange={(event) => {
                                this.setState({
                                    newPoint: {
                                        ...this.state.newPoint,
                                        agendaSubject: event.nativeEvent.target.value
                                    }
                                })
                            }}
                        />
                    </div>
                    <div className="col-lg-6 col-md-6 col-xs-12">
                        <SelectInput
                            floatingText={translate.type}
                            value={agenda.subjectType}
                            onChange={(event, position, value) => {
                                this.setState({
                                    newPoint: {
                                        ...this.state.newPoint,
                                        subjectType: value
                                    }
                                }) 
                            }}
                        >
                            {this.props.votingTypes.map((voting) => {
                                    return <MenuItem value={voting.value} key={`voting${voting.value}`}>{translate[voting.label]}</MenuItem>
                                })
                            }
                        </SelectInput>
                    </div>
                </div>

                <RichTextInput
                    floatingText={translate.description}
                    type="text"
                    errorText={errors.description}
                    value={agenda.description}
                    onChange={(value) => {                     
                        this.setState({
                            newPoint: {
                                ...this.state.newPoint,
                                description: value
                            }
                        })
                    }}
                />
            </Fragment>
        );
    }

    render(){
        const { translate } = this.props;
 
        return(
            <Fragment>
                <div style={{marginTop: '1em'}}>
                    <AgendaNumber
                        index={'+'}
                        active={false}
                        onClick={() => this.setState({newPointModal: true})}
                        secondaryColor={'#888888'}
                    />
                </div>
                <AlertConfirm
                    requestClose={() => this.setState({newPointModal: false})}
                    open={this.state.newPointModal}
                    acceptAction={this.addAgenda}
                    buttonAccept={translate.accept}
                    buttonCancel={translate.cancel}
                    bodyText={this._renderNewPointBody()}
                    title={translate.new_point}
                />
            </Fragment>
        );
    }
}

export default graphql(addAgenda, {
    name: 'addAgenda' 
})(NewAgendaPointModal);