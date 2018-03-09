import React, { Component } from "react";
import { TableRow, TableRowColumn } from 'material-ui/Table';
import DeleteForever from 'material-ui/svg-icons/action/delete-forever';
import { getPrimary } from '../../styles/colors';
import { IconButton } from 'material-ui';
import { Table } from '../displayComponents';
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { urlParser } from '../../utils';

class ParticipantsTable extends Component {

    _renderDeleteIcon(participantID){
        const primary = getPrimary();

        return(
            <IconButton 
                iconStyle={{color: primary}}
                onClick={() => this.deleteParticipant(participantID)}
            >
                <DeleteForever />
            </IconButton>
        );
    }

    deleteParticipant = async (id) => {
        const response = await this.props.mutate({
            variables: {
                participantId: id,
                councilId: this.props.councilID
            }
        })
        
        if(response){
            this.props.refetch();
        }
    }

    render(){
        const { translate } = this.props;

        return(
            <Table
                headers={[
                    {name: translate.name},
                    {name: translate.dni},
                    {name: translate.email},
                    {name: translate.phone_number},
                    {name: translate.position},
                    {name: translate.votes},
                    {name: translate.delete},                    
                ]}
                action={this._renderDeleteIcon}
            >
                {this.props.participants.map((participant) => {
                    return(
                        <TableRow
                            selectable={false}
                            hoverable
                            key={`participant${participant.id}`} 
                        >
                            <TableRowColumn>{participant.name}</TableRowColumn>
                            <TableRowColumn>{participant.dni}</TableRowColumn>
                            <TableRowColumn>{participant.email}</TableRowColumn>
                            <TableRowColumn>{participant.phone}</TableRowColumn>
                            <TableRowColumn>{participant.position}</TableRowColumn>     
                            <TableRowColumn>{participant.num_participations}</TableRowColumn>
                            <TableRowColumn>{this._renderDeleteIcon(participant.id)}</TableRowColumn>                  
                        </TableRow>
                    )
                })}
            </Table>
        );
    }
}

const deleteParticipant = gql `
    mutation DeleteParticipant($participantId: Int!, $councilId: Int!) {
        deleteParticipant(participantId: $participantId, councilId: $councilId)
    }
`;

export default graphql(deleteParticipant)(ParticipantsTable);