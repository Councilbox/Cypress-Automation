import React from "react";
import { graphql } from "react-apollo";
import {
	AlertConfirm,
	BasicButton,
	Grid,
	GridItem,
	MajorityInput,
	SelectInput,
	TextInput
} from "../../../../../displayComponents/index";
import RichTextInput from "../../../../../displayComponents/RichTextInput";
import { MenuItem } from "material-ui";
import { updateAgenda } from "../../../../../queries/agenda";
import * as CBX from "../../../../../utils/CBX";
import LoadDraft from "../../../../company/drafts/LoadDraft";
import { getSecondary } from "../../../../../styles/colors";
import { checkRequiredFieldsAgenda } from "../../../../../utils/validation";
import { toast } from 'react-toastify';
import { TAG_TYPES } from "../../../../company/drafts/draftTags/utils";

class PointEditor extends React.Component {

	state = {
		data: {
			agendaSubject: "",
			subjectType: "",
			description: ""
		},
		loadDraft: false,
		errors: {
			agendaSubject: "",
			subjectType: "",
			description: "",
			majorityType: "",
			majority: "",
			majorityDivider: ""
		}
	};

	componentWillReceiveProps(nextProps) {
		this.setState({
			data: {
				...nextProps.agenda
			}
		});
	}


	loadDraft = async draft => {
		const correctedText = await CBX.changeVariablesToValues(draft.text, {
			company: this.props.company,
			council: this.props.council
		}, this.props.translate);

		const { segments } = draft.tags.agenda;
		let majorityType = 0, subjectType = 0;

		if(segments[1]){
			subjectType = this.props.votingTypes.filter(type => draft.tags.agenda.segments[1] === type.label)[0].value
		}

		if(segments[2]){
			majorityType = this.props.majorityTypes.filter(type => draft.tags.agenda.segments[2] === type.label)[0].value
		}


		this.updateState({
			description: correctedText,
			majority: draft.majority,
			majorityType,
			majorityDivider: draft.majorityDivider,
			subjectType,
			agendaSubject: draft.title
		});
		this.editor.setValue(correctedText);
	};

	saveChanges = async () => {
		if (!this.checkRequiredFields()) {
			const { __typename, items, options, ballots, ...data } = this.state.data;
			const response = await this.props.updateAgenda({
				variables: {
					agenda: {
						...data
					}
				}
			});
			if (response) {
				this.props.refetch();
				this.props.requestClose();
			}
		}
	};

	updateState = object => {
		this.setState({
			data: {
				...this.state.data,
				...object
			},
			loadDraft: false
		});
	};

	_renderModalBody = () => {
		const secondary = getSecondary();
		const {
			translate,
			votingTypes,
			statute,
			draftTypes,
			council,
			company,
			companyStatutes
		} = this.props;
		const errors = this.state.errors;
		const agenda = this.state.data;
		const filteredTypes = CBX.filterAgendaVotingTypes(votingTypes, statute, council);

		return (
			<div
				style={{
					width: "70vw"
				}}
			>
				{this.state.loadDraft && (
					<LoadDraft
						translate={translate}
						companyId={company.id}
						loadDraft={this.loadDraft}
						statute={statute}
						defaultTags={{
							"agenda": {
								active: true,
								type: TAG_TYPES.DRAFT_TYPE,
								name: 'agenda',
								label: translate.agenda
							},
							...CBX.generateStatuteTag(statute, translate)
						}}
						statutes={companyStatutes}
						draftTypes={draftTypes}
						draftType={1}
					/>
				)}

				<div style={{ display: this.state.loadDraft && "none" }}>
					<Grid>
						<GridItem xs={12} md={9} lg={9}>
							<TextInput
								floatingText={translate.convene_header}
								type="text"
								errorText={errors.agendaSubject}
								value={agenda.agendaSubject}
								onChange={event =>
									this.updateState({
										agendaSubject: event.target.value
									})
								}
								required
							/>
						</GridItem>
						<GridItem xs={12} md={3} lg={3}>
							<SelectInput
								floatingText={translate.type}
								value={agenda.subjectType}
								errorText={errors.subjectType}
								onChange={event =>
									this.updateState({
										subjectType: event.target.value
									})
								}
								required
							>
								{filteredTypes.map(voting => {
									return (
										<MenuItem
											value={voting.value}
											key={`voting${voting.value}`}
										>
											{translate[voting.label]}
										</MenuItem>
									);
								})}
							</SelectInput>
						</GridItem>
					</Grid>

					{CBX.hasVotation(agenda.subjectType) && (
						<Grid>
							<GridItem xs={6} lg={3} md={3}>
								<SelectInput
									floatingText={translate.majority_label}
									value={"" + agenda.majorityType}
									errorText={errors.majorityType}
									onChange={event =>
										this.updateState({
											majorityType: +event.target.value
										})
									}
									required
								>
									{this.props.majorityTypes.map(majority => {
										return (
											<MenuItem
												value={"" + majority.value}
												key={`majorityType_${
													majority.value
												}`}
											>
												{translate[majority.label]}
											</MenuItem>
										);
									})}
								</SelectInput>
							</GridItem>
							<GridItem xs={6} lg={3} md={3}>
								{CBX.majorityNeedsInput(
									agenda.majorityType
								) && (
									<MajorityInput
										type={agenda.majorityType}
										value={agenda.majority}
										divider={agenda.majorityDivider}
										majorityError={errors.majority}
										dividerError={errors.majorityDivider}
										onChange={value =>
											this.updateState({
												majority: +value
											})
										}
										onChangeDivider={value =>
											this.updateState({
												majorityDivider: +value
											})
										}
									/>
								)}
							</GridItem>
						</Grid>
					)}

					<RichTextInput
						ref={editor => (this.editor = editor)}
						floatingText={translate.description}
						type="text"
						translate={translate}
						loadDraft={
							<BasicButton
								text={translate.load_draft}
								color={secondary}
								textStyle={{
									color: "white",
									fontWeight: "600",
									fontSize: "0.8em",
									textTransform: "none",
									marginLeft: "0.4em",
									minHeight: 0,
									lineHeight: "1em"
								}}
								textPosition="after"
								onClick={() =>
									this.setState({ loadDraft: true })
								}
							/>
						}
						tags={[
							{
								value: `${council.street}, ${council.country}`,
								label: translate.new_location_of_celebrate
							},
							{
								value: company.countryState,
								label: translate.company_new_country_state
							},
							{
								value: company.city,
								label: translate.company_new_locality
							}
						]}
						errorText={errors.description}
						value={agenda.description}
						onChange={value =>
							this.updateState({
								description: value
							})
						}
					/>
				</div>
			</div>
		);
	};

	checkRequiredFields() {
		const { translate } = this.props;
		const agenda = this.state.data;
		let errors = checkRequiredFieldsAgenda(agenda, translate, toast);
		this.setState({
			errors: errors.errors
		});
		return errors.hasError;
	}

	render() {
		const { open, translate, requestClose } = this.props;

		return (
			<AlertConfirm
				requestClose={this.state.loadDraft? () => this.setState({loadDraft: false}) : requestClose}
				open={open}
				acceptAction={this.saveChanges}
				buttonAccept={translate.accept}
				buttonCancel={translate.cancel}
				bodyText={this._renderModalBody()}
				title={translate.edit}
			/>
		);
	}
}

export default graphql(updateAgenda, { name: "updateAgenda" })(PointEditor);
