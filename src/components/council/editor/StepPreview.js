import React from 'react';
import { withRouter } from 'react-router-dom';
import { graphql, withApollo } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import {
	Icon, MenuItem, Paper, Typography
} from 'material-ui';
import FontAwesome from 'react-fontawesome';
import { toast } from 'react-toastify';
import {
	AlertConfirm,
	BasicButton,
	DropDownMenu,
	Grid,
	GridItem,
	LiveToast,
	LoadingSection,
	TextInput,
	SuccessMessage
} from '../../../displayComponents';
import { getPrimary, getSecondary } from '../../../styles/colors';
import {
	councilStepSix
} from '../../../queries';
import {
	conveneWithNotice as conveneWithNoticeMutation,
	conveneWithoutNotice as conveneWithoutNoticeMutation,
	sendConveneTest as sendConveneTestMutation,
	sendPreConvene as sendPreConveneMutation
} from '../../../queries/council';
import { bHistory, moment } from '../../../containers/App';
import * as CBX from '../../../utils/CBX';
import { checkValidEmail } from '../../../utils/validation';
import EditorStepLayout from './EditorStepLayout';

import { useOldState } from '../../../hooks';
import EditorStepper from './EditorStepper';


const StepPreview = ({
	translate, company, client, dateStart, step, ...props
}) => {
	const [loading, setLoading] = React.useState(false);
	const [fetchLoading, setFetchLoading] = React.useState(true);
	const [errors, setErrors] = React.useState({});
	const [data, setData] = React.useState({});
	const [state, setState] = useOldState({
		conveneTestModal: false,
		conveneTestSuccess: false,
		preConveneModal: false,
		preConveneSuccess: false,
		success: false,
		sendConveneWithoutNoticeModal: false,
		conveneWithoutNoticeSuccess: false,
		data: {
			conveneTestEmail: ''
		},

		errors: {
			conveneTestEmail: ''
		}
	});

	const primary = getPrimary();
	const secondary = getSecondary();

	const getData = React.useCallback(async () => {
		setFetchLoading(true);
		const response = await client.query({
			query: councilStepSix,
			variables: {
				id: props.councilID,
				timezone: moment(dateStart).utcOffset().toString()
			}
		});

		if (response.data) {
			setData(response.data);
		}

		setFetchLoading(false);
	}, [props.councilID]);

	React.useEffect(() => {
		getData();
	}, [getData]);

	const checkInvalidDates = () => {
		let hasError = false;
		const newErrors = {};
		const { council } = data;

		if (council.councilType === 2 || council.councilType === 3) {
			if (!council.dateStart) {
				hasError = true;
				newErrors.dateStart = {
					message: translate.required_field,
					action: () => props.goToPage(1)
				};
			}
			if (!council.closeDate) {
				hasError = true;
				newErrors.closeDate = {
					message: translate.required_field,
					action: () => props.goToPage(5)
				};
			}

			if (council.dateStart && council.closeDate) {
				if (CBX.checkSecondDateAfterFirst(council.dateStart, new Date())) {
					hasError = true;
					newErrors.dateStart = {
						message: 'La fecha de comienzo es posterior a la actual, por favor actualice el valor', // TRADUCCION
						action: () => props.goToPage(1)
					};
				}
				if (!CBX.checkSecondDateAfterFirst(council.dateStart, council.closeDate)) {
					hasError = true;
					newErrors.closeDate = {
						message: 'La fecha de fin no puede ser anterior a la de comienzo, por favor corrija ese valor', // TRADUCCION
						action: () => props.goToPage(5)
					};
				}
			}
		}

		setErrors(newErrors);

		return hasError;
	};

	const conveneWithNotice = async () => {
		const { __typename, selectedCensusId, ...council } = data.council;
		if (!checkInvalidDates()) {
			setLoading(true);
			const response = await props.conveneWithNotice({
				variables: {
					councilId: council.id,
					timezone: moment(dateStart).utcOffset().toString(),
				}
			});

			if (!response.errors) {
				setLoading(false);
				if (response.data.conveneWithNotice.success) {
					toast(
						<LiveToast
							id="success-toast"
							message={translate.council_sended}
						/>,
						{
							position: toast.POSITION.TOP_RIGHT,
							autoClose: true,
							className: 'successToast'
						}
					);
					bHistory.push(`/company/${company.id}/council/${council.id}/prepare`);
				}
			}
		}
	};

	const sendConveneTest = async () => {
		if (checkValidEmail(state.data.conveneTestEmail)) {
			setLoading(true);
			const response = await props.sendConveneTest({
				variables: {
					councilId: data.council.id,
					email: state.data.conveneTestEmail,
					timezone: moment(dateStart).utcOffset().toString(),
				}
			});

			if (!response.errors) {
				setLoading(false);
				setState({
					conveneTestSuccess: true
				});
			}
		} else {
			setLoading(false);
			setState({
				errors: {
					...state.errors,
					conveneTestEmail: translate.tooltip_invalid_email_address
				}
			});
		}
	};

	const conveneTestKeyUp = event => {
		if (event.nativeEvent.keyCode === 13) {
			sendConveneTest();
		}
	};

	const updateState = object => {
		setState({
			data: {
				...state.data,
				...object
			}
		});
	};

	const resetConveneTestValues = () => {
		setState({
			conveneTestModal: false,
			conveneTestSuccess: false,
			data: { conveneTestEmail: '' },
			errors: { conveneTestEmail: '' }
		});
	};

	const sendPreConvene = async () => {
		setLoading(true);
		const response = await props.sendPreConvene({
			variables: {
				councilId: data.council.id,
				timezone: moment(dateStart).utcOffset().toString(),
			}
		});

		setLoading(false);

		if (!response.errors) {
			setState({
				preConveneSuccess: true
			});
		}
	};

	const resetErrors = () => {
		setErrors({});
	};

	const sendConveneWithoutNotice = async () => {
		if (!checkInvalidDates()) {
			setLoading(true);
			const response = await props.conveneWithoutNotice({
				variables: {
					councilId: data.council.id,
					timezone: moment(dateStart).utcOffset().toString(),
				}
			});
			setLoading(false);
			if (!response.errors) {
				setState({
					conveneWithoutNoticeSuccess: true
				});
				if (response.data.conveneWithoutNotice.success) {
					toast(
						<LiveToast
							message={translate.changes_saved}
						/>,
						{
							position: toast.POSITION.TOP_RIGHT,
							autoClose: true,
							className: 'successToast'
						}
					);
					bHistory.push(`/company/${company.id}/council/${data.council.id}/prepare`);
				}
			}
		}
	};

	const renderPreConveneModalBody = () => {
		if (state.preConveneSuccess) {
			return <SuccessMessage message={translate.sent} />;
		}

		return (
			<div style={{ width: '500px' }}>
				{translate.send_preconvene_desc}
			</div>
		);
	};

	const renderErrorModalBody = () => {
		if (Object.keys(errors).length === 0) {
			return <div />;
		}

		return (
			<div>
				{Object.keys(errors).map((key, index) => (
					<div
						style={{ display: 'flex', justifyContent: 'space-between' }}
						key={`error_${index}`}
					>
						<div>{errors[key].message}</div>
						<BasicButton
							onClick={errors[key].action}
							text={'Ir'}
							color="white"
							buttonStyle={{ border: `1px solid ${secondary}` }}
						/>
					</div>
				))}
			</div>
		);
	};

	function renderConveneTestModalBody() {
		const texts = CBX.removeHTMLTags(translate.send_convene_test_email_modal_text).split('.');

		if (state.conveneTestSuccess) {
			return <SuccessMessage message={translate.sent} />;
		}
		return (
			<div style={{ width: '500px' }}>
				<Typography style={{ fontWeight: '700' }}>
					{texts[0]}
				</Typography>
				<Typography>{`${texts[1]}.`}</Typography>
				<div style={{ marginTop: '2em' }}>
					<TextInput
						required
						floatingText={translate.email}
						onKeyUp={conveneTestKeyUp}
						type="text"
						errorText={state.errors.conveneTestEmail}
						value={data.conveneTestEmail}
						onChange={event => updateState({
							conveneTestEmail: event.nativeEvent.target.value
						})
						}
					/>
				</div>
			</div>
		);
	}

	if (fetchLoading) {
		return <LoadingSection />;
	}

	return (
		<React.Fragment>
			<div
				style={{
					width: '100%',
					textAlign: 'center',
				}}
			>
				<div style={{
					marginBottom: '1.2em', marginTop: '0.8em', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 1.5rem'
				}}>
					<EditorStepper
						translate={translate}
						active={step - 1}
						previousPage={props.previousStep}
					/>
				</div>
			</div>
			<EditorStepLayout
				body={
					<div
						style={{
							width: '100%',
							padding: '1.2em',
							paddingTop: '0.8em',
							paddingBottom: '3em',
							display: 'flex',
							justifyContent: 'center'
						}}
					>
						<Paper
							className="htmlPreview"
						>
							<div
								style={{
									padding: '2em',
									paddingBottom: '0',
								}}
								dangerouslySetInnerHTML={{
									__html: data.councilPreviewHTML
								}}
							/>
						</Paper>
						<AlertConfirm
							requestClose={resetConveneTestValues}
							open={state.conveneTestModal}
							loadingAction={loading}
							acceptAction={
								state.conveneTestSuccess ?
									resetConveneTestValues
									: sendConveneTest
							}
							buttonAccept={
								state.conveneTestSuccess ?
									translate.accept
									: translate.send
							}
							buttonCancel={translate.close}
							bodyText={renderConveneTestModalBody()}
							title={translate.send_test_convene}
						/>
						<AlertConfirm
							requestClose={() => setState({ preConveneModal: false })}
							open={state.preConveneModal}
							loadingAction={loading}
							acceptAction={
								state.preConveneSuccess ?
									() => setState({ preConveneModal: false })
									: sendPreConvene
							}
							buttonAccept={translate.send}
							hideAccept={state.preConveneSuccess}
							buttonCancel={translate.close}
							bodyText={renderPreConveneModalBody()}
							title={translate.send_preconvene}
						/>
						<AlertConfirm
							requestClose={resetErrors}
							open={Object.keys(errors).length > 0}
							acceptAction={resetErrors}
							buttonAccept={translate.accept}
							bodyText={renderErrorModalBody()}
							title={translate.warning}
						/>
						<AlertConfirm
							requestClose={() => setState({
								sendConveneWithoutNoticeModal: false,
								sendWithoutNoticeSuccess: false
							})
							}
							open={state.sendConveneWithoutNoticeModal}
							loadingAction={loading}
							acceptAction={
								state.sendWithoutNoticeSuccess ?
									() => {
										setState(
											{
												sendConveneWithoutNoticeModal: false,
												sendWithoutNoticeSuccess: false
											},
											() => bHistory.push('/')
										);
									}
									: sendConveneWithoutNotice
							}
							buttonAccept={
								state.sendWithoutNoticeSuccess ?
									translate.accept
									: translate.send
							}
							buttonCancel={translate.close}
							bodyText={<div />}
							title={data.council.councilType === 4 ? translate.confirm_without_notifying : translate.new_save_convene}
						/>
					</div>
				}
				buttons={
					<Grid>
						<GridItem
							xs={12} lg={12} md={12}
							style={{
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'flex-end'
							}}
						>
							<div>
								<div
									style={{
										float: 'right'
									}}
								>
									<DropDownMenu
										id={'desplegablePrevisualizacionNew'}
										color="transparent"
										Component={() => <Paper
											elevation={1}
											style={{
												boxSizing: 'border-box',
												padding: '0',
												width: '5em',
												height: '36px',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												border: `1px solid ${primary}`,
												marginLeft: '0.3em'
											}}
										>
											<MenuItem
												style={{
													width: '100%',
													height: '100%',
													margin: 0,
													padding: 0,
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center'
												}}
											>
												<FontAwesome
													name={'bars'}
													style={{
														cursor: 'pointer',
														fontSize: '0.8em',
														height: '0.8em',
														color: primary
													}}
												/>
												<Icon
													className="material-icons"
													style={{ color: primary }}
												>
													keyboard_arrow_down
												</Icon>
											</MenuItem>
										</Paper>
										}
										textStyle={{ color: primary }}
										type="flat"
										items={
											<React.Fragment>
												{data.council.councilType !== 4
													&& <>
														<MenuItem
															onClick={() => setState({
																conveneTestModal: true
															})
															}
														>
															<Icon
																className="fa fa-flask"
																style={{
																	color: secondary,
																	marginLeft: '0.4em',
																	marginRight: '0.4em'
																}}
															>
																{' '}
															</Icon>
															{translate.send_test_convene}
														</MenuItem>
														<MenuItem
															onClick={() => setState({
																preConveneModal: true
															})
															}
														>
															<Icon
																className="material-icons"
																style={{
																	color: secondary,
																	marginLeft: '0.4em',
																	marginRight: '0.4em'
																}}
															>
																query_builder
															</Icon>
															{translate.send_preconvene}
														</MenuItem>
													</>
												}
												<MenuItem
													id="convene-without-notify"
													onClick={() => setState({
														sendConveneWithoutNoticeModal: true
													})
													}
												>
													<Icon
														className="material-icons"
														style={{
															color: secondary,
															marginLeft: '0.4em',
															marginRight: '0.4em'
														}}
													>
														notifications_off
													</Icon>
													{data.council.councilType === 4 ? translate.confirm_without_notifying : translate.new_save_convene}
												</MenuItem>
											</React.Fragment>
										}
									/>
								</div>
								<BasicButton
									text={data.council.councilType === 4 ? translate.confirm_and_notify : translate.new_save_and_send}
									color={primary}
									id="council-editor-convene-notify"
									textStyle={{
										color: 'white',
										fontWeight: '700',
										marginLeft: '0.3em',
										fontSize: '0.9em',
										textTransform: 'none'
									}}
									floatRight
									textPosition="after"
									onClick={conveneWithNotice}
								/>
								<BasicButton
									text={translate.previous}
									id="council-editor-previous"
									color={secondary}
									textStyle={{
										color: 'white',
										fontWeight: '700',
										fontSize: '0.9em',
										textTransform: 'none'
									}}
									floatRight
									textPosition="after"
									onClick={props.previousStep}
								/>
							</div>
						</GridItem>
					</Grid>
				}
			/>
		</React.Fragment>
	);
};


export default compose(
	graphql(conveneWithNoticeMutation, {
		name: 'conveneWithNotice'
	}),

	graphql(sendConveneTestMutation, {
		name: 'sendConveneTest'
	}),

	graphql(sendPreConveneMutation, {
		name: 'sendPreConvene'
	}),

	graphql(conveneWithoutNoticeMutation, {
		name: 'conveneWithoutNotice',
		options: {
			errorPolicy: 'all'
		}
	}),
)(withRouter(withApollo(StepPreview)));
