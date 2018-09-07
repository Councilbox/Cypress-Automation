import React from "react";
import {
	LoadingSection,
	Grid,
	Icon,
	SelectInput,
	MenuItem,
	TextInput,
	BasicButton,
	ButtonIcon
} from "../../../../../displayComponents";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { PARTICIPANTS_LIMITS, EMAIL_TRACK_STATES } from "../../../../../constants";
import ParticipantsList from "../ParticipantsList";
import { Tooltip } from "material-ui";
import { getSecondary } from "../../../../../styles/colors";
import FontAwesome from "react-fontawesome";
import EmailIcon from "../EmailIcon";



const PARTICIPANTS_DEFINITION = {
	'STATES': 'liveParticipantsCredentials',
	'CONVENE': 'liveParticipantsCredentials',
	'CREDENTIALS': 'liveParticipantsCredentials',
	'ATTENDANCE': 'liveParticipantsAttendance',
	'TYPE': 'liveParticipantsType',
};

const STATUS_DEFINITION = {
	'STATES': 'notificationStatus',
	'CONVENE': 'notificationStatus',
	'CREDENTIALS': 'notificationStatus',
	'ATTENDANCE': 'attendanceStatus',
	'TYPE': 'typeStatus',
};

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

	loadMore = () => {
		const currentLength = this.props.data.liveParticipantsCredentials.list.length;

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
		if (this.state.status) {
			variables.notificationStatus = this.state.notificationStatus;
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
		let { translate, mode } = this.props;
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
					<div onClick={() => { this.setnotificationStatus(null) }} style={{ backgroundColor: this.state.notificationStatus === null && 'lightGrey' }}>
						<EmailIcon translate={translate} reqCode={'ALL'} number={crendentialSendRecount.all} />
					</div>
					<div onClick={() => { this.setnotificationStatus(EMAIL_TRACK_STATES.FAILED) }} style={{ backgroundColor: this.state.notificationStatus === EMAIL_TRACK_STATES.FAILED && 'lightGrey' }}>
						<EmailIcon translate={translate} reqCode={EMAIL_TRACK_STATES.FAILED} number={crendentialSendRecount.failed} />
					</div>
					<div onClick={() => { this.setnotificationStatus(EMAIL_TRACK_STATES.NOT_SENT) }} style={{ backgroundColor: this.state.notificationStatus === EMAIL_TRACK_STATES.NOT_SENT && 'lightGrey' }}>
						<EmailIcon translate={translate} reqCode={EMAIL_TRACK_STATES.NOT_SENT} number={crendentialSendRecount.notSend} />
					</div>
					<div onClick={() => { this.setnotificationStatus(EMAIL_TRACK_STATES.INVALID_EMAIL_ADDRESS) }} style={{ backgroundColor: this.state.notificationStatus === EMAIL_TRACK_STATES.INVALID_EMAIL_ADDRESS && 'lightGrey' }}>
						<EmailIcon translate={translate} reqCode={EMAIL_TRACK_STATES.INVALID_EMAIL_ADDRESS} number={crendentialSendRecount.invalidAddress} />
					</div>
					<div onClick={() => { this.setnotificationStatus(EMAIL_TRACK_STATES.SPAM) }} style={{ backgroundColor: this.state.notificationStatus === EMAIL_TRACK_STATES.SPAM && 'lightGrey' }}>
						<EmailIcon translate={translate} reqCode={EMAIL_TRACK_STATES.SPAM} number={crendentialSendRecount.spam} />
					</div>
					<div onClick={() => { this.setnotificationStatus(EMAIL_TRACK_STATES.PENDING_SHIPPING) }} style={{ backgroundColor: this.state.notificationStatus === EMAIL_TRACK_STATES.PENDING_SHIPPING && 'lightGrey' }}>
						<EmailIcon translate={translate} reqCode={EMAIL_TRACK_STATES.PENDING_SHIPPING} number={crendentialSendRecount.pendingShipping} />
					</div>
					<div onClick={() => { this.setnotificationStatus(EMAIL_TRACK_STATES.DELIVERED) }} style={{ backgroundColor: this.state.notificationStatus === EMAIL_TRACK_STATES.DELIVERED && 'lightGrey' }}>
						<EmailIcon translate={translate} reqCode={EMAIL_TRACK_STATES.DELIVERED} number={crendentialSendRecount.delivered} />
					</div>
					<div onClick={() => { this.setnotificationStatus(EMAIL_TRACK_STATES.OPENED) }} style={{ backgroundColor: this.state.notificationStatus === EMAIL_TRACK_STATES.OPENED && 'lightGrey' }}>
						<EmailIcon translate={translate} reqCode={EMAIL_TRACK_STATES.OPENED} number={crendentialSendRecount.opened} />
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
				</div>
			</React.Fragment>
		);
	};

	render() {
		if (!this.props.data.crendentialSendRecount) {
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
						participants={this.props.data.liveParticipantsCredentials}
						layout={this.props.layout}
						council={this.props.council}
						translate={this.props.translate}
						editParticipant={this.props.editParticipant}
						mode={"CREDENTIALS"}
					/>
				</div>
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
				sendConvene{
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
})(CredentialsContainer);
