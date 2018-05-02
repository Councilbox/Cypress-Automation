import React, { Component } from 'react';
import { councils } from '../../../queries.js';
import { graphql } from 'react-apollo';
import { LoadingSection, Table, SectionTitle, DateWrapper, DeleteIcon } from '../../../displayComponents';
import { TableRow, TableCell } from 'material-ui/Table';
import { getPrimary } from '../../../styles/colors';

class MeetingsTrash extends Component {

    componentDidMount(){
        this.props.data.refetch();
    }

    _renderDeleteIcon(participantID){
        return(
            <DeleteIcon 
                style={{color: getPrimary()}}
                onClick={() => this.deleteParticipant(participantID)}
            />
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
                                    key={`participant${council.id}`}  
                                >
                                    <TableCell><DateWrapper format="DD/MM/YYYY HH:mm" date={council.date_start}/></TableCell>
                                    <TableCell>{council.name}</TableCell>
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