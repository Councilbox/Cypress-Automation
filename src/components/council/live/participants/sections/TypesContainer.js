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
import TypeIcon from "../TypeIcon";
import AddGuestModal from "../AddGuestModal";

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
		if (this.state.typeStatus || this.state.typeStatus === 0) {
			variables.typeStatus = this.state.typeStatus;
		} else {
			variables.typeStatus = null;
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
			</React.Fragment>
		);
	};

	filterOnlySigned = () => {
		this.props.data.refetch({
			variables: {
				filters: [{
					field: 'signed',
					text: 1
				}]
			}
		})
	}

	render() {
		const { addGuest, updateState, council, translate } = this.props;
		const { refetch } = this.props.data;
		const { filterText, filterField } = this.state;
		const fields = this._getFilters();

		if (!this.props.data.liveParticipantsType) {
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
				<div style={{ height: '3em', padding: "0 8px", width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
					<div style={{display: 'flex', alignItems: 'center'}}>
						{this.props.addGuestButton()}
					</div>
					<div onClick={this.filterOnlySigned} style={{width: '2em', height: '2em', borderRadius: '1em', backgroundColor: 'green'}}>

					</div>
					<div onClick={this.filterOnlyNotSigned} style={{width: '2em', height: '2em', borderRadius: '1em', backgroundColor: 'blue'}}>

					</div>
					<div style={{display: 'flex'}}>
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
					</div>
				</div>
				<div
					style={{
						height: `calc(100% - 3em - ${'3.5em'})`,
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
						refetch={this.props.data.refetch}
						translate={this.props.translate}
						editParticipant={this.props.editParticipant}
						mode={"TYPE"}
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
				signed
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
