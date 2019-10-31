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
	ErrorWrapper
} from "../../../displayComponents";
import { Card } from 'material-ui';
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


const PlatformDrafts = ({ client, company, translate, ...props }) => {
	const [state, setState] = useOldState({
		selectedIndex: -1,
		selectedValues: [],
		draft: null
	});
	const [data, setData] = React.useState(null);

	const getData = async () => {
		const response = await client.query({
			query,
			variables: {
				companyId: company.id,
				options: {
					limit: DRAFTS_LIMITS[0],
					offset: 0
				},
				filters: [
					{
						field: 'companyType',
						text: company.type
					}
				]
			}
		});

		setData(response.data);
	}

	React.useEffect(() => {
		getData();
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

	const updateState = object =>  {
		setState({
			...object
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

	console.log(data.platformDrafts);


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
								<EnhancedTable
									translate={translate}
									page={1}
									hideTextFilter
									loading={loading}
									length={platformDrafts.list.length}
									total={platformDrafts.total}
									refetch={getData}
									headers={[
										{ name: "" },
										{ name: "" },
										{
											name: "title",
											text: translate.name,
											canOrder: true
										},
										{
											name: "type",
											text: translate.type,
											canOrder: true
										}
									]}
								>
									{platformDrafts.list.map(
										(draft, index) => {
											return (
												<HoverableRow
													draft={draft}
													key={`draft_${draft.id}`}
													translate={translate}
													index={index}
													showDraftDetails={showDraftDetails}
													isChecked={isChecked}
													alreadySaved={alreadySaved}
													updateState={updateState}
													updateSelectedValues={updateSelectedValues}
													draftTypes={draftTypes}
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
				companyTypes={data.companyTypes}
				votingTypes={data.votingTypes}
				majorityTypes={data.majorityTypes}
			/>
		</CardPageLayout>
	);

}



class HoverableRow extends React.Component {

	state = {
		showCheck: false
	}

	mouseEnterHandler = () => {
		this.setState({
			showCheck: true
		});
	}

	mouseLeaveHandler = () => {
		this.setState({
			showCheck: false
		});
	}



	render() {
		const { draft, translate, draftTypes } = this.props;
		let isChecked = this.props.isChecked(
			draft.id
		);

		if(isMobile){
            return(
                <Card
                    style={{marginBottom: '0.5em', padding: '0.3em', position: 'relative'}}
					onClick={() => this.props.updateSelectedValues(draft.id)}
                >
                    <Grid>
                        <GridItem xs={4} md={4} style={{fontWeight: '700'}}>
                            {translate.name}
                        </GridItem>
                        <GridItem xs={7} md={7}>
							{draft.title}
                        </GridItem>

						<GridItem xs={4} md={4} style={{fontWeight: '700'}}>
                            {translate.type}
                        </GridItem>
                        <GridItem xs={7} md={7}>
							{translate[draftTypes[draft.type].label]}
                        </GridItem>
                    </Grid>
                    <div style={{position: 'absolute', top: '5px', right: '5px'}}>
						{isChecked &&
							<Checkbox
								value={isChecked}
								checked={isChecked}
								onChange={() =>
									this.props.updateSelectedValues(
										draft.id
									)
								}
							/>
						}
                    </div>
                </Card>
            )
        }

		return (
			<TableRow
				key={`draft${draft.id}`}
				hover={true}
				onMouseOver={this.mouseEnterHandler}
				onMouseLeave={this.mouseLeaveHandler}
			>
				<TableCell
					style={TableStyles.TD}
				>
					{(isChecked || this.state.showCheck)?
						<Checkbox
							value={isChecked}
							checked={isChecked}
							onChange={() =>
								this.props.updateSelectedValues(
									draft.id
								)
							}
						/>
					:
						<div style={{width: '3em'}} />
					}
				</TableCell>
				<TableCell
					style={
						TableStyles.TD
					}
				>
					{this.props.alreadySaved(
						draft.id
					) && (
						<FontAwesome
							name={
								"save"
							}
							style={{
								cursor:
									"pointer",
								fontSize:
									"2em",
								color: getSecondary()
							}}
						/>
					)}
				</TableCell>
				<TableCell
					style={{...TableStyles.TD, cursor: 'pointer'}}
					onClick={() =>
						this.props.showDraftDetails(draft)
					}
				>
					{draft.title}
				</TableCell>
				<TableCell>
					{
						translate[
							draftTypes[
								draft
									.type
							].label
						]
					}
				</TableCell>
			</TableRow>
		)
	}
}

export default withSharedProps()(
	compose(
		graphql(cloneDrafts, {
			name: "cloneDrafts"
		})
	)(withRouter(withApollo(PlatformDrafts)))
);
