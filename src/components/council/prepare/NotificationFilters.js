import React from "react";
import { Grid, GridItem, FilterButton } from "../../../displayComponents";
import { EMAIL_STATES_FILTERS, PARTICIPANT_STATES } from "../../../constants";
import * as CBX from "../../../utils/CBX";
import { getPrimary } from "../../../styles/colors";

const intentionStates = [
	PARTICIPANT_STATES.REMOTE,
	PARTICIPANT_STATES.PHYSICALLY_PRESENT,
	PARTICIPANT_STATES.DELEGATED,
	PARTICIPANT_STATES.EARLY_VOTE,
	PARTICIPANT_STATES.NO_PARTICIPATE
]

class NotificationFilters extends React.Component {
	state = {
		selectedFilter: ""
	};

	changeFilter = code => {
		const { refetch } = this.props;
		const { selectedFilter } = this.state;

		if (selectedFilter === code) {
			this.setState({
				selectedFilter: ""
			});
			refetch({
				notificationStatus: null
			});
		} else {
			refetch({
				attendanceIntention: null,
				notificationStatus: code
			});
			this.setState({
				selectedFilter: code
			});
		}
	};

	changeIntention = intention => {
		const { refetch } = this.props;
		const { selectedFilter } = this.state;

		if (selectedFilter === intention) {
			this.setState({
				selectedFilter: ""
			});
			refetch({
				attendanceIntention: null
			});
		} else {
			refetch({
				notificationStatus: null,
				attendanceIntention: intention
			});
			this.setState({
				selectedFilter: intention
			});
		}
	}

	_renderFilterIcon = value => {
		const { selectedFilter } = this.state;
		const { translate } = this.props;

		return (
			<FilterButton
				key={`intentionFilter_${value}`}
				onClick={() => this.changeFilter(value)}
				active={selectedFilter === value}
				tooltip={translate[CBX.getTranslationReqCode(value)]}
			>
				<img
					src={CBX.getEmailIconByReqCode(value)}
					alt={value}
					style={{
						width: "22px",
						height: "auto",
					}}
				/>
			</FilterButton>
		);
	};

	_renderIntentionIcon = value => {
		const { selectedFilter } = this.state;
		const { translate } = this.props;
		const primary = getPrimary();

		return (
			<FilterButton
				key={`emailFilter_${value}`}
				onClick={() => this.changeIntention(value)}
				active={selectedFilter === value}
				tooltip={translate[CBX.getAttendanceIntentionTooltip(value)]}
			>
				{CBX.getAttendanceIntentionIcon(value, {width: "24px", height: "auto", color: primary })}
				
			</FilterButton>
		);
	}

	render() {
		const { translate } = this.props;

		return (
			<Grid>
				<GridItem xs={4} md={9} lg={3} style={{ paddingTop: "0.6em" }}>
					{`${translate.filter_by}: `}
				</GridItem>
				<GridItem
					xs={8}
					md={9}
					lg={9}
					style={{
						display: "flex",
						flexDirection: "row"
					}}
				>
					{Object.keys(EMAIL_STATES_FILTERS).map(code =>
						this._renderFilterIcon(EMAIL_STATES_FILTERS[code])
					)}
					{intentionStates.map(intention => (
						this._renderIntentionIcon(intention)
					))}
				</GridItem>
			</Grid>
		);
	}
}

export default NotificationFilters;
