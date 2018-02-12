import React from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import TabsScreen from '../components/TabsScreen';
import CouncilDrafts from '../components/councilSections/CouncilDrafts';
import CouncilsLive from '../components/councilSections/CouncilsLive';
import CouncilsWriting from '../components/councilSections/CouncilsWriting';
import CouncilsTrash from '../components/councilSections/CouncilsTrash';

const CouncilContainer = ({main, company, user, match, translate}) => {

    const tabsIndex = {
        drafts: 0,
        live: 1,
        writing: 2,
        trash: 3
    }

    const tabsInfo = [
        {
            text: translate.companies_draft,
            link: `/company/${company.id}/councils/drafts`,
            component: () => {return(<CouncilDrafts company={company} translate={translate} />)}
        }, {
            text: translate.companies_live,
            link: `/company/${company.id}/councils/live`,
            component: () => {return(<CouncilsLive  company={company} translate={translate} />)}
        }, {
            text: translate.companies_writing,
            link: `/company/${company.id}/councils/writing`,
            component: () => {return(<CouncilsWriting  company={company} translate={translate} />)}
        }, {
            text: translate.signature_trash,
            link: `/company/${company.id}/councils/trash`,
            component: () => {return(<CouncilsTrash  company={company} translate={translate} />)}
        }
    ]


    return (
        <div style={{ height: '100vh', width: '100%', display: 'flex'}}>
            <TabsScreen tabsIndex={tabsIndex} tabsInfo={tabsInfo} selected={match.params.section} />
        </div>
    );
}

const mapStateToProps = (state) => ({
    main: state.main,
    company: state.company,
    user: state.user,
    translate: state.translate
});

export default connect(mapStateToProps)(withRouter(CouncilContainer));