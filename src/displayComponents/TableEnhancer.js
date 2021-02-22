import React, { Component } from 'react';
import { MenuItem } from 'material-ui';
import {
	Grid, GridItem, SelectInput, TextInput
} from './index';

class TableEnhancer extends Component {
updateFilterText = async value => {
	const { refetch } = this.props;
	this.setState({
		filterText: value,
		page: 1
	});

	const newVariables = {
		filter: {
			field: this.state.filterField,
			text: value
		}
	};
	clearTimeout(this.timeout);
	this.timeout = setTimeout(() => refetch(newVariables), 450);
};

updateFilterField = async value => {
	const { refetch } = this.props;

	this.setState({
		filterField: value,
		page: 1
	});

	if (this.state.filterText) {
		const newVariables = {
			filter: {
				field: value,
				text: this.state.filterText
			}
		};
		refetch(newVariables);
	}
};

updateLimit = async limit => {
	const { refetch } = this.props;

	if (limit) {
		let variables = {
			options: {
				limit
			}
		};
		if (this.state.filterText) {
			variables = {
				...variables,
				filter: {
					field: this.state.filterField,
					text: this.state.filterText
				}
			};
		}
		refetch(variables);
		this.setState({
			limit,
			page: 1
		});
	}
};

changePage = async page => {
	const { refetch } = this.props;

	if (page) {
		let variables = {
			options: {
				limit: this.state.limit,
				offset: this.state.limit * (page - 1)
			}
		};
		if (this.state.filterText) {
			variables = {
				...variables,
				filter: {
					field: this.state.filterField,
					text: this.state.filterText
				}
			};
		}
		refetch(variables);
		this.setState({
			page
		});
	}
};

constructor(props) {
	super(props);
	this.state = {
		filterText: '',
		filterField: 'fullName',
		limit: this.props.defaultLimit,
		page: 1
	};
	this.timeout = null;
}

render() {
	const {
		fields,
		limits,
		translate,
		total,
		length,
		loading
	} = this.props;
	const {
		filterText, filterField, limit, page
	} = this.state;

	return (
		<React.Fragment>
			<Grid>
				{limits && (
					<GridItem xs={2} md={1} lg={1}>
						<SelectInput
							value={limit}
							onChange={event => this.updateLimit(event.target.value)
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
				<GridItem xs={12} md={3} lg={3}>
					<TextInput
						floatingText={translate.find}
						type="text"
						value={filterText}
						onChange={event => {
							this.updateFilterText(event.target.value);
						}}
					/>
				</GridItem>
				{fields && (
					<GridItem xs={12} md={3} lg={3}>
						<SelectInput
							floatingText={translate.filter_by}
							value={filterField}
							onChange={event => this.updateFilterField(event.target.value)
							}
						>
							{fields.map(field => (
								<MenuItem
									key={`filter_${field.value}`}
									value={field.value}
								>
									{field.translation}
								</MenuItem>
							))}
						</SelectInput>
					</GridItem>
				)}
			</Grid>
			{this.props.children}
			{!loading && (
				<Grid
					style={{
						fontSize: '0.9em',
						marginTop: '1em'
					}}
				>
					<GridItem xs={6} lg={6} md={6}>
						{length > 0 ?
							`${translate.table_showing_part1} ${(page
- 1)
* limit
+ 1} ${
								translate.table_showing_part2
							} ${(page - 1) * limit + length} ${
								translate.table_showing_part3
							} ${total} ${translate.table_showing_part4}`
							: translate.table_no_results}
					</GridItem>
					<GridItem xs={6} lg={6} md={6}>
						<div style={{ float: 'right' }}>
							<span
								onClick={() => this.changePage(1)}
								style={{
									cursor: 'pointer',
									padding: '0.3em',
									paddingTop: '0.1em',
									paddingBottom: '0.1em',
									border: '2px solid grey'
								}}
							>
								{translate.table_button_first}
							</span>
							<span
								onClick={() => this.changePage(page - 1)}
								style={{
									cursor: 'pointer',
									padding: '0.3em',
									paddingTop: '0.1em',
									paddingBottom: '0.1em',
									border: '2px solid grey'
								}}
							>
								{translate.table_button_previous}
							</span>
							<span
								style={{
									marginLeft: '0.5em',
									marginRight: '0.5em'
								}}
							>
								{page}
							</span>
							<span
								onClick={() => this.changePage(page + 1)}
								style={{
									cursor: 'pointer',
									padding: '0.3em',
									paddingTop: '0.1em',
									paddingBottom: '0.1em',
									border: '2px solid grey'
								}}
							>
								{translate.table_button_next}
							</span>
							<span
								onClick={() => this.changePage(
									Math.ceil(total / limit)
								)
								}
								style={{
									cursor: 'pointer',
									padding: '0.3em',
									paddingTop: '0.1em',
									paddingBottom: '0.1em',
									border: '2px solid grey'
								}}
							>
								{translate.table_button_last}
							</span>
						</div>
					</GridItem>
				</Grid>
			)}
		</React.Fragment>
	);
}
}

export default TableEnhancer;
