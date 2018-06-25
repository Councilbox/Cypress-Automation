import React from "react";
import { Grid, GridItem, FilterButton } from "../../../displayComponents";
import { EMAIL_STATES_FILTERS } from "../../../constants";
import * as CBX from "../../../utils/CBX";

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
				notificationStatus: code
			});
			this.setState({
				selectedFilter: code
			});
		}
	};

	_renderFilterIcon = value => {
		const { selectedFilter } = this.state;
		const { translate } = this.props;

		return (
			<FilterButton
				key={`emailFilter_${value}`}
				onClick={() => this.changeFilter(value)}
				active={selectedFilter === value}
				tooltip={translate[CBX.getTranslationReqCode(value)]}
			>
				<img
					src={CBX.getEmailIconByReqCode(value)}
					alt={value}
					style={{
						width: "25px",
						height: "auto"
					}}
				/>
			</FilterButton>
		);
	};

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
				</GridItem>
			</Grid>
		);
	}
}

export default NotificationFilters;
