import React from "react";
import { graphql, withApollo } from "react-apollo";
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
import PointAttachments from "./PointAttachments";
import { addAgendaAttachment } from "../../../../../queries";
import { useOldState } from "../../../../../hooks";
import gql from 'graphql-tag';


const PointEditor = ({ agenda, translate, company, council, requestClose, open, ...props }) => {
	const [state, setState] = useOldState({
		...agenda,
	});
	const [attachments, setAttachments] = React.useState([...agenda.attachments] || []);
	const [attachmentsToRemove, setAttachmentsToRemove] = React.useState([]);
	const [loadDraftModal, setLoadDraftModal] = React.useState(false);
	const [errors, setErrors] = useOldState({
		agendaSubject: "",
		subjectType: "",
		description: "",
		majorityType: "",
		majority: "",
		majorityDivider: ""
	});
	const editor = React.useRef();
	const secondary = getSecondary();

	// console.log(attachments);
	// console.log(attachmentsToRemove);


	const loadDraft = async draft => {
		const correctedText = await CBX.changeVariablesToValues(draft.text, {
			company: company,
			council: council
		}, translate);
		let majorityType = 0, subjectType = 0;

		if(draft.tags.agenda){
			const { segments } = draft.tags.agenda;
			if(segments[1]){
				subjectType = props.votingTypes.filter(type => draft.tags.agenda.segments[1] === type.label)[0].value
			}
	
			if(segments[2]){
				majorityType = props.majorityTypes.filter(type => draft.tags.agenda.segments[2] === type.label)[0].value
			}
		}	


		setState({
			description: correctedText,
			majority: draft.majority,
			majorityType,
			majorityDivider: draft.majorityDivider,
			subjectType,
			agendaSubject: draft.title
		});
		editor.current.setValue(correctedText);
	};

	const saveChanges = async () => {
		if (!checkRequiredFields()) {
			const { __typename, items, options, ballots, attachments: a, ...data } = state;
			const response = await props.updateAgenda({
				variables: {
					agenda: {
						...data
					}
				}
			});
			if(attachments.length > 0){
				await Promise.all(attachments.filter(attachment => !attachment.__typename).map(attachment => {
					if(attachment.filename){
						let fileInfo = {
							...attachment,
							state: 0,
							agendaId: agenda.id,
							councilId: council.id
						};

						return props.client.mutate({
							mutation: addAgendaAttachment,
							variables: {
								attachment: fileInfo
							}
						});
					} else {
						let fileInfo = {
							filename: attachment.name,
							filesize: attachment.filesize,
							documentId: attachment.id,
							filetype: attachment.filetype,
							state: 0,
							agendaId: agenda.id,
							councilId: council.id
						};

						return props.client.mutate({
							mutation: gql`
								mutation attachCompanyDocumentToAgenda($attachment: AgendaAttachmentInput){
									attachCompanyDocumentToAgenda(attachment: $attachment){
										id
									}
								}
							`,
							variables: {
								attachment: fileInfo
							}
						})
					}
				}));

				if(attachmentsToRemove.length > 0){
					await Promise.all(attachmentsToRemove.map(item =>{
						return props.client.mutate({
							mutation: gql`
								mutation deleteAgendaAttachment($attachmentId: Int!){
									deleteAgendaAttachment(attachmentId: $attachmentId){
										success
									}
								}
							`,
							variables: {
								attachmentId: item.id
							}
						});
					}));
				}
			}



			if (response) {
				await props.refetch();
				requestClose();
			}
		}
	};

	const updateState = object => {
		setState({
			...state,
			...object
		});
		setLoadDraftModal(false);
	};


	const _renderModalBody = () => {
		const {
			votingTypes,
			statute,
			draftTypes,
			companyStatutes
		} = props;
		const agenda = state;
		const filteredTypes = CBX.filterAgendaVotingTypes(votingTypes, statute, council);

		return (
			<div
				style={{
					width: "70vw"
				}}
			>
				{loadDraftModal && (
					<LoadDraft
						translate={translate}
						companyId={company.id}
						loadDraft={loadDraft}
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

				<div style={{ display: loadDraftModal && "none" }}>
					<Grid>
						<GridItem xs={12} md={9} lg={9}>
							<TextInput
								floatingText={translate.convene_header}
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
								value={agenda.subjectType}
								errorText={errors.subjectType}
								onChange={event =>
									updateState({
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
										divider={agenda.majorityDivider}
										majorityError={errors.majority}
										dividerError={errors.majorityDivider}
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
					<div style={{marginBottom: '1.6em'}}>
						<PointAttachments
							translate={translate}
							setAttachments={setAttachments}
							attachments={attachments}
							company={company}
							deletedAttachments={attachmentsToRemove}
							setDeletedAttachments={setAttachmentsToRemove}
						/>
					</div>
					<RichTextInput
						ref={editor}
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
								onClick={() => setLoadDraftModal(false)}
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
		let errors = checkRequiredFieldsAgenda(state, translate, toast);
		setErrors(errors);
		return errors.hasError;
	}

	return (
		<AlertConfirm
			requestClose={loadDraftModal? () => setLoadDraftModal(false) : requestClose}
			open={open}
			acceptAction={saveChanges}
			buttonAccept={translate.accept}
			buttonCancel={translate.cancel}
			bodyText={_renderModalBody()}
			title={translate.edit}
		/>
	);
}

export default graphql(updateAgenda, { name: "updateAgenda" })(withApollo(PointEditor));
