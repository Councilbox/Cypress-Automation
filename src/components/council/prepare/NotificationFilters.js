import React from "react";
import { Grid, GridItem, FilterButton } from "../../../displayComponents";
import { EMAIL_STATES_FILTERS, PARTICIPANT_STATES, COUNCIL_TYPES } from "../../../constants";
import * as CBX from "../../../utils/CBX";
import { getPrimary } from "../../../styles/colors";

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
			this.setState({
				selectedFilter: code
			});
			if (code === 37) {
				code = '37, 39, 40'
			}
			refetch({
				attendanceIntention: null,
				notificationStatus: `${code}`
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
						width: "100%",
						maxWidth: "22px",
						height: "auto",
						display: 'flex',
						alignContent: 'center',
						justifyContent: 'center'
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
				{CBX.getAttendanceIntentionIcon(value, { width: "24px", height: "auto", color: primary, display: 'flex',
						alignContent: 'center',
						justifyContent: 'center' })}

			</FilterButton>
		);
	}

	render() {
		const { translate, council } = this.props;
		
		const intentionStates = [
			PARTICIPANT_STATES.REMOTE,
			PARTICIPANT_STATES.PHYSICALLY_PRESENT,
			PARTICIPANT_STATES.DELEGATED,
		]

		if(council.state.canEarlyVote && council.councilType !== COUNCIL_TYPES.BOARD_WITHOUT_SESSION){
			intentionStates.push(PARTICIPANT_STATES.EARLY_VOTE);
		}

		if(council.councilType === COUNCIL_TYPES.BOARD_WITHOUT_SESSION){
			intentionStates.push(PARTICIPANT_STATES.SENT_VOTE_LETTER);
		}

		intentionStates.push(PARTICIPANT_STATES.NO_PARTICIPATE);

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
					{CBX.councilHasAssistanceConfirmation(council) &&
						intentionStates.map(intention => (
							this._renderIntentionIcon(intention)
						))
					}
				</GridItem>
			</Grid>
		);
	}
}

export default NotificationFilters;
