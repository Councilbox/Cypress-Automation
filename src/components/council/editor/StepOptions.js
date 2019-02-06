import React from "react";
import { MenuItem, Typography } from "material-ui";
import {
	BasicButton,
	ButtonIcon,
	Checkbox,
	DateTimePicker,
	LoadingSection,
	MajorityInput,
	Radio,
	AlertConfirm,
	SectionTitle,
	SelectInput,
	TextInput
} from "../../../displayComponents";
import { councilStepFive, updateCouncil } from "../../../queries";
import { checkValidMajority } from '../../../utils/validation';
import { compose, graphql } from "react-apollo";
import { getPrimary, getSecondary } from "../../../styles/colors";
import * as CBX from "../../../utils/CBX";
import withWindowSize from '../../../HOCs/withWindowSize';
import EditorStepLayout from './EditorStepLayout';
import { moment } from '../../../containers/App';
let primary = getPrimary();
let secondary = getSecondary();


class StepOptions extends React.Component {
	state = {
		data: {},
		loading: false,
		majorityAlert: false,
		alertText: '',
		success: false,
		errors: {
			confirmAssistance: "",
			actPointMajorityDivider: -1
		}
	};

	componentDidMount() {
		this.props.data.refetch();
	}

	componentDidUpdate(){
		primary = getPrimary();
		secondary = getSecondary();
	}

	static getDerivedStateFromProps(nextProps, prevState){
		primary = getPrimary();
		if (!nextProps.data.loading) {
			if(!prevState.data.council){
				return {
					data: {
						council: {
							...nextProps.data.council,
							...prevState.data.council
						}
					}
				};
			}
		}

		return null;
	}

	updateCouncil = async step => {
		this.setState({
			loading: true
		});
		const { __typename, statute, platform, ...council } = this.state.data.council;
		await this.props.updateCouncil({
			variables: {
				council: {
					...council,
					sendPointsMode: !CBX.councilHasVideo({councilType: council.councilType})? 0 : 1,
					closeDate: !!council.closeDate? council.closeDate : moment(new Date(council.dateStart)).add(15, 'm'),
					step: step
				}
			}
		});

		this.setState({
			loading: false,
			success: true
		});
	};

	resetButtonStates = () => {
		this.setState({
			loading: false,
			success: false
		});
	}

	nextPage = () => {
		if (!this.checkRequiredFields()) {
			this.updateCouncil(6);
			this.props.nextStep();
		}
	};

	checkRequiredFields = () => {
		const { council } = this.state.data;

		if(council.approveActDraft === 1){
			const response = checkValidMajority(council.actPointMajority, council.actPointMajorityDivider, council.actPointMajorityType);
			if(response.error){
				this.setState({
					majorityAlert: true,
					alertText: response.message
				});
			}

			return response.error;
		}

		return false;
	}

	previousPage = () => {
		if (true) {
			this.updateCouncil(5);
			this.props.previousStep();
		}
	};

	updateCouncilData(data) {
		this.setState({
			...this.state,
			data: {
				council: {
					...this.state.data.council,
					...data
				}
			}
		});
	}

	_renderNumberInput() {
		const { council } = this.state.data;
		return (
			<div className="row" style={{padding: '1.1em'}}>
				<div style={{ width: "3em" }}>
					<TextInput
						type={"number"}
						errorText={this.state.errors.actPointMajority}
						value={council.actPointMajority}
						onChange={event =>
							this.updateCouncilData({
								actPointMajority: event.nativeEvent.target.value
							})
						}
					/>
				</div>
				<div
					style={{
						display: "flex",
						alignItems: "center"
					}}
				>
					{council.actPointMajorityType === 0 && (
						<span
							style={{
								color: "white",
								padding: "0.5em",
								backgroundColor: primary,
								marginRight: "1em"
							}}
						>
							%
						</span>
					)}
					{council.actPointMajorityType === 5 && (
						<span
							style={{
								color: "white",
								padding: "0.5em",
								backgroundColor: primary,
								marginRight: "1em"
							}}
						>
							/
						</span>
					)}
				</div>
				<div style={{ width: "3em" }}>
					{council.actPointMajorityType === 5 && (
						<TextInput
							type={"number"}
							errorText={
								this.state.errors.act_point_majority_divider
							}
							value={council.actPointMajorityDivider}
							onChange={event =>
								this.updateCouncilData({
									actPointMajorityDivider:
										event.nativeEvent.target.value
								})
							}
						/>
					)}
				</div>
			</div>
		);
	}

	_renderSecurityForm() {
		const { council } = this.state.data;
		const { translate } = this.props;

		return (
			<React.Fragment>
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
				<br />
				{CBX.showUserUniqueKeyMessage(council) && (
					<Typography>
						{translate.key_autogenerated_by_participant}
					</Typography>
				)}
			</React.Fragment>
		);
	}

	render() {
		const { translate } = this.props;
		const { council } = this.state.data;
		const primary = getPrimary();
		let statute = {}

		if(!this.props.data.loading){
			statute = this.props.data.council.statute;
		}

		return (
			<EditorStepLayout
				body={
					<React.Fragment>
						{this.props.data.loading?
							<div
								style={{
									height: "300px",
									width: "100%",
									display: "flex",
									alignItems: "center",
									justifyContent: "center"
								}}
							>
								<LoadingSection />
							</div>
						:
							<React.Fragment>
								<SectionTitle
									text={translate.confirm_assistance}
									color={primary}
								/>
								<Checkbox
									label={translate.confirm_assistance_desc}
									value={council.confirmAssistance === 1}
									onChange={(event, isInputChecked) =>
										this.updateCouncilData({
											confirmAssistance: isInputChecked ? 1 : 0
										})
									}
								/>
								<SectionTitle
									text={translate.video}
									color={primary}
									style={{
										marginTop: '1.6em'
									}}
								/>
								<Checkbox
									label={translate.room_video_broadcast}
									value={council.councilType === 0}
									onChange={(event, isInputChecked) =>
										this.updateCouncilData({
											councilType: isInputChecked ? 0 : 1,
											autoClose: 0,
											fullVideoRecord: 0
										})
									}
								/>
									<Checkbox
										disabled={council.councilType !== 0}
										label={translate.full_video_record}
										value={council.fullVideoRecord !== 0}
										onChange={(event, isInputChecked) =>
											this.updateCouncilData({
												fullVideoRecord: isInputChecked ? 1 : 0
											})
										}
									/>

							<div style={{display: 'flex'}}>
								<Checkbox
									disabled={council.councilType === 0}
									label={translate.auto_close}
									value={council.autoClose !== 0}
									onChange={(event, isInputChecked) =>
										this.updateCouncilData({
											autoClose: isInputChecked ? 1 : 0
										})
									}
								/>
								{council.autoClose === 1 &&
									<div style={{maxWidth: '18em', marginLeft: '0.9em'}}>
										<DateTimePicker
											required
											minDate={moment(new Date(council.dateStart)).add(1, 'm')}
											onChange={date => {
												const newDate = new Date(date);
												const dateString = newDate.toISOString();
												this.updateCouncilData({
													closeDate: dateString
												})
											}}
											minDateMessage={""}
											acceptText={translate.accept}
											cancelText={translate.cancel}
											value={!!council.closeDate? council.closeDate : moment(new Date(council.dateStart)).add(15, 'm')}
										/>
									</div>
								}
								</div>
								<SectionTitle
									text={translate.security}
									color={primary}
									style={{
										marginTop: '1.6em'
									}}
								/>
								{this._renderSecurityForm()}

								{CBX.hasAct(statute) && (
									<React.Fragment>
										<SectionTitle
											text={translate.approve_act_draft_at_end}
											color={primary}
											style={{marginTop: '2em'}}
										/>
										<div
											style={{
												display: 'flex',
												flexDirection: this.props.windowSize === 'xs'? 'column' : 'row',
												alignItems:  this.props.windowSize === 'xs'? 'flex-start' : 'center',
											}}
										>
											<div style={{paddingTop: '12px'}}>
												<Checkbox
													label={translate.approve_act_draft_at_end_desc}
													value={council.approveActDraft !== 0}
													onChange={(event, isInputChecked) =>
														this.updateCouncilData({
															approveActDraft: isInputChecked ? 1 : 0
														})
													}
												/>
											</div>
											{council.approveActDraft === 1 && (
												<div>
													<div style={{display: 'flex', flexDirection: 'row', marginLeft: '1.1em', alignItems: 'center'}}>
														<div>
															<SelectInput
																floatingLabelText={
																	translate.majority_label
																}
																value={council.actPointMajorityType}
																onChange={event => {
																	this.updateCouncilData({
																		actPointMajorityType:
																			event.target.value
																	});
																}}
															>
																{this.props.data.majorityTypes.map(
																	majority => {
																		return (
																			<MenuItem
																				value={majority.value}
																				key={`majority${
																					majority.value
																				}`}
																			>
																				{
																					translate[
																						majority.label
																					]
																				}
																			</MenuItem>
																		);
																	}
																)}
															</SelectInput>
														</div>
														<div style={{display: 'flex', alignItems: 'center'}}>
															{CBX.majorityNeedsInput(
																council.actPointMajorityType
															) && (
																<MajorityInput
																	type={council.actPointMajorityType}
																	style={{ marginLeft: "1em" }}
																	value={council.actPointMajority}
																	divider={
																		council.actPointMajorityDivider
																	}
																	mayori
																	onChange={value =>
																		this.updateCouncilData({
																			actPointMajority: +value
																		})
																	}
																	onChangeDivider={value =>
																		this.updateCouncilData({
																			actPointMajorityDivider: +value
																		})
																	}
																/>
															)}
														</div>
													</div>
												</div>
											)}
										</div>
									</React.Fragment>
								)}
								<AlertConfirm
									open={this.state.majorityAlert}
									title={'Error'}
									buttonAccept={translate.accept}
									bodyText={this.state.alertText}
									acceptAction={() => this.setState({majorityAlert: false})}
								/>
							</React.Fragment>
						}
					</React.Fragment>
				}
				buttons={
					<React.Fragment>
						<BasicButton
							text={translate.previous}
							color={secondary}
							disable={this.props.data.loading}
							textStyle={{
								color: "white",
								fontWeight: "700",
								fontSize: "0.9em",
								textTransform: "none"
							}}
							textPosition="after"
							onClick={this.previousPage}
						/>
						<BasicButton
							text={translate.save}
							reset={this.resetButtonStates}
							color={secondary}
							success={this.state.success}
							loading={this.state.loading}
							disable={this.props.data.loading}
							textStyle={{
								color: "white",
								fontWeight: "700",
								marginLeft: "0.5em",
								marginRight: "0.5em",
								fontSize: "0.9em",
								textTransform: "none"
							}}
							icon={<ButtonIcon type="save" color="white" />}
							textPosition="after"
							onClick={() => this.updateCouncil(5)}
						/>
						<BasicButton
							text={translate.next}
							color={primary}
							disable={this.props.data.loading}
							textStyle={{
								color: "white",
								fontWeight: "700",
								fontSize: "0.9em",
								textTransform: "none"
							}}
							textPosition="after"
							onClick={this.nextPage}
						/>
					</React.Fragment>
				}
			/>
		);
	}
}

export default compose(
	graphql(councilStepFive, {
		name: "data",
		options: props => ({
			variables: {
				id: props.councilID
			},
			notifyOnNetworkStatusChange: true,
			fetchPolicy: 'network-only'
		})
	}),

	graphql(updateCouncil, {
		name: "updateCouncil"
	})
)(withWindowSize(StepOptions));
