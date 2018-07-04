import React from "react";
import {
	Grid,
	GridItem,
	LoadingSection,
	SelectInput,
	TextInput
} from "./index";
import PropTypes from "prop-types";
import { Icon, MenuItem } from "material-ui";
import Table, {
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TableSortLabel
} from "material-ui/Table";
import TableStyles from "../styles/table";
import PaginationFooter from "./PaginationFooter";

class EnhancedTable extends React.Component {
	state = {
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

	timeout = null;

	refresh = () => {
		let variables = {
			options: {
				limit: this.state.limit,
				offset: this.state.limit * (this.state.page - 1),
				orderBy: this.state.orderBy,
				orderDirection: this.state.orderDirection
			},
			filters: []
		};
		if(this.state.filterText){
			variables.filters.push({
				field: this.state.filterField,
				text: this.state.filterText
			});
		};

		if(this.props.addedFilters){
			variables.filters = [
				...variables.filters,
				...this.props.addedFilters
			]
		}

		if(this.state.categoryValue !== 'all'){
			variables.filters = [
				...variables.filters,
				{
					field: this.state.selectedCategory,
					text: this.state.categoryValue
				}
			]
		}
		this.props.refetch(variables);
	};

	updateFilterText = value => {
		this.setState({
			filterText: value,
			page: 1
        }, () => {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => this.refresh(), 450);
		});
	};

	updateFilterField = value => {
		this.setState({
			filterField: value,
			page: 1
		}, () => this.refresh());
	};

	updateLimit = limit => {
		this.setState({
			limit: limit,
			page: 1
		}, () => this.refresh());
	};

	changePage = page => {
		this.setState({
			page: page
		}, () => this.refresh());
	};

	orderBy = field => {
		let direction = "asc";

		if (field === this.state.orderBy) {
			direction = this.state.orderDirection === "asc" ? "desc" : "asc";
		}

		this.setState({
			orderBy: field,
			orderDirection: direction
		}, () => this.refresh());
	};

	updateCategory = (event, field) => {
		this.setState({
			selectedCategory: field,
			categoryValue: event.value
		}, () => this.refresh());

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
						<GridItem xs={2} md={2} lg={2}>
							<div style={{width: '5em'}}>
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
							</div>
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
						<GridItem xs={12} md={4} lg={4}>
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
				{loading &&
					<div style={{marginTop: '3em'}}>
						<LoadingSection />
					</div>
				}
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

EnhancedTable.propTypes = {
	refetch: PropTypes.func.isRequired
};

export default EnhancedTable;
