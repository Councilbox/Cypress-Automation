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
} from "../../../displayComponents";
import { getPrimary, getSecondary } from "../../../styles/colors";
import { Card, Collapse, IconButton, Icon } from 'material-ui';
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
import { DropdownEtiquetas } from "./LoadDraft.js";



const { NONE, ...governingBodyTypes } = GOVERNING_BODY_TYPES;

const CompanyDraftList = ({ translate, company, client, ...props }) => {
	const [data, setData] = React.useState({});
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
			<div style={{ display: "flex" }}>
				<IconButton
					onClick={() => {
						bHistory.push(`/company/${company.id}/draft/${draftID}`);
					}}
					style={{
						color: primary,
						height: "32px",
						width: "32px",
						outline: 0
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


	let tagsSearch = [];
	let matchSearch = [];
	if (search) {
		vars.companyStatutes.map(statute => (
			tagsSearch.push(createTag(statute, 1, translate))
		));
		Object.keys(governingBodyTypes).map(key => (
			tagsSearch.push(createTag(governingBodyTypes[key], 2, translate))
		));
		vars.draftTypes.map(draft => tagsSearch.push(createTag({
			...draft,
			addTag,
		}, 3, translate)));
		matchSearch = tagsSearch.filter(tag => {
			return tag.label.toLowerCase().includes(search.toLowerCase())
		});
	}

	if(!vars.companyStatutes){
		return <LoadingSection />
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
			<div style={{ height: ' calc( 100% - 10em )' }}>
				<div style={{ marginRight: '0.8em', display: "flex", justifyContent: 'flex-end' }}>
					<div style={{ marginRight: "3em" }}>
						<DropdownEtiquetas
							translate={translate}
							search={search}
							setSearchModal={setSearch}
							matchSearch={matchSearch}
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
						/>
					</div>
					<div>
						<TextInput
							disableUnderline={true}
							styleInInput={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.54)", background: "#f0f3f6", paddingLeft: "5px", padding:"4px 5px" }}
							stylesAdornment={{ background: "#f0f3f6", marginLeft: "0", paddingLeft: "8px" }}
							adornment={<Icon>search</Icon>}
							floatingText={" "}
							type="text"
							value={search}
							placeholder={"Buscar plantillas"}
							onChange={event => {
								setSearch(event.target.value);
							}}
						/>
					</div>
				</div>
				<Scrollbar>
				<div style={{height: '100%', paddingRight: '1em'}}>
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
											<HoverableRow
												key={`draft${draft.id}`}
												translate={translate}
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

const HoverableRow = ({ draft, draftTypes, company, companyStatutes, translate, info, ...props }) => {
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
			const title = statute? statute.title : 'Tipo no encontrado';
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

	const desplegarEtiquetas = event => {
		event.preventDefault()
		event.stopPropagation()
		setExpanded(!expanded)
	}

	const columns = buildTagColumns(draft.tags);


	if (isMobile) {
		return (
			<Card
				style={{ marginBottom: '0.5em', padding: '0.3em', position: 'relative' }}
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
			{...handlers}
			hover
		// onClick={() => {
		// 	bHistory.push(`/company/${company.id}/draft/${draft.id}`);
		// }}
		>
			<TableCell
				style={TableStyles.TD}
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
		})
	)(withWindowSize(CompanyDraftList)))
));
