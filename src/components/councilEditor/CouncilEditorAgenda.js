import React, { Component } from 'react';
import { FontIcon, MenuItem} from 'material-ui';
import { TextInput, BasicButton, SelectInput, LoadingSection } from "../displayComponents";
import { graphql, compose } from 'react-apollo';
import CouncilboxApi from '../../api/CouncilboxApi';
import { getCouncilDataStepThree, saveCouncilData } from '../../queries';
import { urlParser } from '../../utils';
 
class CouncilEditorAgenda extends Component {

    constructor(props){
        super(props);
        this.state = {
            votingTypes: [],
            agendas: [],
            errors: {
                agenda_subject: '',
                description: ''
            }
        }
    }


    async componentDidMount(){
        this.props.data.refetch();
        const votingTypes = await CouncilboxApi.getVotingTypes();
        this.setState({
            votingTypes: votingTypes
        });
    }

    componentWillReceiveProps(nextProps){
        if(this.props.data.loading && !nextProps.data.loading){
            this.setState({
                agendas: nextProps.data.council.agendas
            });
        }
    }

    saveAgendas = () => {
        this.props.saveCouncil({
            variables: {
                data: urlParser({
                    data: {
                        council: this.props.data.council.council,
                        agendas: this.state.agendas
                    }
                })
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

    nextPage = () => {
        if(true){
            this.saveAgendas();
            this.props.nextStep();
        }
    }

    _renderAgendaBlock(agenda, index){
        const errors = this.state.errors;
        const { translate } = this.props;

        return(
            <div key={`agenda${agenda.id}`} style={{width: '90%', border: '1px solid purple'}}>
                <TextInput
                    floatingText={translate.convene_header}
                    type="text"
                    errorText={errors.agenda_subject}
                    value={agenda.agenda_subject}
                    onChange={(event) => {
                        let agendas = [...this.state.agendas];
                        let newAgenda = {...agendas[index]};
                        newAgenda.agenda_subject = event.nativeEvent.target.value;
                        agendas[index] = newAgenda;
                        this.setState({
                            agendas: agendas
                        })
                    }}
                />

               <SelectInput
                        floatingText={translate.type}
                        value={agenda.subject_type}
                        onChange={(event, position, value) => {
                            let agendas = [...this.state.agendas];
                            let newAgenda = {...agendas[index]};
                            newAgenda.subject_type = value;
                            agendas[index] = newAgenda;
                            this.setState({
                                agendas: agendas
                            }) 
                        }}
                    >
                        {this.state.votingTypes.map((voting) => {
                                return <MenuItem value={voting.value} key={`voting${voting.value}`}>{translate[voting.label]}</MenuItem>
                            })
                        }
                </SelectInput>

                <TextInput
                    floatingText={translate.description}
                    type="text"
                    errorText={errors.description}
                    value={agenda.description}
                    onChange={(event) => {                     
                        let agendas = [...this.state.agendas];
                        let newAgenda = {...agendas[index]};
                        newAgenda.description = event.nativeEvent.target.value;
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
        if(this.props.data.loading){
            return(
                <LoadingSection />
            );
        }

        const { translate } = this.props;

        return(
            <div style={{width: '100%', height: '100%', padding: '2em'}}>
                {translate.agenda}
                <BasicButton
                    text={translate.add_agenda_point}
                    color={'purple'}
                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    icon={<FontIcon className="material-icons">add</FontIcon>}
                    textPosition="after"
                    onClick={this.addNewPoint} 
                />

                <BasicButton
                    text={translate.save}
                    color={'purple'}
                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    icon={<FontIcon className="material-icons">save</FontIcon>}
                    textPosition="after"
                    onClick={this.saveAgendas} 
                />  

                <BasicButton
                    text={translate.previous}
                    color={'purple'}
                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    textPosition="after"
                    onClick={this.props.previousStep}
                />
                <BasicButton
                    text={translate.next}
                    color={'purple'}
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
    graphql(getCouncilDataStepThree, {
        name: "data",
        options: (props) => ({
            variables: {
                councilInfo: {
                    companyID: props.companyID,
                    councilID: props.councilID,
                    step: 3
                }
            }
        })
    }),

    graphql(saveCouncilData, {
        name: 'saveCouncil'
    })
)(CouncilEditorAgenda);

const newAgendaFields = {
    subject_type: 0,
    sortable: 1,
    majority_type: 1,
    majority: 1,
    majority_divider: 3,
    order_index: 6,
    description: '',
    agenda_subject: '',
    $$council_id: true,
    $$subject_type: true,
    $$sortable: true,
    $$majority_type: true,
    $$majority: true,
    $$majority_divider: true,
    $$order_index: true,
    $$description: true,
    $$agenda_subject: true,
    $$modified: true
}