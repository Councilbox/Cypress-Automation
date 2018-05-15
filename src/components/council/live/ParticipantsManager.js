import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Grid, GridItem, Icon, TextInput, LoadingSection, Radio, BasicButton, ButtonIcon } from '../../../displayComponents';
import { getSecondary } from '../../../styles/colors';
import { Card, Typography, MenuItem, Tooltip } from 'material-ui';
import { liveParticipants, liveParticipantsCount, refreshLiveEmails } from '../../../queries';
import { graphql, compose } from 'react-apollo';
import * as CBX from '../../../utils/CBX';
import ParticipantStateIcon from './ParticipantStateIcon';
import LiveParticipantEditor from './LiveParticipantEditor';
import Scrollbar from 'react-perfect-scrollbar';
import Chip from 'material-ui/Chip';
import AddGuestModal from './AddGuestModal';
import { toast } from 'react-toastify';

class ParticipantsManager extends Component {

    constructor(props){
        super(props);
        this.state = {
            filterText: '',
            participantType: 'all',
            participantState: 'all',
            addGuest: false,
            refreshing: false,
            tableType: 'participantState',
            editParticipant: undefined
        }
    }

    componentDidMount() {
        this.props.data.refetch();
        ReactDOM.findDOMNode(this.div).focus();        
    }
    
    componentDidUpdate(){
        ReactDOM.findDOMNode(this.div).focus();
    }

    updateFilterText = async (value) => {
        this.setState({
            filterText: value
        });

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
        }, () => this.refresh());

        let variables = {
            filters: []
        }
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
        }, () => this.refresh());
    }

    loadMore = () => {
        this.props.data.fetchMore({
            variables: {
                options: {
                    offset: this.props.data.liveParticipants.list.length,
                    limit: 2
                }
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                return  {
                    ...prev,
                    liveParticipants: {
                        ...prev.liveParticipants,
                        list: [
                            ...prev.liveParticipants.list,
                            ...fetchMoreResult.liveParticipants.list
                        ]
                    }

                };
            }
        })
    }

    getCount = (value) => {
        if(this.props.data.loading){
            return '...';
        }

        if(value !== 'all'){
            return this.props.data.liveParticipantsStateCount.find((item) => (item.state === value)).count;
        }

        return(this.props.data.liveParticipantsStateCount.reduce((a, b) => a + b.count, 0));
    }

    handleKeyPress = (event) => {
        const key = event.nativeEvent;
        if(key.altKey){
            if(key.code === "KeyG"){
                this.setState({addGuest: true});
            }
            if(key.code === "KeyR"){
                this.refreshEmailStates();
            }
        }
    }

    refreshEmailStates = async () => {
        this.setState({
            refreshing: true
        });
        const response = await this.props.refreshLiveEmails({
            variables: {
                councilId: this.props.council.id
            }
        });

        console.log(response);

        if(response){
            this.setState({refreshing: false});
            if(!response.data.refreshLiveEmails.success){
                toast.error(this.props.translate.err_saved);
            }
        } 

    }

    render(){
        const { translate } = this.props;
        const columnSize = this.state.editParticipant? 12 : 9;

        return(
            <div
                style={{height: '100%', width: '100%', padding: 0, margin: 0, outline: 0}}
                tabIndex="0"
                onKeyDown={this.handleKeyPress}
                ref={(ref) => this.div = ref}
            >
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
                                        this.refresh();
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
                                            <React.Fragment>
                                                {this.props.data.liveParticipants.list.map((participant) => (
                                                    <GridItem
                                                        xs={4}
                                                        md={4}
                                                        lg={4}
                                                        key={`liveParticipant_${participant.id}`}
                                                        style={{display: 'flex', alignItem: 'center', justifyContent: 'center', marginBottom: '1.2em', cursor: 'pointer'}}
                                                    >
                                                        <MenuItem style={{width: '80%', height: '4.8em', textOverflow: 'ellipsis', overflow: 'hidden'}} onClick={() => this.editParticipant(participant.id)}>
                                                            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', textOverflow: 'ellipsis', overflow: 'hidden'}}>
                                                                {this.state.tableType === 'participantState'? 
                                                                    <ParticipantStateIcon participant={participant} translate={translate} />
                                                                :
                                                                    participant.notifications.length > 0?
                                                                        <img
                                                                            style={{
                                                                                height: '2.1em',
                                                                                width: 'auto'
                                                                            }}
                                                                            src={CBX.getEmailIconByReqCode(participant.notifications[participant.notifications.length - 1].reqCode)}
                                                                            alt="email-state-icon"
                                                                        />
                                                                    :
                                                                        '-'
                                                                }
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
                                                ))}
                                                {this.props.data.liveParticipants.list.length < this.props.data.liveParticipants.total &&
                                                    <GridItem
                                                        xs={10} md={10} lg={10}
                                                        style={{border: '2px solid grey', margin: 'auto', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                                                        onClick={() => this.loadMore()}    
                                                    >
                                                        LOAD MORE
                                                    </GridItem>
                                                }
                                            </React.Fragment>
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
                        <GridItem xs={3} md={3} lg={3} style={{height: '100%', padding: '2em', position: 'relative'}}>
                            <Scrollbar option={{suppressScrollX: true}}>
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

                                <Tooltip title="ALT + G">
                                    <div>
                                        <BasicButton
                                            text={translate.add_guest}
                                            color={'white'}
                                            textStyle={{color: getSecondary(), fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                                            textPosition="after"
                                            icon={<ButtonIcon type="add" color={getSecondary()} />}
                                            onClick={() => this.setState({addGuest: true})}
                                            buttonStyle={{marginRight: '1em', border: `2px solid ${getSecondary()}`}}
                                        />
                                    </div>
                                </Tooltip>
                                <Tooltip title={`${translate.tooltip_refresh_convene_email_state_assistance} (ALT + R)`}>
                                    <div>
                                        <BasicButton
                                            text={translate.refresh_convened}
                                            color={'white'}
                                            loading={this.state.refreshing}
                                            loadingColor={getSecondary()}
                                            textStyle={{color: getSecondary(), fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                                            textPosition="after"
                                            icon={<ButtonIcon type="cached" color={getSecondary()} />}
                                            onClick={this.refreshEmailStates}
                                            buttonStyle={{marginRight: '1em', border: `2px solid ${getSecondary()}`}}
                                        />
                                    </div>
                                </Tooltip>
                                <Typography variant="subheading" style={{textTransform: 'uppercase', color: 'grey', marginTop: '1.2em', fontWeight: '700'}}>
                                    VER:
                                </Typography>
                                <Radio
                                    checked={this.state.tableType === 'participantState'}
                                    label={translate.current_state}
                                    onChange={(event) => {
                                        this.setState({tableType: 'participantState'})
                                    }}
                                    name="tableType"
                                />
                                <Radio
                                    checked={this.state.tableType === 'participantSend'}
                                    label={translate.sends}
                                    onChange={(event) => {
                                        this.setState({tableType: 'participantSend'})
                                    }}
                                    name="tableType"
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
                                <Grid>
                                    <GridItem xs={12} lg={12} md={12}>
                                        <Radio
                                            checked={this.state.participantState === '0'}
                                            label={translate.customer_initial}
                                            onChange={(event) => {
                                                this.updateParticipantState('0')
                                            }}
                                            name="participantState"
                                        />
                                        <Chip label={this.getCount(0)} />
                                    </GridItem>
                                    <GridItem xs={12} lg={12} md={12}>
                                        <Radio
                                            checked={this.state.participantState === 5}
                                            onChange={(event) => {
                                                this.updateParticipantState(5)
                                            }}
                                            name="participantState"
                                            label={translate.customer_present}
                                        />
                                        <Chip label={this.getCount(5)} />
                                    </GridItem>
                                    <GridItem xs={12} lg={12} md={12}>
                                        <Radio
                                            checked={this.state.participantState === 'all'}
                                            onChange={(event) => {
                                                this.updateParticipantState('all')
                                            }}
                                            name="participantState"
                                            label={translate.all_plural}
                                        />
                                        <Chip label={this.getCount('all')} />
                                    </GridItem>
                                </Grid>
                            </Scrollbar>
                            
                        </GridItem>
                    }
                    <AddGuestModal
                        show={this.state.addGuest}
                        council={this.props.council}
                        refetch={this.props.data.refetch}
                        requestClose={() => this.setState({addGuest: false})}
                        translate={translate}
                    />
                </Grid>
            </div>
        );
    }
}

export default compose(
    graphql(liveParticipants, {
        options: (props) => ({
            variables: {
                councilId: props.council.id,
                options: {
                    limit: 3,
                    offset: 0
                },
                notificationStatus: 22
            }
        })
    }),
    graphql(refreshLiveEmails, {
        name: 'refreshLiveEmails'
    })
)(ParticipantsManager);