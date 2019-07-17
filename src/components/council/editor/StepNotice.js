import React from "react";
import { MenuItem } from "material-ui";
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
} from "../../../displayComponents";
import gql from 'graphql-tag';
import RichTextInput from "../../../displayComponents/RichTextInput";
import { StatuteDisplay } from '../display/StatuteDisplay';
import LoadFromPreviousCouncil from './LoadFromPreviousCouncil';
import { getPrimary, getSecondary } from "../../../styles/colors";
import PlaceModal from "./PlaceModal";
import LoadDraftModal from "../../company/drafts/LoadDraftModal";
import { compose, graphql } from "react-apollo";
import { changeStatute, councilStepOne, updateCouncil } from "../../../queries";
import * as CBX from "../../../utils/CBX";
import EditorStepLayout from './EditorStepLayout';
import { moment } from '../../../containers/App';
import { toast } from 'react-toastify';


const StepNotice = ({ data, translate, company, ...props }) => {
	const [council, setCouncil] = React.useState({});
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

	const setCouncilWithRemoveValues = React.useCallback(async data => {
		if(!data.loading && !council.id){
			setCouncil({
				...data.council,
				name: !data.council.name? `${data.council.statute.title} - ${moment().format('DD/MM/YYYY')}` : data.council.name,
				conveneText: await CBX.changeVariablesToValues(data.council.conveneText, {
					company,
					council: {
						...data.council,
						dateStart: data.council.dateStart? data.council.dateStart : new Date().toISOString(),
					}
				}, translate),
				dateStart: !data.council.dateStart? new Date().toISOString() : data.council.dateStart,
				conveneFooter: await CBX.changeVariablesToValues(data.council.conveneFooter, {
					company,
					council: {
						...data.council,
						dateStart: data.council.dateStart? data.council.dateStart : new Date().toISOString(),
					}
				}, translate),
			});
		}
	}, [data]);

	React.useEffect(() => {
		setCouncilWithRemoveValues(data);
	}, [setCouncilWithRemoveValues]);

	React.useEffect(() => {
		if(council.id){
			checkDates();
		}
	}, [council.dateStart, council.dateStart2NdCall]);

	const resetButtonStates = () => {
		setState({
			...state,
			loading: false,
			success: false
		});
	}

	const reloadData = async () => {
		const response = await data.refetch();
		loadDraft({ text: response.data.council.conveneText });
		loadFooterDraft({ text: response.data.council.conveneFooter });
	}

	const checkDates = () => {
		const statute = data.council.statute;
		const firstDate = council.dateStart || new Date().toISOString();
		const secondDate = council.dateStart2NdCall || new Date().toISOString();
		const errors = {};

		//console.log(council.dateStart, council.dateStart2NdCall);

		if(!CBX.checkMinimumAdvance(firstDate, statute)){
			errors.dateStart = translate.new_statutes_warning
				.replace('{{council_prototype}}', translate[statute.title] || statute.title)
				.replace('{{days}}', statute.advanceNoticeDays)
		}

		if (CBX.hasSecondCall(council.statute) && (!CBX.checkSecondDateAfterFirst(firstDate, secondDate) || !council.dateStart2NdCall)) {
			//errors.dateStart2NdCall = translate["2nd_call_date_changed"];
			const first = moment(new Date(firstDate).toISOString(), moment.ISO_8601);
			const second = moment(new Date(secondDate).toISOString(), moment.ISO_8601);
			const difference = second.diff(first, "minutes");
			if(difference < statute.minimumSeparationBetweenCall){
				updateState({
					dateStart: firstDate,
					dateStart2NdCall: CBX.addMinimumDistance(firstDate, statute).toISOString()
				});
			}
			updateConveneDates(firstDate, firstDate, secondDate, CBX.addMinimumDistance(firstDate, statute))
		} else {
			if (!CBX.checkMinimumDistanceBetweenCalls(firstDate, secondDate, statute)) {
				//errors.dateStart2NdCall = translate.new_statutes_hours_warning.replace("{{hours}}", statute.minimumSeparationBetweenCall);
			}
		}

		setErrors(errors);
	}

	const nextPage = async () => {
		if (!checkRequiredFields()) {
			const response = await updateCouncil(2);
			if(!response.data.errors){
				props.nextStep();
				data.refetch();
			}
		}
	};

	const updateCouncil = async step => {
		setState({
			...state,
			loading: true
		});
		const { __typename, statute, councilType, ...rest } = council;
		const response = await props.updateCouncil({
			variables: {
				council: {
					...rest,
					step: step
				}
			}
		});

		if(!response.data.errors){
			setState({
				...state,
				loading: false,
				success: true
			});
		}

		return response;
	};

	const savePlaceAndClose = newData => {
		closePlaceModal();
		updateState(newData);
	};

	const updateState = object => {
		setCouncil(data => ({
			...data,
			...object
		}));
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
	}

	const changeStatute = async statuteId => {
		const response = await props.changeStatute({
			variables: {
				councilId: props.councilID,
				statuteId: statuteId
			}
		});

		if (response) {
			loadDraft({
				text: response.data.changeCouncilStatute.conveneHeader
			});
			loadFooterDraft({
				text: response.data.changeCouncilStatute.conveneFooter
			});
			await data.refetch();
			checkAssociatedCensus(statuteId);
			updateDate();
		}
	}

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
			company: company,
			council
		}, translate);
		updateState({
			conveneFooter: correctedText
		});
		footerEditor.current.setValue(correctedText);
	}

	function checkRequiredFields() {
		let errors = {}

		if (!council.name) {
			errors.name = translate.new_enter_title;
		}

		if (!council.dateStart) {
			errors.dateStart = translate.field_required;
		}

		if (
			!council.conveneText ||
			council.conveneText.replace(/<\/?[^>]+(>|$)/g, "").length <= 0
		) {
			errors.conveneText = translate.field_required;
		} else {
			if(CBX.checkForUnclosedBraces(council.conveneText)){
				errors.conveneText = translate.revise_text;
				toast(
					<LiveToast
						message={translate.revise_text}
					/>, {
						position: toast.POSITION.TOP_RIGHT,
						autoClose: true,
						className: "errorToast"
					}
				);
			}
		}

		const hasError = Object.keys(errors).length > 0;

		setState({
			...state,
			alert: hasError
		});
		setErrors(errors);

		return hasError;
	}

	const showPlaceModal = () => {
		setPlaceModal(true);
	}

	const closePlaceModal = () => {
		setPlaceModal(false);
	}

	const showStatuteDetailsModal = () => {
		setStatuteModal(true);
	}

	const closeStatuteDetailsModal = () => {
		setStatuteModal(false);
	}

	const checkAssociatedCensus = statuteId => {
		const statute = data.companyStatutes.find(statute => statute.id === statuteId);
		if(!!statute.censusId){
			setCensusModal(true);
		}
	}

	const { companyStatutes, draftTypes } = data;

	let statute = {};
	if(!!council.id){
		statute = data.council.statute;
	}

	let tags = [];



	if(CBX.hasSecondCall(statute)){
		tags = [{
			value: moment(council.dateStart).format(
				"LLL"
			),
			label: translate["1st_call_date"]
		}, {
			value: moment(council.dateStart2NdCall).format(
				"LLL"
			),
			label: translate["2nd_call_date"]
		}]
	} else {
		tags.push({
			value: moment(council.dateStart).format(
				"LLL"
			),
			label: translate.date
		});
	}

	tags = [...tags,
		{
			value: company.businessName,
			label: translate.business_name
		},
		{
			value: council.remoteCelebration === 1? translate.remote_celebration : `${council.street}, ${
				council.country
			}`,
			label: translate.new_location_of_celebrate
		}
	];

	if(council.remoteCelebration !== 1){
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

	const updateConveneDates = (oldDate, newDate, old2Date, new2Date) => {
		const text = council.conveneText || '';
		const oldDateText = moment(new Date(oldDate)).format("LLL");
		const newDateText = moment(new Date(newDate)).format("LLL");
		const old2DateText = moment(new Date(old2Date)).format("LLL");
		const new2DateText = moment(new Date(new2Date)).format("LLL");
		const replacedText = text
			.replace(oldDateText, newDateText)
			.replace(old2DateText, new2DateText);

		updateState({
			conveneText: replacedText
		});
		editor.current.setValue(replacedText);
	}

	const updateDate = (firstDate = council.dateStart, secondDate = council.dateStart2NdCall) => {
 		updateState({
			dateStart: firstDate,
			dateStart2NdCall: secondDate,
		});
	};


	return (
		<React.Fragment>
			<EditorStepLayout
				body={
					!council.id && !data.errors?
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
							{
								<LoadFromPreviousCouncil
									council={council}
									translate={translate}
									company={company}
									companyStatutes={companyStatutes}
									refetch={reloadData}
								/>
							}
							<Grid>
								<GridItem xs={12} md={4} lg={4} style={{paddingRight: '3.5em' }}>
									<SelectInput
										required
										floatingText={translate.council_type}
										value={data.council.statute.statuteId || ""}
										onChange={event =>
											changeStatute(+event.target.value)
										}
									>
										{companyStatutes.map((statute, index) => {
											return (
												<MenuItem
													value={statute.id}
													key={`statutes_${statute.id}`}
												>
													{translate[statute.title] ||
														statute.title}
												</MenuItem>
											);
										})}
									</SelectInput>
									<div onClick={showStatuteDetailsModal} style={{ cursor: 'pointer', color: secondary}}>
										Ver detalles
									</div>
								</GridItem>
								<GridItem
									xs={12}
									md={8}
									lg={8}
									style={{ display: "flex", flexDirection: 'row', alignItems: 'center' }}
								>
									<BasicButton
										text={translate.change_location}
										id={'change-place'}
										color={secondary}
										textStyle={{
											color: "white",
											fontWeight: "600",
											fontSize: "0.9em",
											textTransform: "none"
										}}
										textPosition="after"
										onClick={showPlaceModal}
										icon={
											<ButtonIcon type="location_on" color="white" />
										}
									/>
									<h6 style={{ paddingTop: "0.8em", marginLeft: '1em' }}>
										<b>{`${translate.new_location_of_celebrate}: `}</b>
										{council.remoteCelebration === 1
											? translate.remote_celebration
											: `${council.street}, ${council.country}`}
									</h6>
								</GridItem>

								<GridItem xs={12} md={4} lg={4} style={{marginTop: '1.3em'}}>
									<DateTimePicker
										required
										onChange={date => {
											const newDate = new Date(date);
											const dateString = newDate.toISOString();
											updateDate(dateString);
										}}
										minDateMessage={""}
										errorText={errors.dateStart}
										acceptText={translate.accept}
										cancelText={translate.cancel}
										minDate={Date.now()}
										label={translate["1st_call_date"]}
										value={council.dateStart}
									/>
								</GridItem>
								<GridItem xs={12} md={4} lg={4} style={{marginTop: '1.3em'}}>
									{CBX.hasSecondCall(statute) && (
										<DateTimePicker
											required
											minDate={
												!!council.dateStart
													? new Date(council.dateStart)
													: new Date()
											}
											errorText={errors.dateStart2NdCall}
											onChange={date => {
												const newDate = new Date(date);
												const dateString = newDate.toISOString();
												updateDate(undefined, dateString);
											}}
											minDateMessage={""}
											acceptText={translate.accept}
											cancelText={translate.cancel}
											label={translate["2nd_call_date"]}
											value={council.dateStart2NdCall}
										/>
									)}
								</GridItem>
								<GridItem xs={12} md={10} lg={10} style={{marginTop: '2em'}}>
									<TextInput
										required
										floatingText={translate.meeting_title}
										type="text"
										placeholder="Título que será el que aparezca en el acta"
										errorText={errors.name}
										value={council.name || ""}
										onChange={event =>
											updateState({
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
										errorText={errors.conveneText}
										required
										loadDraft={
											<LoadDraftModal
												translate={translate}
												companyId={company.id}
												loadDraft={loadDraft}
												statute={statute}
												statutes={companyStatutes}
												draftType={
													draftTypes.filter(
														draft =>
															draft.label === "convene_header"
													)[0].value
												}
											/>
										}
										tags={tags}
										floatingText={translate.convene_info}
										value={council.conveneText || ""}
										onChange={value =>
											updateState({
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
										errorText={errors.conveneFooter}
										tags={tags}
										loadDraft={
											<LoadDraftModal
												translate={translate}
												companyId={company.id}
												loadDraft={loadFooterDraft}
												statute={statute}
												statutes={companyStatutes}
												draftType={
													draftTypes.filter(draft => draft.label === "convene_footer")[0].value
												}
											/>
										}
										floatingText={translate.convene_footer}
										value={council.conveneFooter || ""}
										onChange={value =>
											updateState({
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
								title={council.statute? translate[council.statute.title] || council.statute.title : ''}
								bodyText={
									<StatuteDisplay
										statute={council.statute}
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
							loading={state.loading}
							success={state.success}
							reset={resetButtonStates}
							color={secondary}
							textStyle={{
								color: "white",
								fontWeight: "700",
								fontSize: "0.9em",
								textTransform: "none",
								marginRight: "0.6em"
							}}
							icon={<ButtonIcon type="save" color="white" />}
							textPosition="after"
							onClick={() => updateCouncil(1)}
						/>
						<BasicButton
							floatRight
							text={translate.next}
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
		</React.Fragment>
	);

}

const changeCensus = gql`
	mutation changeCensus($councilId: Int!, $censusId: Int!) {
		changeCensus(councilId: $councilId, censusId: $censusId){
			success
		}
	}
`;

export default compose(
	graphql(councilStepOne, {
		name: "data",
		options: props => ({
			variables: {
				id: props.councilID,
				companyId: props.company.id
			},
			notifyOnNetworkStatusChange: true
		})
	}),
	graphql(changeCensus, {
		name: 'changeCensus'
	}),

	graphql(changeStatute, {
		name: "changeStatute"
	}),

	graphql(updateCouncil, {
		name: "updateCouncil"
	})
)(StepNotice);