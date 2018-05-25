import React, { Component } from "react";
import { TableCell, TableRow } from 'material-ui/Table';
import { Table } from '../../../displayComponents';

class ParticipantSelector extends Component {

    render() {
        const { translate } = this.props;
        return (<Table
            headers={[ { name: translate.name }, { name: translate.dni }, { name: translate.position }, ]}
            action={this._renderDeleteIcon}
        >
            {this.props.participants.map((participant) => {
                return (<TableRow
                    key={`participant${participant.id}`}
                    onClick={() => this.props.action(participant.id, participant.name)}
                >
                    <TableCell>{participant.name}</TableCell>
                    <TableCell>{participant.dni}</TableCell>
                    <TableCell>{participant.position}</TableCell>
                </TableRow>)
            })}
        </Table>);
    }
}

export default ParticipantSelector;