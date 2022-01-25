import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import { MenuItem } from 'material-ui';
import { toast } from 'react-toastify';
import gql from 'graphql-tag';
import {
	AlertConfirm,
	BasicButton,
	Grid,
	GridItem,
	MajorityInput,
	SelectInput,
	TextInput
} from '../../../../../displayComponents/index';
import RichTextInput from '../../../../../displayComponents/RichTextInput';
import { updateAgenda } from '../../../../../queries/agenda';
import * as CBX from '../../../../../utils/CBX';
import LoadDraft from '../../../../company/drafts/LoadDraft';
import { getSecondary } from '../../../../../styles/colors';
import { checkRequiredFieldsAgenda, checkValidMajority } from '../../../../../utils/validation';
import PointAttachments from './PointAttachments';
import { addAgendaAttachment } from '../../../../../queries';
import { useOldState } from '../../../../../hooks';
import DeleteAgendaButton from './DeleteAgendaButton';
import { AGENDA_TYPES } from '../../../../../constants';


const PointEditor = ({
	agenda, translate, company, council, requestClose, open, ...props
}) => {
	const [state, setState] = useOldState({
		...agenda,
		errors: {
			agendaSubject: '',
			subjectType: '',
			description: '',
			attached: '',
			majorityType: '',
			majority: '',
			majorityDivider: ''
		}
	});
	const [attachments, setAttachments] = React.useState([...agenda.attachments] || []);
	const [attachmentsToRemove, setAttachmentsToRemove] = React.useState([]);
	const [loadDraftModal, setLoadDraftModal] = React.useState(false);
	const editor = React.useRef();
	const secondary = getSecondary();

	const loadDraft = async draft => {
		const correctedText = await CBX.changeVariablesToValues(draft.text, {
			company,
			council
		}, translate);
		let majorityType = 0;
		let subjectType = 0;

		if (draft.tags.agenda) {
			const { segments } = draft.tags.agenda;
			if (segments[1]) {
				subjectType = props.votingTypes.filter(type => draft.tags.agenda.segments[1] === type.label)[0].value;
			}

			if (segments[2]) {
				majorityType = props.majorityTypes.filter(type => draft.tags.agenda.segments[2] === type.label)[0].value;
			}
		}

		setState({
			...(state.subjectType === AGENDA_TYPES.CONFIRMATION_REQUEST ? {
				description: correctedText,
				agendaSubject: draft.title,
			} : {
				description: correctedText,
				majority: draft.majority,
				majorityType,
				majorityDivider: draft.majorityDivider,
				subjectType,
				agendaSubject: draft.title,
			})
		});
		editor.current.setValue(correctedText);
	};

	function checkRequiredFields() {
		const newErrors = checkRequiredFieldsAgenda(state, translate, toast, attachments);
		const majorityCheckResult = checkValidMajority(agenda.majority, agenda.majorityDivider, agenda.majorityType);
		setState({
			errors: newErrors.errors,
			majorityError: majorityCheckResult.message
		});
		return newErrors.hasError || majorityCheckResult.error;
	}

	const saveChanges = async () => {
		if (!checkRequiredFields()) {
			const {
				__typename, items, options, ballots, attachments: a, qualityVoteSense, votingsRecount, errors, ...data
			} = state;
			const response = await props.updateAgenda({
				variables: {
					agenda: {
						...data
					}
				}
			});
			if (attachments.length > 0) {
				// eslint-disable-next-line no-underscore-dangle
				await Promise.all(attachments.filter(attachment => !attachment.__typename).map(attachment => {
					if (attachment.filename) {
						const fileInfo = {
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
					}
					const fileInfo = {
						filename: attachment.name,
						filesize: attachment.filesize.toString(),
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
					});
				}));
			}

			if (attachmentsToRemove.length > 0) {
				await Promise.all(attachmentsToRemove.filter(item => item.id).map(item => props.client.mutate({
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
				})));
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


	const renderModalBody = () => {
		const {
			votingTypes,
			statute,
			draftTypes,
			companyStatutes
		} = props;
		// eslint-disable-next-line no-shadow
		const agenda = state;
		const filteredTypes = CBX.filterAgendaVotingTypes(votingTypes, statute, council);

		return (
			<div
				style={{
					width: '70vw'
				}}
			>
				{loadDraftModal && (
					<LoadDraft
						translate={translate}
						companyId={company.id}
						loadDraft={loadDraft}
						statute={statute}
						defaultTags={{
							...(state.subjectType === AGENDA_TYPES.CONFIRMATION_REQUEST ? {
								confirmation_request: {
									active: true,
									childs: null,
									label: translate.confirmation_request,
									name: 'confirmation_request',
									type: 3
								},
							} : {
								agenda: {
									active: true,
									type: 2,
									name: 'agenda',
									label: translate.agenda
								},
							}),
							...CBX.generateStatuteTag(statute, translate)
						}}
						statutes={companyStatutes}
						draftTypes={draftTypes}
						draftType={1}
					/>
				)}

				<div style={{ display: loadDraftModal && 'none' }}>
					<Grid>
						<GridItem xs={12} md={9} lg={9}>
							<TextInput
								floatingText={translate.title}
								type="text"
								id="agenda-editor-title-input"
								errorText={state.errors.agendaSubject}
								value={agenda.agendaSubject}
								onChange={event => updateState({
									agendaSubject: event.target.value
								})
								}
								required
							/>
						</GridItem>
						<GridItem xs={12} md={3} lg={3}>
							{agenda.subjectType === AGENDA_TYPES.CONFIRMATION_REQUEST ?
								<SelectInput
									floatingText={translate.type}
									id="agenda-editor-type-select"
									value={AGENDA_TYPES.CONFIRMATION_REQUEST}
									disabled={true}
									onChange={event => updateState({
										subjectType: +event.target.value
									})
									}
									required
								>
									<MenuItem
										id={`agenda-editor-type-${AGENDA_TYPES.CONFIRMATION_REQUEST}`}
										value={AGENDA_TYPES.CONFIRMATION_REQUEST}
									>
										{translate.confirmation_request}
									</MenuItem>
								</SelectInput>
								: <SelectInput
									floatingText={translate.type}
									value={agenda.subjectType}
									id="agenda-editor-type-select"
									errorText={state.errors.subjectType}
									onChange={event => updateState({
										subjectType: event.target.value
									})
									}
									required
								>
									{filteredTypes.map(voting => (
										<MenuItem
											value={voting.value}
											id={`agenda-editor-type-${voting.value}`}
											key={`voting${voting.value}`}
										>
											{translate[voting.label]}
										</MenuItem>
									))}
								</SelectInput>
							}
						</GridItem>
					</Grid>

					{(CBX.hasVotation(agenda.subjectType) && !CBX.isConfirmationRequest(agenda.subjectType)) && (
						<Grid>
							<GridItem xs={6} lg={3} md={3}>
								<SelectInput
									floatingText={translate.majority_label}
									value={`${agenda.majorityType}`}
									id="agenda-editor-majority-select"
									errorText={state.errors.majorityType}
									onChange={event => updateState({
										majorityType: +event.target.value
									})
									}
									required
								>
									{props.majorityTypes.map(majority => (
										<MenuItem
											id={`agenda-editor-majority-${majority.value}`}
											value={`${majority.value}`}
											key={`majorityType_${majority.value
												}`}
										>
											{translate[majority.label]}
										</MenuItem>
									))}
								</SelectInput>
							</GridItem>
							<GridItem xs={6} lg={3} md={3} style={{ display: 'flex', alignItems: 'flex-end' }}>
								{CBX.majorityNeedsInput(
									agenda.majorityType
								) && (
									<MajorityInput
										type={agenda.majorityType}
										value={agenda.majority}
										divider={agenda.majorityDivider}
										majorityError={state.errors.majority}
										dividerError={state.errors.majorityError}
										onChange={value => updateState({
											majority: +value
										})
										}
										onChangeDivider={value => updateState({
											majorityDivider: +value
										})
										}
									/>
								)}
							</GridItem>
						</Grid>
					)}
					<div style={{ marginBottom: '1.6em' }}>
						<PointAttachments
							translate={translate}
							setAttachments={setAttachments}
							attachments={attachments}
							company={company}
							deletedAttachments={attachmentsToRemove}
							setDeletedAttachments={setAttachmentsToRemove}
							errorText={state?.errors?.attached}
						/>
					</div>
					<RichTextInput
						ref={editor}
						floatingText={translate.description}
						type="text"
						id="agenda-editor-description"
						translate={translate}
						loadDraft={
							<BasicButton
								text={translate.load_draft}
								color={secondary}
								textStyle={{
									color: 'white',
									fontWeight: '600',
									fontSize: '0.8em',
									textTransform: 'none',
									marginLeft: '0.4em',
									minHeight: 0,
									lineHeight: '1em'
								}}
								textPosition="after"
								onClick={() => setLoadDraftModal(true)}
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
						errorText={state.errors.description}
						value={agenda.description}
						onChange={value => updateState({
							description: value
						})
						}
					/>
				</div>
			</div>
		);
	};

	return (
		<AlertConfirm
			requestClose={loadDraftModal ? () => setLoadDraftModal(false) : requestClose}
			open={open}
			acceptAction={saveChanges}
			extraActions={
				props.deleteButton
				&& <DeleteAgendaButton
					agenda={agenda}
					requestClose={requestClose}
					refetch={props.refetch}
					council={council}
					translate={translate}
				/>
			}
			buttonAccept={translate.accept}
			buttonCancel={translate.cancel}
			bodyText={renderModalBody()}
			title={translate.edit}
		/>
	);
};

export default graphql(updateAgenda, { name: 'updateAgenda' })(withApollo(PointEditor));
