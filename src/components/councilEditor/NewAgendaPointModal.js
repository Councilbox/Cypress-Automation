import React, { Component, Fragment } from 'react';
import { graphql, compose } from 'react-apollo';
import { AlertConfirm, SelectInput, TextInput, RichTextInput, AgendaNumber, LoadingSection } from '../displayComponents';
import { MenuItem } from 'material-ui';
import { votationTypes, addAgenda } from '../../queries';
import { urlParser } from '../../utils';

class NewAgendaPointModal extends Component {

    constructor(props){
        super(props);
        this.state = {
            newPoint: {
                agenda_subject: '',
                subject_type: '',
                description: ''
            },

            newPointModal: false,

            errors: {
                agenda_subject: '',
                subject_type: '',
                description: ''
            }
        }
    }
    
    addAgenda = async () => {
        const { newPoint } = this.state;
        const response = await this.props.addAgenda({
            variables: {
                data: urlParser({
                    data: {
                        council_id: this.props.councilID,
                        subject_type: newPoint.subject_type,
                        sortable: 1,
                        majority_type: 1,
                        majority: 1,
                        majority_divider: 3,
                        description: newPoint.description,
                        agenda_subject: newPoint.agenda_subject,
                        order_index: this.props.agendas.length
                    }
                })
            }
        })
        if(response){
            this.props.refetch();
            this.setState({
                newPoint: {
                    agenda_subject: '',
                    subject_type: '',
                    description: ''
                },
    
                newPointModal: false,
    
                errors: {
                    agenda_subject: '',
                    subject_type: '',
                    description: ''
                }

            })
        }
    }

    _renderNewPointBody = () => {
        const { translate } = this.props;
        const errors = this.state.errors;
        const agenda = this.state.newPoint;

        if(!this.props.votation.votationTypes){
            return (
                <LoadingSection />
            );
        }
        
        return(
            <Fragment>
                <div className="row"> 
                    <div className="col-lg-6 col-md-6 col-xs-12">
                        <TextInput
                            floatingText={translate.convene_header}
                            type="text"
                            errorText={errors.agenda_subject}
                            value={agenda.agenda_subject}
                            onChange={(event) => {
                                this.setState({
                                    newPoint: {
                                        ...this.state.newPoint,
                                        agenda_subject: event.nativeEvent.target.value
                                    }
                                })
                            }}
                        />
                    </div>
                    <div className="col-lg-6 col-md-6 col-xs-12">
                        <SelectInput
                            floatingText={translate.type}
                            value={agenda.subject_type}
                            onChange={(event, position, value) => {
                                this.setState({
                                    newPoint: {
                                        ...this.state.newPoint,
                                        subject_type: value
                                    }
                                }) 
                            }}
                        >
                            {this.props.votation.votationTypes.map((voting) => {
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

export default compose(
    graphql(votationTypes, {
        name: 'votation'
    }),
    graphql(addAgenda, {
        name: 'addAgenda'
    })
)(NewAgendaPointModal);