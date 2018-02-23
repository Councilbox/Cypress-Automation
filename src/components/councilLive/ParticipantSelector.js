import React, { Component } from "react";
import { TableRow, TableRowColumn } from 'material-ui/Table';
import { Table } from '../displayComponents';

class ParticipantSelector extends Component {

    render(){
        const { translate } = this.props;
        return(
            <Table
                headers={[
                    {name: translate.name},
                    {name: translate.dni},
                    {name: translate.position},                
                ]}
                action={this._renderDeleteIcon}
            >
                {this.props.participants.map((participant) => {
                    return(
                        <TableRow
                            selectable={false}
                            hoverable
                            key={`participant${participant.id}`}
                            onClick={() => this.props.action(participant.id, participant.name)}
                        >
                            <TableRowColumn>{participant.name}</TableRowColumn>
                            <TableRowColumn>{participant.dni}</TableRowColumn>
                            <TableRowColumn>{participant.position}</TableRowColumn>                  
                        </TableRow>
                    )
                })}
            </Table>
        );
    }
}

export default ParticipantSelector;