import React, { Component } from 'react';
import { councils } from '../../queries.js';
import { graphql } from 'react-apollo';
import { LoadingSection, Table, SectionTitle, DateWrapper } from '../displayComponents';
import DeleteForever from 'material-ui/svg-icons/action/delete-forever';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import { IconButton } from 'material-ui';

class MeetingsTrash extends Component {

    componentDidMount(){
        this.props.data.refetch();
    }

    _renderDeleteIcon(participantID){
        return(
            <IconButton 
                iconStyle={{color: 'purple'}}
                onClick={() => this.deleteParticipant(participantID)}
            >
                <DeleteForever />
            </IconButton>
        );
    }

    render(){
        const { translate } = this.props;

        return(
            <div style={{height: '10em', padding: '2em'}}>
                <SectionTitle
                    icon="trash-o"
                    title={this.props.translate.signature_trash}
                    subtitle={this.props.translate.companies_trash_desc}
                />
                {this.props.data.loading?
                    <LoadingSection />
                :
                   <Table 
                        headers={[{name: translate.date_real_start}, {name: translate.name}]}
                        companyID={this.props.company.id}
                    >
                        {this.props.data.councils.map((council) => {
                            return(
                                <TableRow
                                    selectable={false}
                                    key={`participant${council.id}`}  
                                >
                                    <TableRowColumn><DateWrapper format="DD/MM/YYYY HH:mm" date={council.date_start}/></TableRowColumn>
                                    <TableRowColumn>{council.name}</TableRowColumn>
                                </TableRow>
                            )
                        })}
                    </Table>
                }
            </div>
        );
    }

}

export default graphql(councils, {
    options: (props) => ({
        variables: {
            type: "trash",
            companyID: props.company.id,
            isMeeting: true
        }
    })
})(MeetingsTrash);