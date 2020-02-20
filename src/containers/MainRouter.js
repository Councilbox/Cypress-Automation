import React from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { LoadingMainApp } from '../displayComponents';
import Dashboard from "../components/dashboard/Dashboard";
import CouncilEditorContainer from "./CouncilEditorContainer";
import CouncilPreparePage from "../components/council/prepare/CouncilPreparePage";
import MeetingEditorContainer from "./MeetingEditorContainer";
import CompanySettingsPage from "../components/company/settings/CompanySettingsPage";
import CompanyCensusPage from "../components/company/census/CompanyCensusPage";
import SignatureRootPage from '../components/company/signatures/SignatureRootPage';
import CreateSignature from '../components/company/signatures/CreateSignature';
import UserSettingsPage from "../components/userSettings/UserSettingsPage";
import CreateCouncil from "../components/create/CreateCouncil";
import MeetingCreateContainer from "../components/meeting/MeetingCreateContainer";
import NewCompanyPage from "../components/company/new/NewCompanyPage";
import LinkCompanyPage from "../components/company/link/LinkCompanyPage";
import PlatformDrafts from "../components/corporation/drafts/PlatformDrafts";
import CompanyEditPage from "../components/corporation/companies/CompanyEditPage";
import CensusEditorPage from "../components/company/census/censusEditor/CensusEditorPage";
import CompanyDraftEditor from "../components/company/drafts/CompanyDraftEditor";
import CouncilFinishedPage from "../components/council/writing/CouncilFinishedPage";
import StatutesPage from "../components/company/statutes/StatutesPage";
import CouncilCertificatesPage from "../components/council/certificates/CouncilCertificatesPage";
import CompanyDraftsPage from "../components/company/drafts/CompanyDraftsPage";
import CouncilContainer from "./CouncilContainer";
import SignatureContainer from "./SignatureContainer";
import MeetingsContainer from "./MeetingsContainer";
import PartnersBookPage from '../components/partners/PartnersBookPage';
import PartnerEditorPage from '../components/partners/PartnerEditorPage';
import NewPartnerPage from '../components/partners/NewPartnerPage';
import Loadable from 'react-loadable';
import { bHistory, store } from './App';
import { addSpecificTranslations } from '../actions/companyActions';
import TablaCompanies from '../components/corporation/companies/TablaCompanies';
import UserEdit from '../components/corporation/users/UserEdit';
import UsersDashboard from '../components/corporation/users/UsersDashboard';
import OrganizationUsers from '../components/corporation/users/OrganizationUsers';
import FileCompany from '../components/company/compayFile/FileCompany';

const DevAdminPanel = Loadable({
	loader: () => import('../components/admin/DevAdminPanel'),
	loading: LoadingMainApp
});

const redirect = company => () => {
    return <Redirect to={`/company/${company.id}`} />
}

const MainRouter = ({ company, user, location, disabled }) => {
    React.useEffect(() => {
		store.dispatch(addSpecificTranslations(company.type === 10? 'realEstate' : 'society'));
	}, [store, company.type]);

    if(!location.pathname.includes(`/company/${company.id}`) && !location.pathname.includes(`/user/${user.id}`) && !location.pathname.includes('/admin')){
        bHistory.push(`/company/${company.id}`);
        //return <Redirect to={`/company/${company.id}`} />
    }

    const companySettings = () => {
        return <CompanySettingsPage linkButton={true} />
    }

    return(
        <Switch>
            <Route
                exact
                path="/"
                component={redirect(company)}
            />
            {user.roles === 'devAdmin' &&
                <Route
                    exact
                    path="/admin"
                    component={DevAdminPanel}
                />
            }
            <Route
                exact
                path="/company/:company"
                component={Dashboard}
            />
            <Route
                exact
                path="/company/:company/companies"
                component={TablaCompanies}
            />
            <Route
                exact
                path="/company/:company/edit/:id"
                component={CompanyEditPage}
            />
            <Route
                exact
                path="/company/:company/users"
                component={OrganizationUsers}
            />
            <Route exact path="/company/:company/users/:id" component={UserEdit} />

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
                exact
                path="/company/:company/signature/new"
                component={CreateSignature}
            />
            <Route
                path="/company/:company/signatures/:section"
                component={SignatureContainer}
            />
            <Route
                path="/company/:company/signature/:id"
                component={SignatureRootPage}
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
                component={CompanyDraftsPage}
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
             <Route exact path="/company/:company/users/:id/edit" component={UserSettingsPage} />
             <Route exact path="/company/:company/file" component={FileCompany} />
            <Route
                path="*"
                component={redirect(company)}
            />
        </Switch>
    )
}

export default withRouter(MainRouter);