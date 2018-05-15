import React, { Component, Fragment } from "react";
import { getPrimary } from '../../../../styles/colors';
import { TableRow, TableCell } from 'material-ui';
import { DeleteIcon, Grid, GridItem, EnhancedTable } from '../../../../displayComponents';
import { graphql, compose } from "react-apollo";
import { censusParticipants } from '../../../../queries';
import gql from "graphql-tag";
import AddCensusParticipantButton from './AddCensusParticipantButton';
import { PARTICIPANTS_LIMITS } from '../../../../constants';


class CensusParticipants extends Component {

    _renderDeleteIcon(participantID) {
        const primary = getPrimary();

        return (<DeleteIcon
            style={{ color: primary }}
            onClick={() => this.deleteParticipant(participantID)}
        />);
    }

    deleteParticipant = async (id) => {
        const response = await this.props.deleteCensusParticipant({
            variables: {
                participantId: id,
                censusId: this.props.census.id
            }
        });

        if (response) {
            this.props.data.refetch();
        }
    };

    render() {
        const { translate, census } = this.props;
        const { loading, censusParticipants } = this.props.data;

        const headers = [ {
            name: 'name',
            text: translate.participant_data,
            canOrder: true
        }, {
            name: 'dni',
            text: translate.dni,
            canOrder: true
        }, // {
            //     name: 'email',
            //     text: translate.email,
            //     canOrder: true
            // },
            // {
            //     name: 'phone',
            //     text: translate.phone_number,
            //     canOrder: true
            // },
            {
                name: 'position',
                text: translate.position,
                canOrder: true
            }, {
                name: 'numParticipations',
                text: translate.votes,
                canOrder: true
            }

        ];
        if (census.quorumPrototype === 1) {
            headers.push({
                text: translate.social_capital,
                name: 'socialCapital',
                canOrder: true
            });
        }

        headers.push({
            text: translate.delete,
            canOrder: false
        });

        return (<Fragment>
            <Grid>
                <GridItem xs={12} md={3} lg={3}>
                    <AddCensusParticipantButton
                        translate={translate}
                        company={this.props.company}
                        census={this.props.census}
                        refetch={this.props.data.refetch}
                    />
                </GridItem>
            </Grid>
            {!!censusParticipants &&

                <EnhancedTable
                    headers={headers}
                    translate={translate}
                    defaultFilter={'fullName'}
                    defaultLimit={PARTICIPANTS_LIMITS[ 0 ]}
                    limits={PARTICIPANTS_LIMITS}
                    page={1}
                    loading={loading}
                    length={censusParticipants.list.length}
                    total={censusParticipants.total}
                    fields={[ {
                        value: 'fullName',
                        translation: translate.participant_data
                    }, {
                        value: 'dni',
                        translation: translate.dni
                    }, {
                        value: 'position',
                        translation: translate.position
                    } ]}
                    refetch={this.props.data.refetch}
                    action={this._renderDeleteIcon}
                >
                    {censusParticipants.list.map((participant) => {
                        return (<TableRow
                            hover
                            style={{cursor: 'pointer'}}
                            key={`censusParticipant_${participant.id}`}>
                            <TableCell>
                                {`${participant.name} ${participant.surname}`}
                            </TableCell>
                            <TableCell>
                                {participant.dni}
                            </TableCell>
                            {/*<TableCell>{participant.email}</TableCell>*/}
                            {/*<TableCell>{participant.phone}</TableCell>*/}
                            <TableCell>
                                {participant.position}
                            </TableCell>
                            <TableCell>
                                {participant.numParticipations}
                            </TableCell>
                            {census.quorumPrototype === 1 &&

                            <TableCell>
                                {participant.socialCapital}
                            </TableCell>

                            }
                            <TableCell>{this._renderDeleteIcon(participant.id)}</TableCell>
                        </TableRow>)
                    })}
                </EnhancedTable>
            }
        </Fragment>);
    }
}

const deleteCensusParticipant = gql `
    mutation DeleteParticipant($participantId: Int!, $censusId: Int!) {
        deleteCensusParticipant(participantId: $participantId, censusId: $censusId)
    }
`;

export default compose(graphql(deleteCensusParticipant, {
    name: 'deleteCensusParticipant'
}), graphql(censusParticipants, {
    options: (props) => ({
        variables: {
            censusId: props.census.id,
            options: {
                limit: PARTICIPANTS_LIMITS[ 0 ],
                offset: 0
            }
        }
    })
}))(CensusParticipants);

/*
 <TableEnhancer
 translate={translate}
 defaultLimit={1}
 limits={[1, 2, 4]}
 page={1}
 loading={loading}
 length={censusParticipants.list.length}
 total={censusParticipants.total}
 fields={[
 {value: 'fullName', translation: translate.participant_data},
 {value: 'dni', translation: translate.dni},
 {value: 'email', translation: translate.email}
 ]}
 refetch={this.props.data.refetch}
 >

 */