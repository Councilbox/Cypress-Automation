import React from "react";
import { BasicButton, AlertConfirm, GridItem, DropDownMenu, TextInput, Scrollbar } from "../../../displayComponents";
import { getSecondary, primary } from "../../../styles/colors";
import LoadDraft from "./LoadDraft";
import { MenuItem, TextField, Input, Icon, Collapse, Card, CardHeader, IconButton, Divider, Tooltip } from "material-ui";
import { GOVERNING_BODY_TYPES, DRAFTS_LIMITS } from "../../../constants";
import RichTextInput from "../../../displayComponents/RichTextInput";
import withWindowSize from "../../../HOCs/withWindowSize";
import { withStyles } from "material-ui";
import PropTypes from "prop-types";
import { withApollo } from 'react-apollo';
import { isMobile } from "react-device-detect";
import gql from 'graphql-tag';
import { companyDrafts, getCompanyDraftData } from "../../../queries/companyDrafts";
import { withRouter } from "react-router-dom";
import * as CBX from "../../../utils/CBX";



const levelColor = ['#b47fb6', '#7fa5b6', '#7f94b6'];


const LoadDraftModal = ({ translate, companyId, councilType, draftType, statutes, statute, client, ...props }) => {
	const [loadDraft, setLoadDraft] = React.useState(false);
	const [loadData, setLoadData] = React.useState(true);
	const [vars, setVars] = React.useState({});
	const [search, setSearch] = React.useState('');
	const [searchModal, setSearchModal] = React.useState('');
	const [searchModalPlantillas, setSearchModalPlantillas] = React.useState('');
	const [testTags, setTestTags] = React.useState({});
	const [draftLoading, setdraftLoading] = React.useState(true);
	const [draftsRender, setDraftsRender] = React.useState({});


	const getData = React.useCallback(async () => {
		
		const response = await client.query({
			query: companyDrafts,
			variables: {
				// id: props.match.params.id,
				companyId: props.match.params.company
			}
		});
		console.log(response.data)
		setVars(response.data);
		// setData(response.data.companyDraft);
		// setFetching(false);
		setLoadData(false)
	}, [props.match.params.id]);

	React.useEffect(() => {
		getData();
	}, [getData]);


	const close = () => {
		setLoadDraft(false);
	};

	const _renderModalBody = () => {
		return (
			<div style={{ width: '800px' }}>
				<LoadDraft
					companyId={companyId}
					councilType={councilType}
					draftType={draftType}
					translate={translate}
					statutes={statutes}
					statute={statute}
					loadDraft={(value) => {
						loadDraft(value);
						setLoadDraft(false)
					}}
				/>
			</div>
		)
	}

	const secondary = getSecondary();

	const formatTagLabel = tag => {
		return tag.segments ?
			`${tag.segments.reduce((acc, curr) => {
				if (curr !== tag.label) return acc + (translate[curr] || curr) + '. '
				return acc;
			}, '')}${tag.type === 99 ? tag.label : translate[tag.label] || tag.label}`
			:
			tag.type !== 99 ? translate[tag.label] || tag.label : tag.label
	}

	const plantillasFiltradas = async () => {
		console.log(Object.keys(testTags))
		const response = await client.query({
			query: companyDrafts,
			variables: {
				companyId: props.match.params.company,
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
				companyId: props.match.params.company,
				tags: Object.keys(testTags),
			}
		});
		setDraftsRender(response.data.draftTagSearch.list)
		setdraftLoading(false)
	};

	React.useEffect(() => {
		getTags();
	}, [testTags]);


	if(loadData){

	}else{


	let tagsSearch = []
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

		const columns = buildTagColumns(testTags);

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
}
	// return (
	// 	<div>
			
	// 	</div>
	// );

	return (
		<React.Fragment>
			<BasicButton
				text={translate.load_draft}
				color={secondary}
				textStyle={{
					color: "white",
					fontWeight: "600",
					fontSize: "0.8em",
					textTransform: "none",
					marginLeft: "0.4em",
					minHeight: 0,
					lineHeight: "1em"
				}}
				textPosition="after"
				onClick={() => setLoadDraft(true)}
			/>
			<AlertConfirm
				requestClose={close}
				open={loadDraft}
				buttonCancel={translate.close}
				bodyText={"ASDASDASDASDASDAS"}
				title={translate.load_draft}
			/>
		</React.Fragment>
	);

}


const ContenedorEtiquetas = ({ stylesContent, color, last, title, tags, addTag, translate, search }) => {
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
									text={tag.translation ? tag.translation : tag.label}
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

const getTagColor = type => {
	const colors = {
		0: 'rgba(125, 33, 128, 0.58)',
		1: 'rgba(33, 98, 128, 0.58)',
		2: 'rgba(33, 70, 128, 0.58)',
		99: 'rgba(128, 78, 33, 0.58)'
	}

	return colors[type] ? colors[type] : colors[99];
}

export default withApollo(withRouter(LoadDraftModal));
