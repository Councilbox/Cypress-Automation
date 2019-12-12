import React from "react";
import {
	AllSelector,
	BasicButton,
	ButtonIcon,
	CardPageLayout,
	Checkbox,
	Grid,
	LoadingSection,
	GridItem,
	EnhancedTable,
	ErrorWrapper,
	TextInput
} from "../../../displayComponents";
import { Card, Icon } from 'material-ui';
import { isMobile } from 'react-device-detect';
import { compose, graphql, withApollo } from "react-apollo";
import { cloneDrafts, platformDrafts as query } from "../../../queries";
import { TableCell, TableRow } from "material-ui/Table";
import FontAwesome from "react-fontawesome";
import { getPrimary, getSecondary } from "../../../styles/colors";
import withSharedProps from "../../../HOCs/withSharedProps";
import { withRouter } from "react-router-dom";
import PlatformDraftDetails from "./PlatformDraftDetails";
import DraftDetailsModal from './DraftDetailsModal';
import { DRAFTS_LIMITS } from "../../../constants";
import TableStyles from "../../../styles/table";
import { useOldState } from "../../../hooks";
import { useTags, DraftRow } from "../../company/drafts/CompanyDraftList";
import { DropdownEtiquetas } from "../../company/drafts/LoadDraft";
import gql from "graphql-tag";

export const statute_types = [
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



const PlatformDrafts = ({ client, company, translate, ...props }) => {
	const [state, setState] = useOldState({
		selectedIndex: -1,
		selectedValues: [],
		draft: null
	});
	const [data, setData] = React.useState(null);
	const { testTags, vars, setVars, removeTag, addTag, filteredTags, tagText, setTagText, } = useTags(translate);
	const [search, setSearch] = React.useState('');

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
	}

	React.useEffect(() => {
		getData({
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
			companyStatutes: statute_types
		});
	};

	React.useEffect(() => {
		getData();
		getVars();
	}, [company.id]);


	if(!data){
		return <LoadingSection />
	}

	const alreadySaved = id => {
		const { companyDrafts } = data;
		const item = companyDrafts.list.find(draft => draft.draftId === id);
		return !!item;
	}


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
	}

	const showDraftDetails = draft => {
		setState({
			draftModal: draft
		});
	}

	const closeDraftDetails = () => {
		setState({
			draftModal: null
		});
	}

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
		let item = state.selectedValues.find(
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
			}
		}
	}

	const selectAll = () => {
		const { list } = data.platformDrafts;
		const { selectedValues } = state;
		let values = state.selectedValues;

		for (let i = 0; i < list.length; i++) {
			const id = list[i].id;
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
	}

	const deselectAll = () => {
		const { list } = data.platformDrafts;
		let values = state.selectedValues;

		for (let i = 0; i < list.length; i++) {
			const id = list[i].id;
			values = values.filter(value => value !== id);
		}

		setState({
			selectedValues: [...values],
		});
	}

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
	}

	const { loading, error, platformDrafts, draftTypes } = data;
	const { selectedIndex, selectedValues } = state;
	const primary = getPrimary();

	return (
		<CardPageLayout title={translate.general_drafts}>
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
												text={`${translate.download} ${
													selectedValues.length
													} ${translate.drafts} ${
														translate.to
													} '${translate.my_drafts}'`
												}
												color={"white"}
												textStyle={{
													color: primary,
													fontWeight: "700",
													textTransform: "none"
												}}
												textPosition="after"
												icon={
													<ButtonIcon
														type="add"
														color={primary}
													/>
												}
												onClick={cloneDrafts}
												buttonStyle={{
													marginRight: "1em",
													border: `2px solid ${primary}`,
												}}
											/>
										</div>
									)}
								</div>
								<div style={{ marginRight: '0.8em', display: "flex", justifyContent: 'flex-end' }}>
									<div style={{ marginRight: "3em" }}>
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
								<EnhancedTable
									translate={translate}
									page={1}
									hideTextFilter
									loading={loading}
									length={platformDrafts.list.length}
									total={platformDrafts.total}
									refetch={getData}
									headers={[]}
								>
									{platformDrafts.list.map(
										(draft, index) => {
											return (
												<DraftRow
													key={`draft${draft.id}`}
													translate={translate}
													action={() => { showDraftDetails(draft) }}
													draft={draft}
													selectable={true}
													companyStatutes={vars.companyStatutes}
													draftTypes={draftTypes}
													company={company}
													isChecked={isChecked}
													alreadySaved={alreadySaved}
													updateSelectedValues={updateSelectedValues}
												/>
											);
										}
									)}
								</EnhancedTable>
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
		</CardPageLayout>
	);
}

export default withSharedProps()(
	compose(
		graphql(cloneDrafts, {
			name: "cloneDrafts"
		})
	)(withRouter(withApollo(PlatformDrafts)))
);