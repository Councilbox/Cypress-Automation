import React from 'react';
import CouncilLivePage from "../components/councilLive/CouncilLivePage";
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';

const CouncilLiveContainer = ({ main, company, user, council, match, translate }) => {
    return (
        <CouncilLivePage
            translate={translate}
            companyID={match.params.company}
            councilID={match.params.id}
        />
    );
}

const mapStateToProps = (state) => ({
    translate: state.translate
});

export default connect(mapStateToProps)(withRouter(CouncilLiveContainer));
