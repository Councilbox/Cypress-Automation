import React from 'react';
import { Link } from 'react-router-dom';
import { graphql, withApollo } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import {
	Card, Collapse, IconButton, Icon, CardActions, CardContent, CardHeader, withStyles
} from 'material-ui';
import { TableCell, TableRow } from 'material-ui/Table';
import {
	companyDrafts as query,
	deleteDraft as deleteDraftMutation,
	getCompanyDraftDataNoCompany
} from '../../../queries/companyDrafts';
import {
	AlertConfirm,
	BasicButton,
	CloseIcon,
	TextInput,
	Grid,
	Scrollbar,
	GridItem,
	EnhancedTable,
	ErrorWrapper,
	LoadingSection,
	Checkbox,
} from '../../../displayComponents';
import { getPrimary, getSecondary } from '../../../styles/colors';
import withSharedProps from '../../../HOCs/withSharedProps';
import { DRAFTS_LIMITS, GOVERNING_BODY_TYPES } from '../../../constants';
import TableStyles from '../../../styles/table';
import { bHistory } from '../../../containers/App';
import { sendGAevent } from '../../../utils/analytics';
import { useOldState, useHoverRow } from '../../../hooks';
import { getTagColor, createTag } from './draftTags/utils';
import SelectedTag from './draftTags/SelectedTag';
import withWindowSize from '../../../HOCs/withWindowSize';
import { DropdownEtiquetas } from './LoadDraft';
import { buildTagColumns, formatLabelFromName } from '../../../utils/templateTags';
import { isMobile } from '../../../utils/screen';

const { NONE, ...governingBodyTypes } = GOVERNING_BODY_TYPES;

export const useTags = translate => {
	const [testTags, setTestTags] = React.useState({});
	const [tagText, setTagText] = React.useState('');
	const [vars, setVars] = React.useState({});

	const formatTagLabel = tag => (tag.segments ?
		`${tag.segments.reduce((acc, curr) => {
			if (curr !== tag.label) return `${acc + (translate[curr] || curr)}. `;
			return acc;
		}, '')}`
		: tag.label);

	const removeTag = tag => {
		delete testTags[tag.name];
		setTestTags({ ...testTags });
	};

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
	};

	const filterTags = () => {
		const tagsSearch = [];
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
		return tagsSearch.filter(tag => tag.label.toLowerCase().includes(tagText.toLowerCase()));
	};

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
	};
};

const CompanyDraftList = ({
	translate, company, client, setMostrarMenu, searchDraft, classes, ...props
}) => {
	const [data, setData] = React.useState({});
	const [state, setState] = useOldState({
		deleteModal: false,
		draftID: null,
		tags: true,
		newForm: false,
	});
	const [inputSearch, setInputSearch] = React.useState(false);
	const [search, setSearch] = React.useState('');
	const {
		testTags, vars, setVars, removeTag, addTag, filteredTags, setTagText, tagText
	} = useTags(translate);

	const primary = getPrimary();
	const scrollbar = React.useRef();

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
		scrollbar.current.scrollToTop();
	};

	React.useEffect(() => {
		sendGAevent({
			category: 'Borradores',
			action: 'Entrada a la lista',
			label: company.businessName
		});
	}, [sendGAevent]);

	const openDeleteModal = draftID => {
		setState({
			deleteModal: true,
			draftID
		});
	};

	const renderDeleteIcon = index => draftID => (
		<div style={{ display: 'flex', marginLeft: isMobile && '1em' }}>
			<IconButton
				onClick={() => {
					bHistory.push(`/company/${company.id}/draft/${draftID}`);
				}}
				id={`edit-draft-${index}`}
				style={{
					color: primary,
					height: '32px',
					width: '32px',
					outline: 0,
					marginRight: isMobile && '1em'
				}}
			>
				<i className="fa fa-pencil-square-o">
				</i>
			</IconButton>

			<CloseIcon
				id={`delete-draft-${index}`}
				style={{ color: primary }}
				onClick={event => {
					openDeleteModal(draftID);
					event.stopPropagation();
				}}
			/>
		</div>
	);

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
	};

	React.useEffect(() => {
		getDrafts({
			companyId: company.id,
			...(search || searchDraft ? {
				filters: [
					{
						field: 'title',
						text: search || searchDraft
					},
				]
			} : {}),
			tags: Object.keys(testTags).map(key => testTags[key].name),
		});
	}, [testTags, search, searchDraft]);


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

	const {
		companyDrafts, draftTypes, loading, error
	} = data;

	if (state.newForm) {
		setMostrarMenu(false);
		bHistory.push(`/company/${company.id}/draft/new`);
	}

	if (!vars.companyStatutes) {
		return <LoadingSection />;
	}

	return (
		<React.Fragment>
			<div style={{ height: isMobile ? ' calc( 100% - 3.5em )' : ' calc( 100% - 6em )' }}>
				<div style={{
					marginRight: '0.8em', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '0.5em'
				}}>
					<div>
						<BasicButton
							text={translate.drafts_new}
							id="draft-create-button"
							color={primary}
							textStyle={{
								...(isMobile ?
									{
										textTransform: 'none',
										boxShadow: 'none',
										marginRight: '1em',
										borderRadius: '4px',
										border: '1px solid rgb(125, 33, 128)',
										padding: '0.2em 0.4em',
										marginTop: '5px',
										color: 'white',
										fontSize: '0.9em',
										backgroundColor: 'rgb(125, 33, 128)',
										outline: '0px',
										cursor: 'pointer',
										minHeight: '0px',
										fontWeight: 'bold',
									} : {
										color: 'white',
										fontWeight: '700',
										textTransform: 'none',
										fontSize: '0.85em',
										whiteSpace: isMobile && 'nowrap',
										overflow: isMobile && 'hidden',
										textOverflow: isMobile && 'ellipsis',
										padding: isMobile && '8px 8px',
										minHeight: '0',
									}
								)
							}}
							onClick={() => bHistory.push(`/company/${company.id}/draft/new`)}
						/>
					</div>
					<div style={{ marginLeft: '1em' }}>
						<Link
							to={`/company/${company.id}/platform/drafts/`}
						>
							<BasicButton
								text={translate.general_drafts}
								id="drafts-download-organization-drafts"
								color={getSecondary()}
								textStyle={{
									...(isMobile ?
										{
											textTransform: 'none',
											boxShadow: 'none',
											marginRight: !isMobile && '1em',
											borderRadius: '4px',
											border: `1px solid${getSecondary()}`,
											padding: '0.2em 0.4em',
											marginTop: '5px',
											color: 'white',
											backgroundColor: getSecondary(),
											outline: '0px',
											cursor: 'pointer',
											fontSize: '0.9em',
											minHeight: '0px',
											fontWeight: 'bold',
										} : {
											color: 'white',
											fontWeight: '700',
											fontSize: '0.85em',
											textTransform: 'none',
											whiteSpace: isMobile && 'nowrap',
											overflow: isMobile && 'hidden',
											textOverflow: isMobile && 'ellipsis',
											minHeight: '0',
											padding: '8px',
										}
									)
								}}
							/>
						</Link>
					</div>
					{!isMobile
						&& <React.Fragment>
							<div style={{ marginRight: isMobile ? '0.5em' : '3em', marginLeft: '1em' }}>
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
									stylesMenuItem={{ padding: '3px 3px', marginTop: isMobile && '0', width: isMobile && '' }}
								/>
							</div>
							<div>
								<TextInput
									className={isMobile && !inputSearch ? 'openInput' : ''}
									disableUnderline={true}
									styleInInput={{
										fontSize: '12px', color: 'rgba(0, 0, 0, 0.54)', background: '#f0f3f6', padding: isMobile && inputSearch && '4px 5px', paddingLeft: !isMobile && '5px'
									}}
									stylesAdornment={{ background: '#f0f3f6', marginLeft: '0', paddingLeft: isMobile && inputSearch ? '8px' : '4px' }}
									adornment={<Icon onClick={() => setInputSearch(!inputSearch)} >search</Icon>}
									floatingText={' '}
									type="text"
									id="drafts-search-input"
									value={search}
									placeholder={isMobile ? '' : translate.search}
									onChange={event => {
										setSearch(event.target.value);
									}}
									styles={{ marginTop: '-16px' }}
									stylesTextField={{ marginBottom: '0px' }}
								/>
							</div>
						</React.Fragment>
					}
				</div>
				<Scrollbar ref={scrollbar}>
					<div style={{ height: '100%', paddingRight: !isMobile && '1em' }}>
						{error ? (
							<div>
								{error.graphQLErrors.map((err, index) => (
									<ErrorWrapper
										key={`error_${index}`}
										error={err}
										translate={translate}
									/>
								))}
							</div>
						) : (
							!!companyDrafts && (
								<div style={{ padding: '0.5em', overflow: 'hidden' }}>
									<EnhancedTable
										hideTextFilter={true}
										translate={translate}
										defaultLimit={DRAFTS_LIMITS[0]}
										defaultFilter={'title'}
										// limits={DRAFTS_LIMITS}
										page={1}
										loading={loading}
										length={companyDrafts.list.length}
										total={companyDrafts.total}
										selectedCategories={[{
											field: 'type',
											value: 'all',
											label: translate.all_plural
										}]}
										refetch={getDrafts}
										headers={[
											{
												text: translate.name,
												name: 'title',
												canOrder: true
											},
											{
												name: 'type',
												text: translate.labels,
												canOrder: true
											},
											{
												name: '',
												text: ''
											}
										]}
										companyID={company.id}
									>
										{companyDrafts.list.map((draft, index) => (
											<DraftRow
												id={`participant-row-${index}`}
												index={index}
												classes={classes}
												stylesBackground={{ background: index % 2 ? '#edf4fb' : '' }}
												key={`draft${draft.id}${draft.title}`}
												translate={translate}
												action={() => bHistory.push(`/company/${company.id}/draft/${draft.id}`)}
												renderDeleteIcon={renderDeleteIcon(index)}
												draft={draft}
												companyStatutes={vars.companyStatutes}
												draftTypes={draftTypes}
												company={company}
												info={props}
											/>
										))}
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
						requestClose={() => setState({ deleteModal: false })
						}
					/>
				</Scrollbar>
			</div>
		</React.Fragment>
	);
};

export const DraftRow = ({
	draft, draftTypes, company, selectable, companyStatutes, translate, info, index, stylesBackground, classes, ...props
}) => {
	const [show, handlers] = useHoverRow();
	const [expanded, setExpanded] = React.useState(false);
	const [expandedCard, setExpandedCard] = React.useState(false);

	const TagColumn = tagProps => (
		<div style={{
			display: 'flex',
			color: '#ffffff',
			fontSize: '12px',
			marginBottom: '0.5em ',
			flexDirection: 'column'
		}}>
			{tagProps.children}
		</div>
	);

	const desplegarEtiquetas = event => {
		event.preventDefault();
		event.stopPropagation();
		setExpanded(!expanded);
	};

	const columns = buildTagColumns(draft, formatLabelFromName(companyStatutes, translate));


	const getCheckbox = () => {
		const isChecked = props.isChecked(draft.id);
		return (
			<Checkbox
				value={isChecked}
				id={`delete-checkbox-${index}`}
				checked={isChecked}
				onChange={() => props.updateSelectedValues(draft.id)}
			/>
		);
	};

	const clickMobilExpand = () => {
		setExpandedCard(!expandedCard);
		if (expanded) {
			setExpanded(!expanded);
		}
	};

	if (isMobile) {
		return (
			<Grid style={{ height: '100%', width: '100%', overflow: 'hidden' }} >
				{columns
					&& <Card
						id={props.id}
						style={{
							width: '100%', border: 'none', boxShadow: 'none', ...stylesBackground, overflow: 'hidden'
						}}>
						<CardHeader
							classes={{
								content: classes.cardTitle,
							}}
							action={
								<IconButton
									style={{ top: '5px' }}
									onClick={event => clickMobilExpand(event)}
									aria-expanded={expandedCard}
									aria-label="Show more"
									className={'expandButtonModal'}
								>
									<i
										className={'fa fa-angle-down'}
										style={{
											transform: expandedCard ? 'rotate(180deg)' : 'rotate(0deg)',
											transition: 'all 0.3s'
										}}
									/>
								</IconButton>
							}
							style={{
								padding: '10px 16px 10px 16px', width: '100%', overflow: 'hidden', display: 'flex', justifyContent: 'space-between',
							}}
							title={
								<div style={{
									display: 'flex', justifyContent: 'space-between', fontSize: '14px', padding: '0px'
								}} >
									{selectable
										&& <div>
											<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
												{getCheckbox()}
												{props.alreadySaved(draft.id)
													&& <i className="fa fa-floppy-o"
														style={{
															cursor: 'pointer',
															fontSize: '2em',
															color: getSecondary()
														}}
													/>
												}
											</div>
										</div>
									}
									<div onClick={props.action} style={{
										fontWeight: '700',
										whiteSpace: 'nowrap',
										overflow: 'hidden',
										textOverflow: 'ellipsis',

									}}>
										{draft.title}
									</div>
									{!expandedCard
										&& <div style={{ display: 'flex', paddingRight: '5px', marginLeft: '7px' }}>
											{columns
												&& Object.keys(columns).map(key => {
													const columnaLength = columns[key].length;
													return (
														<TagColumn key={`column_${key}`}>
															{columns[key].map((tag, i) => (
																i > 0 ?
																	<Collapse key={`tag_${translate[tag.label] || tag.label}_${key}_${i}_${tag.name}_`} in={expanded} timeout="auto" unmountOnExit>
																		<SelectedTag
																			text={''}
																			color={getTagColor(key)}
																			props={props}
																			sinTitulos={true}
																			list={true}
																			count={''}
																		/>
																	</Collapse>
																	: <SelectedTag
																		key={`tag_${translate[tag.label] || tag.label}_${key}_${i}_${tag.name}`}
																		text={''}
																		color={getTagColor(key)}
																		props={props}
																		sinTitulos={true}
																		list={true}
																		count={columnaLength > 1 ? expanded ? '' : columnaLength : ''}
																	/>
															))}
														</TagColumn>
													);
												})
											}
										</div>
									}
								</div>
							}
						/>
						<Collapse in={expandedCard} timeout="auto" unmountOnExit>
							<CardContent>
								<GridItem xs={12} md={12} lg={12} style={{}}>
									<div style={{}}>
										{columns
											&& Object.keys(columns).map(key => {
												const columnaLength = columns[key].length;
												return (
													<TagColumn key={`column_${key}`}>
														{columns[key].map((tag, i) => (
															i > 0 ?
																<Collapse key={`tag_${translate[tag.label] || tag.label}_${key}_${i}_${tag.name}_`} in={expanded} timeout="auto" unmountOnExit>
																	<SelectedTag
																		text={translate[tag.label] || tag.label}
																		color={getTagColor(key)}
																		props={props}
																		list={true}
																		count={''}
																	/>
																</Collapse>
																: <SelectedTag
																	key={`tag_${translate[tag.label] || tag.label}_${key}_${i}_${tag.name}`}
																	text={translate[tag.label] || tag.label}
																	color={getTagColor(key)}
																	props={props}
																	list={true}
																	count={columnaLength > 1 ? expanded ? '' : columnaLength : ''}
																	stylesEtiqueta={{ cursor: columnaLength > 1 ? 'pointer' : '' }}
																	desplegarEtiquetas={columnaLength > 1 ? desplegarEtiquetas : ''}
																/>
														))}
													</TagColumn>
												);
											})
										}
									</div>
								</GridItem>
								<CardActions>
									{props.renderDeleteIcon
										&& props.renderDeleteIcon(draft.id)
									}
								</CardActions>
							</CardContent>
						</Collapse>
					</Card>
				}
			</Grid>
		);
	}
	return (
		<TableRow
			{...handlers}
			id={props.id}
			hover
		>
			{selectable
				&& <TableCell
					style={TableStyles.TD}
				>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						{getCheckbox()}
						{props.alreadySaved(draft.id)
							&& <i className="fa fa-floppy-o"
								style={{
									cursor: 'pointer',
									fontSize: '2em',
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
				<div style={{ display: 'flex' }}>
					{columns
						&& Object.keys(columns).map(key => {
							const columnaLength = columns[key].length;
							return (
								<TagColumn key={`column_${key}`}>
									{columns[key].map((tag, i) => (
										i > 0 ?
											<Collapse in={expanded} timeout="auto" unmountOnExit key={`tag_${translate[tag.label] || tag.label}_${key}_${i}_${tag.name}_1`}>
												<SelectedTag
													{...props}
													key={`tag_${translate[tag.label] || tag.label}_${key}_${i}_${tag.name}_`}
													text={translate[tag.label] || tag.label}
													color={getTagColor(key)}
													id={`selected-tag-${tag.name}`}
													list={true}
													count={''}
												/>
											</Collapse>
											: <SelectedTag
												{...props}
												key={`tag_${translate[tag.label] || tag.label}_${key}_${i}_${tag.name}`}
												text={translate[tag.label] || tag.label}
												color={getTagColor(key)}
												list={true}
												id={`selected-tag-${tag.name}`}
												count={columnaLength > 1 ? expanded ? '' : columnaLength : ''}
												stylesEtiqueta={{ cursor: columnaLength > 1 ? 'pointer' : '' }}
												desplegarEtiquetas={columnaLength > 1 ? desplegarEtiquetas : ''}
											/>
									))}
								</TagColumn>
							);
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
	);
};

const regularCardStyle = {
	cardTitle: {
		width: '100%',
		overflow: 'hidden'
	},
};

export default withApollo((withSharedProps()(
	compose(
		graphql(deleteDraftMutation, {
			name: 'deleteDraft',
			options: {
				errorPolicy: 'all'
			}
		})
	)(withWindowSize(withStyles(regularCardStyle)(CompanyDraftList)))
)
));
