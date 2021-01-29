import React from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import CouncilLiveTest from "../components/CouncilLiveTest";
import { LoadingMainApp } from "../displayComponents";

const CouncilLiveContainer = ({ user, match }) => {
    if(!user.id){
        return <LoadingMainApp />
    }

	return <CouncilLiveTest councilId={+match.params.id} userId={user.id} />;
};

const mapStateToProps = state => ({
	translate: state.translate,
	companies: state.companies,
    main: state.main,
    user: state.user
});

export default connect(mapStateToProps)(withRouter(CouncilLiveContainer));
