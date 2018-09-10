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
	PARTICIPANT_TYPE
} from "../../../../../constants";
import ParticipantsList from "../ParticipantsList";
import { getSecondary } from "../../../../../styles/colors";
import TypeIcon from "../TypeIcon";

class TypesContainer extends React.Component {
	state = {
		typeStatus: null,
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

	settypeStatus = newValue => {
		this.setState({ typeStatus: newValue }, () => this.refresh());
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
		const currentLength = this.props.data.liveParticipantsType.list.length;

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
					liveParticipantsType: {
						...prev.liveParticipantsType,
						list: [
							...prev.liveParticipantsType.list,
							...fetchMoreResult.liveParticipantsType.list
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
		if (this.state.typeStatus) {
			variables.typeStatus = this.state.typeStatus;
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
		let { participantTypeRecount } = this.props.data;
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
					<div
						onClick={() => {
							this.settypeStatus(null);
						}}
						style={{
							cursor: "pointer",
							backgroundColor:
								this.state.typeStatus === null && "lightGrey"
						}}
					>
						<TypeIcon
							translate={translate}
							type={"ALL"}
							number={participantTypeRecount.all}
						/>
					</div>
					<div
						onClick={() => {
							this.settypeStatus(PARTICIPANT_TYPE.PARTICIPANT);
						}}
						style={{
							cursor: "pointer",
							backgroundColor:
								this.state.typeStatus ===
									PARTICIPANT_TYPE.PARTICIPANT && "lightGrey"
						}}
					>
						<TypeIcon
							translate={translate}
							type={PARTICIPANT_TYPE.PARTICIPANT}
							number={participantTypeRecount.participant}
						/>
					</div>
					<div
						onClick={() => {
							this.settypeStatus(PARTICIPANT_TYPE.GUEST);
						}}
						style={{
							cursor: "pointer",
							backgroundColor:
								this.state.typeStatus ===
									PARTICIPANT_TYPE.GUEST && "lightGrey"
						}}
					>
						<TypeIcon
							translate={translate}
							type={PARTICIPANT_TYPE.GUEST}
							number={participantTypeRecount.guest}
						/>
					</div>
					<div
						onClick={() => {
							this.settypeStatus(PARTICIPANT_TYPE.REPRESENTATIVE);
						}}
						style={{
							cursor: "pointer",
							backgroundColor:
								this.state.typeStatus ===
									PARTICIPANT_TYPE.REPRESENTATIVE &&
								"lightGrey"
						}}
					>
						<TypeIcon
							translate={translate}
							type={PARTICIPANT_TYPE.REPRESENTATIVE}
							number={participantTypeRecount.representative}
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
		if (!this.props.data.participantTypeRecount) {
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
						participants={this.props.data.liveParticipantsType}
						layout={this.props.layout}
						council={this.props.council}
						translate={this.props.translate}
						editParticipant={this.props.editParticipant}
						mode={"TYPE"}
					/>
				</div>
			</React.Fragment>
		);
	}
}

const query = gql`
	query liveParticipantsType(
		$councilId: Int!
		$filters: [FilterInput]
		$typeStatus: Int
		$options: OptionsInput
	) {
		liveParticipantsType(
			councilId: $councilId
			filters: $filters
			typeStatus: $typeStatus
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
		participantTypeRecount(councilId: $councilId) {
			all
			participant
			representative
			guest
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
})(TypesContainer);
