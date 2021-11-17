import React from 'react';
import { MenuItem, Typography } from 'material-ui';
import { graphql, withApollo } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import gql from 'graphql-tag';
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
	TextInput,
	GridItem,
	HelpPopover,
} from '../../../../displayComponents';
import { councilStepFive, updateCouncil as updateCouncilMutation } from '../../../../queries';
import { checkValidEmail, checkValidMajority } from '../../../../utils/validation';
import { getPrimary, getSecondary } from '../../../../styles/colors';
import * as CBX from '../../../../utils/CBX';
import withWindowSize from '../../../../HOCs/withWindowSize';
import EditorStepLayout from '../EditorStepLayout';
import { moment } from '../../../../containers/App';
import DelegationRestriction from '../DelegationRestriction';
import { ConfigContext } from '../../../../containers/AppControl';
import { useValidRTMP } from '../../../../hooks';
import VoteLetterWithSenseOption from './VoteLetterWithSenseOption';
import AttendanceTextEditor from './AttendanceTextEditor';
import EditorStepper from '../EditorStepper';
import cuadricula from '../../../../assets/img/cuadricula.png';
import ponente from '../../../../assets/img/ponente.png';


const StepOptions = ({
	translate, data, client, step, ...props
}) => {
	const primary = getPrimary();
	const secondary = getSecondary();
	const config = React.useContext(ConfigContext);
	const [text, setText] = React.useState('');
	const [isModal, setIsmodal] = React.useState({
		modal: false,
		unsavedModal: false
	});
	const [state, setState] = React.useState({
		data: {},
		loading: false,
		majorityAlert: false,
		alertText: '',
		success: false,
		errors: {
			confirmAssistance: '',
			actPointMajorityDivider: -1,
		}
	});

	React.useEffect(() => {
		if (!data.loading) {
			if (!state.data.council) {
				setState({
					...state,
					data: {
						council: {
							...state.data.council,
							...data.council,

							room: data.council.room ? data.council.room : {
								videoConfig: {}
							},
							...(!config.video ? {
								councilType: 1
							} : {})
						}
					}
				});
				setText(data.council.statute.attendanceText || '');
			}
		}
	});
	const { council } = state.data;


	const updateCouncil = async stepIn => {
		setState({
			...state,
			loading: true
		});
		const {
			__typename, statute, platform, room, ...rest
		} = state.data.council;
		const { __typename: t, ...councilRoom } = room;

		await client.mutate({
			mutation: gql`
				mutation UpdateCouncilRoom($councilRoom: CouncilRoomInput!, $councilId: Int!){
					updateCouncilRoom(councilRoom: $councilRoom, councilId: $councilId){
						success
					}
				}
			`,
			variables: {
				councilId: council.id,
				councilRoom
			}
		});

		await props.updateCouncil({
			variables: {
				council: {
					...rest,
					sendPointsMode: !CBX.councilHasVideo({ councilType: council.councilType }) ? 0 : 1,
					closeDate: council.closeDate ? council.closeDate : moment(new Date(council.dateStart)).add(15, 'm'),
					step: stepIn
				}
			}
		});

		setState({
			...state,
			loading: false,
			success: true
		});
	};

	const updateAttendanceText = async () => {
		const response = await client.mutate({
			mutation: gql`
                mutation UpdateCouncilStatute($councilId: Int!, $statute: CouncilOptions!){
                    updateCouncilStatute(councilId: $councilId, statute: $statute){
                        attendanceText
                    }
                }
            `,
			variables: {
				councilId: council.id,
				statute: {
					attendanceText: text
				}
			}
		});
		if (response) {
			setIsmodal({ ...isModal, modal: false, unsavedModal: false });
		}
	};

	const resetButtonStates = () => {
		setState({
			...state,
			loading: false,
			success: false
		});
	};

	const checkRequiredFields = () => {
		if (council.approveActDraft === 1 && checkValidEmail(council.contactEmail)) {
			const response = checkValidMajority(council.actPointMajority, council.actPointMajorityDivider, council.actPointMajorityType);
			if (response.error) {
				setState({
					majorityAlert: true,
					alertText: response.message
				});
			}

			return response.error;
		}

		if (council.autoClose === 1) {
			if (!CBX.checkSecondDateAfterFirst(council.dateStart, council.closeDate)) {
				setState({
					...state,
					errors: {
						...state.errors,
						closeDate: `${translate.end_date_earlier_the_start} (${moment(council.dateStart).format('LLL')})`
					}
				});
				return true;
			}
		}

		if (council.contactEmail === '') {
			setState({
				...state,
				errors: {
					...state.errors,
					contactEmail: translate.required_field
				}
			});
			return true;
		}

		if (!council.contactEmail) {
			setState({
				...state,
				errors: {
					...state.errors,
					contactEmail: translate.required_field
				}
			});
			return true;
		}

		if (council.contactEmail && !checkValidEmail(council.contactEmail)) {
			setState({
				...state,
				errors: {
					...state.errors,
					contactEmail: translate.email_not_valid
				}
			});
			return true;
		}

		return false;
	};


	function updateCouncilData(newData) {
		setState({
			...state,
			data: {
				council: {
					...state.data.council,
					...newData,
					...(!config.video ? {
						councilType: 1
					} : {})
				}
			}
		});
	}

	const nextPage = async () => {
		if (!checkRequiredFields()) {
			await updateCouncil(6);
			props.nextStep();
		}
	};

	const previousPage = async () => {
		await updateCouncil(5);
		props.previousStep();
	};

	function renderCouncilTypeSpecificOptions(type) {
		const councilOptions = {
			1: (
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
						id="council-options-enable-video"
						disabled={!config.video}
						value={council.councilType === 0}
						onChange={(event, isInputChecked) => updateCouncilData({
							councilType: isInputChecked ? 0 : 1,
							autoClose: 0,
							fullVideoRecord: 0
						})
						}
					/>
					<Checkbox
						disabled={council.councilType !== 0}
						id="council-options-full-recording"
						label={translate.full_video_record}
						value={council.fullVideoRecord !== 0}
						onChange={(event, isInputChecked) => updateCouncilData({
							fullVideoRecord: isInputChecked ? 1 : 0
						})
						}
					/>
					<Checkbox
						label={translate.wall}
						id="council-options-comments-wall"
						value={council.wallActive !== 0}
						onChange={(event, isInputChecked) => updateCouncilData({
							wallActive: isInputChecked ? 1 : 0
						})
						}
					/>
					<Checkbox
						disabled={council.councilType !== 0}
						id="council-options-ask-word-menu"
						label={translate.can_ask_word}
						value={council.askWordMenu}
						onChange={(event, isInputChecked) => updateCouncilData({
							askWordMenu: isInputChecked
						})
						}
					/>
					<div style={{ display: 'flex' }}>
						<Checkbox
							disabled={council.councilType === 0}
							id="council-options-auto-close"
							label={translate.auto_close}
							value={council.autoClose !== 0}
							onChange={(event, isInputChecked) => updateCouncilData({
								autoClose: isInputChecked ? 1 : 0
							})
							}
						/>
						{council.autoClose === 1
							&& <div style={{ width: '22em', marginLeft: '0.9em' }}>
								<DateTimePicker
									required
									minDate={moment(new Date(council.dateStart)).add(1, 'm')}
									onChange={date => {
										const newDate = new Date(date);
										const dateString = newDate.toISOString();
										updateCouncilData({
											closeDate: dateString
										});
									}}
									id="council-options-auto-close-date"
									minDateMessage={''}
									acceptText={translate.accept}
									cancelText={translate.cancel}
									value={council.closeDate ? council.closeDate : moment(new Date(council.dateStart)).add(15, 'm')}
								/>
							</div>
						}
					</div>
					<RoomLayout
						translate={translate}
					/>
					{council.councilType === 0
						&& <GridItem xs={12} md={8} lg={6}>
							<RTMPField
								data={council}
								updateData={updateCouncilData}
								translate={translate}
							/>
						</GridItem>
					}
				</React.Fragment >
			),
			2: (
				<React.Fragment>
					<SectionTitle
						text={translate.auto_close}
						color={primary}
						style={{
							marginTop: '1.6em'
						}}
					/>

					<div style={{ display: 'flex' }}>
						{council.autoClose === 1
							&& <div style={{ width: '22em' }}>
								<DateTimePicker
									required
									errorText={state.errors.closeDate}
									id="council-options-auto-close-date"
									minDate={moment(new Date(council.dateStart)).add(1, 'm')}
									onChange={date => {
										const newDate = new Date(date);
										const dateString = newDate.toISOString();
										updateCouncilData({
											closeDate: dateString
										});
									}}
									minDateMessage={''}
									acceptText={translate.accept}
									cancelText={translate.cancel}
									value={council.closeDate ? council.closeDate : moment(new Date(council.dateStart)).add(15, 'm')}
								/>
							</div>
						}
					</div>
				</React.Fragment>
			),
			3: (
				<React.Fragment>
					<SectionTitle
						text={translate.closing_telematic_voting}
						color={primary}
						style={{
							marginTop: '1.6em'
						}}
					/>
					<div style={{ display: 'flex' }}>
						{council.autoClose === 1
							&& <div style={{ width: '22em' }}>
								<DateTimePicker
									required
									errorText={state.errors.closeDate}
									id="council-options-auto-close-date"
									minDate={moment(new Date(council.dateStart)).add(1, 'm')}
									onChange={date => {
										const newDate = new Date(date);
										const dateString = newDate.toISOString();
										updateCouncilData({
											closeDate: dateString
										});
									}}
									minDateMessage={''}
									acceptText={translate.accept}
									cancelText={translate.cancel}
									value={council.closeDate ? council.closeDate : moment(new Date(council.dateStart)).add(15, 'm')}
								/>
							</div>
						}
					</div>
					<SectionTitle
						text={translate.voting_options}
						color={primary}
						style={{
							marginTop: '1.6em'
						}}
					/>
					<div style={{ display: 'flex' }}>
						<div>
							<Checkbox
								label={translate.in_person_vote_prevails}
								id="council-options-elections-vote-in-person"
								value={council.presentVoteOverwrite === 1}
								onChange={(event, isInputChecked) => updateCouncilData({
									presentVoteOverwrite: isInputChecked ? 1 : 0
								})
								}
							/>
						</div>
					</div>
				</React.Fragment>
			),
			4: (
				<>
					<div style={{ display: 'flex' }}>
						<div>
							<VoteLetterWithSenseOption
								council={council}
								translate={translate}
							/>
						</div>
					</div>
				</>
			),
			5: (
				<>
					<SectionTitle
						text={translate.video}
						color={primary}
						style={{
							marginTop: '1.6em'
						}}
					/>
					<Checkbox
						label={translate.room_video_broadcast}
						id="council-options-enable-video"
						disabled={true}
						value={council.councilType === 5}
					/>
					<Checkbox
						label={translate.full_video_record}
						id="council-options-full-recording"
						value={council.fullVideoRecord !== 0}
						onChange={(event, isInputChecked) => updateCouncilData({
							fullVideoRecord: isInputChecked ? 1 : 0
						})
						}
					/>
				</>
			),
		};

		return councilOptions[type] ? councilOptions[type] : councilOptions[1];
	}

	function renderDelegationRestriction() {
		return (
			<DelegationRestriction
				translate={translate}
				council={council}
			/>
		);
	}

	function renderSecurityForm() {
		return (
			<div style={{ display: 'inline-grid' }}>
				<Radio
					value={'0'}
					checked={council.securityType === 0}
					id="council-options-security-none"
					onChange={event => updateCouncilData({
						securityType: parseInt(event.target.value, 10)
					})
					}
					name="security"
					label={translate.new_security_none}
				/>
				<Radio
					value={'1'}
					checked={council.securityType === 1}
					id="council-options-security-email"
					onChange={event => updateCouncilData({
						securityType: parseInt(event.target.value, 10)
					})
					}
					name="security"
					label={translate.new_security_email}
				/>
				<Radio
					value={'2'}
					checked={council.securityType === 2}
					id="council-options-security-sms"
					onChange={event => updateCouncilData({
						securityType: parseInt(event.target.value, 10)
					})
					}
					name="security"
					label={translate.new_security_sms}
				/>
				<Radio
					value={'3'}
					checked={council.securityType === 3}
					id="council-options-security-cert"
					onChange={event => updateCouncilData({
						securityType: parseInt(event.target.value, 10)
					})
					}
					name="security"
					label={translate.council_security_cert}
				/>
				<br />
				{CBX.showUserUniqueKeyMessage(council) && (
					<Typography>
						{translate.key_autogenerated_by_participant}
					</Typography>
				)}
			</div>
		);
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
						goToPage={nextPage}
						previousPage={previousPage}
					/>
				</div>
			</div>
			<EditorStepLayout
				body={
					<React.Fragment>
						{data.loading || !council ?
							<div
								style={{
									height: '300px',
									width: '100%',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center'
								}}
							>
								<LoadingSection />
							</div>
							: <div
								style={{
									marginLeft: '1em',
									paddingBottom: '1.5em'
								}}
							>
								{council.councilType < 2 && (
									<React.Fragment>
										<SectionTitle
											text={translate.confirm_assistance}
											color={primary}
										/>
										<Checkbox
											label={translate.confirm_assistance_desc}
											id="council-options-confirm-attendance"
											value={council.confirmAssistance === 1}
											onChange={(event, isInputChecked) => updateCouncilData({
												confirmAssistance: isInputChecked ? 1 : 0
											})
											}
											helpPopover
											helpDescription={translate.assistance_intention_help}
											helpTitle={translate.confirm_assistance}
										/>
										{council.confirmAssistance === 1
											&& <>
												<AttendanceTextEditor
													council={council}
													translate={translate}
													updateAttendanceText={updateAttendanceText}
													isModal={isModal}
													setIsmodal={setIsmodal}
													text={text}
													setText={setText}
												/>
											</>
										}
									</React.Fragment>
								)}
								{renderCouncilTypeSpecificOptions(council.councilType)}

								{council.councilType !== 4
									&& <>
										<SectionTitle
											text={translate.security}
											color={primary}
											style={{
												marginTop: '1.6em'
											}}
										/>
										{renderSecurityForm()}

									</>
								}
								{(council.statute.existsDelegatedVote === 1 && config.councilDelegates && council.councilType !== 5)
									&& renderDelegationRestriction()
								}
								<SectionTitle
									text={translate.options}
									color={primary}
									style={{
										marginTop: '1.6em'
									}}
								/>
								<Checkbox
									label={translate.test_meeting}
									id="council-options-test-meeting"
									value={council.promoCode === 'COUNCILBOX'}
									onChange={(event, isInputChecked) => updateCouncilData({
										promoCode: isInputChecked ? 'COUNCILBOX' : null
									})
									}
								/>
								<GridItem xs={12} md={6} lg={4}>
									<TextInput
										required
										id="council-options-contact-email"
										floatingText={translate.contact_email}
										type="text"
										errorText={state.errors.contactEmail}
										value={council.contactEmail || ''}
										onChange={event => updateCouncilData({
											contactEmail: event.target.value
										})}
										helpPopover
										helpTitle={translate.contact_email}
										helpDescription={translate.contact_email_admin_help}
										helpPlacement={'topRight'}
									/>
								</GridItem>
								{CBX.hasAct(council.statute) && council.councilType < 2 && (
									<React.Fragment>
										<SectionTitle
											text={translate.approve_act_draft_at_end}
											color={primary}
											style={{ marginTop: '2em' }}
										/>
										<div
											style={{
												display: 'flex',
												flexDirection: props.windowSize === 'xs' ? 'column' : 'row',
												alignItems: props.windowSize === 'xs' ? 'flex-start' : 'center',
											}}
										>
											<div style={{ paddingTop: '12px' }}>
												<Checkbox
													label={translate.approve_act_draft_at_end_desc}
													id="council-options-add-act-point"
													value={council.approveActDraft !== 0}
													onChange={(event, isInputChecked) => updateCouncilData({
														approveActDraft: isInputChecked ? 1 : 0
													})
													}
												/>
											</div>
											{council.approveActDraft === 1 && (
												<div>
													<div style={{
														display: 'flex', flexDirection: 'row', marginLeft: '1.1em', alignItems: 'flex-end'
													}}>
														<div>
															<SelectInput
																floatingLabelText={
																	translate.majority_label
																}
																id="council-options-act-point-majority-type"
																value={council.actPointMajorityType}
																onChange={event => {
																	updateCouncilData({
																		actPointMajorityType:
																			event.target.value
																	});
																}}
															>
																{data.majorityTypes.map(
																	majority => (
																		<MenuItem
																			value={majority.value}
																			id={`council-options-act-majority-${majority.value}`}
																			key={`majority${majority.value}`}
																		>
																			{
																				translate[majority.label]
																			}
																		</MenuItem>
																	)
																)}
															</SelectInput>
														</div>
														<div style={{ display: 'flex', alignItems: 'flex-end' }}>
															{CBX.majorityNeedsInput(
																council.actPointMajorityType
															)
																&& (
																	<MajorityInput
																		type={council.actPointMajorityType}
																		style={{ marginLeft: '1em' }}
																		value={council.actPointMajority}
																		divider={
																			council.actPointMajorityDivider
																		}
																		onChange={value => updateCouncilData({
																			actPointMajority: +value
																		})}
																		onChangeDivider={value => updateCouncilData({
																			actPointMajorityDivider: +value
																		})}
																	/>
																)
															}
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
							</div>
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
								color: 'white',
								fontWeight: '700',
								fontSize: '0.9em',
								textTransform: 'none'
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
								color: 'white',
								fontWeight: '700',
								marginLeft: '0.5em',
								marginRight: '0.5em',
								fontSize: '0.9em',
								textTransform: 'none'
							}}
							icon={<ButtonIcon type="save" color="white" />}
							textPosition="after"
							onClick={() => updateCouncil(5)}
						/>
						<BasicButton
							text={translate.next}
							color={primary}
							disable={data.loading}
							id={'optionsNewSiguiente'}
							textStyle={{
								color: 'white',
								fontWeight: '700',
								fontSize: '0.9em',
								textTransform: 'none'
							}}
							textPosition="after"
							onClick={nextPage}
						/>
					</React.Fragment>
				}
			/>
		</React.Fragment>
	);
};


export default compose(
	graphql(councilStepFive, {
		name: 'data',
		options: props => ({
			variables: {
				id: props.councilID
			},
			notifyOnNetworkStatusChange: true,
			fetchPolicy: 'network-only'
		})
	}),
	withApollo,
	graphql(updateCouncilMutation, {
		name: 'updateCouncil'
	})
)(withWindowSize(StepOptions));


const RTMPField = ({ data, updateData, translate }) => {
	const { validURL } = useValidRTMP(data.room);

	return (
		<TextInput
			disabled={data.councilType !== 0}
			errorText={!validURL ? translate.invalid_url : ''}
			id="rtmp-url-text-input"
			floatingText={'RTMP'}
			value={(data.room && data.room.videoConfig) ? data.room.videoConfig.rtmp : ''}
			onChange={event => updateData({
				room: {
					videoConfig: {
						...data.room.videoConfig,
						rtmp: event.target.value
					}
				}
			})
			}
		/>
	);
};

export const RoomLayout = ({ translate }) => {
	return (
		<div style={{ fontSize: '0.875rem', marginTop: '5px', marginBottom: '5px' }}>
			<div style={{ marginBottom: '0.5em' }}>
				{translate.room_layout}
				<HelpPopover
					title={translate.room_layout}
					content={translate.room_layout_help}
				/>
			</div>
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<div>
					<Radio
						value={'grid'}
						id="council-options-grid"
						label={
							<div >
								<div style={{ display: 'flex', justifyContent: 'center' }}><img src={cuadricula} /></div>
								<div>{translate.label_grid}</div>
							</div>
						}
					// value={council.autoClose !== 0}
					// onChange={(event, isInputChecked) => updateCouncilData({
					// autoClose: isInputChecked ? 1 : 0
					// })
					// }
					/>
				</div>
				<div>
					<Radio
						value={'active'}
						id="council-options-active-speaker"
						label={
							<div>
								<div style={{ display: 'flex', justifyContent: 'center' }}><img src={ponente} /></div>
								<div>{translate.label_activeSpeaker}</div>
							</div>
						}
					// value={council.autoClose !== 0}
					// onChange={(event, isInputChecked) => updateCouncilData({
					// autoClose: isInputChecked ? 1 : 0
					// })
					// }
					/>
				</div>
			</div>
		</div>
	);
};
