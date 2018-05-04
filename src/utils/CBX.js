import { MAX_COUNCIL_ATTACHMENTS, MAX_COUNCIL_FILE_SIZE, PARTICIPANT_STATES } from '../constants';
import moment from 'moment';
import dropped from '../assets/img/dropped.png';
import delivered from '../assets/img/delivered.png';
import invalidEmailAddress from '../assets/img/invalid_email_address.png';
import notSent from '../assets/img/not_sent.png';
import opened from '../assets/img/opened.png';
import pendingShipping from '../assets/img/pending_shipping.png';
import spam from '../assets/img/spam.png';


export const canReorderPoints = (council) => {
    return council.statute.canReorderPoints === 1;
};

export const showAddCouncilAttachment = (attachments) => {
    return attachments.length < MAX_COUNCIL_ATTACHMENTS;
};

export const canAddCouncilAttachment = (council, filesize) => {
    return council.attachments.reduce((a, b) => a + parseInt(b.filesize, 10), 0) + filesize < MAX_COUNCIL_FILE_SIZE;
};

export const showAgendaVotingsToggle = (council, agenda) => {
    return council.councilStarted === 1 && agenda.subjectType !== 0 && agenda.votingState !== 2;
};

export const councilHasVideo = (council) => {
    return council.councilType === 0;
};

export const censusHasParticipations = (census) => {
    return census.quorumPrototype === 1
};

export const hasVotation = (pointType) => {
    return pointType === 1 || pointType === 3 || pointType === 5;
};

export const majorityNeedsInput = (majorityType) => {
    return majorityType === 0 || majorityType === 5 || majorityType === 6;
};

export const isMajorityPercentage = (majorityType) => {
    return majorityType === 0;
};

export const isMajorityFraction = (majorityType) => {
    return majorityType === 5;
};

export const isMajorityNumber = (majorityType) => {
    return majorityType === 6;
};

export const quorumNeedsInput = (quorumType) => {
    return quorumType === 0 || quorumType === 2 || quorumType === 3;
};

export const isQuorumPercentage = (quorumType) => {
    return quorumType === 0;
};

export const isQuorumFraction = (quorumType) => {
    return quorumType === 2;
};

export const isQuorumNumber = (quorumType) => {
    return quorumType === 3;
};

export const hasAct = (statute) => {
    return statute.existsAct === 1;
};

export const filterAgendaVotingTypes = (votingTypes, statute) => {
    if(statute.existsPresentWithRemoteVote === 1){
        return votingTypes.filter((type) => type.label === 'text' || type.label === 'public_votation');
    }
    return votingTypes; 
};

export const hasSecondCall = (statute) => {
    return statute.existsSecondCall === 1;
};

export const checkMinimunDistanceBetweenCalls = (firstCall, secondCall, statute) => {
    const firstDate = moment(new Date(firstCall).toISOString(), moment.ISO_8601);
    const secondDate = moment(new Date(secondCall).toISOString(), moment.ISO_8601);
    const difference = secondDate.diff(firstDate, 'minutes');
    return difference >= statute.minimumSeparationBetweenCall;
};

export const checkSecondDateAfterFirst = (firstDate, secondDate) => {
    const first = moment(new Date(firstDate).toISOString(), moment.ISO_8601);
    const second = moment(new Date(secondDate).toISOString(), moment.ISO_8601);
    const difference = second.diff(first, 'minutes');
    return difference > 0;
};

export const addMinimunDistance = (date, statute) => {
    const momentDate = moment(new Date(date).toISOString());
    return momentDate.add(statute.minimumSeparationBetweenCall, 'minutes');
};

export const changeVariablesToValues = (text, data) => {
    if(!data || !data.company || !data.council){
        throw new Error('Missing data');
    }

    text = text.replace('{{dateFirstCall}}', moment(new Date(data.council.dateStart).toISOString(), moment.ISO_8601).format('LLL'));
    text = text.replace('{{business_name}}', data.company.businessName);
    text = text.replace('{{city}}', data.council.city);
    text = text.replace('{{street}}', data.council.street);
    text = text.replace('{{country_state}}', data.council.countryState);
    
    return text;
};

export const hasParticipations = (statute = {}) => {
    return statute.quorumPrototype === 1;
};

export const isRepresentative = (participant) => {
    return participant.type === 2;
};

export const removeHTMLTags = (string) => {
    return string.replace(/<(?:.|\n)*?>/gm, '');
};

export const councilHasActPoint = (council) => {
    return council.approveActDraft === 1;
};

export const getActPointSubjectType = () => {
    return 2;
};

export const showUserUniqueKeyMessage = (council) => {
    return council.securityType === 1 || council.securityType === 2;
};

export const councilIsNotified = (council) => {
    return council.state === 10;
};

export const printPrettyFilesize = (filesize) => {
    if(filesize < 1024) {
        return `${filesize} Bytes`;
    }
    if(filesize < 1048576){
        return `${addTwoDecimals(filesize / 1024, 2)} KBs`;
    }
    if(filesize < 1073741824){
        return `${addTwoDecimals(filesize / 1048576, 2)} MBs`;
    }
    return `${addTwoDecimals(filesize / 1073741824, 2)} GBs`;
};

export const addTwoDecimals = (num, fixed) => {
    num = num.toString();
    return num.slice(0, (num.indexOf(".")) + fixed + 1);
};

export const downloadFile = (base64, filetype, filename) => {
    let bufferArray = dataURItoBlob(base64);

    if (window.navigator.msSaveOrOpenBlob) {
        let fileData = [bufferArray];
        let blobObject = new Blob(fileData, {
            type: 'data:application/stream;base64'
        });
        return window.navigator.msSaveOrOpenBlob(blobObject, filename);
    } else {
        let blob = new Blob([bufferArray], {
            type: filetype
        });
        let objectUrl = URL.createObjectURL(blob);

        let a = document.createElement("a");
        a.style.cssText = "display: none";
        document.body.appendChild(a);
        a.href = objectUrl;
        a.download = filename;
        a.click();
    }
};

function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    let byteString = atob(dataURI);

    // write the bytes of the string to an ArrayBuffer
    let arrayBuffer = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return arrayBuffer;
}


export const checkCouncilState = (council, company, bHistory, expected) => {
    switch(council.state){
        case 0: 
            if(expected !== 'draft'){
                bHistory.push(`/company/${company.id}/council/${council.id}`);
            }
            break;
        case 5:
            if(expected !== 'convened'){
                bHistory.push(`/company/${company.id}/council/${council.id}/prepare`);
            }
            break;
        case 10:
            if(expected !== 'convened'){
                bHistory.push(`/company/${company.id}/council/${council.id}/prepare`);
            }
            break;
        case 20: 
            if(expected !== 'live'){
                bHistory.push(`/company/${company.id}/council/${council.id}/live`);
            }
            break;
        default:
            return;
    }
};

export const getEmailIconByReqCode = (reqCode) => {
    switch(reqCode){

        case -1: 
            return notSent;
        case 0:
            return notSent;

        case 20:
            return pendingShipping;

        case 22:
            return delivered;

        case 25:
            return opened;

        case 32:
            return 'clicked';

        case 35:
            return spam;

        case 36:
            return invalidEmailAddress;

        case 37:
            return dropped;
        default:
            return dropped;
    }
};

export const getTranslationReqCode = (reqCode) => {
    switch(reqCode){
        case -1: 
            return 'tooltip_failed_shipping';
        case 0:
            return 'tooltip_not_sent';
        case 20:
            return 'tooltip_pending_shipping';
        case 22:
            return 'tooltip_inbox';
        case 25:
            return 'tooltip_opened';
        case 32:
            return 'clicked';
        case 35:
            return 'tooltip_spam';
        case 36:
            return 'tooltip_invalid_email_address';
        case 37:
            return 'tooltip_dropped';
        default: 
            return;
    }
};

export const printSessionExpiredError = () => {
    const messages = {
        'es': 'Su sesión ha caducado',
        'en': 'Session expired',
        'cat': 'La seva sessió ha caducat',
        'gl': 'A súa sesión caducou',
        'pt': 'A sua sessão expirou',
    };
    const selectedLanguage = sessionStorage.getItem('language');
    if(selectedLanguage){
        return messages[selectedLanguage];
    }
    return messages['es'];
};


export const showVideo = (council) => {
    return council.state === 20 && council.councilType === 0;
}

export const canAddPoints = (council) => {
    return council.statute.canAddPoints === 1;
}



export const getParticipantStateString = (participant) => {
    switch(participant.state){
        case 0: 
            return 'REMOTE';

        case 1:
            return 'PRESENT';
            
        case 2:
            return 'REPRESENTATED';

        case 4:
            return 'DELEGATED';

        case 5:
            return 'PHYSICALLY_PRESENT';

        case 6:
            return 'NO_PARTICIPATE';

        case 7:
            return 'PRESENT_WITH_REMOTE_VOTE';

        default:
            return 'INVALID_STATE';
    }
}