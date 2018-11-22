import React from 'react';

const StatuteDisplay = ({ statute, translate, quorumTypes }) => (
    <div style={{maxWidth: '900px'}}>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <span>{translate.exists_advance_notice_days}</span>
            {getSelectionIcon(statute.existsAdvanceNoticeDays)}{
                statute.existsAdvanceNoticeDays?
                    `${' '}   -  ${statute.advanceNoticeDays} ${translate.input_group_days}`
                : ''
            }
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <span>{translate.exists_second_call}</span>{getSelectionIcon(statute.existsSecondCall)}
        </div>
        {statute.existsSecondCall === 1 &&
            <div style={{display: 'flex', alignItems: 'center'}}>
                <span>{translate.minimum_separation_between_call}</span>{` - ${statute.minimumSeparationBetweenCall} ${translate.minutes}`}
            </div>
        }
        <div style={{display: 'flex', alignItems: 'center'}}>
            <span style={{marginRight: '0.3em'}}>{translate.quorum_type}:</span>{statute.quorumPrototype? translate.social_capital : translate.census_type_assistants}
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <span style={{marginRight: '0.3em'}}>{translate.exist_quorum_assistance_first_call}:</span>{translate[getQuorumType(statute.firstCallQuorumType, quorumTypes)]}
        </div>

        {statute.existsSecondCall === 1 &&
            <div style={{display: 'flex', alignItems: 'center'}}>
                <span style={{marginRight: '0.3em'}}>{translate.exist_quorum_assistance_second_call}:</span>{translate[getQuorumType(statute.secondCallQuorumType, quorumTypes)]}
            </div>
        }
        <div style={{display: 'flex', alignItems: 'center'}}>
            <span>{translate.exists_delegated_vote}</span>{getSelectionIcon(statute.existsDelegatedVote)}
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <span>{translate.exist_max_num_delegated_votes}</span>{getSelectionIcon(statute.existMaxNumDelegatedVotes)}
               {`${statute.existMaxNumDelegatedVotes? ` - ${statute.maxNumDelegatedVotes}` : ''}`}
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <span>{translate.exists_limited_access_room}</span>{getSelectionIcon(statute.existsLimitedAccessRoom)}
            {`${statute.existsLimitedAccessRoom? ` - ${statute.limitedAccessRoomMinutes} min` : ''}`}
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <span>{translate.exists_comments}</span>{getSelectionIcon(statute.existsComments)}
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <span>{translate.exists_notify_points}</span>{getSelectionIcon(statute.notifyPoints)}
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <span>{translate.exists_quality_vote}</span>{getSelectionIcon(statute.existsQualityVote)}
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <span>{translate.exist_present_with_remote_vote}</span>{getSelectionIcon(statute.existsPresentWithRemoteVote)}
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <span>{translate.can_add_points}</span>{getSelectionIcon(statute.canAddPoints)}
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <span>{translate.can_reorder_points}</span>{getSelectionIcon(statute.canReorderPoints)}
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <span>{translate.can_unblock}</span>{getSelectionIcon(statute.canUnblock)}
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <span>{translate.exists_act}</span>{getSelectionIcon(statute.existsAct)}
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <span>{translate.included_in_act_book}</span>{getSelectionIcon(statute.includedInActBook)}
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <span>{translate.include_participants_list_in_act}</span>{getSelectionIcon(statute.includeParticipantsList)}
        </div>
    </div>
)

const getSelectionIcon = value => {
    if(value === 1){
        return <i className="fa fa-check" style={{color: 'limegreen', marginLeft: '0.3em'}} aria-hidden="true"></i>
    }

    return <i className="fa fa-times" style={{color: 'red', marginLeft: '0.3em'}} aria-hidden="true"></i>
}

const getQuorumType = (type, quorumTypes) => {
    const quorum = quorumTypes.find(quorum => type = quorum.value);
    if(quorum){
        return quorum.label;
    }
    return '-';
}

export default StatuteDisplay;