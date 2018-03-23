import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import { TabsScreen } from '../components/displayComponents';
import MeetingDrafts from '../components/meetingSections/MeetingDrafts';
import MeetingsLive from '../components/meetingSections/MeetingsLive';

const MeetingsContainer = ({main, company, user, match, translate}) => {

    const tabsIndex = {
        drafts: 0,
        live: 1,
        trash: 2
    }

    const tabsInfo = [
        {
            text: translate.companies_draft,
            link: `/company/${company.id}/meetings/drafts`,
            component: () => {return(<MeetingDrafts company={company} translate={translate} />)}
        }, {
            text: translate.companies_live,
            link: `/company/${company.id}/meetings/live`,
            component: () => {return(<MeetingsLive company={company} translate={translate} />)}
        },
        {
            text: `${translate.dashboard_new_meeting}`,
            link: `/company/${company.id}/meeting/new`,
            add: true
        }
    ]

    return (
        <div
            style={{
            height: '100vh',
            width: '100%',
            display: 'flex'
        }}>
            <TabsScreen
                tabsIndex={tabsIndex}
                tabsInfo={tabsInfo}
                selected={match.params.section}/>
        </div>
    );
}

const mapStateToProps = (state) => ({
    main: state.main,
    company: state.companies.list[state.companies.selected],
    user: state.user,
    translate: state.translate
});

export default connect(mapStateToProps)(withRouter(MeetingsContainer));