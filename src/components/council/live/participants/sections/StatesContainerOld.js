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

const selectedStyle = {
	borderBottom: `3px solid ${getSecondary()}`,
	color: getSecondary(),
	fontWeight: '700'
}



class StatesContainer extends React.Component {


	

	loadMore = () => {
		const currentLength = this.props.data.liveParticipantsState.list.length;
/* 
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
		}); */

		this.props.setLimit(currentLength + 24);
	};

	toggleOnlyNotSigned = () => {
		this.setState({
			onlyNotSigned: !this.state.onlyNotSigned
		}, () => this.refresh());
	}




	_renderHeader = () => {
		let { stateRecount } = this.props.data;
		let { translate } = this.props;

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
							this.setStateStatus(null);
						}}
						style={{
							cursor: "pointer",
							...(this.state.stateStatus === null?
								selectedStyle
							:
								{}
							)
						}}
					>
						<StateIcon
							color={this.state.stateStatus === null? getSecondary() : 'grey'}
							translate={translate}
							state={"ALL"}
							number={stateRecount.all}
						/>
					</div>
					<div
						onClick={() => {
							this.setStateStatus(
								PARTICIPANT_STATES.NO_PARTICIPATE
							);
						}}
						style={{
							cursor: "pointer",
							...(this.state.stateStatus === PARTICIPANT_STATES.NO_PARTICIPATE?
								selectedStyle
							:
								{}
							)
						}}
					>
						<StateIcon
							color={this.state.stateStatus === PARTICIPANT_STATES.NO_PARTICIPATE? getSecondary() : 'grey'}
							translate={translate}
							state={PARTICIPANT_STATES.NO_PARTICIPATE}
							number={stateRecount.noParticipate}
						/>
					</div>
					<div
						onClick={() => {
							this.setStateStatus(PARTICIPANT_STATES.REMOTE);
						}}
						style={{
							cursor: "pointer",
							...(this.state.stateStatus === PARTICIPANT_STATES.REMOTE?
								selectedStyle
							:
								{}
							)
						}}
					>
						<StateIcon
							color={this.state.stateStatus === PARTICIPANT_STATES.REMOTE? getSecondary() : 'grey'}
							translate={translate}
							state={PARTICIPANT_STATES.REMOTE}
							number={stateRecount.remote}
						/>
					</div>
					<div
						onClick={() => {
							this.setStateStatus(
								PARTICIPANT_STATES.PHYSICALLY_PRESENT
							);
						}}
						style={{
							cursor: "pointer",
							...(this.state.stateStatus === PARTICIPANT_STATES.PHYSICALLY_PRESENT?
								selectedStyle
							:
								{}
							)
						}}
					>
						<StateIcon
							color={this.state.stateStatus === PARTICIPANT_STATES.PHYSICALLY_PRESENT? getSecondary() : 'grey'}
							translate={translate}
							state={PARTICIPANT_STATES.PHYSICALLY_PRESENT}
							number={stateRecount.present}
						/>
					</div>
					<div
						onClick={() => {
							this.setStateStatus(
								PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE
							);
						}}
						style={{
							cursor: "pointer",
							...(this.state.stateStatus === PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE?
								selectedStyle
							:
								{}
							)
						}}
					>
						<StateIcon
							translate={translate}
							color={this.state.stateStatus === PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE? getSecondary() : 'grey'}
							state={PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE}
							number={stateRecount.presentWithElectronicVote}
						/>
					</div>
					<div
						onClick={() => {
							this.setStateStatus(PARTICIPANT_STATES.DELEGATED);
						}}
						style={{
							cursor: "pointer",
							...(this.state.stateStatus === PARTICIPANT_STATES.DELEGATED?
								selectedStyle
							:
								{}
							)
						}}
					>
						<StateIcon
							translate={translate}
							color={this.state.stateStatus === PARTICIPANT_STATES.DELEGATED? getSecondary() : 'grey'}
							state={PARTICIPANT_STATES.DELEGATED}
							number={stateRecount.delegated}
						/>
					</div>
					<div
						onClick={() => {
							this.setStateStatus(
								PARTICIPANT_STATES.REPRESENTATED
							);
						}}
						style={{
							cursor: "pointer",
							...(this.state.stateStatus === PARTICIPANT_STATES.REPRESENTATED?
								selectedStyle
							:
								{}
							)
						}}
					>
						<StateIcon
							translate={translate}
							color={this.state.stateStatus === PARTICIPANT_STATES.REPRESENTATED? getSecondary() : 'grey'}
							state={PARTICIPANT_STATES.REPRESENTATED}
							number={stateRecount.representated}
						/>
					</div>
				</Grid>
			</React.Fragment>
		);
	};

	render() {
		const { council, translate, orientation } = this.props;
		const { filterText, filterField } = this.state;
		const fields = this._getFilters();
		const secondary = getSecondary();

		if (!this.props.data.liveParticipantsState) {
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
						{this._renderAddGuestButton()}
					</GridItem>
					<GridItem xs={orientation === 'landscape'? 4 : 6} md={3} lg={3} style={{display: 'flex', justifyContent: orientation === 'landscape'? 'flex-start' : 'flex-end'}}>
						<BasicButton
							text={this.state.onlyNotSigned? translate.show_all : translate.show_unsigned}
							color='white'
							type="flat"
							textStyle={{color: secondary, fontWeight: '700', border: `1px solid ${secondary}`}}
							onClick={this.toggleOnlyNotSigned}
						/>
					</GridItem>
					<GridItem xs={orientation === 'landscape'? 6 : 12} md={6} lg={6} style={{display: 'flex', height: '4em', alignItems: 'center', justifyContent: orientation === 'portrait'? 'space-between' : 'flex-end'}}>
						{orientation === 'landscape' && isMobile &&
							<CharSelector
								onClick={this.toggleCharFilter}
								translate={translate}
								selectedChar={this.state.charFilter}
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
						height: `calc(100% - 3em - ${isMobile && orientation === 'portrait'? '8em' : `${this.props.menuOpen? '6.5' : '3.5'}em`} )`,
						overflow: "hidden",
						display: 'flex',
					}}
				>
					{(!isMobile || orientation !== 'landscape') &&
						<CharSelector
							onClick={this.toggleCharFilter}
							translate={translate}
							selectedChar={this.state.charFilter}
						/>
					}
					<ParticipantsList
						loadMore={this.loadMore}
						loading={this.props.data.loading}
						loadingMore={this.props.data.loading}
						renderHeader={this._renderHeader}
						refetch={this.refresh}
						participants={this.props.data.liveParticipantsState}
						layout={this.props.layout}
						council={this.props.council}
						translate={this.props.translate}
						editParticipant={this.props.editParticipant}
						mode={"STATES"}
					/>
				</div>
				<AddGuestModal
					show={this.state.addGuest}
					council={council}
					refetch={this.refresh}
					requestClose={() => this.setState({ addGuest: false })}
					translate={translate}
				/>
			</React.Fragment>
		);
	}
}