import React from "react";
import { councilOfficials } from "../../../../queries";
import { compose, graphql } from "react-apollo";
import {
	AlertConfirm,
	BasicButton,
	Grid,
	GridItem,
	Icon,
	LoadingSection,
	ParticipantRow,
	TextInput,
	Scrollbar
} from "../../../../displayComponents";
import { getPrimary } from "../../../../styles/colors";
import { DELEGATION_USERS_LOAD } from "../../../../constants";
import { Typography } from "material-ui";
import { existsQualityVote } from "../../../../utils/CBX";
import ConveneSelector from "../ConveneSelector";
import { startCouncil } from "../../../../queries/council";
import { useOldState } from "../../../../hooks";

const buttonStyle = primary => ({
	backgroundColor: "white",
	border: `solid 1px ${primary}`,
	color: primary,
	cursor: 'pointer',
	borderRadius: '2px'
});


const StartCouncilButton = ({ council, translate, data, ...props }) => {
	const [state, setState] = useOldState({
		alert: false,
		selecting: 0,
		loading: false,
		data: {
			firstOrSecondConvene: council.firstOrSecondConvene,
			neededQuorum: 2,
			president: "",
			presidentId: ""
		},
		errors: {
			president: "",
			secretary: "",
			qualityVote: ""
		}
	});
	const primary = getPrimary();

	const startCouncil = async () => {
		if (!checkRequiredFields()) {
			setState({
				loading: true
			});
			const { refetch, startCouncil } = props;
			const {
				presidentId,
				secretaryId,
				qualityVoteId,
				firstOrSecondConvene
			} = state.data;
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
				await refetch();
			}
		}
	}

	const checkRequiredFields = () => {
		let hasError = false;
		let errors = {
			president: "",
			secretary: "",
			qualityVote: ""
		};

		if (!state.data.president) {
			hasError = true;
			errors.president = true;
		}

		if (!state.data.secretary) {
			hasError = true;
			errors.secretary = true;
		}

		if (existsQualityVote(council.statute)) {
			if (!state.data.qualityVoteName) {
				hasError = true;
				errors.qualityVote = true;
			}
		}

		setState({
			errors
		});

		return hasError;
	}

	const actionSwitch = () => {
		const actions = {
			'1': (id, name) => {
				setState({
					data: {
						...state.data,
						president: name,
						presidentId: id
					},
					selecting: 0
				});
			},
			'2': (id, name) => {
				setState({
					data: {
						...state.data,
						secretary: name,
						secretaryId: id
					},
					selecting: 0
				});
			},
			'3': (id, name) => {
				setState({
					data: {
						...state.data,
						qualityVoteName: name,
						qualityVoteId: id
					},
					selecting: 0
				});
			}
		}

		return actions[state.selecting];
	}

	const changeConvene = value => {
		setState({
			data: {
				...state.data,
				firstOrSecondConvene: value
			}
		});
	};

	const loadMore = () => {
		data.fetchMore({
			variables: {
				options: {
					offset: data.councilOfficials.list.length,
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
	}

	const updateFilterText = text => {
		data.refetch({
			filters: [{
				field: 'fullName',
				text: text
			}]
		});
	}

	const _startCouncilForm = () => {
		const { loading } = data;

		const participants = loading ? [] : data.councilOfficials.list;
		const { total } = loading ? 0 : data.councilOfficials;
		const rest = total - participants.length - 1;

		if (state.selecting !== 0) {
			return (
				<div style={{ width: "600px" }}>
					<TextInput
						adornment={<Icon>search</Icon>}
						floatingText={" "}
						type="text"
						value={state.filterText}
						onChange={event => {
							updateFilterText(event.target.value);
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
									<div style={{padding: '0.2em'}}>
										{participants.map(participant => (
											<ParticipantRow
												participant={participant}
												key={`participant_${
													participant.id
												}`}
												onClick={() =>
													actionSwitch()(
														participant.id,
														`${participant.name} ${
															participant.surname
														}`
													)
												}
											/>
										))}
										{participants.length < total - 1 && (
											<div onClick={loadMore} style={{
												display: 'flex',
												alignItems: 'center',
												padding: '0.45em',
												marginTop: '0.5em',
												cursor: 'pointer',
												justifyContent: 'center',
												border: '1px solid gainsboro'
											}} className="withShadow">
												{`Descargar ${
													rest > DELEGATION_USERS_LOAD
														? `${DELEGATION_USERS_LOAD} de ${rest} restantes`
														: translate.all_plural.toLowerCase()
												}`}
											</div>
										)}
									</div>
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
					<button
						style={buttonStyle(primary)}
						onClick={() => setState({ selecting: 1 })}
					>
						{translate.select_president}
					</button>
				</GridItem>
				<GridItem xs={5} md={5} lg={5}>
					{!!state.data.president ? (
						state.data.president
					) : (
						<span
							style={{
								color: state.errors.president
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
					<button
						style={buttonStyle(primary)}
						onClick={() => setState({ selecting: 2 })}
					>
						{translate.select_secretary}
					</button>
				</GridItem>
				<GridItem xs={5} md={5} lg={5}>
					{!!state.data.secretary ? (
						state.data.secretary
					) : (
						<span
							style={{
								color: state.errors.secretary
									? "red"
									: "inherit"
							}}
						>
							{translate.not_selected}
						</span>
					)}
				</GridItem>

				{existsQualityVote(council.statute) && (
					<React.Fragment>
						<GridItem xs={3} md={3} lg={3}>
							{translate.quality_vote}
						</GridItem>
						<GridItem xs={4} md={4} lg={4}>
							<button
								style={buttonStyle(primary)}
								onClick={() => setState({ selecting: 3 })}
							>
								{translate.select_quality_vote}
							</button>
						</GridItem>
						<GridItem xs={5} md={5} lg={5}>
							{!!state.data.qualityVoteName ? (
								state.data.qualityVoteName
							) : (
								<span
									style={{
										color: state.errors.qualityVote
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
					council={council}
					translate={translate}
					convene={state.data.firstOrSecondConvene}
					changeConvene={changeConvene}
					recount={props.recount}
				/>
			</Grid>
		);
	}

	if (!data.councilOfficials) {
		return <LoadingSection />;
	}

	return (
		<React.Fragment>
			<BasicButton
				text={translate.start_council}
				color={primary}
				textPosition="before"
				onClick={() =>
					setState({
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
					fontSize: "0.9em",
					fontWeight: "700",
					textTransform: "none"
				}}
			/>
			<AlertConfirm
				title={translate.start_council}
				bodyText={_startCouncilForm()}
				open={state.alert}
				loadingAction={state.loading}
				buttonAccept={translate.accept}
				buttonCancel={translate.cancel}
				hideAccept={state.selecting !== 0}
				modal={true}
				acceptAction={startCouncil}
				requestClose={
					state.selecting === 0
						? () => setState({ alert: false })
						: () => setState({ selecting: 0 })
				}
			/>
		</React.Fragment>
	)
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
