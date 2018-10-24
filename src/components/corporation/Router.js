import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import CouncilsDashboard from './councils/CouncilsDashboard';
import CompaniesDashboard from './companies/CompaniesDashboard';
import DraftsDashboard from './drafts/DraftsDashboard';
import DraftEditPage from './drafts/DraftEditPage';
import UsersDashboard from './users/UsersDashboard';
import TranslationsPage from './translations/TranslationsPage';
import UserEdit from './users/UserEdit';
import CompanyEditPage from './companies/CompanyEditPage';
import { LoadingMainApp } from '../../displayComponents';
import Header from '../Header';
import { graphql } from 'react-apollo';
import { getCorporation } from '../../queries/corporation';
import Sidebar from "./menus/Sidebar";
import appStyle from "../../styles/appStyle.jsx";
import { withStyles } from 'material-ui';
import { lightGrey } from '../../styles/colors';
import CouncilDetails from './councils/council/CouncilDetails';
let image;
import("../../assets/img/sidebar-2.jpg").then(data => image = data);


const Router = ({ user, translate, location, data, classes }) => {
    if(data.loading){
        return <LoadingMainApp />;
    }

    return(
        <div>
            <Sidebar
                company={data.corporation}
                image={image}
                translate={translate}
                color="blue"
            />
            <div className={classes.mainPanel} style={{backgroundColor: lightGrey}}>
                <Header
                    user={user}
                    translate={translate}
                    backButton={location.pathname !== `/`}
                />
                <Switch>
                    <Route exact path="/" component={() => <Redirect to="/councils" />} />
                    <Route path="/councils" component={() => <CouncilsDashboard corporation={data.corporation} />} />
                    <Route path="/council/:id" component={CouncilDetails} />
                    <Route exact path="/companies" component={CompaniesDashboard} />
                    <Route exact path="/translations" component={TranslationsPage} />
                    <Route path="/companies/edit/:id" component={CompanyEditPage} />
                    <Route exact path="/users" component={UsersDashboard} />
                    <Route path="/users/edit/:id" component={UserEdit} />
                    <Route exact path="/drafts" component={DraftsDashboard} />
                    <Route path="/drafts/edit/:id" component={DraftEditPage} />
                    <Route path="*" component={() => <Redirect to="/" />} />
                </Switch>
            </div>
        </div>
	)
};

export default graphql(getCorporation)(withStyles(appStyle)(Router));
