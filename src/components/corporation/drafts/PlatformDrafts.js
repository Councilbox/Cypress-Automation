import React from 'react';
import { Icon, withStyles } from 'material-ui';
import { graphql, withApollo } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';
import {
	AllSelector,
	BasicButton,
	ButtonIcon,
	CardPageLayout,
	LoadingSection,
	EnhancedTable,
	ErrorWrapper,
	TextInput,
	Scrollbar
} from '../../../displayComponents';
import { cloneDrafts as cloneDraftsMutation, platformDrafts as query } from '../../../queries';
import { getPrimary } from '../../../styles/colors';
import withSharedProps from '../../../HOCs/withSharedProps';
import PlatformDraftDetails from './PlatformDraftDetails';
import DraftDetailsModal from './DraftDetailsModal';
import { DRAFTS_LIMITS } from '../../../constants';
import { useOldState } from '../../../hooks';
import { useTags, DraftRow } from '../../company/drafts/CompanyDraftList';
import { DropdownEtiquetas } from '../../company/drafts/LoadDraft';

import { isMobile } from '../../../utils/screen';
import { bHistory } from '../../../containers/App';

const statuteTypes = [
	{
		prototype: 1,
		title: 'ordinary_general_assembly',
	}, {
		prototype: 2,
		title: 'special_general_assembly'
	}, {
		prototype: 3,
		title: 'board_of_directors',
	},
	{
		prototype: 10,
		title: 'ordinary_general_assembly_association',
	}, {
		prototype: 11,
		title: 'special_general_assembly_association',
	}, {
		prototype: 12,
		title: 'council_of_directors_association',
	}, {
		prototype: 13,
		title: 'executive_committee',
	}];


const PlatformDrafts = ({
	client, company, translate, classes, ...props
}) => {
	const [state, setState] = useOldState({
		selectedIndex: -1,
		selectedValues: [],
		draft: null
	});
	const [data, setData] = React.useState(null);
	const {
		testTags, vars, setVars, removeTag, addTag, filteredTags, tagText, setTagText,
	} = useTags(translate);
	const [search, setSearch] = React.useState('');
	const [inputSearch, setInputSearch] = React.useState(false);
	const scrollbar = React.useRef();

	const getData = async variables => {
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
		if (scrollbar.current) {
			scrollbar.current.scrollToTop();
		}
	};

	React.useEffect(() => {
		getData({
			companyId: company.id,
			...(search ? {
				filters: [
					{
						field: 'title',
						text: search
					},
				]
			} : {}),
			tags: Object.keys(testTags).map(key => testTags[key].name),
		});
	}, [testTags, search]);

	const getVars = async () => {
		const response = await client.query({
			query: gql`
				query getVars {
					majorityTypes {
						label
						value
					}
					companyTypes {
						label
						value
					}
					draftTypes {
						label
						value
					}
					votingTypes {
						label
						value
					}
				}
			`,
		});

		setVars({
			...response.data,
			companyStatutes: statuteTypes
		});
	};

	React.useEffect(() => {
		getData();
		getVars();
	}, [company.id]);


	if (!data) {
		return <LoadingSection />;
	}

	const alreadySaved = id => {
		const { companyDrafts } = data;
		const item = companyDrafts.list.find(draft => draft.draftId === id);
		return !!item;
	};


	const anySelected = () => {
		const { platformDrafts } = data;
		const { selectedValues } = state;
		for (let i = 0; i < selectedValues.length; i++) {
			const selectedValue = selectedValues[i];
			const item = platformDrafts.list.find(
				draft => draft.id === selectedValue
			);
			if (item) {
				return true;
			}
		}
		return false;
	};

	const showDraftDetails = draft => {
		setState({
			draftModal: draft
		});
	};

	const closeDraftDetails = () => {
		setState({
			draftModal: null
		});
	};

	const allSelected = () => {
		const { platformDrafts } = data;
		const { selectedValues } = state;

		for (let i = 0; i < platformDrafts.list.length; i++) {
			const draft = platformDrafts.list[i];
			const item = selectedValues.find(
				selectedValue => draft.id === selectedValue
			);
			if (!item) {
				return false;
			}
		}
		return true;
	};

	const isChecked = id => {
		const item = state.selectedValues.find(
			selectedValue => selectedValue === id
		);
		return !!item;
	};

	const cloneDrafts = async () => {
		const { selectedValues } = state;

		if (selectedValues.length > 0) {
			const response = await props.cloneDrafts({
				variables: {
					ids: selectedValues,
					companyId: company.id
				}
			});
			if (response) {
				setState({
					selectedValues: []
				});
				getData();
				bHistory.back();
			}
		}
	};

	const selectAll = () => {
		const { list } = data.platformDrafts;
		const { selectedValues } = state;
		const values = state.selectedValues;

		for (let i = 0; i < list.length; i++) {
			const { id } = list[i];
			const item = selectedValues.find(
				selectedValue => id === selectedValue
			);
			if (!item) {
				values.push(id);
			}
		}

		setState({
			selectedValues: [...values],
		});
	};

	const deselectAll = () => {
		const { list } = data.platformDrafts;
		let values = state.selectedValues;

		for (let i = 0; i < list.length; i++) {
			const { id } = list[i];
			values = values.filter(value => value !== id);
		}

		setState({
			selectedValues: [...values],
		});
	};

	const updateSelectedValues = id => {
		let { selectedValues } = state;
		const item = selectedValues.find(selectedValue => id === selectedValue);
		if (!item) {
			selectedValues.push(id);
		} else {
			selectedValues = selectedValues.filter(value => value !== id);
		}

		setState({
			selectedValues: [...selectedValues]
		});
	};

	const {
		loading, error, platformDrafts, draftTypes
	} = data;
	const { selectedIndex, selectedValues } = state;
	const primary = getPrimary();

	return (
		<CardPageLayout title={translate.general_drafts} disableScroll>
			<div style={{ padding: '0.5em 2vw', height: '100%' }}>
				{selectedIndex >= 0 ? (
					<PlatformDraftDetails
						close={() => setState({ selectedIndex: -1 })}
						draft={platformDrafts.list[selectedIndex]}
						translate={translate}
					/>
				) : (
					<React.Fragment>
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
							!!platformDrafts && (
								<React.Fragment>
									<div style={{ display: 'flex' }}>
										<AllSelector
											selectAll={selectAll}
											deselectAll={deselectAll}
											anySelected={anySelected()}
											allSelected={allSelected()}
											translate={translate}
										/>
										{selectedValues.length > 0 && (
											<div>
												<BasicButton
													text={`${translate.download} ${selectedValues.length
														} ${translate.drafts} ${translate.to
														} '${translate.my_drafts}'`
													}
													color={'white'}
													textStyle={{
														color: primary,
														fontWeight: '700',
														textTransform: 'none'
													}}
													id="download-platform-drafts-button"
													textPosition="after"
													icon={
														<ButtonIcon
															type="add"
															color={primary}
														/>
													}
													onClick={cloneDrafts}
													buttonStyle={{
														marginRight: '1em',
														border: `2px solid ${primary}`,
													}}
												/>
											</div>
										)}
									</div>
									{isMobile ?
										<div style={{
											marginRight: '0.8em', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '.3em', marginBottom: '0.3em'
										}}>
											<div style={{ marginRight: isMobile ? '0.5em' : '3em' }}>
												<DropdownEtiquetas
													translate={translate}
													search={tagText}
													setSearchModal={setTagText}
													matchSearch={filteredTags}
													company={props.company}
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
													soloIcono={true}
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
													value={search}
													styles={{ marginTop: '-16px' }}
													stylesTextField={{ marginBottom: '0px' }}
													placeholder={isMobile ? '' : translate.search}
													onChange={event => {
														setSearch(event.target.value);
													}}
												/>
											</div>
										</div>
										: <div style={{ marginRight: '0.8em', display: 'flex', justifyContent: 'flex-end' }}>
											<div style={{ marginRight: '3em' }}>
												<DropdownEtiquetas
													translate={translate}
													search={tagText}
													setSearchModal={setTagText}
													matchSearch={filteredTags}
													corporation={true}
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
												/>
											</div>
											<div>
												<TextInput
													disableUnderline={true}
													styleInInput={{
														fontSize: '12px', color: 'rgba(0, 0, 0, 0.54)', background: '#f0f3f6', paddingLeft: '5px', padding: '4px 5px'
													}}
													stylesAdornment={{ background: '#f0f3f6', marginLeft: '0', paddingLeft: '8px' }}
													adornment={<Icon>search</Icon>}
													floatingText={' '}
													type="text"
													value={search}
													placeholder={translate.search_templates}
													onChange={event => {
														setSearch(event.target.value);
													}}
												/>
											</div>
										</div>
									}
									<div style={{ height: 'calc(100% - 6em)', padding: '.5em 0' }}>
										<Scrollbar ref={scrollbar}>
											<div style={{
												height: '100%',
												padding: '.5rem',
											}}>
												<EnhancedTable
													translate={translate}
													page={1}
													hideTextFilter
													loading={loading}
													length={platformDrafts.list.length}
													total={platformDrafts.total}
													refetch={getData}
													headers={[]}
													defaultLimit={25}
												>
													{platformDrafts.list.map(
														(draft, index) => (
															<DraftRow
																index={index}
																classes={classes}
																key={`draft${draft.id}${draft.title}`}
																translate={translate}
																action={() => { showDraftDetails(draft); }}
																draft={draft}
																selectable={true}
																companyStatutes={vars.companyStatutes}
																draftTypes={draftTypes}
																company={company}
																isChecked={isChecked}
																alreadySaved={alreadySaved}
																updateSelectedValues={updateSelectedValues}
																stylesBackground={{ background: index % 2 ? '#edf4fb' : '' }}
																info={props}
															/>
														)
													)}
												</EnhancedTable>

											</div>
										</Scrollbar>
									</div>

								</React.Fragment>
							)
						)}
					</React.Fragment>
				)}
				<DraftDetailsModal
					draft={state.draftModal}
					requestClose={closeDraftDetails}
					translate={translate}
					draftTypes={draftTypes}
					companyStatutes={vars.companyStatutes}
					companyTypes={vars.companyTypes}
					votingTypes={vars.votingTypes}
					majorityTypes={vars.majorityTypes}
				/>
			</div>
		</CardPageLayout >
	);
};
const regularCardStyle = {
	cardTitle: {
		width: '100%',
		overflow: 'hidden'
	},
};

export default withSharedProps()(
	compose(
		graphql(cloneDraftsMutation, {
			name: 'cloneDrafts'
		})
	)(withRouter(withApollo(withStyles(regularCardStyle)(PlatformDrafts))))
);
