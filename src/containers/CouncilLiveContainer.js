import React from 'react';
import CouncilLivePage from "../components/council/live/CouncilLivePage";
import { connect } from 'react-redux';
import { LoadingMainApp } from '../displayComponents';
import { Redirect, withRouter } from 'react-router-dom';

const CouncilLiveContainer = ({ main, companies, match, translate }) => {
    if (!main.isLogged) {
        return (<Redirect to="/"/>);
    }

    if (!companies.list) {
        return <LoadingMainApp/>
    }

    return (<CouncilLivePage
        companies={companies}
        translate={translate}
        companyID={match.params.company}
        councilID={match.params.id}
    />);
};

const mapStateToProps = (state) => ({
    translate: state.translate,
    companies: state.companies,
    main: state.main
});

export default connect(mapStateToProps)(withRouter(CouncilLiveContainer));
