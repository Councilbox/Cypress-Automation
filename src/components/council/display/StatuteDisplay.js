import React from 'react';

const StatuteDisplay = ({ statute, translate }) => (
    <div>
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
            <span>{translate.exists_advance_notice_days}</span>{getSelectionIcon(statute.existsAdvanceNoticeDays)}
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <span>{translate.exists_advance_notice_days}</span>{getSelectionIcon(statute.existsAdvanceNoticeDays)}
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <span>{translate.exists_advance_notice_days}</span>{getSelectionIcon(statute.existsAdvanceNoticeDays)}
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <span>{translate.exists_advance_notice_days}</span>{getSelectionIcon(statute.existsAdvanceNoticeDays)}
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <span>{translate.exists_advance_notice_days}</span>{getSelectionIcon(statute.existsAdvanceNoticeDays)}
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <span>{translate.exists_advance_notice_days}</span>{getSelectionIcon(statute.existsAdvanceNoticeDays)}
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <span>{translate.exists_advance_notice_days}</span>{getSelectionIcon(statute.existsAdvanceNoticeDays)}
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <span>{translate.exists_advance_notice_days}</span>{getSelectionIcon(statute.existsAdvanceNoticeDays)}
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <span>{translate.exists_advance_notice_days}</span>{getSelectionIcon(statute.existsAdvanceNoticeDays)}
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <span>{translate.exists_advance_notice_days}</span>{getSelectionIcon(statute.existsAdvanceNoticeDays)}
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <span>{translate.exists_advance_notice_days}</span>{getSelectionIcon(statute.existsAdvanceNoticeDays)}
        </div>
    </div>
)

const getSelectionIcon = value => {
    if(value === 1){
        return <i className="fa fa-check" style={{color: 'limegreen', marginLeft: '0.3em'}} aria-hidden="true"></i>
    }

    return <i className="fa fa-times" style={{color: 'red', marginLeft: '0.3em'}} aria-hidden="true"></i>
}

export default StatuteDisplay;