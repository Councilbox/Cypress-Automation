import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { companyDrafts, deleteDraft } from "../../queries/companyDrafts.js";
import { graphql } from "react-apollo";
import {
    LoadingSection,
    Table,
    DateWrapper,
    SectionTitle,
    AlertConfirm,
    ErrorWrapper,
    DeleteIcon
} from "../displayComponents";
import { compose } from "react-apollo";
import { getPrimary } from "../../styles/colors";
import { TableCell, TableRow } from "material-ui/Table";
import withSharedProps from '../../HOCs/withSharedProps';

class CompanyDraftList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deleteModal: false,
            draftID: null
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
        const response = await this.props.mutate({
            variables: {
                draftID: this.state.draftID
            }
        });
        if (response) {
            this.props.data.refetch();
            this.setState({
                deleteModal: false
            });
        }
    };

    render() {
        const { translate } = this.props;
        const { companyDrafts, loading, error } = this.props.data;

        return (
            <div style={{ height: "10em", padding: "2em" }}>
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
            </div>
        );
    }
}

export default withSharedProps()(compose(
    graphql(deleteDraft),
    graphql(companyDrafts, {
        name: "data",
        options: props => ({
            variables: {
                companyId: props.company.id,
                isMeeting: false
            }
        })
    })
)(CompanyDraftList));
