import React from "react";
import {
	LoadingSection,
	Grid,
	Icon,
	SelectInput,
	MenuItem,
	GridItem,
	BasicButton,
	TextInput
} from "../../../../../displayComponents";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import {
	PARTICIPANTS_LIMITS,
	PARTICIPANT_STATES
} from "../../../../../constants";
import { getSecondary } from "../../../../../styles/colors";
import withWindowSize from "../../../../../HOCs/withWindowSize";
import ParticipantsList from "../ParticipantsList";
import StateIcon from "../StateIcon";
import AddGuestModal from "../AddGuestModal";


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
			</React.Fragment>
		);
	};

	render() {
		const { addGuest, updateState, council, translate, orientation } = this.props;
		const { refetch } = this.props.data;
		const { filterText, filterField } = this.state;
		const fields = this._getFilters();
		const secondary = getSecondary();

		if (!this.props.data.liveParticipantsAttendance) {
			return <LoadingSection />;
		}

		return (
			<React.Fragment>
				<div
					style={{
						minHeight: "3em",
						maxHeight: '6em',
						overflow: "hidden"
					}}
				>
					{this._renderHeader()}
				</div>
				<Grid style={{ padding: "0 8px", width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
					<GridItem xs={orientation === 'landscape'? 2 : 6} md={3} lg={3} style={{display: 'flex', alignItems: 'center', height: '3.5em'}}>
						{this.props.addGuestButton()}
					</GridItem>
					<GridItem xs={orientation === 'landscape'? 4 : 6} md={3} lg={3} style={{display: 'flex', justifyContent: orientation === 'landscape'? 'flex-start' : 'flex-end'}}>
						<BasicButton
							text={this.state.onlyNotSigned? 'Mostrar todos' : 'Mostrar sin firmar'}//TRADUCCION
							color='white'
							type="flat"
							textStyle={{color: secondary, fontWeight: '700', border: `1px solid ${secondary}`}}
							onClick={this.toggleOnlyNotSigned}
						/>
					</GridItem>
					<GridItem xs={orientation === 'landscape'? 6 : 12} md={6} lg={6} style={{display: 'flex', height: '4em', alignItems: 'center', justifyContent: orientation === 'portrait'? 'space-between' : 'flex-end'}}>
						<div
							style={{
								maxWidth: "12em"
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
						<div
							style={{
								marginLeft: "0.8em",
								width: '10em'
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
					</GridItem>
				</Grid>
				<div
					style={{
						height: `calc(100% - 3em - ${'3.5em'})`,
						padding: "0 1vw",
						overflow: "hidden"
					}}
				>
					<ParticipantsList
						loadMore={this.loadMore}
						refetch={this.props.data.refetch}
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
				<AddGuestModal
					show={addGuest}
					council={council}
					refetch={refetch}
					requestClose={() => updateState({ addGuest: false })}
					translate={translate}
				/>
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
				signed
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
})(withWindowSize(AttendanceContainer));
