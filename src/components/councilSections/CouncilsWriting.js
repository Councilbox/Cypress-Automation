import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { councils } from '../../queries.js';
import { graphql } from 'react-apollo';
import { LoadingSection, Table, DateWrapper, SectionTitle, AlertConfirm } from '../displayComponents';
import DeleteForever from 'material-ui/svg-icons/action/delete-forever';
import { IconButton } from 'material-ui';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import { urlParser } from '../../utils';
import { getPrimary } from '../../styles/colors';

class CouncilsWriting extends Component {

    constructor(props){
        super(props);
        this.state = {
            deleteModal: false
        }
    }

    componentDidMount(){
        this.props.data.refetch();
    }

    _renderDeleteIcon = (councilID) => {
        const primary = getPrimary();
        return(
            <IconButton 
                iconStyle={{color: primary}}
                onClick={() => this.openDeleteModal(councilID)}
            >
                <DeleteForever />
            </IconButton>
        );
    }

    openDeleteModal = (councilID) => {
        this.setState({
            deleteModal: true,
            councilToDelete: councilID
        })
    }

    deleteCouncil = async () => {
        this.props.data.loading = true;
        const response = await this.props.mutate({
            variables: {
                data: urlParser({data: {
                    company_id: this.props.company.id,
                    active: 0,
                    id: this.state.councilToDelete
                }})
            },
            refetchQueries: [{
                query: councils,
                name: "data",
                variables: {
                    type: "writing",
                    companyID: this.props.company.id,
                    isMeeting: false
                }
            }]
        })
        if(response){
            this.setState({
                deleteModal: false
            });
        }
    }

    render(){
        const { translate } = this.props;
        
        return(
            <div style={{height: '10em', padding: '2em'}}>
                <SectionTitle
                    icon="clipboard"
                    title={this.props.translate.companies_writing}
                    subtitle={this.props.translate.companies_writing_desc}
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
                                        selectable={false}
                                        hoverable
                                        key={`participant${council.id}`}  
                                    >
                                        <TableRowColumn><DateWrapper format="DD/MM/YYYY HH:mm" date={council.date_start}/></TableRowColumn>
                                        <TableRowColumn><Link to={`/company/${this.props.company.id}/council/${council.id}/writing`}>{council.name}</Link></TableRowColumn>
                                        <TableRowColumn>{this._renderDeleteIcon(council.id)}</TableRowColumn>
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

export default graphql(councils, {
    options: (props) => ({
        variables: {
            state: 40,
            companyId: props.company.id,
            isMeeting: false
        }
    })
})(CouncilsWriting);