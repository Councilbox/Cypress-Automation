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

const StepOptions = ({ translate, data, ...props }) => {

	const [state, setState] = React.useState({
		data: {},
		loading: false,
		majorityAlert: false,
		alertText: '',
		success: false,
		errors: {
			confirmAssistance: "",
			actPointMajorityDivider: -1
		}
	});

	React.useEffect(() => {
		primary = getPrimary();
		secondary = getSecondary();
		if(!data.loading){
			if(!state.data.council){
				updateCouncilData(data.council);
			}
		}
	});
	const council = state.data.council;

	const updateCouncil = async step => {
		setState({
			...state,
			loading: true
		});
		const { __typename, statute, platform, ...council } = state.data.council;
		await props.updateCouncil({
			variables: {
				council: {
					...council,
					sendPointsMode: !CBX.councilHasVideo({councilType: council.councilType})? 0 : 1,
					closeDate: !!council.closeDate? council.closeDate : moment(new Date(council.dateStart)).add(15, 'm'),
					step: step
				}
			}
		});

		setState({
			...state,
			loading: false,
			success: true
		});
	};

	const resetButtonStates = () => {
		setState({
			...state,
			loading: false,
			success: false
		});
	}

	const checkRequiredFields = () => {
		if(council.approveActDraft === 1){
			const response = checkValidMajority(council.actPointMajority, council.actPointMajorityDivider, council.actPointMajorityType);
			if(response.error){
				setState({
					majorityAlert: true,
					alertText: response.message
				});
			}

			return response.error;
		}

		return false;
	}


	function updateCouncilData(data) {
		setState({
			...state,
			data: {
				council: {
					...state.data.council,
					...data
				}
			}
		});
	}


	const nextPage = () => {
		if (!checkRequiredFields()) {
			updateCouncil(6);
			props.nextStep();
		}
	};

	const previousPage = () => {
		updateCouncil(5);
		props.previousStep();
	};

	function _renderNumberInput() {
		const { council } = state.data;

		return (
			<div className="row" style={{padding: '1.1em'}}>
				<div style={{ width: "3em" }}>
					<TextInput
						type={"number"}
						errorText={state.errors.actPointMajority}
						value={council.actPointMajority}
						onChange={event =>
							updateCouncilData({
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
								state.errors.act_point_majority_divider
							}
							value={council.actPointMajorityDivider}
							onChange={event =>
								updateCouncilData({
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

	function _renderSecurityForm() {
		return (
			<React.Fragment>
				<Radio
					value={"0"}
					checked={council.securityType === 0}
					onChange={event =>
						updateCouncilData({
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
						updateCouncilData({
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
						updateCouncilData({
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
	console.log(council);

	return (
		<EditorStepLayout
			body={
				<React.Fragment>
					{data.loading || !council?
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
									updateCouncilData({
										confirmAssistance: isInputChecked ? 1 : 0
									})
								}
							/>
							{council.councilType === 2?
								<React.Fragment>
										<SectionTitle
										text={translate.auto_close}
										color={primary}
										style={{
											marginTop: '1.6em'
										}}
									/>

									<div style={{display: 'flex'}}>
										<Checkbox
											disabled={council.councilType === 0}
											label={translate.auto_close}
											value={council.autoClose !== 0}
											onChange={(event, isInputChecked) =>
												updateCouncilData({
													autoClose: isInputChecked ? 1 : 0
												})
											}
										/>
										{council.autoClose === 1 &&
											<div style={{width: '22em'}}>
												<DateTimePicker
													required
													minDate={moment(new Date(council.dateStart)).add(1, 'm')}
													onChange={date => {
														const newDate = new Date(date);
														const dateString = newDate.toISOString();
														updateCouncilData({
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
								</React.Fragment>
							:
								<React.Fragment>
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
											updateCouncilData({
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
											updateCouncilData({
												fullVideoRecord: isInputChecked ? 1 : 0
											})
										}
									/>
								</React.Fragment>
							}

							<SectionTitle
								text={translate.security}
								color={primary}
								style={{
									marginTop: '1.6em'
								}}
							/>
							{_renderSecurityForm()}

							{CBX.hasAct(council.statute) && (
								<React.Fragment>
									<SectionTitle
										text={translate.approve_act_draft_at_end}
										color={primary}
										style={{marginTop: '2em'}}
									/>
									<div
										style={{
											display: 'flex',
											flexDirection: props.windowSize === 'xs'? 'column' : 'row',
											alignItems:  props.windowSize === 'xs'? 'flex-start' : 'center',
										}}
									>
										<div style={{paddingTop: '12px'}}>
											<Checkbox
												label={translate.approve_act_draft_at_end_desc}
												value={council.approveActDraft !== 0}
												onChange={(event, isInputChecked) =>
													updateCouncilData({
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
																updateCouncilData({
																	actPointMajorityType:
																		event.target.value
																});
															}}
														>
															{data.majorityTypes.map(
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
																	updateCouncilData({
																		actPointMajority: +value
																	})
																}
																onChangeDivider={value =>
																	updateCouncilData({
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
								open={state.majorityAlert}
								title={'Error'}
								buttonAccept={translate.accept}
								bodyText={state.alertText}
								acceptAction={() => setState({
									...state,
									majorityAlert: false
								})}
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
						disable={data.loading}
						textStyle={{
							color: "white",
							fontWeight: "700",
							fontSize: "0.9em",
							textTransform: "none"
						}}
						textPosition="after"
						onClick={previousPage}
					/>
					<BasicButton
						text={translate.save}
						reset={resetButtonStates}
						color={secondary}
						success={state.success}
						loading={state.loading}
						disable={data.loading}
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
						onClick={() => updateCouncil(5)}
					/>
					<BasicButton
						text={translate.next}
						color={primary}
						disable={data.loading}
						textStyle={{
							color: "white",
							fontWeight: "700",
							fontSize: "0.9em",
							textTransform: "none"
						}}
						textPosition="after"
						onClick={nextPage}
					/>
				</React.Fragment>
			}
		/>
	);
}

/*
class StepOptions extends React.Component {
	state = {
		
	};

	componentDidMount() {
		data.refetch();
	}

	componentDidUpdate(){

	}





	

	render() {
		const {  } = props;
		const { council } = state.data;
		const primary = getPrimary();
		let statute = {}

		if(!data.loading){
			statute = data.council.statute;
		}

		
}
*/

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
