import React, { Fragment } from 'react';
import { SelectInput, Grid, GridItem, Checkbox, TextInput, RichTextInput } from '../../displayComponents/index';
import { Typography, MenuItem } from 'material-ui';
import { quorumTypes, censuses } from '../../../queries';
import { graphql, compose } from 'react-apollo';
import { getPrimary } from '../../../styles/colors';

class StatuteEditor extends React.PureComponent {

    render(){
        const { statute, translate, updateState, errors } = this.props;
        const { quorumTypes, loading } = this.props.data;
        const primary = getPrimary();

        return(
            <Fragment>
                <Typography variant="title" style={{color: primary}}>
                    {translate.convene}
                </Typography>
                <Grid>
                    <GridItem xs={12} md={8} lg={6}>
                        <Checkbox
                            label={translate.exists_advance_notice_days}
                            value={statute.existsAdvanceNoticeDays === 1}
                            onChange={(event, isInputChecked) => updateState({
                                    existsAdvanceNoticeDays: isInputChecked? 1 : 0
                                })
                            }
                        />
                    </GridItem>
                    <GridItem xs={12} md={4} lg={6}>
                        {statute.existsAdvanceNoticeDays === 1 &&
                            <TextInput
                                floatingText={translate.input_group_days}
                                required
                                type="number"
                                errorText={errors.advanceNoticeDays}
                                value={statute.advanceNoticeDays}
                                onChange={(event) => updateState({
                                        advanceNoticeDays: event.target.value
                                    })
                                }/>
                        }
                    </GridItem>
                    
                    <GridItem xs={12} md={6} lg={6}>
                        <Checkbox
                            label={translate.exists_second_call}
                            value={statute.existsSecondCall === 1}
                            onChange={(event, isInputChecked) => updateState({
                                    existsSecondCall: isInputChecked? 1 : 0
                                })
                            }
                        />
                    </GridItem>
                    <GridItem xs={12} md={1} lg={1}>
                        {statute.existsSecondCall === 1 &&
                            <TextInput
                                floatingText={translate.minutes}
                                required
                                type="number"
                                errorText={errors.minimumSeparationBetweenCall}
                                value={statute.minimumSeparationBetweenCall}
                                onChange={(event) => updateState({
                                        minimumSeparationBetweenCall: event.target.value
                                    })
                                }
                            />
                        }
                    </GridItem>

                </Grid>
                <Typography variant="title" style={{color: primary, marginTop: '1em'}}>
                    {translate.assistance}
                </Typography>
                <Grid>
                    <GridItem xs={12} md={6} lg={6}>
                        <Typography variant="body1">
                            {translate.quorum_type}
                        </Typography>
                    </GridItem>
                    <GridItem xs={12} md={4} lg={4}>
                        <SelectInput
                            floatingText={translate.census_type}
                            value={statute.quorumPrototype}
                            onChange={(event, child) => updateState({
                                    quorumPrototype: event.target.value
                                }) 
                            }>
                            <MenuItem value={0}>{translate.census_type_assistants}</MenuItem>
                            <MenuItem value={1}>{translate.social_capital}</MenuItem>    
                        </SelectInput>
                    </GridItem>


                    <GridItem xs={12} md={6} lg={6}>
                        <Typography variant="body1">
                            {translate.exist_quorum_assistance_first_call}
                        </Typography>
                    </GridItem>
                    <GridItem xs={6} md={2} lg={2}>
                        <SelectInput
                            floatingText={translate.census_type}
                            value={statute.quorumPrototype}
                            onChange={(event, child) => updateState({
                                    quorumPrototype: event.target.value
                                }) 
                            }
                        >
                            {!loading &&
                                quorumTypes.map((quorumType) => {
                                    return <MenuItem value={quorumType.value} key={`quorum_${quorumType.label}`}>{translate[quorumType.label]}</MenuItem>
                                })

                            }
                        </SelectInput>
                    </GridItem>
                    <GridItem xs={6} md={2} lg={2}>
                        <TextInput
                            floatingText={translate.minutes}
                            required
                            type="number"
                            errorText={errors.minimumSeparationBetweenCall}
                            value={statute.minimumSeparationBetweenCall}
                            onChange={(event) => updateState({
                                    minimumSeparationBetweenCall: event.target.value
                                })
                            }
                        />
                    </GridItem>
                    <GridItem xs={12} md={7} lg={7}>
                        <Checkbox
                            label={translate.exists_delegated_vote}
                            value={statute.existsDelegatedVote === 1}
                            onChange={(event, isInputChecked) => updateState({
                                    existsDelegatedVote: isInputChecked? 1 : 0
                                })
                            }
                        />
                    </GridItem>
                    <GridItem xs={10} md={6} lg={6}>
                        <Checkbox
                            label={translate.exist_max_num_delegated_votes}
                            value={statute.existMaxNumDelegatedVotes  === 1}
                            onChange={(event, isInputChecked) => updateState({
                                    existMaxNumDelegatedVotes: isInputChecked? 1 : 0
                                })
                            }
                        />
                    </GridItem>
                    <GridItem xs={2} md={2} lg={2}>
                        {statute.existMaxNumDelegatedVotes === 1 &&
                            <TextInput
                                floatingText={translate.votes}
                                required
                                type="number"
                                errorText={errors.maxNumDelegatedVotes}
                                value={statute.maxNumDelegatedVotes}
                                onChange={(event) => updateState({
                                        maxNumDelegatedVotes: event.target.value
                                    })
                                }
                            />
                        }
                    </GridItem>
                    <GridItem xs={10} md={6} lg={6}>
                        <Checkbox
                            label={translate.exists_limited_access_room}
                            value={statute.existsLimitedAccessRoom  === 1}
                            onChange={(event, isInputChecked) => updateState({
                                    existsLimitedAccessRoom: isInputChecked? 1 : 0
                                })
                            }
                        />
                    </GridItem>
                    <GridItem xs={2} md={2} lg={2}>
                        {statute.existsLimitedAccessRoom === 1 &&
                            <TextInput
                                floatingText={translate.minutes}
                                required
                                type="number"
                                errorText={errors.limitedAccessRoomMinutes}
                                value={statute.limitedAccessRoomMinutes}
                                onChange={(event) => updateState({
                                        limitedAccessRoomMinutes: event.target.value
                                    })
                                }
                            />
                        }
                    </GridItem>
                </Grid>


                <Typography variant="title" style={{color: primary, marginTop: '1em', marginBottom: '1em'}}>
                    {translate.celebration_and_agreements}
                </Typography>
                <Grid>
                    <GridItem xs={12} md={7} lg={7}>
                        <Checkbox
                            label={translate.exists_comments}
                            value={statute.existsComments === 1}
                            onChange={(event, isInputChecked) => updateState({
                                    existsComments: isInputChecked? 1 : 0
                                })
                            }
                        />
                    </GridItem>
                    <GridItem xs={12} md={7} lg={7}>
                        <Checkbox
                            label={translate.exists_notify_points}
                            value={statute.notifyPoints === 1}
                            onChange={(event, isInputChecked) => updateState({
                                    notifyPoints: isInputChecked? 1 : 0
                                })
                            }
                        />
                    </GridItem>
                    <GridItem xs={12} md={7} lg={7}>
                        <Checkbox
                            label={translate.exists_quality_vote}
                            value={statute.existsQualityVote === 1}
                            onChange={(event, isInputChecked) => updateState({
                                    existsQualityVote: isInputChecked? 1 : 0
                                })
                            }
                        />
                    </GridItem>
                    <GridItem xs={12} md={7} lg={7}>
                        <Checkbox
                            label={translate.exist_present_with_remote_vote}
                            value={statute.existsPresentWithRemoteVote === 1}
                            onChange={(event, isInputChecked) => updateState({
                                    existsPresentWithRemoteVote: isInputChecked? 1 : 0
                                })
                            }
                        />
                    </GridItem>
                    <GridItem xs={12} md={7} lg={7}>
                        <Checkbox
                            label={translate.can_add_points}
                            value={statute.canAddPoints === 1}
                            onChange={(event, isInputChecked) => updateState({
                                    canAddPoints: isInputChecked? 1 : 0
                                })
                            }
                        />
                    </GridItem>
                    <GridItem xs={12} md={7} lg={7}>
                        <Checkbox
                            label={translate.can_reorder_points}
                            value={statute.canReorderPoints === 1}
                            onChange={(event, isInputChecked) => updateState({
                                    canReorderPoints: isInputChecked? 1 : 0
                                })
                            }
                        />
                    </GridItem>
                    <GridItem xs={12} md={7} lg={7}>
                        <Checkbox
                            label={translate.can_unblock}
                            value={statute.canUnblock === 1}
                            onChange={(event, isInputChecked) => updateState({
                                    canUnblock: isInputChecked? 1 : 0
                                })
                            }
                        />
                    </GridItem>
                </Grid>


                <Typography variant="title" style={{color: primary, marginTop: '1em', marginBottom: '1em'}}>
                    {translate.census}
                </Typography>
                <Grid>
                    <GridItem xs={12} md={4} lg={4}>
                        <SelectInput
                            floatingText={translate.associated_census}
                            value={statute.censusId || '-1'}
                            onChange={(event, child) => updateState({
                                    censusId: event.target.value
                                }) 
                            }
                        >
                            {!this.props.censusList.loading && !!this.props.censusList &&
                                this.props.censusList.censuses.list.map((census) => {
                                    return <MenuItem value={census.id} key={`censu_${census.id}`}>{census.censusName}</MenuItem>
                                })

                            }
                        </SelectInput>
                    </GridItem>
                </Grid>


                <Typography variant="title" style={{color: primary, marginTop: '1em', marginBottom: '1em'}}>
                    {translate.act_and_documentation}
                </Typography>
                <Grid>
                    <GridItem xs={12} md={7} lg={7}>
                        <Checkbox
                            label={translate.exists_act}
                            value={statute.existsAct === 1}
                            onChange={(event, isInputChecked) => updateState({
                                    existsAct: isInputChecked? 1 : 0
                                })
                            }
                        />
                    </GridItem>
                    <GridItem xs={12} md={7} lg={7}>
                        <Checkbox
                            label={translate.included_in_act_book}
                            value={statute.includedInActBook === 1}
                            onChange={(event, isInputChecked) => updateState({
                                    includedInActBook: isInputChecked? 1 : 0
                                })
                            }
                        />
                    </GridItem>
                    <GridItem xs={12} md={7} lg={7}>
                        <Checkbox
                            label={translate.include_participants_list_in_act}
                            value={statute.includeParticipantsList === 1}
                            onChange={(event, isInputChecked) => updateState({
                                    includeParticipantsList: isInputChecked? 1 : 0
                                })
                            }
                        />
                    </GridItem>
                </Grid>

                <Typography variant="title" style={{color: primary, marginTop: '1em', marginBottom: '1em'}}>
                    {translate.call_template}
                </Typography>
                <Grid>
                    <GridItem xs={12} md={10} lg={8}>
                        <RichTextInput
                            errorText=''
                            floatingText={translate.convene_header}
                            value={!!statute.conveneHeader? statute.conveneHeader : ''}
                            onChange={(value) => updateState({
                                conveneHeader: value
                            })}
                        />
                    </GridItem>
                </Grid>
                {statute.existsAct === 1 &&
                    <Fragment>
                        <Typography variant="title" style={{color: primary, marginTop: '1em', marginBottom: '1em'}}>
                            {translate.act_templates}
                        </Typography>
                        <Grid>
                            <GridItem xs={12} md={10} lg={8}>
                                <RichTextInput
                                    errorText=''
                                    floatingText={translate.intro}
                                    value={statute.intro || ''}
                                    onChange={(value) => updateState({
                                        intro: value
                                    })}
                                />
                            </GridItem>

                            <GridItem xs={12} md={10} lg={8}>
                                <RichTextInput
                                    errorText=''
                                    floatingText={translate.constitution}
                                    value={statute.constitution || ''}
                                    onChange={(value) => updateState({
                                        constitution: value
                                    })}
                                />
                            </GridItem>

                            <GridItem xs={12} md={10} lg={8}>
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
                    </Fragment>
                }
            </Fragment>
        );
    }
}

export default compose(
    graphql(quorumTypes),
    graphql(censuses, {
        name: 'censusList',
        options: (props) => ({
            variables: {
                companyId: props.statute.companyId
            },
            notifyOnNetworkStatusChange: true
        })
    })
)(StatuteEditor);