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
import { levelColor, ContenedorEtiquetas, getTagColor, } from "./CompanyDraftForm";
import { Divider } from "material-ui";
import { primary } from "../../../styles/colors";
import { isMobile } from "react-device-detect";
import { withStyles } from "material-ui";
import { IconButton } from "material-ui";
import { Collapse } from "material-ui";



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

const LoadDraft = withApollo(({ majorityTypes, translate, client, match, defaultTags, ...props}) => {

	const [search, setSearch] = React.useState('');
	const [searchModal, setSearchModal] = React.useState('');
	const [searchModalPlantillas, setSearchModalPlantillas] = React.useState('');
	const [testTags, setTestTags] = React.useState({});
	const [draftLoading, setdraftLoading] = React.useState(true);
	const [draftsRender, setDraftsRender] = React.useState({});

	const [vars, setVars] = React.useState({});
	const [varsLoading, setVarsLoading] = React.useState(true);
	
	// const defaultTags = {
	// 	// "Junta General Ordinaria": {
	// 	// 	active: true,
	// 	// 	type: 0
	// 	// }
	// }

	React.useEffect(() => {
		props.data.refetch();
	}, []);

	const plantillasFiltradas = async () => {
		const response = await client.query({
			query: companyDrafts,
			variables: {
				companyId: match.params.company,
				prototype: 3,
				filters: [
					{
						field: "title",
						text: searchModalPlantillas
					},
				],
				options: {
					limit: DRAFTS_LIMITS[0],
					offset: 0
				},
				tags: Object.keys(testTags),
			}
		});
		setDraftsRender(response.data.companyDrafts.list)
	}

	React.useEffect(() => {
		plantillasFiltradas()
	}, [searchModalPlantillas, testTags]);

	const getData = async () => {
		const response = await client.query({
			query: getCompanyDraftDataNoCompany,
			variables: {
				companyId: match.params.company
			}
		});

		setVars(response.data);
		setVarsLoading(false)
	};

	React.useEffect(() => {
		getData();
		setTestTags({ ...defaultTags });
	}, []);

	const addTag = tag => {
		// console.log(tag)
		setTestTags({
			...testTags,
			[formatTagLabel(tag)]: {
				segments: tag.segments,
				type: tag.type,
				active: true
			}
		});
	}

	const removeTag = tag => {
		delete testTags[tag];
		setTestTags({ ...testTags });
	}


	const getTags = async () => {
		const response = await client.query({
			query: draftTagSearch,
			variables: {
				companyId: match.params.company,
				tags: Object.keys(testTags),
			}
		});
		
		setDraftsRender(response.data.draftTagSearch.list)
		setdraftLoading(false)
	};

	React.useEffect(() => {
		getTags();
	}, [testTags]);

	const formatTagLabel = tag => {
		return tag.segments ?
			`${tag.segments.reduce((acc, curr) => {
				if (curr !== tag.label) return acc + (translate[curr] || curr) + '. '
				return acc;
			}, '')}${tag.type === 99 ? tag.label : translate[tag.label] || tag.label}`
			:
			tag.type !== 99 ? translate[tag.label] || tag.label : tag.label
	}


	if (!varsLoading) {
		let tagsSearch = [];

		vars.companyStatutes.filter(statute => !testTags[translate[statute.title] ? translate[statute.title] : statute.title]).map(statute => (
			tagsSearch.push({
				label: statute.title,
				translation: translate[statute.title],
				type: 0
			})
		));
		Object.keys(GOVERNING_BODY_TYPES).filter(key => !testTags[GOVERNING_BODY_TYPES[key].label]).map(key => (
			tagsSearch.push({
				label: GOVERNING_BODY_TYPES[key].label,
				translation: translate[GOVERNING_BODY_TYPES[key].label],
				type: 1
			})
		))
		vars.draftTypes.map(draft => (
			tagsSearch.push({
				label: draft.label,
				translation: translate[draft.label],
				type: 2
			})
		))

		vars.draftTypes.map(draft => (
			draft.label === 'agenda' &&
			CBX.filterAgendaVotingTypes(vars.votingTypes).filter(type => !testTags[type.label]).map(votingType =>
				tagsSearch.push({
					label: votingType.label,
					translation: translate[votingType.label],
					type: 2,
				})
			)
		))

		let matchSearch = []
		if (searchModal) {
			matchSearch = tagsSearch.filter(statute =>
				(statute.translation ? statute.translation : statute.label).toLowerCase().includes(searchModal.toLowerCase())
			).map(statute => {
				return ({
					label: statute.label,
					translation: statute.translation ? statute.translation : statute.label,
					type: statute.type
				})
			}
			)
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
					columns[tag.type] = columns[tag.type] ? [...columns[tag.type], key] : [key]
				});

				return columns;
			}

			let columns = buildTagColumns(testTags);

			return (
				<div style={{ display: isMobile ? "" : 'flex' }}>
					{Object.keys(columns).map(key => (
						<TagColumn key={`column_${key}`}>
							{columns[key].map(tag => (
								<EtiquetaBase
									key={`tag_${tag}`}
									text={tag}
									color={getTagColor(key)}
									action={() => removeTag(tag)}
									props={props}
								/>
							))}
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
									<DropDownMenu
										id={"cargarPlantillasSelectorEtiquetas"}
										color={primary}
										loading={false}
										paperPropsStyles={{ border: " solid 1px #353434", borderRadius: '3px', }}
										styleBody={{}}
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
													minWidth: "80vw"
												}}>
													<div style={{
														width: "100%",
														display: "flex",
														flexDirection: "row",
													}}
													>
														<div style={{
															marginRight: "2em",
															display: "flex",
															color: "rgb(53, 52, 52)",
															alignItems: "center"
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
																value={searchModal}
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
															title={translate.council_type}
															tags={
																matchSearch.map(statute => {
																	return ({
																		label: statute.label,
																		translation: statute.translation ? statute.translation : statute.label,
																		type: statute.type
																	})
																}
																)}
														/>
														:

														<Grid>
															<GridItem xs={4} lg={4} md={4}>
																<div style={{}}>
																	{!!vars.companyStatutes &&
																		<EtiquetasModal
																			color={levelColor[0]}
																			addTag={addTag}
																			title={translate.council_type}
																			stylesContent={{
																				border: '1px solid #c196c3',
																				color: levelColor[0],
																			}}
																			tags={vars.companyStatutes.filter(statute => !testTags[translate[statute.title] ? translate[statute.title] : statute.title]).map(statute => (
																				{
																					label: statute.title,
																					translation: translate[statute.title],
																					type: 0
																				}
																			))}
																		/>
																	}
																</div>
															</GridItem>
															<GridItem xs={4} lg={4} md={4}>
																<div style={{}}>
																	<EtiquetasModal
																		color={levelColor[1]}
																		addTag={addTag}
																		title={'Órganos de gobierno'/*TRADUCCION*/}
																		stylesContent={{
																			border: '1px solid #7fa5b6',
																			color: levelColor[1],
																		}}
																		tags={Object.keys(GOVERNING_BODY_TYPES).filter(key => !testTags[GOVERNING_BODY_TYPES[key].label]).map(key => (
																			{
																				label: GOVERNING_BODY_TYPES[key].label,
																				translation: translate[GOVERNING_BODY_TYPES[key].label],
																				type: 1
																			}
																		))}
																	/>

																</div>
															</GridItem>
															<GridItem xs={4} lg={4} md={4}>
																<div style={{ display: "flex" }}>
																	{!!vars.draftTypes &&
																		<EtiquetasModal
																			color={levelColor[2]}
																			addTag={addTag}
																			title={translate.draft_type}
																			stylesContent={{
																				border: '1px solid #7fa5b6',
																				color: levelColor[2],
																			}}
																			tags={vars.draftTypes.map(draft => (
																				{
																					label: draft.label,
																					translation: translate[draft.label],
																					type: 2,
																					childs: draft.label === 'agenda' ?
																						CBX.filterAgendaVotingTypes(vars.votingTypes)
																							.filter(type => !testTags[type.label])
																							.map(votingType => {
																								return (
																									<div></div>
																									// <Etiqueta
																									// 	// key={`tag_${votingType.value}`}
																									// 	childs={CBX.hasVotation(votingType.value) ?
																									// 		majorityTypes
																									// 			.filter(majority => {
																									// 				return !testTags[formatTagLabel({
																									// 					label: majority.label,
																									// 					segments: [draft.label, votingType.label, majority.label],
																									// 				})]
																									// 			})
																									// 			.map(majority => {
																									// 				return (
																									// 					<Etiqueta
																									// 						key={`tag_${majority.value}`}
																									// 						text={translate[majority.label]}
																									// 						color={getTagColor(draft.value)}
																									// 						action={() => addTag({
																									// 							label: majority.label,
																									// 							segments: [draft.label, votingType.label, majority.label],
																									// 							translation: translate[majority.label],
																									// 							type: 2,
																									// 						})}
																									// 					/>
																									// 				)
																									// 			}) : null}
																									// 	text={translate[votingType.label]}
																									// 	color={getTagColor(draft.value)}
																									// 	action={() => addTag({
																									// 		label: votingType.label,
																									// 		segments: [draft.label, votingType.label],
																									// 		translation: translate[votingType.label],
																									// 		type: 2,
																									// 	})}
																									// />
																								)
																							}) : null
																				}
																			))}
																		/>
																	}
																</div>
															</GridItem>
															{/* <GridItem xs={12} lg={12} md={12}>
																<div style={{ display: 'flex' }}>
																	<div style={{ marginRight: "1em", fontWeight: "700" }}>Otros</div>
																	<div style={{ marginRight: "1em" }}>Abogacia legal</div>
																	<div style={{ marginRight: "1em" }}>Denuncias</div>
																	<div style={{ marginRight: "1em" }}>Ampliacion capital</div>
																	<div style={{ marginRight: "1em" }}>Cuentas comunidad</div>
	
																</div>
															</GridItem> */}
														</Grid>
													}
												</div>
											</div>
										}
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
						<Grid style={{ width: "95%", margin: "0 auto", marginTop: "1em", }}>
							<GridItem xs={12} lg={12} md={12} >
								<Grid id={"contenedorPlantillasEnModal"}>
									{!draftLoading &&
										draftsRender.map((item, key) => {
											return (
												<CardPlantillas
													translate={translate}
													key={'key__' + item.title}
													item={item}
													onClick={() => {
														//para que vale el label?=???????
														sendGAevent({
															category: 'Borradores',
															action: `Carga de borrador`,
															// label: props.company.businessName
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


const EtiquetasModal = ({ stylesContent, color, last, title, tags, addTag, translate }) => {

	return (
		<div>
			<div style={{ fontWeight: "700" }} >
				<div>{title}</div>
			</div>
			<div style={{ color: color }}>
				<div style={{
					display: 'flex',
					flexFlow: 'wrap column',
					maxHeight: '135px',
				}}
				>
					{tags.map((tag, index) => (
						<Tooltip title={tag.translation ? tag.translation : tag.label} key={"tag_" + index}>
							<div
								style={{
									marginRight: "1em",
									cursor: "pointer",
									whiteSpace: 'nowrap',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									maxWidth: tags.length > 6 ? "150px" : '220px',
								}}
								key={`tag_${index}`}
								onClick={() => addTag(tag)}
							>
								{tag.translation ? tag.translation : tag.label}
							</div>
						</Tooltip>
					))}
				</div>
			</div>
		</div>
	);
}

const EtiquetaBase = ({ text, color, action, props }) => {
	const anchoRef = React.useRef();
	const [tooltip, setTooltip] = React.useState(false);

	React.useLayoutEffect(() => {
		if (anchoRef.current.clientWidth > (15 * 12) && !tooltip) {
			setTooltip(true);
		}
	});

	return (
		<React.Fragment>
			<div style={{ visibility: 'hidden', position: 'absolute' }} ref={anchoRef}>{text}</div>
			<div
				style={{
					borderRadius: '20px',
					background: color,
					padding: "0 0.5em",
					display: "inline-block",
					marginRight: "0.5em",
					marginTop: "0.25em",
					marginBottom: "0.25em",
					color: "white",
					padding: "8px"
				}}
			>
				<div style={{ display: "flex", justifyContent: 'space-between' }}>
					{tooltip ?
						<Tooltip title={text}>
							<div style={{ paddingRight: "0.5em", maxWidth: props.innerWidth < 1190 ? isMobile ? "" : '11em' : '15em' }} className="truncate">{text}</div>
						</Tooltip>
						:
						<div style={{ paddingRight: "0.5em", maxWidth: props.innerWidth < 1190 ? isMobile ? "" : '11em' : '15em' }} className="truncate">{text}</div>
					}
					<div>
						<i
							className="fa fa-times"
							style={{ cursor: 'pointer', background: " #ffffff", color, borderRadius: "6px", padding: "0em 1px" }}
							aria-hidden="true"
							onClick={action}
						>
						</i>
					</div>
				</div>
			</div>
		</React.Fragment>
	)
}


const draftTagSearch = gql`
query DraftTagSearch($companyId: Int! ,$tags: [String], $options: OptionsInput){
				draftTagSearch(companyId: $companyId, tags: $tags, options: $options){
				list {
			id
			userId
			companyId
			title
			description
			text
			type
			votationType
			governingBodyType
			majorityType
			majority
			statuteId
			companyType
			language
			draftId
			creationDate
			lastModificationDate
			corporationId
			majorityDivider
			tags
		}
		total
	}
}
`;


// const LoadDraft = withSharedProps()(({ translate, statutes, statute, ...props }) => {
// 	React.useEffect(() => {
// 		props.data.refetch();
// 	}, []);

// 	const { companyDrafts, loading } = props.data;

// 	return (
// 		<React.Fragment>
// 			{!!companyDrafts && (
// 				<EnhancedTable
// 					translate={translate}
// 					defaultLimit={DRAFTS_LIMITS[0]}
// 					defaultFilter={"title"}
// 					limits={DRAFTS_LIMITS}
// 					page={1}
// 					loading={loading}
// 					length={companyDrafts.list.length}
// 					total={companyDrafts.total}
// 					addedFilters={[
// 						{
// 							field: "type",
// 							text: props.draftType
// 						}
// 					]}
// 					refetch={props.data.refetch}
// 					selectedCategories={[{
// 						field: "statuteId",
// 						value: statute.statuteId,
// 						label: translate[statute.title] || statute.title
// 					}, {
// 						field: "governingBodyType",
// 						value: 'all',
// 						label: translate.all_plural
// 					}]}
// 					categories={[[
// 						...statutes.map(statute => {
// 							return {
// 								field: "statuteId",
// 								value: statute.id,
// 								label: translate[statute.title] || statute.title
// 							}
// 						}),
// 						{
// 							field: "statuteId",
// 							value: 'all',
// 							label: translate.all_plural
// 						},
// 					], [...Object.keys(GOVERNING_BODY_TYPES).filter(key => GOVERNING_BODY_TYPES[key].value !== 0).map(key => {
// 						return {
// 							field: "governingBodyType",
// 							value: GOVERNING_BODY_TYPES[key].value,
// 							label: translate[GOVERNING_BODY_TYPES[key].label] || GOVERNING_BODY_TYPES[key].label
// 						}
// 					}), {
// 							field: "governingBodyType",
// 							value: 'all',
// 							label: translate.all_plural
// 					}]]}
// 					headers={[
// 						{
// 							text: translate.title,
// 							name: "title"
// 						},
// 						{
// 							text: translate.type,
// 							name: "type"
// 						}
// 					]}
// 				>
// 					{companyDrafts.list.map(draft => {
// 						return (
// 							<TableRow
// 								key={`draft${draft.id}`}
// 								style={{ cursor: "pointer" }}
// 								onClick={() => {
// 									console.log(props)
// 									sendGAevent({
// 										category: 'Borradores',
// 										action: `Carga de borrador`,
// 										label: props.company.businessName
// 									})
// 									props.loadDraft(draft);
// 								}}
// 							>
// 								<TableCell>{draft.title}</TableCell>
// 								<TableCell>
// 									{/* {translate[props.info.draftTypes[draft.type].label]} */} {translate[statute.title] || statute.title}
// 								</TableCell>
// 							</TableRow>
// 						);
// 					})}
// 				</EnhancedTable>
// 			)}
// 		</React.Fragment>
// 	);
// })

export default compose(
	graphql(companyDrafts, {
		name: "data",
		options: props => ({
			variables: {
				companyId: props.companyId,
				// prototype: 3,
				// filters: [
				// 	{
				// 		field: "type",
				// 		text: props.draftType
				// 	},
				// 	{
				// 		field: "statuteId",
				// 		text: props.statute.statuteId
				// 	}
				// ],
				options: {
					limit: DRAFTS_LIMITS[0],
					offset: 0
				}
			}
		})
	}),
	graphql(draftTypes, { name: "info" })
)(withStyles(styles)(LoadDraft));

