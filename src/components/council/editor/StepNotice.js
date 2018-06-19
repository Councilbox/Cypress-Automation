import React, { Component } from "react";
import { MenuItem } from "material-ui";
import {
	BasicButton,
	ButtonIcon,
	DateTimePicker,
	ErrorAlert,
	Grid,
	GridItem,
	LoadingSection,
	RichTextInput,
	SelectInput,
	TextInput
} from "../../../displayComponents";
import { getPrimary, getSecondary } from "../../../styles/colors";
import PlaceModal from "./PlaceModal";
import LoadDraftModal from "../../company/drafts/LoadDraftModal";
import { compose, graphql } from "react-apollo";
import { changeStatute, councilStepOne, updateCouncil } from "../../../queries";
import * as CBX from "../../../utils/CBX";
import moment from "moment";

class StepNotice extends Component {

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
				dateStart2NdCall: "",
				country: "",
				countryState: "",
				city: "",
				zipcode: "",
				conveneText: "",
				street: ""
			}
		};
	}

	componentDidMount() {
		this.props.data.loading = true;
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
			this.updateCouncil(2);
			this.props.nextStep();
		}
	};

	updateCouncil = step => {
		const { __typename, statute, ...council } = this.state.data;
		this.props.updateCouncil({
			variables: {
				council: {
					...council,
					step: step
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

	updateState = object => {
		this.setState({
			data: {
				...this.state.data,
				...object
			}
		});
	};

	updateError = object => {
		this.setState({
			errors: {
				...this.state.errors,
				...object
			}
		});
	};

	changeStatute = async statuteId => {
		const response = await this.props.changeStatute({
			variables: {
				councilId: this.props.councilID,
				statuteId: statuteId
			}
		});

		if (response) {
			this.props.data.refetch();
			this.updateDate();
		}
	};
	updateDate = (
		firstDate = this.state.data.dateStart,
		secondDate = this.state.data.dateStart2NdCall
	) => {
		const { translate } = this.props;
		this.updateState({
			dateStart: firstDate,
			dateStart2NdCall: secondDate
		});
		if (!CBX.checkSecondDateAfterFirst(firstDate, secondDate)) {
			this.updateError({
				dateStart2NdCall: translate["2nd_call_date_changed"]
			});
			this.updateState({
				dateStart: firstDate,
				dateStart2NdCall: CBX.addMinimunDistance(
					firstDate,
					this.props.data.council.statute
				)
			});
		} else {
			if (
				!CBX.checkMinimunDistanceBetweenCalls(
					firstDate,
					secondDate,
					this.props.data.council.statute
				)
			) {
				this.updateError({
					dateStart2NdCall: translate.new_statutes_hours_warning.replace(
						"{{hours}}",
						this.props.data.council.statute
							.minimumSeparationBetweenCall
					)
				});
			}
		}
	};
	
	loadDraft = draft => {
		const correctedText = CBX.changeVariablesToValues(draft.text, {
			company: this.props.company,
			council: this.state.data
		});
		this.updateState({
			conveneText: correctedText
		});
		this.refs.editor.setValue(correctedText);
	};

	checkRequiredFields() {
		const { translate } = this.props;
		const { data } = this.state;

		let errors = {
			name: "",
			dateStart: "",
			dateStart2NdCall: "",
			conveneText: ""
		};

		let hasError = false;

		if (!data.name) {
			hasError = true;
			errors.name = translate.new_enter_title;
		}

		if (!data.dateStart) {
			hasError = true;
			errors.dateStart = translate.field_required;
		}

		if (
			!data.conveneText ||
			data.conveneText.replace(/<\/?[^>]+(>|$)/g, "").length <= 0
		) {
			hasError = true;
			errors.conveneText = translate.field_required;
		}

		this.setState({
			alert: true,
			errors: errors
		});

		return hasError;
	}

	render() {
		const { translate, company } = this.props;
		const { loading, companyStatutes, draftTypes } = this.props.data;
		const council = this.state.data;
		const { errors } = this.state;
		const primary = getPrimary();
		const secondary = getSecondary();

		if (loading) {
			return (
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
			);
		}

		const { statute } = this.props.data.council;

		return (
			<div
				style={{
					width: "100%",
					height: "100%"
				}}
			>
				<Grid>
					<GridItem xs={12} md={4} lg={4} style={{paddingRight: '3.5em'}}>
						<SelectInput
							required
							floatingText={translate.council_type}
							value={
								this.props.data.council.statute.statuteId || ""
							}
							onChange={event =>
								this.changeStatute(+event.target.value)
							}
						>
							{companyStatutes.map(statute => {
								return (
									<MenuItem
										value={+statute.id}
										key={`statutes_${statute.id}`}
									>
										{translate[statute.title] ||
											statute.title}
									</MenuItem>
								);
							})}
						</SelectInput>
					</GridItem>
					<GridItem
						xs={12}
						md={8}
						lg={8}
						style={{ display: "flex", flexDirection: 'row', alignItems: 'center' }}
					>
						<BasicButton
							text={translate.change_location}
							color={secondary}
							textStyle={{
								color: "white",
								fontWeight: "600",
								fontSize: "0.9em",
								textTransform: "none"
							}}
							textPosition="after"
							onClick={() => this.setState({ placeModal: true })}
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

					<GridItem xs={12} md={4} lg={4}>
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
					</GridItem>
					<GridItem xs={12} md={4} lg={4}>
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
									this.updateDate(undefined, dateString);
								}}
								minDateMessage={""}
								acceptText={translate.accept}
								cancelText={translate.cancel}
								label={translate["2nd_call_date"]}
								value={council.dateStart2NdCall}
							/>
						)}
					</GridItem>
					<GridItem xs={12} md={10} lg={10} style={{marginTop: '0.8em'}}>
						<TextInput
							required
							floatingText={translate.table_councils_name}
							type="text"
							errorText={errors.name}
							value={council.name || ""}
							onChange={event =>
								this.updateState({
									name: event.nativeEvent.target.value
								})
							}
						/>
					</GridItem>
					<GridItem xs={12} md={12} lg={12}>
						<RichTextInput
							ref="editor"
							errorText={errors.conveneText}
							required
							loadDraft={
								<LoadDraftModal
									translate={translate}
									companyId={company.id}
									loadDraft={this.loadDraft}
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
							tags={[
								{
									value: moment(council.dateStart).format(
										"LLL"
									),
									label: translate.date
								},
								{
									value: company.businessName,
									label: translate.business_name
								},
								{
									value: `${council.street}, ${
										council.country
									}`,
									label: translate.new_location_of_celebrate
								},
								{
									value: company.country,
									label: translate.company_new_country
								}
							]}
							floatingText={translate.convene_info}
							value={council.conveneText || ""}
							onChange={value =>
								this.updateState({
									conveneText: value
								})
							}
						/>
					</GridItem>
					<GridItem
						xs={12}
						md={12}
						lg={12}
						style={{ marginTop: "1em" }}
					>
						<BasicButton
							floatRight
							text={translate.next}
							color={primary}
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
							onClick={this.nextPage}
						/>
						<BasicButton
							floatRight
							text={translate.save}
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
							onClick={() => this.updateCouncil(1)}
						/>
					</GridItem>
				</Grid>
				<PlaceModal
					open={this.state.placeModal}
					close={() => this.setState({ placeModal: false })}
					place={this.state.place}
					countries={this.props.data.countries}
					translate={this.props.translate}
					saveAndClose={this.savePlaceAndClose}
					council={council}
				/>
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

	graphql(changeStatute, {
		name: "changeStatute"
	}),

	graphql(updateCouncil, {
		name: "updateCouncil"
	})
)(StepNotice);
