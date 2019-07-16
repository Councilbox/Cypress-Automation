import React from "react";
import { EnhancedTable } from "../../../displayComponents/index";
import { graphql } from "react-apollo";

import { companyDrafts } from "../../../queries/companyDrafts";
import { DRAFTS_LIMITS, GOVERNING_BODY_TYPES } from "../../../constants";
import { TableCell, TableRow } from "material-ui/Table";
import { compose } from "react-apollo/index";
import gql from "graphql-tag";
import { sendGAevent } from "../../../utils/analytics";
import withSharedProps from "../../../HOCs/withSharedProps";

export const draftTypes = gql`
	query draftTypes {
		draftTypes {
			id
			label
			value
		}
	}
`;

const LoadDraft = withSharedProps()(({ translate, statutes, statute, ...props }) => {
	React.useEffect(() => {
		props.data.refetch();
	}, [props.data.refetch]);

	const { companyDrafts, loading } = props.data;

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
							text: props.draftType
						}
					]}
					refetch={props.data.refetch}
					selectedCategories={[{
						field: "statuteId",
						value: statute.statuteId,
						label: translate[statute.title] || statute.title
					}, {
						field: "governingBodyType",
						value: 'all',
						label: translate.all_plural
					}]}
					categories={[[
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
					], [...Object.keys(GOVERNING_BODY_TYPES).filter(key => GOVERNING_BODY_TYPES[key].value !== 0).map(key => {
						return {
							field: "governingBodyType",
							value: GOVERNING_BODY_TYPES[key].value,
							label: translate[GOVERNING_BODY_TYPES[key].label] || GOVERNING_BODY_TYPES[key].label
						}
					}), {
							field: "governingBodyType",
							value: 'all',
							label: translate.all_plural
					}]]}
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
									sendGAevent({
										category: 'Borradores',
										action: `Carga de borrador`,
										label: props.company.businessName
									})
									props.loadDraft(draft);
								}}
							>
								<TableCell>{draft.title}</TableCell>
								<TableCell>
									{translate[props.info.draftTypes[draft.type].label]}
								</TableCell>
							</TableRow>
						);
					})}
				</EnhancedTable>
			)}
		</React.Fragment>
	);
})


export default compose(
	graphql(companyDrafts, {
		name: "data",
		options: props => ({
			variables: {
				companyId: props.companyId,
				prototype: 3,
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
