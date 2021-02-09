import React from 'react';
import { graphql } from 'react-apollo';
import { agendaComments } from '../../../../queries/agenda';
import {
	LoadingSection,
	Icon,
	Grid,
	GridItem,
	TextInput,
	PaginationFooter
} from '../../../../displayComponents';

const CommentsTable = props => {
	const [state, setState] = React.useState({
		agendaId: props.agenda.id,
		filterText: '',
		page: 1
	});

	const updateFilterText = value => {
		setState({
			...state,
			filterText: value
		}, refreshTable);
	};

	const changePage = value => {
		const variables = buildVariables();
		variables.options = {
			limit: 10,
			offset: 10 * (value - 1)
		};

		setState({
			...state,
			page: value
		});
		props.data.refetch(variables);
	};

	const buildVariables = () => {
		let variables = {
			filters: [],
			authorFilters: null
		};

		if (this.state.filterText) {
			const filterText = state.filterText;
			variables = {
				...variables,
				authorFilters: {
					username: filterText.trim()
				}
			};
		}
		return variables;
	};

	const refreshTable = async () => {
		const variables = buildVariables();
		await props.data.refetch(variables);
	};

	return (
		<Grid
			style={{
				width: '100%',
				backgroundColor: 'white',
				paddingBottom: '1em',
				paddingLeft: '1em'
			}}
		>
			<GridItem xs={8} md={8} lg={8} />
			<GridItem
				xs={4}
				md={4}
				lg={4}
				style={{ paddingRight: '1.3em' }}
			>
				<TextInput
					adornment={<Icon>search</Icon>}
					floatingText={' '}
					type="text"
					value={state.filterText}
					onChange={event => {
						updateFilterText(event.target.value);
					}}
				/>
			</GridItem>
			{props.data.loading ? (
				<LoadingSection />
			) : props.data.agendaComments && props.data.agendaComments.list.length > 0 ? (
				<React.Fragment>
					{props.data.agendaComments.list.map(voting => (
							<GridItem
								xs={6}
								lg={6}
								md={6}
								key={`voting_${voting.author.id}`}
								style={{
									paddingBottom: '0.5em',
									paddingLeft: '2em',
									paddingRight: '2em'
								}}
							>
								<div
									style={{
										borderBottom: '1px solid black'
									}}
								>
									<div
										dangerouslySetInnerHTML={{
											__html: voting.comment
										}}
										style={{
											fontStyle: 'italic',
											fontSize: '0.85em'
										}}
									></div>
									<span
										style={{ fontSize: '0.73rem', fontWeight: '700' }}
									>{`${voting.author.name} ${voting.author.surname || ''} ${voting.author.representative ? `- ${props.translate.represented_by}: ${
											voting.author.representative.name} ${
											voting.author.representative.surname || ''
											}` : ''}`}
									</span>
									{voting.author.position &&
										<span style={{ fontSize: '0.73rem' }}>{` - ${
											voting.author.position
										}`}</span>
									}
								</div>
							</GridItem>
						))}
					<GridItem
						xs={11}
						lg={11}
						md={11}
						style={{
							width: '90%',
							margin: '1em',
							marginLeft: '2em',
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'space-between',
							paddinRight: '10em'
						}}
					>
						<PaginationFooter
							page={state.page}
							translate={props.translate}
							length={props.data.agendaComments.list.length}
							total={props.data.agendaComments.total}
							limit={10}
							changePage={changePage}
						/>
					</GridItem>
				</React.Fragment>
			) : (
				props.translate.no_results
			)}
		</Grid>
	);
};

export default graphql(agendaComments, {
	options: props => ({
		variables: {
			agendaId: props.agenda.id,
			options: {
				limit: 10,
				offset: 0
			}
		},
		pollInterval: props.council.state > 30 ? 60000 : 6000,
		fetchPolicy: 'network-only'
	})
})(CommentsTable);
