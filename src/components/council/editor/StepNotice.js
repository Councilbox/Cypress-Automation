import React from 'react';
import { MenuItem } from 'material-ui';
import gql from 'graphql-tag';
import { graphql, withApollo } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { toast } from 'react-toastify';
import {
	AlertConfirm,
	BasicButton,
	ButtonIcon,
	DateTimePicker,
	LiveToast,
	ErrorAlert,
	Grid,
	GridItem,
	LoadingSection,
	SelectInput,
	TextInput
} from '../../../displayComponents';
import RichTextInput from '../../../displayComponents/RichTextInput';
import { StatuteDisplay } from '../display/StatuteDisplay';
import LoadFromPreviousCouncil from './LoadFromPreviousCouncil';
import { getPrimary, getSecondary } from '../../../styles/colors';
import PlaceModal from './PlaceModal';
import LoadDraftModal from '../../company/drafts/LoadDraftModal';
import {
	changeStatute as changeStatuteMutation,
	councilStepOne,
	updateCouncil as updateCouncilMutation
} from '../../../queries';
import * as CBX from '../../../utils/CBX';
import EditorStepLayout from './EditorStepLayout';
import { moment } from '../../../containers/App';
import { TAG_TYPES } from '../../company/drafts/draftTags/utils';
import EditorStepper from './EditorStepper';


const StepNotice = ({
	translate, company, client, step, ...props
}) => {
	const [council, setCouncil] = React.useState({});
	const [data, setData] = React.useState({
		loading: true
	});
	const [placeModal, setPlaceModal] = React.useState(false);
	const [statuteModal, setStatuteModal] = React.useState(false);
	const [censusModal, setCensusModal] = React.useState(false);
	const [errors, setErrors] = React.useState({});
	const [state, setState] = React.useState({
		loading: false,
		success: false,
		alert: false,
	});
	const editor = React.useRef();
	const footerEditor = React.useRef();
	const primary = getPrimary();
	const secondary = getSecondary();
	const dates = React.useRef({
		dateStart: null,
		dateStart2NdCall: null
	});

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: councilStepOne,
			variables: {
				id: props.councilID,
				companyId: company.id
			},
		});

		setData({
			...response.data,
			loading: false
		});
	}, [props.councilID]);

	React.useEffect(() => {
		getData();
	}, [getData]);

	const setCouncilWithRemoveValues = React.useCallback(async () => {
		if (!data.loading && !council.id) {
			setCouncil({
				...data.council,
				name: !data.council.name ? `${translate[data.council.statute.title] ? translate[data.council.statute.title] : data.council.statute.title} - ${moment().format('DD/MM/YYYY')}` : data.council.name,
				conveneText: await CBX.changeVariablesToValues(data.council.conveneText, {
					company,
					council: {
						...data.council,
						dateStart: data.council.dateStart ? data.council.dateStart : new Date().toISOString(),
					}
				}, translate),
				dateStart: !data.council.dateStart ? new Date().toISOString() : data.council.dateStart,
				conveneFooter: await CBX.changeVariablesToValues(data.council.conveneFooter, {
					company,
					council: {
						...data.council,
						dateStart: data.council.dateStart ? data.council.dateStart : new Date().toISOString(),
					}
				}, translate),
			});
			dates.current.dateStart = !data.council.dateStart ? new Date().toISOString() : data.council.dateStart;
			dates.current.dateStart2NdCall = data.council.dateStart2NdCall;
		}
	}, [data]);

	React.useEffect(() => {
		setCouncilWithRemoveValues(data);
	}, [setCouncilWithRemoveValues]);

	const updateState = object => {
		setCouncil(oldData => ({
			...oldData,
			...object
		}));
	};

	const updateConveneDates = (oldDate, newDate, old2Date, new2Date) => {
		const text = council.conveneText || '';
		const oldDateText = moment(new Date(oldDate)).format('LLL');
		const newDateText = moment(new Date(newDate)).format('LLL');
		const old2DateText = moment(new Date(old2Date)).format('LLL');
		const new2DateText = moment(new Date(new2Date)).format('LLL');
		const newName = council.name.replace(new RegExp(`${moment(oldDate).format('DD/MM/YYYY')}`), moment(newDate).format('DD/MM/YYYY'));
		const replacedText = text
			.replace(new RegExp(`${oldDateText}`, 'g'), newDateText)
			.replace(new RegExp(`${old2DateText}`, 'g'), new2DateText);

		dates.current = {
			dateStart: newDate,
			dateStart2NdCall: new2Date
		};

		updateState({
			conveneText: replacedText,
			name: newName
		});
		editor.current.setValue(replacedText);
	};

	const checkDates = () => {
		const { statute } = data.council;
		const firstDate = council.dateStart || new Date().toISOString();
		const secondDate = council.dateStart2NdCall || new Date().toISOString();
		const newErrors = {};
		const oldFirstDate = dates.current.dateStart;
		const oldSecondDate = dates.current.dateStart2NdCall;

		if (!CBX.checkMinimumAdvance(firstDate, statute)) {
			newErrors.dateStart = translate.new_statutes_warning
				.replace('{{council_prototype}}', translate[statute.title] || statute.title)
				.replace('{{days}}', statute.advanceNoticeDays);
		}

		if (CBX.hasSecondCall(statute)) {
			const first = moment(new Date(firstDate).toISOString(), moment.ISO_8601);
			const second = moment(new Date(secondDate).toISOString(), moment.ISO_8601);
			const difference = second.diff(first, 'minutes');

			if (difference < statute.minimumSeparationBetweenCall || !council.dateStart2NdCall) {
				updateState({
					dateStart: firstDate,
					dateStart2NdCall: CBX.addMinimumDistance(firstDate, statute).toISOString()
				});
			}
			updateConveneDates(oldFirstDate || firstDate, firstDate, oldSecondDate || secondDate, CBX.addMinimumDistance(firstDate, statute));
		} else {
			if (oldFirstDate !== firstDate || oldSecondDate !== secondDate) {
				updateConveneDates(oldFirstDate, firstDate, oldSecondDate, secondDate);
			}
			if (!CBX.checkMinimumDistanceBetweenCalls(firstDate, secondDate, statute)) {
				// newErrors.dateStart2NdCall = translate.new_statutes_hours_warning.replace("{{hours}}", statute.minimumSeparationBetweenCall);
			}
		}

		setErrors(newErrors);
	};

	React.useEffect(() => {
		if (council.id) {
			checkDates();
		}
	}, [council.dateStart, council.dateStart2NdCall, CBX.hasSecondCall(data.council ? data.council.statute : null)]);

	const resetButtonStates = () => {
		setState({
			...state,
			loading: false,
			success: false
		});
	};

	const loadDraft = async draft => {
		const correctedText = await CBX.changeVariablesToValues(draft.text, {
			company,
			council
		}, translate);
		updateState({
			conveneText: correctedText
		});
		editor.current.setValue(correctedText);
	};

	const loadFooterDraft = async draft => {
		const correctedText = await CBX.changeVariablesToValues(draft.text, {
			company,
			council
		}, translate);
		updateState({
			conveneFooter: correctedText
		});
		footerEditor.current.setValue(correctedText);
	};

	const reloadData = async () => {
		const response = await getData();
		loadDraft({ text: response.data.council.conveneText });
		loadFooterDraft({ text: response.data.council.conveneFooter });
	};

	function checkRequiredFields() {
		const newErrors = {};

		if (!council.name) {
			newErrors.name = translate.new_enter_title;
		}

		if (!council.dateStart) {
			newErrors.dateStart = translate.field_required;
		}

		if (
			!council.conveneText
			|| council.conveneText.replace(/<\/?[^>]+(>|$)/g, '').length <= 0
		) {
			newErrors.conveneText = translate.field_required;
		} else if (CBX.checkForUnclosedBraces(council.conveneText)) {
			newErrors.conveneText = translate.revise_text;
			toast(
				<LiveToast
					id="error-toast"
					message={translate.revise_text}
				/>,
				{
					position: toast.POSITION.TOP_RIGHT,
					autoClose: true,
					className: 'errorToast'
				}
			);
		}

		const hasError = Object.keys(newErrors).length > 0;

		setState({
			...state,
			alert: hasError
		});
		setErrors(newErrors);

		return hasError;
	}

	const updateCouncil = async stepIn => {
		setState({
			...state,
			loading: true
		});
		const {
			__typename, statute, councilType, selectedCensusId, ...rest
		} = council;
		const response = await props.updateCouncil({
			variables: {
				council: {
					...rest,
					step: stepIn
				}
			}
		});

		if (!response.data.errors) {
			setState({
				...state,
				loading: false,
				success: true
			});
		}

		return response;
	};

	const nextPage = async () => {
		if (!checkRequiredFields()) {
			const response = await updateCouncil(2);
			if (!response.data.errors) {
				getData();
				props.nextStep();
			}
		}
	};

	const showPlaceModal = () => {
		setPlaceModal(true);
	};

	const closePlaceModal = () => {
		setPlaceModal(false);
	};

	const savePlaceAndClose = newData => {
		closePlaceModal();
		updateState(newData);
	};

	const changeCensus = async () => {
		const response = await props.changeCensus({
			variables: {
				censusId: data.council.statute.censusId,
				councilId: data.council.id
			}
		});
		if (response) {
			setCensusModal(false);
		}
	};

	const checkAssociatedCensus = statuteId => {
		const statute = data.companyStatutes.find(item => item.id === statuteId);
		if (statute.censusId) {
			setCensusModal(true);
		}
	};

	const updateDate = (firstDate = council.dateStart, secondDate = council.dateStart2NdCall || new Date().toISOString()) => {
		updateState({
			dateStart: firstDate,
			dateStart2NdCall: secondDate,
		});
	};

	const changeStatute = async statuteId => {
		const oldTitle = data.council.statute.title;
		const response = await props.changeStatute({
			variables: {
				councilId: props.councilID,
				statuteId
			}
		});

		if (response) {
			loadDraft({
				text: response.data.changeCouncilStatute.conveneHeader
			});
			loadFooterDraft({
				text: response.data.changeCouncilStatute.conveneFooter
			});

			const name = council.name.replace(new RegExp(`${translate[oldTitle] ?
				translate[oldTitle] : oldTitle}`),
			translate[response.data.changeCouncilStatute.title] ?
				translate[response.data.changeCouncilStatute.title] : response.data.changeCouncilStatute.title);
			updateState({
				name
			});

			await getData();
			checkAssociatedCensus(statuteId);
			updateDate();
		}
	};

	const showStatuteDetailsModal = () => {
		setStatuteModal(true);
	};

	const closeStatuteDetailsModal = () => {
		setStatuteModal(false);
	};

	const { companyStatutes, draftTypes } = data;

	let statute = {};
	if (council.id) {
		statute = data.council.statute;
	}

	let tags = [];


	if (CBX.hasSecondCall(statute)) {
		tags = [{
			value: moment(council.dateStart).format(
				'LLL'
			),
			label: translate['1st_call_date']
		}, {
			value: moment(council.dateStart2NdCall).format(
				'LLL'
			),
			label: translate['2nd_call_date']
		}];
	} else {
		tags.push({
			value: moment(council.dateStart).format(
				'LLL'
			),
			label: translate.date
		});
	}

	tags = [
		...tags,
		{
			value: company.businessName,
			label: translate.business_name
		},
		{
			value: council.remoteCelebration === 1 ? translate.remote_celebration : `${council.street}, ${council.country
				}`,
			label: translate.new_location_of_celebrate
		}
	];

	if (council.remoteCelebration !== 1) {
		tags = [...tags, {
			value: council.country,
			label: translate.company_new_country
		},
		{
			value: council.countryState,
			label: translate.company_new_country_state
		}
		];
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
					/>
				</div>
			</div>
			<EditorStepLayout
				body={
					!council.id && !data.errors ?
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
						: <React.Fragment>
							{
								<LoadFromPreviousCouncil
									council={council}
									translate={translate}
									company={company}
									companyStatutes={companyStatutes}
									refetch={reloadData}
								/>
							}
							<Grid style={{ paddingBottom: '1em' }}>
								<GridItem xs={12} md={4} lg={4} style={{ paddingRight: '3.5em' }}>
									<SelectInput
										required
										id="council-notice-type-select"
										floatingText={translate.council_type}
										value={data.council.statute.statuteId || ''}
										onChange={event => changeStatute(+event.target.value)
										}
									>
										{companyStatutes.map((mappedStatute, index) => (
											<MenuItem
												value={mappedStatute.id}
												id={`council-notice-type-${index}`}
												key={`statutes_${mappedStatute.id}`}
											>
												{translate[mappedStatute.title]
													|| mappedStatute.title}
											</MenuItem>
										))}
									</SelectInput>
									<div
										id="council-editor-check-statute"
										onClick={showStatuteDetailsModal}
										style={{ cursor: 'pointer', color: secondary }}
									>
										{translate.read_details}
									</div>
								</GridItem>
								<GridItem
									xs={12}
									md={8}
									lg={8}
									style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
								>
									<BasicButton
										text={
											<div style={{ display: 'flex', alignItems: 'center' }}>
												<div>{translate.change_location}</div>
												<div><ButtonIcon type="location_on" color="white" /></div>
											</div>
										}
										id={'council-notice-place'}
										color={secondary}
										textStyle={{
											color: 'white',
											fontWeight: '600',
											fontSize: '0.9em',
											textTransform: 'none'
										}}
										textPosition="after"
										onClick={showPlaceModal}
									/>
									<h6 style={{ paddingTop: '0.8em', marginLeft: '1em' }}>
										<b>{`${translate.new_location_of_celebrate}: `}</b>
										{council.remoteCelebration === 1 ?
											translate.remote_celebration
											: `${council.street}, ${council.country}`}
									</h6>
								</GridItem>

								<GridItem xs={12} md={4} lg={4} style={{ marginTop: '1.3em' }}>
									<DateTimePicker
										required
										onChange={date => {
											const newDate = new Date(date);
											const dateString = newDate.toISOString();
											updateDate(dateString);
										}}
										minDateMessage={''}
										errorText={errors.dateStart}
										acceptText={translate.accept}
										cancelText={translate.cancel}
										minDate={Date.now()}
										id="council-notice-date-start"
										idIcon="council-notice-date-start-icon"
										label={translate['1st_call_date']}
										value={council.dateStart}
									/>
								</GridItem>
								<GridItem xs={12} md={4} lg={4} style={{ marginTop: '1.3em' }}>
									{CBX.hasSecondCall(statute) && (
										<DateTimePicker
											required
											minDate={
												council.dateStart ?
													new Date(council.dateStart)
													: new Date()
											}
											errorText={errors.dateStart2NdCall}
											onChange={date => {
												const newDate = new Date(date);
												const dateString = newDate.toISOString();
												updateDate(undefined, dateString);
											}}
											id="council-notice-date-start-2nd"
											idIcon="council-notice-date-start-2nd-icon"
											minDateMessage={''}
											acceptText={translate.accept}
											cancelText={translate.cancel}
											label={translate['2nd_call_date']}
											value={council.dateStart2NdCall}
										/>
									)}
								</GridItem>
								<GridItem xs={12} md={10} lg={10} style={{ marginTop: '2em' }}>
									<TextInput
										required
										floatingText={translate.meeting_title}
										type="text"
										id="council-notice-title"
										placeholder={translate.title_appears_in_the_minutes}
										errorText={errors.name}
										value={council.name || ''}
										onChange={event => updateState({
											name: event.nativeEvent.target.value
										})
										}
									/>
								</GridItem>
								<GridItem xs={12} md={12} lg={12}>
									<RichTextInput
										ref={editor}
										key={props.versionControl}
										translate={translate}
										id="council-notice-convene-intro"
										errorText={errors.conveneText}
										required
										loadDraft={
											<LoadDraftModal
												translate={translate}
												companyId={company.id}
												loadDraft={loadDraft}
												statute={statute}
												statutes={companyStatutes}
												defaultTags={{
													convene_header: {
														active: true,
														label: translate.convene_header,
														name: 'convene_header',
														type: TAG_TYPES.DRAFT_TYPE
													},
													...CBX.generateStatuteTag(statute, translate)
												}}
											/>
										}
										tags={tags}
										floatingText={translate.convene_info}
										value={council.conveneText || ''}
										onChange={value => updateState({
											conveneText: value
										})
										}
									/>
								</GridItem>
								<GridItem xs={12} md={12} lg={12}>
									<RichTextInput
										key={props.versionControl}
										ref={footerEditor}
										translate={translate}
										id="council-notice-convene-footer"
										errorText={errors.conveneFooter}
										tags={tags}
										loadDraft={
											<LoadDraftModal
												translate={translate}
												companyId={company.id}
												loadDraft={loadFooterDraft}
												statute={statute}
												statutes={companyStatutes}
												defaultTags={{
													convene_footer: {
														active: true,
														type: TAG_TYPES.DRAFT_TYPE,
														name: 'convene_footer',
														label: translate.convene_footer
													},
													...CBX.generateStatuteTag(statute, translate)
												}}
												draftType={
													draftTypes.filter(draft => draft.label === 'convene_footer')[0].value
												}
											/>
										}
										floatingText={translate.convene_footer}
										value={council.conveneFooter || ''}
										onChange={value => updateState({
											conveneFooter: value
										})
										}
									/>
								</GridItem>
							</Grid>
							<PlaceModal
								open={placeModal}
								close={closePlaceModal}
								countries={data.countries}
								translate={translate}
								saveAndClose={savePlaceAndClose}
								council={council}
							/>
							<AlertConfirm
								requestClose={() => setCensusModal(false)}
								open={censusModal}
								acceptAction={changeCensus}
								buttonAccept={translate.want_census_change}
								buttonCancel={translate.dont_change}
								bodyText={<div>{translate.census_change_statute}</div>}
								title={translate.census_change}
							/>
							<AlertConfirm
								requestClose={closeStatuteDetailsModal}
								open={statuteModal}
								buttonCancel={translate.close}
								title={council.statute ? translate[data.council.statute.title] || data.council.statute.title : ''}
								bodyText={
									<StatuteDisplay
										statute={data.council.statute}
										translate={translate}
										quorumTypes={data.quorumTypes}
									/>
								}
							/>
							<ErrorAlert
								title={translate.error}
								bodyText={translate.alert_must_fix_form}
								buttonAccept={translate.accept}
								open={state.alert}
								requestClose={() => setState({ ...state, alert: false })}
							/>
						</React.Fragment>
				}
				buttons={
					<React.Fragment>
						<BasicButton
							floatRight
							text={translate.save}
							id="council-editor-save"
							loading={state.loading}
							success={state.success}
							reset={resetButtonStates}
							color={secondary}
							textStyle={{
								color: 'white',
								fontWeight: '700',
								fontSize: '0.9em',
								textTransform: 'none',
								marginRight: '0.6em'
							}}
							icon={<ButtonIcon type="save" color="white" />}
							textPosition="after"
							onClick={() => updateCouncil(1)}
						/>
						<BasicButton
							floatRight
							text={translate.next}
							id="council-editor-next"
							color={primary}
							disabled={data.loading}
							loading={state.loading}
							icon={
								<ButtonIcon
									type="arrow_forward"
									color="white"
								/>
							}
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

const changeCensus = gql`
	mutation changeCensus($councilId: Int!, $censusId: Int!) {
		changeCensus(councilId: $councilId, censusId: $censusId){
			success
		}
	}
`;

export default compose(
	graphql(changeCensus, {
		name: 'changeCensus'
	}),
	withApollo,
	graphql(changeStatuteMutation, {
		name: 'changeStatute'
	}),

	graphql(updateCouncilMutation, {
		name: 'updateCouncil'
	})
)(StepNotice);
