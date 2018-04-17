import React, { Component } from "react";
import { TableRow, TableCell } from 'material-ui/Table';
import { Typography } from 'material-ui';
import { getPrimary } from '../../styles/colors';
import * as CBX from '../../utils/CBX';
import { EnhancedTable, DeleteIcon } from '../displayComponents';
import { graphql, compose } from "react-apollo";
import { councilParticipants, deleteParticipant } from '../../queries';
import { PARTICIPANTS_LIMITS } from '../../constants';

class ParticipantsTable extends Component {

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
        })
        
        if(response){
            this.props.refetch();
        }
    }    


    render(){
        const { translate, totalVotes, socialCapital} = this.props;
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

        return(
            <div style={{width: '100%'}}>
                {!!councilParticipants && 
                    <React.Fragment>
                        <EnhancedTable
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
                            {councilParticipants.list.map((participant) => {
                                return(
                                    <TableRow                         
                                        key={`participant${participant.id}`} 
                                        style={{fontSize: '0.5em', backgroundColor: CBX.isRepresentative(participant)? 'WhiteSmoke' : 'transparent'}}
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
                                                    `${participant.socialCapital} (${((participant.socialCapital / socialCapital) * 100).toFixed(2)}%)`
                                                }
                                            </TableCell>
                                        }
                                        <TableCell>
                                            {!CBX.isRepresentative(participant) &&
                                                this._renderDeleteIcon(participant.id)
                                            }
                                        </TableCell>                  
                                    </TableRow>
                                )
                            })}
                        </EnhancedTable>
                    </React.Fragment>
                }
            </div>
        );
    }
}

export default compose(
    graphql(deleteParticipant),
    graphql(councilParticipants, {
        options: (props) => ({
            variables: {
                councilId: props.councilId,
                options: {
                    limit: PARTICIPANTS_LIMITS[0],
                    offset: 0
                }
            }
        })
    })
)(ParticipantsTable);