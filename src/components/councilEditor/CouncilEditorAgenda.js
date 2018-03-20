import React, { Component, Fragment } from 'react';
import { TextInput, BasicButton, Table, DeleteIcon, SelectInput, LoadingSection, RichTextInput, ErrorWrapper, ButtonIcon } from "../displayComponents";
import { graphql, compose } from 'react-apollo';
import { TableRow, TableCell } from 'material-ui/Table';
import { MenuItem, Typography } from 'material-ui';
import { councilStepThree, updateCouncil, removeAgenda } from '../../queries';
import { getPrimary } from '../../styles/colors';
import NewAgendaPointModal from './NewAgendaPointModal';
import Divider from 'material-ui/Divider';


class CouncilEditorAgenda extends Component {

    constructor(props){
        super(props);
        this.state = {
            votingTypes: [],
            snackbar: true,
            agendas: [],
            errors: {
                agendaSubject: '',
                description: ''
            }
        }
    }

    componentWillReceiveProps(nextProps){
        if(!nextProps.data.loading){
            this.setState({
                agendas: nextProps.data.council.agendas
            });
        }
    }

    updateCouncil = () => {
        const { __typename, agendas, statute, ...council } = this.props.data.council;
        
        this.props.updateCouncil({
            variables: {
                council: {
                    ...council,
                    step: this.props.actualStep > 3? this.props.actualStep : 3
                }
            }
        })
    }

    removeAgenda = async (agendaId) => {
        const response = await this.props.removeAgenda({
            variables: {
                agendaId: agendaId,
                councilId: this.props.councilID
            }
        })

        if(response){
            this.props.data.refetch();
        }
    }

    nextPage = () => {
        if(this.checkConditions()){
            this.updateCouncil();
            this.props.nextStep();
        }
    }

    checkConditions = () => {
        if(this.state.agendas.length === 0 ){
            return false;
        }

        return true;
    }

    previousPage = () => {
        if(true){
            this.updateCouncil();
            this.props.previousStep();
        }
    }

    _renderAgendaBlock(agenda, index){
        const errors = this.state.errors;
        const { translate } = this.props;
        const { votingTypes } = this.props.data;

        /*
                <div onClick={() => this.removeAgenda(agenda.id)}>
                    X
                </div>
        */

        return(
            <div key={`agenda${agenda.id}`} style={{width: '90%', position: 'relative', padding: '1.5em', border: `1px solid ${getPrimary()}`, borderRadius: '4px'}} className="row">
                <div onClick={() => this.removeAgenda(agenda.id)} style={{position: 'absolute', top: '10px', right: '10px'}}>
                    X
                </div>
                <div className="col-lg-6 col-md-6 col-xs-6" style={{height: '5em', display: 'flex', aligItems: 'center'}}>
                    <TextInput
                        floatingText={translate.convene_header}
                        type="text"
                        errorText={errors.agendaSubject}
                        value={agenda.agendaSubject}
                        onChange={(event) => {
                            let agendas = [...this.state.agendas];
                            let newAgenda = {...agendas[index]};
                            newAgenda.agendaSubject = event.nativeEvent.target.value;
                            agendas[index] = newAgenda;
                            this.setState({
                                agendas: agendas
                            })
                        }}
                    />
                </div>
                <div className="col-lg-3 col-md-4 col-xs-6" style={{height: '5em', display: 'flex', aligItems: 'center'}}>
                    <SelectInput
                        floatingText={translate.type}
                        value={agenda.subjectType}
                        onChange={(event, position, value) => {
                            let agendas = [...this.state.agendas];
                            let newAgenda = {...agendas[index]};
                            newAgenda.subjectType = event.target.value;
                            agendas[index] = newAgenda;
                            this.setState({
                                agendas: agendas
                            }) 
                        }}
                    >
                        {votingTypes.map((voting) => {
                                return <MenuItem value={voting.value} key={`voting${voting.value}`}>{translate[voting.label]}</MenuItem>
                            })
                        }
                    </SelectInput>
                </div>

                <div className="col-lg-12 col-md-12 col-xs-12">
                    <RichTextInput
                        floatingText={translate.description}
                        type="text"
                        errorText={errors.description}
                        value={agenda.description}
                        onChange={(value) => {                     
                            let agendas = [...this.state.agendas];
                            let newAgenda = {...agendas[index]};
                            newAgenda.description = value;
                            agendas[index] = newAgenda;
                            this.setState({
                                agendas: agendas
                            })
                        }}
                    />
                </div>
            </div>
        );
    }

    render(){
        const { translate } = this.props;
        const { votingTypes, errors, council } = this.props.data;
        const primary = getPrimary();

        if(this.props.data.loading){
            return(
                <LoadingSection />
            );
        }

        if(errors){
            return(
                <ErrorWrapper error={this.props.data.errors.graph} />
            )
        }
        

        return(
            <div style={{width: '100%', height: '100%', padding: '2em'}} >
                <div className="row">
                    <div className="col-lg-2 col-md-3 col-xs-6" style={{height: '4em', display: 'flex', alignItems: 'center'}}>
                        <Typography variant="title" gutterBottom>
                            {translate.agenda}
                        </Typography>
                    </div>
                    <div className="col-lg-8 col-md-7 col-xs-5" style={{height: '4em', display: 'flex', alignItems: 'center'}}>
                        <NewAgendaPointModal
                            translate={translate}
                            agendas={council.agendas}
                            votingTypes={votingTypes}
                            councilID={this.props.councilID}
                            refetch={this.props.data.refetch}
                        >
                            <BasicButton
                                type="raised"
                                text={translate.add_agenda_point}
                                color={primary}
                                icon={<ButtonIcon type="add" color="white" />}                                
                                textStyle={{color: 'white', fontWeight: '700', textTransform: 'none'}}
                            />
                        </NewAgendaPointModal>
                    </div>
                </div>
                <Table
                    headers={[{},{},{}]}
                >
                    {this.state.agendas.map((agenda, index) => {
                        return (
                            <TableRow                         
                                key={`agenda_${agenda.id}`} 
                            >
                                <TableCell>{agenda.agendaSubject}</TableCell>
                                <TableCell><div dangerouslySetInnerHTML={{ __html: agenda.description }} /></TableCell>
                                <TableCell>Delete</TableCell>                  
                            </TableRow>
                        )
                    })}
                </Table>

                <div className="row" style={{marginTop: '2em'}}>
                    <div className="col-lg-12 col-md-12 col-xs-12">
                        <div style={{float: 'right'}}>
                            <BasicButton
                                text={translate.previous}
                                color={primary}
                                textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                                textPosition="after"
                                onClick={this.previousPage}
                            />
                            <BasicButton
                                text={translate.save}
                                color={primary}
                                textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', marginLeft: '0.5em', marginRight: '0.5em', textTransform: 'none'}}
                                icon={<ButtonIcon type="save" color="white" />}
                                textPosition="after"
                                onClick={this.updateCouncil} 
                            />
                            <BasicButton
                                text={translate.next}
                                color={primary}
                                textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                                textPosition="after"
                                onClick={this.nextPage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default compose(
    graphql(councilStepThree, {
        name: "data",
        options: (props) => ({
            variables: {
                id: props.councilID
            }
        })
    }),
    graphql(removeAgenda, {
        name: 'removeAgenda'
    }),
    graphql(updateCouncil, {
        name: 'updateCouncil'
    })
)(CouncilEditorAgenda);

//this._renderAgendaBlock(agenda, index);