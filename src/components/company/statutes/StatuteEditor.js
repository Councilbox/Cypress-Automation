import React, { Fragment } from "react";
import {
	Checkbox,
	Grid,
	GridItem,
	SectionTitle,
	SelectInput,
	TextInput,
} from "../../../displayComponents";
import * as CBX from "../../../utils/CBX";
import { MenuItem } from "material-ui";
import { draftDetails } from "../../../queries";
import { withApollo } from "react-apollo";
import { getPrimary } from "../../../styles/colors";
import QuorumInput from "../../../displayComponents/QuorumInput";
import { ConfigContext } from "../../../containers/AppControl";
import StatuteDocSection from "./StatuteDocSection";
import { useValidRTMP } from "../../../hooks";
import withSharedProps from "../../../HOCs/withSharedProps";


const StatuteEditor = ({ statute, translate, updateState, errors, client, company, ...props }) => {
	const [data, setData] = React.useState({});
	const [loading, setLoading] = React.useState(true);

	const primary = getPrimary();
	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: draftDetails
		});
		setData(response.data);
		setLoading(false);
	}, [statute.id])

	React.useEffect(() => {
		getData();
	}, [getData]);


	const { quorumTypes } = data;
	return (
		<Fragment>
			<Grid style={{ overflow: "hidden" }}>
				<SectionTitle
					text={translate.convene}
					color={primary}
				/>
				<br />
				<Grid style={{ overflow: "hidden" }}>
					{props.organization &&
						<>
							<GridItem xs={12} md={12} lg={12}>
								<div style={{ maxWidth: '20em' }}>
									<SelectInput
										floatingText={translate.company_type}
										value={'' + statute.companyType || '-1'}
										onChange={event =>
											updateState({
												companyType: +event.target.value
											})
										}
										errorText={errors.type}
									>
										<MenuItem
											value={'-1'}
										>
											{translate.all_plural}
										</MenuItem>
										{data.companyTypes && data.companyTypes.map(
											companyType => {
												return (
													<MenuItem
														key={companyType.label}
														value={'' + companyType.value}
													>
														{
															translate[
															companyType.label
															]
														}
													</MenuItem>
												);
											}
										)}
									</SelectInput>
								</div>
							</GridItem>
							<GridItem xs={12} md={12} lg={12}>
								<div style={{ maxWidth: '20em' }}>
									<SelectInput
										floatingText={translate.language}
										value={statute.language || 'all'}
										onChange={event =>
											updateState({
												language: event.target.value
											})
										}
										errorText={errors.language}
									>
										<MenuItem
											value={'all'}
										>
											{translate.all_plural}
										</MenuItem>
										{data.languages && data.languages.map(
											language => {
												return (
													<MenuItem
														key={language.columnName}
														value={language.columnName}
													>
														{language.desc}
													</MenuItem>
												);
											}
										)}
									</SelectInput>
								</div>
							</GridItem>
						</>
					}

					<GridItem xs={12} md={8} lg={6}>
						<Checkbox
							label={translate.exists_advance_notice_days}
							value={statute.existsAdvanceNoticeDays === 1}
							onChange={(event, isInputChecked) =>
								updateState({
									existsAdvanceNoticeDays: isInputChecked ? 1 : 0
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
							floatingText={translate.exist_quorum_assistance_first_call}
							value={statute.firstCallQuorumType}
							onChange={event =>
								updateState({
									firstCallQuorumType: event.target.value
								})
							}
						>
							{quorumTypes !== undefined &&
								!loading &&
								quorumTypes.map(quorumType => {
									return (
										<MenuItem
											value={quorumType.value}
											key={`quorum_${quorumType.label}`}
										>
											{translate[quorumType.label]}
										</MenuItem>
									);
								})
							}
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
								floatingText={translate.exist_quorum_assistance_second_call}
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
							{CBX.quorumNeedsInput(statute.secondCallQuorumType) && (
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
					<GridItem xs={12} md={7} lg={7}>
						<Checkbox
							disabled={statute.existsDelegatedVote !== 1}
							label={translate.can_sense_vote_delegation}
							value={statute.canSenseVoteDelegate === 1}
							onChange={(event, isInputChecked) =>
								updateState({
									canSenseVoteDelegate: isInputChecked ? 1 : 0
								})
							}
						/>
					</GridItem>
					<GridItem xs={12} md={7} lg={7}>
						<Checkbox
							label={translate.exists_early_voting}
							value={statute.canEarlyVote === 1}
							onChange={(event, isInputChecked) =>
								updateState({
									canEarlyVote: isInputChecked ? 1 : 0
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
							label={translate.president}
							value={statute.hasPresident === 1}
							onChange={(event, isInputChecked) =>
								updateState({
									hasPresident: isInputChecked ? 1 : 0
								})
							}
						/>
					</GridItem>
					<GridItem xs={12} md={7} lg={7}>
						<Checkbox
							label={translate.secretary}
							value={statute.hasSecretary === 1}
							onChange={(event, isInputChecked) =>
								updateState({
									hasSecretary: isInputChecked ? 1 : 0
								})
							}
						/>
					</GridItem>
					<GridItem xs={12} md={7} lg={7}>
						<Checkbox
							label={translate.hide_votings_recount}
							value={statute.hideVotingsRecountFinished === 1}
							onChange={(event, isInputChecked) =>
								updateState({
									hideVotingsRecountFinished: isInputChecked ? 1 : 0
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
				<VideoSection
					updateState={updateState}
					statute={statute}
					translate={translate}
				/>

				<SectionTitle
					text={translate.census}
					color={primary}
					style={{
						marginTop: "2em",
						marginBottom: "1em"
					}}
				/>
				<Grid style={{ overflow: "hidden" }}>
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
							{!!props.censusList && !props.censusList.loading &&
								props.censusList.censuses.list.map(
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
								)
							}
							{(CBX.multipleGoverningBody(company.governingBodyType) &&
								company.governingBodyData &&
								company.governingBodyData.list &&
								company.governingBodyData.list.length > 0) &&
									<MenuItem
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

}


const VideoSection = ({ updateState, statute, translate }) => {
	const primary = getPrimary();

	const { validURL } = useValidRTMP(statute);

	console.log(validURL);

	return (
		<>
			<SectionTitle
				text={translate.video_config}
				color={primary}
				style={{
					marginTop: "2em",
					marginBottom: "1em"
				}}
			/>
			<Grid style={{ overflow: "hidden" }}>
				<GridItem xs={12} md={8} lg={6}>
					<TextInput
						floatingText={'RTMP'}
						required
						errorText={!validURL? translate.invalid_url : null}
						value={statute.videoConfig? statute.videoConfig.rtmp : ''}
						onChange={event => {
							updateState({
								videoConfig: {
									...statute.videoConfig,
									rtmp: event.target.value
								}
							})
						}}
					/>
				</GridItem>
			</Grid>
		</>
	)
}

export default withApollo(withSharedProps()(StatuteEditor));



