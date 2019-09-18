import React from "react";
import { Scrollbar, TextInput, Icon, DropDownMenu, Grid, GridItem } from "../../../displayComponents/index";
import { graphql, withApollo } from "react-apollo";
import { companyDrafts, getCompanyDraftDataNoCompany } from "../../../queries/companyDrafts";
import { DRAFTS_LIMITS, GOVERNING_BODY_TYPES } from "../../../constants";
import { compose } from "react-apollo/index";
import gql from "graphql-tag";
import { sendGAevent } from "../../../utils/analytics";
import * as CBX from "../../../utils/CBX";
import { MenuItem, Card, CardHeader, Tooltip } from "material-ui";
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

	const [vars, setVars] = React.useState({});
	const [varsLoading, setVarsLoading] = React.useState(true);

	const plantillasFiltradas = async () => {
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
			}
		});
		setDraftLoading(false);
		setDraftsRender(response.data.companyDrafts.list);
	}


	React.useEffect(() => {
		if (testTags !== null) {
			plantillasFiltradas();
		}
	}, [searchModalPlantillas, testTags]);

	const getData = async () => {
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
		getData();
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
					{/* {renderEtiquetasSeleccionadas()} */}
				</div>
				<div style={{ marginTop: "1em", borderTop: "2px solid #dcdcdc", minHeight: "20em", height: '0', overflow: "hidden" }}>
					<Scrollbar>
						<Grid style={{ width: "95%", margin: "0 auto", marginTop: "1em", }}>
							<GridItem xs={12} lg={12} md={12} >
								<Grid id={"contenedorPlantillasEnModal"}>
									{!draftLoading &&
										draftsRender.map((item, key) => {
											return (
												// <HoverableRow
												// key={'key__' + item.id}
												// 	translate={translate}
												// 	renderDeleteIcon={_renderDeleteIcon}
												// 	draft={draft}
												// 	draftTypes={draftTypes}
												// 	company={company}
												// 	info={props}
												// />
												<CardPlantillas
													translate={translate}
													key={'key__' + item.id}
													item={item}
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
								</Grid>
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


// const HoverableRow = ({ draft, draftTypes, company, translate, info, ...props }) => {
// 	const [show, handlers] = useHoverRow();
// 	const [expanded, setExpanded] = React.useState(false);
// 	const [showActions, setShowActions] = React.useState(false);

// 	const TagColumn = props => {
// 		return (
// 			<div style={{
// 				display: "flex",
// 				color: "#ffffff",
// 				fontSize: "12px",
// 				marginBottom: "0.5em ",
// 				flexDirection: 'column'
// 			}}>
// 				{props.children}
// 			</div>
// 		)
// 	}

// 	const buildTagColumns = tags => {
// 		const columns = {};
// 		Object.keys(tags).forEach(key => {
// 			const tag = tags[key];
// 			columns[tag.type] = columns[tag.type] ? [...columns[tag.type], tag] : [tag]
// 		});

// 		return columns;
// 	}


// 	const mouseEnterHandler = () => {
// 		setShowActions(true)
// 	}

// 	const mouseLeaveHandler = () => {
// 		setShowActions(false)
// 	}

// 	const desplegarEtiquetas = (event) => {
// 		event.preventDefault()
// 		event.stopPropagation()
// 		setExpanded(!expanded)
// 	}

// 	const columns = buildTagColumns(draft.tags);


// 	if (isMobile) {
// 		return (
// 			<Card
// 				style={{ marginBottom: '0.5em', padding: '0.3em', position: 'relative' }}
// 				onClick={() => {
// 					bHistory.push(`/company/${company.id}/draft/${draft.id}`);
// 				}}
// 			>
// 				<Grid>
// 					<GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
// 						{translate.name}
// 					</GridItem>
// 					<GridItem xs={7} md={7}>
// 						{draft.title}
// 					</GridItem>

// 					<GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
// 						{translate.type}
// 					</GridItem>
// 					<GridItem xs={7} md={7}>
// 						{translate[draftTypes[draft.type].label]}
// 					</GridItem>
// 				</Grid>
// 				<div style={{ position: 'absolute', top: '5px', right: '5px' }}>
// 					{props.renderDeleteIcon(draft.id)}
// 				</div>
// 			</Card>
// 		)
// 	}

// 	return (
// 		<TableRow
// 			hover
// 			{...handlers}
// 			onClick={() => {
// 				bHistory.push(`/company/${company.id}/draft/${draft.id}`);
// 			}}
// 		>
// 			<TableCell
// 				style={TableStyles.TD}
// 			>
// 				{draft.title}
// 			</TableCell>
// 			<TableCell >
// 				<div style={{ display: "flex" }}>
// 					{columns &&
// 						Object.keys(columns).map(key => {
// 							let columnaLength = columns[key].length;
// 							return (
// 								<TagColumn key={`column_${key}`}>
// 									{columns[key].map((tag, index) => {
// 										return (
// 											index > 0 ?
// 												<Collapse in={expanded} timeout="auto" unmountOnExit>
// 													<SelectedTag
// 														key={`tag_${translate[tag.label] || tag.label}_${key}_${index}_${tag.name}_`}
// 														text={translate[tag.label] || tag.label}
// 														color={getTagColor(key)}
// 														props={props}
// 														list={true}
// 														count={""}
// 													/>
// 												</Collapse>
// 												:
// 												<SelectedTag
// 													key={`tag_${translate[tag.label] || tag.label}_${key}_${index}_${tag.name}`}
// 													text={translate[tag.label] || tag.label}
// 													color={getTagColor(key)}
// 													props={props}
// 													list={true}
// 													count={columnaLength > 1 ? expanded ? "" : columnaLength : ""}
// 													stylesEtiqueta={{ cursor: columnaLength > 1 ? "pointer" : "", }}
// 													desplegarEtiquetas={columnaLength > 1 ? desplegarEtiquetas : ""}
// 													mouseEnterHandler={columnaLength > 1 ? mouseEnterHandler : ""}
// 													mouseLeaveHandler={columnaLength > 1 ? mouseLeaveHandler : ""}
// 												/>
// 										)
// 									})}
// 								</TagColumn>
// 							)
// 						})
// 					}
// 				</div>
// 			</TableCell>
// 			<TableCell>
// 				<div style={{ width: '3em' }}>
// 					{show && props.renderDeleteIcon(draft.id)}
// 				</div>
// 			</TableCell>
// 		</TableRow>
// 	)
// }


export const DropdownEtiquetas = withStyles(styles)(({ translate, search, setSearchModal, matchSearch, addTag, vars, testTags, styleBody, anchorOrigin, transformOrigin, removeTag, ...props }) => {

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
					Etiquetas
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
								Etiquetas
														</div>
							<div>
								<TextInput
									placeholder={"Buscar Etiquetas"}
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
												tags={vars.companyStatutes.map(statute => (
													{
														label: translate[statute.title] || statute.title,
														name: `statute_${statute.id}`,
														type: TAG_TYPES.STATUTE
													}
												))}
												testTags={testTags}
												removeTag={removeTag}
											// tags={vars.companyStatutes.filter(statute => !testTags[`statute_${statute.id}`]).map(statute => (
											// 	{
											// 		label: translate[statute.title] || statute.title,
											// 		name: `statute_${statute.id}`,
											// 		type: TAG_TYPES.STATUTE
											// 	}
											// ))}
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
											title={'Órganos de gobierno'/*TRADUCCION*/}
											stylesContent={{
												border: '1px solid #7fa5b6',
												color: getTagColor(TAG_TYPES.GOVERNING_BODY),
											}}
											tags={Object.keys(governingBodyTypes).map(key => (
												{
													name: governingBodyTypes[key].label,
													label: translate[governingBodyTypes[key].label],
													type: TAG_TYPES.GOVERNING_BODY
												}
											))}
											testTags={testTags}
											removeTag={removeTag}
										// tags={Object.keys(governingBodyTypes).filter(key => !testTags[governingBodyTypes[key].label]).map(key => (
										// 	{
										// 		name: governingBodyTypes[key].label,
										// 		label: translate[governingBodyTypes[key].label],
										// 		type: TAG_TYPES.GOVERNING_BODY
										// 	}
										// ))}
										/>

									</div>
								</GridItem>
								<GridItem xs={6} lg={6} md={6} style={{
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
												tags={vars.draftTypes.map(draft => (
													{
														name: draft.label,
														label: translate[draft.label],
														type: TAG_TYPES.DRAFT_TYPE,
													}
												))}
												testTags={testTags}
												removeTag={removeTag}
											// tags={vars.draftTypes.filter(type => !testTags[type.label]).map(draft => (
											// 	{
											// 		name: draft.label,
											// 		label: translate[draft.label],
											// 		type: TAG_TYPES.DRAFT_TYPE,
											// 	}
											// ))}
											/>
										}
									</div>
								</GridItem>
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



const CardPlantillas = withStyles(regularCardStyle)(({ item, classes, translate, onClick }) => {
	const [expanded, setExpanded] = React.useState(false);
	const [hover, setHover] = React.useState(false);

	const toggleExpanded = (event) => {
		event.stopPropagation()
		event.preventDefault()
		setExpanded(!expanded)
	}
	const mouseEnterHandler = () => {
		setHover(true)
	}

	const mouseLeaveHandler = () => {
		setHover(false)
	}

	return (
		<GridItem xs={12} lg={12} md={12}

		>
			<Card
				style={{
					boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)',
					marginBottom: "1em"
				}}>
				<CardHeader
					onMouseOver={mouseEnterHandler}
					onMouseLeave={mouseLeaveHandler}
					style={{
						color: "#000000",
						padding: "1.5em",
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						cursor: "pointer",
						background: hover && "gainsboro"
					}}
					title={
						<div
							style={{
								whiteSpace: 'nowrap',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								width: "100%"
							}}
						>
							{item.title}
						</div>
					}
					classes={{
						title: classes.cardTitle,
						content: classes.content,
					}}

					onClick={onClick}
					action={
						<IconButton
							style={{ top: '5px', width: "35px" }}
							onClick={(event) => toggleExpanded(event)}
							aria-expanded={expanded}
							aria-label="Show more"
							className={"expandButtonModal"}
						>
							<i
								className={"fa fa-angle-down"}
								style={{
									transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
									transition: "all 0.3s"
								}}
							/>
						</IconButton>
					}
				></CardHeader>
				<Collapse in={expanded} timeout="auto" unmountOnExit >
					<div style={{ padding: "1.5em" }}>
						<div>{translate.title}: {item.title}</div>
						<div style={{ display: "flex" }}>{translate.description}:
						<div style={{ paddingLeft: "0.3em" }} dangerouslySetInnerHTML={{
								__html: item.text
							}} ></div>
						</div>
					</div>
				</Collapse>
			</Card>
		</GridItem>
	)
});


const EtiquetasModal = ({ stylesContent, color, last, title, tags, addTag, translate, testTags, removeTag }) => {

	const styles = {
		borderRadius: '20px',
		background: color,
		padding: "0 0.5em",
		display: "inline-block",
		marginRight: "0.5em",
		marginBottom: "3px",
		color: 'white'
	}
	console.log(testTags)

	return (
		<div style={{ width: "100%" }}>
			<div style={{ fontWeight: "700" }} >
				<div>{title}</div>
			</div>
			<div style={{ color: color, width: "100%" }}>
				<div style={{
					display: 'flex',
					flexFlow: 'wrap column',
					maxHeight: '150px',
					width: "100%"
				}}
				>
					{tags.map((tag, index) => {
						return (
							< div
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
		</div >
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

