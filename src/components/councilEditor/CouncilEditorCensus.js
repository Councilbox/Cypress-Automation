import React, { Component, Fragment } from 'react';
import { FontIcon, MenuItem, Dialog } from 'material-ui';
import { BasicButton, SelectInput, LoadingSection } from '../displayComponents';
import { getPrimary } from '../../styles/colors';
import { withRouter } from 'react-router-dom';
import ParticipantsTable from './ParticipantsTable';
import { getCouncilDataStepTwo, participantsQuery, saveCouncilData } from '../../queries';
import { urlParser } from '../../utils';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import NewParticipantForm from './NewParticipantForm';


class CouncilEditorCensus extends Component {

    constructor(props){
        super(props);
        this.state = {
            placeModal: false,
            censusChangeAlert: false,
            addParticipantModal: false,
            censusChangeId: '',
            data: {
                censuses: [],
            },
        }
    }

    async componentDidMount(){
        this.props.data.refetch();
    }

    componentWillReceiveProps(nextProps){
       if(this.props.data.loading && !nextProps.data.loading){
            this.setState({
                data: {
                    ...this.state.data,
                    ...nextProps.data.council
                }
            })
        }
    }

    closeAddParticipantModal = () => {
        this.setState({
            addParticipantModal: false
        });
    }

    saveDraft = () => {
        this.props.saveCouncil({
            variables: {
                data: urlParser({
                    data: {
                        ...this.props.data.council,
                        step: this.props.actualStep > 2? this.props.actualStep : 2
                    }
                })
            }
        });
    }

    handleCensusChange = (event, index, value) => {
        if(value !== this.props.data.council.council.selected_census_id){
            this.setState({
                censusChangeAlert: true,
                censusChangeId: value
            });
        }
        
    }

    nextPage = () => {
        this.saveDraft();
        this.props.nextStep();
    }

    previousPage = () => {
        this.saveDraft();
        this.props.previousStep();
    }

    sendCensusChange = async () => {
        const response = await this.props.mutate({
            variables: {
                info: {
                    censusID: this.state.censusChangeId,
                    councilID: this.props.councilID,
                    companyID: this.props.companyID
                } 
            }
        })
        if(response){
            this.props.data.loading = true;
            this.setState({
                censusChangeAlert: false
            });
            const newData = await this.props.data.refetch();
            this.props.participantList.refetch();
            if(newData){
                this.setState({
                    data: {
                        ...this.state.data,
                        ...newData.data.council
                    }
                })
            }
        }

    }

    _renderCensusChangeButtons(){
        const { translate } = this.props;

        return(
            <Fragment>
                <BasicButton
                    text={translate.cancel}
                    color={'white'}
                    textStyle={{color: getPrimary(), fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    textPosition="after"
                    onClick={() => this.setState({censusChangeAlert: false})}
                    buttonStyle={{marginRight: '1em'}}
                />
                <BasicButton
                    text={translate.want_census_change}
                    color={getPrimary()}
                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    icon={<FontIcon className="material-icons">cached</FontIcon>}
                    textPosition="after"
                    onClick={this.sendCensusChange} 
                />
            </Fragment>
        );
    }

    render(){
        const { translate } = this.props;

        if(this.props.data.loading || this.props.participantList.loading){
            return(
                <LoadingSection />
            );
        }

        return(
            <div style={{width: '100%', height: '100%', padding: '2em'}}>
                <SelectInput
                    floatingText={translate.current_census}
                    value={this.props.data.council.council.selected_census_id}
                    onChange={this.handleCensusChange}
                >
                    {
                        this.props.data.council.censuses.map((census) => {
                            return <MenuItem value={parseInt(census.id, 10)} key={`census${census.id}`}>{census.census_name}</MenuItem>
                        })
                    }
                </SelectInput>
                <BasicButton
                    text={translate.add_participant}
                    color={getPrimary()}
                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    icon={<FontIcon className="material-icons">add</FontIcon>}
                    textPosition="after"
                    onClick={() => this.setState({ addParticipantModal: true})} 
                />
                <BasicButton
                    text={translate.save}
                    color={getPrimary()}
                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    icon={<FontIcon className="material-icons">save</FontIcon>}
                    textPosition="after"
                    onClick={this.saveDraft} 
                />
                <BasicButton
                    text={translate.previous}
                    color={getPrimary()}
                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    textPosition="after"
                    onClick={this.previousPage}
                />
                <BasicButton
                    text={translate.table_button_next}
                    color={getPrimary()}
                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    textPosition="after"
                    onClick={this.nextPage}
                />
                <ParticipantsTable
                    participants={this.props.participantList.participants}
                    councilID={this.props.councilID}
                    translate={translate}
                    refetch={this.props.participantList.refetch}
                />
                <Dialog
                    actions={this._renderCensusChangeButtons()}
                    modal={false}
                    title={translate.census_change}
                    open={this.state.censusChangeAlert}
                    onRequestClose={() => this.setState({censusChangeAlert: false})}
                    >
                    {translate.census_change_warning.replace('<br/>', '')}
                </Dialog>
                <NewParticipantForm
                    translate={translate}
                    show={this.state.addParticipantModal}
                    close={this.closeAddParticipantModal}
                    councilID={this.props.councilID}
                    refetch={this.props.participantList.refetch}
                />
            </div>
        );
    }
}

const changeCensus = gql `
    mutation ChangeCensus( $info: CensusInfo) {
        changeCensus( info: $info)
    }
`;

export default compose(
    graphql(participantsQuery, {
        name: "participantList",
        options: (props) => ({
            variables: {
                councilID: props.councilID
            }
        })
    }),
    
    
    graphql(getCouncilDataStepTwo, {
        name: "data",
        options: (props) => ({
            variables: {
                councilInfo: {
                    companyID: props.companyID,
                    councilID: props.councilID,
                    step: 2
                }
            }
        })
    }),

    graphql(changeCensus),

    graphql(saveCouncilData, {
        name: 'saveCouncil'
    })

)(withRouter(CouncilEditorCensus));