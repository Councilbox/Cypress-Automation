import React from "react";
import {
	LoadingSection,
	Grid,
	Icon,
	GridItem,
	SelectInput,
	MenuItem,
	TextInput,
	BasicButton,
	ButtonIcon,
	LiveToast
} from "../../../../../displayComponents";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import {
	PARTICIPANTS_LIMITS,
	EMAIL_TRACK_STATES
} from "../../../../../constants";
import ParticipantsList from "../ParticipantsList";
import { Tooltip } from "material-ui";
import EmailIcon from "../EmailIcon";
import { toast } from "react-toastify";
import { updateCredentialsSends } from "../../../../../queries";
import AddGuestModal from "../AddGuestModal";
import withWindowSize from "../../../../../HOCs/withWindowSize";
import { getSecondary } from "../../../../../styles/colors";



class CredentialsContainer extends React.Component {
	state = {
		notificationStatus: null,
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

	setnotificationStatus = newValue => {
		this.setState({ notificationStatus: newValue }, () => this.refresh());
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

	refreshEmailStates = async () => {
		this.setState({
			refreshing: true
		});
		const response = await this.props.updateCredentialsSends({
			variables: {
				councilId: this.props.council.id
			}
		});

		if (response) {
			this.setState({ refreshing: false });
			if (!response.data.updateCredentialsSends.success) {
				toast(<LiveToast message={this.props.translate.err_saved} />, {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: true,
					className: "errorToast"
				});
			} else {
				this.refresh();
			}
		}
	};

	loadMore = () => {
		const currentLength = this.props.data.liveParticipantsCredentials.list
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
					liveParticipantsCredentials: {
						...prev.liveParticipantsCredentials,
						list: [
							...prev.liveParticipantsCredentials.list,
							...fetchMoreResult.liveParticipantsCredentials.list
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

		if (this.state.notificationStatus || this.state.stateStatus === 0) {
			variables.notificationStatus = this.state.notificationStatus;
		} else {
			variables.notificationStatus = null;
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
		let { crendentialSendRecount } = this.props.data;
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
							this.setnotificationStatus(null);
						}}
						style={{
							cursor: "pointer",
							backgroundColor:
								this.state.notificationStatus === null &&
								"lightGrey"
						}}
					>
						<EmailIcon
							translate={translate}
							reqCode={"ALL"}
							number={crendentialSendRecount.all}
						/>
					</div>
					<div
						onClick={() => {
							this.setnotificationStatus(
								EMAIL_TRACK_STATES.FAILED
							);
						}}
						style={{
							cursor: "pointer",
							backgroundColor:
								this.state.notificationStatus ===
								EMAIL_TRACK_STATES.FAILED && "lightGrey"
						}}
					>
						<EmailIcon
							translate={translate}
							reqCode={EMAIL_TRACK_STATES.FAILED}
							number={crendentialSendRecount.failed}
						/>
					</div>
					<div
						onClick={() => {
							this.setnotificationStatus(
								EMAIL_TRACK_STATES.NOT_SENT
							);
						}}
						style={{
							cursor: "pointer",
							backgroundColor:
								this.state.notificationStatus ===
								EMAIL_TRACK_STATES.NOT_SENT && "lightGrey"
						}}
					>
						<EmailIcon
							translate={translate}
							reqCode={EMAIL_TRACK_STATES.NOT_SENT}
							number={crendentialSendRecount.notSend}
						/>
					</div>
					<div
						onClick={() => {
							this.setnotificationStatus(
								EMAIL_TRACK_STATES.INVALID_EMAIL_ADDRESS
							);
						}}
						style={{
							cursor: "pointer",
							backgroundColor:
								this.state.notificationStatus ===
								EMAIL_TRACK_STATES.INVALID_EMAIL_ADDRESS &&
								"lightGrey"
						}}
					>
						<EmailIcon
							translate={translate}
							reqCode={EMAIL_TRACK_STATES.INVALID_EMAIL_ADDRESS}
							number={crendentialSendRecount.invalidAddress}
						/>
					</div>
					<div
						onClick={() => {
							this.setnotificationStatus(EMAIL_TRACK_STATES.SPAM);
						}}
						style={{
							cursor: "pointer",
							backgroundColor:
								this.state.notificationStatus ===
								EMAIL_TRACK_STATES.SPAM && "lightGrey"
						}}
					>
						<EmailIcon
							translate={translate}
							reqCode={EMAIL_TRACK_STATES.SPAM}
							number={crendentialSendRecount.spam}
						/>
					</div>
					<div
						onClick={() => {
							this.setnotificationStatus(
								EMAIL_TRACK_STATES.PENDING_SHIPPING
							);
						}}
						style={{
							cursor: "pointer",
							backgroundColor:
								this.state.notificationStatus ===
								EMAIL_TRACK_STATES.PENDING_SHIPPING &&
								"lightGrey"
						}}
					>
						<EmailIcon
							translate={translate}
							reqCode={EMAIL_TRACK_STATES.PENDING_SHIPPING}
							number={crendentialSendRecount.pendingShipping}
						/>
					</div>
					<div
						onClick={() => {
							this.setnotificationStatus(
								EMAIL_TRACK_STATES.DELIVERED
							);
						}}
						style={{
							cursor: "pointer",
							backgroundColor:
								this.state.notificationStatus ===
								EMAIL_TRACK_STATES.DELIVERED && "lightGrey"
						}}
					>
						<EmailIcon
							translate={translate}
							reqCode={EMAIL_TRACK_STATES.DELIVERED}
							number={crendentialSendRecount.delivered}
						/>
					</div>
					<div
						onClick={() => {
							this.setnotificationStatus(
								EMAIL_TRACK_STATES.OPENED
							);
						}}
						style={{
							cursor: "pointer",
							backgroundColor:
								this.state.notificationStatus ===
								EMAIL_TRACK_STATES.OPENED && "lightGrey"
						}}
					>
						<EmailIcon
							translate={translate}
							reqCode={EMAIL_TRACK_STATES.OPENED}
							number={crendentialSendRecount.opened}
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

		if (!this.props.data.liveParticipantsCredentials) {
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
						loading={this.props.data.loading}
						loadingMore={this.state.loadingMore}
						renderHeader={this._renderHeader}
						refetch={this.props.data.refetch}
						participants={
							this.props.data.liveParticipantsCredentials
						}
						layout={this.props.layout}
						council={this.props.council}
						translate={this.props.translate}
						editParticipant={this.props.editParticipant}
						mode={"CREDENTIALS"}
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
	query liveParticipantsCredentials(
		$councilId: Int!
		$filters: [FilterInput]
		$notificationStatus: Int
		$options: OptionsInput
	) {
		liveParticipantsCredentials(
			councilId: $councilId
			filters: $filters
			notificationStatus: $notificationStatus
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
				sendCredentials {
					reqCode
				}
			}
			total
		}
		crendentialSendRecount(councilId: $councilId) {
			all
			failed
			notSend
			invalidAddress
			spam
			pendingShipping
			delivered
			opened
		}
	}
`;

export default compose(
	graphql(query, {
		options: props => ({
			variables: {
				councilId: props.council.id,
				options: {
					limit: PARTICIPANTS_LIMITS[0],
					offset: 0
				}
			}
		})
	}),
	graphql(updateCredentialsSends, {
		name: "updateCredentialsSends"
	})
)(withWindowSize(CredentialsContainer));
