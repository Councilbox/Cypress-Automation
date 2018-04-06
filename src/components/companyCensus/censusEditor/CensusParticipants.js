import React, { Component, Fragment } from "react";
import { TableRow, TableCell } from 'material-ui/Table';
import { getPrimary } from '../../../styles/colors';
import { Table, DeleteIcon, LoadingSection, TextInput, Grid, GridItem, SelectInput } from '../../displayComponents';
import { MenuItem } from 'material-ui';
import { graphql, compose } from "react-apollo";
import { censusParticipants } from '../../../queries';
import gql from "graphql-tag";
import AddCensusParticipantButton from './AddCensusParticipantButton';


class CensusParticipants extends Component {

    constructor(props){
        super(props);
        this.state = {
            filterText: '',
            filterField: 'userData'
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

    updateFilterText = async (value) => {
        this.setState({
            filterText: value
        });

        let variables = {
            id: this.props.census.id,
            filter: {
                field: this.state.filterField,
                text: value
            }
        }
        this.props.data.refetch(variables);
    }

    updateFilterField = async (value) => {
        console.log(value);
        this.setState({
            filterField: value
        });

        if(this.state.filterText){
            let variables = {
                id: this.props.census.id,
                filter: {
                    field: value,
                    text: this.state.filterText
                }
            }
            this.props.data.refetch(variables);
        }
    }

    render(){
        const { translate, census } = this.props;
        const { loading, censusParticipants } = this.props.data;
        const { filterField, filterText } = this.state;

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

        return(
            <Fragment>

                <Grid>
                    <GridItem xs={12} md={3} lg={3}>
                        <AddCensusParticipantButton
                            translate={translate}
                            company={this.props.company}
                            census={this.props.census}
                            refetch={this.props.data.refetch}
                        />
                    </GridItem>
                    <GridItem xs={12} md={3} lg={3}>
                        <TextInput
                            floatingText={translate.find}
                            type="text"
                            value={filterText}
                            onChange={(event) => {
                                this.updateFilterText(event.target.value)
                            }}
                        />
                    </GridItem>
                    <GridItem xs={12} md={3} lg={3}>
                        <SelectInput
                            floatingText={translate.filter_by}
                            value={filterField}
                            onChange={(event) =>  this.updateFilterField(event.target.value)}
                        >
                            <MenuItem value={'userData'}>{translate.participant_data}</MenuItem>
                            <MenuItem value={'email'}>{translate.email}</MenuItem>   
                            <MenuItem value={'dni'}>{translate.dni}</MenuItem> 
                        </SelectInput>
                    </GridItem>
                </Grid>
                {loading?
                    <LoadingSection />
                :
                    <Grid>
                        <Table
                            headers={headers}
                            action={this._renderDeleteIcon}
                        >
                            {censusParticipants.list.map((participant) => {
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
                    </Grid>
                }
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
                censusId: props.census.id,
                options: {
                    limit: 10,
                    offset: 0
                }
            }
        })
    })
)(CensusParticipants);