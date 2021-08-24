import React from 'react';
import { Tooltip } from 'material-ui';
import { isMobile } from 'react-device-detect';
import {
	SectionTitle, GridItem, Checkbox, Grid
} from '../../../displayComponents';
import RichTextInput from '../../../displayComponents/RichTextInput';
import { getPrimary, getSecondary } from '../../../styles/colors';
import { TAG_TYPES } from '../drafts/draftTags/utils';
import LoadDraftModal from '../drafts/LoadDraftModal';
import { DRAFT_TYPES } from '../../../constants';
import * as CBX from '../../../utils/CBX';
import SaveDraftModal from '../drafts/SaveDraftModal';
import { ConfigContext } from '../../../containers/AppControl';
import ProxiesTemplates from './docTemplates/ProxiesTemplates';

let timeout;

const getTagsByActSection = (section, translate) => {
	switch (section) {
		case 'conveneHeader':
			return [
				{
					value: '{{dateFirstCall}}',
					label: translate.date
				},
				{
					value: '{{business_name}}',
					label: translate.business_name
				},
				{
					value: '{{address}}',
					label: translate.new_location_of_celebrate
				},
				{
					value: '{{city}}',
					label: translate.company_new_locality
				},
				{
					value: '{{country_state}}',
					label: translate.company_new_country_state
				},
			];

		case 'intro':
			return CBX.getTagVariablesByDraftType(DRAFT_TYPES.INTRO, translate);
		case 'constitution':
			return CBX.getTagVariablesByDraftType(DRAFT_TYPES.CONSTITUTION, translate);
		case 'conclusion':
			return CBX.getTagVariablesByDraftType(DRAFT_TYPES.CONCLUSION, translate);
		default:
			return [];
	}
};


const StatuteDocSection = ({
	statute, updateState, errors, translate, data, ...props
}) => {
	const internalState = React.useRef({
		intro: statute.intro,
		constitution: statute.constitution,
		conclusion: statute.conclusion,
		footer: statute.footer,
		conveneHeader: statute.conveneHeader
	});
	const [saveDraft, setSaveDraft] = React.useState(false);
	const editor = React.useRef();
	const intro = React.useRef();
	const introSecondary = React.useRef();
	const constitutionSecondary = React.useRef();
	const conclusionSecondary = React.useRef();
	const footer = React.useRef();
	const constitution = React.useRef();
	const conclusion = React.useRef();
	const primary = getPrimary();
	const config = React.useContext(ConfigContext);

	React.useEffect(() => {
		if (editor.current) {
			editor.current.setValue(statute.conveneHeader || '');
		}
		if (intro.current) {
			intro.current.setValue(statute.intro || '');
		}
		if (introSecondary.current) {
			introSecondary.current.setValue(statute.introSecondary || '');
		}
		if (footer.current) {
			footer.current.setValue(statute.conveneFooter || '');
		}
		if (constitution.current) {
			constitution.current.setValue(statute.constitution || '');
		}
		if (constitutionSecondary.current) {
			constitutionSecondary.current.setValue(statute.constitutionSecondary || '');
		}
		if (conclusionSecondary.current) {
			conclusionSecondary.current.setValue(statute.conclusionSecondary || '');
		}
		if (conclusion.current) {
			conclusion.current.setValue(statute.conclusion || '');
		}
	}, [statute.id]);

	const closeDraftModal = () => {
		setSaveDraft(false);
	};

	const showSaveDraft = type => () => {
		setSaveDraft(type);
	};

	const handleUpdate = object => {
		clearTimeout(timeout);
		internalState.current = {
			...internalState.current,
			...object
		};

		timeout = setTimeout(() => {
			updateState(internalState.current);
		}, 350);
	};

	const getText = type => {
		const types = {
			CONVENE_HEADER: statute.conveneHeader,
			CONVENE_FOOTER: statute.conveneFooter,
			default: statute[type.toString().toLowerCase()]
		};
		return types[type] ? types[type] : types.default;
	};

	const loadDraft = draft => {
		updateState({
			conveneHeader: draft.text
		});
		editor.current.setValue(draft.text);
	};

	const loadFooterDraft = draft => {
		updateState({
			conveneFooter: draft.text
		});
		footer.current.setValue(draft.text);
	};


	const conclusionTags = React.useMemo(() => getTagsByActSection('conclusion', translate), [statute.id]);
	const introTags = React.useMemo(() => getTagsByActSection('intro', translate), [statute.id]);
	const constitutionTags = React.useMemo(() => getTagsByActSection('constitution', translate), [statute.id]);
	const conveneHeaderTags = React.useMemo(() => getTagsByActSection('conveneHeader', translate), [statute.id]);

	return (
		<>
			<SectionTitle
				text={translate.act_and_documentation}
				color={primary}
				style={{
					marginTop: '2em',
					marginBottom: '1em'
				}}
			/>
			<Grid>
				<GridItem xs={12} md={7} lg={7}>
					<Checkbox
						id="council-type-has-act"
						label={translate.exists_act}
						value={statute.existsAct === 1}
						onChange={(event, isInputChecked) => updateState({
							existsAct: isInputChecked ? 1 : 0
						})
						}
					/>
				</GridItem>
				{(statute.existsAct === 1 && config.autoActActions) &&
					<>
						<GridItem xs={12} md={7} lg={7}>
							<Checkbox
								id="council-type-auto-approve-act"
								label={translate.auto_approve_act}
								value={statute.autoApproveAct === 1}
								onChange={(event, isInputChecked) => updateState({
									autoApproveAct: isInputChecked ? 1 : 0
								})}
							/>
						</GridItem>
						<GridItem xs={12} md={7} lg={7}>
							<Checkbox
								id="council-type-auto-send-act"
								label={translate.auto_send_act}
								disabled={!statute.autoApproveAct}
								value={statute.autoSendAct === 1}
								onChange={(event, isInputChecked) => updateState({
									autoSendAct: isInputChecked ? 1 : 0
								})}
							/>
						</GridItem>
					</>
				}
			</Grid>

			{statute.conveneHeader !== undefined && (
				<React.Fragment>
					<SectionTitle
						text={translate.call_template}
						color={primary}
						style={{
							marginTop: '2em',
							marginBottom: '1em'
						}}
					/>
					<GridItem xs={12} md={12} lg={12}>
						<RichTextInput
							id="council-type-convene-header"
							ref={editor}
							errorText={errors.conveneHeader}
							translate={translate}
							floatingText={translate.convene_header}
							value={
								internalState.conveneHeader ?
									internalState.conveneHeader
									: ''
							}
							onChange={value => handleUpdate({
								conveneHeader: value
							})
							}
							saveDraft={
								<SaveDraftIcon
									onClick={showSaveDraft('CONVENE_HEADER')}
									translate={translate}
								/>
							}
							tags={conveneHeaderTags}
							loadDraft={
								<LoadDraftModal
									translate={translate}
									companyId={props.company.id}
									loadDraft={loadDraft}
									statute={{
										...statute,
										statuteId: statute.id
									}}
									defaultTags={{
										convene_header: {
											active: true,
											type: TAG_TYPES.DRAFT_TYPE,
											name: 'convene_header',
											label: translate.convene_header
										}
									}}
									statutes={props.companyStatutes}
									draftType={0}
								/>
							}
						/>
					</GridItem>
				</React.Fragment>
			)}
			{statute.conveneFooter !== undefined && (
				<GridItem xs={12} md={12} lg={12}>
					<RichTextInput
						id="council-type-convene-footer"
						ref={footer}
						errorText={errors.conveneFooter}
						translate={translate}
						saveDraft={
							<SaveDraftIcon
								onClick={showSaveDraft('CONVENE_FOOTER')}
								translate={translate}
							/>
						}
						loadDraft={
							<LoadDraftModal
								translate={translate}
								companyId={props.company.id}
								loadDraft={loadFooterDraft}
								statute={{
									...statute,
									statuteId: statute.id
								}}
								defaultTags={{
									convene_footer: {
										active: true,
										type: TAG_TYPES.DRAFT_TYPE,
										name: 'convene_footer',
										label: translate.convene_footer
									}
								}}
								statutes={props.companyStatutes}
								draftType={6}
							/>
						}
						floatingText={translate.convene_footer}
						value={internalState.conveneFooter || ''}
						onChange={value => handleUpdate({
							conveneFooter: value
						})
						}
					/>
				</GridItem>
			)}

			{config.proxies
				&& <ProxiesTemplates
					translate={translate}
					key={statute.id}
					statute={statute}
					data={data}
					updateState={updateState}
					errors={errors}
					{...props}
				/>
			}

			{statute.existsAct === 1 && (
				<div style={{ overflow: 'hidden', width: isMobile && '98%' }}>
					<SectionTitle
						text={translate.act_templates}
						color={primary}
						style={{
							marginTop: '2em',
							marginBottom: '1em'
						}}
					/>
					{/* aki */}
					<Grid>
						<GridItem xs={12} md={12} lg={12}>
							<RichTextInput
								id="council-type-intro"
								ref={intro}
								floatingText={translate.intro}
								translate={translate}
								errorText={errors.intro}
								value={internalState.intro || ''}
								onChange={value => handleUpdate({
									intro: value
								})
								}
								saveDraft={
									<SaveDraftIcon
										onClick={showSaveDraft('INTRO')}
										translate={translate}
									/>
								}
								tags={introTags}
								loadDraft={
									<LoadDraftModal
										translate={translate}
										companyId={props.company.id}
										loadDraft={draft => {
											updateState({
												intro: draft.text,
												introSecondary: draft.secondaryText || ''
											});
											intro.current.setValue(draft.text);
											introSecondary.current.setValue(draft.secondaryText);
										}}
										defaultTags={{
											intro: {
												active: true,
												type: TAG_TYPES.DRAFT_TYPE,
												name: 'intro',
												label: translate.intro
											}
										}}
										statute={{
											...statute,
											statuteId: statute.id
										}}
										statutes={props.companyStatutes}
										draftType={2}
									/>
								}
							/>
						</GridItem>
						<GridItem xs={12} md={12} lg={12} style={{ ...(statute.doubleColumnDocs === 0 ? { display: 'none' } : {}) }}>
							<RichTextInput
								id="council-type-intro-secondary"
								ref={introSecondary}
								translate={translate}
								floatingText={translate.right_column_introduction}
								value={
									internalState.introSecondary ?
										internalState.introSecondary
										: ''
								}
								onChange={value => handleUpdate({
									introSecondary: value
								})
								}
								tags={introTags}
							/>
						</GridItem>

						<GridItem xs={12} md={12} lg={12} style={{ marginTop: '2em' }}>
							<RichTextInput
								id="council-type-constitution"
								errorText={errors.constitution}
								ref={constitution}
								floatingText={translate.constitution}
								translate={translate}
								value={internalState.constitution || ''}
								onChange={value => handleUpdate({
									constitution: value
								})
								}
								saveDraft={
									<SaveDraftIcon
										onClick={showSaveDraft('CONSTITUTION')}
										translate={translate}
									/>
								}
								tags={constitutionTags}
								loadDraft={
									<LoadDraftModal
										translate={translate}
										companyId={props.company.id}
										defaultTags={{
											constitution: {
												active: true,
												type: TAG_TYPES.DRAFT_TYPE,
												name: 'constitution',
												label: translate.constitution
											}
										}}
										loadDraft={draft => {
											updateState({
												constitution: draft.text,
												constitutionSecondary: draft.secondaryText || ''
											});
											constitution.current.setValue(draft.text);
											constitutionSecondary.current.setValue(draft.secondaryText);
										}}
										statute={{
											...statute,
											statuteId: statute.id
										}}
										statutes={props.companyStatutes}
										draftType={3}
									/>
								}
							/>
						</GridItem>
						<GridItem xs={12} md={12} lg={12} style={{ ...(statute.doubleColumnDocs === 0 ? { display: 'none' } : {}) }}>
							<RichTextInput
								id="council-type-constitution-secondary"
								ref={constitutionSecondary}
								translate={translate}
								floatingText={translate.constitution_right_column}
								value={
									internalState.constitutionSecondary ?
										internalState.constitutionSecondary
										: ''
								}
								onChange={value => handleUpdate({
									constitutionSecondary: value
								})
								}
								tags={constitutionTags}
							/>
						</GridItem>

						<GridItem xs={12} md={12} lg={12} style={{ marginTop: '2em' }}>
							<RichTextInput
								id="council-type-conclusion"
								errorText={errors.conclusion}
								ref={conclusion}
								floatingText={translate.conclusion}
								translate={translate}
								value={internalState.conclusion || ''}
								onChange={value => handleUpdate({
									conclusion: value
								})
								}
								saveDraft={
									<SaveDraftIcon
										onClick={showSaveDraft('CONCLUSION')}
										translate={translate}
									/>
								}
								tags={conclusionTags}
								loadDraft={
									<LoadDraftModal
										translate={translate}
										defaultTags={{
											conclusion: {
												active: true,
												type: TAG_TYPES.DRAFT_TYPE,
												name: 'conclusion',
												label: translate.conclusion
											}
										}}
										companyId={props.company.id}
										loadDraft={draft => {
											updateState({
												conclusion: draft.text,
												conclusionSecondary: draft.secondaryText
											});
											conclusion.current.setValue(draft.text);
											conclusionSecondary.current.setValue(draft.secondaryText);
										}}
										statute={{
											...statute,
											statuteId: statute.id
										}}
										statutes={props.companyStatutes}
										draftType={4}
									/>
								}
							/>
						</GridItem>
						<GridItem xs={12} md={12} lg={12} style={{ ...(statute.doubleColumnDocs === 0 ? { display: 'none' } : {}) }}>
							<RichTextInput
								id="council-type-conclusion-secondary"
								ref={conclusionSecondary}
								translate={translate}
								floatingText={translate.right_column_conclusion}
								value={
									internalState.conclusionSecondary ?
										internalState.conclusionSecondary
										: ''
								}
								onChange={value => handleUpdate({
									conclusionSecondary: value
								})
								}
								tags={conclusionTags}
							/>
						</GridItem>
					</Grid>
					{!!saveDraft
						&& <SaveDraftModal
							key={saveDraft}
							open={!!saveDraft}
							data={{
								text: getText(saveDraft),
								description: '',
								title: '',
								votationType: 0,
								type: DRAFT_TYPES[saveDraft],
								statuteId: statute.id,
								tags: {
									[`statute_${statute.id}`]: {
										label: translate[statute.title] || statute.title,
										name: `statute_${statute.id}`,
										active: true,
										type: TAG_TYPES.STATUTE
									},
									[saveDraft.toLowerCase()]: {
										type: TAG_TYPES.DRAFT_TYPE,
										active: true,
										label: translate[saveDraft.toLowerCase()],
										name: saveDraft.toLowerCase()
									}
								}
							}}
							company={props.company}
							requestClose={closeDraftModal}
							companyStatutes={props.companyStatutes}
							votingTypes={data.votingTypes}
							majorityTypes={data.majorityTypes}
							draftTypes={data.draftTypes}
						/>
					}

				</div>
			)}
		</>
	);
};

export default StatuteDocSection;

const SaveDraftIcon = ({ onClick, translate }) => (
	<Tooltip title={translate.new_save}>
		<div onClick={onClick} style={{
			marginLeft: '0.6em', height: '100%', display: 'flex', alignItems: 'center', cursor: 'pointer'
		}}>
			<i className="fa fa-save" style={{ color: getSecondary(), fontSize: '1.75em' }}></i>
		</div>
	</Tooltip>
);
