import React, { Component, Fragment } from "react";
import {
	BasicButton,
	ButtonIcon,
	Checkbox,
	DateTimePicker,
	ErrorAlert,
	LoadingSection,
	Radio,
	TextInput
} from "../../../displayComponents";
import RichTextInput from "../../../displayComponents/RichTextInput";
import { Typography } from "material-ui";
import { getPrimary } from "../../../styles/colors";
import { compose, graphql } from "react-apollo";
import { meetingStepOne, updateCouncil } from "../../../queries";

class MeetingEditorConfig extends Component {
	constructor(props) {
		super(props);
		this.state = {
			placeModal: false,
			alert: false,
			data: {
				dateStart: new Date().toISOString()
			},
			errors: {
				name: "",
				dateStart: "",
				conveneText: ""
			}
		};
	}

	componentDidMount() {
		this.props.data.refetch();
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.data.loading && !nextProps.data.loading) {
			this.setState({
				data: nextProps.data.council
			});
		}
	}
	nextPage = () => {
		if (!this.checkRequiredFields()) {
			this.updateCouncil();
			this.props.nextStep();
		}
	};

	updateCouncil = () => {
		const { __typename, ...council } = this.state.data;
		this.props.updateCouncil({
			variables: {
				council: {
					...council,
					step: this.props.actualStep > 1 ? this.props.actualStep : 1
				}
			}
		});
	};

	savePlaceAndClose = council => {
		this.setState({
			placeModal: false,
			data: {
				...this.state.data,
				...council
			}
		});
	};


	checkRequiredFields() {
		return false;
	}

	updateCouncilData(data) {
		this.setState({
			...this.state,
			data: {
				...this.state.data,
				...data
			}
		});
	}

	_renderSecurityForm() {
		const council = this.state.data;
		const { translate } = this.props;

		return (
			<Fragment>
				<Radio
					value={"0"}
					checked={council.securityType === 0}
					onChange={event =>
						this.updateCouncilData({
							securityType: parseInt(event.target.value, 10)
						})
					}
					name="security"
					label={translate.new_security_none}
				/>
				<Radio
					value={"1"}
					checked={council.securityType === 1}
					onChange={event =>
						this.updateCouncilData({
							securityType: parseInt(event.target.value, 10)
						})
					}
					name="security"
					label={translate.new_security_email}
				/>
				<Radio
					value={"2"}
					checked={council.securityType === 2}
					onChange={event =>
						this.updateCouncilData({
							securityType: parseInt(event.target.value, 10)
						})
					}
					name="security"
					label={translate.new_security_sms}
				/>
			</Fragment>
		);
	}

	render() {
		const { translate } = this.props;
		const { loading } = this.props.data;
		const council = this.state.data;
		const { errors } = this.state;

		if (loading) {
			return <LoadingSection />;
		}

		return (
			<div
				style={{
					width: "100%",
					height: "100%",
					padding: "2em"
				}}
			>
				<div className="row">
					<div className="col-lg-4 col-md-4 col-xs-6">
					<DateTimePicker
							required
							onChange={date => {
								const newDate = new Date(date);
								const dateString = newDate.toISOString();
								this.updateDate(dateString);
							}}
							minDateMessage={""}
							errorText={errors.dateStart}
							acceptText={translate.accept}
							cancelText={translate.cancel}
							label={translate["1st_call_date"]}
							value={council.dateStart}
						/>
					</div>
					<div className="col-lg-8 col-md-8 col-xs-6" />
					<div className="col-lg-6 col-md-6 col-xs-6">
						<TextInput
							floatingText={translate.convene_header}
							type="text"
							errorText={this.state.errors.name}
							value={council.name || ""}
							onChange={event =>
								this.setState({
									...this.state,
									data: {
										...this.state.data,
										name: event.nativeEvent.target.value
									}
								})
							}
						/>
					</div>
					<div
						className="col-lg-10 col-md-10 col-xs-12"
						style={{ margin: "0.7em 0.7em 0 0" }}
					>
						<RichTextInput
							errorText=""
							translate={translate}
							floatingText={translate.convene_info}
							value={council.conveneText || ""}
							onChange={value =>
								this.setState({
									...this.state,
									data: {
										...this.state.data,
										conveneText: value
									}
								})
							}
						/>
					</div>
				</div>
				<div>
					<Typography
						variant="subheading"
						style={{ marginTop: "2em" }}
					>
						{translate.video}
					</Typography>
					<Checkbox
						label={translate.full_video_record}
						value={council.fullVideoRecord !== 0}
						onChange={(event, isInputChecked) =>
							this.updateCouncilData({
								fullVideoRecord: isInputChecked ? 1 : 0
							})
						}
					/>
					<Typography
						variant="subheading"
						style={{ marginTop: "2em" }}
					>
						{translate.security}
					</Typography>
					{this._renderSecurityForm()}
				</div>

				<div
					style={{
						marginTop: "2em",
						width: "40%",
						float: "right",
						height: "3em"
					}}
				>
					<BasicButton
						text={translate.save}
						color={getPrimary()}
						textStyle={{
							color: "white",
							fontWeight: "700",
							fontSize: "0.9em",
							textTransform: "none",
							marginRight: "0.6em"
						}}
						icon={<ButtonIcon type="save" color="white" />}
						textPosition="after"
						onClick={this.updateCouncil}
					/>
					<BasicButton
						text={translate.next}
						color={getPrimary()}
						icon={<ButtonIcon type="arrow_forward" color="white" />}
						textStyle={{
							color: "white",
							fontWeight: "700",
							fontSize: "0.9em",
							textTransform: "none"
						}}
						textPosition="after"
						onClick={this.nextPage}
					/>
				</div>
				<ErrorAlert
					title={translate.error}
					bodyText={translate.check_form}
					buttonAccept={translate.accept}
					open={this.state.alert}
					requestClose={() => this.setState({ alert: false })}
				/>
			</div>
		);
	}
}

export default compose(
	graphql(meetingStepOne, {
		name: "data",
		options: props => ({
			variables: {
				id: props.councilID
			}
		})
	}),

	graphql(updateCouncil, {
		name: "updateCouncil"
	})
)(MeetingEditorConfig);
