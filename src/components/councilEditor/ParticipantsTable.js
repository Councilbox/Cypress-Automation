import React, { Component } from "react";
import { TableRow, TableCell } from 'material-ui/Table';
import { getPrimary } from '../../styles/colors';
import { EnhancedTable, DeleteIcon, LoadingSection } from '../displayComponents';
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
                councilId: this.props.councilID
            }
        })
        
        if(response){
            this.props.refetch();
        }
    }

    render(){
        const { translate } = this.props;
        const { loading, councilParticipants } = this.props.data;

        return(
            <div style={{width: '100%'}}>
                {!!councilParticipants && 
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
                        headers={[
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
                            {name: translate.delete},
                        ]}
                    >
                        {councilParticipants.list.map((participant) => {
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
                    </EnhancedTable>

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