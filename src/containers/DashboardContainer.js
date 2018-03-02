import React from 'react';
import Dashboard from "../components/dashboard/Dashboard";
import {connect} from 'react-redux';

const DashboardContainer = ({ main, company, user, translate }) => {
    return (
        <Dashboard main={main} company={company} user={user} translate={translate} />
    );
}

const mapStateToProps = (state) => ({
    main: state.main,
    company: state.companies.list[state.companies.selected],
    user: state.user,
    translate: state.translate
});

export default connect(mapStateToProps)(DashboardContainer);