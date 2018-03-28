import React, { Component, Fragment } from "react";
import { TableRow, TableCell } from 'material-ui/Table';
import { getPrimary } from '../../../styles/colors';
import { Table, DeleteIcon, LoadingSection } from '../../displayComponents';
import { graphql, compose } from "react-apollo";
import { censusParticipants } from '../../../queries';
import gql from "graphql-tag";
import AddCensusParticipantButton from './AddCensusParticipantButton';


class CensusParticipants extends Component {

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
        const response = await this.props.deleteCensusParticipant({
            variables: {
                participantId: id,
                censusId: this.props.census.id
            }
        })
        
        if(response){
            this.props.data.refetch();
        }
    }

    render(){
        const { translate, census } = this.props;
        const { censusParticipants, loading } = this.props.data;

        const headers = [
            {name: translate.participant_data},
            {name: translate.dni},
            {name: translate.email},
            {name: translate.phone_number},
            {name: translate.position},
            {name: translate.votes}
        ];
        if(census.quorumPrototype === 1){
            headers.push({name: translate.social_capital});
        }

        if(loading){
            return <LoadingSection />;
        }

        return(
            <Fragment>
                <AddCensusParticipantButton
                    translate={translate}
                    company={this.props.company}
                    census={this.props.census}
                    refetch={this.props.data.refetch}
                />
                <div style={{width: '100%'}}>
                    <Table
                        headers={headers}
                        action={this._renderDeleteIcon}
                    >
                        {censusParticipants.map((participant) => {
                            return(
                                <TableRow                         
                                    key={`censusParticipant_${participant.id}`} 
                                >
                                    <TableCell>{`${participant.name} ${participant.surname}`}</TableCell>
                                    <TableCell>{participant.dni}</TableCell>
                                    <TableCell>{participant.email}</TableCell>
                                    <TableCell>{participant.phone}</TableCell>
                                    <TableCell>{participant.position}</TableCell>     
                                    <TableCell>{participant.numParticipations}</TableCell>
                                    {census.quorumPrototype === 1 &&
                                        <TableCell>{participant.socialCapital}</TableCell>
                                    }
                                    <TableCell>{this._renderDeleteIcon(participant.id)}</TableCell>                  
                                </TableRow>
                            )
                        })}
                    </Table>
                </div>
            </Fragment>
        );
    }
}

const deleteCensusParticipant = gql `
    mutation DeleteParticipant($participantId: Int!, $censusId: Int!) {
        deleteCensusParticipant(participantId: $participantId, censusId: $censusId)
    }
`;

export default compose(
    graphql(deleteCensusParticipant, {
        name: 'deleteCensusParticipant'
    }),
    graphql(censusParticipants, {
        options: (props) => ({
            variables: {
                censusId: props.census.id
            }
        })
    })
)(CensusParticipants);