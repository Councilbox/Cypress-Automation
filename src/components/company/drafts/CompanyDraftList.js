import React from "react";
import { Link } from "react-router-dom";
import { companyDrafts, deleteDraft, getCompanyDraftDataNoCompany } from "../../../queries/companyDrafts.js";
import { compose, graphql, withApollo } from "react-apollo";
import CompanyDraftNew from "./CompanyDraftNew";
import {
	AlertConfirm,
	BasicButton,
	ButtonIcon,
	CloseIcon,
	Grid,
	GridItem,
	EnhancedTable,
	ErrorWrapper,
} from "../../../displayComponents";
import { getPrimary, getSecondary } from "../../../styles/colors";
import { Card, Collapse, IconButton } from 'material-ui';
import { isMobile } from 'react-device-detect';
import { TableCell, TableRow } from "material-ui/Table";
import withSharedProps from "../../../HOCs/withSharedProps";
import { DRAFTS_LIMITS, GOVERNING_BODY_TYPES } from "../../../constants";
import TableStyles from "../../../styles/table";
import { bHistory } from "../../../containers/App";
import { sendGAevent } from "../../../utils/analytics.js";
import { useOldState, useHoverRow } from "../../../hooks.js";
import { getTagColor, createTag } from "./draftTags/utils.js";
import SelectedTag from "./draftTags/SelectedTag.js";
import withWindowSize from "../../../HOCs/withWindowSize.js";



const { NONE, ...governingBodyTypes } = GOVERNING_BODY_TYPES;

const CompanyDraftList = ({ data, translate, company, client, ...props }) => {
	const [state, setState] = useOldState({
		deleteModal: false,
		draftID: null,
		tags: true,
		newForm: false,
	});
	const [search, setSearch] = React.useState("")
	const [vars, setVars] = React.useState({});
	const [testTags, setTestTags] = React.useState({});



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
			<div style={{ display: "flex" }}>
				<i className="fa fa-pencil-square-o" style={{
					height: "32px",
					width: "32px",
					outline: 0, 
					color: primary
				}}>
				</i>
				<CloseIcon
					style={{ color: primary }}
					onClick={event => {
						openDeleteModal(draftID);
						event.stopPropagation();
					}}
				/>
			</div>
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

	React.useEffect(() => {
		data.refetch({
			companyId: company.id,
			...(search ? {
				filters: [
					{
						field: "title",
						text: search
					},
				]
			} : {}),
			tags: Object.keys(testTags).map(key => testTags[key].name),
		})
	}, [testTags]);


	const getData = async () => {
		const response = await client.query({
			query: getCompanyDraftDataNoCompany,
			variables: {
				companyId: company.id
			}
		});
		setVars(response.data);
	};

	React.useEffect(() => {
		getData();
	}, [company.id]);

	const formatTagLabel = tag => {
		return tag.segments ?
			`${tag.segments.reduce((acc, curr) => {
				if (curr !== tag.label) return acc + (translate[curr] || curr) + '. '
				return acc;
			}, '')}`
			:
			tag.label
	}

	const removeTag = tag => {
		delete testTags[tag.name];
		setTestTags({ ...testTags });
	}

	const addTag = tag => {
		setTestTags({
			...testTags,
			[tag.name]: {
				...tag,
				label: formatTagLabel(tag),
				active: true,
				selected: 1
			}
		});
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
			<div style={{ display: 'flex', justifyContent: isMobile ? 'space-between' : 'flex-start', marginBottom: '1em' }}>
				<BasicButton
					text={"Nueva plantilla"} //TRANSLATE
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
						//TRADUCCION
						text={"Plantillas predeterminadas"}
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
			<div style={{ height: ' calc( 100% - 2em )' }}>
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
								// monta etiquetas
								listDraftsEtiquetas={true}
								search={search}
								setSearch={setSearch}
								vars={vars}
								addTag={addTag}
								testTags={testTags}//testTags
								anchorOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								transformOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								removeTag={removeTag}
								styleBody={{ minWidth: '50vw' }}
								//
								hideTextFilter={true}
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
								refetch={data.refetch}
								headers={[
									{
										text: translate.name,
										name: "title",
										canOrder: true
									},
									{
										name: "type",
										text: 'Etiquetas',
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
											info={props}
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
			</div>
		</React.Fragment>
	);
}

const HoverableRow = ({ draft, draftTypes, company, translate, info, ...props }) => {
	const [show, handlers] = useHoverRow();
	const [expanded, setExpanded] = React.useState(false);
	const [showActions, setShowActions] = React.useState(false);

	const TagColumn = props => {
		return (
			<div style={{
				display: "flex",
				color: "#ffffff",
				fontSize: "12px",
				marginBottom: "0.5em ",
				flexDirection: 'column'
			}}>
				{props.children}
			</div>
		)
	}

	const buildTagColumns = tags => {
		const columns = {};
		Object.keys(tags).forEach(key => {
			const tag = tags[key];
			columns[tag.type] = columns[tag.type] ? [...columns[tag.type], tag] : [tag]
		});

		return columns;
	}


	const mouseEnterHandler = () => {
		setShowActions(true)
	}

	const mouseLeaveHandler = () => {
		setShowActions(false)
	}

	const desplegarEtiquetas = (event) => {
		event.preventDefault()
		event.stopPropagation()
		setExpanded(!expanded)
	}

	const columns = buildTagColumns(draft.tags);


	if (isMobile) {
		return (
			<Card
				style={{ marginBottom: '0.5em', padding: '0.3em', position: 'relative' }}
				onClick={() => {
					bHistory.push(`/company/${company.id}/draft/${draft.id}`);
				}}
			>
				<Grid>
					<GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
						{translate.name}
					</GridItem>
					<GridItem xs={7} md={7}>
						{draft.title}
					</GridItem>

					<GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
						{translate.type}
					</GridItem>
					<GridItem xs={7} md={7}>
						{translate[draftTypes[draft.type].label]}
					</GridItem>
				</Grid>
				<div style={{ position: 'absolute', top: '5px', right: '5px' }}>
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
			<TableCell >
				<div style={{ display: "flex" }}>
					{columns &&
						Object.keys(columns).map(key => {
							let columnaLength = columns[key].length;
							return (
								<TagColumn key={`column_${key}`}>
									{columns[key].map((tag, index) => {
										return (
											index > 0 ?
												<Collapse in={expanded} timeout="auto" unmountOnExit>
													<SelectedTag
														key={`tag_${translate[tag.label] || tag.label}_${key}_${index}_${tag.name}_`}
														text={translate[tag.label] || tag.label}
														color={getTagColor(key)}
														props={props}
														list={true}
														count={""}
													/>
												</Collapse>
												:
												<SelectedTag
													key={`tag_${translate[tag.label] || tag.label}_${key}_${index}_${tag.name}`}
													text={translate[tag.label] || tag.label}
													color={getTagColor(key)}
													props={props}
													list={true}
													count={columnaLength > 1 ? expanded ? "" : columnaLength : ""}
													stylesEtiqueta={{ cursor: columnaLength > 1 ? "pointer" : "", }}
													desplegarEtiquetas={columnaLength > 1 ? desplegarEtiquetas : ""}
													mouseEnterHandler={columnaLength > 1 ? mouseEnterHandler : ""}
													mouseLeaveHandler={columnaLength > 1 ? mouseLeaveHandler : ""}
												/>
										)
									})}
								</TagColumn>
							)
						})
					}
				</div>
			</TableCell>
			<TableCell>
				<div style={{ width: '3em' }}>
					{show && props.renderDeleteIcon(draft.id)}
				</div>
			</TableCell>
		</TableRow>
	)
}

export default withApollo((withSharedProps()(
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
	)(withWindowSize(CompanyDraftList)))
));
