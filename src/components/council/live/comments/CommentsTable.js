import React from 'react';
import { graphql } from 'react-apollo';
import { agendaComments } from "../../../../queries/agenda";
import {
	LoadingSection,
	Icon,
	Grid,
	GridItem,
	TextInput,
	PaginationFooter
} from "../../../../displayComponents";

class CommentsTable extends React.Component{
	state = {
		agendaId: this.props.agenda.id,
		filterText: "",
		page: 1
	};
    
    static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.agenda.id !== prevState.agendaId) {
			return {
				filterText: "",
				agendaId: nextProps.agenda.id
			};
		}
		return null;
    }

    updateFilterText = value => {
		this.setState(
			{
				filterText: value
			},
			this.refreshTable
		);
	};
    
    changePage = value => {
		const variables = this.buildVariables();
		variables.options = {
			limit: 10,
			offset: 10 * (value - 1)
		};

		this.setState({
			page: value
		});
		this.props.data.refetch(variables);
	};

	buildVariables = () => {
		let variables = {
			filters: [],
			authorFilters: null
		};

		if (this.state.filterText) {
			variables = {
				...variables,
				authorFilters: {
					username: this.state.filterText
				}
			};
		}
		return variables;
	};

	refreshTable = async () => {
		const variables = this.buildVariables();
		await this.props.data.refetch(variables);
	};

    render(){

        return (
			<Grid
				style={{
					width: "100%",
					backgroundColor: "white",
					paddingBottom: "1em",
					paddingLeft: "1em"
				}}
			>
				<GridItem xs={8} md={8} lg={8} />
				<GridItem
					xs={4}
					md={4}
					lg={4}
					style={{ paddingRight: "1.3em" }}
				>
					<TextInput
						adornment={<Icon>search</Icon>}
						floatingText={" "}
						type="text"
						value={this.state.filterText}
						onChange={event => {
							this.updateFilterText(event.target.value);
						}}
					/>
				</GridItem>
				{this.props.data.loading ? (
					<LoadingSection />
				) : this.props.data.agendaComments.list.length > 0 ? (
					<React.Fragment>
						{this.props.data.agendaComments.list.map(voting => {
							return (
								<GridItem
									xs={6}
									lg={6}
									md={6}
									key={`voting_${voting.author.email}`}
									style={{
										paddingBottom: "0.5em",
										paddingLeft: "2em",
										paddingRight: "2em"
									}}
								>
									<div
										style={{
											borderBottom: "1px solid black"
										}}
									>
										<div
											dangerouslySetInnerHTML={{
												__html: voting.comment
											}}
											style={{
												fontStyle: "italic",
												fontSize: "0.85em"
											}}
										></div>
										<span
											style={{ fontSize: "0.73rem", fontWeight: '700' }}
										>{`${voting.author.name} ${voting.author.surname}`}
										</span>
										<span style={{ fontSize: "0.73rem" }}>{` - ${
											voting.author.position
										}`}</span>
									</div>
								</GridItem>
							);
						})}
						<GridItem
							xs={11}
							lg={11}
							md={11}
							style={{
								width: "90%",
								margin: "1em",
								marginLeft: "2em",
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "space-between",
								paddinRight: "10em"
							}}
						>
							<PaginationFooter
								page={this.state.page}
								translate={this.props.translate}
								length={
									this.props.data.agendaComments.list.length
								}
								total={this.props.data.agendaComments.total}
								limit={10}
								changePage={this.changePage}
							/>
						</GridItem>
					</React.Fragment>
				) : (
					this.props.translate.no_results
				)}
			</Grid>
		);
    }
}

export default graphql(agendaComments, {
	options: props => ({
		variables: {
			agendaId: props.agenda.id,
			options: {
				limit: 10,
				offset: 0
			}
		},
		pollInterval: 4000
	})
})(CommentsTable);