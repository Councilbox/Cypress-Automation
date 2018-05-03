import React, { Component, Fragment } from "react";
import { TableRow, TableCell } from 'material-ui/Table';

import { getPrimary } from '../../../../styles/colors';
import * as CBX from '../../../../utils/CBX';
import { EnhancedTable, CloseIcon } from '../../../../displayComponents';
import { graphql, compose } from "react-apollo";
import { councilParticipants, deleteParticipant } from '../../../../queries';
import { PARTICIPANTS_LIMITS } from '../../../../constants';
import ParticipantEditor from '../../participants/ParticipantEditor';
import ChangeCensusMenu from './ChangeCensusMenu';


class ParticipantsTable extends Component {

    constructor(props){
        super(props);
        this.state = {
            editParticipant: false,
            editIndex: null
        }
    }

    _renderDeleteIcon(participantID){
        const primary = getPrimary();

        return(
            <CloseIcon
                style={{color: primary}}
                onClick={(event) => {
                    event.stopPropagation();
                    this.deleteParticipant(participantID)
                }}
            />
        );
    }

    componentDidMount(){
        this.props.data.refetch();
    }

    deleteParticipant = async (id) => {
        const response = await this.props.mutate({
            variables: {
                participantId: id,
                councilId: this.props.council.id
            }
        });
        
        if(response){
            this.table.refresh();
        }
    };

    render(){
        const { translate, totalVotes, totalSocialCapital} = this.props;
        const { loading, councilParticipants,  } = this.props.data;
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
            },{
                text: translate.phone
            },
            {text: translate.position},
            {
                text: translate.votes,
                name: 'numParticipations',
                canOrder: true
            },
            
        ];

        if(this.props.participations){
            headers.push({text: translate.census_type_social_capital, name: 'socialCapital', canOrder: true});
        }
        headers.push({text: translate.delete});

        if(this.state.editParticipant && this.props.editable){
            return(
                <ParticipantEditor
                    translate={translate}
                    participant={councilParticipants.list[this.state.editIndex]}
                    requestClose={() => {
                        this.props.data.refetch();
                        this.setState({
                            editParticipant: false
                        })
                    }}
                />
            )
        }

        return(
            <div style={{width: '100%'}}>
                <ChangeCensusMenu
                    translate={translate}
                    council={this.props.council}
                    handleCensusChange={this.props.handleCensusChange}
                    showAddModal={this.props.showAddModal}
                    censuses={this.props.censuses}
                    totalVotes={this.props.totalVotes}
                    totalSocialCapital={this.props.totalSocialCapital}
                />
                {!!councilParticipants && 
                    <React.Fragment>
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
                                    <Fragment key={`participant${participant.id}`}>
                                        <TableRow  
                                            hover={true}
                                            onClick={() => this.setState({editParticipant: true, editIndex: index})}
                                            style={{cursor: 'pointer', fontSize: '0.5em'}}
                                        >
                                            <TableCell>{`${participant.name} ${participant.surname}`}</TableCell>
                                            <TableCell>{participant.dni}</TableCell>
                                            <TableCell>{participant.email}</TableCell>
                                            <TableCell>{participant.phone}</TableCell>
                                            <TableCell>{participant.position}</TableCell>
                                            <TableCell>
                                                {!CBX.isRepresentative(participant) &&
                                                    `${participant.numParticipations} (${((participant.numParticipations / totalVotes) * 100).toFixed(2)}%)`
                                                }
                                            </TableCell>
                                            {this.props.participations &&
                                                <TableCell>
                                                    {!CBX.isRepresentative(participant) &&
                                                        `${participant.socialCapital} (${((participant.socialCapital / totalSocialCapital) * 100).toFixed(2)}%)`
                                                    }
                                                </TableCell>
                                            }
                                            <TableCell>
                                                {!CBX.isRepresentative(participant) &&
                                                    this._renderDeleteIcon(participant.id)
                                                }
                                            </TableCell>                  
                                        </TableRow>
                                        {!!participant.representative &&
                                            <TableRow
                                                hover={true}
                                                style={{cursor: 'pointer', backgroundColor: 'WhiteSmoke'}}
                                                onClick={() => this.setState({editParticipant: true, editIndex: index})}  
                                            >
                                                <TableCell>
                                                    <div style={{fontSize: '0.9em', width: '100%'}}>
                                                        {`${translate.represented_by}: ${participant.representative.name} ${participant.representative.surname}`}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div style={{fontSize: '0.9em', width: '100%'}}>
                                                        {participant.representative.dni}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div style={{fontSize: '0.9em', width: '100%'}}>
                                                        {participant.representative.email}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div style={{fontSize: '0.9em', width: '100%'}}>
                                                        {participant.representative.phone}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div style={{fontSize: '0.9em', width: '100%'}}>
                                                        {participant.representative.position}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                </TableCell>
                                                <TableCell>
                                                </TableCell>
                                                <TableCell>
                                                </TableCell>
                                            </TableRow>

                                        }
                                    </Fragment>
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
    graphql(councilParticipants, {
        options: (props) => ({
            variables: {
                councilId: props.council.id,
                options: {
                    limit: PARTICIPANTS_LIMITS[0],
                    offset: 0
                }
            },
            forceFetch: true,
            notifyOnNetworkStatusChange: true
        })
    })
)(ParticipantsTable);