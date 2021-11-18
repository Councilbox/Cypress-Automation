import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { MenuItem } from 'material-ui';
import { toast } from 'react-toastify';
import { withRouter } from 'react-router-dom';
import {
	AlertConfirm,
	BasicButton,
	Grid,
	GridItem,
	MajorityInput,
	SelectInput,
	TextInput,
	UnsavedChangesModal
} from '../../../../../displayComponents/index';
import RichTextInput from '../../../../../displayComponents/RichTextInput';
import LoadDraft from '../../../../company/drafts/LoadDraft';
import { addAgenda as addAgendaMutation } from '../../../../../queries/agenda';
import * as CBX from '../../../../../utils/CBX';
import { getSecondary } from '../../../../../styles/colors';
import { checkRequiredFieldsAgenda, checkValidMajority } from '../../../../../utils/validation';
import { useOldState } from '../../../../../hooks';
import PointAttachments from './PointAttachments';
import { addAgendaAttachment } from '../../../../../queries';
import { AGENDA_TYPES } from '../../../../../constants';

const defaultValues = {
	agendaSubject: '',
	subjectType: 0,
	description: '',
	majority: null,
	majorityType: 1,
	majorityDivider: null
};


const NewAgendaPointModal = ({
	translate, votingTypes, agendas, statute, council, company, companyStatutes, confirmation, showLoadDraft = true, ...props
}) => {
	const filteredTypes = CBX.filterAgendaVotingTypes(votingTypes, statute, council);
	const secondary = getSecondary();
	const [attachments, setAttachments] = React.useState([]);
	const [state, setState] = useOldState({
		newPoint: {
			...defaultValues,
			subjectType: confirmation ? AGENDA_TYPES.CONFIRMATION_REQUEST : filteredTypes[0].value
		},
		loadDraft: false,
		newPointModal: false,
		saveAsDraft: false,

		errors: {
			agendaSubject: '',
			subjectType: '',
			description: ''
		}
	});
	const editor = React.useRef(null);
	const [sending, setSending] = React.useState(false);
	const [showConfirmModal, setShowConfirmModal] = React.useState(false);

	const close = () => {
		setState({
			newPoint: defaultValues,
			newPointModal: false,
			loadDraft: false,
			errors: {
				agendaSubject: '',
				subjectType: '',
				description: ''
			}
		});
		setSending(false);
		props.requestClose();
	};

	function checkRequiredFields() {
		const agenda = state.newPoint;
		const errors = checkRequiredFieldsAgenda(agenda, translate, toast);
		const majorityCheckResult = checkValidMajority(agenda.majority, agenda.majorityDivider, agenda.majorityType);
		setState({
			errors: errors.errors,
			majorityError: majorityCheckResult.message
		});
		return errors.hasError || majorityCheckResult.error;
	}

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

			if (attachments.length > 0) {
				await Promise.all(attachments.map(attachment => {
					if (attachment.filename) {
						const fileInfo = {
							...attachment,
							state: 0,
							agendaId: response.data.addAgenda.id,
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
						agendaId: response.data.addAgenda.id,
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

			if (response) {
				setState({ loadDraft: false });
				setSending(false);
				close();
				props.refetch();
			}
		}
	};

	const updateState = object => {
		setState({
			newPoint: {
				...state.newPoint,
				...object
			},
			loadDraft: false
		});
	};

	const loadDraft = async draft => {
		const correctedText = await CBX.changeVariablesToValues(draft.text, {
			company,
			council
		}, translate);
		let majorityType = 0;
		let subjectType = 0;

		if (draft.tags.agenda) {
			const { segments } = draft.tags.agenda;
			if (segments) {
				if (segments[1]) {
					subjectType = votingTypes.filter(type => draft.tags.agenda.segments[1] === type.label)[0].value;
				}

				if (segments[2]) {
					majorityType = props.majorityTypes.filter(type => draft.tags.agenda.segments[2] === type.label)[0].value;
				}
			}
		}

		updateState({
			...(state.newPoint.subjectType === AGENDA_TYPES.CONFIRMATION_REQUEST ? {
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

	const renderNewPointBody = () => {
		const { errors } = state;
		const agenda = state.newPoint;
		return (
			<div
				style={{
					width: window.innerWidth > 800 ? '800px' : '100%'
				}}
			>
				{state.loadDraft && (
					<LoadDraft
						match={props.match}
						translate={translate}
						companyId={company.id}
						loadDraft={loadDraft}
						statute={statute}
						statutes={companyStatutes}
						draftType={1}
						defaultTags={{
							...(state.newPoint.subjectType === AGENDA_TYPES.CONFIRMATION_REQUEST ? {
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
					/>
				)}

				<div style={{ display: state.loadDraft && 'none' }}>
					<Grid>
						<GridItem xs={12} md={9} lg={9}>
							<TextInput
								floatingText={translate.title}
								type="text"
								errorText={errors.agendaSubject}
								value={agenda.agendaSubject}
								id="agenda-editor-title-input"
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
									value={AGENDA_TYPES.CONFIRMATION_REQUEST}
									disabled={true}
									id="agenda-editor-type-select"
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
									value={`${agenda.subjectType}`}
									id="agenda-editor-type-select"
									onChange={event => updateState({
										subjectType: +event.target.value
									})
									}
									required
								>
									{filteredTypes.map(voting => (
										<MenuItem
											value={`${voting.value}`}
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
					{(CBX.hasVotation(agenda.subjectType) && !props.hideMajority && !CBX.isConfirmationRequest(agenda.subjectType)) && (
						<Grid>
							<GridItem xs={6} lg={4} md={4}>
								<SelectInput
									floatingText={translate.majority_label}
									value={`${agenda.majorityType}`}
									errorText={errors.majorityType}
									id="agenda-editor-majority-select"
									onChange={event => updateState({
										majorityType: +event.target.value
									})
									}
									required
								>
									{props.majorityTypes.map(majority => (
										<MenuItem
											value={`${majority.value}`}
											id={`agenda-editor-majority-${majority.value}`}
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
										majorityError={!!state.majorityError || errors.majority}
										dividerError={!!state.majorityError}
										divider={agenda.majorityDivider}
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
					<div>
						<span style={{ color: 'red' }}>{state.majorityError}</span>
					</div>
					<div style={{ marginBottom: '1.6em' }}>
						<PointAttachments
							translate={translate}
							setAttachments={setAttachments}
							attachments={attachments}
							company={company}
						/>
					</div>
					<RichTextInput
						ref={editor}
						id="agenda-editor-description"
						floatingText={translate.description}
						translate={translate}
						type="text"
						loadDraft={
							showLoadDraft
							&& <BasicButton
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
		<React.Fragment>
			<AlertConfirm
				requestClose={state.newPoint !== defaultValues ? props.requestClose : setShowConfirmModal(true)}
				open={props.open}
				acceptAction={addAgenda}
				buttonAccept={translate.accept}
				buttonCancel={translate.cancel}
				bodyText={renderNewPointBody()}
				title={state.newPoint.subjectType === AGENDA_TYPES.CONFIRMATION_REQUEST ? translate.new_point : translate.new_approving_point}
			/>
			<UnsavedChangesModal
				acceptAction={addAgenda()}
				cancelAction={() => setShowConfirmModal(false)}
				requestClose={() => setShowConfirmModal(false)}
				loadingAction={state.loading}
				open={showConfirmModal}
			/>
		</React.Fragment>
	);
};


export default graphql(addAgendaMutation, {
	name: 'addAgenda'
})(withRouter(withApollo(NewAgendaPointModal)));
