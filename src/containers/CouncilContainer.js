import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import TabsScreen from '../displayComponents/TabsScreen';
import CouncilDrafts from '../components/dashboard/councilSections/CouncilDrafts';
import CouncilsConvened from '../components/dashboard/councilSections/CouncilsConvened';
import CouncilsLive from '../components/dashboard/councilSections/CouncilsLive';
import CouncilsWriting from '../components/dashboard/councilSections/CouncilsWriting';
import CouncilsTrash from '../components/dashboard/councilSections/CouncilsTrash';

const CouncilContainer = ({ match, company, translate }) => {
    const tabsIndex = {
        drafts: 0,
        calendar: 1,
        live: 2,
        writing: 3,
        trash: 4
    };

    const tabsInfo = [ {
        text: translate.companies_draft,
        link: `/company/${company.id}/councils/drafts`,
        component: () => {
            return (<CouncilDrafts/>)
        }
    }, {
        text: translate.companies_calendar,
        link: `/company/${company.id}/councils/calendar`,
        component: () => {
            return (<CouncilsConvened company={company} translate={translate}/>)
        }
    }, {
        text: translate.companies_live,
        link: `/company/${company.id}/councils/live`,
        component: () => {
            return (<CouncilsLive company={company} translate={translate}/>)
        }
    }, {
        text: translate.companies_writing,
        link: `/company/${company.id}/councils/writing`,
        component: () => {
            return (<CouncilsWriting company={company} translate={translate}/>)
        }
    }, {
        text: translate.signature_trash,
        link: `/company/${company.id}/councils/trash`,
        component: () => {
            return (<CouncilsTrash company={company} translate={translate}/>)
        }
    }, {
        text: `${translate.dashboard_new}`,
        link: `/company/${company.id}/council/new`,
        add: true
    } ];


    return (<TabsScreen tabsIndex={tabsIndex} tabsInfo={tabsInfo} selected={match.params.section}/>);
};

const mapStateToProps = (state) => ({
    company: state.companies.list[ state.companies.selected ],
    translate: state.translate
});

export default connect(mapStateToProps)(withRouter(CouncilContainer));