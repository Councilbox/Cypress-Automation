import React, { Fragment } from 'react';
import { MenuItem } from 'material-ui';
import { withApollo } from 'react-apollo';
import {
	Checkbox,
	Grid,
	GridItem,
	SectionTitle,
	SelectInput,
	TextInput,
} from '../../../displayComponents';
import * as CBX from '../../../utils/CBX';
import { draftDetails } from '../../../queries';
import { getPrimary } from '../../../styles/colors';
import QuorumInput from '../../../displayComponents/QuorumInput';
import { ConfigContext } from '../../../containers/AppControl';
import StatuteDocSection from './StatuteDocSection';
import { useValidRTMP } from '../../../hooks';
import withSharedProps from '../../../HOCs/withSharedProps';

const StatuteForm = ({
	statute, translate, updateState, errors, client, disabled, company, ...props
}) => {
	const [data, setData] = React.useState({});
	const [loading, setLoading] = React.useState(true);
	const config = React.useContext(ConfigContext);

	const primary = getPrimary();
	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: draftDetails
		});
		setData(response.data);
		setLoading(false);
	}, [statute.id]);

	React.useEffect(() => {
		getData();
	}, [getData]);


	const { quorumTypes } = data;
	return (
		<Fragment>
			<Grid style={{ overflow: 'hidden' }}>
				<SectionTitle
					text={translate.convene}
					color={primary}
				/>
				<br />
				<Grid style={{ overflow: 'hidden' }}>
					{props.organization
						&& <>
							<GridItem xs={12} md={12} lg={12}>
								<div style={{ maxWidth: '20em' }}>
									<SelectInput
										disabled={disabled}
										id="council-type-company-type"
										floatingText={translate.company_type}
										value={`${statute.companyType}` || '-1'}
										onChange={event => updateState({
											companyType: +event.target.value
										})
										}
										errorText={errors.type}
									>
										<MenuItem
											value={'-1'}
											id="company-type-all"
										>
											{translate.all_plural}
										</MenuItem>
										{data.companyTypes && data.companyTypes.map(
											companyType => (
												<MenuItem
													key={companyType.label}
													id={`company-type-${companyType.value}`}
													value={`${companyType.value}`}
												>
													{translate[companyType.label]}
												</MenuItem>
											)
										)}
									</SelectInput>
								</div>
							</GridItem>
							<GridItem xs={12} md={12} lg={12}>
								<div style={{ maxWidth: '20em' }}>
									<SelectInput
										disabled={disabled}
										id="council-type-language"
										floatingText={translate.language}
										value={statute.language || 'all'}
										onChange={event => updateState({
											language: event.target.value
										})
										}
										errorText={errors.language}
									>
										<MenuItem
											value={'all'}
											id="language-all"
										>
											{translate.all_plural}
										</MenuItem>
										{data.languages && data.languages.map(
											language => (
												<MenuItem
													id={`language-${language.columnName}`}
													key={language.columnName}
													value={language.columnName}
												>
													{language.desc}
												</MenuItem>
											)
										)}
									</SelectInput>
								</div>
							</GridItem>
						</>
					}

					<GridItem xs={12} md={6} lg={6}>
						<Checkbox
							id="council-type-advance-notice-days"
							label={translate.exists_advance_notice_days}
							value={statute.existsAdvanceNoticeDays === 1}
							onChange={(event, isInputChecked) => updateState({
								existsAdvanceNoticeDays: isInputChecked ? 1 : 0
							})
							}
						/>
					</GridItem>
					<GridItem xs={12} md={6} lg={6}>
						{statute.existsAdvanceNoticeDays === 1 && (
							<TextInput
								floatingText={translate.input_group_days}
								id="council-type-advance-notice-days-input"
								required
								type="tel"
								errorText={errors.advanceNoticeDays || statute.advanceNoticeDays === '' ? `${translate.minimum_notice_days}: 1` : ''}
								value={statute.advanceNoticeDays}
								onBlur={event => updateState({
									advanceNoticeDays: parseInt(event.target.value, 10) || 1
								})}
								onChange={event => updateState({
									advanceNoticeDays: Number.isNaN(Number(event.target.value)) ? '' : parseInt(event.target.value, 10) || ''
								})
								}
							/>
						)}
					</GridItem>

					<GridItem xs={12} md={6} lg={6}>
						<Checkbox
							id="council-type-has-second-call"
							label={translate.exists_second_call}
							value={statute.existsSecondCall === 1}
							onChange={(event, isInputChecked) => updateState({
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
								id="council-type-minimum-separation"
								required
								type="tel"
								adornment={translate.minutes}
								errorText={errors.minimumSeparationBetweenCall || statute.minimumSeparationBetweenCall === '' ? `${translate.minimum_separation_between_call_desc}: 0 ${translate.minutes}` : ''}
								value={statute.minimumSeparationBetweenCall}
								onBlur={event => updateState({
									minimumSeparationBetweenCall: parseInt(event.target.value, 10) || 0
								})}
								onChange={event => {
									updateState({
										minimumSeparationBetweenCall: Number.isNaN(Number(event.target.value)) ? '' : parseInt(event.target.value, 10) >= 0 ? parseInt(event.target.value, 10) : ''
									});
								}}
							/>
						)}
					</GridItem>
				</Grid>
				<SectionTitle
					text={translate.assistance}
					color={primary}
					style={{
						marginTop: '1em'
					}}
				/>
				<br />
				<Grid>
					<GridItem xs={12} md={6} lg={6}>
						<SelectInput
							floatingText={translate.quorum_type}
							id="council-type-quorum-type"
							value={statute.quorumPrototype}
							onChange={event => updateState({
								quorumPrototype: event.target.value
							})
							}
						>
							<MenuItem value={0} id="quorum-type-attendants">
								{translate.census_type_assistants}
							</MenuItem>
							<MenuItem value={1} id="quorum-type-social-capital">
								{translate.social_capital}
							</MenuItem>
						</SelectInput>
					</GridItem>
					<GridItem xs={12} md={6} lg={6}>
						{' '}
					</GridItem>
					<GridItem xs={6} md={6} lg={6}>
						<SelectInput
							id="council-type-quorum-first-call"
							floatingText={translate.exist_quorum_assistance_first_call}
							value={statute.firstCallQuorumType}
							styleLabel={{ minWidth: '240px' }}
							onChange={event => updateState({
								firstCallQuorumType: event.target.value
							})
							}
						>
							{quorumTypes !== undefined
								&& !loading
								&& quorumTypes.map(quorumType => (
									<MenuItem
										value={quorumType.value}
										id={`quorum-first-call-${quorumType.value}`}
										key={`quorum_${quorumType.label}`}
									>
										{translate[quorumType.label]}
									</MenuItem>
								))
							}
						</SelectInput>
					</GridItem>
					<GridItem xs={5} md={2} lg={2} style={{ alignItems: 'flex-end', display: 'flex' }}>
						{CBX.quorumNeedsInput(statute.firstCallQuorumType) && (
							<QuorumInput
								translate={translate}
								id="quorum-first-call"
								type={statute.firstCallQuorumType}
								style={{ marginLeft: '1em' }}
								value={statute.firstCallQuorum}
								divider={statute.firstCallQuorumDivider}
								quorumError={errors.firstCallQuorum || (statute.firstCallQuorum <= 0 ? `${translate.minimum_value} 1` : '')}
								dividerError={errors.firstCallQuorumDivider}
								onChange={value => updateState({
									firstCallQuorum: +value
								})
								}
								onChangeDivider={value => updateState({
									firstCallQuorumDivider: +value
								})
								}
							/>
						)}
					</GridItem>
					{statute.existsSecondCall === 1 && (
						<GridItem xs={6} md={6} lg={6}>
							<SelectInput
								id="council-type-quorum-second-call"
								floatingText={translate.exist_quorum_assistance_second_call}
								value={statute.secondCallQuorumType}
								styleLabel={{ minWidth: '240px' }}
								onChange={event => updateState({
									secondCallQuorumType: event.target.value
								})
								}
							>
								{!loading
									&& quorumTypes.map(quorumType => (
										<MenuItem
											value={quorumType.value}
											id={`quorum-second-call-${quorumType.value}`}
											key={`quorum_${quorumType.label
												}`}
										>
											{translate[quorumType.label]}
										</MenuItem>
									))}
							</SelectInput>
						</GridItem>
					)}
					{statute.existsSecondCall === 1 && (
						<GridItem xs={5} md={2} lg={2} style={{ alignItems: 'flex-end', display: 'flex' }}>
							{CBX.quorumNeedsInput(statute.secondCallQuorumType) && (
								<QuorumInput
									translate={translate}
									id="quorum-second-call"
									type={statute.secondCallQuorumType}
									style={{ marginLeft: '1em' }}
									value={statute.secondCallQuorum}
									divider={statute.secondCallQuorumDivider}
									quorumError={errors.secondCallQuorum || (statute.secondCallQuorum <= 0 ? `${translate.minimum_value} 1` : '')}
									dividerError={
										errors.secondCallQuorumDivider
									}
									onChange={value => updateState({
										secondCallQuorum: +value
									})
									}
									onChangeDivider={value => updateState({
										secondCallQuorumDivider: +value
									})
									}
								/>
							)}
						</GridItem>
					)}
					<GridItem xs={12} md={7} lg={7}>
						<Checkbox
							id="council-type-delegated-vote"
							label={translate.exists_delegated_vote}
							value={statute.existsDelegatedVote === 1}
							onChange={(event, isInputChecked) => updateState({
								existsDelegatedVote: isInputChecked ? 1 : 0
							})}
						/>
					</GridItem>
					<GridItem xs={10} md={6} lg={6} style={{ display: 'flex', alignItems: 'center' }}>
						<Checkbox
							helpPopover={true}
							id="council-type-max-delegated"
							disabled={statute.existsDelegatedVote === 0}
							helpTitle={translate.exist_max_num_delegated_votes}
							helpDescription={translate.max_delegated_votes_des}
							label={translate.exist_max_num_delegated_votes}
							value={statute.existMaxNumDelegatedVotes === 1}
							onChange={(event, isInputChecked) => updateState({
								existMaxNumDelegatedVotes: isInputChecked ?
									1
									: 0
							})}
						/>
					</GridItem>
					<GridItem xs={2} md={2} lg={2} style={{ display: 'flex', alignItems: 'center' }}>
						{(statute.existMaxNumDelegatedVotes === 1 && statute.existsDelegatedVote !== 0) && (
							<TextInput
								id="council-type-max-delegated-number"
								floatingText={translate.votes}
								required
								type="tel"
								min="1"
								errorText={errors.maxNumDelegatedVotes}
								value={statute.maxNumDelegatedVotes}
								onBlur={event => updateState({
									maxNumDelegatedVotes: parseInt(event.target.value, 10) || 1
								})}
								onChange={event => updateState({
									maxNumDelegatedVotes: Number.isNaN(Number(event.target.value)) ? '' : parseInt(event.target.value, 10) || ''
								})}
							/>
						)}
					</GridItem>
					{config.earlyVoting
						&& <>
							<GridItem xs={12} md={7} lg={7}>
								<Checkbox
									id="council-type-vote-sense"
									disabled={statute.existsDelegatedVote !== 1}
									label={translate.can_sense_vote_delegation}
									value={statute.canSenseVoteDelegate === 1}
									onChange={(event, isInputChecked) => updateState({
										canSenseVoteDelegate: isInputChecked ? 1 : 0
									})
									}
								/>
							</GridItem>
							<GridItem xs={12} md={7} lg={7}>
								<Checkbox
									id="council-type-early-vote"
									label={translate.exists_early_voting}
									value={statute.canEarlyVote === 1}
									onChange={(event, isInputChecked) => updateState({
										canEarlyVote: isInputChecked ? 1 : 0
									})
									}
								/>
							</GridItem>
						</>
					}
					<GridItem xs={10} md={6} lg={6} style={{ display: 'flex', alignItems: 'center' }}>
						<Checkbox
							id="council-type-limited-access"
							label={translate.exists_limited_access_room}
							helpPopover={false}
							helpTitle={translate.exists_limited_access_room}
							helpDescription={translate.cant_access_after_start_desc}
							value={statute.existsLimitedAccessRoom === 1}
							onChange={(event, isInputChecked) => updateState({
								existsLimitedAccessRoom: isInputChecked ?
									1
									: 0
							})
							}
						/>
					</GridItem>
					<GridItem xs={2} md={2} lg={2} style={{ display: 'flex', alignItems: 'center' }}>
						{statute.existsLimitedAccessRoom === 1 && (
							<TextInput
								id="council-type-limited-access-minutes"
								floatingText={translate.minutes}
								required
								type="tel"
								errorText={errors.limitedAccessRoomMinutes}
								value={statute.limitedAccessRoomMinutes}
								onBlur={event => updateState({
									limitedAccessRoomMinutes: parseInt(event.target.value, 10) || 1
								})}
								onChange={event => updateState({
									limitedAccessRoomMinutes: Number.isNaN(Number(event.target.value)) ? '' : parseInt(event.target.value, 10) || ''
								})}
							/>
						)}
					</GridItem>
				</Grid>

				<SectionTitle
					text={translate.celebration_and_agreements}
					color={primary}
					style={{
						marginTop: '2em',
						marginBottom: '1em'
					}}
				/>
				<Grid>
					<GridItem xs={12} md={7} lg={7}>
						<Checkbox
							id="council-type-has-comments"
							label={translate.exists_comments}
							value={statute.existsComments === 1}
							onChange={(event, isInputChecked) => updateState({
								existsComments: isInputChecked ? 1 : 0
							})
							}
						/>
					</GridItem>
					<GridItem xs={12} md={7} lg={7}>
						<Checkbox
							id="council-type-notify-points"
							label={translate.exists_notify_points}
							value={statute.notifyPoints === 1}
							onChange={(event, isInputChecked) => updateState({
								notifyPoints: isInputChecked ? 1 : 0
							})
							}
						/>
					</GridItem>
					<GridItem xs={12} md={7} lg={7}>
						<Checkbox
							id="council-type-quality-vote"
							label={translate.exists_quality_vote}
							value={statute.existsQualityVote === 1}
							onChange={(event, isInputChecked) => updateState({
								existsQualityVote: isInputChecked ? 1 : 0
							})
							}
						/>
					</GridItem>
					<GridItem xs={12} md={7} lg={7}>
						<Checkbox
							id="council-type-president"
							label={translate.president}
							value={statute.hasPresident === 1}
							onChange={(event, isInputChecked) => updateState({
								hasPresident: isInputChecked ? 1 : 0
							})
							}
						/>
					</GridItem>
					<GridItem xs={12} md={7} lg={7}>
						<Checkbox
							id="council-type-secretary"
							label={translate.secretary}
							value={statute.hasSecretary === 1}
							onChange={(event, isInputChecked) => updateState({
								hasSecretary: isInputChecked ? 1 : 0
							})
							}
						/>
					</GridItem>
					<GridItem xs={12} md={7} lg={7}>
						<Checkbox
							id="council-type-hide-recount"
							label={translate.hide_votings_recount}
							value={statute.hideVotingsRecountFinished === 1}
							onChange={(event, isInputChecked) => updateState({
								hideVotingsRecountFinished: isInputChecked ? 1 : 0
							})
							}
						/>
					</GridItem>
					<GridItem xs={12} md={7} lg={7}>
						<SelectInput
							id="council-type-hide-no-vote-button"
							floatingText={translate.hide_no_vote_button}
							value={statute.hideNoVoteButton}
							style={{ maxWidth: '22em' }}
							styleLabel={{ minWidth: '240px' }}
							onChange={event => updateState({
								hideNoVoteButton: event.target.value
							})}
						>
							<MenuItem
								value={0}
								id={'no-vote-select-option-hide'}
							>
								{translate.hidden}
							</MenuItem>
							<MenuItem
								value={1}
								id={'no-vote-select-option-show'}
							>
								{translate.visible}
							</MenuItem>
							<MenuItem
								value={-1}
								id={'no-vote-select-option-default'}
							>
								{translate.default}
							</MenuItem>
						</SelectInput>
					</GridItem>
					<GridItem xs={12} md={7} lg={7}>
						<SelectInput
							id="council-type-hide-abstention-button"
							floatingText={translate.hide_abstention_button}
							value={statute.hideAbstentionButton}
							style={{ maxWidth: '22em' }}
							styleLabel={{ minWidth: '240px' }}
							onChange={event => updateState({
								hideAbstentionButton: event.target.value
							})}
						>
							<MenuItem
								value={0}
								id={'abstention-select-option-hide'}
							>
								{translate.hidden}
							</MenuItem>
							<MenuItem
								value={1}
								id={'abstention-select-option-show'}
							>
								{translate.visible}
							</MenuItem>
							<MenuItem
								value={-1}
								id={'abstention-select-option-default'}
							>
								{translate.default}
							</MenuItem>
						</SelectInput>
					</GridItem>
					<GridItem xs={12} md={7} lg={7}>
						<Checkbox
							id="council-type-remote-vote"
							helpPopover={true}
							helpTitle={translate.exist_present_with_remote_vote}
							helpDescription={translate.exists_present_with_remote_vote_desc}
							label={translate.exist_present_with_remote_vote}
							value={statute.existsPresentWithRemoteVote === 1}
							onChange={(event, isInputChecked) => updateState({
								existsPresentWithRemoteVote: isInputChecked ?
									1
									: 0
							})
							}
						/>
					</GridItem>
					<GridItem xs={12} md={7} lg={7}>
						<Checkbox
							id="council-type-agenda-modify"
							label={translate.agenda_can_be_modified}
							value={statute.canAddPoints === 1}
							onChange={(event, isInputChecked) => updateState({
								canAddPoints: isInputChecked ? 1 : 0
							})
							}
						/>
					</GridItem>
					<GridItem xs={12} md={7} lg={7}>
						<Checkbox
							id="council-type-agenda-reorder"
							label={translate.can_reorder_points}
							value={statute.canReorderPoints === 1}
							onChange={(event, isInputChecked) => updateState({
								canReorderPoints: isInputChecked ? 1 : 0
							})
							}
						/>
					</GridItem>
					<GridItem xs={12} md={7} lg={7}>
						<Checkbox
							id="council-type-can-unblock"
							label={translate.can_unblock}
							value={statute.canUnblock === 1}
							onChange={(event, isInputChecked) => updateState({
								canUnblock: isInputChecked ? 1 : 0
							})
							}
						/>
					</GridItem>
					<GridItem xs={12} md={7} lg={7}>
						<SelectInput
							id="council-type-default-vote"
							floatingText={translate.default_vote}
							value={statute.defaultVote}
							style={{ maxWidth: '22em' }}
							onChange={event => updateState({
								defaultVote: event.target.value
							})
							}
						>
							<MenuItem
								id="default-vote-no-vote"
								value={-1}
							>
								{translate.dont_vote}
							</MenuItem>
							<MenuItem
								id="default-vote-0"
								value={0}
							>
								{translate.against_btn}
							</MenuItem>
							<MenuItem
								id="default-vote-1"
								value={1}
							>
								{translate.in_favor_btn}
							</MenuItem>
							<MenuItem
								id="default-vote-2"
								value={2}
							>
								{translate.abstention_btn}
							</MenuItem>
						</SelectInput>
					</GridItem>
				</Grid>
				<VideoSection
					updateState={updateState}
					statute={statute}
					translate={translate}
				/>

				<SectionTitle
					text={translate.census}
					color={primary}
					style={{
						marginTop: '2em',
						marginBottom: '1em'
					}}
				/>
				<Grid style={{ overflow: 'hidden' }}>
					<GridItem xs={12} md={4} lg={4}>
						<SelectInput
							id="council-type-default-census"
							floatingText={translate.associated_census}
							value={statute.censusId || '-1'}
							onChange={event => updateState({
								censusId: event.target.value
							})
							}
						>
							{!!props.censusList && !props.censusList.loading
								&& props.censusList.censuses.list.map(
									(census, index) => (
										<MenuItem
											value={census.id}
											id={`census-${index}`}
											key={`census_${census.id}`}
										>
											{census.censusName}
										</MenuItem>
									)
								)
							}
							{(CBX.multipleGoverningBody(company.governingBodyType)
								&& company.governingBodyData
								&& company.governingBodyData.list
								&& company.governingBodyData.list.length > 0)
								&& <MenuItem
									id='census-governing-body'
									value={parseInt(-1, 10)}
								>
									{translate.governing_body}
								</MenuItem>
							}
						</SelectInput>
					</GridItem>
				</Grid>
				{/* /////// esto no esta ajustando en movil */}
				<StatuteDocSection
					translate={translate}
					key={statute.id}
					statute={statute}
					data={data}
					company={company}
					updateState={updateState}
					errors={errors}
					{...props}
				/>
			</Grid>
		</Fragment>
	);
};


const VideoSection = ({ updateState, statute, translate }) => {
	const primary = getPrimary();

	const { validURL } = useValidRTMP(statute);

	return (
		<>
			<SectionTitle
				text={translate.video_config}
				color={primary}
				style={{
					marginTop: '2em',
					marginBottom: '1em'
				}}
			/>
			<Grid style={{ overflow: 'hidden' }}>
				<GridItem xs={12} md={8} lg={6}>
					<TextInput
						floatingText={'RTMP'}
						id="council-type-rtmp"
						errorText={!validURL ? translate.invalid_url : null}
						value={statute.videoConfig ? statute.videoConfig.rtmp : ''}
						onChange={event => {
							updateState({
								videoConfig: {
									...statute.videoConfig,
									rtmp: event.target.value
								}
							});
						}}
					/>
				</GridItem>
			</Grid>
		</>
	);
};

export default withApollo(withSharedProps()(StatuteForm));
