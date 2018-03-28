import React, { Component } from "react";
import { TableRow, TableCell } from 'material-ui/Table';
import { getPrimary } from '../../styles/colors';
import { Table, DeleteIcon } from '../displayComponents';
import { graphql } from "react-apollo";
import gql from "graphql-tag";

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
            <div style={{width: '100%'}}>
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
                                key={`participant${participant.id}`} 
                            >
                                <TableCell>{participant.name}</TableCell>
                                <TableCell>{participant.dni}</TableCell>
                                <TableCell>{participant.email}</TableCell>
                                <TableCell>{participant.phone}</TableCell>
                                <TableCell>{participant.position}</TableCell>     
                                <TableCell>{participant.numParticipations}</TableCell>
                                <TableCell>{this._renderDeleteIcon(participant.id)}</TableCell>                  
                            </TableRow>
                        )
                    })}
                </Table>
            </div>
        );
    }
}

const deleteParticipant = gql `
    mutation DeleteParticipant($participantId: Int!, $councilId: Int!) {
        deleteParticipant(participantId: $participantId, councilId: $councilId)
    }
`;

export default graphql(deleteParticipant)(ParticipantsTable);