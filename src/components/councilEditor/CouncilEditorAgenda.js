import React, { Component } from 'react';
import { BasicButton, Table, LoadingSection, ErrorWrapper, ButtonIcon } from "../displayComponents";
import { graphql, compose } from 'react-apollo';
import { TableRow, TableCell } from 'material-ui/Table';
import { Typography, IconButton } from 'material-ui';
import { councilStepThree, updateCouncil, removeAgenda } from '../../queries';
import { getPrimary, getSecondary } from '../../styles/colors';
import NewAgendaPointModal from './NewAgendaPointModal';
import PointEditor from './PointEditor';
import { ModeEdit, DeleteForever } from 'material-ui-icons';


class CouncilEditorAgenda extends Component {

    constructor(props){
        super(props);
        this.state = {
            votingTypes: [],
            edit: false,
            editIndex: 0,
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

    render(){
        const { translate } = this.props;
        const { votingTypes, errors, council } = this.props.data;
        const primary = getPrimary();
        const secondary = getSecondary();

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
                    headers={[
                        {name: translate.convene_header},
                        {name: translate.description},
                        {},
                        {},
                        {}
                    ]}
                >
                    {this.state.agendas.map((agenda, index) => {
                        return (
                            <TableRow                         
                                key={`agenda_${agenda.id}`} 
                            >
                                <TableCell style={{padding: 0}}>{agenda.agendaSubject}</TableCell>
                                <TableCell><div dangerouslySetInnerHTML={{ __html: agenda.description }} /></TableCell>
                                <TableCell>{agenda.subjectType}</TableCell>                                
                                <TableCell><IconButton onClick={() => this.setState({edit: true, editIndex: index})}><ModeEdit style={{color: secondary }} /></IconButton></TableCell>
                                <TableCell><IconButton onClick={() => this.removeAgenda(agenda.id)}><DeleteForever style={{color: secondary }} /></IconButton></TableCell>                  
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
                <PointEditor
                    translate={translate}
                    open={this.state.edit}
                    agenda={council.agendas[this.state.editIndex]}
                    votingTypes={votingTypes}
                    refetch={this.props.data.refetch}
                    requestClose={() => this.setState({edit: false})}
                />
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