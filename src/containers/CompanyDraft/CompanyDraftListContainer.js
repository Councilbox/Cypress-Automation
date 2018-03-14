import React from 'react';
import CompanyDraftList from '../../components/companyDraft/companyDraftList';
import {connect} from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';

const CompanyDraftListContainer = ({ main, company, match, translate }) => {
    if(!main.isLogged){
        return(
            <Redirect to="/" />
        );
    }
    
    return (
        <CompanyDraftList
            company={company}
            translate={translate}
            companyID={match.params.company}
            councilID={match.params.id}
        />
    );
}

const mapStateToProps = (state) => ({
    translate: state.translate,
    company: state.companies.list[state.companies.selected],
    main: state.main
});

export default connect(mapStateToProps)(withRouter(CompanyDraftListContainer));
