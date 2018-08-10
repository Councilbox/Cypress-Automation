export const COMMANDS = [
    {
        section: 'Council',
        command: 'Create',
        link: '/company/{{companyId}}/council/new'
    },

    {
        section: 'Councils',
        command: 'Drafts',
        link: '/company/{{companyId}}/councils/drafts'
    },
    {
        section: 'Councils',
        command: 'Convened',
        link: '/company/{{companyId}}/councils/calendar'
    },
    {
        section: 'Councils',
        command: 'Live',
        link: '/company/{{companyId}}/councils/live'
    },
    {
        section: 'Signatures',
        command: 'New',
        link: '/company/{{companyId}}/signature/new'
    },
    {
        section: 'Company',
        command: 'Settings',
        link: '/company/{{companyId}}/settings'
    },
    {
        section: 'User',
        command: 'Settings',
        link: '/user/{{userId}}'
    }
]