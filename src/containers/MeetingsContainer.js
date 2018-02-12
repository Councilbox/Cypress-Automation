import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import TabsScreen from '../components/TabsScreen';
import MeetingDrafts from '../components/meetingSections/MeetingDrafts';
import MeetingsLive from '../components/meetingSections/MeetingsLive';
import MeetingsTrash from '../components/meetingSections/MeetingsTrash';

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
        }, {
            text: translate.signature_trash,
            link: `/company/${company.id}/meetings/trash`,
            component: () => {return(<MeetingsTrash company={company} translate={translate} />)}
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
    company: state.company,
    user: state.user,
    translate: state.translate
});

export default connect(mapStateToProps)(withRouter(MeetingsContainer));