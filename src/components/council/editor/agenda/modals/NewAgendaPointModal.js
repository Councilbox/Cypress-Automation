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
import LoadDraft from "../../../../company/drafts/LoadDraft";
import { addAgenda } from "../../../../../queries/agenda";
import * as CBX from "../../../../../utils/CBX";
import { getSecondary } from "../../../../../styles/colors";
import { checkRequiredFieldsAgenda, checkValidMajority } from "../../../../../utils/validation";
import { toast } from 'react-toastify';
import { useOldState } from "../../../../../hooks";

const defaultValues = {
	agendaSubject: "",
	subjectType: 0,
	description: "",
	majority: null,
	majorityType: 1,
	majorityDivider: null
}

//let sending = false;

const NewAgendaPointModal = ({ translate, votingTypes, agendas, statute, council, company, companyStatutes, ...props }) => {
	const [state, setState] = useOldState({
		newPoint: defaultValues,
		loadDraft: false,
		newPointModal: false,
		saveAsDraft: false,

		errors: {
			agendaSubject: "",
			subjectType: "",
			description: ""
		}
	});
	const editor = React.useRef(null);

	const [sending, setSending] = React.useState(false);

	const addAgenda = async () => {
		if (!checkRequiredFields() && !sending) {
			setSending(true);
			const { newPoint } = state;
			const response = await props.addAgenda({
				variables: {
					agenda: {
						councilId: council.id,
						...newPoint,
						sortable: 1,
						orderIndex: agendas.length + 1
					}
				}
			});

			if (response) {
				setState({ loadDraft: false });
				setSending(false);
				close();
				props.refetch();
			}
		}
	}

	const close = () => {
		setState({
			newPoint: defaultValues,
			newPointModal: false,
			loadDraft: false,
			errors: {
				agendaSubject: "",
				subjectType: "",
				description: ""
			}
		});
		setSending(false);
		props.requestClose();
	}

	const updateState = object => {
		setState({
			newPoint: {
				...state.newPoint,
				...object
			},
			loadDraft: false
		});
	};

	const loadDraft = draft => {
		const correctedText = CBX.changeVariablesToValues(draft.text, {
			company,
			council
		}, translate);

		updateState({
			description: correctedText,
			majority: draft.majority,
			majorityType: draft.majorityType,
			majorityDivider: draft.majorityDivider,
			subjectType: draft.votationType,
			agendaSubject: draft.title
		});

		editor.current.setValue(correctedText);
	}

	const _renderNewPointBody = () => {
		const errors = state.errors;
		const agenda = state.newPoint;
		const filteredTypes = CBX.filterAgendaVotingTypes(votingTypes, statute, council);
		const secondary = getSecondary();

		return (
			<div
				style={{
					width: window.innerWidth > 800? '800px' : '100%'
				}}
			>
				{state.loadDraft && (
					<LoadDraft
						translate={translate}
						companyId={company.id}
						loadDraft={loadDraft}
						statute={statute}
						statutes={companyStatutes}
						draftType={1}
					/>
				)}

				<div style={{ display: state.loadDraft && "none" }}>
					<Grid>
						<GridItem xs={12} md={9} lg={9}>
							<TextInput
								floatingText={translate.title}
								type="text"
								errorText={errors.agendaSubject}
								value={agenda.agendaSubject}
								onChange={event =>
									updateState({
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
									updateState({
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
										updateState({
											majorityType: +event.target.value
										})
									}
									required
								>
									{props.majorityTypes.map(majority => {
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
										majorityError={!!state.majorityError}
										dividerError={!!state.majorityError}
										divider={agenda.majorityDivider}
										onChange={value =>
											updateState({
												majority: +value
											})
										}
										onChangeDivider={value =>
											updateState({
												majorityDivider: +value
											})
										}
									/>
								)}
							</GridItem>

						</Grid>
					)}
					<div>
						<span style={{color: 'red'}}>{state.majorityError}</span>
					</div>
					<RichTextInput
						ref={editor}
						floatingText={translate.description}
						translate={translate}
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
								onClick={() => setState({ loadDraft: true })}
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
							updateState({
								description: value
							})
						}
					/>
				</div>
			</div>
		);
	};

	function checkRequiredFields() {
		const agenda = state.newPoint;
		let errors = checkRequiredFieldsAgenda(agenda, translate, toast);
		const majorityCheckResult = checkValidMajority(agenda.majority, agenda.majorityDivider, agenda.majorityType);
		setState({
			errors: errors.errors,
			majorityError: majorityCheckResult.message
		});
		return errors.hasError || majorityCheckResult.error;
	}

	return (
		<React.Fragment>
			<AlertConfirm
				requestClose={props.requestClose}
				open={props.open}
				acceptAction={addAgenda}
				buttonAccept={translate.accept}
				buttonCancel={translate.cancel}
				bodyText={_renderNewPointBody()}
				title={translate.new_point}
			/>
		</React.Fragment>
	);

}


export default graphql(addAgenda, {
	name: "addAgenda"
})(NewAgendaPointModal);
