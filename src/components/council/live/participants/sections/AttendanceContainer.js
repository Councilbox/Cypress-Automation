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
import {
	PARTICIPANTS_LIMITS,
	PARTICIPANT_STATES
} from "../../../../../constants";
import ParticipantsList from "../ParticipantsList";
import StateIcon from "../StateIcon";


class AttendanceContainer extends React.Component {
	state = {
		attendanceStatus: null,
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

	setattendanceStatus = newValue => {
		this.setState({ attendanceStatus: newValue }, () => this.refresh());
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
		const currentLength = this.props.data.liveParticipantsAttendance.list
			.length;

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
					liveParticipantsAttendance: {
						...prev.liveParticipantsAttendance,
						list: [
							...prev.liveParticipantsAttendance.list,
							...fetchMoreResult.liveParticipantsAttendance.list
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
		if (this.state.attendanceStatus) {
			variables.attendanceStatus = this.state.attendanceStatus;
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
		let { attendanceRecount } = this.props.data;
		let { translate } = this.props;
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
					<div
						onClick={() => {
							this.setattendanceStatus(null);
						}}
						style={{
							cursor: "pointer",
							backgroundColor:
								this.state.attendanceStatus === null &&
								"lightGrey"
						}}
					>
						<StateIcon
							translate={translate}
							state={"ALL"}
							number={attendanceRecount.all}
						/>
					</div>
					<div
						onClick={() => {
							this.setattendanceStatus(-1);
						}}
						style={{
							cursor: "pointer",
							backgroundColor:
								this.state.attendanceStatus === -1 &&
								"lightGrey"
						}}
					>
						<StateIcon
							translate={translate}
							state={null}
							number={attendanceRecount.notConfirmed}
						/>
					</div>
					<div
						onClick={() => {
							this.setattendanceStatus(
								PARTICIPANT_STATES.NO_PARTICIPATE
							);
						}}
						style={{
							cursor: "pointer",
							backgroundColor:
								this.state.attendanceStatus ===
								PARTICIPANT_STATES.NO_PARTICIPATE &&
								"lightGrey"
						}}
					>
						<StateIcon
							translate={translate}
							state={PARTICIPANT_STATES.NO_PARTICIPATE}
							number={attendanceRecount.noParticipate}
						/>
					</div>
					<div
						onClick={() => {
							this.setattendanceStatus(PARTICIPANT_STATES.REMOTE);
						}}
						style={{
							cursor: "pointer",
							backgroundColor:
								this.state.attendanceStatus ===
								PARTICIPANT_STATES.REMOTE && "lightGrey"
						}}
					>
						<StateIcon
							translate={translate}
							state={PARTICIPANT_STATES.REMOTE}
							number={attendanceRecount.remote}
						/>
					</div>
					<div
						onClick={() => {
							this.setattendanceStatus(
								PARTICIPANT_STATES.PHYSICALLY_PRESENT
							);
						}}
						style={{
							cursor: "pointer",
							backgroundColor:
								this.state.attendanceStatus ===
								PARTICIPANT_STATES.PHYSICALLY_PRESENT &&
								"lightGrey"
						}}
					>
						<StateIcon
							translate={translate}
							state={PARTICIPANT_STATES.PHYSICALLY_PRESENT}
							number={attendanceRecount.present}
						/>
					</div>
					{/* <div onClick={()=>{this.setattendanceStatus(PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE)}} style={{cursor: 'pointer', backgroundColor: this.state.attendanceStatus === PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE && 'lightGrey'}}>
						<StateIcon translate={translate} state={PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE} number={attendanceRecount.presentWithElectronicVote} />
					</div> */}
					<div
						onClick={() => {
							this.setattendanceStatus(
								PARTICIPANT_STATES.DELEGATED
							);
						}}
						style={{
							cursor: "pointer",
							backgroundColor:
								this.state.attendanceStatus ===
								PARTICIPANT_STATES.DELEGATED && "lightGrey"
						}}
					>
						<StateIcon
							translate={translate}
							state={PARTICIPANT_STATES.DELEGATED}
							number={attendanceRecount.delegated}
						/>
					</div>
					<div
						onClick={() => {
							this.setattendanceStatus(
								PARTICIPANT_STATES.REPRESENTATED
							);
						}}
						style={{
							cursor: "pointer",
							backgroundColor:
								this.state.attendanceStatus ===
								PARTICIPANT_STATES.REPRESENTATED &&
								"lightGrey"
						}}
					>
						<StateIcon
							translate={translate}
							state={PARTICIPANT_STATES.REPRESENTATED}
							number={attendanceRecount.representated}
						/>
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
				</div>
			</React.Fragment>
		);
	};

	render() {
		if (!this.props.data.attendanceRecount) {
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
				<div
					style={{
						height: "calc(100% - 6em)",
						padding: "0 1vw",
						overflow: "hidden"
					}}
				>
					<ParticipantsList
						loadMore={this.loadMore}
						loading={this.props.data.loading}
						loadingMore={this.state.loadingMore}
						renderHeader={this._renderHeader}
						participants={
							this.props.data.liveParticipantsAttendance
						}
						layout={this.props.layout}
						council={this.props.council}
						translate={this.props.translate}
						editParticipant={this.props.editParticipant}
						mode={"ATTENDANCE"}
					/>
				</div>
			</React.Fragment>
		);
	}
}

const query = gql`
	query liveParticipantsAttendance(
		$councilId: Int!
		$filters: [FilterInput]
		$attendanceStatus: Int
		$options: OptionsInput
	) {
		liveParticipantsAttendance(
			councilId: $councilId
			filters: $filters
			attendanceStatus: $attendanceStatus
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
				assistanceIntention
				assistanceComment
			}
			total
		}
		attendanceRecount(councilId: $councilId) {
			all
			notConfirmed
			remote
			present
			noParticipate
			delegated
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
})(AttendanceContainer);
