import { MAX_COUNCIL_ATTACHMENTS, MAX_COUNCIL_FILE_SIZE } from '../constants';

export const canReorderPoints = (council) => {
    if(council.statute.canReorderPoints === 1){
        return true;
    }
    return false;
}

export const showAddCouncilAttachment = (attachments) => {
    if(attachments.length >= MAX_COUNCIL_ATTACHMENTS){
        return false;
    }
    return true;
}

export const canAddCouncilAttachment = (council, filesize) => {
    if(council.attachments.reduce((a, b) => a + parseInt(b.filesize, 10), 0) + filesize < MAX_COUNCIL_FILE_SIZE){
        return true;
    }
    return false;
}

export const showAgendaVotingsToggle = (council, agenda) => {
    if(council.councilStarted === 1 && agenda.subjectType !== 0 && agenda.votingState !== 2){
        return true;
    }
    return false;
}

export const councilHasVideo = (council) => {
    return council.councilType === 0;
}

export const censusHasParticipations = (census) => {
    return census.quorumPrototype === 1
}

export const hasVotation = (pointType) => {
    return pointType === 1 || pointType === 3 || pointType === 5;
}

export const majorityNeedsInput = (majorityType) => {
    return majorityType === 0 || majorityType === 5 || majorityType === 6;
}

export const isMajorityPercentage = (majorityType) => {
    return majorityType === 0;
}

export const isMajorityFraction = (majorityType) => {
    return majorityType === 5;
}

export const isMajorityNumber = (majorityType) => {
    return majorityType === 6;
}

export const hasAct = (statute) => {
    return statute.existsAct === 1;
}

export const filterAgendaVotingTypes = (votingTypes, statute) => {
    if(statute.existsPresentWithRemoteVote === 1){
        return votingTypes.filter((type) => type.label === 'text' || type.label === 'public_votation');
    }
    return votingTypes; 
}

export const hasSecondCall = (statute) => {
    return statute.existsSecondCall === 1;
}