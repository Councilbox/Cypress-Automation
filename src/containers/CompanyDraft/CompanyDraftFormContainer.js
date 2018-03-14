import React from 'react';
import {connect} from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import CompanyDraftForm from '../../components/companyDraft/companyDraftForm'

const CompanyDraftFormContainer = ({ main, company, match, translate }) => {
    if(!main.isLogged){
        return(
            <Redirect to="/" />
        );
    }
    
    return (
        <CompanyDraftForm
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

export default connect(mapStateToProps)(withRouter(CompanyDraftFormContainer));
