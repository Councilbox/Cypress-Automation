import React from "react";
import { Link } from "react-router-dom";
import { companyDrafts as query, deleteDraft, getCompanyDraftDataNoCompany } from "../../../queries/companyDrafts.js";
import { compose, graphql, withApollo } from "react-apollo";
import CompanyDraftNew from "./CompanyDraftNew";
import {
	AlertConfirm,
	BasicButton,
	ButtonIcon,
	CloseIcon,
	TextInput,
	Grid,
	Scrollbar,
	GridItem,
	EnhancedTable,
	ErrorWrapper,
	LoadingSection,
	Checkbox,
} from "../../../displayComponents";
import { getPrimary, getSecondary } from "../../../styles/colors";
import { Card, Collapse, IconButton, Icon, CardActions, CardContent } from 'material-ui';
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
import { DropdownEtiquetas } from "./LoadDraft.js";
import { buildTagColumns, formatLabelFromName } from "../../../utils/templateTags.js";
import { isMobile } from "../../../utils/screen.js";

const { NONE, ...governingBodyTypes } = GOVERNING_BODY_TYPES;

export const useTags = translate => {
	const [testTags, setTestTags] = React.useState({})
	const [tagText, setTagText] = React.useState('');
	const [vars, setVars] = React.useState({});

	const formatTagLabel = tag => {
		return tag.segments ?
			`${tag.segments.reduce((acc, curr) => {
				if (curr !== tag.label) return acc + (translate[curr] || curr) + '. '
				return acc;
			}, '')}`
			:
			tag.label
	};

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

	const filterTags = () => {
		let tagsSearch = [];
		vars.companyStatutes.map(statute => (
			tagsSearch.push(createTag(statute, 1, translate))
		));
		vars.companyTypes.map(type => (
			tagsSearch.push(createTag(type, 0, translate))
		));
		Object.keys(governingBodyTypes).map(key => (
			tagsSearch.push(createTag(governingBodyTypes[key], 2, translate))
		));
		vars.draftTypes.map(draft => tagsSearch.push(createTag({
			...draft,
			addTag,
		}, 3, translate)));
		return tagsSearch.filter(tag => {
			return tag.label.toLowerCase().includes(tagText.toLowerCase())
		});
	}

	let filteredTags = [];

	if (tagText) {
		filteredTags = filterTags();
	}

	return {
		testTags,
		vars,
		tagText,
		setTagText,
		setVars,
		removeTag,
		filteredTags,
		addTag,
		filterTags
	}

}

const CompanyDraftList = ({ translate, company, client, setMostrarMenu, ...props }) => {
	const [data, setData] = React.useState({});
	const [state, setState] = useOldState({
		deleteModal: false,
		draftID: null,
		tags: true,
		newForm: false,
	});
	const [inputSearch, setInputSearch] = React.useState(false);
	const [search, setSearch] = React.useState("");
	const { testTags, vars, setVars, removeTag, addTag, filteredTags, setTagText, tagText } = useTags(translate);

	const primary = getPrimary();

	const getDrafts = async variables => {
		const response = await client.query({
			query,
			variables: {
				companyId: company.id,
				options: {
					limit: DRAFTS_LIMITS[0],
					offset: 0
				},
				...variables
			}

		});

		setData(response.data);
	}

	React.useEffect(() => {
		sendGAevent({
			category: 'Borradores',
			action: `Entrada a la lista`,
			label: company.businessName
		});
	}, [sendGAevent])

	const _renderDeleteIcon = draftID => {
		return (
			<div style={{ display: "flex", marginLeft: isMobile && "1em" }}>
				<IconButton
					onClick={() => {
						bHistory.push(`/company/${company.id}/draft/${draftID}`);
					}}
					style={{
						color: primary,
						height: "32px",
						width: "32px",
						outline: 0,
						marginRight: isMobile && "1em"
					}}
				>
					<i className="fa fa-pencil-square-o">
					</i>
				</IconButton>

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
		const response = await props.deleteDraft({
			variables: {
				id: state.draftID
			}
		});
		if (!response.errors) {
			getDrafts();
			setState({
				deleteModal: false
			});
		}
	}

	React.useEffect(() => {
		getDrafts({
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
	}, [testTags, search]);


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

	const { companyDrafts, draftTypes, loading, error } = data;

	if (state.newForm) {
		setMostrarMenu(false)
		return (
			<CompanyDraftNew
				translate={translate}
				closeForm={() => {
					setState({ newForm: false });
					getDrafts();
				}}
				company={company}
			/>
		);
	}

	if (!vars.companyStatutes) {
		return <LoadingSection />
	}

	return (
		<React.Fragment>
			<div style={{ display: 'flex', justifyContent: isMobile ? 'space-between' : 'flex-start', marginBottom: '1em', marginLeft: isMobile ? "0em" : "1em" }}>
				<BasicButton
					text={translate.drafts_new}
					color={primary}
					id={"newDraft"}
					textStyle={{
						color: "white",
						fontWeight: "700",
						textTransform: 'none',
						whiteSpace: isMobile && 'nowrap',
						overflow: isMobile && 'hidden',
						textOverflow: isMobile && 'ellipsis',
						padding: isMobile && "8px 8px"
					}}
					onClick={() =>
						setState({
							newForm: true
						})
					}
				// icon={<ButtonIcon type="add" color="white" />}
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
							textTransform: 'none',
							whiteSpace: isMobile && 'nowrap',
							overflow: isMobile && 'hidden',
							textOverflow: isMobile && 'ellipsis',
							padding: isMobile && "8px 8px"
						}}
					// icon={<ButtonIcon type="add" color="white" />}
					/>
				</Link>
			</div>
			<div style={{ height: ' calc( 100% - 10em )' }}>
				<div style={{ marginRight: '0.8em', display: "flex", justifyContent: isMobile ? "space-between" : 'flex-end', alignItems: "center" }}>
					<div style={{ marginRight: isMobile ? "0.5em" : "3em" }}>
						<DropdownEtiquetas
							translate={translate}
							search={tagText}
							setSearchModal={setTagText}
							matchSearch={filteredTags}
							company={company}
							vars={vars}
							testTags={testTags}
							addTag={addTag}
							styleBody={{ minWidth: '50vw' }}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							removeTag={removeTag}
							stylesMenuItem={{ padding: "3px 3px", marginTop: isMobile && '0', width: isMobile && "" }}
						/>
					</div>
					<div>
						<TextInput
							className={isMobile && !inputSearch ? "openInput" : ""}
							disableUnderline={true}
							styleInInput={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.54)", background: "#f0f3f6", padding: isMobile && inputSearch && "4px 5px", paddingLeft: !isMobile && "5px" }}
							stylesAdornment={{ background: "#f0f3f6", marginLeft: "0", paddingLeft: isMobile && inputSearch ? "8px" : "4px" }}
							adornment={<Icon onClick={() => setInputSearch(!inputSearch)} >search</Icon>}
							floatingText={" "}
							type="text"
							value={search}
							placeholder={isMobile ? "" : translate.search}
							onChange={event => {
								setSearch(event.target.value);
							}}
						/>
					</div>
				</div>
				<Scrollbar>
					<div style={{ height: '100%', paddingRight: !isMobile && '1em' }}>
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
									<div style={{ padding: "0.5em" }}>
										<EnhancedTable
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
											refetch={getDrafts}
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
													<DraftRow
														key={`draft${draft.id}${draft.title}`}
														translate={translate}
														action={() => bHistory.push(`/company/${company.id}/draft/${draft.id}`)}
														renderDeleteIcon={_renderDeleteIcon}
														draft={draft}
														companyStatutes={vars.companyStatutes}
														draftTypes={draftTypes}
														company={company}
														info={props}
													/>
												);
											})}
										</EnhancedTable>
									</div>
								))}
					</div>
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
				</Scrollbar>
			</div>
		</React.Fragment>
	);
}

export const DraftRow = ({ draft, draftTypes, company, selectable, companyStatutes, translate, info, ...props }) => {
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

	const mouseEnterHandler = () => {
		setShowActions(true)
	}

	const mouseLeaveHandler = () => {
		setShowActions(false)
	}

	const desplegarEtiquetas = event => {
		event.preventDefault()
		event.stopPropagation()
		setExpanded(!expanded)
	}

	const columns = buildTagColumns(draft, formatLabelFromName(companyStatutes, translate));


	const getCheckbox = () => {
		const isChecked = props.isChecked(draft.id);

		return (
			<Checkbox
				value={isChecked}
				checked={isChecked}
				onChange={() =>
					props.updateSelectedValues(draft.id)
				}
			/>
		)

	}

	if (isMobile) {
		return (
			<Grid style={{ height: "100%", width: "100%" }}>
				{columns &&
					Object.keys(columns).map(key => {
						let columnaLength = columns[key].length;
						return (
							<Card style={{ marginBottom: "0.8em", width: "100%" }}>
								<CardContent>
									<Grid>
										<GridItem xs={4} md={4} lg={4} style={{ fontWeight: '700' }}>
											{translate.name}
										</GridItem>
										<GridItem xs={8} md={8} lg={8} style={{
											whiteSpace: 'nowrap',
											overflow: 'hidden',
											textOverflow: 'ellipsis'
										}}>
											{draft.title}
										</GridItem>
										<GridItem xs={12} md={12} lg={12} style={{}}>
											<div style={{}}>
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
										</GridItem>
									</Grid>
								</CardContent>
								<CardActions>
									{props.renderDeleteIcon(draft.id)}
								</CardActions>
							</Card>
						)
					})}
			</Grid>
		)
	} else {
		return (
			<TableRow
				{...handlers}
				hover
			>
				{selectable &&
					<TableCell
						style={TableStyles.TD}
					>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							{getCheckbox()}
							{props.alreadySaved(draft.id) &&
								<i className="fa fa-floppy-o"
									style={{
										cursor: "pointer",
										fontSize: "2em",
										color: getSecondary()
									}}
								/>
							}
						</div>
					</TableCell>
				}
				<TableCell
					style={{
						...TableStyles.TD,
						cursor: 'pointer'
					}}
					onClick={props.action}
				>
					{draft.title}
				</TableCell>
				<TableCell>
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
						{(show && props.renderDeleteIcon) ? props.renderDeleteIcon(draft.id) : ''}
					</div>
				</TableCell>
			</TableRow>
		)
	}
}

export default withApollo((withSharedProps()(
	compose(
		graphql(deleteDraft, {
			name: "deleteDraft",
			options: {
				errorPolicy: "all"
			}
		})
	)(withWindowSize(CompanyDraftList)))
));
