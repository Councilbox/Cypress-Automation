import React, { Component, Fragment } from "react";
import { graphql } from "react-apollo";

import {
	AlertConfirm,
	BasicButton,
	Grid,
	GridItem,
	MajorityInput,
	RichTextInput,
	SelectInput,
	TextInput
} from "../../../../../displayComponents/index";
import { MenuItem } from "material-ui";
import LoadDraft from "../../../../company/drafts/LoadDraft";
import { addAgenda } from "../../../../../queries/agenda";
import * as CBX from "../../../../../utils/CBX";
import { getSecondary } from "../../../../../styles/colors";
import { checkRequiredFieldsAgenda } from "../../../../../utils/validation";

class NewAgendaPointModal extends Component {
	addAgenda = async () => {
		if (!this.checkRequiredFields()) {
			const { newPoint } = this.state;
			const response = await this.props.addAgenda({
				variables: {
					agenda: {
						councilId: this.props.council.id,
						...newPoint,
						sortable: 1,
						orderIndex: this.props.agendas.length + 1
					}
				}
			});
			if (response) {
				this.setState({ loadDraft: false });
				this.props.refetch();
				this.close();
			}
		}
	};
	close = () => {
		this.setState({
			newPoint: {
				agendaSubject: "",
				subjectType: "",
				description: ""
			},

			newPointModal: false,
			loadDraft: false,

			errors: {
				agendaSubject: "",
				subjectType: "",
				description: ""
			}
		});
	};
	updateState = object => {
		this.setState({
			newPoint: {
				...this.state.newPoint,
				...object
			},
			loadDraft: false
		});
	};
	loadDraft = draft => {
		const correctedText = CBX.changeVariablesToValues(draft.text, {
			company: this.props.company,
			council: this.props.council
		});
		this.updateState({
			description: correctedText,
			majority: draft.majority,
			majorityType: draft.majorityType,
			majorityDivider: draft.majorityDivider,
			subjectType: draft.type,
			agendaSubject: draft.title
		});
		this.editor.setValue(correctedText);
	};
	_renderNewPointBody = () => {
		const {
			translate,
			votingTypes,
			statute,
			council,
			company,
			companyStatutes
		} = this.props;
		const errors = this.state.errors;
		const agenda = this.state.newPoint;
		const filteredTypes = CBX.filterAgendaVotingTypes(votingTypes, statute);
		const secondary = getSecondary();

		return (
			<div
				style={{
					width: "90vw",
					maxWidth: "1000px"
				}}
			>
				{this.state.loadDraft && (
					<LoadDraft
						translate={translate}
						companyId={company.id}
						loadDraft={this.loadDraft}
						statute={statute}
						statutes={companyStatutes}
						draftType={1}
					/>
				)}

				<div style={{ display: this.state.loadDraft && "none" }}>
					<Grid>
						<GridItem xs={12} md={9} lg={9}>
							<TextInput
								floatingText={translate.title}
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
								value={"" + agenda.subjectType}
								onChange={event =>
									this.updateState({
										subjectType: +event.target.value
									})
								}
								required
							>
								{filteredTypes.map(voting => {
									return (
										<MenuItem
											value={"" + voting.value}
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
										style={{
											marginTop: "1em"
										}}
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

	constructor(props) {
		super(props);
		this.state = {
			newPoint: {
				agendaSubject: "",
				subjectType: 0,
				description: "",
				majority: null,
				majorityType: 1,
				majorityDivider: null
			},
			loadDraft: false,
			newPointModal: false,
			saveAsDraft: false,

			errors: {
				agendaSubject: "",
				subjectType: "",
				description: ""
			}
		};
	}

	checkRequiredFields() {
		const { translate } = this.props;
		const agenda = this.state.newPoint;
		let errors = checkRequiredFieldsAgenda(agenda, translate);
		this.setState({
			errors: errors.errors
		});
		return errors.hasError;
	}

	render() {
		const { translate, children } = this.props;

		return (
			<Fragment>
				<div onClick={() => this.setState({ newPointModal: true })}>
					{children}
				</div>
				<AlertConfirm
					requestClose={() => this.close()}
					open={this.state.newPointModal}
					acceptAction={this.addAgenda}
					buttonAccept={translate.accept}
					buttonCancel={translate.cancel}
					bodyText={this._renderNewPointBody()}
					title={translate.new_point}
				/>
			</Fragment>
		);
	}
}

export default graphql(addAgenda, {
	name: "addAgenda"
})(NewAgendaPointModal);
