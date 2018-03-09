import React, { Component } from 'react';
import { MenuItem} from 'material-ui';
import { TextInput, BasicButton, SelectInput, LoadingSection, RichTextInput, ErrorWrapper, Icon } from "../displayComponents";
import { graphql, compose } from 'react-apollo';
import { councilStepThree, updateCouncil, removeAgenda } from '../../queries';
import { getPrimary } from '../../styles/colors';
import NewAgendaPointModal from './NewAgendaPointModal';
 
class CouncilEditorAgenda extends Component {

    constructor(props){
        super(props);
        this.state = {
            votingTypes: [],
            agendas: [],
            errors: {
                agendaSubject: '',
                description: ''
            }
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            agendas: nextProps.data.council.agendas
        });
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

    addNewPoint = () => {
        const agendas = [...this.state.agendas];
        agendas.push({
            council_id: this.props.councilID,
            ...newAgendaFields
        });
        this.setState({
            agendas: agendas
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
        if(true){
            this.updateCouncil();
            this.props.nextStep();
        }
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

        return(
            <div key={`agenda${agenda.id}`} style={{width: '90%', border: `1px solid ${getPrimary()}`}}>
                <div onClick={() => this.removeAgenda(agenda.id)}>
                    X
                </div>
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

               <SelectInput
                        floatingText={translate.type}
                        value={agenda.subjectType}
                        onChange={(event, position, value) => {
                            let agendas = [...this.state.agendas];
                            let newAgenda = {...agendas[index]};
                            newAgenda.subjectType = value;
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
        );
    }

    render(){
        const { translate } = this.props;
        const { votingTypes, errors, council } = this.props.data;

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
            <div style={{width: '100%', height: '100%', padding: '2em'}}>
                {translate.agenda}
                <div style={{width: '10%', display: 'block'}}>
                    <NewAgendaPointModal
                        translate={translate}
                        agendas={council.agendas}
                        votingTypes={votingTypes}
                        councilID={this.props.councilID}
                        refetch={this.props.data.refetch}
                    />
                </div>

                <BasicButton
                    text={translate.save}
                    color={getPrimary()}
                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    icon={<Icon className="material-icons" style={{color: 'white'}}>save</Icon>}
                    textPosition="after"
                    onClick={this.updateCouncil} 
                />  

                <BasicButton
                    text={translate.previous}
                    color={getPrimary()}
                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    textPosition="after"
                    onClick={this.previousPage}
                />
                <BasicButton
                    text={translate.next}
                    color={getPrimary()}
                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    textPosition="after"
                    onClick={this.nextPage}
                />
                {this.state.agendas.map((agenda, index) => {
                    return this._renderAgendaBlock(agenda, index);
                })}

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

const newAgendaFields = {
    subjectType: 0,
    sortable: 1,
    majority_type: 1,
    majority: 1,
    majority_divider: 3,
    order_index: 6,
    description: '',
    agendaSubject: '',
    $$council_id: true,
    $$subjectType: true,
    $$sortable: true,
    $$majority_type: true,
    $$majority: true,
    $$majority_divider: true,
    $$order_index: true,
    $$description: true,
    $$agendaSubject: true,
    $$modified: true
}