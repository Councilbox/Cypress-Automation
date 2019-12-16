import React from "react";
import { Scrollbar, TextInput, Icon, DropDownMenu, Grid, GridItem, EnhancedTable } from "../../../displayComponents/index";
import { graphql, withApollo } from "react-apollo";
import { companyDrafts, getCompanyDraftDataNoCompany } from "../../../queries/companyDrafts";
import { DRAFTS_LIMITS, GOVERNING_BODY_TYPES } from "../../../constants";
import { compose } from "react-apollo/index";
import gql from "graphql-tag";
import { sendGAevent } from "../../../utils/analytics";
import * as CBX from "../../../utils/CBX";
import { MenuItem, Card, CardHeader, Tooltip, TableCell, TableRow } from "material-ui";
import { levelColor, ContenedorEtiquetas } from "./CompanyDraftForm";
import { Divider } from "material-ui";
import { primary } from "../../../styles/colors";
import { isMobile } from "react-device-detect";
import { withStyles } from "material-ui";
import { IconButton } from "material-ui";
import { Collapse } from "material-ui";
import withSharedProps from "../../../HOCs/withSharedProps";
import SelectedTag from './draftTags/SelectedTag';
import { createTag, getTagColor, TAG_TYPES } from './draftTags/utils';
import { useHoverRow } from "../../../hooks";

const { NONE, ...governingBodyTypes } = GOVERNING_BODY_TYPES;

export const draftTypes = gql`
	query draftTypes {
		draftTypes {
			id
			label
			value
		}
	}
`;

const styles = {
	'input': {
		'&::placeholder': {
			textOverflow: 'ellipsis !important',
			color: '#0000005c'
		}
	},
	formControl: {
		background: "red"
	}
};

const LoadDraft = withApollo(withSharedProps()(({ majorityTypes, company, translate, client, match, defaultTags, ...props }) => {
	const [search, setSearchModal] = React.useState('');
	const [searchModalPlantillas, setSearchModalPlantillas] = React.useState('');
	const [testTags, setTestTags] = React.useState(null);
	const [draftLoading, setDraftLoading] = React.useState(true);
	const [draftsRender, setDraftsRender] = React.useState([]);
	const [drafts, setDrafts] = React.useState([]);

	const [vars, setVars] = React.useState({});
	const [varsLoading, setVarsLoading] = React.useState(true);

	const getData = async (variables = {}) => {
		setDraftLoading(true);
		const response = await client.query({
			query: companyDrafts,
			variables: {
				companyId: company.id,
				prototype: 3,
				...(searchModalPlantillas ? {
					filters: [
						{
							field: "title",
							text: searchModalPlantillas
						},
					]
				} : {}),
				options: {
					limit: DRAFTS_LIMITS[0],
					offset: 0
				},
				tags: Object.keys(testTags).map(key => testTags[key].name),
				...variables
			}
		});
		setDraftsRender(response.data.companyDrafts.list);
		setDrafts(response.data.companyDrafts);
		setDraftLoading(false);
	}


	React.useEffect(() => {
		if (testTags !== null) {
			getData();
		}
	}, [searchModalPlantillas, testTags]);

	const getVars = async () => {
		const response = await client.query({
			query: getCompanyDraftDataNoCompany,
			variables: {
				companyId: company.id
			}
		});

		setVars(response.data);
		setVarsLoading(false);
	};

	React.useEffect(() => {
		getVars();
		setTestTags(defaultTags ? { ...defaultTags } : {});
	}, []);

	const addTag = tag => {
		setTestTags({
			...testTags,
			[tag.name]: {
				...tag,
				label: formatTagLabel(tag),
				active: true
			}
		});
	}


	const removeTag = tag => {
		delete testTags[tag.name];
		setTestTags({ ...testTags });
	}

	const formatTagLabel = tag => {
		return tag.segments ?
			`${tag.segments.reduce((acc, curr) => {
				if (curr !== tag.label) return acc + (translate[curr] || curr) + '. '
				return acc;
			}, '')}`
			:
			tag.label
	}

	if (!varsLoading) {
		let tagsSearch = [];

		vars.companyStatutes.filter(statute => !testTags[`statute_${statute.id}`]).forEach(statute => (
			tagsSearch.push(createTag(statute, 1, translate))
		));
		Object.keys(governingBodyTypes).filter(key => !testTags[governingBodyTypes[key].label]).forEach(key => (
			tagsSearch.push(createTag(governingBodyTypes[key], 2, translate))
		));
		vars.draftTypes.filter(type => !testTags[type.label]).forEach(draft => tagsSearch.push(createTag({
			...draft,
			addTag,
		}, 3, translate)));

		let matchSearch = [];
		if (search) {
			matchSearch = tagsSearch.filter(tag => {
				return tag.label.toLowerCase().includes(search.toLowerCase())
			});
		}

		const renderEtiquetasSeleccionadas = () => {
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

			const columns = buildTagColumns(testTags);

			console.log(testTags);

			return (
				<div style={{ display: isMobile ? "" : 'flex' }}>
					{Object.keys(columns).map(key => (
						<TagColumn key={`column_${key}`}>
							{columns[key].map(tag => {
								return (
									<SelectedTag
										key={`tag_${tag.label}`}
										text={translate[tag.label] || tag.label}
										color={getTagColor(key)}
										action={() => removeTag(tag)}
										props={props}
									/>
								)
							})}
						</TagColumn>
					))}
				</div>
			);
		}

		return (
			<div>
				<div>
					<div>
						<Grid>
							<GridItem xs={12} lg={6} md={6} style={{ display: "flex" }}>
								<div style={{ display: "flex", alignItems: "center", marginRight: "1em" }}>
									<DropdownEtiquetas
										translate={translate}
										search={search}
										setSearchModal={setSearchModal}
										matchSearch={matchSearch}
										company={company}
										addTag={addTag}
										vars={vars}
										testTags={testTags}
										removeTag={removeTag}
									/>
								</div>
							</GridItem>
							<GridItem xs={12} lg={6} md={6} style={{
								display: 'flex',
								alignItems: 'end',
								justifyContent: 'flex-end',
							}}>
								<div>
									<TextInput
										placeholder={"Buscar Plantillas"}
										adornment={<Icon>search</Icon>}
										type="text"
										value={searchModalPlantillas}
										styleInInput={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.54)", background: "#f0f3f6", paddingLeft: "5px" }}
										classes={{ input: props.classes.input, formControl: props.classes.formControl }}
										disableUnderline={true}
										stylesAdornment={{ background: "#f0f3f6", marginLeft: "0", paddingLeft: "8px" }}
										onChange={event => {
											setSearchModalPlantillas(event.target.value);
										}}
									/>
								</div>
							</GridItem>
						</Grid>
					</div>
				</div>
				<div style={{
					display: "flex",
					color: "#ffffff",
					fontSize: "12px",
					marginBottom: "0.5em ",
					flexDirection: 'column',
					minHeight: "3em"
				}}>
					{renderEtiquetasSeleccionadas()}
				</div>
				<div style={{ marginTop: "1em", borderTop: "2px solid #dcdcdc", minHeight: "20em", height: '0', overflow: "hidden" }}>
					<Scrollbar>
						<Grid style={{ width: "100%", margin: "0 auto", height: "calc( 100% - 3em )" }}>
							<GridItem xs={12} lg={12} md={12} style={{ width: "100%", height: "100%" }}>
								<div id={"contenedorPlantillasEnModal"} style={{ width: "100%", height: "100%" }}>
									{!!drafts.list &&
										<EnhancedTable
											hideTextFilter={true}
											translate={translate}
											defaultFilter={"title"}
											page={1}
											refetch={getData}
											defaultLimit={DRAFTS_LIMITS[0]}
											loading={draftLoading}
											length={drafts.list.length}
											total={drafts.total}
											selectedCategories={[{
												field: "type",
												value: 'all',
												label: translate.all_plural
											}]}
											headers={[
												{
													text: translate.name,
													name: "title",
													canOrder: true
												},
												{
													name: "type",
													text: translate.tags,
													canOrder: true
												},
												{
													name: '',
													text: ''
												}
											]}
											companyID={company.id}
											stylesDivSuperior={{ height: "100%" }}
										>
											{!draftLoading &&
												draftsRender.map((item, key) => {
													return (
														<HoverableRow
															key={'key__' + item.id}
															translate={translate}
															draft={item}
															draftTypes={draftTypes}
															company={company}
															companyStatutes={vars.companyStatutes}
															info={props}
															onClick={() => {
																sendGAevent({
																	category: 'Borradores',
																	action: `Carga de borrador`,
																})
																props.loadDraft(item);
															}}
														/>
													)
												})
											}
										</EnhancedTable>
									}
								</div>
							</GridItem>
						</Grid>
					</Scrollbar>
				</div>
			</div>
		);
	} else {
		return (
			<div></div>
		)
	}

}))


const HoverableRow = ({ draft, draftTypes, company, translate, info, onClick, companyStatutes, ...props }) => {
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

	const formatLabelFromName = tag => {
		if (tag.type === 1) {
			const statute = companyStatutes.find(statute => statute.id === +tag.name.split('_')[tag.name.split('_').length - 1]);
			const title = statute? statute.title : tag.label;
			return translate[title] || title;
		}

		return tag.segments ?
			`${tag.segments.reduce((acc, curr) => {
				if (curr !== tag.label) return acc + (translate[curr] || curr) + '. '
				return acc;
			}, '')}`
			:
			translate[tag.name] ? translate[tag.name] : tag.name
	}

	const _renderEyeIcon = () => {
		return (
			<IconButton
				style={{
					color: primary,
					height: "32px",
					width: "32px",
					outline: 0
				}}
				onClick={event => {
					event.stopPropagation();
					setExpanded(!expanded);
				}}
			>
				<i className="fa fa-eye">
				</i>
			</IconButton>
		);
	}


	const buildTagColumns = tags => {
		const columns = {};
		if(tags){
			Object.keys(tags).forEach(key => {
				const tag = tags[key];
				const formatted = {
					...draft.tags[key],
					label: formatLabelFromName(draft.tags[key])
				}

				columns[tag.type] = columns[tag.type] ? [...columns[tag.type], formatted] : [formatted]
			});
		}

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
				onClick={onClick}
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
					{props.renderDeleteIcon()}
				</div>
			</Card>
		)
	}

	return (
		<TableRow
			hover
			{...handlers}
			onClick={onClick}
		>
			<TableCell>
				{draft.title}

				{expanded &&
					<React.Fragment>
						<div style={{fontWeight: '700', marginTop: '1em'}}>{translate.content}</div>
						<div dangerouslySetInnerHTML={{ __html: draft.text }} />
					</React.Fragment>
				}
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
														color={getTagColor(tag.type)}
														props={props}
														list={true}
														count={""}
													/>
												</Collapse>
												:
												<SelectedTag
													key={`tag_${translate[tag.label] || tag.label}_${key}_${index}_${tag.name}`}
													text={translate[tag.label] || tag.label}
													color={getTagColor(tag.type)}
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
					{show && _renderEyeIcon()}
				</div>
			</TableCell>
		</TableRow>
	)
}


export const DropdownEtiquetas = withStyles(styles)(({ translate, corporation, search, setSearchModal, matchSearch, addTag, vars, testTags, styleBody, anchorOrigin, transformOrigin, removeTag, ...props }) => {
	return (
		<DropDownMenu
			id={"cargarPlantillasSelectorEtiquetas"}
			color={primary}
			loading={false}
			paperPropsStyles={{ border: " solid 1px #353434", borderRadius: '3px', }}
			anchorOrigin={anchorOrigin}
			transformOrigin={transformOrigin}
			Component={() =>
				<MenuItem
					style={{
						height: '100%',
						border: " solid 1px #35343496",
						borderRadius: '3px',
						width: '100%',
						margin: 0,
						padding: 0,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						marginTop: '14px',
						padding: "3px 7px",
						color: "#353434ed",
					}}
				>
					<i className="material-icons" style={{ transform: 'scaleX(-1)', fontSize: "20px", paddingLeft: "10px" }}>
						local_offer
					</i>
					{translate.filter_by}
				</MenuItem>
			}
			text={translate.add_agenda_point}
			textStyle={"ETIQUETA"}
			items={
				<div style={{}} onClick={event => {
					event.stopPropagation();
				}}>
					<div style={{
						margin: "0px 1em",
						minWidth: "50vw",
						...styleBody
					}}>
						<div style={{
							width: "100%",
							display: "flex",
							flexDirection: "row",
							width: "100%"
						}}
						>
							<div style={{
								marginRight: "2em",
								display: "flex",
								color: "rgb(53, 52, 52)",
								alignItems: "center",
								width: "100%"
							}}
							>
								<i className="material-icons" style={{ transform: 'scaleX(-1)', fontSize: "20px", paddingLeft: "10px" }}>
									local_offer
								</i>
								{translate.tags}
							</div>
							<div>
								<TextInput
									placeholder={translate.search_template_tags}
									adornment={<Icon>search</Icon>}
									id={"buscarEtiquetasEnModal"}
									type="text"
									value={search}
									styleInInput={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.54)" }}
									styles={{ marginBottom: "0" }}
									classes={{ input: props.classes.input }}
									onChange={event => {
										setSearchModal(event.target.value);
									}}
									disableUnderline={true}
								/>
							</div>
						</div>
					</div>
					<Divider />
					<div
						style={{
							width: "100%",
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-between",
							margin: "1em"
						}}
					>
						{matchSearch.length > 0 ?
							<ContenedorEtiquetas
								search={true}
								color={'rgba(128, 78, 33, 0.58)'}
								addTag={addTag}
								translate={translate}
								title={translate.council_type}
								tags={matchSearch}
							/>
							:

							<Grid style={{
								width: "100%",
							}}>
								<GridItem xs={3} lg={3} md={3} style={{
									width: "100%",
								}}>
									<div style={{ width: "100%" }}>
										{!!vars.companyStatutes &&
											<EtiquetasModal
												color={getTagColor(TAG_TYPES.STATUTE)}
												addTag={addTag}
												title={translate.council_type}
												stylesContent={{
													border: '1px solid #c196c3',
													color: getTagColor(TAG_TYPES.STATUTE),
												}}
												tags={vars.companyStatutes.map(statute => createTag(statute, TAG_TYPES.STATUTE, translate))}
												testTags={testTags}
												removeTag={removeTag}
											/>
										}
									</div>
								</GridItem>
								<GridItem xs={3} lg={3} md={3} style={{
									width: "100%",
								}}>
									<div style={{ width: "100%" }}>
										<EtiquetasModal
											color={getTagColor(TAG_TYPES.GOVERNING_BODY)}
											addTag={addTag}
											title={translate.governing_body}
											stylesContent={{
												border: '1px solid #7fa5b6',
												color: getTagColor(TAG_TYPES.GOVERNING_BODY),
											}}
											tags={Object.keys(governingBodyTypes)
												.map(key => createTag(governingBodyTypes[key], TAG_TYPES.GOVERNING_BODY, translate))}
											testTags={testTags}
											removeTag={removeTag}
										/>

									</div>
								</GridItem>
								<GridItem xs={3} lg={3} md={3} style={{
									width: "100%",
								}}>
									<div style={{ display: "flex", width: "100%" }}>
										{!!vars.draftTypes &&
											<EtiquetasModal
												color={getTagColor(TAG_TYPES.DRAFT_TYPE)}
												addTag={addTag}
												title={translate.draft_type}
												stylesContent={{
													border: '1px solid #7fa5b6',
													color: getTagColor(TAG_TYPES.DRAFT_TYPE),
												}}
												tags={vars.draftTypes.map(draft => createTag(draft, TAG_TYPES.DRAFT_TYPE, translate))}
												testTags={testTags}
												removeTag={removeTag}
											/>
										}
									</div>
								</GridItem>
								{((props.company && props.company.id === props.company.corporationId) || corporation) &&
									<GridItem xs={3} lg={3} md={3} style={{
										width: "100%",
									}}>
										<div style={{ display: "flex", width: "100%" }}>
											{!!vars.companyTypes &&
												<EtiquetasModal
													color={getTagColor(TAG_TYPES.COMPANY_TYPE)}
													addTag={addTag}
													title={translate.company_type}
													stylesContent={{
														border: `1px solid ${getTagColor(TAG_TYPES.COMPANY_TYPE)}`,
														color: getTagColor(TAG_TYPES.COMPANY_TYPE),
													}}
													tags={vars.companyTypes.map(draft => createTag(draft, TAG_TYPES.DRAFT_TYPE, translate))}
													testTags={testTags}
													removeTag={removeTag}
												/>
											}
										</div>
									</GridItem>
								}
							</Grid>
						}
					</div>
				</div>
			}
		/>
	)
})



const regularCardStyle = {
	cardTitle: {
		fontSize: "1em",
	},
	content: {
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		maxWidth: '100%'
	}
}


const EtiquetasModal = ({ color, title, tags, addTag, testTags, removeTag }) => {

	const styles = {
		borderRadius: '20px',
		background: color,
		padding: "0 0.5em",
		display: "inline-block",
		marginRight: "0.5em",
		marginBottom: "3px",
		color: 'white'
	}


	return (
		<div style={{ width: "100%" }}>
			<div style={{ fontWeight: "700" }}>
				<div>{title}</div>
			</div>
			<div style={{ color: color, width: "100%" }}>
				<div style={{
					display: 'flex',
					flexFlow: 'wrap column',
					//maxHeight: '150px',
					width: "100%"
				}}
				id={'tipoDeReunion'}
				>
					{tags.map((tag, index) => {
						return (
							<div
								style={{
									width: "100%",
									marginRight: "1em",
									cursor: "pointer",
									whiteSpace: 'nowrap',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									maxWidth: tags.length > 6 ? "150px" : '220px',
									...(testTags[tag.name] ? {
										...styles
									} : {}),
								}}
								key={"tag_" + tag.label}
								onClick={() => testTags[tag.name] ? removeTag(tag) : addTag(tag)}
							>
								{tag.label}
							</div>
						)
					})}
				</div>
			</div>
		</div>
	);
}

export default compose(
	graphql(companyDrafts, {
		name: "data",
		options: props => ({
			variables: {
				companyId: props.companyId,
				options: {
					limit: DRAFTS_LIMITS[0],
					offset: 0
				}
			}
		})
	}),
	graphql(draftTypes, { name: "info" })
)(withStyles(styles)(LoadDraft));

