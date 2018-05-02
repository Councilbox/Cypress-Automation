import React, { Component } from "react";
import { TableRow, TableCell } from 'material-ui/Table';

import { Tooltip } from 'material-ui';
import { getPrimary, getSecondary } from '../../../styles/colors';
import * as CBX from '../../../utils/CBX';
import { EnhancedTable, DeleteIcon, Grid, GridItem, ButtonIcon, BasicButton } from '../../../displayComponents';
import { graphql, compose } from "react-apollo";
import { convenedcouncilParticipants, deleteParticipant, updateNotificationsStatus } from '../../../queries';
import { PARTICIPANTS_LIMITS } from '../../../constants';
import NotificationFilters from './NotificationFilters';

class ConvenedParticipantsTable extends Component {

    constructor(props){
        super(props);
        this.state = {
            editParticipant: false,
            editIndex: null,
            activeStatusFilter: ''
        }
    }

    _renderDeleteIcon(participantID){
        const primary = getPrimary();

        return(
            <DeleteIcon
                style={{color: primary}}
                onClick={() => this.deleteParticipant(participantID)}
            />
        );
    }

    componentDidUpdate(){
        this.props.data.refetch();
    }

    deleteParticipant = async (id) => {
        const response = await this.props.mutate({
            variables: {
                participantId: id,
                councilId: this.props.councilId
            }
        });
        
        if(response){
            this.table.refresh();
        }
    };
    
    refresh = (object) => {
        this.table.refresh(object);
    };

    refreshEmailStates = async () => {
        const response = await this.props.updateNotificationsStatus({
            variables: {
                councilId: this.props.councilId
            }
        });

        if(response.data.updateNotificationsStatus.success){
            this.table.refresh();
        }
    };


    render(){
        const { translate, totalVotes, socialCapital} = this.props;
        const { loading } = this.props.data;
        const councilParticipants = this.props.data.councilParticipantsWithNotifications;

        let headers = [
            {
                text: translate.name,
                name: 'name',
                canOrder: true
            },
            {
                text: translate.dni,
                name: 'dni',
                canOrder: true
            },
            {
                text: translate.email,
                name: 'email',
                canOrder: true
            },
            {text: translate.position},
            {
                text: translate.votes,
                name: 'numParticipations',
                canOrder: true
            },{
                text: translate.convene
            }
            
        ];

        if(this.props.participations){
            headers.push({text: translate.census_type_social_capital, name: 'socialCapital', canOrder: true});
        }

        if(this.state.editParticipant && this.props.editable){
            return(
                <Grid>
                    
                    {councilParticipants.list[this.state.editIndex].name}
                </Grid>
            )
        }

        return(
            <div style={{width: '100%'}}>
                {!!councilParticipants && 
                    <React.Fragment>
                        <Grid style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <GridItem xs={12} lg={6} md={6} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <NotificationFilters
                                    translate={translate}
                                    refetch={this.refresh}
                                />
                            </GridItem>
                            <GridItem xs={6} lg={6} md={6} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                                    <div>
                                        <Tooltip title={translate.tooltip_refresh_convene_email_state_assistance}>
                                            <div>
                                                <BasicButton
                                                    text={translate.refresh_convened}
                                                    color={getSecondary()}
                                                    buttonStyle={{margin: '0', height: '100%', marginRight: '0.3em'}}
                                                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                                                    icon={<ButtonIcon color='white' type="add" />}
                                                    textPosition="after"
                                                    onClick={() => this.refreshEmailStates()} 
                                                />
                                            </div>
                                        </Tooltip>
                                    </div>
                                    <BasicButton
                                        text={translate.add_participant}
                                        color={getPrimary()}
                                        buttonStyle={{margin: '0', height: '100%'}}
                                        textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                                        icon={<ButtonIcon color='white' type="add" />}
                                        textPosition="after"
                                        onClick={() => this.setState({
                                            showModal: true
                                        })} 
                                    />
                                </div>
                            </GridItem>
                        </Grid>
                        <EnhancedTable
                            ref={(table) => this.table = table}
                            translate={translate}
                            defaultLimit={PARTICIPANTS_LIMITS[0]}
                            defaultFilter={'fullName'}
                            defaultOrder={['name', 'asc']}
                            limits={PARTICIPANTS_LIMITS}
                            page={1}
                            loading={loading}
                            length={councilParticipants.list.length}
                            total={councilParticipants.total}
                            refetch={this.props.data.refetch}
                            action={this._renderDeleteIcon}
                            fields={[
                                {value: 'fullName', translation: translate.participant_data}, 
                                {value: 'dni', translation: translate.dni},
                                {value: 'email', translation: translate.email},
                                {value: 'position', translation: translate.position}
                            ]}
                            headers={headers}
                        >
                            {councilParticipants.list.map((participant, index) => {
                                return(
                                    <TableRow  
                                        hover={true}
                                        onClick={() => this.setState({editParticipant: true, editIndex: index})}                       
                                        key={`participant${participant.id}`} 
                                        style={{cursor: 'pointer', fontSize: '0.5em', backgroundColor: CBX.isRepresentative(participant)? 'WhiteSmoke' : 'transparent'}}
                                    >
                                        <TableCell>{`${participant.name} ${participant.surname}`}</TableCell>
                                        <TableCell>{participant.dni}</TableCell>
                                        <TableCell>{participant.email}</TableCell>
                                        <TableCell>{participant.position}</TableCell>
                                        <TableCell>
                                            {!CBX.isRepresentative(participant) &&
                                                `${participant.numParticipations} (${((participant.numParticipations / totalVotes) * 100).toFixed(2)}%)`
                                            }
                                        </TableCell>
                                        {this.props.participations &&
                                            <TableCell>
                                                {!CBX.isRepresentative(participant) &&
                                                    `${participant.socialCapital} (${((participant.socialCapital / socialCapital) * 100).toFixed(2)}%)`
                                                }
                                            </TableCell>
                                        } 
                                        <TableCell>
                                            {participant.notifications.length > 0?
                                                <Tooltip title={translate[CBX.getTranslationReqCode(participant.notifications[participant.notifications.length - 1].reqCode)]}>
                                                    <img 
                                                        style={{height: '2.1em', width: 'auto'}}
                                                        src={CBX.getEmailIconByReqCode(participant.notifications[participant.notifications.length - 1].reqCode)}
                                                        alt="email-state-icon"
                                                    />
                                                </Tooltip>
                                            :
                                                '-'
                                            }

                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </EnhancedTable>
                    </React.Fragment>
                }
                {this.props.children}
            </div>
        );
    }
}

export default compose(
    graphql(deleteParticipant),
    graphql(updateNotificationsStatus, {
        name: 'updateNotificationsStatus'
    }),
    graphql(convenedcouncilParticipants, {
        options: (props) => ({
            variables: {
                councilId: props.councilId,
                options: {
                    limit: PARTICIPANTS_LIMITS[0],
                    offset: 0
                }
            },
            forceFetch: true
        })
    })
)(ConvenedParticipantsTable);