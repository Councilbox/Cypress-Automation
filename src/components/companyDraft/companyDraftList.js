import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { companyDrafts, deleteDraft } from "../../queries/companyDrafts.js";
import { graphql, compose } from "react-apollo";
import CompanyDraftForm from './CompanyDraftForm';
import { LoadingSection, Table, AlertConfirm, ErrorWrapper, DeleteIcon, BasicButton, ButtonIcon, CardPageLayout } from "../displayComponents";
import { getPrimary, getSecondary } from "../../styles/colors";
import { TableCell, TableRow } from "material-ui/Table";
import withSharedProps from '../../HOCs/withSharedProps';

class CompanyDraftList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deleteModal: false,
            draftID: null,
            newForm: false
        };
    }

    componentDidMount() {
        this.props.data.refetch();
    }

    _renderDeleteIcon = draftID => {
        const primary = getPrimary();
        return (
            <DeleteIcon
                style={{ color: primary }}
                onClick={() => this.openDeleteModal(draftID)}
            />
        );
    };

    openDeleteModal = draftID => {
        this.setState({
            deleteModal: true,
            draftID: draftID
        });
    };

    deleteDraft = async () => {
        this.props.data.loading = true;
        const response = await this.props.deleteDraft({
            variables: {
                id: this.state.draftID
            }
        });
        if (!response.errors) {
            this.props.data.refetch();
            this.setState({
                deleteModal: false
            });
        }
    };

    render() {
        const { translate, company } = this.props;
        const { companyDrafts, loading, error } = this.props.data;

        if(this.state.newForm){
            return (
                <CompanyDraftForm
                    translate={translate}
                    closeForm={() => {
                        this.setState({newForm: false});
                        this.props.data.refetch();
                    }}
                    company={company}
                />
            );
        }

        return (
            <CardPageLayout title={translate.drafts}>
                <BasicButton
                    text={translate.drafts_new}
                    color={getPrimary()}
                    textStyle={{color: 'white', fontWeight: '700'}}
                    onClick={() => this.setState({
                        newForm: true
                    })}
                    icon={<ButtonIcon type="add" color='white' />}
                />
                <Link to={`/company/${company.id}/platform/drafts/`}>
                    <BasicButton
                        text={translate.general_drafts}
                        color={getSecondary()}
                        textStyle={{color: 'white', fontWeight: '700'}}
                        icon={<ButtonIcon type="add" color='white' />}
                    />
                </Link><br/>
                {loading ? (
                    <LoadingSection />
                ) : (
                    <Fragment>
                        {error ? (
                            <div>
                                {error.graphQLErrors.map(error => {
                                    return (
                                        <ErrorWrapper
                                            error={error}
                                            translate={translate}
                                        />
                                    );
                                })}
                            </div>
                        ) : companyDrafts.length > 0 ? (
                            <Fragment>
                                <Table
                                    headers={[
                                        { name: translate.name },
                                        { name: translate.delete }
                                    ]}
                                    action={this._renderDeleteIcon}
                                    companyID={this.props.company.id}
                                >
                                    {companyDrafts.map(draft => {
                                        return (
                                            <TableRow key={`draft${draft.id}`}>
                                                <TableCell>
                                                    <Link
                                                        to={`/company/${ this.props.company.id }/draft/${ draft.id }`}
                                                    >
                                                        {draft.title}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    {this._renderDeleteIcon( draft.id )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </Table>
                            </Fragment>
                        ) : (
                            <span>{translate.no_results}</span>
                        )}

                        <AlertConfirm
                            title={translate.send_to_trash}
                            bodyText={translate.send_to_trash_desc}
                            open={this.state.deleteModal}
                            buttonAccept={translate.send_to_trash}
                            buttonCancel={translate.cancel}
                            modal={true}
                            acceptAction={this.deleteDraft}
                            requestClose={() =>
                                this.setState({ deleteModal: false })
                            }
                        />
                    </Fragment>
                )}
            </CardPageLayout>
        );
    }
}

export default withSharedProps()(compose(
    graphql(deleteDraft, {
        name: 'deleteDraft',
        options: {
            errorPolicy: 'all'
        }
    }),
    graphql(companyDrafts, {
        name: "data",
        options: props => ({
            variables: {
                companyId: props.company.id,
                isMeeting: false
            },
            notifyOnNetworkStatusChange: true
        })
    })
)(CompanyDraftList));
