import React, { Component } from 'react';
import { Grid, GridItem, Icon, TextInput, LoadingSection, Radio } from '../../../displayComponents';
import { getSecondary } from '../../../styles/colors';
import { Card, Typography, MenuItem, Tooltip } from 'material-ui';
import { liveParticipants } from '../../../queries';
import { graphql } from 'react-apollo';
import * as CBX from '../../../utils/CBX';
import ParticipantStateIcon from './ParticipantStateIcon';
import LiveParticipantEditor from './LiveParticipantEditor';
import Scrollbar from 'react-perfect-scrollbar';


class ParticipantsManager extends Component {

    constructor(props){
        super(props);
        this.state = {
            filterText: '',
            participantType: 'all',
            participantState: 'all',
            editParticipant: undefined
        }
    }

    componentDidMount() {
        this.props.data.refetch();
    }

    updateFilterText = async (value) => {
        this.setState({
            filterText: value
        });

        /*let variables = {
            filters: [ {
                field: 'fullName',
                text: value
            } ]
        };*/
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => this.refresh(), 450);
    };

    editParticipant = (id) => {
        this.setState({
            editParticipant: id
        });
    }

    updateParticipantType = (value) => {
        this.setState({
            participantType: value
        }, this.refresh());

        let variables = {
            filters: []
        }

        /*if(value !== 'all'){
            variables.filters = [
                {field: 'type', text: +value}
            ]
        }

        if(this.state.participantState !== 'all'){
            variables.filters = [
                ...variables.filters,
                {field: 'state', text: +this.state.participantState}
            ]
        }

        this.props.data.refetch(variables);*/
    }

    refresh = () => {
        let variables = {
            filters: []
        }

        if(this.state.participantType !== 'all'){
            variables.filters = [
                {field: 'type', text: +this.state.participantType}
            ]
        }

        if(this.state.participantState !== 'all'){
            variables.filters = [
                ...variables.filters,
                {field: 'state', text: +this.state.participantState}
            ]
        }

        if(this.state.filterText){
            variables.filters = [
                ...variables.filters,
                {field: 'fullName', text: this.state.filterText}
            ]
        }

        this.props.data.refetch(variables);

    }

    updateParticipantState = (value) => {
        this.setState({
            participantState: value
        }, this.refresh());

        /*let variables = {
            filters: []
        }

        if(value !== 'all'){
            variables.filters = [
                {field: 'state', text: +value}
            ]
        }

        if(this.state.participantType !== 'all'){
            variables.filters = [
                ...variables.filters,
                {field: 'type', text: +this.state.participantType}
            ]
        }

        this.props.data.refetch(variables);*/
    }

    render(){
        const { translate } = this.props;
        const columnSize = this.state.editParticipant? 12 : 9;

        return(
            <Grid style={{height: '100%', overflow: 'hidden'}}>
                <GridItem xs={columnSize} md={columnSize} lg={columnSize} style={{padding: '3em', paddingTop: 0, paddingBottom: 0, overflow: 'hidden'}}>
                    <Card style={{height: '85vh', overflowY: 'hidden', position: 'relative'}}>
                        <Scrollbar option={{suppressScrollX: true}}>
                        {this.state.editParticipant?
                            <LiveParticipantEditor
                                translate={translate}
                                council={this.props.council}
                                refetch={this.props.data.refetch}
                                id={this.state.editParticipant}
                                requestClose={() => {
                                    this.props.data.refetch();
                                    this.setState({editParticipant: undefined})
                                }}
                            />
                            
                        :
                            <Grid style={{paddingTop: '2em'}}>
                                <GridItem xs={12} md={12} lg={12} style={{height: '2.8em', backgroundColor: 'WhiteSmoke', marginBottom: '3em'}}>

                                </GridItem>
                                {this.props.data.loading?
                                    <LoadingSection />
                                :
                                    this.props.data.liveParticipants.list.length > 0 ? (
                                        this.props.data.liveParticipants.list.map((participant) => (
                                            <GridItem
                                                key={`liveParticipant_${participant.id}`}
                                                xs={4}
                                                md={4}
                                                lg={4}
                                                style={{display: 'flex', alignItem: 'center', justifyContent: 'center', marginBottom: '1.2em', cursor: 'pointer'}}
                                            >
                                                <MenuItem style={{width: '80%', height: '4.8em', textOverflow: 'ellipsis', overflow: 'hidden'}} onClick={() => this.editParticipant(participant.id)}>
                                                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', textOverflow: 'ellipsis', overflow: 'hidden'}}>
                                                        {<ParticipantStateIcon participant={participant} translate={translate} />}
                                                        <div style={{display: 'flex', flexDirection: 'column', marginLeft: '1.3em', width: '100%', textOverflow: 'ellipsis', overflow: 'hidden'}}>
                                                            <div style={{fontSize: '0.95em'}}>
                                                                {`${participant.name} ${participant.surname}`}
                                                            </div>
                                                            <div style={{color: 'grey', fontSize: '0.8em'}}>
                                                                {`${participant.position}`}
                                                            </div>
                                                            {CBX.isRepresented(participant) &&
                                                                <Tooltip title={`${translate.represented_by}: ${participant.representative.name} ${participant.representative.surname}`}>
                                                                    <div style={{color: 'grey', fontSize: '0.8em', width: '100%', textOverflow: 'ellipsis', overflow: 'hidden'}}>
                                                                        {`${translate.represented_by}: ${participant.representative.name} ${participant.representative.surname}`}
                                                                    </div>
                                                                </Tooltip>
                                                            }
                                                            {CBX.hasHisVoteDelegated(participant) &&
                                                                <Tooltip title={`${translate.voting_delegate}: ${participant.representative.name} ${participant.representative.surname}`}>
                                                                    <div style={{color: 'grey', fontSize: '0.8em', width: '100%', textOverflow: 'ellipsis', overflow: 'hidden'}}>
                                                                        {`${translate.voting_delegate}: ${participant.representative.name} ${participant.representative.surname}`}
                                                                    </div>
                                                                </Tooltip>
                                                            }
                                                        </div>                           
                                                    </div>
                                                </MenuItem>
                                            </GridItem>
                                        ))
                                    ) : (
                                        <div style={{marginLeft: '2em'}}>
                                            {translate.no_results}
                                        </div>
                                    )
                                }
                            </Grid>
                        }
                        </Scrollbar>
                    </Card>
                </GridItem>
                {!this.state.editParticipant &&
                    <GridItem xs={3} md={3} lg={3} style={{height: '100%', padding: '2em'}}>
                        <TextInput
                            adornment={
                                <Icon>search</Icon>
                            }
                            floatingText={' '}
                            type="text"
                            value={this.state.filterText}
                            onChange={(event) => {
                                this.updateFilterText(event.target.value)
                            }}
                        />

                        <Typography variant="subheading" style={{textTransform: 'uppercase', color: 'grey', marginTop: '1.2em', fontWeight: '700'}}>
                            {translate.participant}
                        </Typography>
                        <Radio
                            checked={this.state.participantType === '0'}
                            label={translate.participant}
                            onChange={(event) => {
                                this.updateParticipantType('0')
                            }}
                            name="participantType"
                        />
                        <Radio
                            checked={this.state.participantType === 1}
                            onChange={(event) => {
                                this.updateParticipantType(1)
                            }}
                            name="participantType"
                            label={translate.guest}
                        />
                        <Radio
                            checked={this.state.participantType === 2}
                            onChange={(event) => {
                                this.updateParticipantType(2)
                            }}
                            name="participantType"
                            label={translate.representative}
                        />
                        <Radio
                            checked={this.state.participantType === 'all'}
                            onChange={(event) => {
                                this.updateParticipantType('all')
                            }}
                            name="participantType"
                            label={translate.all_plural}
                        />

                        <Typography variant="subheading" style={{textTransform: 'uppercase', color: 'grey', marginTop: '1.2em', fontWeight: '700'}}>
                            {translate.participant}
                        </Typography>
                        <Radio
                            checked={this.state.participantState === '0'}
                            label={translate.customer_initial}
                            onChange={(event) => {
                                this.updateParticipantState('0')
                            }}
                            name="participantState"
                        />
                        <Radio
                            checked={this.state.participantState === 5}
                            onChange={(event) => {
                                this.updateParticipantState(5)
                            }}
                            name="participantState"
                            label={translate.customer_present}
                        />
                        <Radio
                            checked={this.state.participantState === 'all'}
                            onChange={(event) => {
                                this.updateParticipantState('all')
                            }}
                            name="participantState"
                            label={translate.all_plural}
                        />
                    </GridItem>
                }
            </Grid>
        );
    }
}

export default graphql(liveParticipants, {
    options: (props) => ({
        variables: {
            councilId: props.council.id
        }
    })
})(ParticipantsManager);