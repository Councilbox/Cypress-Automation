import React from 'react';
import VotingsTable from './VotingsTable';
import { withApollo } from 'react-apollo';
import { agendaVotings } from "../../../../queries/agenda";
import { useOldState, usePolling } from '../../../../hooks';
import { canEditPresentVotings, agendaVotingsOpened, isCustomPoint } from '../../../../utils/CBX';
import ManualVotingsMenu from './ManualVotingsMenu';
import CustomAgendaManualVotings from './CustomAgendaManualVotings';
const pageLimit = 10;

const VotingsTableFiltersContainer = ({ agenda, council, client, ...props }) => {
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

	const getData = async () => {
		const response = await client.query({
			query: agendaVotings,
			variables: {
				agendaId: agenda.id,
				...buildVariables()
			}
		});
		setData(response.data);
	}

	usePolling(getData, council.state > 30? 60000 : 6000, [state.voteFilter, state.stateFilter, state.filterText, state.page]);

	const updateFilterText = value => {
		setState({
			page: 1,
			filterText: value
		});
	}

	const changeVoteFilter = value => {
		setState({
			page: 1,
			voteFilter: state.voteFilter === value ? "all" : value
		});
	}

	const changeStateFilter = value => {
		setState({
			page: 1,
			stateFilter: state.stateFilter === value ? "all" : value
		});
	}

	const changePage = value => {
		setData({});
		setState({
            page: value,
            offset: pageLimit * (value - 1)
        })
    }

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
	}

	return (
		<React.Fragment>
			{!isCustomPoint(agenda.subjectType)?
				<React.Fragment>
					{((canEditPresentVotings(agenda) && agendaVotingsOpened(agenda) && council.councilType !== 3)
					|| (council.councilType === 3 && agenda.votingState === 4)) &&
						<ManualVotingsMenu
							refetch={props.refetch}
							changeEditedVotings={props.changeEditedVotings}
							editedVotings={props.editedVotings}
							translate={props.translate}
							agenda={agenda}
							votingsRecount={data.votingsRecount}
						/>
					}
				</React.Fragment>
			:
				<React.Fragment>
					{((canEditPresentVotings(agenda) &&
						agendaVotingsOpened(agenda) && council.councilType !== 3) || (council.councilType === 3 && agenda.votingState === 4)) &&
						<CustomAgendaManualVotings
							agenda={agenda}
							translate={props.translate}
							votingsRecount={data.votingsRecount}
							changeEditedVotings={props.changeEditedVotings}
						/>
					}
				</React.Fragment>
			}
			<VotingsTable
				{...props}
				changePage={changePage}
				page={state.page}
				state={state}
				pageLimit={pageLimit}
				data={data}
				council={council}
				refetch={getData}
				agenda={agenda}
				loading={state.loading}
				changeStateFilter={changeStateFilter}
				changeVoteFilter={changeVoteFilter}
				updateFilterText={updateFilterText}
			/>
		</React.Fragment>
	)

}


export default withApollo(VotingsTableFiltersContainer);