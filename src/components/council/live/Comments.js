import React, { Component } from "react";
import { graphql } from "react-apollo";
import {
	CollapsibleSection,
	LoadingSection,
	Icon,
	Grid,
	GridItem,
	TextInput,
	PaginationFooter
} from "../../../displayComponents";
import { darkGrey } from "../../../styles/colors";
import { agendaComments } from "../../../queries/agenda";
import { LIVE_COLLAPSIBLE_HEIGHT } from "../../../styles/constants";

class CommentsSection extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			agendaId: this.props.agenda.id,
			filterText: "",
			page: 1
		};
	}

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
		const response = await this.props.data.refetch(variables);
	};

	_button = () => {
		const { translate, council } = this.props;

		return (
			<div
				style={{
					height: LIVE_COLLAPSIBLE_HEIGHT,
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center"
				}}
			>
				<div
					style={{
						width: "25%",
						height: LIVE_COLLAPSIBLE_HEIGHT,
						display: "flex",
						alignItems: "center",
						paddingLeft: "1.5em"
					}}
				>
					<Icon className="material-icons" style={{ color: "grey" }}>
						assignment
					</Icon>
					<span
						style={{
							marginLeft: "0.7em",
							color: darkGrey,
							fontWeight: "700"
						}}
					>
						{council.statute.existsAct
							? translate.act_comments
							: translate.council_comments}
					</span>
				</div>
				<div
					style={{
						width: "25%",
						display: "flex",
						justifyContent: "flex-end",
						paddingRight: "2em"
					}}
				>
					<Icon className="material-icons" style={{ color: "grey" }}>
						keyboard_arrow_down
					</Icon>
				</div>
			</div>
		);
	};

	_section = () => {
		return (
			<Grid style={{ width: "100%", backgroundColor: "white" }}>
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
										<span
											style={{
												fontStyle: "italic",
												fontSize: "0.85em"
											}}
										>{`"${voting.comment}"`}</span>
										<br />
										<span
											style={{ fontSize: "0.73rem" }}
										>{`${voting.author.name} - ${
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
	};

	render() {
		return (
			<div
				style={{
					width: "100%",
					backgroundColor: "lightgrey",
					position: "relative"
				}}
			>
				<CollapsibleSection
					trigger={this._button}
					collapse={this._section}
				/>
			</div>
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
})(CommentsSection);
