import React from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import Dashboard from "../components/dashboard/Dashboard";
import CouncilEditorContainer from "./CouncilEditorContainer";
import CouncilPreparePage from "../components/council/prepare/CouncilPreparePage";
import MeetingEditorContainer from "./MeetingEditorContainer";
import CompanySettingsPage from "../components/company/settings/CompanySettingsPage";
import CompanyCensusPage from "../components/company/census/CompanyCensusPage";
import UserSettingsPage from "../components/userSettings/UserSettingsPage";
import CreateCouncil from "../components/CreateCouncil";
import MeetingCreateContainer from "../components/meeting/MeetingCreateContainer";
import NewCompanyPage from "../components/company/new/NewCompanyPage";
import LinkCompanyPage from "../components/company/link/LinkCompanyPage";
import PlatformDrafts from "../components/corporation/drafts/PlatformDrafts";
import CensusEditorPage from "../components/company/census/censusEditor/CensusEditorPage";
import CompanyDraftEditor from "../components/company/drafts/CompanyDraftEditor";
import CouncilFinishedPage from "../components/council/writing/CouncilFinishedPage";
import StatutesPage from "../components/company/statutes/StatutesPage";
import CouncilCertificatesPage from "../components/council/certificates/CouncilCertificatesPage";
import CompanyDraftList from "../components/company/drafts/CompanyDraftList";
import CouncilContainer from "./CouncilContainer";
import SignatureContainer from "./SignatureContainer";
import MeetingsContainer from "./MeetingsContainer";
import PartnersBookPage from '../components/partners/PartnersBookPage';
import PartnerEditorPage from '../components/partners/PartnerEditorPage';
import NewPartnerPage from '../components/partners/NewPartnerPage';


const MainRouter = ({ company, location }) => {

    if(!location.pathname.includes(`/company/${company.id}`)){
        return <Redirect to={`/company/${company.id}`} />
    }

    const companySettings = () => {
        return <CompanySettingsPage linkButton={true} />
    }

    return(
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
                component={Dashboard}
            />
            <Route
                exact
                path="/company/:company/settings"
                component={companySettings}
            />
            <Route
                exact
                path="/company/:company/book"
                component={PartnersBookPage}
            />
            <Route
                exact
                path="/company/:company/book/new"
                component={NewPartnerPage}
            />
            <Route
                exact
                path="/company/:company/book/:id"
                component={PartnerEditorPage}
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
                component={CouncilPreparePage}
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
                component={CouncilFinishedPage}
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
                component={MeetingCreateContainer}
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
                component={CompanyCensusPage}
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
                component={UserSettingsPage}
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
}

export default withRouter(MainRouter);