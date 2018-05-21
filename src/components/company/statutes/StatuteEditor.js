import React, { Fragment } from 'react';
import { SelectInput, Grid, GridItem, Checkbox, TextInput, RichTextInput } from '../../../displayComponents';
import { Typography, MenuItem } from 'material-ui';
import { quorumTypes } from '../../../queries';
import { censuses } from '../../../queries/census';
import { graphql, compose } from 'react-apollo';
import { getPrimary } from '../../../styles/colors';
import * as CBX from "../../../utils/CBX";
import QuorumInput from "../../../displayComponents/QuorumInput";

class StatuteEditor extends React.PureComponent {

    render() {
        const { statute, translate, updateState, errors } = this.props;
        const { quorumTypes, loading } = this.props.data;
        const primary = getPrimary();

        return (<Fragment>
                <Typography variant="title" style={{ color: primary }}>
                    {translate.convene}
                </Typography>
                <br/>
                <Grid>
                    <GridItem xs={12} md={8} lg={6}>
                        <Checkbox
                            label={translate.exists_advance_notice_days}
                            value={statute.existsAdvanceNoticeDays === 1}
                            onChange={(event, isInputChecked) => updateState({
                                existsAdvanceNoticeDays: isInputChecked ? 1 : 0
                            })}
                        />
                    </GridItem>
                    <GridItem xs={12} md={4} lg={6}>
                        {statute.existsAdvanceNoticeDays === 1 && <TextInput
                            floatingText={translate.input_group_days}
                            required
                            min="1"
                            type="number"
                            errorText={errors.advanceNoticeDays}
                            value={statute.advanceNoticeDays}
                            onChange={(event) => updateState({
                                advanceNoticeDays: event.target.value
                            })}/>}
                    </GridItem>

                    <GridItem xs={12} md={6} lg={6}>
                        <Checkbox
                            label={translate.exists_second_call}
                            value={statute.existsSecondCall === 1}
                            onChange={(event, isInputChecked) => updateState({
                                existsSecondCall: isInputChecked ? 1 : 0
                            })}
                        />
                    </GridItem>
                    <GridItem xs={12} md={6} lg={6}>
                        {statute.existsSecondCall === 1 && <TextInput
                            floatingText={translate.minimum_separation_between_call}
                            required
                            type="number"
                            min="1"
                            adornment={translate.minutes}
                            errorText={errors.minimumSeparationBetweenCall}
                            value={statute.minimumSeparationBetweenCall}
                            onChange={(event) => updateState({
                                minimumSeparationBetweenCall: event.target.value
                            })}
                        />}
                    </GridItem>

                </Grid>
                <Typography variant="title" style={{
                    color: primary,
                    marginTop: '1em'
                }}>
                    {translate.assistance}
                </Typography>
                <br/>
                <Grid>
                    <GridItem xs={12} md={6} lg={6}>
                        <SelectInput
                            floatingText={translate.quorum_type}
                            value={statute.quorumPrototype}
                            onChange={(event) => updateState({
                                quorumPrototype: event.target.value
                            })}>
                            <MenuItem value={0}>{translate.census_type_assistants}</MenuItem>
                            <MenuItem value={1}>{translate.social_capital}</MenuItem>
                        </SelectInput>
                    </GridItem>
                    <GridItem xs={12} md={6} lg={6}> </GridItem>
                    <GridItem xs={6} md={6} lg={6}>
                        <SelectInput
                            floatingText={translate.exist_quorum_assistance_first_call}
                            value={statute.firstCallQuorumType}
                            onChange={(event) => updateState({
                                firstCallQuorumType: event.target.value
                            })}>
                            {!loading && quorumTypes.map((quorumType) => {
                                return <MenuItem value={quorumType.value}
                                                 key={`quorum_${quorumType.label}`}>{translate[ quorumType.label ]}</MenuItem>
                            })

                            }
                        </SelectInput>
                    </GridItem>
                    <GridItem xs={6} md={2} lg={2}>
                        {CBX.quorumNeedsInput(statute.firstCallQuorumType) && <QuorumInput
                            type={statute.firstCallQuorumType}
                            style={{ marginLeft: '1em' }}
                            value={statute.firstCallQuorum}
                            divider={statute.firstCallQuorumDivider}
                            quorumError={errors.firstCallQuorum}
                            dividerError={errors.firstCallQuorumDivider}
                            onChange={(value) => updateState({
                                firstCallQuorum: +value
                            })}
                            onChangeDivider={(value) => updateState({
                                firstCallQuorumDivider: +value
                            })}
                        />}
                    </GridItem>
                    {statute.existsSecondCall === 1 && <GridItem xs={6} md={6} lg={6}>
                        <SelectInput
                            floatingText={translate.exist_quorum_assistance_second_call}
                            value={statute.secondCallQuorumType}
                            onChange={(event) => updateState({
                                secondCallQuorumType: event.target.value
                            })}>
                            {!loading && quorumTypes.map((quorumType) => {
                                return <MenuItem value={quorumType.value}
                                                 key={`quorum_${quorumType.label}`}>{translate[ quorumType.label ]}</MenuItem>
                            })

                            }
                        </SelectInput>
                    </GridItem>}
                    {statute.existsSecondCall === 1 && <GridItem xs={6} md={2} lg={2}>
                        {CBX.quorumNeedsInput(statute.secondCallQuorumType) && <QuorumInput
                            type={statute.secondCallQuorumType}
                            style={{ marginLeft: '1em' }}
                            value={statute.secondCallQuorum}
                            divider={statute.secondCallQuorumDivider}
                            quorumError={errors.secondCallQuorum}
                            dividerError={errors.secondCallQuorumDivider}
                            onChange={(value) => updateState({
                                secondCallQuorum: +value
                            })}
                            onChangeDivider={(value) => updateState({
                                secondCallQuorumDivider: +value
                            })}
                        />}
                    </GridItem>}
                    <GridItem xs={12} md={7} lg={7}>
                        <Checkbox
                            label={translate.exists_delegated_vote}
                            value={statute.existsDelegatedVote === 1}
                            onChange={(event, isInputChecked) => updateState({
                                existsDelegatedVote: isInputChecked ? 1 : 0
                            })}
                        />
                    </GridItem>
                    <GridItem xs={10} md={6} lg={6}>
                        <Checkbox
                            label={translate.exist_max_num_delegated_votes}
                            value={statute.existMaxNumDelegatedVotes === 1}
                            onChange={(event, isInputChecked) => updateState({
                                existMaxNumDelegatedVotes: isInputChecked ? 1 : 0
                            })}
                        />
                    </GridItem>
                    <GridItem xs={2} md={2} lg={2}>
                        {statute.existMaxNumDelegatedVotes === 1 && <TextInput
                            floatingText={translate.votes}
                            required
                            type="number"
                            min="1"
                            errorText={errors.maxNumDelegatedVotes}
                            value={statute.maxNumDelegatedVotes}
                            onChange={(event) => updateState({
                                maxNumDelegatedVotes: event.target.value
                            })}
                        />}
                    </GridItem>
                    <GridItem xs={10} md={6} lg={6}>
                        <Checkbox
                            label={translate.exists_limited_access_room}
                            value={statute.existsLimitedAccessRoom === 1}
                            onChange={(event, isInputChecked) => updateState({
                                existsLimitedAccessRoom: isInputChecked ? 1 : 0
                            })}
                        />
                    </GridItem>
                    <GridItem xs={2} md={2} lg={2}>
                        {statute.existsLimitedAccessRoom === 1 && <TextInput
                            floatingText={translate.minutes}
                            required
                            type="number"
                            min="1"
                            errorText={errors.limitedAccessRoomMinutes}
                            value={statute.limitedAccessRoomMinutes}
                            onChange={(event) => updateState({
                                limitedAccessRoomMinutes: event.target.value
                            })}
                        />}
                    </GridItem>
                </Grid>


                <Typography variant="title" style={{
                    color: primary,
                    marginTop: '1em',
                    marginBottom: '1em'
                }}>
                    {translate.celebration_and_agreements}
                </Typography>
                <Grid>
                    <GridItem xs={12} md={7} lg={7}>
                        <Checkbox
                            label={translate.exists_comments}
                            value={statute.existsComments === 1}
                            onChange={(event, isInputChecked) => updateState({
                                existsComments: isInputChecked ? 1 : 0
                            })}
                        />
                    </GridItem>
                    <GridItem xs={12} md={7} lg={7}>
                        <Checkbox
                            label={translate.exists_notify_points}
                            value={statute.notifyPoints === 1}
                            onChange={(event, isInputChecked) => updateState({
                                notifyPoints: isInputChecked ? 1 : 0
                            })}
                        />
                    </GridItem>
                    <GridItem xs={12} md={7} lg={7}>
                        <Checkbox
                            label={translate.exists_quality_vote}
                            value={statute.existsQualityVote === 1}
                            onChange={(event, isInputChecked) => updateState({
                                existsQualityVote: isInputChecked ? 1 : 0
                            })}
                        />
                    </GridItem>
                    <GridItem xs={12} md={7} lg={7}>
                        <Checkbox
                            label={translate.exist_present_with_remote_vote}
                            value={statute.existsPresentWithRemoteVote === 1}
                            onChange={(event, isInputChecked) => updateState({
                                existsPresentWithRemoteVote: isInputChecked ? 1 : 0
                            })}
                        />
                    </GridItem>
                    <GridItem xs={12} md={7} lg={7}>
                        <Checkbox
                            label={translate.can_add_points}
                            value={statute.canAddPoints === 1}
                            onChange={(event, isInputChecked) => updateState({
                                canAddPoints: isInputChecked ? 1 : 0
                            })}
                        />
                    </GridItem>
                    <GridItem xs={12} md={7} lg={7}>
                        <Checkbox
                            label={translate.can_reorder_points}
                            value={statute.canReorderPoints === 1}
                            onChange={(event, isInputChecked) => updateState({
                                canReorderPoints: isInputChecked ? 1 : 0
                            })}
                        />
                    </GridItem>
                    <GridItem xs={12} md={7} lg={7}>
                        <Checkbox
                            label={translate.can_unblock}
                            value={statute.canUnblock === 1}
                            onChange={(event, isInputChecked) => updateState({
                                canUnblock: isInputChecked ? 1 : 0
                            })}
                        />
                    </GridItem>
                </Grid>


                <Typography variant="title" style={{
                    color: primary,
                    marginTop: '1em',
                    marginBottom: '1em'
                }}>
                    {translate.census}
                </Typography>
                <Grid>
                    <GridItem xs={12} md={4} lg={4}>
                        <SelectInput
                            floatingText={translate.associated_census}
                            value={statute.censusId || '-1'}
                            onChange={(event) => updateState({
                                censusId: event.target.value
                            })}
                        >
                            {!this.props.censusList.loading && !!this.props.censusList && this.props.censusList.censuses.list.map((census) => {
                                return <MenuItem value={census.id}
                                                 key={`census_${census.id}`}>{census.censusName}</MenuItem>
                            })

                            }
                        </SelectInput>
                    </GridItem>
                </Grid>


                <Typography variant="title" style={{
                    color: primary,
                    marginTop: '1em',
                    marginBottom: '1em'
                }}>
                    {translate.act_and_documentation}
                </Typography>
                <Grid>
                    <GridItem xs={12} md={7} lg={7}>
                        <Checkbox
                            label={translate.exists_act}
                            value={statute.existsAct === 1}
                            onChange={(event, isInputChecked) => updateState({
                                existsAct: isInputChecked ? 1 : 0
                            })}
                        />
                    </GridItem>
                    <GridItem xs={12} md={7} lg={7}>
                        <Checkbox
                            label={translate.included_in_act_book}
                            value={statute.includedInActBook === 1}
                            onChange={(event, isInputChecked) => updateState({
                                includedInActBook: isInputChecked ? 1 : 0
                            })}
                        />
                    </GridItem>
                    <GridItem xs={12} md={7} lg={7}>
                        <Checkbox
                            label={translate.include_participants_list_in_act}
                            value={statute.includeParticipantsList === 1}
                            onChange={(event, isInputChecked) => updateState({
                                includeParticipantsList: isInputChecked ? 1 : 0
                            })}
                        />
                    </GridItem>
                </Grid>

                <Typography variant="title" style={{
                    color: primary,
                    marginTop: '1em',
                    marginBottom: '1em'
                }}>
                    {translate.call_template}
                </Typography>
                <Grid>
                    <GridItem xs={12} md={12} lg={12}>
                        <RichTextInput
                            errorText=''
                            floatingText={translate.convene_header}
                            value={!!statute.conveneHeader ? statute.conveneHeader : ''}
                            onChange={(value) => updateState({
                                conveneHeader: value
                            })}
                        />
                    </GridItem>
                </Grid>
                {statute.existsAct === 1 && <Fragment>
                    <Typography variant="title" style={{
                        color: primary,
                        marginTop: '1em',
                        marginBottom: '1em'
                    }}>
                        {translate.act_templates}
                    </Typography>
                    <Grid>
                        <GridItem xs={12} md={12} lg={12}>
                            <RichTextInput
                                errorText=''
                                floatingText={translate.intro}
                                value={statute.intro || ''}
                                onChange={(value) => updateState({
                                    intro: value
                                })}
                            />
                        </GridItem>

                        <GridItem xs={12} md={12} lg={12}>
                            <RichTextInput
                                errorText=''
                                floatingText={translate.constitution}
                                value={statute.constitution || ''}
                                onChange={(value) => updateState({
                                    constitution: value
                                })}
                            />
                        </GridItem>

                        <GridItem xs={12} md={12} lg={12}>
                            <RichTextInput
                                errorText=''
                                floatingText={translate.conclusion}
                                value={statute.conclusion || ''}
                                onChange={(value) => updateState({
                                    conclusion: value
                                })}
                            />
                        </GridItem>
                    </Grid>
                </Fragment>}
            </Fragment>);
    }
}

export default compose(graphql(quorumTypes), graphql(censuses, {
    name: 'censusList',
    options: (props) => ({
        variables: {
            companyId: props.companyId
        },
        notifyOnNetworkStatusChange: true
    })
}))(StatuteEditor);