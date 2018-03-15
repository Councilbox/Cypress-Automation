import { maxCouncilAttachments, maxCouncilFilesSize } from '../constants';

export const canReorderPoints = (council) => {
    if(council.statute.canReorderPoints === 1){
        return true;
    }
    return false;
}

export const showAddCouncilAttachment = (attachments) => {
    if(attachments.length >= maxCouncilAttachments){
        return false;
    }
    return true;
}

export const canAddCouncilAttachment = (council, filesize) => {
    if(council.attachments.reduce((a, b) => a + parseInt(b.filesize, 10), 0) + filesize < maxCouncilFilesSize){
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