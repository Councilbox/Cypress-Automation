import React, { Fragment } from "react";
import {
	Grid,
	GridItem,
	MajorityInput,
	SelectInput,
	TextInput,
	Scrollbar,
	AlertConfirm,
	DropDownMenu
} from "../../../displayComponents";
import RichTextInput from "../../../displayComponents/RichTextInput";
import { MenuItem, TextField, Input, Icon, Collapse } from "material-ui";
import * as CBX from "../../../utils/CBX";
import { GOVERNING_BODY_TYPES } from "../../../constants";
import TextArea from "antd/lib/input/TextArea";
import { withStyles } from "material-ui";
import PropTypes from "prop-types";
import withWindowSize from "../../../HOCs/withWindowSize";
import { Divider, Tooltip } from "material-ui";
import { primary } from "../../../styles/colors";



const levelColor = ['#b47fb6', '#7fa5b6', '#7f94b6'];

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

const CompanyDraftForm = ({ translate, draft, errors, updateState, companyStatutes, draftTypes, rootStatutes, languages, votingTypes, majorityTypes, companyTypes, ...props }) => {
	const [title, setTitle] = React.useState(draft.title);
	const [search, setSearch] = React.useState('');
	const [description, setDescription] = React.useState(draft.description);
	const [newTag, setNewTag] = React.useState('');//TRADUCCION
	const [infoText, setInfoText] = React.useState(draft.text);
	const [testTags, setTestTags] = React.useState({});


	const removeTag = tag => {
		delete testTags[tag];
		setTestTags({ ...testTags });
	}

	const formatTagLabel = tag => {
		return tag.segments ?
			`${tag.segments.reduce((acc, curr) => {
				if (curr !== tag.label) return acc + (translate[curr] || curr) + '. '
				return acc;
			}, '')}${tag.type === 99 ? tag.label : translate[tag.label] || tag.label}`
			:
			tag.type !== 99 ? translate[tag.label] || tag.label : tag.label
	}

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

	const renderTitle = () => {
		return (
			<React.Fragment>
				<div style={{ fontSize: "18px" }}>{translate.title}</div>
				<div>
					<Input
						placeholder={translate.title}
						disableUnderline={true}
						style={{
							color: "rgba(0, 0, 0, 0.36)",
							fontSize: '15px',
							boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)',
							border: "1px solid #d7d7d7",
							width: "100%",
							padding: '.5em 1.6em',
							marginTop: "1em"
						}}
						// onChange={event => setTitle(event.target.value)}
						// errorText={errors.title}
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
				columns[tag.type] = columns[tag.type] ? [...columns[tag.type], key] : [key]
			});
			console.log(columns)

			return columns;

		}

		const columns = buildTagColumns(testTags);

		return (
			<div style={{ display: 'flex' }}>
				{Object.keys(columns).map(key => (
					<TagColumn key={`column_${key}`}>
						{columns[key].map(tag => (
							<EtiquetaBase
								key={`tag_${tag}`}
								text={tag}
								color={getTagColor(key)}
								action={() => removeTag(tag)}
							/>
						))}
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
					<textarea
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
						placeholder={'Añadir una descripcion detallada' /*TRADUCCION*/}
						error={errors.description}
						value={draft.description}
						onChange={event =>
							updateState({
								description: event.nativeEvent.target.value
							})
						}
					/>
					<TextField
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
						placeholder="MultiLine with rows: 2 and rowsMax: 4"
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
						type="text"
						translate={translate}
						value={infoText}
						onChange={value => { setInfoText(value) }}
					/>
				</div>
			</React.Fragment>
		);
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
					<div onClick={() => setOpenClonar(true)}>
						ModalClonar
					</div>
				</div>
				<div style={{ boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)', border: 'solid 1px #d7d7d7', marginTop: "1em", }}>
					<div style={{ paddingLeft: "1em", paddingRight: "1em" }}>
						<div style={{ marginBottom: "1em" }}>
							<TextInput
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
						<div style={{}}>
							{!!companyStatutes &&
								<ContenedorEtiquetas
									color={'#b47fb6'}
									addTag={addTag}
									title={translate.council_type}
									stylesContent={{
										border: '1px solid #c196c3',
										color: '#b47fb6',
									}}
									tags={companyStatutes.filter(statute => !testTags[translate[statute.title] ? translate[statute.title] : statute.title]).map(statute => (
										{
											label: statute.title,
											translation: translate[statute.title],
											type: 0
										}
									))}
								/>
							}
							<ContenedorEtiquetas
								color={'#7fa5b6'}
								addTag={addTag}
								title={'Órganos de gobierno'/*TRADUCCION*/}
								stylesContent={{
									border: '1px solid #7fa5b6',
									color: '#7fa5b6',
								}}
								tags={Object.keys(GOVERNING_BODY_TYPES).filter(key => !testTags[GOVERNING_BODY_TYPES[key].label]).map(key => (
									{
										label: GOVERNING_BODY_TYPES[key].label,
										translation: translate[GOVERNING_BODY_TYPES[key].label],
										type: 1
									}
								))}
							/>

							{!!draftTypes &&
								<ContenedorEtiquetas
									color={'#7fa5b6'}
									addTag={addTag}
									title={translate.draft_type}
									stylesContent={{
										border: '1px solid #7fa5b6',
										color: '#7fa5b6',
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
																						label: majority.label,
																						segments: [draft.label, votingType.label, majority.label],
																						translation: translate[majority.label],
																						type: 2,
																					})}
																				/>
																			)
																		}) : null}
																text={translate[votingType.label]}
																color={getTagColor(draft.value)}
																action={() => addTag({
																	label: votingType.label,
																	segments: [draft.label, votingType.label],
																	translation: translate[votingType.label],
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
						<div style={{ marginBottom: "1em" }}>
							<TextInput
								type="text"
								placeholder='Crear etiqueta nueva'//TRADUCCION
								value={newTag}
								onKeyUp={handleEnter}
								styleInInput={{ minHeight: '2.5em', paddingLeft: "0.4em", paddingRight: "0.4em", fontSize: "12px", color: "rgba(0, 0, 0, 0.36)", background: "#f2f4f7" }}
								onChange={event => {
									setNewTag(event.target.value);
								}}
							/>
						</div>
					</div>
				</div>

				<AlertConfirm
					requestClose={() => setOpenClonar(false)}
					open={openClonar}
					// acceptAction={this.updateAttachment}
					// buttonAccept={translate.accept}
					// buttonCancel={translate.cancel}
					hideAccept={true}
					bodyText={renderModalClonar()}
					title={"Cargar Plantilla"}
					bodyStyle={{ width: "75vw", minWidth: "50vw", }}
				/>

			</React.Fragment>
		);
	}


	const [openClonar, setOpenClonar] = React.useState(false);
	const [searchModal, setSearchModal] = React.useState('');

	const renderModalClonar = () => {
		return (
			<div style={{}}>
				<div style={{}}>
					<div style={{}}>
						<Grid>
							<GridItem xs={12} lg={6} md={6} style={{ display: "flex" }}>

								<div style={{ display: "flex", alignItems: "center", marginRight: "1em" }}>

									<DropDownMenu
										color={primary}
										// textStyle={{height: '100%', minWidth: "15px" }}
										loading={false}
										paperPropsStyles={{ border: " solid 1px #353434", borderRadius: '3px', }}
										styleBody={{}}
										Component={() =>
											<MenuItem
												style={{
													height: '100%',
													border: " solid 1px #353434",
													borderRadius: '3px',
													width: '100%',
													margin: 0,
													padding: 0,
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													marginTop: '14px',
													padding: "3px 7px"
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
													margin: "0px 1em"
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
																															label: majority.label,
																															segments: [draft.label, votingType.label, majority.label],
																															translation: translate[majority.label],
																															type: 2,
																														})}
																													/>
																												)
																											}) : null}
																									text={translate[votingType.label]}
																									color={getTagColor(draft.value)}
																									action={() => addTag({
																										label: votingType.label,
																										segments: [draft.label, votingType.label],
																										translation: translate[votingType.label],
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
														<GridItem xs={12} lg={12} md={12}>
															<div style={{ display: 'flex' }}>
																<div style={{ marginRight: "1em", fontWeight: "700" }}>Otros</div>
																<div style={{ marginRight: "1em" }}>Abogacia legal</div>
																<div style={{ marginRight: "1em" }}>Denuncias</div>
																<div style={{ marginRight: "1em" }}>Ampliacion capital</div>
																<div style={{ marginRight: "1em" }}>Cuentas comunidad</div>

															</div>
														</GridItem>
													</Grid>
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
								<div >
									<TextInput
										placeholder={"Buscar"}
										adornment={<Icon>search</Icon>}
										type="text"
										value={searchModal}
										styleInInput={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.54)", background: "#f0f3f6", paddingLeft: "5px" }}
										classes={{ input: props.classes.input, formControl: props.classes.formControl }}
										disableUnderline={true}
										stylesAdornment={{ background: "#f0f3f6", marginLeft: "0", paddingLeft: "8px" }}
										onChange={event => {
											setSearchModal(event.target.value);
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
								<Grid>
									{/* {iterate.map()} */}
									<GridItem xs={5} lg={5} md={5}
										style={{
											boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)',
											padding: "0.5em",
											marginBottom: "1em"
										}}
									>
										<div style={{ color: "#000000", textAlign: "center" }}>ASDasdas</div>
									</GridItem>
									{/* si es par */}
									<GridItem xs={2} lg={2} md={2} >
									</GridItem>
									<GridItem xs={5} lg={5} md={5}
										style={{
											boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)',
											padding: "0.5em",
											marginBottom: "1em"
										}}
									>
										<div style={{ color: "#000000", textAlign: "center" }}>ASDasdas</div>
									</GridItem>
									<GridItem xs={5} lg={5} md={5}
										style={{
											boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)',
											padding: "0.5em",
											marginBottom: "1em"
										}}
									>
										<div style={{ color: "#000000", textAlign: "center" }}>ASDasdas</div>
									</GridItem>
									{/* si es par */}
									<GridItem xs={2} lg={2} md={2} >
									</GridItem>
									<GridItem xs={5} lg={5} md={5}
										style={{
											boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)',
											padding: "0.5em",
											marginBottom: "1em"
										}}
									>
										<div style={{ color: "#000000", textAlign: "center" }}>ASDasdas</div>
									</GridItem>
									<GridItem xs={5} lg={5} md={5}
										style={{
											boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)',
											padding: "0.5em",
											marginBottom: "1em"
										}}
									>
										<div style={{ color: "#000000", textAlign: "center" }}>ASDasdas</div>
									</GridItem>
									{/* si es par */}
									<GridItem xs={2} lg={2} md={2} >
									</GridItem>
									<GridItem xs={5} lg={5} md={5}
										style={{
											boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)',
											padding: "0.5em",
											marginBottom: "1em"
										}}
									>
										<div style={{ color: "#000000", textAlign: "center" }}>ASDasdas</div>
									</GridItem>
									<GridItem xs={5} lg={5} md={5}
										style={{
											boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)',
											padding: "0.5em",
											marginBottom: "1em"
										}}
									>
										<div style={{ color: "#000000", textAlign: "center" }}>ASDasdas</div>
									</GridItem>
									{/* si es par */}
									<GridItem xs={2} lg={2} md={2} >
									</GridItem>
									<GridItem xs={5} lg={5} md={5}
										style={{
											boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)',
											padding: "0.5em",
											marginBottom: "1em"
										}}
									>
										<div style={{ color: "#000000", textAlign: "center" }}>ASDasdas</div>
									</GridItem>

								</Grid>
							</GridItem>

						</Grid>
					</Scrollbar>
				</div>
			</div>
		);
	}


	if (props.innerWidth > 960) {
		return (
			<Scrollbar>
				<Grid spacing={16} style={{ height: "100%", width: "100%" }}>
					<GridItem xs={12} lg={8} md={8} style={{ height: "100%" }}>
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
							<GridItem xs={12} lg={12} md={12}>
								{renderRichEditor()}
							</GridItem>
						</Grid>
					</GridItem>
					<GridItem xs={12} lg={4} md={4} style={{}}>
						{renderSelectorEtiquetas()}
					</GridItem>
				</Grid>
			</Scrollbar>
		);
	} else {
		return (
			<Scrollbar>
				<Grid spacing={16} style={{ height: "100%", width: "100%" }}>
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



const ContenedorEtiquetas = ({ stylesContent, color, last, title, tags, addTag, translate }) => {
	const [open, setOpen] = React.useState(false);

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
			<div style={{ alignItems: "center", justifyContent: "space-between", display: "flex", width: "100%", cursor: "pointer", }} onClick={() => setOpen(!open)}>
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
								text={tag.translation ? tag.translation : tag.label}
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


const Etiqueta = ({ text, color, childs, width, etiquetas, addTag, action }) => {
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

const EtiquetaBase = ({ text, color, action }) => {
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
							<div style={{ paddingRight: "0.5em", maxWidth: '15em' }} className="truncate">{text}</div>
						</Tooltip>
						:
						<div style={{ paddingRight: "0.5em", maxWidth: '15em' }} className="truncate">{text}</div>
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

const getTagColor = type => {
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

export default withStyles(styles)(withWindowSize(CompanyDraftForm));


// const CompanyDraftForm = ({
// 	translate,
// 	draft,
// 	errors,
// 	updateState,
// 	companyStatutes,
// 	draftTypes,
// 	rootStatutes,
// 	languages,
// 	votingTypes,
// 	majorityTypes,
// 	companyTypes
// }) => (
// 	<Grid spacing={16}>
// 		<GridItem xs={12} lg={3} md={3}>
// 			<TextInput
// 				floatingText={translate.title}
// 				type="text"
// 				required
// 				errorText={errors.title}
// 				value={draft.title}
// 				onChange={event =>
// 					updateState({
// 						title: event.nativeEvent.target.value
// 					})
// 				}
// 			/>
// 		</GridItem>
// 		{!!rootStatutes &&
// 			<GridItem xs={12} lg={3} md={3}>
// 				<SelectInput
// 					floatingText={translate.council_type}
// 					value={draft['prototype'] || 0}
// 					errorText={errors['prototype']}
// 					onChange={event =>
// 						updateState({
// 							prototype: event.target.value
// 						})
// 					}
// 				>
// 					{rootStatutes.map(council => {
// 						return (
// 							<MenuItem
// 								value={council['prototype']}
// 								key={`counciltype_${council['prototype']}`}
// 							>
// 								{translate[council.title] || council.title}
// 							</MenuItem>
// 						);
// 					})}
// 				</SelectInput>
// 			</GridItem>
// 		}
// 		{!!companyStatutes &&
// 			<GridItem xs={12} lg={3} md={3}>
// 				<SelectInput
// 					floatingText={translate.council_type}
// 					value={draft.statuteId || 0}
// 					errorText={errors.statuteId}
// 					onChange={event =>
// 						updateState({
// 							statuteId: event.target.value
// 						})
// 					}
// 				>
// 					{companyStatutes.map(council => {
// 						return (
// 							<MenuItem
// 								value={council.id}
// 								key={`counciltype_${council.id}`}
// 							>
// 								{translate[council.title] || council.title}
// 							</MenuItem>
// 						);
// 					})}
// 				</SelectInput>
// 			</GridItem>
// 		}
// 		{!!companyTypes &&
// 			<GridItem xs={12} lg={3} md={3}>
// 				<SelectInput
// 					floatingText={translate.company_type}
// 					value={draft.companyType || 0}
// 					errorText={errors.companyType}
// 					onChange={event =>
// 						updateState({
// 							companyType: event.target.value
// 						})
// 					}
// 				>
// 					{companyTypes.map(companyType => {
// 						return (
// 							<MenuItem
// 								key={companyType.label}
// 								value={companyType.value}
// 							>
// 								{translate[companyType.label]}
// 							</MenuItem>
// 						);
// 					})}
// 				</SelectInput>
// 			</GridItem>
// 		}
// 		<GridItem xs={12} lg={3} md={3}>
// 			<SelectInput
// 				floatingText={'Órgano de gobierno'}
// 				value={draft.governingBodyType || 0}
// 				errorText={errors.governingBodyType}
// 				onChange={event =>
// 					updateState({
// 						governingBodyType: event.target.value
// 					})
// 				}
// 			>
// 			    {Object.keys(GOVERNING_BODY_TYPES).map(key => (
//                     <MenuItem
//                         value={GOVERNING_BODY_TYPES[key].value}
//                         key={GOVERNING_BODY_TYPES[key].value}
//                     >
//                         {translate[GOVERNING_BODY_TYPES[key].label] || GOVERNING_BODY_TYPES[key].label}
//                     </MenuItem>
//                 ))}
// 			</SelectInput>
// 		</GridItem>
// 		{!!languages &&
// 			<GridItem xs={12} lg={3} md={3}>
// 				<SelectInput
// 					floatingText={translate.language}
// 					value={draft.language}
// 					errorText={errors.language}
// 					onChange={event =>
// 						updateState({
// 							language: event.target.value
// 						})
// 					}
// 				>
// 					{languages.map(language => {
// 						return (
// 							<MenuItem value={language.columnName} key={`language_${language.columnName}`}>
// 								{language.desc}
// 							</MenuItem>
// 						);
// 					})}
// 				</SelectInput>
// 			</GridItem>
// 		}
// 		{!!draftTypes &&
// 			<GridItem xs={12} lg={3} md={3}>
// 				<SelectInput
// 					floatingText={translate.draft_type}
// 					value={"" + draft.type}
// 					errorText={errors.type}
// 					onChange={event =>
// 						updateState({
// 							type: +event.target.value,
// 							votationType: 0
// 						})
// 					}
// 				>
// 					{draftTypes.map(draft => {
// 						return (
// 							<MenuItem
// 								value={"" + draft.value}
// 								key={`draftType_${draft.value}`}
// 							>
// 								{translate[draft.label]}
// 							</MenuItem>
// 						);
// 					})}
// 				</SelectInput>
// 			</GridItem>
// 		}
// 		<GridItem xs={12} lg={3} md={3}>
// 			{draft.type === 1 && (
// 				<SelectInput
// 					floatingText={translate.point_type}
// 					value={"" + draft.votationType}
// 					errorText={errors.votationType}
// 					onChange={event =>
// 						updateState({
// 							votationType: +event.target.value
// 						})
// 					}
// 				>
// 					{CBX.filterAgendaVotingTypes(votingTypes).map(votingType => {
// 						return (
// 							<MenuItem
// 								value={"" + votingType.value}
// 								key={`votingTypeType_${votingType.value}`}
// 							>
// 								{translate[votingType.label]}
// 							</MenuItem>
// 						);
// 					})}
// 				</SelectInput>
// 			)}
// 		</GridItem>
// 		<GridItem xs={11} lg={12} md={12}>
// 			<TextInput
// 				floatingText={translate.description}
// 				type="text"
// 				errorText={errors.description}
// 				value={draft.description}
// 				onChange={event =>
// 					updateState({
// 						description: event.nativeEvent.target.value
// 					})
// 				}
// 			/>
// 		</GridItem>
// 		{(CBX.hasVotation(draft.votationType) && draft.type === 1) && (
// 			<Fragment>
// 				<GridItem xs={6} lg={3} md={3}>
// 					<SelectInput
// 						floatingText={translate.majority_label}
// 						value={"" + draft.majorityType || 1}
// 						errorText={errors.majorityType}
// 						onChange={event =>
// 							updateState({
// 								majorityType: +event.target.value
// 							})
// 						}
// 					>
// 						{majorityTypes.map(majority => {
// 							return (
// 								<MenuItem
// 									value={"" + majority.value}
// 									key={`majorityType_${majority.value}`}
// 								>
// 									{translate[majority.label]}
// 								</MenuItem>
// 							);
// 						})}
// 					</SelectInput>
// 				</GridItem>
// 				<GridItem xs={6} lg={3} md={3}>
// 					{CBX.majorityNeedsInput(draft.majorityType) && (
// 						<MajorityInput
// 							type={draft.majorityType}
// 							value={draft.majority}
// 							divider={draft.majorityDivider}
// 							majorityError={errors.majority}
// 							dividerError={errors.majorityDivider}
// 							onChange={value =>
// 								updateState({
// 									majority: +value
// 								})
// 							}
// 							onChangeDivider={value =>
// 								updateState({
// 									majorityDivider: +value
// 								})
// 							}
// 						/>
// 					)}
// 				</GridItem>
// 			</Fragment>
// 		)}
// 		<GridItem xs={11} lg={12} md={12}>
// 			<RichTextInput
// 				value={draft.text || ""}
// 				errorText={errors.text}
// 				translate={translate}
// 				onChange={value =>
// 					updateState({
// 						text: value
// 					})
// 				}
// 				tags={CBX.getTagVariablesByDraftType(draft.type, translate)}
// 			/>
// 		</GridItem>
// 	</Grid>
// );

// export default CompanyDraftForm;
