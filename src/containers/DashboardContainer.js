import React from 'react';
import Dashboard from "../components/Dashboard";
import {connect} from 'react-redux';

const DashboardContainer = ({main, company, user}) => {
    return (
        <Dashboard main={main} company={company} user={user}/>
    );
}

const mapStateToProps = (state) => ({
    main: state.main,
    company: state.company,
    user: state.user
});

export default connect(mapStateToProps)(DashboardContainer);