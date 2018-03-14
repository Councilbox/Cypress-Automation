import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { companyDrafts, deleteDraft } from '../../queries/drafts.js';
import { graphql } from 'react-apollo';
import { LoadingSection, Table, DateWrapper, SectionTitle, AlertConfirm, ErrorWrapper, DeleteIcon } from '../displayComponents';
import { compose } from 'react-apollo';
import { getPrimary } from '../../styles/colors';
import { TableCell, TableRow } from 'material-ui/Table';

class CompanyDraftList extends Component {

    constructor(props){
        super(props);
        this.state = {
            deleteModal: false,
            draftID: null,
            drafts: []
        }
    }

    componentDidMount(){
        this.props.data.refetch();
    }

    _renderDeleteIcon = (draftID) => {
        const primary = getPrimary();
        return(
            <DeleteIcon
                style={{color: primary}}
                onClick={() => this.openDeleteModal(draftID)}
            />
        );
    }

    openDeleteModal = (draftID) => {
        this.setState({
            deleteModal: true,
            draftID: draftID
        })
    }

    deleteDraft = async () => {
        this.props.data.loading = true;
        const response = await this.props.mutate({
            variables: {
                draftID: this.state.draftID
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
        const { drafts, loading, error } = this.props.data;

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
                            drafts.length > 0?
                                <Table 
                                    headers={[{name: translate.date_real_start}, {name: translate.name}, {name: translate.delete}]}
                                    action={this._renderDeleteIcon}
                                    companyID={this.props.company.id}
                                >
                                    {drafts.map((draft) => {
                                        return(
                                            <TableRow                                               
                                                key={`draft${draft.id}`}  
                                            >
                                                <TableCell><DateWrapper format="DD/MM/YYYY HH:mm" date={draft.dateStart}/></TableCell>
                                                <TableCell><Link to={`/company/${this.props.company.id}/draft/${draft.id}/live`}>{draft.name}</Link></TableCell>
                                                <TableCell>{this._renderDeleteIcon(draft.id)}</TableCell>
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
                            acceptAction={this.deleteDraft}
                            requestClose={() => this.setState({ deleteModal: false})}
                        />
                    </Fragment>
                }
            </div>
        );
    }

}


export default compose(graphql(deleteDraft), graphql(companyDrafts, {
    name: "data",
    options: (props) => ({
        variables: {
            state: 20,
            companyId: props.company.id,
            isMeeting: false
        }
    })
}))(CompanyDraftList);