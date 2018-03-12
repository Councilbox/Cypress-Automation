import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { councils } from '../../queries.js';
import { graphql, compose } from 'react-apollo';
import { LoadingSection, DateWrapper, AlertConfirm, SectionTitle, Table, DeleteIcon } from '../displayComponents';
import gql from 'graphql-tag';
import { urlParser } from '../../utils';
import { getPrimary } from '../../styles/colors';
import { TableRow, TableCell } from 'material-ui/Table';


class MeetingDrafts extends Component {

    constructor(props){
        super(props);
        this.state = {
            meetingToDelete: '',
            deleteModal: false
        }
    }

    componentDidMount(){
        this.props.data.refetch();
    }

    openDeleteModal = (councilID) => {
        this.setState({
            deleteModal: true,
            meetingToDelete: councilID
        })
    }

    deleteCouncil = async () => {
        this.props.data.loading = true;
        const response = await this.props.mutate({
            variables: {
                data: urlParser({data: {
                    company_id: this.props.company.id,
                    active: 0,
                    id: this.state.meetingToDelete
                }})
            },
            refetchQueries: [{
                query: councils,
                name: "data",
                variables: {
                    type: "draft",
                    companyID: this.props.company.id,
                    isMeeting: true
                }
            }]
        })
        if(response){
            this.setState({
                deleteModal: false
            });
        }

    }

    _renderDeleteIcon(councilID) {
        return(
            <DeleteIcon
                style={{color: getPrimary()}}
                onClick={() => this.openDeleteModal(councilID)}
            />
        );
    }

    render(){
        const { translate } = this.props;

        return(
            <div style={{height: '10em', padding: '2em'}}>
                <SectionTitle
                    icon="pencil-square-o"
                    title={translate.companies_draft}
                    subtitle={translate.companies_draft_desc}
                />
                {this.props.data.loading? 
                    <LoadingSection />
                :
                    <Fragment>
                        <Table 
                            headers={[{name: translate.date_real_start}, {name: translate.name}, {name: translate.delete}]}
                            action={this._renderDeleteIcon}
                            companyID={this.props.company.id}
                        >
                            {this.props.data.councils.map((council) => {
                                return(
                                    <TableRow                               
                                        key={`participant${council.id}`}  
                                    >
                                        <TableCell><DateWrapper format="DD/MM/YYYY HH:mm" date={council.date_start}/></TableCell>
                                        <TableCell><Link to={`/company/${this.props.company.id}/council/${council.id}`}>{council.name}</Link></TableCell>
                                        <TableCell>{this._renderDeleteIcon(council.id)}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </Table>
                        <AlertConfirm 
                            title={translate.send_to_trash}
                            bodyText={translate.send_to_trash_desc}
                            open={this.state.deleteModal}
                            buttonAccept={translate.send_to_trash}
                            buttonCancel={translate.cancel}
                            modal={true}
                            acceptAction={this.deleteCouncil}
                            requestClose={() => this.setState({ deleteModal: false})}
                        />
                    </Fragment>
                }
            </div>
        );
    }

}

const submitRepository = gql `
  mutation UpdateCouncil( $data: String) {
    updateCouncil( data: $data)
  }
`;

export default compose(graphql(submitRepository), graphql(councils, {
    name: "data",
    options: (props) => ({
        variables: {
            type: "draft",
            companyID: props.company.id,
            isMeeting: true
        }
    })
}))(MeetingDrafts);