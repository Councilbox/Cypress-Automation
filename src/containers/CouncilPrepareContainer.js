import React from 'react';
import CouncilPreparePage from "../components/council/prepare/CouncilPreparePage";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

const CouncilPrepareContainer = ({ main, company, user, council, match, translate }) => {
    return (<CouncilPreparePage
        translate={translate}
        companyID={match.params.company}
        councilID={match.params.id}
    />);
};

const mapStateToProps = (state) => ({
    translate: state.translate
});


export default connect(mapStateToProps)(withRouter(CouncilPrepareContainer));