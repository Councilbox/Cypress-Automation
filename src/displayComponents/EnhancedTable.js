import React from "react";
import {
	Grid,
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
import { isMobile } from 'react-device-detect';

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
		selectedCategories: this.props.selectedCategories
	};

	timeout = null;

	refresh = object => {
		let variables = {
			options: {
				limit: this.state.limit,
				offset: this.state.limit * (this.state.page - 1),
				orderBy: this.state.orderBy,
				orderDirection: this.state.orderDirection
			},
			filters: []
		};

		if (this.state.filterText) {
			variables.filters.push({
				field: this.state.filterField,
				text: this.state.filterText
			});
		};

		if (this.props.addedFilters) {
			variables.filters = [
				...variables.filters,
				...this.props.addedFilters
			]
		}

		if (this.props.categories) {
			if (this.props.categories.length > 0) {
				this.state.selectedCategories.forEach(category => {
					if (category.value !== 'all') {
						variables.filters = [
							...variables.filters,
							{
								field: category.field,
								text: category.value
							}
						]
					}
				})
			}
		}

		if (object) {
			variables = {
				...variables,
				...object
			}
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

	updateCategory = (index, event, field) => {
		let { selectedCategories } = this.state;
		selectedCategories[index].value = event.value;
		this.setState({
			selectedCategories: [...selectedCategories],
			page: 1
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
			limit,
			page
		} = this.state;

		console.log(headers);

		return (
			<div>
				<Grid style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
					{limits && (
						<div style={{ width: '5em' }}>
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
					)}
					<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
						{categories && (
							categories.map((category, index) => (
								<div key={`category_${index}`} style={{ minWidth: '12em', marginRight: '0.8em' }}>
									<SelectInput
										value={this.state.selectedCategories[index].value}
										onChange={event =>
											this.updateCategory(index,
												event.target,
												categories[0].field
											)
										}
									>
										{category.map(fields => (
											<MenuItem
												key={`category_${index}${fields.value}`}
												value={fields.value}
											>
												{fields.label}
											</MenuItem>
										))}
									</SelectInput>
								</div>
							))
						)}
						{!!this.props.menuButtons &&
							this.props.menuButtons
						}
						{fields && (
							<div style={{ minWidth: '12em', marginRight: '0.8em' }}>
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
							</div>
						)}
						{!this.props.hideTextFilter &&
							<div style={{ width: '16em' }}>
								<TextInput
									adornment={<Icon>search</Icon>}
									floatingText={" "}
									type="text"
									value={filterText}
									onChange={event => {
										this.updateFilterText(event.target.value);
									}}
								/>
							</div>
						}
					</div>
				</Grid>
				{!isMobile?
					<Table style={{ maxWidth: "100%", tableLayout: 'auto'}}>
						<TableHead>
							<TableRow>
								{headers.map((header, index) => {
									return (
										header.selectAll?
											<TableCell>
												{header.selectAll}
											</TableCell>
										:
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
				:
					children
				}
				
				{loading &&
					<div style={{ marginTop: '3em' }}>
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
