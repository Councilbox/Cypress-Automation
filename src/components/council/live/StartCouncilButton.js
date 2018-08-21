import React from "react";
import { councilOfficials } from "../../../queries";
import { compose, graphql } from "react-apollo";
import {
	AlertConfirm,
	BasicButton,
	Grid,
	GridItem,
	Icon,
	LoadingSection,
	ParticipantRow,
	TextInput
} from "../../../displayComponents";
import { getPrimary } from "../../../styles/colors";
import Scrollbar from "react-perfect-scrollbar";
import { DELEGATION_USERS_LOAD } from "../../../constants";
import { Typography } from "material-ui";
import { existsQualityVote, calculateQuorum } from "../../../utils/CBX";
import ConveneSelector from './ConveneSelector';
import { startCouncil } from "../../../queries/council";

class StartCouncilButton extends React.Component {

	state = {
		alert: false,
		selecting: 0,
		loading: false,
		data: {
			firstOrSecondConvene: this.props.council.firstOrSecondConvene,
			neededQuorum: 2,
			president: "",
			presidentId: ""
		},
		errors: {
			president: "",
			secretary: "",
			qualityVote: ""
		}
	};

	startCouncil = async () => {
		if (!this.checkRequiredFields()) {
			this.setState({
				loading: true
			});
			const { council, refetch, startCouncil } = this.props;
			const { presidentId, secretaryId, qualityVoteId, firstOrSecondConvene } = this.state.data;
			const response = await startCouncil({
				variables: {
					councilId: council.id,
					presidentId,
					secretaryId,
					qualityVoteId,
					firstOrSecondConvene
				}
			});
			if (response) {
				this.setState({
					loading: false
				})
				refetch();
			}
		}
	};

	checkRequiredFields = () => {
		let hasError = false;
		let errors = {
			president: "",
			secretary: "",
			qualityVote: ""
		};

		if (!this.state.data.president) {
			hasError = true;
			errors.president = true;
		}

		if (!this.state.data.secretary) {
			hasError = true;
			errors.secretary = true;
		}

		if (existsQualityVote(this.props.council.statute)) {
			if (!this.state.data.qualityVoteName) {
				hasError = true;
				errors.qualityVote = true;
			}
		}

		this.setState({
			errors
		});

		return hasError;
	};

	actionSwitch = () => {
		switch (this.state.selecting) {
			case 1:
				return (id, name) => {
					this.setState({
						data: {
							...this.state.data,
							president: name,
							presidentId: id
						},
						selecting: 0
					});
				};

			case 2:
				return (id, name) => {
					this.setState({
						data: {
							...this.state.data,
							secretary: name,
							secretaryId: id
						},
						selecting: 0
					});
				};

			case 3:
				return (id, name) => {
					this.setState({
						data: {
							...this.state.data,
							qualityVoteName: name,
							qualityVoteId: id
						},
						selecting: 0
					});
				};

			default:
				return;
		}
	};


	changeConvene = (value) => {
		this.setState({
			data: {
				...this.state.data,
				firstOrSecondConvene: value
			}
		})
	}

	loadMore = () => {
		this.props.data.fetchMore({
			variables: {
				options: {
					offset: this.props.data.councilOfficials.list.length,
					limit: DELEGATION_USERS_LOAD
				}
			},
			updateQuery: (prev, { fetchMoreResult }) => {
				if (!fetchMoreResult) {
					return prev;
				}
				return {
					...prev,
					councilOfficials: {
						...prev.councilOfficials,
						list: [
							...prev.councilOfficials.list,
							...fetchMoreResult.councilOfficials.list
						]
					}
				};
			}
		});
	};

	_startCouncilForm = () => {
		const { translate } = this.props;
		const { loading } = this.props.data;

		const participants = loading
			? []
			: this.props.data.councilOfficials.list;
		const { total } = loading ? 0 : this.props.data.councilOfficials;
		const rest = total - participants.length - 1;

		if (this.state.selecting !== 0) {
			return (
				<div style={{ width: "600px" }}>
					<TextInput
						adornment={<Icon>search</Icon>}
						floatingText={" "}
						type="text"
						value={this.state.filterText}
						onChange={event => {
							this.updateFilterText(event.target.value);
						}}
					/>

					<div
						style={{
							height: "300px",
							overflow: "hidden",
							position: "relative"
						}}
					>
						{loading ? (
							<LoadingSection />
						) : (
							<Scrollbar option={{ suppressScrollX: true }}>
								{participants.length > 0 ? (
									<React.Fragment>
										{participants.map(participant => (
											<ParticipantRow
												participant={participant}
												key={`participant_${participant.id}`}
												onClick={() =>
													this.actionSwitch()(
														participant.id,
														`${participant.name} ${
															participant.surname
														}`
													)
												}
											/>
										))}
										{participants.length < total - 1 && (
											<div onClick={this.loadMore}>
												{`DESCARGAR ${
													rest > DELEGATION_USERS_LOAD
														? `${DELEGATION_USERS_LOAD} de ${rest} RESTANTES`
														: translate.all_plural.toLowerCase()
												}`}
											</div>
										)}
									</React.Fragment>
								) : (
									<Typography>
										{translate.no_results}
									</Typography>
								)}
							</Scrollbar>
						)}
					</div>
				</div>
			);
		}

		return (
			<Grid style={{ width: "600px" }}>
				<GridItem xs={3} md={3} lg={3}>
					{translate.president}
				</GridItem>
				<GridItem xs={4} md={4} lg={4}>
					<button onClick={() => this.setState({ selecting: 1 })}>
						{translate.select_president}
					</button>
				</GridItem>
				<GridItem xs={5} md={5} lg={5}>
					{!!this.state.data.president ? (
						this.state.data.president
					) : (
						<span
							style={{
								color: this.state.errors.president
									? "red"
									: "inherit"
							}}
						>
							{translate.not_selected}
						</span>
					)}
				</GridItem>

				<GridItem xs={3} md={3} lg={3}>
					{translate.secretary}
				</GridItem>
				<GridItem xs={4} md={4} lg={4}>
					<button onClick={() => this.setState({ selecting: 2 })}>
						{translate.select_secretary}
					</button>
				</GridItem>
				<GridItem xs={5} md={5} lg={5}>
					{!!this.state.data.secretary ? (
						this.state.data.secretary
					) : (
						<span
							style={{
								color: this.state.errors.secretary
									? "red"
									: "inherit"
							}}
						>
							{translate.not_selected}
						</span>
					)}
				</GridItem>

				{existsQualityVote(this.props.council.statute) && (
					<React.Fragment>
						<GridItem xs={3} md={3} lg={3}>
							{translate.quality_vote}
						</GridItem>
						<GridItem xs={4} md={4} lg={4}>
							<button
								onClick={() => this.setState({ selecting: 3 })}
							>
								{translate.select_quality_vote}
							</button>
						</GridItem>
						<GridItem xs={5} md={5} lg={5}>
							{!!this.state.data.qualityVoteName ? (
								this.state.data.qualityVoteName
							) : (
								<span
									style={{
										color: this.state.errors.qualityVote
											? "red"
											: "inherit"
									}}
								>
									{translate.not_selected}
								</span>
							)}
						</GridItem>
					</React.Fragment>
				)}
				<ConveneSelector
					council={this.props.council}
					translate={translate}
					convene={this.state.data.firstOrSecondConvene}
					changeConvene={this.changeConvene}
					recount={this.props.recount}
				/>
			</Grid>
		);
	};

	render() {
		const { translate } = this.props;
		const primary = getPrimary();

		if (this.props.data.loading) {
			return <LoadingSection />;
		}

		return (
			<React.Fragment>
				<BasicButton
					text={translate.start_council}
					color={primary}
					textPosition="before"
					onClick={() =>
						this.setState({
							alert: true
						})
					}
					icon={
						<Icon
							className="material-icons"
							style={{
								fontSize: "1.1em",
								color: "white"
							}}
						>
							play_arrow
						</Icon>
					}
					buttonStyle={{ width: "11em" }}
					textStyle={{
						color: "white",
						fontSize: "0.7em",
						fontWeight: "700",
						textTransform: "none"
					}}
				/>
				<AlertConfirm
					title={translate.start_council}
					bodyText={this._startCouncilForm()}
					open={this.state.alert}
					loadingAction={this.state.loading}
					buttonAccept={translate.accept}
					buttonCancel={translate.cancel}
					hideAccept={this.state.selecting !== 0}
					modal={true}
					acceptAction={this.startCouncil}
					requestClose={
						this.state.selecting === 0
							? () => this.setState({ alert: false })
							: () => this.setState({ selecting: 0 })
					}
				/>
			</React.Fragment>
		);
	}
}

export default compose(
	graphql(startCouncil, { name: "startCouncil" }),
	graphql(councilOfficials, {
		options: props => ({
			variables: {
				councilId: props.council.id,
				options: {
					limit: 10,
					offset: 0
				}
			}
		})
	})
)(StartCouncilButton);
