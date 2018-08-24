import React from "react";
import {
	AllSelector,
	BasicButton,
	ButtonIcon,
	CardPageLayout,
	Checkbox,
	EnhancedTable,
	ErrorWrapper
} from "../../../displayComponents";
import { compose, graphql, withApollo } from "react-apollo";
import { cloneDrafts, platformDrafts } from "../../../queries";
import { TableCell, TableRow } from "material-ui/Table";
import FontAwesome from "react-fontawesome";
import { getPrimary, getSecondary } from "../../../styles/colors";
import withSharedProps from "../../../HOCs/withSharedProps";
import { withRouter } from "react-router-dom";
import PlatformDraftDetails from "./PlatformDraftDetails";
import { DRAFTS_LIMITS } from "../../../constants";
import TableStyles from "../../../styles/table";

class PlatformDrafts extends React.Component {

	state = {
		selectedIndex: -1,
		selectedValues: []
	};

	componentDidMount() {
		this.props.data.refetch();
	}

	alreadySaved = id => {
		const { companyDrafts } = this.props.data;
		const item = companyDrafts.list.find(draft => draft.draftId === id);
		return !!item;
	};

	anySelected = () => {
		const { platformDrafts } = this.props.data;
		const { selectedValues } = this.state;
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

	allSelected = () => {
		const { platformDrafts } = this.props.data;
		const { selectedValues } = this.state;

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

	isChecked = id => {
		let item = this.state.selectedValues.find(
			selectedValue => selectedValue === id
		);
		return !!item;
	};

	cloneDrafts = async () => {
		const { selectedValues } = this.state;

		if (selectedValues.length > 0) {
			const response = await this.props.cloneDrafts({
				variables: {
					ids: selectedValues,
					companyId: this.props.company.id
				}
			});
			if (response) {
				this.setState({
					selectedValues: []
				});
				this.props.data.refetch();
			}
		}
	};

	selectAll = () => {
		const { list } = this.props.data.platformDrafts;
		const { selectedValues } = this.state;
		let values = this.state.selectedValues;

		for (let i = 0; i < list.length; i++) {
			const id = list[i].id;
			const item = selectedValues.find(
				selectedValue => id === selectedValue
			);
			if (!item) {
				values.push(id);
			}
		}

		this.setState({
			selectedValues: [...values],
			data: { ...this.state.data }
		});
	};

	deselectAll = () => {
		const { list } = this.props.data.platformDrafts;
		let values = this.state.selectedValues;

		for (let i = 0; i < list.length; i++) {
			const id = list[i].id;
			values = values.filter(value => value !== id);
		}

		this.setState({
			selectedValues: [...values],
			data: { ...this.state.data }
		});
	};

	updateState = object =>  {
		this.setState({
			...object
		});
	}

	updateSelectedValues = id => {
		let { selectedValues } = this.state;
		const item = selectedValues.find(selectedValue => id === selectedValue);
		if (!item) {
			selectedValues.push(id);
		} else {
			selectedValues = selectedValues.filter(value => value !== id);
		}

		this.setState({
			selectedValues: [...selectedValues]
		});
	};

	render() {
		const { translate } = this.props;
		const { loading, error, platformDrafts, draftTypes } = this.props.data;
		const { selectedIndex, selectedValues } = this.state;
		const primary = getPrimary();

		return (
			<CardPageLayout title={translate.general_drafts}>
				{selectedIndex >= 0 ? (
					<PlatformDraftDetails
						close={() => this.setState({ selectedIndex: -1 })}
						draft={platformDrafts.list[selectedIndex]}
						translate={translate}
					/>
				) : (
					<React.Fragment>
						{error ? (
							<div>
								{error.graphQLErrors.map(error => {
									return (
										<ErrorWrapper
											error={error}
											translate={translate}
										/>
									);
								})}
							</div>
						) : (
							!!platformDrafts && (
								<React.Fragment>
									<div style={{ display: "inline-block" }}>
										<AllSelector
											selectAll={this.selectAll}
											deselectAll={this.deselectAll}
											anySelected={this.anySelected()}
											allSelected={this.allSelected()}
											translate={translate}
										/>
										{selectedValues.length > 0 && (
											<BasicButton
												text={`${translate.download} ${
													selectedValues.length
												} ${translate.drafts} ${
													translate.to
												} '${translate.my_drafts}'`}
												color={"white"}
												textStyle={{
													color: primary,
													fontWeight: "700",
													fontSize: "1em",
													textTransform: "none"
												}}
												textPosition="after"
												icon={
													<ButtonIcon
														type="add"
														color={primary}
													/>
												}
												onClick={() =>
													this.cloneDrafts()
												}
												buttonStyle={{
													marginRight: "1em",
													border: `2px solid ${primary}`,
													paddingTop: "14px",
													paddingBottom: "13px"
												}}
											/>
										)}
									</div>
									<EnhancedTable
										translate={translate}
										defaultLimit={DRAFTS_LIMITS[0]}
										defaultFilter={"title"}
										defaultOrder={["title", "asc"]}
										limits={DRAFTS_LIMITS}
										page={1}
										selectedCategories={[{
											field: "type",
											value: 'all',
											label: translate.all_plural
										},{
											field: "companyType",
											value: this.props.company.type,
											label: translate.all_plural
										}]}
										categories={[[
											{
												field: "type",
												value: 'all',
												label: translate.all_plural
											},
											...(draftTypes.map(draft => {
												return {
													field: "type",
													value: draft.value,
													label: translate[draftTypes[draft.value].label]
												};
											}))
										], [{
												field: 'companyType',
												value: 'all',
												label: translate.all_plural
											},
											...(this.props.data.companyTypes.map(type => {
												return {
													field: 'companyType',
													value: type.value,
													label: translate[this.props.data.companyTypes[type.value].label]
												}
											}))
											]
										]}
										loading={loading}
										length={platformDrafts.list.length}
										total={platformDrafts.total}
										refetch={this.props.data.refetch}
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
														isChecked={this.isChecked}
														alreadySaved={this.alreadySaved}
														updateState={this.updateState}
														updateSelectedValues={this.updateSelectedValues}
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
			</CardPageLayout>
		);
	}
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
	
		return (
			<TableRow
				key={`draft${draft.id}`}
				hover={true}
				onMouseEnter={this.mouseEnterHandler}
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
					style={TableStyles.TD}
					onClick={() =>
						this.props.updateSelectedValues(
							draft.id
						)
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
		graphql(platformDrafts, {
			options: props => ({
				variables: {
					companyId: props.company.id,
					options: {
						limit: DRAFTS_LIMITS[0],
						offset: 0
					},
					filters: [
						{
							field: 'companyType',
							text: props.company.type
						}
					]
				},
				notifyOnNetworkStatusChange: true
			})
		}),
		graphql(cloneDrafts, {
			name: "cloneDrafts"
		})
	)(withRouter(withApollo(PlatformDrafts)))
);
