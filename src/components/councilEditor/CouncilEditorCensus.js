import React, { Component, Fragment } from 'react';
import { MenuItem, Typography } from 'material-ui';
import { BasicButton, SelectInput, LoadingSection, ErrorWrapper, ButtonIcon, Grid, GridItem } from '../displayComponents';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import { getPrimary } from '../../styles/colors';
import { withRouter } from 'react-router-dom';
import ParticipantsTable from './ParticipantsTable';
import * as CBX from '../../utils/CBX';
import { councilStepTwo, updateCouncil } from '../../queries';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import NewParticipantForm from './NewParticipantForm';


class CouncilEditorCensus extends Component {

    constructor(props){
        super(props);
        this.state = {
            placeModal: false,
            censusChangeAlert: false,
            addParticipant: false,
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
            addParticipant: false
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

    handleCensusChange = (event) => {
        if(event.target.value !== this.props.data.council.selectedCensusId){
            this.setState({
                censusChangeAlert: true,
                censusChangeId: event.target.value
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
                    icon={<ButtonIcon type="save" color="white" />}
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
                {this.state.addParticipant? 
                    <NewParticipantForm
                        translate={translate}
                        requestClose={() => this.setState({
                            addParticipant: false
                        })}
                        participations={CBX.hasParticipations(council)}
                        close={this.closeAddParticipantModal}
                        councilID={this.props.councilID}
                        refetch={this.props.data.refetch}
                    />
                :
                    <Fragment>
                        <Grid>
                            <GridItem lg={3} md={3} xs={6} style={{height: '4em', verticalAlign: 'middle'}}>
                                <SelectInput
                                    floatingText={translate.current_census}
                                    value={council.selectedCensusId}
                                    onChange={this.handleCensusChange}
                                >
                                    {censuses.list.map((census) => {
                                            return <MenuItem value={parseInt(census.id, 10)} key={`census${census.id}`}>{census.censusName}</MenuItem>
                                        })
                                    }
                                </SelectInput>
                            </GridItem>
                            <GridItem lg={3} md={3} xs={6} style={{height: '4em', display: 'flex', alignItems: 'center'}}>
                                <BasicButton
                                    text={translate.add_participant}
                                    color={getPrimary()}
                                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                                    icon={<ButtonIcon type="add" color="white" />}
                                    textPosition="after"
                                    onClick={() => this.setState({ addParticipant: true})} 
                                />
                            </GridItem>
                            <GridItem lg={3} md={3} xs={6} style={{height: '4em', display: 'flex', alignItems: 'center'}}>
                                <Typography variant="body2">
                                    {`${translate.total_votes}: ${this.props.data.councilTotalVotes}`}
                                </Typography>
                            </GridItem>
                            {CBX.hasParticipations(council) &&
                                <GridItem lg={3} md={3} xs={6} style={{height: '4em', display: 'flex', alignItems: 'center'}}>
                                    <Typography variant="body2">
                                        {`${translate.total_social_capital}: ${this.props.data.councilSocialCapital}`}
                                    </Typography>
                                </GridItem>
                            }
                        </Grid>
                        <ParticipantsTable
                            councilId={this.props.councilID}
                            translate={translate}
                            totalVotes={this.props.data.councilTotalVotes}
                            socialCapital={this.props.data.councilSocialCapital}
                            participations={CBX.hasParticipations(council)}
                            refetch={this.props.data.refetch}
                        />
                        <div className="row" style={{marginTop: '2em'}}>
                            <div className="col-lg-12 col-md-12 col-xs-12">
                                <div style={{float: 'right'}}>
                                    <BasicButton
                                        text={translate.previous}
                                        color={getPrimary()}
                                        textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                                        textPosition="after"
                                        onClick={this.previousPage}
                                    />
                                    <BasicButton
                                        text={translate.save}
                                        color={getPrimary()}
                                        textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', marginLeft: '0.5em', marginRight: '0.5em', textTransform: 'none'}}
                                        icon={<ButtonIcon type="save" color="white" />}
                                        textPosition="after"
                                        onClick={this.saveDraft} 
                                    />
                                    <BasicButton
                                        text={translate.table_button_next}
                                        color={getPrimary()}
                                        textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                                        textPosition="after"
                                        onClick={this.nextPage}
                                    />
                                </div>
                            </div>
                        </div>
                        <Dialog
                            disableBackdropClick={false}
                            open={this.state.censusChangeAlert}
                            onClose={() => this.setState({censusChangeAlert: false})}
                        >
                            <DialogTitle>
                                {translate.census_change}
                            </DialogTitle>
                            <DialogContent>
                                {translate.census_change_warning.replace('<br/>', '')}
                            </DialogContent>
                            <DialogActions>
                                {this._renderCensusChangeButtons()}
                            </DialogActions>
                        </Dialog>
                    </Fragment>
                }
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