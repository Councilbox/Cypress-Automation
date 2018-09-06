import React from "react";
import {
	LoadingSection,
	Grid,
	Icon,
	SelectInput,
	MenuItem,
	TextInput
} from "../../../../../displayComponents";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { PARTICIPANTS_LIMITS, PARTICIPANT_STATES } from "../../../../../constants";
import ParticipantsList from "../ParticipantsList";
import { Tooltip } from "material-ui";
import { getSecondary } from "../../../../../styles/colors";
import FontAwesome from "react-fontawesome";
import StateIcon from "../StateIcon";



const PARTICIPANTS_DEFINITION = {
	'STATES': 'liveParticipantsState',
	'CONVENE': 'liveParticipantsConvene',
	'CREDENTIALS': 'liveParticipantsCredentials',
	'ATTENDANCE': 'liveParticipantsAttendance',
	'TYPE': 'liveParticipantsType',
};

const STATUS_DEFINITION = {
	'STATES': 'stateStatus',
	'CONVENE': 'notificationStatus',
	'CREDENTIALS': 'notificationStatus',
	'ATTENDANCE': 'attendanceStatus',
	'TYPE': 'typeStatus',
};

class StatesContainer extends React.Component {
	state = {
		stateStatus: null,
		filterText: "",
		filterField: "fullName",
		status: null
	};

	_getFilters = () => {
		const translate = this.props.translate;
		return [
			{
				value: "fullName",
				translation: translate.participant_data
			},
			{
				value: "dni",
				translation: translate.dni
			},
			{
				value: "position",
				translation: translate.position
			}
		];
	};

	setStateStatus = newValue => {
		this.setState({ stateStatus: newValue }, () => this.refresh());
	};

	updateFilterField = value => {
		this.setState(
			{
				filterField: value
			},
			() => this.refresh()
		);
	};

	updateFilterText = async value => {
		this.setState({
			filterText: value
		});

		clearTimeout(this.timeout);
		this.timeout = setTimeout(() => this.refresh(), 450);
	};

	loadMore = () => {
		const currentLength = this.props.data.liveParticipantsState.list.length;

		this.setState({
			loadingMore: true
		});

		this.props.data.fetchMore({
			variables: {
				options: {
					offset: currentLength,
					limit: PARTICIPANTS_LIMITS[0]
				}
			},
			updateQuery: (prev, { fetchMoreResult }) => {
				if (!fetchMoreResult) {
					return prev;
				}
				this.setState({
					loadingMore: false
				});

				return {
					...prev,
					liveParticipantsState: {
						...prev.liveParticipantsState,
						list: [
							...prev.liveParticipantsState.list,
							...fetchMoreResult.liveParticipantsState.list
						]
					}
				};
			}
		});
	};

	refresh = () => {
		let variables = {
			filters: []
		};
		if (this.state.status) {
			variables.stateStatus = this.state.stateStatus;
		}

		if (this.state.filterText) {
			variables.filters = [
				...variables.filters,
				{ field: this.state.filterField, text: this.state.filterText }
			];
		}

		this.props.data.refetch(variables);
	};

	_renderHeader = () => {
		let { stateRecount } = this.props.data;
		let { translate } = this.props;
		const secondary = getSecondary();
		const { filterText, filterField } = this.state;
		const fields = this._getFilters();
		return (
			<React.Fragment>
				<Grid
					spacing={0}
					xs={12}
					lg={12}
					md={12}
					style={{
						backgroundColor: "whiteSmoke",
						width: "100%",
						height: "3em",
						borderBottom: "1px solid gainsboro",
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						paddingLeft: "1.5em",
						paddingRight: "2.5em"
					}}
				>
					<div onClick={()=>{this.setStateStatus(null)}} style={{backgroundColor: this.state.stateStatus === null && 'lightGrey'}}>
						<StateIcon translate={translate} state={'ALL'} number={stateRecount.all} />
					</div>
					<div>
						<StateIcon translate={translate} state={PARTICIPANT_STATES.NO_PARTICIPATE} number={stateRecount.noParticipate} />
					</div>
					<div>
						<StateIcon translate={translate} state={PARTICIPANT_STATES.REMOTE} number={stateRecount.remote} />
					</div>
					<div>
						<StateIcon translate={translate} state={PARTICIPANT_STATES.PHYSICALLY_PRESENT} number={stateRecount.present} />
					</div>
					<div>
						<StateIcon translate={translate} state={PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE} number={stateRecount.presentWithElectronicVote} />
					</div>
					<div>
						<StateIcon translate={translate} state={PARTICIPANT_STATES.DELEGATED} number={stateRecount.delegated} />
					</div>
					<div>
						<StateIcon translate={translate} state={PARTICIPANT_STATES.REPRESENTATED} number={stateRecount.representated} />
					</div>
				</Grid>
				<div style={{ padding: "0 8px", marginTop: "-8px" }}>
					<div
						style={{
							width: "33%",
							marginLeft: "0.8em",
							float: "right"
						}}
					>
						<TextInput
							adornment={<Icon>search</Icon>}
							floatingText={" "}
							type="text"
							value={filterText}
							onChange={event => {
								this.updateFilterText(event.target.value);
							}}
						/>
					</div>
					<div
						style={{
							width: "33%",
							maxWidth: "12em",
							float: "right"
						}}
					>
						<SelectInput
							// floatingText={translate.filter_by}
							value={filterField}
							onChange={event =>
								this.updateFilterField(event.target.value)
							}
						>
							{fields.map(field => (
								<MenuItem
									key={`field_${field.value}`}
									value={field.value}
								>
									{field.translation}
								</MenuItem>
							))}
						</SelectInput>
					</div>
					{/* {
						(mode === 'CONVENE' || mode === 'CREDENTIALS') &&
						<div style={{ width: '33%', maxWidth: '12em', float: 'right', marginTop: '12px' }}>
							<Tooltip
								title={
									translate.tooltip_refresh_convene_email_state_assistance
								}
							>
								<BasicButton
									floatRight
									text={translate.refresh_convened}
									color={getSecondary()}
									buttonStyle={{
										margin: "0",
										marginRight: '0.8em',
										paddingTop: '6px',
										paddingBottom: '6px'
									}}
									textStyle={{
										color: "white",
										fontWeight: "700",
										fontSize: "0.9em",
										textTransform: "none"
									}}
									icon={
										<ButtonIcon
											color="white"
											type="refresh"
										/>
									}
									textPosition="after"
									onClick={() =>
										this.props.refreshEmailStates()
									}
								/>
							</Tooltip>
						</div>
					} */}
				</div>
			</React.Fragment>
		);
	};

	render() {
		if (!this.props.data.stateRecount) {
			return <LoadingSection />;
		}

		return (
			<React.Fragment>
				<div
					style={{
						height: "6em",
						overflow: "hidden"
					}}
				>
					{this._renderHeader()}
				</div>
				<div style={{
					height: "calc(100% - 6em)",
					padding: '0 1vw',
					overflow: "hidden"
				}}>
					<ParticipantsList
						loadMore={this.loadMore}
						loading={this.props.data.loading}
						loadingMore={this.state.loadingMore}
						renderHeader={this._renderHeader}
						participants={this.props.data.liveParticipantsState}
						layout={this.props.layout}
						council={this.props.council}
						translate={this.props.translate}
						editParticipant={this.props.editParticipant}
						mode={"STATES"}
					/>
				</div>
			</React.Fragment>
		);
	}
}

const query = gql`
	query liveParticipantsState(
		$councilId: Int!
		$filters: [FilterInput]
		$stateStatus: Int
		$options: OptionsInput
	) {
		liveParticipantsState(
			councilId: $councilId
			filters: $filters
			stateStatus: $stateStatus
			options: $options
		) {
			list {
				id
				state
				councilId
				name
				position
				email
				phone
				dni
				type
				online
				requestWord
				numParticipations
				surname
			}
			total
		}
		stateRecount(councilId: $councilId) {
			all
			remote
			remoteOffline
			remoteOnline
			present
			presentWithElectronicVote
			delegated
			representated
			noParticipate
		}
	}
`;

export default graphql(query, {
	options: props => ({
		variables: {
			councilId: props.council.id,
			options: {
				limit: PARTICIPANTS_LIMITS[0],
				offset: 0
			}
		}
	})
})(StatesContainer);
