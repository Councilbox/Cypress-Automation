import React, { Component } from 'react';
import { LoadingSection, TextInput, Grid, GridItem, SelectInput } from './';
import { MenuItem } from 'material-ui';
import Table, { TableBody, TableCell, TableHead, TableRow, TableSortLabel } from 'material-ui/Table';
import { hasMorePages } from '../../utils/pagination';

class EnhancedTable extends Component {

    constructor(props){
        super(props);
        this.state = {
            filterText: '',
            filterField: this.props.defaultFilter,
            limit: this.props.defaultLimit,
            page: 1,
            orderBy: this.props.defaultOrder? this.props.defaultOrder[0] : '',
            orderDirection :this.props.defaultOrder? this.props.defaultOrder[1] : 'asc',
            selectedCategory: this.props.selectedCategory? this.props.selectedCategory.field : '',
            categoryValue: this.props.selectedCategory? this.props.selectedCategory.value : '',
        }
        this.timeout = null;
    }

    updateFilterText = async (value) => {
        const { refetch, addedFilters } = this.props;
        this.setState({
            filterText: value,
            page: 1
        });

        let variables = {
            filters: [
                {field: this.state.filterField, text: value }
            ]
        }
        if(addedFilters){
            variables.filters = [
                ...addedFilters,
                ...variables.filters
            ]
        }
        if(!!this.state.selectedCategory){
            variables = {
                ...variables,
                filters: [
                    ...variables.filters,
                    {field: this.state.selectedCategory,
                    text: this.state.categoryValue}
                ]
            }
        }
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => refetch(variables), 450);
    }

    updateFilterField = async (value) => {
        const { refetch } = this.props;

        this.setState({
            filterField: value,
            page: 1
        });

        if(this.state.filterText){
            let newVariables = {
                filters: [{
                    field: value,
                    text: this.state.filterText
                }]
            }
            refetch(newVariables);
        }
    }

    updateLimit = async (limit) => {
        const { refetch } = this.props;

        if(!!limit){
            let variables = {
                options: {
                    limit: limit
                }
            }
            if(!!this.state.filterText){
                variables = {
                    ...variables,
                    ...this.props.addedFilters,                    
                    filters: [{
                        field: this.state.filterField,
                        text: this.state.filterText
                    }]
                }
            }
            refetch(variables);
            this.setState({
                limit: limit,
                page: 1
            });
        }
    }

    changePage = async (page) => {
        const { refetch } = this.props;

        if(!!page){
            let variables = {
                options: {
                    limit: this.state.limit,
                    offset: this.state.limit * (page - 1)
                }
            }
            if(!!this.state.filterText){
                variables = {
                    ...variables,
                    ...this.props.addedFilters,
                    filters: [{
                        field: this.state.filterField,
                        text: this.state.filterText
                    }]
                }
            }
            if(!!this.state.selectedCategory){
                variables = {
                    ...variables,
                    filters: [
                        ...variables.filters,
                        {field: this.state.selectedCategory,
                        text: this.state.categoryValue}
                    ]
                }
            }
            refetch(variables);
            this.setState({
                page: page
            });
        }
    }

    orderBy = async (field) => {
        const { orderBy } = this.state;
        const { refetch } = this.props;
        let direction = 'asc';
        
        if(field === orderBy){
            direction = this.state.orderDirection === 'asc'? 'desc' : 'asc';
        }

        let variables = {
            options: {
                limit: this.state.limit,
                orderBy: field,
                orderDirection: direction,
                offset: 0
            }
        }
        if(!!this.state.filterText){
            variables = {
                ...this.props.addedFilters,
                ...variables,
                filters: [{
                    field: this.state.filterField,
                    text: this.state.filterText
                }]
            }
        }
        if(!!this.state.selectedCategory){
            variables = {
                ...variables,
                filters: [
                    ...variables.filters,
                    {field: this.state.selectedCategory,
                    text: this.state.categoryValue}
                ]
            }
        }
        refetch(variables);
        this.setState({
            orderBy: field,
            orderDirection: direction
        });

    }

    updateCategory = (event, field) => {
        const { refetch } = this.props;

        let variables = {
            filters: [
                ...this.props.addedFilters,
                {
                    field: field,
                    text: event.value
                }
        ]            
        }

        if(!!this.state.filterText){
            variables = {
                ...variables,
                filters: [
                    ...variables.filters,
                {
                    field: this.state.filterField,
                    text: this.state.filterText
                }]
            }
        }
        refetch(variables);
        this.setState({
            selectedCategory: field,
            categoryValue: event.value
        });
    }

    
    render(){
        const { fields, limits, translate, total, length, loading, headers, children, categories } = this.props;
        const { filterText, filterField, selectedCategory, categoryValue, limit, page } = this.state;

        return(
            <React.Fragment>
                <Grid>
                    {limits &&
                        <GridItem xs={2} md={1} lg={1}>
                            <SelectInput
                                value={limit}
                                onChange={(event) =>  this.updateLimit(event.target.value)}
                            >
                                {limits.map((item) => 
                                    <MenuItem key={`limit_${item}`} value={item}>{item}</MenuItem>
                                )}
                            </SelectInput>
                        </GridItem>
                    }
                    <GridItem xs={12} md={3} lg={3}>
                        <TextInput
                            floatingText={translate.find}
                            type="text"
                            value={filterText}
                            onChange={(event) => {
                                this.updateFilterText(event.target.value)
                            }}
                        />
                    </GridItem>
                    {fields &&
                        <GridItem xs={12} md={3} lg={3}>
                            <SelectInput
                                floatingText={translate.filter_by}
                                value={filterField}
                                onChange={(event) =>  this.updateFilterField(event.target.value)}
                            >
                                {fields.map((field) => 
                                    <MenuItem key={`field_${field.value}`} value={field.value}>{field.translation}</MenuItem>
                                )}
                            </SelectInput>
                        </GridItem>
                    }
                    {categories &&
                        <GridItem xs={12} md={3} lg={3}>
                            <SelectInput
                                value={categoryValue}
                                onChange={(event) =>  this.updateCategory(event.target, categories[0].field)}
                            >
                                {categories.map((category) => 
                                    <MenuItem key={`category_${category.value}`} value={category.value}>{category.label}</MenuItem>
                                )}
                            </SelectInput>
                        </GridItem>
                    }
                </Grid>
                <Table>
                    <TableHead>
                        <TableRow>
                            {headers.map((header, index) => {
                                return(
                                    <TableCell key={`header_${index}`} sortDirection={this.state.orderDirection}>
                                        {header.canOrder?
                                            <TableSortLabel
                                                active={header.name === this.state.orderBy}
                                                direction={this.state.orderDirection}
                                                onClick={() =>this.orderBy(header.name)}
                                            >
                                                {header.text}
                                            </TableSortLabel>
                                        :
                                            header.text
                                        }
                                    </TableCell>
                                )
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {!loading && children}
                    </TableBody>
                </Table>
                {loading &&
                    <LoadingSection />
                }
                {!loading &&
                    <Grid style={{fontSize: '0.9em', marginTop: '1em'}}>
                        <GridItem xs={6} lg={6} md={6}>
                            {length > 0?
                                `${translate.table_showing_part1} ${(page - 1) * limit + 1} ${translate.table_showing_part2} ${(page - 1) * limit + length} ${translate.table_showing_part3} ${total} ${translate.table_showing_part4}`
                            :
                                translate.table_no_results    
                            }
                        </GridItem>
                        <GridItem xs={6} lg={6} md={6}>
                            <div style={{float: 'right'}}>
                                {page > 1 &&
                                    <React.Fragment>
                                        <span onClick={() => this.changePage(1)} style={{cursor: 'pointer', padding: '0.3em', paddingTop: '0.1em', paddingBottom: '0.1em', border: '2px solid grey'}}>
                                            {translate.table_button_first}
                                        </span>
                                        <span onClick={() => this.changePage(page - 1)} style={{cursor: 'pointer', padding: '0.3em', paddingTop: '0.1em', paddingBottom: '0.1em', border: '2px solid grey'}}>
                                            {translate.table_button_previous}
                                        </span>
                                    </React.Fragment>
                                }
                                <span style={{marginLeft: '0.5em', marginRight: '0.5em'}}>
                                    {page}
                                </span>
                                {hasMorePages(page, total, limit) &&
                                    <React.Fragment>
                                        <span onClick={() => this.changePage(page + 1)} style={{cursor: 'pointer', padding: '0.3em', paddingTop: '0.1em', paddingBottom: '0.1em', border: '2px solid grey'}}>
                                            {translate.table_button_next}
                                        </span>
                                        <span onClick={() => this.changePage(Math.ceil(total / limit))} style={{cursor: 'pointer', padding: '0.3em', paddingTop: '0.1em', paddingBottom: '0.1em', border: '2px solid grey'}}>
                                            {translate.table_button_last}
                                        </span>
                                    </React.Fragment>
                                }
                            </div>
                        </GridItem>
                    </Grid>
                }
            </React.Fragment>
        )
    }
}

export default EnhancedTable;