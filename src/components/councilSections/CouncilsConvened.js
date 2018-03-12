import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { councils, deleteCouncil } from '../../queries.js';
import { graphql, compose } from 'react-apollo';
import { LoadingSection, DateWrapper, AlertConfirm, SectionTitle, Table, ErrorWrapper, DeleteIcon } from '../displayComponents';
import { getPrimary } from '../../styles/colors';
import { TableRow, TableCell } from 'material-ui/Table';


class CouncilsConvened extends Component {

    constructor(props){
        super(props);
        this.state = {
            councilToDelete: '',
            deleteModal: false
        }
    }

    componentDidMount(){
        this.props.data.refetch();
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

    _renderDeleteIcon(councilID) {
        const primary = getPrimary();

        return(
            <DeleteIcon 
                style={{color: primary}}
                onClick={() => this.openDeleteModal(councilID)}
            />
        );
    }

    render(){
        const { translate } = this.props;
        const { loading, error, councils } = this.props.data;

        return(
            <div style={{height: '10em', padding: '2em'}}>
                <SectionTitle
                    icon="calendar-o"
                    title={translate.companies_calendar}
                    subtitle={translate.companies_calendar_desc}
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
                                                key={`participant${council.id}`}  
                                            >
                                                <TableCell><DateWrapper format="DD/MM/YYYY HH:mm" date={council.dateStart}/></TableCell>
                                                <TableCell><Link to={`/company/${this.props.company.id}/council/${council.id}/prepare`}>{council.name}</Link></TableCell>
                                                <TableCell>{this._renderDeleteIcon(council.id)}</TableCell>
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
            state: 10,
            companyId: props.company.id,
            isMeeting: false
        }
    })
}))(CouncilsConvened);