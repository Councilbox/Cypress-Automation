import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { companyDrafts, deleteDraft } from "../../../queries/companyDrafts.js";
import { compose, graphql } from "react-apollo";
import CompanyDraftNew from './CompanyDraftNew';
import {
    AlertConfirm, BasicButton, ButtonIcon, CardPageLayout, CloseIcon, EnhancedTable, ErrorWrapper
} from "../../../displayComponents";
import { getPrimary, getSecondary } from "../../../styles/colors";
import { TableCell, TableRow } from "material-ui/Table";
import withSharedProps from '../../../HOCs/withSharedProps';
import { DRAFTS_LIMITS } from '../../../constants';
import TableStyles from '../../../styles/table';
import { bHistory } from "../../../containers/App";


class CompanyDraftList extends Component {
    _renderDeleteIcon = draftID => {
        const primary = getPrimary();
        return (<CloseIcon
            style={{ color: primary }}
            onClick={(event) => {
                this.openDeleteModal(draftID);
                event.stopPropagation();
            }}
        />);
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

    render() {
        const { translate, company } = this.props;
        const { companyDrafts, draftTypes, loading, error } = this.props.data;

        if (this.state.newForm) {
            return (<CompanyDraftNew
                translate={translate}
                closeForm={() => {
                    this.setState({ newForm: false });
                    this.props.data.refetch();
                }}
                company={company}
            />);
        }

        return (<CardPageLayout title={translate.drafts}>
            <BasicButton
                text={translate.drafts_new}
                color={getPrimary()}
                textStyle={{
                    color: 'white',
                    fontWeight: '700'
                }}
                onClick={() => this.setState({
                    newForm: true
                })}
                icon={<ButtonIcon type="add" color='white'/>}
            />
            <Link to={`/company/${company.id}/platform/drafts/`}
                  style={{ marginLeft: '1em' }}>
                <BasicButton
                    text={translate.general_drafts}
                    color={getSecondary()}
                    textStyle={{
                        color: 'white',
                        fontWeight: '700'
                    }}
                    icon={<ButtonIcon type="add" color='white'/>}
                />
            </Link>
            <br/>
            <br/>
            <Fragment>
                {error ? (<div>
                    {error.graphQLErrors.map(error => {
                        return (<ErrorWrapper
                            error={error}
                            translate={translate}
                        />);
                    })}
                </div>) : !!companyDrafts && <Fragment>
                    <EnhancedTable
                        translate={translate}
                        defaultLimit={DRAFTS_LIMITS[ 0 ]}
                        defaultFilter={'title'}
                        limits={DRAFTS_LIMITS}
                        page={1}
                        loading={loading}
                        length={companyDrafts.list.length}
                        total={companyDrafts.total}
                        refetch={this.props.data.refetch}
                        headers={[ {
                            text: translate.name,
                            name: 'title',
                            canOrder: true
                        }, {
                            name: 'type',
                            text: translate.type,
                            canOrder: true
                        }, {
                            name: translate.delete,
                            text: translate.delete
                        } ]}
                        action={this._renderDeleteIcon}
                        companyID={this.props.company.id}
                    >
                        {companyDrafts.list.map(draft => {
                            return (<TableRow hover key={`draft${draft.id}`}
                                              style={TableStyles.ROW}
                                              onClick={() => {
                                                  bHistory.push(`/company/${ this.props.company.id }/draft/${ draft.id }`)
                                              }}>
                                <TableCell style={TableStyles.TD}>
                                    {draft.title}
                                </TableCell>
                                <TableCell>
                                    {translate[ draftTypes[ draft.type ].label ]}
                                </TableCell>
                                <TableCell>
                                    {this._renderDeleteIcon(draft.id)}
                                </TableCell>
                            </TableRow>);
                        })}
                    </EnhancedTable>
                </Fragment>}

                <AlertConfirm
                    title={translate.attention}
                    bodyText={translate.question_delete}
                    open={this.state.deleteModal}
                    buttonAccept={translate.delete}
                    buttonCancel={translate.cancel}
                    modal={true}
                    acceptAction={this.deleteDraft}
                    requestClose={() => this.setState({ deleteModal: false })}
                />
            </Fragment>
        </CardPageLayout>);
    }
}

export default withSharedProps()(compose(graphql(deleteDraft, {
    name: 'deleteDraft',
    options: {
        errorPolicy: 'all'
    }
}), graphql(companyDrafts, {
    name: "data",
    options: props => ({
        variables: {
            companyId: props.company.id,
            options: {
                limit: DRAFTS_LIMITS[ 0 ],
                offset: 0
            }
        },
        notifyOnNetworkStatusChange: true
    })
}))(CompanyDraftList));
