import React from 'react';
import CouncilLivePage from "../components/councilLive/CouncilLivePage";
import {connect} from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';

const CouncilLiveContainer = ({ main, company, match, translate }) => {
    if(!main.isLogged){
        return(
            <Redirect to="/" />
        );
    }
    
    return (
        <CouncilLivePage
            company={company}
            translate={translate}
            companyID={match.params.company}
            councilID={match.params.id}
        />
    );
}

const mapStateToProps = (state) => ({
    translate: state.translate,
    company: state.company.list[state.company.selected],
    main: state.main
});

export default connect(mapStateToProps)(withRouter(CouncilLiveContainer));
