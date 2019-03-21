import React from "react";
import {
	LoadingSection,
	Grid,
	GridItem,
	Icon,
	SelectInput,
	BasicButton,
	ButtonIcon,
	CharSelector,
	MenuItem,
	TextInput
} from "../../../../../displayComponents";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { Tooltip } from 'material-ui';
import { isMobile } from 'react-device-detect';
import {
	PARTICIPANTS_LIMITS,
	PARTICIPANT_STATES
} from "../../../../../constants";
import { getSecondary } from "../../../../../styles/colors";
import withWindowSize from "../../../../../HOCs/withWindowSize";
import ParticipantsList from "../ParticipantsList";
import StateIcon from "../StateIcon";
import AddGuestModal from "../AddGuestModal";
import { useOldState } from "../../../../../hooks";

const selectedStyle = {
	borderBottom: `3px solid ${getSecondary()}`,
	color: getSecondary(),
	fontWeight: '700'
}


const StatesContainer = ({ translate, council, orientation, ...props }) => {
	const [state, setState] = useOldState({
		stateStatus: null,
		filterText: "",
		charFilter: null,
		addGuest: false,
		onlyNotSigned: false,
		filterField: "fullName",
		status: null
	});

	React.useEffect(() => {
		refresh();
	}, [state.charFilter, state.stateStatus, state.filterField, state.onlyNotSigned])


	const secondary = getSecondary();

	let header = null;
	let timeout = null;

	const _getFilters = () => {
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

	const _renderAddGuestButton = () => {
		return (
			<Tooltip title="ALT + G">
				<div>
					<BasicButton
						text={isMobile? translate.invite_guest : translate.add_guest}
						color={"white"}
						textStyle={{
							color: secondary,
							fontWeight: "700",
							fontSize: "0.9em",
							textTransform: "none",
						}}
						textPosition="after"
						type="flat"
						icon={<ButtonIcon type="add" color={secondary} />}
						onClick={() => setState({ addGuest: true })}
						buttonStyle={{
							marginRight: "1em",
							border: `1px solid ${secondary}`,
						}}
					/>
				</div>
			</Tooltip>
		)
	}


	const toggleCharFilter = char => {
		setState({
			charFilter: char === state.charFilter? null : char
		});
	}

	const setStateStatus = newValue => {
		setState({ stateStatus: newValue });
		refresh();
	};

	const updateFilterField = value => {
		setState({
			filterField: value
		});
	};


	const updateFilterText = async value => {
		setState({
			filterText: value
		});

		clearTimeout(timeout);
		timeout = setTimeout(() => refresh(), 450);
	};

	const refresh = () => {
		console.log('se refresca');
		let variables = {
			filters: []
		};

		if (state.stateStatus || state.stateStatus === 0) {
			variables.stateStatus = state.stateStatus;
		} else {
			variables.stateStatus = null;
		}

		variables.options = {
			limit: props.limit,
			offset: 0
		}

		if (state.filterText) {
			variables.filters = [
				...variables.filters,
				{ field: state.filterField, text: state.filterText }
			];
		}

		if(state.onlyNotSigned){
			variables.filters = [
				...variables.filters,
				{ field: 'signed', text: 0}
			];
		}

		if(state.charFilter){
			variables.filters = [
				...variables.filters,
				{ field: 'surname', text: state.charFilter}
			]
		}

		props.data.refetch(variables);
	};

	const loadMore = () => {
		const currentLength = props.data.liveParticipantsState.list.length;
		props.setLimit(currentLength + 24);
	};

	const toggleOnlyNotSigned = () => {
		setState({
			onlyNotSigned: !state.onlyNotSigned
		})
	}

	const _renderHeader = () => {
		let { stateRecount } = props.data;
		return (
			<React.Fragment>
				<Grid
					style={{
						width: "100%",
						minHeight: "3em",
						borderBottom: "1px solid gainsboro",
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						paddingLeft: "1.5em",
						paddingRight: "2.5em",
						margin: 0
					}}
				>
					<div
						onClick={() => {
							setStateStatus(null);
						}}
						style={{
							cursor: "pointer",
							...(state.stateStatus === null?
								selectedStyle
							:
								{}
							)
						}}
					>
						<StateIcon
							color={state.stateStatus === null? getSecondary() : 'grey'}
							translate={translate}
							state={"ALL"}
							number={stateRecount.all}
						/>
					</div>
					<div
						onClick={() => {
							setStateStatus(
								PARTICIPANT_STATES.NO_PARTICIPATE
							);
						}}
						style={{
							cursor: "pointer",
							...(state.stateStatus === PARTICIPANT_STATES.NO_PARTICIPATE?
								selectedStyle
							:
								{}
							)
						}}
					>
						<StateIcon
							color={state.stateStatus === PARTICIPANT_STATES.NO_PARTICIPATE? getSecondary() : 'grey'}
							translate={translate}
							state={PARTICIPANT_STATES.NO_PARTICIPATE}
							number={stateRecount.noParticipate}
						/>
					</div>
					<div
						onClick={() => {
							setStateStatus(PARTICIPANT_STATES.REMOTE);
						}}
						style={{
							cursor: "pointer",
							...(state.stateStatus === PARTICIPANT_STATES.REMOTE?
								selectedStyle
							:
								{}
							)
						}}
					>
						<StateIcon
							color={state.stateStatus === PARTICIPANT_STATES.REMOTE? getSecondary() : 'grey'}
							translate={translate}
							state={PARTICIPANT_STATES.REMOTE}
							number={stateRecount.remote}
						/>
					</div>
					<div
						onClick={() => {
							setStateStatus(
								PARTICIPANT_STATES.PHYSICALLY_PRESENT
							);
						}}
						style={{
							cursor: "pointer",
							...(state.stateStatus === PARTICIPANT_STATES.PHYSICALLY_PRESENT?
								selectedStyle
							:
								{}
							)
						}}
					>
						<StateIcon
							color={state.stateStatus === PARTICIPANT_STATES.PHYSICALLY_PRESENT? getSecondary() : 'grey'}
							translate={translate}
							state={PARTICIPANT_STATES.PHYSICALLY_PRESENT}
							number={stateRecount.present}
						/>
					</div>
					<div
						onClick={() => {
							setStateStatus(
								PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE
							);
						}}
						style={{
							cursor: "pointer",
							...(state.stateStatus === PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE?
								selectedStyle
							:
								{}
							)
						}}
					>
						<StateIcon
							translate={translate}
							color={state.stateStatus === PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE? getSecondary() : 'grey'}
							state={PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE}
							number={stateRecount.presentWithElectronicVote}
						/>
					</div>
					<div
						onClick={() => {
							setStateStatus(PARTICIPANT_STATES.DELEGATED);
						}}
						style={{
							cursor: "pointer",
							...(state.stateStatus === PARTICIPANT_STATES.DELEGATED?
								selectedStyle
							:
								{}
							)
						}}
					>
						<StateIcon
							translate={translate}
							color={state.stateStatus === PARTICIPANT_STATES.DELEGATED? getSecondary() : 'grey'}
							state={PARTICIPANT_STATES.DELEGATED}
							number={stateRecount.delegated}
						/>
					</div>
					<div
						onClick={() => {
							setStateStatus(
								PARTICIPANT_STATES.REPRESENTATED
							);
						}}
						style={{
							cursor: "pointer",
							...(state.stateStatus === PARTICIPANT_STATES.REPRESENTATED?
								selectedStyle
							:
								{}
							)
						}}
					>
						<StateIcon
							translate={translate}
							color={state.stateStatus === PARTICIPANT_STATES.REPRESENTATED? getSecondary() : 'grey'}
							state={PARTICIPANT_STATES.REPRESENTATED}
							number={stateRecount.representated}
						/>
					</div>
				</Grid>
			</React.Fragment>
		);
	};


	const { filterText, filterField } = state;
	const fields = _getFilters();

	if (!props.data.liveParticipantsState) {
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
				{_renderHeader()}
			</div>
			<Grid style={{ padding: "0 8px", width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
				<GridItem xs={orientation === 'landscape'? 2 : 6} md={3} lg={3} style={{display: 'flex', alignItems: 'center', height: '3.5em'}}>
					{_renderAddGuestButton()}
				</GridItem>
				<GridItem xs={orientation === 'landscape'? 4 : 6} md={3} lg={3} style={{display: 'flex', justifyContent: orientation === 'landscape'? 'flex-start' : 'flex-end'}}>
					<BasicButton
						text={state.onlyNotSigned? translate.show_all : translate.show_unsigned}
						color='white'
						type="flat"
						textStyle={{color: secondary, fontWeight: '700', border: `1px solid ${secondary}`}}
						onClick={toggleOnlyNotSigned}
					/>
				</GridItem>
				<GridItem xs={orientation === 'landscape'? 6 : 12} md={6} lg={6} style={{display: 'flex', height: '4em', alignItems: 'center', justifyContent: orientation === 'portrait'? 'space-between' : 'flex-end'}}>
					{orientation === 'landscape' && isMobile &&
						<CharSelector
							onClick={toggleCharFilter}
							translate={translate}
							selectedChar={state.charFilter}
						/>
					}
					<div
						style={{
							maxWidth: "12em"
						}}
					>
						<SelectInput
							// floatingText={translate.filter_by}
							value={filterField}
							onChange={event =>
								updateFilterField(event.target.value)
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
								updateFilterText(event.target.value);
							}}
						/>
					</div>
				</GridItem>
			</Grid>
			<div
				style={{
					height: `calc(100% - 3em - ${isMobile && orientation === 'portrait'? '8em' : `${props.menuOpen? '6.5' : '3.5'}em`} )`,
					overflow: "hidden",
					display: 'flex',
				}}
			>
				{(!isMobile || orientation !== 'landscape') &&
					<CharSelector
						onClick={toggleCharFilter}
						translate={translate}
						selectedChar={state.charFilter}
					/>
				}
				<ParticipantsList
					loadMore={loadMore}
					loading={props.data.loading}
					loadingMore={props.data.loading}
					renderHeader={_renderHeader}
					refetch={refresh}
					participants={props.data.liveParticipantsState}
					layout={props.layout}
					council={council}
					translate={translate}
					editParticipant={props.editParticipant}
					mode={"STATES"}
				/>
			</div>
			<AddGuestModal
				show={state.addGuest}
				council={council}
				refetch={refresh}
				requestClose={() => setState({ addGuest: false })}
				translate={translate}
			/>
		</React.Fragment>
	)
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
				personOrEntity
				position
				email
				phone
				dni
				type
				signed
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
				limit: props.limit,
				offset: 0
			},
			pollInterval: 7000,
			fetchPolicy: 'network-only'
		}
	})
})(withWindowSize(StatesContainer));
