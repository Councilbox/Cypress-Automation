import React, { Component, Fragment } from 'react';
import { FontIcon, MenuItem, Dialog } from 'material-ui';
import { BasicButton, SelectInput, LoadingSection, ErrorWrapper } from '../displayComponents';
import { getPrimary } from '../../styles/colors';
import { withRouter } from 'react-router-dom';
import ParticipantsTable from './ParticipantsTable';
import { councilStepTwo, participantsQuery, updateCouncil } from '../../queries';
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
        const { __typename, participants, ...council } = this.props.data.council;
        this.props.updateCouncil({
            variables: {
                council: {
                    ...council,
                    step: this.props.actualStep > 2? this.props.actualStep : 2
                }
            }
        });
    }

    handleCensusChange = (event, index, value) => {
        if(value !== this.props.data.council.selectedCensusId){
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
                censusId: this.state.censusChangeId,
                councilId: this.props.councilID 
            }
        });
        if(response){
            this.setState({
                censusChangeAlert: false
            });
            const newData = await this.props.data.refetch();
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
        const { council, loading, error, censuses } = this.props.data;

        if(loading){
            return (<LoadingSection />);
        }

        if(error){
            return (
                <div style={{width: '100%', height: '100%', padding: '2em'}}>
                    <ErrorWrapper error={error} translate={translate} />
                </div>
            );
        }

        return(
            <div style={{width: '100%', height: '100%', padding: '2em'}}>
                <SelectInput
                    floatingText={translate.current_census}
                    value={council.selectedCensusId}
                    onChange={this.handleCensusChange}
                >
                    {censuses.map((census) => {
                            return <MenuItem value={parseInt(census.id, 10)} key={`census${census.id}`}>{census.censusName}</MenuItem>
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
                    participants={council.participants}
                    councilID={this.props.councilID}
                    translate={translate}
                    refetch={this.props.data.refetch}
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
                    refetch={this.props.data.refetch}
                />
            </div>
        );
    }
}

const changeCensus = gql `
    mutation ChangeCensus($councilId: Int!, $censusId: Int!) {
        changeCensus(councilId: $councilId, censusId: $censusId)
    }
`;

export default compose(
    graphql(councilStepTwo, {
        name: "data",
        options: (props) => ({
            variables: {
                id: props.councilID,
                companyId: props.companyID
            }
        })
    }),

    graphql(changeCensus),

    graphql(updateCouncil, {
        name: 'updateCouncil'
    })

)(withRouter(CouncilEditorCensus));