import React from 'react';
import MeetingLivePage from "../components/meeting/live/MeetingLivePage";
import { connect } from 'react-redux';
import { LoadingMainApp } from '../displayComponents';
import { withRouter, Redirect } from 'react-router-dom';

const MeetingLiveContainer = ({ main, companies, match, translate }) => {
    if(!main.isLogged){
        return(
            <Redirect to="/" />
        );
    }

    if(!companies.list){
        return <LoadingMainApp />
    }
    
    return (
        <MeetingLivePage
            companies={companies}
            translate={translate}
            companyID={match.params.company}
            councilID={match.params.id}
        />
    );
};

const mapStateToProps = (state) => ({
    translate: state.translate,
    companies: state.companies,
    main: state.main
});

export default connect(mapStateToProps)(withRouter(MeetingLiveContainer));