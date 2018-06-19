import React, { Component } from "react";
import {
	Grid,
	GridItem,
	LoadingSection,
	SelectInput,
	TextInput
} from "./index";
import { Icon, MenuItem } from "material-ui";
import Table, {
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TableSortLabel
} from "material-ui/Table";
import TableStyles from "../styles/table";
import { getPrimary, getSecondary } from "../styles/colors";
import PaginationFooter from "./PaginationFooter";

const primary = getPrimary();
const secondary = getSecondary();
const paginationButtonStyle = {
	cursor: "pointer",
	padding: "0.5em",
	paddingTop: "0.2em",
	paddingBottom: "0.2em",
	border: "1px solid",
	borderColor: secondary,
	color: secondary,
	marginLeft: "1px",
	marginRight: "1px"
};

class EnhancedTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			filterText: "",
			filterField: this.props.defaultFilter,
			limit: this.props.defaultLimit,
			page: 1,
			orderBy: this.props.defaultOrder ? this.props.defaultOrder[0] : "",
			orderDirection: this.props.defaultOrder
				? this.props.defaultOrder[1]
				: "asc",
			selectedCategory: this.props.selectedCategory
				? this.props.selectedCategory.field
				: "",
			categoryValue: this.props.selectedCategory
				? this.props.selectedCategory.value
				: "all"
		};
		this.timeout = null;
	}



	updateFilterText = async value => {
		const { refetch, addedFilters } = this.props;
		this.setState({
			filterText: value,
			page: 1
		});

		let variables = {
			filters: [
				{
					field: this.state.filterField,
					text: value
				}
			]
		};
		if (addedFilters) {
			variables.filters = [...addedFilters, ...variables.filters];
		}
		if (!!this.state.selectedCategory) {
			variables = {
				...variables,
				filters: [
					...variables.filters,
					{
						field: this.state.selectedCategory,
						text: this.state.categoryValue
					}
				]
			};
		}
		clearTimeout(this.timeout);
		this.timeout = setTimeout(() => refetch(variables), 450);
	};
	updateFilterField = async value => {
		const { refetch } = this.props;

		this.setState({
			filterField: value,
			page: 1
		});

		if (this.state.filterText) {
			let newVariables = {
				filters: [
					{
						field: value,
						text: this.state.filterText
					}
				]
			};
			refetch(newVariables);
		}
	};
	updateLimit = async limit => {
		const { refetch } = this.props;

		if (!!limit) {
			let variables = {
				options: {
					limit: limit
				}
			};
			if (!!this.state.filterText) {
				variables = {
					...variables,
					filters: [
						{
							field: this.state.filterField,
							text: this.state.filterText
						}
					]
				};
			}
			if(!!this.props.addedFilters){
				variables.filters = [...variables.filters, ...this.props.addedFilters];
			}

			refetch(variables);
			this.setState({
				limit: limit,
				page: 1
			});
		}
	};
	changePage = async (page, object = {}) => {
		const { refetch } = this.props;

		if (!!page) {
			let variables = {
				...object,
				options: {
					limit: this.state.limit,
					offset: this.state.limit * (page - 1)
				}
			};
			if (!!this.state.filterText) {
				variables = {
					...variables,
					filters: [
						{
							field: this.state.filterField,
							text: this.state.filterText
						}
					]
				};
			}

			if(!!this.props.addedFilters){
				variables.filters = [...variables.filters, ...this.props.addedFilters];
			}

			if (!!this.state.selectedCategory) {
				variables = {
					...variables,
					filters: [
						...variables.filters,
						{
							field: this.state.selectedCategory,
							text: this.state.categoryValue
						}
					]
				};
			}
			refetch(variables);
			this.setState({
				page: page
			});
		}
	};
	orderBy = async field => {
		const { orderBy } = this.state;
		const { refetch } = this.props;
		let direction = "asc";

		if (field === orderBy) {
			direction = this.state.orderDirection === "asc" ? "desc" : "asc";
		}

		let variables = {
			options: {
				limit: this.state.limit,
				orderBy: field,
				orderDirection: direction,
				offset: 0
			}
		};
		if (!!this.state.filterText) {
			variables = {
				...variables,
				filters: [
					{
						field: this.state.filterField,
						text: this.state.filterText
					}
				]
			};
		}

		if(!!this.props.addedFilters){
			variables.filters = [...variables.filters, ...this.props.addedFilters];
		}

		if (this.state.selectedCategory !== 'all') {
			variables = {
				...variables,
				filters: [
					...variables.filters,
					{
						field: this.state.selectedCategory,
						text: this.state.categoryValue
					}
				]
			};
		}
		refetch(variables);
		this.setState({
			orderBy: field,
			orderDirection: direction
		});
	};

	refresh = object => {
		this.changePage(1, object);
	};

	updateCategory = (event, field) => {
		const { refetch } = this.props;

		let variables = {
			filters: []
		};

		if(event.value !== 'all'){
			variables.filters = [
				{
					field: field,
					text: event.value
				}
			]
		}

		if(!!this.props.addedFilters){
			variables.filters = [...variables.filters, ...this.props.addedFilters];
		}

		if (!!this.state.filterText) {
			variables = {
				...variables,
				filters: [
					...variables.filters,
					{
						field: this.state.filterField,
						text: this.state.filterText
					}
				]
			};
		}

		refetch(variables);
		this.setState({
			selectedCategory: field,
			categoryValue: event.value
		});
	};

	render() {
		const {
			fields,
			limits,
			translate,
			total,
			length,
			loading,
			headers,
			children,
			categories
		} = this.props;
		const {
			filterText,
			filterField,
			categoryValue,
			limit,
			page
		} = this.state;

		return (
			<div>
				<Grid>
					{limits && (
						<GridItem xs={3} md={3} lg={3}>
							<SelectInput
								value={limit}
								onChange={event =>
									this.updateLimit(event.target.value)
								}
							>
								{limits.map(item => (
									<MenuItem
										key={`limit_${item}`}
										value={item}
									>
										{item}
									</MenuItem>
								))}
							</SelectInput>
						</GridItem>
					)}
					{fields ? (
						<GridItem xs={12} md={3} lg={3}>
							<SelectInput
								floatingText={translate.filter_by}
								value={filterField}
								onChange={event =>
									this.updateFilterField(event.target.value)
								}
							>
								{fields.map(field => (
									<MenuItem
										key={`field_${field.value}`}
										value={field.value}
									>
										{field.translation}
									</MenuItem>
								))}
							</SelectInput>
						</GridItem>
					) : (
						<GridItem xs={12} md={3} lg={3}>
							{" "}
						</GridItem>
					)}
					{categories ? (
						<GridItem xs={12} md={3} lg={3}>
							<SelectInput
								value={categoryValue}
								onChange={event =>
									this.updateCategory(
										event.target,
										categories[0].field
									)
								}
							>
								{categories.map(category => (
									<MenuItem
										key={`category_${category.value}`}
										value={category.value}
									>
										{category.label}
									</MenuItem>
								))}
							</SelectInput>
						</GridItem>
					) : (
						<GridItem xs={12} md={3} lg={3}>
							{" "}
						</GridItem>
					)}
					{!this.props.hideTextFilter && 
						<GridItem xs={12} md={3} lg={3}>
							<TextInput
								adornment={<Icon>search</Icon>}
								floatingText={" "}
								type="text"
								value={filterText}
								onChange={event => {
									this.updateFilterText(event.target.value);
								}}
							/>
						</GridItem>
					}
				</Grid>
				<Table style={{ maxWidth: "100%" }}>
					<TableHead>
						<TableRow>
							{headers.map((header, index) => {
								return (
									<TableCell
										key={`header_${index}`}
										sortDirection={
											this.state.orderDirection
										}
										style={TableStyles.TH}
									>
										{header.canOrder ? (
											<TableSortLabel
												active={
													header.name ===
													this.state.orderBy
												}
												direction={
													this.state.orderDirection
												}
												onClick={() =>
													this.orderBy(header.name)
												}
											>
												{header.text}
											</TableSortLabel>
										) : (
											header.text
										)}
									</TableCell>
								);
							})}
						</TableRow>
					</TableHead>
					<TableBody>{!loading && children}</TableBody>
				</Table>
				{loading && <LoadingSection />}
				{!loading && (
					<Grid
						style={{
							fontSize: "0.9em",
							marginTop: "1em"
						}}
					>
						<PaginationFooter
							page={page}
							translate={translate}
							length={length}
							limit={limit}
							total={total}
							changePage={this.changePage}
						/>
					</Grid>
				)}
			</div>
		);
	}
}

export default EnhancedTable;
