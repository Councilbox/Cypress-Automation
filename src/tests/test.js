import assert from 'assert';
import * as CBX from '../utils/CBX';

describe('canReorderPoints', () => {
    const council = {
        statute: {
            canReorderPoints: 1
        }
    }
    it('should return true when the statute have canReorderPoints == 1', () => {
        assert.equal(CBX.canReorderPoints(council), true);
    })
});

describe('showAddCouncilAttachments', () => {
    it('should return true when the num of attachments < max permitted files', () => {
        assert.equal(CBX.showAddCouncilAttachment([
            {filesize: 100},
            {filesize: 100},
            {filesize: 100},
            {filesize: 100},
            {filesize: 100}                
        ]
        ), false);

        assert.equal(CBX.showAddCouncilAttachment({
            attachments: []
        }), true);
    });
});

describe('canAddCouncilAttachments', () => {
    it('should return true when the total size of the attachments < total permitted size', () => {
        assert.equal(CBX.canAddCouncilAttachment({
            attachments: [
                {filesize: 10000},
                {filesize: 10000},
                {filesize: 100}            
            ]
        }, 1000), false);

        assert.equal(CBX.canAddCouncilAttachment({
            attachments: [
                {filesize: 1000}
            ]
        }, 100000), false);

        assert.equal(CBX.canAddCouncilAttachment({
            attachments: []
        }, 1000), true);

        assert.equal(CBX.canAddCouncilAttachment({
            attachments: [
                {filesize: 1000}
            ]
        }, 1000), true);
    });
});

describe('canToggleAgendaVoting', () => {
    it('should return true if the council is started and the agenda is not informative and is already closed', () => {
        assert.equal(CBX.showAgendaVotingsToggle(
            {councilStarted: 1},
            {subjectType: 0, votingState: 0}
        ), false);
        assert.equal(CBX.showAgendaVotingsToggle(
            {councilStarted: 0},
            {subjectType: 1, votingState: 0}
        ), false);
        assert.equal(CBX.showAgendaVotingsToggle(
            {councilStarted: 1},
            {subjectType: 1, votingState: 2}
        ), false);
        assert.equal(CBX.showAgendaVotingsToggle(
            {councilStarted: 1},
            {subjectType: 1, votingState: 0}
        ), true);
    })
})

describe('councilHasVideo', () => {
    it('should return true when the councilType === 0', () => {
        assert.equal(CBX.councilHasVideo({
            councilType: 1
        }), false);
        assert.equal(CBX.councilHasVideo({
            councilType: 'NO'
        }), false);
        assert.equal(CBX.councilHasVideo({
            councilType: 0
        }), true);
    })
})