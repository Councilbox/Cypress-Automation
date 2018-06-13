import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import DashboardContainer from "./DashboardContainer";
import CouncilEditorContainer from "./CouncilEditorContainer";
import CouncilPrepareContainer from "./CouncilPrepareContainer";
import MeetingEditorContainer from "./MeetingEditorContainer";
import CompanySettingsContainer from "./CompanySettingsContainer";
import CompanyCensusContainer from "./CompanyCensusContainer";
import UserSettingsContainer from "./UserSettingsContainer";
import CreateCouncil from "../components/CreateCouncil";
import CreateMeeting from "../components/CreateMeeting";
import NewCompanyPage from "../components/company/new/NewCompanyPage";
import LinkCompanyPage from "../components/company/link/LinkCompanyPage";
import PlatformDrafts from "../components/corporation/drafts/PlatformDrafts";
import CensusEditorPage from "../components/company/census/censusEditor/CensusEditorPage";
import CompanyDraftEditor from "../components/company/drafts/CompanyDraftEditor";
import CouncilFinishedContainer from "./CouncilFinishedContainer";
import StatutesPage from "../components/company/statutes/StatutesPage";
import CouncilCertificatesPage from "../components/council/certificates/CouncilCertificatesPage";
import CompanyDraftList from "../components/company/drafts/CompanyDraftList";
import CouncilContainer from "./CouncilContainer";
import SignatureContainer from "./SignatureContainer";
import MeetingsContainer from "./MeetingsContainer";



const MainRouter = ({ company }) => (
    <Switch>
        <Route
            exact
            path="/"
            component={() => {
                return (
                    <Redirect
                        to={`/company/${company.id}`}
                    />
                );
            }}
        />
        <Route
            exact
            path="/company/:company"
            component={DashboardContainer}
        />
        <Route
            exact
            path="/company/:company/settings"
            component={CompanySettingsContainer}
        />
        <Route
            exact
            path="/company/:company/create"
            component={NewCompanyPage}
        />
        <Route
            exact
            path="/company/:company/link"
            component={LinkCompanyPage}
        />
        <Route
            exact
            path="/company/:company/council/new"
            component={CreateCouncil}
        />
        <Route
            exact
            path="/company/:company/council/:id/prepare"
            component={CouncilPrepareContainer}
        />
        <Route
            exact
            path="/company/:company/council/:id"
            component={CouncilEditorContainer}
        />
        <Route
            path="/company/:company/councils/:section"
            component={CouncilContainer}
        />
        <Route
            exact
            path="/company/:company/council/:council/finished"
            component={CouncilFinishedContainer}
        />
        <Route
            exact
            path="/company/:company/council/:council/certificates"
            component={CouncilCertificatesPage}
        />
        <Route
            path="/company/:company/signatures/:section"
            component={SignatureContainer}
        />
        <Route
            exact
            path="/company/:company/meeting/new"
            component={CreateMeeting}
        />
        <Route
            exact
            path="/company/:company/meeting/:id/"
            component={MeetingEditorContainer}
        />
        <Route
            path="/company/:company/meetings/:section"
            component={MeetingsContainer}
        />
        <Route
            exact
            path="/company/:company/drafts/:id?"
            component={CompanyDraftList}
        />
        <Route
            exact
            path="/company/:company/draft/:id?"
            component={CompanyDraftEditor}
        />
        <Route
            exact
            path="/company/:company/platform/drafts"
            component={PlatformDrafts}
        />
        <Route
            exact
            path="/company/:company/censuses"
            component={CompanyCensusContainer}
        />
        <Route
            exact
            path="/company/:company/census/:id"
            component={CensusEditorPage}
        />
        <Route
            exact
            path="/company/:company/statutes"
            component={StatutesPage}
        />
        <Route
            exact
            path="/user/:id"
            component={UserSettingsContainer}
        />
        <Route 
            path="*"
            component={() => {
                    return (
                        <Redirect
                            to={`/company/${company.id}`}
                        />
                    );
            }}
        />
    </Switch>
)

export default MainRouter;