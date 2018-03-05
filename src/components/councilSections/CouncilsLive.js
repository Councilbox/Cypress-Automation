import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { councils, deleteCouncil } from '../../queries.js';
import { graphql } from 'react-apollo';
import { LoadingSection, Table, DateWrapper, SectionTitle, AlertConfirm, ErrorWrapper } from '../displayComponents';
import DeleteForever from 'material-ui/svg-icons/action/delete-forever';
import { IconButton } from 'material-ui';
import { urlParser } from '../../utils';
import gql from 'graphql-tag';
import { compose } from 'react-apollo';
import { getPrimary } from '../../styles/colors';
import { TableRowColumn, TableRow } from 'material-ui/Table';

class CouncilsLive extends Component {

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
                councilId: this.state.councilToDelete
            }
        })
        if(response){
            this.props.data.refetch();
            this.setState({
                deleteModal: false
            });
        }
    }

    render(){
        const { translate } = this.props;
        const { councils, loading, error } = this.props.data;

        return(
            <div style={{height: '10em', padding: '2em'}}>
                <SectionTitle
                    icon="users"
                    title={this.props.translate.companies_live}
                    subtitle={this.props.translate.companies_live_desc}
                />
                {loading?
                    <LoadingSection />
                :
                <Fragment>
                        {error?
                            <div>
                                {error.graphQLErrors.map((error) => {
                                    return <ErrorWrapper error={error} translate={translate} />
                                })}
                            </div>
                        :
                            councils.length > 0?
                                <Table 
                                    headers={[{name: translate.date_real_start}, {name: translate.name}, {name: translate.delete}]}
                                    action={this._renderDeleteIcon}
                                    companyID={this.props.company.id}
                                >
                                    {councils.map((council) => {
                                        return(
                                            <TableRow
                                                selectable={false}
                                                hoverable
                                                key={`participant${council.id}`}  
                                            >
                                                <TableRowColumn><DateWrapper format="DD/MM/YYYY HH:mm" date={council.dateStart}/></TableRowColumn>
                                                <TableRowColumn><Link to={`/company/${this.props.company.id}/council/${council.id}/live`}>{council.name}</Link></TableRowColumn>
                                                <TableRowColumn>{this._renderDeleteIcon(council.id)}</TableRowColumn>
                                            </TableRow>
                                        )
                                    })}
                                    </Table>
                            :
                                <span>{translate.no_results}</span>
                        }

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


export default compose(graphql(deleteCouncil), graphql(councils, {
    name: "data",
    options: (props) => ({
        variables: {
            state: 20,
            companyId: props.company.id,
            isMeeting: false
        }
    })
}))(CouncilsLive);