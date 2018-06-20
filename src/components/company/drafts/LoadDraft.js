import React from "react";
import { EnhancedTable } from "../../../displayComponents/index";
import { graphql } from "react-apollo";

import { companyDrafts } from "../../../queries/companyDrafts";
import { DRAFTS_LIMITS } from "../../../constants";
import { TableCell, TableRow } from "material-ui/Table";
import { compose } from "react-apollo/index";
import gql from "graphql-tag";

export const draftTypes = gql`
	query draftTypes {
		draftTypes {
			id
			label
			value
		}
	}
`;

class LoadDraft extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loadDraft: false
		};
	}

	render() {
		const { translate, statutes, statute } = this.props;
		const { companyDrafts, loading } = this.props.data;

		return (
			<React.Fragment>
				{!!companyDrafts && (
					<EnhancedTable
						translate={translate}
						defaultLimit={DRAFTS_LIMITS[0]}
						defaultFilter={"title"}
						limits={DRAFTS_LIMITS}
						page={1}
						loading={loading}
						length={companyDrafts.list.length}
						total={companyDrafts.total}
						addedFilters={[
							{
								field: "type",
								text: this.props.draftType
							}
						]}
						refetch={this.props.data.refetch}
						action={this._renderDeleteIcon}
						selectedCategory={{
							field: "statuteId",
							value: statute.statuteId,
							label: translate[statute.title] || statute.title
						}}
						categories={[						
							...statutes.map(statute => {
								return {
									field: "statuteId",
									value: statute.id,
									label: translate[statute.title] || statute.title
								}
							}),
							{
								field: "statuteId",
								value: 'all',
								label: translate.all_plural
							},	
						]}
						headers={[
							{
								text: translate.title,
								name: "title"
							},
							{
								text: translate.type,
								name: "type"
							}
						]}
					>
						{companyDrafts.list.map(draft => {
							return (
								<TableRow
									key={`draft${draft.id}`}
									style={{ cursor: "pointer" }}
									onClick={() => {
										this.props.loadDraft(draft);
									}}
								>
									<TableCell>{draft.title}</TableCell>
									<TableCell>
										{
											translate[
												this.props.info.draftTypes[
													draft.type
												].label
											]
										}
									</TableCell>
								</TableRow>
							);
						})}
					</EnhancedTable>
				)}
			</React.Fragment>
		);
	}
}

export default compose(
	graphql(companyDrafts, {
		name: "data",
		options: props => ({
			variables: {
				companyId: props.companyId,
				filters: [
					{
						field: "type",
						text: props.draftType
					},
					{
						field: "statuteId",
						text: props.statute.statuteId
					}
				],
				options: {
					limit: DRAFTS_LIMITS[0],
					offset: 0
				}
			}
		})
	}),
	graphql(draftTypes, { name: "info" })
)(LoadDraft);
