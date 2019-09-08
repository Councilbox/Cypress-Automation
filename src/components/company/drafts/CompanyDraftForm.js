import React from "react";
import {
	Grid,
	GridItem,
	TextInput,
	Scrollbar,
	AlertConfirm,
	DropDownMenu,
} from "../../../displayComponents";
import RichTextInput from "../../../displayComponents/RichTextInput";
import { MenuItem, TextField, Input, Icon, Collapse, Card, CardHeader, IconButton } from "material-ui";
import * as CBX from "../../../utils/CBX";
import { GOVERNING_BODY_TYPES, DRAFTS_LIMITS } from "../../../constants";
import { withStyles } from "material-ui";
import PropTypes from "prop-types";
import withWindowSize from "../../../HOCs/withWindowSize";
import { Divider, Tooltip } from "material-ui";
import { primary } from "../../../styles/colors";
import { withApollo } from 'react-apollo';
import { isMobile } from "react-device-detect";
import gql from 'graphql-tag';
import { companyDrafts } from "../../../queries/companyDrafts";




export const levelColor = ['#b47fb6', '#7fa5b6', '#7f94b6'];

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

const CompanyDraftForm = ({ translate, draft, errors, updateState, companyStatutes, draftTypes, rootStatutes, languages, votingTypes, majorityTypes, companyTypes, match, client, ...props }) => {
	const [search, setSearch] = React.useState('');
	const [newTag, setNewTag] = React.useState('');
	const [testTags, setTestTags] = React.useState({});
	const [tagsSend, setTagsSend] = React.useState([]);
	const [openClonar, setOpenClonar] = React.useState(false);
	const [openSelectorEtiquetas, setOpenSelectorEtiquetas] = React.useState(false);



	const removeTag = tag => {
		delete testTags[tag];
		setTestTags({ ...testTags });
		updateState({ tags: testTags })
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

	const formatLabelFromName = tag => {
		if(tag.type === 0){
			const title = companyStatutes.find(statute => statute.id === +tag.name.split('_')[1]).title;
			return translate[title] || title;
		}

		return tag.segments ?
		`${tag.segments.reduce((acc, curr) => {
			if (curr !== tag.label) return acc + (translate[curr] || curr) + '. '
			return acc;
		}, '')}`
		:
		translate[tag.name]? translate[tag.name] : tag.name
	}

	const reduceTagName = tag => {
		return tag.name
	}

	const addTag = tag => {
		setTestTags({
			...testTags,
			[reduceTagName(tag)]: {
				...tag,
				label: formatTagLabel(tag),
				active: true
			}
		});
		let data = {
			...testTags,
			[reduceTagName(tag)]: {
				...tag,
				label: formatTagLabel(tag),
				active: true
			}
		}
		tagsSend.push(tag.label)
		updateState({ tags: data })
	}


	React.useEffect(() => {
		let formattedTags = {};
		Object.keys(draft.tags).forEach(key => {
			formattedTags[reduceTagName(draft.tags[key])] = {
				...draft.tags[key],
				label: formatLabelFromName(draft.tags[key])
			}
		})

		setTestTags({ ...formattedTags });
	}, []);

	const renderTitle = () => {
		return (
			<React.Fragment>
				<div style={{ fontSize: "18px" }}>{translate.title}</div>
				<div>
					<Input
						placeholder={translate.title}
						disableUnderline={true}
						id={"titleDraft"}
						style={{
							color: "rgba(0, 0, 0, 0.36)",
							fontSize: '15px',
							boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)',
							border: "1px solid #d7d7d7",
							width: "100%",
							padding: '.5em 1.6em',
							marginTop: "1em"
						}}
						value={draft.title}
						onChange={event =>
							updateState({
								title: event.nativeEvent.target.value
							})
						}
						classes={{ input: props.classes.input }}
					>
					</Input>
				</div>
			</React.Fragment>
		);
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
							return <EtiquetaBase
								key={`tag_${tag.label}`}
								text={translate[tag.label] || tag.label}
								color={getTagColor(key)}
								action={() => removeTag(tag.name)}
								props={props}
							/>
						})}
					</TagColumn>
				))}
			</div>
		);
	}

	const renderDescription = () => {
		return (
			<React.Fragment>
				<div style={{ fontSize: "18px" }}>{translate.description}</div>
				<div>
					<TextField
						error={errors.description}
						value={draft.description}
						id={"descripcionPlantilla"}
						onChange={event =>
							updateState({
								description: event.nativeEvent.target.value
							})
						}
						style={{
							color: "rgba(0, 0, 0, 0.36)",
							fontSize: '18px',
							boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)',
							border: "1px solid #d7d7d7",
							width: "100%",
							padding: '.5em 1.6em',
							marginTop: "1em",
							minHeight: "86px",
							resize: 'none',
						}}
						InputProps={{
							disableUnderline: true,
							style: {
								color: "rgba(0, 0, 0, 0.36)",
							}
						}}
						placeholder={'Añadir una descripcion detallada' /*TRADUCCION*/}
						multiline={true}
						rows={2}
						rowsMax={4}
					/>
				</div>
			</React.Fragment>
		);
	}

	const handleEnter = event => {
		if (event.keyCode === 13) {
			addTag({
				label: newTag,
				type: 99
			});
			setNewTag('');
		}
	}

	const renderRichEditor = () => {
		return (
			<React.Fragment>
				<div>
					<RichTextInput
						id={"draftRichEditor"}
						value={draft.text || ""}
						errorText={errors.text}
						translate={translate}
						onChange={value =>
							updateState({
								text: value
							})
						}
						tags={CBX.getTagVariablesByDraftType(draft.type, translate)}
					/>
				</div>
			</React.Fragment>
		);
	}

	let tagsSearch = []
	companyStatutes.filter(statute => !testTags[translate[statute.title] ? translate[statute.title] : statute.title]).map(statute => (
		tagsSearch.push({
			label: translate[statute.title] || statute.title,
			name: `statute_${statute.id}`,
			type: 0
		})
	));
	Object.keys(GOVERNING_BODY_TYPES).filter(key => !testTags[GOVERNING_BODY_TYPES[key].label]).map(key => (
		tagsSearch.push({
			name: GOVERNING_BODY_TYPES[key].label,
			label: translate[GOVERNING_BODY_TYPES[key].label],
			type: 1
		})
	))
	draftTypes.map(draft => (
		tagsSearch.push({
			name: draft.label,
			label: translate[draft.label],
			type: 2
		})
	))

	draftTypes.map(draft => (
		draft.label === 'agenda' &&
		CBX.filterAgendaVotingTypes(votingTypes).filter(type => !testTags[type.label]).map(votingType =>
			tagsSearch.push({
				name: votingType.label,
				label: translate[votingType.label],
				type: 2,
			})
		)
	))

	let matchSearch = []
	if (search) {
		matchSearch = tagsSearch.filter(statute =>
			(statute.name ? statute.name : statute.label).toLowerCase().includes(search.toLowerCase())
		).map(statute => {
			return ({
				name: statute.label,
				label: statute.translation || statute.label,
				type: statute.type
			})
		}
		)
	}

	const renderSelectorEtiquetas = () => {
		return (
			<React.Fragment>
				<div style={{ fontSize: "18px", display: "flex" }}>
					<div style={{ marginRight: "0.6em" }}>Etiquetas</div>
					<div>
						<i className="material-icons" style={{ transform: 'scaleX(-1)', fontSize: "20px" }}>
							local_offer
							</i>
					</div>
					{/* <div onClick={() => setOpenClonar(true)} id={"modalCargarPlantillas"} >
						ModalClonar
					</div> */}
				</div>
				<div style={{ boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)', border: 'solid 1px #d7d7d7', marginTop: "1em", }}>
					<div style={{ paddingLeft: "1em", paddingRight: "1em" }}>
						<div style={{ marginBottom: "1em" }}>
							<TextInput
								id={"buscadorEtiqueta"}
								placeholder={"Busca una etiqueta" /*TRADUCCION*/}
								adornment={<Icon>search</Icon>}
								type="text"
								value={search}
								styleInInput={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.36)" }}
								classes={{ input: props.classes.input }}
								onChange={event => {
									setSearch(event.target.value);
								}}
							/>
						</div>

						<div style={{ display: matchSearch.length > 0 ? "block" : "none" }}>
							{matchSearch &&
								!!companyStatutes &&
								<ContenedorEtiquetas
									search={true}
									color={'rgba(128, 78, 33, 0.58)'}
									addTag={addTag}
									translate={translate}
									title={translate.council_type}
									tags={matchSearch.map(statute => {
										return ({
											label: translate[statute.title] || statute.title,
											name: `statute_${statute.id}`,
											type: 0
										})
									}
									)}
								/>
							}
						</div>
						<div style={{}}>
							{!!companyStatutes &&
								<ContenedorEtiquetas
									color={'#b47fb6'}
									translate={translate}
									addTag={addTag}
									title={translate.council_type}
									stylesContent={{
										border: '1px solid #c196c3',
										color: '#b47fb6',
									}}
									tags={companyStatutes.filter(statute => {
										return !testTags[`statute_${statute.id}`]
									}).map(statute => (
										{
											label: translate[statute.title] || statute.title,
											name: `statute_${statute.id}`,
											type: 0
										}
									))}
								/>
							}
							<ContenedorEtiquetas
								color={'#7fa5b6'}
								translate={translate}
								addTag={addTag}
								title={'Órganos de gobierno'/*TRADUCCION*/}
								stylesContent={{
									border: '1px solid #7fa5b6',
									color: '#7fa5b6',
								}}
								tags={Object.keys(GOVERNING_BODY_TYPES).filter(key => (
									!testTags[GOVERNING_BODY_TYPES[key].label] && GOVERNING_BODY_TYPES[key].value !== 0
								)).map(key => (
									{
										name: GOVERNING_BODY_TYPES[key].label,
										label: translate[GOVERNING_BODY_TYPES[key].label],
										type: 1
									}
								</div>

							{!!draftTypes &&
								<ContenedorEtiquetas
									color={'#7fa5b6'}
									addTag={addTag}
									translate={translate}
									title={translate.draft_type}
									stylesContent={{
										border: '1px solid #7fa5b6',
										color: '#7fa5b6',
									}}
									tags={draftTypes.filter(type => {
										return !testTags[type.label]
									}).map(draft => (
										{
											name: draft.label,
											label: translate[draft.label],
											type: 2,
											childs: draft.label === 'agenda'?
												CBX.filterAgendaVotingTypes(votingTypes).filter(type => {
													return !testTags[draft.label];
												}).map(votingType => {
														return (
															<Etiqueta
																childs={CBX.hasVotation(votingType.value) ?
																	majorityTypes
																		.filter(majority => {
																			return !testTags[reduceTagName({
																				name: draft.label,
																				segments: [draft.label, votingType.label, majority.label],
																			})]
																		})
																		.map(majority => {
																			return (
																				<Etiqueta
																					key={`tag_${majority.value}`}
																					text={translate[majority.label]}
																					color={getTagColor(draft.value)}
																					action={() => addTag({
																						name: draft.label,
																						segments: [draft.label, votingType.label, majority.label],
																						label: translate[majority.label],
																						type: 2,
																					})}
																				/>
																			)
																		}) : null}
																text={translate[votingType.label]}
																color={getTagColor(draft.value)}
																action={() => addTag({
																	name: draft.label,
																	segments: [draft.label, votingType.label],
																	label: translate[votingType.label],
																	type: 2,
																})}
																key={"tag_" + votingType.value}
															/>
														)
													}) : null
										}
									))}
								/>
							}
						</div>
					</div>
				</div>

				<AlertConfirm
					requestClose={() => setOpenClonar(false)}
					open={openClonar}
					hideAccept={true}
					bodyText={
						<ModalCargarPlantillas
							props={props}
							companyStatutes={companyStatutes}
							draftTypes={draftTypes}
							votingTypes={votingTypes}
							majorityTypes={majorityTypes}
							formatTagLabel={formatTagLabel}
							addTag={addTag}
							translate={translate}
							match={match}
							client={client}
						/>
					}
					title={"Cargar Plantilla"}
					bodyStyle={{ width: "75vw", minWidth: "50vw", }}
				/>

			</React.Fragment>
		);
	}

	if (props.innerWidth > 960) {
		return (
			<Scrollbar>
				<Grid spacing={16} style={{ height: "100%", width: "100%", marginBottom: "1em" }}>
					<GridItem xs={12} lg={8} md={8} style={{}}>
						<Grid spacing={16} style={{ height: "100%" }}>
							<GridItem xs={12} lg={12} md={12} >
								{renderTitle()}
							</GridItem>
							<GridItem xs={12} lg={12} md={12} style={{ marginTop: " 1em" }}>
								{renderEtiquetasSeleccionadas()}
							</GridItem>
							<GridItem xs={12} lg={12} md={12}>
								{renderDescription()}
							</GridItem>
							{openSelectorEtiquetas &&
								<Fade show={openSelectorEtiquetas}>
									{renderRichEditor()}
								</Fade>
							}
						</Grid>
					</GridItem>
					<GridItem xs={12} lg={4} md={4} style={{}}>
						{renderSelectorEtiquetas()}
					</GridItem>
					{!openSelectorEtiquetas &&
						<Fade show={!openSelectorEtiquetas}>
							{renderRichEditor()}
						</Fade>
					}
				</Grid>
			</Scrollbar >
		);
	} else {
		return (
			<Scrollbar>
				<Grid spacing={16} style={{ height: "100%", width: "100%", marginBottom: "1em" }}>
					<GridItem xs={12} lg={12} md={12} style={{ height: "100%" }}>
						<Grid spacing={16} style={{ height: "100%" }}>
							<GridItem xs={12} lg={8} md={8} >
								{renderTitle()}
							</GridItem>
							<GridItem xs={12} lg={8} md={8} style={{ marginTop: " 1em" }}>
								{renderSelectorEtiquetas()}
							</GridItem>
							<GridItem xs={12} lg={8} md={8} style={{ marginTop: " 1em" }}>
								{renderEtiquetasSeleccionadas()}
							</GridItem>
							<GridItem xs={12} lg={8} md={8}>
								{renderDescription()}
							</GridItem>
							<GridItem xs={12} lg={8} md={8}>
								{renderRichEditor()}
							</GridItem>
						</Grid>
					</GridItem>
				</Grid>
			</Scrollbar>
		);
	}

}



const ModalCargarPlantillas = ({ props, companyStatutes, draftTypes, votingTypes, majorityTypes, formatTagLabel, translate, client, match }) => {
	const [search, setSearch] = React.useState('');
	const [searchModal, setSearchModal] = React.useState('');
	const [searchModalPlantillas, setSearchModalPlantillas] = React.useState('');
	const [testTags, setTestTags] = React.useState({});
	const [draftLoading, setdraftLoading] = React.useState(true);
	const [draftsRender, setDraftsRender] = React.useState({});


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


	const addTag = tag => {
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

	let tagsSearch = []
	companyStatutes.filter(statute => !testTags[translate[statute.title] ? translate[statute.title] : statute.title]).map(statute => (
		tagsSearch.push({
			name: `${statute.title}_${statute.id}`,
			label: `statute_${statute.id}`,
			type: 0
		})
	));
	Object.keys(GOVERNING_BODY_TYPES).filter(key => !testTags[GOVERNING_BODY_TYPES[key].label]).map(key => (
		tagsSearch.push({
			name: GOVERNING_BODY_TYPES[key].label,
			label: GOVERNING_BODY_TYPES[key].label,
			type: 1
		})
	))
	draftTypes.map(draft => (
		tagsSearch.push({
			name: draft.label,
			label: draft.label,
			type: 2
		})
	))

	draftTypes.map(draft => (
		draft.label === 'agenda' &&
		CBX.filterAgendaVotingTypes(votingTypes).filter(type => !testTags[type.label]).map(votingType =>
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
				columns[tag.type] = columns[tag.type] ? [...columns[tag.type], tag] : [tag]
			});

			return columns;
		}

		const columns = buildTagColumns(testTags);

		return (
			<div style={{ display: isMobile ? "" : 'flex' }}>
				{Object.keys(columns).map(key => (
					<TagColumn key={`column_${key}`}>
						{columns[key].map(tag => (
							<EtiquetaBase
								key={`tag_${tag}`}
								text={translate[tag.label] || tag.label}
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
														translate={translate}
														color={'rgba(128, 78, 33, 0.58)'}
														addTag={addTag}
														title={translate.council_type}
														tags={matchSearch.map(statute => {
															return ({
																name: `${statute.label}_${statute.id}`,
																label: statute.label,
																type: statute.type
															})
														}
														)}
													/>
													:

													<Grid>
														<GridItem xs={4} lg={4} md={4}>
															<div style={{}}>
																{!!companyStatutes &&
																	<EtiquetasModal
																		color={levelColor[0]}
																		addTag={addTag}
																		title={translate.council_type}
																		stylesContent={{
																			border: '1px solid #c196c3',
																			color: levelColor[0],
																		}}
																		tags={companyStatutes.filter(statute => !testTags[translate[statute.title] ? translate[statute.title] : statute.title]).map(statute => (
																			{
																				name: `statute_${statute.id}`,
																				label: statute.title,
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
																			name: GOVERNING_BODY_TYPES[key].label,
																			label: GOVERNING_BODY_TYPES[key].label,
																			type: 1
																		}
																	))}
																/>

															</div>
														</GridItem>
														<GridItem xs={4} lg={4} md={4}>
															<div style={{ display: "flex" }}>
																{!!draftTypes &&
																	<EtiquetasModal
																		color={levelColor[2]}
																		addTag={addTag}
																		title={translate.draft_type}
																		stylesContent={{
																			border: '1px solid #7fa5b6',
																			color: levelColor[2],
																		}}
																		tags={draftTypes.map(draft => (
																			{
																				label: draft.label,
																				translation: translate[draft.label],
																				type: 2,
																				childs: draft.label === 'agenda' ?
																					CBX.filterAgendaVotingTypes(votingTypes)
																						.filter(type => !testTags[type.label])
																						.map(votingType => {
																							return (
																								<Etiqueta
																									// key={`tag_${votingType.value}`}
																									childs={CBX.hasVotation(votingType.value) ?
																										majorityTypes
																											.filter(majority => {
																												return !testTags[formatTagLabel({
																													label: majority.label,
																													segments: [draft.label, votingType.label, majority.label],
																												})]
																											})
																											.map(majority => {
																												return (
																													<Etiqueta
																														key={`tag_${majority.value}`}
																														text={translate[majority.label]}
																														color={getTagColor(draft.value)}
																														action={() => addTag({
																															name: majority.label,
																															segments: [draft.label, votingType.label, majority.label],
																															label: translate[majority.label],
																															type: 2,
																														})}
																													/>
																												)
																											}) : null}
																									text={translate[votingType.label]}
																									color={getTagColor(draft.value)}
																									action={() => addTag({
																										name: votingType.label,
																										segments: [draft.label, votingType.label],
																										label: votingType.label,
																										type: 2,
																									})}
																								/>
																							)
																						}) : null
																			}
																		))}
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
			<div style={{ marginTop: "1em", borderTop: "2px solid #dcdcdc", minHeight: "12em", height: '0', overflow: "hidden" }}>
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

}


const Fade = ({ show, children }) => {
	const [render, setRender] = React.useState(show);

	React.useEffect(() => {
		if (show) setRender(true);
	}, [show]);

	const onAnimationEnd = () => {
		if (!show) setRender(false);
	};

	return (
		render && (
			<GridItem xs={12} lg={12} md={12}
				style={{ animation: `${show ? "fadeIn" : "fadeOut"} 1s` }}
				onAnimationEnd={onAnimationEnd}
			>
				{children}
			</GridItem>
		)
	);
};



const regularCardStyle = {
	cardTitle: {
		fontSize: "1em",
	},
}

const CardPlantillas = withStyles(regularCardStyle)(({ item, classes, translate }) => {
	const [expanded, setExpanded] = React.useState(false);

	const toggleExpanded = () => {
		setExpanded(!expanded)
	}

	return (
		<GridItem xs={12} lg={12} md={12}

		>
			<Card
				style={{

					boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)',
					padding: "0.8em",
					marginBottom: "1em"
				}}>
				<CardHeader
					onClick={toggleExpanded}
					style={{ color: "#000000", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: "pointer", }}
					title={item.title}
					classes={{
						title: classes.cardTitle,
					}}
					action={
						<IconButton
							style={{ top: '5px', width: "35px" }}
							onClick={toggleExpanded}
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
					<div style={{ paddingLeft: "1.5em" }}>
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


export const EtiquetasModal = ({ stylesContent, color, last, title, tags, addTag, translate }) => {

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
						<div
							style={{
								marginRight: "1em",
								cursor: "pointer",
								whiteSpace: 'nowrap',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								maxWidth: '150px',
							}}
							key={`tag_${index}`}
							onClick={() => addTag(tag)}
						>
							{tag.translation ? tag.translation : tag.label}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}



export const ContenedorEtiquetas = ({ stylesContent, color, last, title, tags, addTag, translate, search }) => {
	const [open, setOpen] = React.useState(false);

	if (search) {
		return (
			<div style={{
				fontSize: "12px",
				color: color,
				minHeight: "3.5em",
			}}
			>
				<Collapse in={true} timeout="auto" unmountOnExit >
					<div style={{ marginBottom: "1em" }}>
						<div style={{}} id={"contenedorEtiquetasBuscadas"}>
							{tags.map((tag, index) => (
								<Etiqueta
									key={`tag_${index}`}
									childs={tag.childs}
									text={translate[tag.label] || tag.label}
									color={color ? levelColor[tag.type] : color}
									action={() => addTag(tag)}
								/>
							))}

						</div>
					</div>
				</Collapse>

			</div>
		);
	} else {
		return (
			<div style={{
				boxShadow: ' 0 2px 1px 0 rgba(0, 0, 0, 0.25)',
				marginBottom: !last && "1em",
				fontSize: "12px",
				paddingRight: "1em",
				paddingLeft: "1em",
				minHeight: "3.5em",
				...stylesContent
			}}
			>
				<div style={{ alignItems: "center", justifyContent: "space-between", display: "flex", width: "100%", cursor: "pointer", }} onClick={toggle}>
					<div>{title}</div>
					<div style={{ display: "flex", alignItems: "center" }}>
						{open ?
							<i className="material-icons" style={{ fontSize: "40px" }}>
								arrow_drop_up
						</i>
							:
							<i className="material-icons" style={{ fontSize: "40px" }}>
								arrow_drop_down
					</i>
						}
					</div>
				</div>
				<Collapse in={open} timeout="auto" unmountOnExit >
					<div style={{ marginBottom: "1em" }}>
						<div style={{}}>
							{tags.map((tag, index) => (
								<Etiqueta
									key={`tag_${index}`}
									childs={tag.childs}
									text={translate[tag.label] || tag.label}
									color={getTagColor(tag.type)}
									action={() => addTag(tag)}
								/>
							))}

						</div>
					</div>
				</Collapse>

			</div>
		);
	}
}


export const Etiqueta = ({ text, color, childs, width, etiquetas, addTag, action }) => {
	const [open, setOpen] = React.useState(false);
	const [openTimeOut, setOpenTimeOut] = React.useState(false);


	const toggle = () => {
		let time = open ? 200 : 0;
		setTimeout(() => setOpenTimeOut(!open), time);
		setOpen(!open)
	}

	const styles = {
		borderRadius: '14px',
		border: `solid 1px`,
		borderColor: color,
		color: color,
		padding: "4px 0.8em",
		cursor: 'pointer',
		display: openTimeOut ? width ? "inline-block" : "block" : "inline-block",
		marginRight: "0.5em",
		marginTop: "0.25em",
		marginBottom: "0.25em",
		width: open && width
	}

	if (childs) {
		return (
			<div style={{ ...styles }} >
				<div style={{}}>
					<div style={{ display: "flex", justifyContent: open && "space-between", cursor: "pointer", }} onClick={toggle} >
						<div>{text}</div>
						<div style={{ marginTop: '-5px', height: "5px" }}>
							{open ?
								<i className="material-icons" style={{ fontSize: "27px" }} >
									arrow_drop_up
						</i>
								:
								<i className="material-icons" style={{ fontSize: "27px" }}>
									arrow_drop_down
					</i>
							}
						</div>
					</div>
					{childs &&
						<Collapse in={open} timeout="auto" unmountOnExit >
							<div>
								{childs}
							</div>
						</Collapse>
					}
				</div>
			</div>
		)
	} else {
		return (
			<div style={{ ...styles }} onClick={action}>
				{text}
			</div>
		)
	}

}

export const EtiquetaBase = ({ text, color, action, props }) => {
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

export const getTagColor = type => {
	const colors = {
		0: 'rgba(125, 33, 128, 0.58)',
		1: 'rgba(33, 98, 128, 0.58)',
		2: 'rgba(33, 70, 128, 0.58)',
		99: 'rgba(128, 78, 33, 0.58)'
	}

	return colors[type] ? colors[type] : colors[99];
}


CompanyDraftForm.propTypes = {
	classes: PropTypes.object.isRequired,
};





//companyId $id: Int!
//tags
//options
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


export default withApollo(withStyles(styles)(withWindowSize(CompanyDraftForm)));