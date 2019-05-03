import React from 'react';
import VotingsTable from './VotingsTable';
import { withApollo } from 'react-apollo';
import { agendaVotings } from "../../../../queries/agenda";
import { useOldState } from '../../../../hooks';
const pageLimit = 10;

const VotingsTableFiltersContainer = ({ agenda, client, ...props }) => {
	const [state, setState] = useOldState({
		open: false,
		voteFilter: "all",
		stateFilter: "all",
		filterText: "",
		page: 1,
		loading: true,
		agendaId: agenda.id
	});

	const [data, setData] = React.useState({});

	React.useEffect(() => {
		let timeout = setTimeout(getData, 200);
		let interval = setInterval(getData, 7000);
		return () => {
			clearTimeout(timeout);
			clearInterval(interval);
		}
	}, [state.voteFilter, state.stateFilter, state.filterText, state.page]);

	const getData = async() => {
		const response = await client.query({
			query: agendaVotings,
			variables: {
				agendaId: agenda.id,
				...buildVariables()
			}
		});

		console.log(response.data);

		setData(response.data);
	}

	const updateFilterText = value => {
		setState({
			page: 1,
			filterText: value
		});
	};

	const changeVoteFilter = value => {
		setState({
			page: 1,
			voteFilter: state.voteFilter === value ? "all" : value
		});
	};

	const changeStateFilter = value => {
		setState({
			page: 1,
			stateFilter: state.stateFilter === value ? "all" : value
		});
	};

	const changePage = value => {
		setState({
            page: value,
            offset: pageLimit * (value - 1)
        })
    };

    const buildVariables = () => {
		let variables = {
			filters: [],
			authorFilters: null
		};

		variables.options = {
			limit: pageLimit,
			offset: (state.page - 1) * pageLimit
		}

		if (state.voteFilter !== "all") {
			variables.filters = [
				{
					field: "vote",
					text: state.voteFilter
				}
			];
		}

		if (state.filterText) {
			variables = {
				...variables,
				authorFilters: {
					username: state.filterText
				}
			};
		}

		if (state.stateFilter !== "all") {
			variables = {
				...variables,
				filters: [
					...variables.filters,
					{
						field: "presentVote",
						text: state.stateFilter
					}
				]
			};
		}

		return variables;
	};

	return (
		<VotingsTable
			{...props}
			changePage={changePage}
			page={state.page}
			state={state}
			pageLimit={pageLimit}
			data={data}
			refetch={getData}
			agenda={agenda}
			loading={state.loading}
			changeStateFilter={changeStateFilter}
			changeVoteFilter={changeVoteFilter}
			updateFilterText={updateFilterText}
		/>
	)

}


export default withApollo(VotingsTableFiltersContainer);