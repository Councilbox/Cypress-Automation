import React, { Component } from 'react';
import { BasicButton, Table, LoadingSection, ErrorWrapper, ButtonIcon, Grid, GridItem } from "../displayComponents";
import { graphql, compose } from 'react-apollo';
import { TableRow, TableCell } from 'material-ui/Table';
import { Typography, IconButton } from 'material-ui';
import { councilStepThree, updateCouncil, removeAgenda } from '../../queries';
import { getPrimary, getSecondary } from '../../styles/colors';
import NewAgendaPointModal from './NewAgendaPointModal';
import PointEditor from './PointEditor';
import { ModeEdit, DeleteForever } from 'material-ui-icons';
import * as CBX from '../../utils/CBX';
import ReorderPointsModal from '../councilLive/ReorderPointsModal';
import icon from '../../assets/img/reorder.PNG';


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
                description: '',
                emptyAgendas: ''
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
            this.setState({
                errors: {
                    ...this.state.errors,
                    emptyAgendas: this.props.translate.required_agendas
                }
            })
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
        const { votingTypes, errors, council, majorityTypes, draftTypes } = this.props.data;
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
                <Grid>
                    <GridItem xs={12} lg={12} md={12}>
                        <Typography variant="title" gutterBottom>
                            {translate.agenda}
                        </Typography>
                    </GridItem>
                    <GridItem xs={12} lg={12} md={12} style={{display: 'flex', flexDirection: 'row'}}>
                        <NewAgendaPointModal
                            translate={translate}
                            agendas={council.agendas}
                            votingTypes={votingTypes}
                            majorityTypes={majorityTypes}
                            draftTypes={draftTypes}
                            statute={council.statute}
                            company={this.props.company}
                            companyStatutes={this.props.data.companyStatutes}
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
                        {CBX.canReorderPoints(council) &&
                            <ReorderPointsModal
                                translate={translate}
                                agendas={council.agendas}
                                councilID={this.props.councilID}
                                refetch={this.props.data.refetch}
                                style={{marginLeft: '0.8em'}}
                            >
                                <BasicButton
                                    type="raised"
                                    text={translate.reorder_agenda_points}
                                    color={primary}
                                    icon={<ButtonIcon type="cached" color="white" />}                                
                                    textStyle={{color: 'white', fontWeight: '700', textTransform: 'none'}}
                                />
                            </ReorderPointsModal>
                        }
                    </GridItem>
                </Grid>
                {this.state.agendas.length > 0?
                    <Table
                        headers={[
                            {name: translate.convene_header},
                            {name: translate.description},
                            {},
                            {}
                        ]}
                    >
                        {this.state.agendas.map((agenda, index) => {
                            return (
                                <TableRow                         
                                    key={`agenda_${agenda.id}`} 
                                    style={{cursor: 'pointer'}}
                                    hover
                                    onClick={() => this.setState({edit: true, editIndex: index})}
                                >
                                    <TableCell style={{padding: 0}}>{agenda.agendaSubject}</TableCell>
                                    <TableCell><div dangerouslySetInnerHTML={{ __html: agenda.description }} /></TableCell>
                                    <TableCell>{translate[votingTypes.find((item) => item.value === agenda.subjectType).label]}</TableCell>                                
                                    <TableCell><IconButton onClick={(event) => {event.stopPropagation();this.removeAgenda(agenda.id)}}><DeleteForever style={{color: secondary }} /></IconButton></TableCell>                  
                                </TableRow>
                            )
                        })}
                    </Table>
                :
                    <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2em', marginBottom: '3em'}}>
                        <Typography variant="subheading">
                            {translate.empty_agendas}
                        </Typography>
                        <Typography variant="body1" style={{color: 'red'}}>
                            {this.state.errors.emptyAgendas}
                        </Typography>
                    </div>
                }

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
                    statute={council.statute}
                    agenda={council.agendas[this.state.editIndex]}
                    votingTypes={votingTypes}
                    majorityTypes={majorityTypes}                    
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
                id: props.councilID,
                companyId: props.company.id
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