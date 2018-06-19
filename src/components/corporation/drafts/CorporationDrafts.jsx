import React from "react";
import { CardPageLayout, EnhancedTable, ErrorWrapper } from "../../../displayComponents";
import { compose, graphql, withApollo } from "react-apollo";
import { corporationDrafts } from "../../../queries/corporation";
import { TableCell, TableRow } from "material-ui/Table";
import withSharedProps from "../../../HOCs/withSharedProps";
import { withRouter } from "react-router-dom";
import { DRAFTS_LIMITS, DRAFT_TYPES } from "../../../constants";
import TableStyles from "../../../styles/table";

class CorporationDrafts extends React.Component {
    state = {
        selectedIndex: -1,
        selectedValues: []
    };

    componentDidMount() {
        this.props.data.refetch();
    }

    render() {
        const { translate } = this.props;
        const { loading, error, corporationDrafts, draftTypes } = this.props.data;

        return (
            <CardPageLayout title={translate.general_drafts}>
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
                ) : (
                        !!corporationDrafts && (
                            <EnhancedTable
                                translate={translate}
                                defaultLimit={DRAFTS_LIMITS[0]}
                                defaultFilter={"title"}
                                defaultOrder={["title", "asc"]}
                                limits={DRAFTS_LIMITS}
                                page={1}
                                loading={loading}
                                length={corporationDrafts.list.length}
                                total={corporationDrafts.total}
                                refetch={this.props.data.refetch}
                                headers={[
                                    {
                                        name: "title",
                                        text: translate.name,
                                        canOrder: true
                                    },
                                    {
                                        name: "type",
                                        text: translate.type,
                                        canOrder: true
                                    }
                                ]}
                            >
                                {corporationDrafts.list.map(
                                    (draft, index) => {
                                        return (
                                            <TableRow
                                                key={`draft${draft.id}`}
                                            >
                                                <TableCell
                                                    style={
                                                        TableStyles.TD
                                                    }
                                                    onClick={() =>
                                                        this.setState({
                                                            selectedIndex: index
                                                        })
                                                    }
                                                >
                                                    {draft.title}
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        translate[draftTypes[draft.type].label]
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        );
                                    }
                                )}
                            </EnhancedTable>
                        )
                    )}

            </CardPageLayout>
        );
    }
}

export default withSharedProps()(
    compose(
        graphql(corporationDrafts, {
            options: props => ({
                notifyOnNetworkStatusChange: true
            })
        })
    )(withRouter(withApollo(CorporationDrafts)))
);
