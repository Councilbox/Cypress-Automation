import React from "react";
import {
	AlertConfirm,
	DateTimePicker,
	Grid,
	GridItem,
	Icon
} from "../../../../displayComponents/index";
import { Typography } from "material-ui";
import { graphql } from "react-apollo";
import { rescheduleCouncil } from "../../../../queries/council";
import * as CBX from "../../../../utils/CBX";
import { moment } from '../../../../containers/App';


class RescheduleModal extends React.Component {
	state = {
		success: "",
		error: "",
		sendAgenda: false,
		dateStart: this.props.council.dateStart,
		dateStart2NdCall: this.props.council.dateStart2NdCall || null,
		error2NdCall: ""
	};


	close = () => {
		this.props.requestClose();
		this.setState({
			success: false,
			sending: false,
			error: false,
			unsavedChanges: false,
			error2NdCall: ""
		});
	};

	rescheduleCouncil = async () => {
		this.setState({
			sending: true
		});
		const response = await this.props.rescheduleCouncil({
			variables: {
				councilId: this.props.council.id,
				dateStart: new Date(this.state.dateStart).toISOString(),
				dateStart2NdCall: new Date(
					this.state.dateStart2NdCall
				).toISOString(),
				timezone: moment().utcOffset()
			}
		});
		if (response.data.rescheduleCouncil.success) {
			this.setState({
				sending: false,
				success: true,
				unsavedChanges: false
			});
		} else {
			this.setState({
				sending: false,
				error: true
			});
		}
	};

	updateState = object => {
		this.setState({
			...object,
			unsavedChanges: true
		});
	};

	updateDate = (
		firstDate = this.state.dateStart,
		secondDate = this.state.dateStart2NdCall
	) => {
		const { translate } = this.props;
		this.updateState({
			dateStart: firstDate,
			dateStart2NdCall: secondDate
		});
		if (!CBX.checkSecondDateAfterFirst(firstDate, secondDate)) {
			this.updateState({
				error2NdCall: translate["2nd_call_date_changed"]
			});
			this.updateState({
				dateStart: firstDate,
				dateStart2NdCall: CBX.addMinimumDistance(
					firstDate,
					this.props.council.statute
				)
			});
		} else {
			if (
				!CBX.checkMinimumDistanceBetweenCalls(
					firstDate,
					secondDate,
					this.props.council.statute
				)
			) {
				this.updateState({
					error2NdCall: translate.new_statutes_hours_warning.replace(
						"{{hours}}",
						this.props.council.statute.minimumSeparationBetweenCall
					)
				});
			}
		}
	};

	_renderReminderBody() {
		const { translate, council } = this.props;

		if (this.state.sending) {
			return <div>{translate.rescheduling_council}</div>;
		}

		if (this.state.success) {
			return (
				<SuccessMessage
					message={translate.council_rescheduled_successfully}
				/>
			);
		}

		return (
			<Grid style={{ width: "450px" }}>
				<GridItem xs={12} lg={12} md={12}>
					<DateTimePicker
						required
						minDate={new Date()}
						onChange={date => {
							const newDate = new Date(date);
							const dateString = newDate.toISOString();
							this.updateDate(dateString);
						}}
						minDateMessage={""}
						acceptText={translate.accept}
						cancelText={translate.cancel}
						label={translate["1st_call_date"]}
						value={this.state.dateStart}
					/>
				</GridItem>

				{CBX.hasSecondCall(council.statute) && (
					<GridItem
						xs={12}
						lg={12}
						md={12}
						style={{ paddingTop: "0.6em" }}
					>
						<DateTimePicker
							required
							minDate={
								!!this.state.dateStart
									? new Date(this.state.dateStart)
									: new Date()
							}
							errorText={this.state.error2NdCall}
							onChange={date => {
								const newDate = new Date(date);
								const dateString = newDate.toISOString();
								this.updateDate(undefined, dateString);
							}}
							minDateMessage={""}
							acceptText={translate.accept}
							cancelText={translate.cancel}
							label={translate["2nd_call_date"]}
							value={this.state.dateStart2NdCall}
						/>
					</GridItem>
				)}
			</Grid>
		);
	}

	render() {
		const { translate } = this.props;

		return (
			<AlertConfirm
				requestClose={this.close}
				loadingAction={this.state.sending}
				open={this.props.show}
				{...(this.state.unsavedChanges
					? {
							acceptAction: this.state.success
								? () => this.close()
								: this.rescheduleCouncil,
							buttonAccept: this.state.success
								? translate.accept
								: translate.send
					  }
					: {})}
				buttonCancel={translate.close}
				bodyText={this._renderReminderBody()}
				title={translate.reschedule_council}
			/>
		);
	}
}

export default graphql(rescheduleCouncil, {
	name: "rescheduleCouncil"
})(RescheduleModal);

const SuccessMessage = ({ message }) => (
	<div
		style={{
			width: "500px",
			display: "flex",
			alignItems: "center",
			alignContent: "center",
			flexDirection: "column"
		}}
	>
		<Icon
			className="material-icons"
			style={{
				fontSize: "6em",
				color: "green"
			}}
		>
			check_circle
		</Icon>
		<Typography variant="subheading">{message}</Typography>
	</div>
);
