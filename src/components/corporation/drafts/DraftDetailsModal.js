import React from 'react';
import { AlertConfirm, Grid, GridItem } from '../../../displayComponents';
import { hasVotation, majorityNeedsInput, isMajorityFraction, isMajorityPercentage } from '../../../utils/CBX';

const DraftDetailsModal = ({ draft, requestClose, translate, companyTypes, draftTypes, votingTypes, majorityTypes }) => {

    console.log(companyTypes, draftTypes, votingTypes, majorityTypes);

    const getMajorityType = majorityType => {
        return majorityTypes.find(majority => majority.value === draft.majorityType);
    }

    const _renderDraftDetails = () => {
        const width = window.innerWidth < 950? '100%' : '750px';
        return(
            <Grid style={{width: width}}>
                <GridItem xs={12} md={12} lg={12}>
                    <span style={{fontWeight: '700'}}>{translate.title}</span>{`: ${draft.title}`}
                </GridItem>
                <GridItem xs={12} lg={12} md={12}>
                    <span style={{fontWeight: '700'}}>{translate.company_type}</span>{`: ${companyTypes[draft.companyType]? translate[companyTypes[draft.companyType].label] : '-'}`}
			    </GridItem>
                <GridItem xs={12} lg={12} md={12}>
                    <span style={{fontWeight: '700'}}>{translate.draft_type}</span>{`: ${draftTypes[draft.type]? translate[draftTypes[draft.type].label] : '-'}`}
			    </GridItem>
                <GridItem xs={12} lg={12} md={12}>
                    <span style={{fontWeight: '700'}}>{translate.votation_type}</span>{`: ${votingTypes[draft.votationType]? translate[votingTypes[draft.votationType].label] : '-'}`}
                </GridItem>
                {hasVotation(draft.votationType) && (
                    <React.Fragment>
                        <GridItem xs={6} lg={6} md={6}>
                        <span style={{fontWeight: '700'}}>{translate.majority_type}</span>{`: ${translate[getMajorityType().label]}`}
                        </GridItem>
                        <GridItem xs={6} lg={6} md={6}>
                            {majorityNeedsInput(draft.majorityType) && (
                                <span>
                                    {`${draft.majority} ${
                                        isMajorityFraction(draft.majorityType)? `/ ${
                                        draft.majorityDivider}` : ''
                                    } ${
                                        isMajorityPercentage(draft.majorityType)? '%' : ''}`}
                                </span>

                            )}
                        </GridItem>
                    </React.Fragment>
                )}
                <GridItem xs={12} lg={12} md={12}>
                    <span style={{fontWeight: '700'}}>{translate.description}</span>{`: ${draft.description}`}
                </GridItem>
                <GridItem xs={11} lg={12} md={12}>
                    <div dangerouslySetInnerHTML={{
                        __html: draft.text
                    }} />
                </GridItem>
            </Grid>
        )
    }

    return (
        <AlertConfirm
            requestClose={requestClose}
            open={!!draft}
            fullWidth={false}
            modal={false}
            buttonCancel={translate.cancel}
            bodyText={draft? _renderDraftDetails() : <span/>}
            title={translate.draft_details}
        />
    )
}

export default DraftDetailsModal;

/* <MajorityInput
        type={draft.majorityType}
        value={draft.majority}
        divider={draft.majorityDivider}
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
    /> */