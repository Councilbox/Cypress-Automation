import React, { Fragment } from "react";
import {
	Checkbox,
	Grid,
	GridItem,
	SectionTitle,
	SelectInput,
	TextInput,
} from "../../../displayComponents";
import RichTextInput from "../../../displayComponents/RichTextInput";
import LoadDraftModal from '../../company/drafts/LoadDraftModal';
import SaveDraftModal from '../../company/drafts/SaveDraftModal';
import { MenuItem, Tooltip } from "material-ui";
import { draftDetails } from "../../../queries";
import { censuses } from "../../../queries/census";
import { compose, graphql } from "react-apollo";
import { getPrimary, getSecondary } from "../../../styles/colors";
import * as CBX from "../../../utils/CBX";
import QuorumInput from "../../../displayComponents/QuorumInput";
import { DRAFT_TYPES } from "../../../constants";

class StatuteEditor extends React.PureComponent {

	state = {
		saveDraft: false
	}

	editor = null;

	closeDraftModal = () => {
		this.setState({
			saveDraft: false
		})
	}

	showSaveDraft = type => () => {
		this.setState({
			saveDraft: type,
		});
	}

	loadDraft = draft => {
		this.props.updateState({
			conveneHeader: draft.text
		});
		this.editor.setValue(draft.text);
	};

	render() {
		const { statute, translate, updateState, errors } = this.props;
		const { quorumTypes, loading } = this.props.data;
		const primary = getPrimary();

		return (
			<Fragment>
				<Grid>
					<SectionTitle
						text={translate.convene}
						color={primary}
					/>
					<br />
					<Grid>
						<GridItem xs={12} md={8} lg={6}>
							<Checkbox
								label={translate.exists_advance_notice_days}
								value={statute.existsAdvanceNoticeDays === 1}
								onChange={(event, isInputChecked) =>
									updateState({
										existsAdvanceNoticeDays: isInputChecked? 1 : 0
									})
								}
							/>
						</GridItem>
						<GridItem xs={12} md={4} lg={6}>
							{statute.existsAdvanceNoticeDays === 1 && (
								<TextInput
									floatingText={translate.input_group_days}
									required
									type="tel"
									errorText={errors.advanceNoticeDays}
									value={statute.advanceNoticeDays}
									onChange={event => {
										if (!isNaN(event.target.value) && +event.target.value >= 0) {
											updateState({
												advanceNoticeDays: parseInt(event.target.value, 10)
											})
										} else {
											updateState({
												advanceNoticeDays: 0
											})
										}
									}}
								/>
							)}
						</GridItem>

						<GridItem xs={12} md={6} lg={6}>
							<Checkbox
								label={translate.exists_second_call}
								value={statute.existsSecondCall === 1}
								onChange={(event, isInputChecked) =>
									updateState({
										existsSecondCall: isInputChecked ? 1 : 0
									})
								}
							/>
						</GridItem>
						<GridItem xs={12} md={6} lg={6}>
							{statute.existsSecondCall === 1 && (
								<TextInput
									floatingText={
										translate.minimum_separation_between_call
									}
									required
									type="tel"
									adornment={translate.minutes}
									errorText={errors.minimumSeparationBetweenCall}
									value={statute.minimumSeparationBetweenCall}
									onChange={event => {
										if (!isNaN(event.target.value) && +event.target.value > 0) {
											updateState({
												minimumSeparationBetweenCall: parseInt(event.target.value, 10)
											})
										} else {
											updateState({
												minimumSeparationBetweenCall: 5
											})
										}
									}}
								/>
							)}
						</GridItem>
					</Grid>
					<SectionTitle
						text={translate.assistance}
						color={primary}
						style={{
							marginTop: "1em"
						}}
					/>
					<br />
					<Grid>
						<GridItem xs={12} md={6} lg={6}>
							<SelectInput
								floatingText={translate.quorum_type}
								value={statute.quorumPrototype}
								onChange={event =>
									updateState({
										quorumPrototype: event.target.value
									})
								}
							>
								<MenuItem value={0}>
									{translate.census_type_assistants}
								</MenuItem>
								<MenuItem value={1}>
									{translate.social_capital}
								</MenuItem>
							</SelectInput>
						</GridItem>
						<GridItem xs={12} md={6} lg={6}>
							{" "}
						</GridItem>
						<GridItem xs={6} md={6} lg={6}>
							<SelectInput
								floatingText={
									translate.exist_quorum_assistance_first_call
								}
								value={statute.firstCallQuorumType}
								onChange={event =>
									updateState({
										firstCallQuorumType: event.target.value
									})
								}
							>
								{!loading &&
									quorumTypes.map(quorumType => {
										return (
											<MenuItem
												value={quorumType.value}
												key={`quorum_${quorumType.label}`}
											>
												{translate[quorumType.label]}
											</MenuItem>
										);
									})}
							</SelectInput>
						</GridItem>
						<GridItem xs={6} md={2} lg={2}>
							{CBX.quorumNeedsInput(statute.firstCallQuorumType) && (
								<QuorumInput
									type={statute.firstCallQuorumType}
									style={{ marginLeft: "1em" }}
									value={statute.firstCallQuorum}
									divider={statute.firstCallQuorumDivider}
									quorumError={errors.firstCallQuorum}
									dividerError={errors.firstCallQuorumDivider}
									onChange={value =>
										updateState({
											firstCallQuorum: +value
										})
									}
									onChangeDivider={value =>
										updateState({
											firstCallQuorumDivider: +value
										})
									}
								/>
							)}
						</GridItem>
						{statute.existsSecondCall === 1 && (
							<GridItem xs={6} md={6} lg={6}>
								<SelectInput
									floatingText={
										translate.exist_quorum_assistance_second_call
									}
									value={statute.secondCallQuorumType}
									onChange={event =>
										updateState({
											secondCallQuorumType: event.target.value
										})
									}
								>
									{!loading &&
										quorumTypes.map(quorumType => {
											return (
												<MenuItem
													value={quorumType.value}
													key={`quorum_${
														quorumType.label
														}`}
												>
													{translate[quorumType.label]}
												</MenuItem>
											);
										})}
								</SelectInput>
							</GridItem>
						)}
						{statute.existsSecondCall === 1 && (
							<GridItem xs={6} md={2} lg={2}>
								{CBX.quorumNeedsInput(
									statute.secondCallQuorumType
								) && (
										<QuorumInput
											type={statute.secondCallQuorumType}
											style={{ marginLeft: "1em" }}
											value={statute.secondCallQuorum}
											divider={statute.secondCallQuorumDivider}
											quorumError={errors.secondCallQuorum}
											dividerError={
												errors.secondCallQuorumDivider
											}
											onChange={value =>
												updateState({
													secondCallQuorum: +value
												})
											}
											onChangeDivider={value =>
												updateState({
													secondCallQuorumDivider: +value
												})
											}
										/>
									)}
							</GridItem>
						)}
						<GridItem xs={12} md={7} lg={7}>
							<Checkbox
								label={translate.exists_delegated_vote}
								value={statute.existsDelegatedVote === 1}
								onChange={(event, isInputChecked) =>
									updateState({
										existsDelegatedVote: isInputChecked ? 1 : 0
									})
								}
							/>
						</GridItem>
						<GridItem xs={10} md={6} lg={6} style={{ display: 'flex', alignItems: 'center' }}>
							<Checkbox
								helpPopover={true}
								helpTitle={translate.exist_max_num_delegated_votes}
								helpDescription={translate.max_delegated_votes_des}
								label={translate.exist_max_num_delegated_votes}
								value={statute.existMaxNumDelegatedVotes === 1}
								onChange={(event, isInputChecked) =>
									updateState({
										existMaxNumDelegatedVotes: isInputChecked
											? 1
											: 0
									})
								}
							/>
						</GridItem>
						<GridItem xs={2} md={2} lg={2} style={{ display: 'flex', alignItems: 'center' }}>
							{statute.existMaxNumDelegatedVotes === 1 && (
								<TextInput
									floatingText={translate.votes}
									required
									type="tel"
									min="1"
									errorText={errors.maxNumDelegatedVotes}
									value={statute.maxNumDelegatedVotes}
									onChange={event => {
										if (!isNaN(event.target.value) && +event.target.value > 0) {
											updateState({
												maxNumDelegatedVotes: parseInt(event.target.value, 10)
											})
										} else {
											updateState({
												maxNumDelegatedVotes: 1
											})
										}
									}}
								/>
							)}
						</GridItem>
						<GridItem xs={10} md={6} lg={6} style={{ display: 'flex', alignItems: 'center' }}>
							<Checkbox
								label={translate.exists_limited_access_room}
								helpPopover={false}
								helpTitle={translate.exists_limited_access_room}
								helpDescription={translate.cant_access_after_start_desc}
								value={statute.existsLimitedAccessRoom === 1}
								onChange={(event, isInputChecked) =>
									updateState({
										existsLimitedAccessRoom: isInputChecked
											? 1
											: 0
									})
								}
							/>
						</GridItem>
						<GridItem xs={2} md={2} lg={2} style={{ display: 'flex', alignItems: 'center' }}>
							{statute.existsLimitedAccessRoom === 1 && (
								<TextInput
									floatingText={translate.minutes}
									required
									type="tel"
									errorText={errors.limitedAccessRoomMinutes}
									value={statute.limitedAccessRoomMinutes}
									onChange={event => {
										if (!isNaN(event.target.value) && +event.target.value > 0) {
											updateState({
												limitedAccessRoomMinutes: parseInt(event.target.value, 10)
											})
										} else {
											updateState({
												limitedAccessRoomMinutes: 1
											})
										}
									}}
								/>
							)}
						</GridItem>
					</Grid>

					<SectionTitle
						text={translate.celebration_and_agreements}
						color={primary}
						style={{
							marginTop: "2em",
							marginBottom: "1em"
						}}
					/>
					<Grid>
						<GridItem xs={12} md={7} lg={7}>
							<Checkbox
								label={translate.exists_comments}
								value={statute.existsComments === 1}
								onChange={(event, isInputChecked) =>
									updateState({
										existsComments: isInputChecked ? 1 : 0
									})
								}
							/>
						</GridItem>
						<GridItem xs={12} md={7} lg={7}>
							<Checkbox
								label={translate.exists_notify_points}
								value={statute.notifyPoints === 1}
								onChange={(event, isInputChecked) =>
									updateState({
										notifyPoints: isInputChecked ? 1 : 0
									})
								}
							/>
						</GridItem>
						<GridItem xs={12} md={7} lg={7}>
							<Checkbox
								label={translate.exists_quality_vote}
								value={statute.existsQualityVote === 1}
								onChange={(event, isInputChecked) =>
									updateState({
										existsQualityVote: isInputChecked ? 1 : 0
									})
								}
							/>
						</GridItem>
						<GridItem xs={12} md={7} lg={7}>
							<Checkbox
								helpPopover={true}
								helpTitle={translate.exist_present_with_remote_vote}
								helpDescription={translate.exists_present_with_remote_vote_desc}
								label={translate.exist_present_with_remote_vote}
								value={statute.existsPresentWithRemoteVote === 1}
								onChange={(event, isInputChecked) =>
									updateState({
										existsPresentWithRemoteVote: isInputChecked
											? 1
											: 0
									})
								}
							/>
						</GridItem>
						<GridItem xs={12} md={7} lg={7}>
							<Checkbox
								label={translate.can_add_points}
								value={statute.canAddPoints === 1}
								onChange={(event, isInputChecked) =>
									updateState({
										canAddPoints: isInputChecked ? 1 : 0
									})
								}
							/>
						</GridItem>
						<GridItem xs={12} md={7} lg={7}>
							<Checkbox
								label={translate.can_reorder_points}
								value={statute.canReorderPoints === 1}
								onChange={(event, isInputChecked) =>
									updateState({
										canReorderPoints: isInputChecked ? 1 : 0
									})
								}
							/>
						</GridItem>
						<GridItem xs={12} md={7} lg={7}>
							<Checkbox
								label={translate.can_unblock}
								value={statute.canUnblock === 1}
								onChange={(event, isInputChecked) =>
									updateState({
										canUnblock: isInputChecked ? 1 : 0
									})
								}
							/>
						</GridItem>
					</Grid>

					<SectionTitle
						text={translate.census}
						color={primary}
						style={{
							marginTop: "2em",
							marginBottom: "1em"
						}}
					/>
					<Grid>
						<GridItem xs={12} md={4} lg={4}>
							<SelectInput
								floatingText={translate.associated_census}
								value={statute.censusId || "-1"}
								onChange={event =>
									updateState({
										censusId: event.target.value
									})
								}
							>
								{!!this.props.censusList && !this.props.censusList.loading &&
									this.props.censusList.censuses.list.map(
										census => {
											return (
												<MenuItem
													value={census.id}
													key={`census_${census.id}`}
												>
													{census.censusName}
												</MenuItem>
											);
										}
									)}
							</SelectInput>
						</GridItem>
					</Grid>
					<SectionTitle
						text={translate.act_and_documentation}
						color={primary}
						style={{
							marginTop: "2em",
							marginBottom: "1em"
						}}
					/>
					<Grid>
						<GridItem xs={12} md={7} lg={7}>
							<Checkbox
								label={translate.exists_act}
								value={statute.existsAct === 1}
								onChange={(event, isInputChecked) =>
									updateState({
										existsAct: isInputChecked ? 1 : 0
									})
								}
							/>
						</GridItem>
						<GridItem xs={12} md={7} lg={7}>
							<Checkbox
								label={translate.included_in_act_book}
								value={statute.includedInActBook === 1}
								onChange={(event, isInputChecked) =>
									updateState({
										includedInActBook: isInputChecked ? 1 : 0
									})
								}
							/>
						</GridItem>
						<GridItem xs={12} md={7} lg={7}>
							<Checkbox
								label={translate.include_participants_list_in_act}
								value={statute.includeParticipantsList === 1}
								onChange={(event, isInputChecked) =>
									updateState({
										includeParticipantsList: isInputChecked
											? 1
											: 0
									})
								}
							/>
						</GridItem>
					</Grid>

					{statute.conveneHeader !== undefined && (
						<React.Fragment>
							<SectionTitle
								text={translate.call_template}
								color={primary}
								style={{
									marginTop: "2em",
									marginBottom: "1em"
								}}
							/>
							<GridItem xs={12} md={12} lg={12}>
								<RichTextInput
									ref={editor => this.editor = editor}
									errorText={errors.conveneHeader}
									translate={translate}
									floatingText={translate.convene_header}
									value={
										!!statute.conveneHeader
											? statute.conveneHeader
											: ""
									}
									onChange={value =>
										updateState({
											conveneHeader: value
										})
									}
									saveDraft={
										<SaveDraftIcon
											onClick={this.showSaveDraft('CONVENE_HEADER')}
											translate={translate}
										/>
									}
									tags={getTagsByActSection('conveneHeader', translate)}
									loadDraft={
										<LoadDraftModal
											translate={translate}
											companyId={this.props.company.id}
											loadDraft={this.loadDraft}
											statute={{
												...statute,
												statuteId: statute.id
											}}
											statutes={this.props.companyStatutes}
											draftType={0}
										/>
									}
								/>
							</GridItem>
						</React.Fragment>
					)}
				</Grid>
				{statute.existsAct === 1 && (
					<Fragment>
						<SectionTitle
							text={translate.act_templates}
							color={primary}
							style={{
								marginTop: "2em",
								marginBottom: "1em"
							}}
						/>
						<Grid>
							<GridItem xs={12} md={12} lg={12}>
								<RichTextInput
									ref={intro => this.intro = intro}
									floatingText={translate.intro}
									translate={translate}
									errorText={errors.intro}
									value={statute.intro || ""}
									onChange={value =>
										updateState({
											intro: value
										})
									}
									saveDraft={
										<SaveDraftIcon
											onClick={this.showSaveDraft('INTRO')}
											translate={translate}
										/>
									}
									tags={getTagsByActSection('intro', translate)}
									loadDraft={
										<LoadDraftModal
											translate={translate}
											companyId={this.props.company.id}
											loadDraft={draft => {
												updateState({
													intro: draft.text
												})
												this.intro.setValue(draft.text);

											}}
											statute={{
												...statute,
												statuteId: statute.id
											}}
											statutes={this.props.companyStatutes}
											draftType={2}
										/>
									}
								/>
							</GridItem>

							<GridItem xs={12} md={12} lg={12}>
								<RichTextInput
									errorText={errors.constitution}
									ref={constitution => this.constitution = constitution}
									floatingText={translate.constitution}
									translate={translate}
									value={statute.constitution || ""}
									onChange={value =>
										updateState({
											constitution: value
										})
									}
									saveDraft={
										<SaveDraftIcon
											onClick={this.showSaveDraft('CONSTITUTION')}
											translate={translate}
										/>
									}
									tags={getTagsByActSection('constitution', translate)}
									loadDraft={
										<LoadDraftModal
											translate={translate}
											companyId={this.props.company.id}
											loadDraft={draft => {
												updateState({
													constitution: draft.text
												})
												this.constitution.setValue(draft.text);

											}}
											statute={{
												...statute,
												statuteId: statute.id
											}}
											statutes={this.props.companyStatutes}
											draftType={3}
										/>
									}
								/>
							</GridItem>

							<GridItem xs={12} md={12} lg={12}>
								<RichTextInput
									errorText={errors.conclusion}
									ref={conclusion => this.conclusion = conclusion}
									floatingText={translate.conclusion}
									translate={translate}
									value={statute.conclusion || ""}
									onChange={value =>
										updateState({
											conclusion: value
										})
									}
									saveDraft={
										<SaveDraftIcon
											onClick={this.showSaveDraft('CONCLUSION')}
											translate={translate}
										/>
									}
									tags={getTagsByActSection('conclusion', translate)}
									loadDraft={
										<LoadDraftModal
											translate={translate}
											companyId={this.props.company.id}
											loadDraft={draft => {
												updateState({
													conclusion: draft.text
												})
												this.conclusion.setValue(draft.text);

											}}
											statute={{
												...statute,
												statuteId: statute.id
											}}
											statutes={this.props.companyStatutes}
											draftType={4}
										/>
									}
								/>
							</GridItem>
						</Grid>
						<SaveDraftModal
							open={!!this.state.saveDraft}
							data={{
								text: this.state.saveDraft === 'CONVENE_HEADER'? statute.conveneHeader : statute[this.state.saveDraft.toString().toLowerCase()],
								description: "",
								title: `${translate[statute.title] || statute.title} - ${this.state.saveDraft === 'CONVENE_HEADER'? translate.convene_header : this.state.saveDraft.toString().toLowerCase()}`,
								votationType: 0,
								type: DRAFT_TYPES[this.state.saveDraft],
								statuteId: statute.id
							}}
							company={this.props.company}
							requestClose={this.closeDraftModal}
							companyStatutes={this.props.data.companyStatutes}
							votingTypes={this.props.data.votingTypes}
							majorityTypes={this.props.data.majorityTypes}
							draftTypes={this.props.data.draftTypes}
						/>
					</Fragment>
				)}
			</Fragment>
		);
	}
}

const SaveDraftIcon = ({ onClick, translate }) => {
	return (
		<Tooltip title={translate.new_save}>
			<div onClick={onClick} style={{marginLeft: '0.6em', height: '100%', display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
				<i className="fa fa-save" style={{color: getSecondary(), fontSize: '1.75em'}}></i>
			</div>
		</Tooltip>
	)
}

export default compose(
	graphql(draftDetails),
	graphql(censuses, {
		name: "censusList",
		options: props => ({
			variables: {
				companyId: props.company.id
			},
			notifyOnNetworkStatusChange: true
		})
	})
)(StatuteEditor);



const getTagsByActSection = (section, translate) => {
	switch(section) {

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
}