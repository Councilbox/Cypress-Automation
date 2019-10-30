import React from "react";
import {
	Grid,
	GridItem,
	TextInput,
	Scrollbar
} from "../../../displayComponents";
import RichTextInput from "../../../displayComponents/RichTextInput";
import { Input, Icon, Collapse } from "material-ui";
import * as CBX from "../../../utils/CBX";
import { GOVERNING_BODY_TYPES, DRAFT_TYPES } from "../../../constants";
import { withStyles } from "material-ui";
import PropTypes from "prop-types";
import withWindowSize from "../../../HOCs/withWindowSize";
import { withApollo } from 'react-apollo';
import { isMobile } from "react-device-detect";
import { companyTypes } from "../../../queries";
import SelectedTag from './draftTags/SelectedTag';
import { createTag, TAG_TYPES, getTagColor } from './draftTags/utils';
import Tag from './draftTags/Tag';
import withSharedProps from "../../../HOCs/withSharedProps";
import { FormControlLabel } from "material-ui";

const { NONE, ...governingBodyTypes } = GOVERNING_BODY_TYPES;


export const levelColor = ['#866666', '#b47fb6', '#7fa5b6', '#7f94b6'];
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

const CompanyDraftForm = ({ translate, draft, errors, company, updateState, companyStatutes, draftTypes, rootStatutes, languages, votingTypes, majorityTypes, match, client, ...props }) => {
	const [search, setSearch] = React.useState('');
	const [newTag, setNewTag] = React.useState('');
	const [testTags, setTestTags] = React.useState({});
	const [tagsSend, setTagsSend] = React.useState([]);
	const [companyT, setCompanyT] = React.useState([]);
	const [openSelectorEtiquetas, setOpenSelectorEtiquetas] = React.useState(true);

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
		if (tag.type === 1) {
			const title = companyStatutes.find(statute => statute.id === +tag.name.split('_')[tag.name.split('_').length - 1]).title;
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

	const getCompanyTypes = async () => {
		const response = await client.query({
			query: companyTypes
		});
		setCompanyT(response.data.companyTypes)
	}

	React.useEffect(() => {
		getCompanyTypes()
	}, []);

	React.useEffect(() => {
		let formattedTags = {};
		if (draft.tags) {
			Object.keys(draft.tags).forEach(key => {
				formattedTags[reduceTagName(draft.tags[key])] = {
					...draft.tags[key],
					label: formatLabelFromName(draft.tags[key])
				}
			})

			setTestTags({ ...formattedTags });
		}
	}, []);

	const renderTitle = () => {
		return (
			<React.Fragment>
				<div style={{ fontSize: "18px" }}>{translate.title}</div>
				<div>
					<Input
						placeholder={translate.title}
						error={!!errors.title}
						disableUnderline={true}
						id={"titleDraft"}
						style={{
							color: "rgba(0, 0, 0, 0.65)",
							fontSize: '15px',
							boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)',
							border: !!errors.title? '2px solid red' : '1px solid #d7d7d7',
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
					{!!errors.title &&
						<span style={{color: 'red'}}>{errors.title}</span>
					}
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
				{Object.keys(columns).map((key, index) => (
					<TagColumn key={`column_${index}`}>
						{columns[key].map(tag => (
							<SelectedTag
								key={`tag_${tag.label}`}
								text={translate[tag.label] || tag.label}
								color={getTagColor(key)}
								action={() => removeTag(tag.name)}
								props={props}
							/>
						))}
					</TagColumn>
				))}
			</div>
		);
	}

	const renderRichEditor = () => {
		const types = Object.keys(testTags).filter(key => testTags[key].type === TAG_TYPES.DRAFT_TYPE).map(key => {
			const result = draftTypes.find(type => testTags[key].name === type.label);
			return result;
		});

		const tags = types.reduce((acc, curr) => {
			const draftTags = CBX.getTagVariablesByDraftType(curr.value, translate);

			draftTags.forEach(tag => {
				if(!acc.has(tag.value)){
					acc.set(tag.value, tag);
				}
			})
			return acc;
		}, new Map());

		return (
			<React.Fragment>
				<div>
					<div style={{ fontSize: "18px", marginBottom: "1em" }}>{translate.content}</div>
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
						tags={Array.from(tags.values())}
					/>
				</div>
			</React.Fragment>
		);
	}

	let tagsSearch = [];

	if (company.id === company.corporationId) {
		companyT.filter(companyType => {
			return !testTags[companyType.label]
		}).forEach(companyType => tagsSearch.push(createTag(companyType, TAG_TYPES.COMPANY_TYPE, translate)))
	}

	companyStatutes.filter(statute => !testTags[`statute_${statute.id}`]).forEach(statute => (
		tagsSearch.push(createTag(statute, TAG_TYPES.STATUTE, translate))
	));
	Object.keys(governingBodyTypes).filter(key => !testTags[governingBodyTypes[key].label]).forEach(key => (
		tagsSearch.push(createTag(governingBodyTypes[key], TAG_TYPES.GOVERNING_BODY, translate))
	));

	draftTypes.filter(type => !testTags[type.label]).forEach(draft => tagsSearch.push(createTag({
		...draft,
		votingTypes,
		majorityTypes,
		addTag,
	}, TAG_TYPES.DRAFT_TYPE, translate)));

	let matchSearch = [];
	if (search) {
		matchSearch = tagsSearch.filter(tag => {
			return tag.label.toLowerCase().includes(search.toLowerCase())
		})
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
				</div>
				<div style={{ minHeight: props.innerWidth > 960 ? "300px" : "", height: "calc( 100% - 4em )" }}>
					<div style={{ boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)', border: 'solid 1px #d7d7d7', marginTop: "1em", height: "100%" }}>
						<div style={{ paddingLeft: "1em", paddingRight: "1em" }}>
							<div style={{ marginBottom: "1em", display: "flex" }}>
								<TextInput
									id={"buscadorEtiqueta"}
									placeholder={"Busca una etiqueta" /*TRADUCCION*/}
									adornment={<Icon>search</Icon>}
									type="text"
									value={search}
									styleInInput={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.65)" }}
									classes={{ input: props.classes.input }}
									onChange={event => {
										setSearch(event.target.value);
										// setOpenSelectorEtiquetas(true)
									}}
								/>
								{/* <div style={{ color: "#a09aa0", display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => setOpenSelectorEtiquetas(!openSelectorEtiquetas)}>
									{openSelectorEtiquetas ?
										<i className="material-icons" style={{ fontSize: "40px" }}>
											arrow_drop_up
											</i>
										:
										<i className="material-icons" style={{ fontSize: "40px" }}>
											arrow_drop_down
										</i>
									}
								</div> */}

							</div>
							<Collapse in={openSelectorEtiquetas} timeout="auto" unmountOnExit >
								<div style={{ display: matchSearch.length > 0 ? "block" : "none" }}>
									{matchSearch &&
										!!companyStatutes &&
										<ContenedorEtiquetas
											search={true}
											color={'rgba(128, 78, 33, 0.58)'}
											addTag={addTag}
											translate={translate}
											title={translate.council_type}
											tags={matchSearch}
										/>
									}
								</div>
								<div style={{}}>
									{company.id === company.corporationId &&
										<ContenedorEtiquetas
											color={getTagColor(TAG_TYPES.COMPANY_TYPE)}
											translate={translate}
											addTag={addTag}
											title={translate.company_type}
											stylesContent={{
												border: `1px solid ${getTagColor(TAG_TYPES.COMPANY_TYPE)}`,
												color: getTagColor(TAG_TYPES.COMPANY_TYPE),
											}}
											tags={companyT.filter(companyType => {
												return !testTags[companyType.label]
											}).map(companyType => createTag(companyType, TAG_TYPES.COMPANY_TYPE, translate))}
										/>
									}

									{!!companyStatutes &&
										<ContenedorEtiquetas
											color={'#b47fb6'}
											translate={translate}
											addTag={addTag}
											title={translate.council_type}
											stylesContent={{
												border: `1px solid ${getTagColor(TAG_TYPES.STATUTE)}`,
												color: getTagColor(TAG_TYPES.STATUTE),
											}}
											tags={companyStatutes.filter(statute => {
												return !testTags[`statute_${statute.id}`]
											}).map(statute => createTag(statute, TAG_TYPES.STATUTE, translate))}
										/>
									}
									<ContenedorEtiquetas
										color={'#7fa5b6'}
										translate={translate}
										addTag={addTag}
										title={translate.governing_body}
										stylesContent={{
											border: `1px solid ${getTagColor(TAG_TYPES.GOVERNING_BODY)}`,
											color: getTagColor(TAG_TYPES.GOVERNING_BODY),
										}}
										tags={Object.keys(governingBodyTypes).filter(key => !testTags[governingBodyTypes[key].label])
											.map(key => createTag(governingBodyTypes[key], TAG_TYPES.GOVERNING_BODY, translate))}
									/>

									{!!draftTypes &&
										<ContenedorEtiquetas
											color={'#7fa5b6'}
											addTag={addTag}
											translate={translate}
											title={translate.draft_type}
											stylesContent={{
												border: `1px solid ${getTagColor(TAG_TYPES.DRAFT_TYPE)}`,
												color: getTagColor(TAG_TYPES.DRAFT_TYPE),
											}}
											tags={draftTypes.filter(type => !testTags[type.label]).map(draft => createTag({
												...draft,
												votingTypes,
												majorityTypes,
												addTag,
											}, TAG_TYPES.DRAFT_TYPE, translate))}
										/>
									}
								</div>
								<div style={{ marginBottom: "1em" }}>
									{/* Crear etiqueta nueva */}
									{/* <TextInput
										id={"crearEtiquetasNuevas"}
										type="text"
										placeholder='Crear etiqueta nueva'//TRADUCCION
										value={newTag}
										onKeyUp={handleEnter}
										styleInInput={{ minHeight: '2.5em', paddingLeft: "0.4em", paddingRight: "0.4em", fontSize: "12px", color: "rgba(0, 0, 0, 0.36)", background: "#f2f4f7" }}
										onChange={event => {
											setNewTag(event.target.value);
										}}
									/> */}
								</div>
							</Collapse>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}

	if (props.innerWidth > 960) {
		return (
			<Scrollbar>
				<Grid spacing={16} style={{ height: "100%", width: "100%", marginBottom: "1em" }}>
					<GridItem xs={12} lg={8} md={8} style={{}}>
						<Grid spacing={16} style={{}}>
							<GridItem xs={12} lg={12} md={12} style={{ height: "120px " }} >
								{renderTitle()}
							</GridItem>
							{Object.keys(testTags).length > 0 &&
								<GridItem xs={12} lg={12} md={12} style={{}}>
									{renderEtiquetasSeleccionadas()}
								</GridItem>
							}
							{/* <GridItem xs={12} lg={12} md={12}>
								{renderDescription()}
							</GridItem> */}
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
			</Scrollbar>
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
							{Object.keys(testTags).length > 0 &&
								<GridItem xs={12} lg={8} md={8} style={{ marginTop: " 1em" }}>
									{renderSelectorEtiquetas()}
								</GridItem>
							}
							<GridItem xs={12} lg={8} md={8} style={{ marginTop: " 1em" }}>
								{renderEtiquetasSeleccionadas()}
							</GridItem>
							{/* <GridItem xs={12} lg={8} md={8}>
								{renderDescription()}
							</GridItem> */}
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


export const EtiquetasModal = ({ color, title, tags, addTag, translate }) => {
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

	const toggle = () => {
		setOpen(!open)
	}

	if (search) {
		console.log(tags);
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
								<Tag
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
								<Tag
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


CompanyDraftForm.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withApollo(withStyles(styles)(withWindowSize(withSharedProps()(CompanyDraftForm))));