import React from 'react';

export const StatuteDisplay = ({ statute, translate, quorumTypes }) => (
    <div style={{ maxWidth: '900px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {getSelectionIcon(statute.existsAdvanceNoticeDays)}
            <span>{translate.exists_advance_notice_days}</span>
            {
                statute.existsAdvanceNoticeDays ?
                    `${' '}   -  ${statute.advanceNoticeDays} ${translate.input_group_days}`
                    : ''
            }
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {getSelectionIcon(statute.existsSecondCall)}<span>{translate.exists_second_call}</span>
        </div>
        {statute.existsSecondCall === 1 &&
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{width: "15px", marginRight: "0.4em"}}></div><span>{translate.minimum_separation_between_call}</span>{` - ${statute.minimumSeparationBetweenCall} ${translate.minutes}`}
            </div>
        }
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{width: "15px", marginRight: "0.4em" }}></div> <span style={{ marginRight: '0.3em' }}>{translate.quorum_type}:</span>{statute.quorumPrototype ? translate.social_capital : translate.census_type_assistants}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: "15px", marginRight: "0.4em" }}></div>   <span style={{ marginRight: '0.3em' }}>{translate.exist_quorum_assistance_first_call}:</span>{translate[getQuorumType(statute.firstCallQuorumType, quorumTypes)]}
        </div>

        {statute.existsSecondCall === 1 &&
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '0.3em' }}>{translate.exist_quorum_assistance_second_call}:</span>{translate[getQuorumType(statute.secondCallQuorumType, quorumTypes)]}
            </div>
        }
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {getSelectionIcon(statute.existsDelegatedVote)} <span>{translate.exists_delegated_vote}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {getSelectionIcon(statute.existMaxNumDelegatedVotes)}
            <span>{translate.exist_max_num_delegated_votes}</span>
            {`${statute.existMaxNumDelegatedVotes ? ` - ${statute.maxNumDelegatedVotes}` : ''}`}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {getSelectionIcon(statute.existsLimitedAccessRoom)} <span>{translate.exists_limited_access_room}</span>
            {`${statute.existsLimitedAccessRoom ? ` - ${statute.limitedAccessRoomMinutes} min` : ''}`}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {getSelectionIcon(statute.existsComments)}<span>{translate.exists_comments}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {getSelectionIcon(statute.notifyPoints)} <span>{translate.exists_notify_points}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {getSelectionIcon(statute.existsQualityVote)}<span>{translate.exists_quality_vote}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {getSelectionIcon(statute.existsPresentWithRemoteVote)}  <span>{translate.exist_present_with_remote_vote}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {getSelectionIcon(statute.canAddPoints)} <span>{translate.can_add_points}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {getSelectionIcon(statute.canReorderPoints)} <span>{translate.can_reorder_points}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {getSelectionIcon(statute.canUnblock)} <span>{translate.can_unblock}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {getSelectionIcon(statute.existsAct)}<span>{translate.exists_act}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {getSelectionIcon(statute.includedInActBook)}  <span>{translate.included_in_act_book}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {getSelectionIcon(statute.includeParticipantsList)}<span>{translate.include_participants_list_in_act}</span>
        </div>
    </div>
)

export const StatuteDisplayIconsIzq = ({ statute, translate, quorumTypes }) => (
    <div style={{ maxWidth: '900px', marginLeft: "5px" }}>
        <div style={{ display: 'flex' }}  className={"colorTable"}>
            <div style={{ width: "25px" }}>{getSelectionIcon(statute.existsAdvanceNoticeDays)}</div>
            <span style={{ width: "100%" }}>{statute.existsAdvanceNoticeDays ?
                `${' '}     ${statute.advanceNoticeDays} ${translate.input_group_days}  -  `
                : ''
            }

                {translate.exists_advance_notice_days}</span>
        </div>
        <div style={{ display: 'flex'}} className={"colorTable"}>
            <div style={{ width: "25px" }}>{getSelectionIcon(statute.existsSecondCall)}</div><span style={{ width: "100%" }}>{translate.exists_second_call}</span>
        </div>
        {statute.existsSecondCall === 1 &&
            <div style={{ display: 'flex'}}  className={"colorTable"}> 
                <div style={{ width: "25px" }}></div> <span>{translate.minimum_separation_between_call}{` - ${statute.minimumSeparationBetweenCall} ${translate.minutes}`}</span>
            </div>
        }
        <div style={{display: 'flex'}}  className={"colorTable"}>
            <div style={{ width: "25px" }}></div><span style={{ width: "100%" }}>{translate.quorum_type}: {statute.quorumPrototype ? translate.social_capital : translate.census_type_assistants}</span>
        </div>
        <div style={{ display: 'flex' }}  className={"colorTable"}>
            <div style={{ width: "25px" }}></div><span style={{ width: "100%" }}>{translate.exist_quorum_assistance_first_call}:{translate[getQuorumType(statute.firstCallQuorumType, quorumTypes)]}</span>
        </div>

        {statute.existsSecondCall === 1 &&
            <div style={{ display: 'flex' }}  className={"colorTable"}>
                <div style={{ width: "25px" }}></div><span style={{ width: "100%" }}>{translate.exist_quorum_assistance_second_call}:{translate[getQuorumType(statute.secondCallQuorumType, quorumTypes)]}</span>
            </div>
        }
        <div style={{ display: 'flex' }}  className={"colorTable"}>
            <div style={{ width: "25px" }}>{getSelectionIcon(statute.existsDelegatedVote)}</div><span style={{ width: "100%" }} >{translate.exists_delegated_vote}</span>
        </div>
        <div style={{ display: 'flex' }}  className={"colorTable"}>
            <div style={{ width: "25px" }}>{getSelectionIcon(statute.existMaxNumDelegatedVotes)}</div>
            {`${statute.existMaxNumDelegatedVotes ? ` - ${statute.maxNumDelegatedVotes}` : ''}`}<span style={{ width: "100%" }}>{translate.exist_max_num_delegated_votes}</span>
        </div>
        <div style={{ display: 'flex' }}  className={"colorTable"}>
            <div style={{ width: "25px" }}>{getSelectionIcon(statute.existsLimitedAccessRoom)}</div>
            {`${statute.existsLimitedAccessRoom ? ` - ${statute.limitedAccessRoomMinutes} min` : ''}`}<span style={{ width: "100%" }}>{translate.exists_limited_access_room}</span>
        </div>
        <div style={{ display: 'flex' }}  className={"colorTable"}>
            <div style={{ width: "25px" }}>{getSelectionIcon(statute.existsComments)}</div> <span style={{ width: "100%" }}>{translate.exists_comments}</span>
        </div>
        <div style={{ display: 'flex' }}  className={"colorTable"}>
            <div style={{ width: "25px" }}>{getSelectionIcon(statute.notifyPoints)}</div><span style={{ width: "100%" }}>{translate.exists_notify_points}</span>
        </div>
        <div style={{ display: 'flex' }}  className={"colorTable"}>
            <div style={{ width: "25px" }}>{getSelectionIcon(statute.existsQualityVote)}</div><span style={{ width: "100%" }}>{translate.exists_quality_vote}</span>
        </div>
        <div style={{ display: 'flex' }}  className={"colorTable"}>
            <div style={{ width: "25px" }}>{getSelectionIcon(statute.existsPresentWithRemoteVote)}</div><span style={{ width: "100%" }}>{translate.exist_present_with_remote_vote}</span>
        </div>
        <div style={{ display: 'flex' }}  className={"colorTable"}>
            <div style={{ width: "25px" }}>{getSelectionIcon(statute.canAddPoints)} </div><span style={{ width: "100%" }}>{translate.can_add_points}</span>
        </div>
        <div style={{ display: 'flex' }}  className={"colorTable"}>
            <div style={{ width: "25px" }}>{getSelectionIcon(statute.canReorderPoints)} </div> <span style={{ width: "100%" }}>{translate.can_reorder_points}</span>
        </div>
        <div style={{ display: 'flex' }}  className={"colorTable"}>
            <div style={{ width: "25px" }}>{getSelectionIcon(statute.canUnblock)}</div> <span style={{ width: "100%" }}>{translate.can_unblock}</span>
        </div>
        <div style={{ display: 'flex' }}  className={"colorTable"}>
            <div style={{ width: "25px" }}>{getSelectionIcon(statute.existsAct)}</div><span style={{ width: "100%" }}>{translate.exists_act}</span>
        </div>
        <div style={{ display: 'flex' }}  className={"colorTable"}>
            <div style={{ width: "25px" }}>{getSelectionIcon(statute.includedInActBook)}</div><span style={{ width: "100%" }}>{translate.included_in_act_book}</span>
        </div>
        <div style={{ display: 'flex' }}  className={"colorTable"}>
            <div style={{ width: "25px" }}>{getSelectionIcon(statute.includeParticipantsList)} </div><span style={{ width: "100%" }}>{translate.include_participants_list_in_act}</span>
        </div>
    </div>
)

const getSelectionIcon = value => {
    if (value === 1) {
        return <i className="fa fa-check" style={{ color: 'limegreen', marginRight: '0.4em', width: "15px" }} aria-hidden="true"></i>
    }

    return <i className="fa fa-times" style={{ color: 'red', marginRight: '0.4em', width: "15px" }} aria-hidden="true"></i>
}

const getQuorumType = (type, quorumTypes) => {
    const quorum = quorumTypes.find(quorum => type = quorum.value);
    if (quorum) {
        return quorum.label;
    }
    return '-';
}