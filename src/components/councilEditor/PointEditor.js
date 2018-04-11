import React, { Component, Fragment } from 'react';
import { graphql } from 'react-apollo';
import { AlertConfirm, SelectInput, TextInput, RichTextInput } from '../displayComponents';
import { MenuItem } from 'material-ui';
import { updateAgenda } from '../../queries';
import * as CBX from '../../utils/CBX';


class PointEditor extends Component {

    constructor(props){
        super(props);
        this.state = {
            data: {
                agendaSubject: '',
                subjectType: '',
                description: ''
            },

            errors: {
                agendaSubject: '',
                subjectType: '',
                description: ''
            }
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            data: {
                ...nextProps.agenda
            }
        })
    }

    saveChanges = async () => {
        if(this.checkRequiredFields()){
            const { __typename, ...data } = this.state.data;
            const response = await this.props.updateAgenda({
                variables: {
                    agenda: {
                        ...data
                    }
                }
            });
            if(response){
                this.props.refetch();
                this.props.requestClose();
            }
        }
    }

    checkRequiredFields() {
        return true;
    }

    _renderModalBody = () => {
        const { translate, votingTypes, statute } = this.props;
        const errors = this.state.errors;
        const agenda = this.state.data;

        const filteredTypes = CBX.filterAgendaVotingTypes(votingTypes, statute);
        
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
                                    data: {
                                        ...this.state.data,
                                        agendaSubject: event.target.value
                                    }
                                })
                            }}
                        />
                    </div>
                    <div className="col-lg-6 col-md-6 col-xs-12">
                        <SelectInput
                            floatingText={translate.type}
                            value={agenda.subjectType}
                            onChange={(event, child) => {
                                this.setState({
                                    data: {
                                        ...this.state.data,
                                        subjectType: event.target.value
                                    }
                                }) 
                            }}
                        >
                            {filteredTypes.map((voting) => {
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
                            data: {
                                ...this.state.data,
                                description: value
                            }
                        })
                    }}
                />
            </Fragment>
        );
    }

    render(){
        const { open, translate, requestClose } = this.props;
 
        return(
            <AlertConfirm
                requestClose={requestClose}
                open={open}
                acceptAction={this.saveChanges}
                buttonAccept={translate.accept}
                buttonCancel={translate.cancel}
                bodyText={this._renderModalBody()}
                title={translate.edit}
            />
        );
    }
}

export default graphql(updateAgenda, {name: 'updateAgenda'})(PointEditor);