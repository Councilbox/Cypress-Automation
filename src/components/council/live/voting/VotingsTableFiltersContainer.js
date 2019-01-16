import React from 'react';
import VotingsTable from './VotingsTable';
const pageLimit = 10;
let page = 1;

class VotingsTableFiltersContainer extends React.Component {

    state = {
		open: false,
		voteFilter: "all",
		stateFilter: "all",
		filterText: "",
		page: 1,
		agendaId: this.props.agenda.id
    };

    updateFilterText = value => {
		page = 1;
		this.setState(
			{
                page: 1,
				filterText: value
			}
			//this.refreshTable
		);
	};

    changeVoteFilter = value => {
		page = 1;
		this.setState(
			{
                page: 1,
				voteFilter: this.state.voteFilter === value ? "all" : value
			},
		);
    };


	changeStateFilter = value => {
		page = 1;
		this.setState(
			{
                page: 1,
				stateFilter: this.state.stateFilter === value ? "all" : value
			},
		);
    };

    changePage = value => {
		this.setState({
            page: value,
            offset: pageLimit * (value - 1)
        })
    };

    buildVariables = () => {
		let variables = {
			filters: [],
			authorFilters: null
		};

/* 		variables.options = {
			limit: pageLimit,
			offset: pageLimit * (this.state.page - 1)
		}; */

		if (this.state.voteFilter !== "all") {
			variables.filters = [
				{
					field: "vote",
					text: this.state.voteFilter
				}
			];
		}

		if (this.state.filterText) {
			variables = {
				...variables,
				authorFilters: {
					username: this.state.filterText
				}
			};
		}

		if (this.state.stateFilter !== "all") {
			variables = {
				...variables,
				filters: [
					...variables.filters,
					{
						field: "presentVote",
						text: this.state.stateFilter
					}
				]
			};
		}

		return variables;
	};

    render(){
        return (
            <VotingsTable
                {...this.props}
                changePage={this.changePage}
                page={this.state.page}
                state={this.state}
                pageLimit={pageLimit}
                changeStateFilter={this.changeStateFilter}
                changeVoteFilter={this.changeVoteFilter}
                updateFilterText={this.updateFilterText}
                variables={this.buildVariables()}
            />
        )
    }


}

export default VotingsTableFiltersContainer;