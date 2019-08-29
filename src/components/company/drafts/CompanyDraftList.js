import React from "react";
import { Link } from "react-router-dom";
import { companyDrafts, deleteDraft } from "../../../queries/companyDrafts.js";
import { compose, graphql } from "react-apollo";
import CompanyDraftNew from "./CompanyDraftNew";
import {
	AlertConfirm,
	BasicButton,
	ButtonIcon,
	CardPageLayout,
	CloseIcon,
	Grid,
	GridItem,
	EnhancedTable,
	ErrorWrapper
} from "../../../displayComponents";
import { getPrimary, getSecondary } from "../../../styles/colors";
import { Card } from 'material-ui';
import { isMobile } from 'react-device-detect';
import { TableCell, TableRow } from "material-ui/Table";
import withSharedProps from "../../../HOCs/withSharedProps";
import { DRAFTS_LIMITS } from "../../../constants";
import TableStyles from "../../../styles/table";
import { bHistory } from "../../../containers/App";
import { sendGAevent } from "../../../utils/analytics.js";
import { useOldState, useHoverRow } from "../../../hooks.js";

const CompanyDraftList = ({ data, translate, company, ...props }) => {
	const [state, setState] = useOldState({
		deleteModal: false,
		draftID: null,
		tags: true,
		newForm: false
	});
	const primary = getPrimary();

	React.useEffect(() => {
		data.refetch();
		sendGAevent({
			category: 'Borradores',
			action: `Entrada a la lista`,
			label: company.businessName
		});
	}, [sendGAevent])

	const _renderDeleteIcon = draftID => {
		return (
			<CloseIcon
				style={{ color: primary }}
				onClick={event => {
					openDeleteModal(draftID);
					event.stopPropagation();
				}}
			/>
		);
	}

	const openDeleteModal = draftID => {
		setState({
			deleteModal: true,
			draftID: draftID
		});
	}

	const deleteDraft = async () => {
		data.loading = true;
		const response = await props.deleteDraft({
			variables: {
				id: state.draftID
			}
		});
		if (!response.errors) {
			data.refetch();
			setState({
				deleteModal: false
			});
		}
	}

	const { companyDrafts, draftTypes, loading, error } = data;

	if (state.newForm) {
		return (
			<CompanyDraftNew
				translate={translate}
				closeForm={() => {
					setState({ newForm: false });
					data.refetch();
				}}
				company={company}
			/>
		);
	}

	return (
		<React.Fragment>
			<div style={{display: 'flex', justifyContent: isMobile? 'space-between' : 'flex-start', marginBottom: '1em'}}>
				<BasicButton
					text={translate.drafts_new}
					color={primary}
					id={"newDraft"}
					textStyle={{
						color: "white",
						fontWeight: "700",
						textTransform: 'none'
					}}
					onClick={() =>
						setState({
							newForm: true
						})
					}
					icon={<ButtonIcon type="add" color="white" />}
				/>
				<Link
					to={`/company/${company.id}/platform/drafts/`}
					style={{ marginLeft: "1em" }}
				>
					<BasicButton
						text={translate.general_drafts}
						color={getSecondary()}
						textStyle={{
							color: "white",
							fontWeight: "700",
							textTransform: 'none'
						}}
						icon={<ButtonIcon type="add" color="white" />}
					/>
				</Link>
			</div>
			<React.Fragment>
				{error ? (
					<div>
						{error.graphQLErrors.map((error, index) => {
							return (
								<ErrorWrapper
									key={`error_${index}`}
									error={error}
									translate={translate}
								/>
							);
						})}
					</div>
				) : (
					!!companyDrafts && (
						<EnhancedTable
							translate={translate}
							defaultLimit={DRAFTS_LIMITS[0]}
							defaultFilter={"title"}
							limits={DRAFTS_LIMITS}
							page={1}
							loading={loading}
							length={companyDrafts.list.length}
							total={companyDrafts.total}
							selectedCategories={[{
								field: "type",
								value: 'all',
								label: translate.all_plural
							}]}
							categories={[[
								...draftTypes.map(type => {
									return {
										field: "type",
										value: type.value,
										label: translate[type.label] || type.label
									}
								}),
								{
									field: "type",
									value: 'all',
									label: translate.all_plural
								},
							]]}
							refetch={data.refetch}
							headers={[
								{
									text: translate.name,
									name: "title",
									canOrder: true
								},
								{
									name: "type",
									text: translate.type,
									canOrder: true
								},
								{
									name: '',
									text: ''
								}
							]}
							action={_renderDeleteIcon}
							companyID={company.id}
						>
							{companyDrafts.list.map(draft => {
								return (
									<HoverableRow
										key={`draft${draft.id}`}
										translate={translate}
										renderDeleteIcon={_renderDeleteIcon}
										draft={draft}
										draftTypes={draftTypes}
										company={company}
									/>
								);
							})}
					</EnhancedTable>
				))}

				<AlertConfirm
					title={translate.attention}
					bodyText={translate.question_delete}
					open={state.deleteModal}
					buttonAccept={translate.delete}
					buttonCancel={translate.cancel}
					modal={true}
					acceptAction={deleteDraft}
					requestClose={() =>
						setState({ deleteModal: false })
					}
				/>
			</React.Fragment>
		</React.Fragment>
	);
}

const HoverableRow = ({ draft, draftTypes, company, translate, ...props }) => {
	const [show, handlers] = useHoverRow();

	if(isMobile){
		return(
			<Card
				style={{marginBottom: '0.5em', padding: '0.3em', position: 'relative'}}
				onClick={() => { bHistory.push(`/company/${company.id}/draft/${draft.id}`);
			}}
			>
				<Grid>
					<GridItem xs={4} md={4} style={{fontWeight: '700'}}>
						{translate.name}
					</GridItem>
					<GridItem xs={7} md={7}>
						{draft.title}
					</GridItem>

					<GridItem xs={4} md={4} style={{fontWeight: '700'}}>
						{translate.type}
					</GridItem>
					<GridItem xs={7} md={7}>
						{translate[draftTypes[draft.type].label]}
					</GridItem>
				</Grid>
				<div style={{position: 'absolute', top: '5px', right: '5px'}}>
					{props.renderDeleteIcon(draft.id)}
				</div>
			</Card>
		)
	}

	return (
		<TableRow
			hover
			{...handlers}
			onClick={() => {
				bHistory.push(`/company/${company.id}/draft/${draft.id}`);
			}}
		>
			<TableCell
				style={TableStyles.TD}
			>
				{draft.title}
			</TableCell>
			<TableCell>
				{translate[draftTypes[draft.type]? translate[draftTypes[draft.type].label] : ""] }
			</TableCell>
			<TableCell>
				<div style={{width: '3em'}}>
					{show && props.renderDeleteIcon(draft.id)}
				</div>
			</TableCell>
		</TableRow>
	)
}

export default withSharedProps()(
	compose(
		graphql(deleteDraft, {
			name: "deleteDraft",
			options: {
				errorPolicy: "all"
			}
		}),
		graphql(companyDrafts, {
			name: "data",
			options: props => ({
				variables: {
					companyId: props.company.id,
					options: {
						limit: DRAFTS_LIMITS[0],
						offset: 0
					}
				},
				notifyOnNetworkStatusChange: true
			})
		})
	)(CompanyDraftList)
);
