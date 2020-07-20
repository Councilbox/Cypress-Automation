import React from 'react';
import CouncilLiveTest from "../components/CouncilLiveTest";
import { connect } from "react-redux";
import { LoadingMainApp } from "../displayComponents";
import { withRouter } from "react-router-dom";

const CouncilLiveContainer = ({ main, companies, user, match, translate }) => {
/* 	if (!main.isLogged) {
		return <Redirect to="/" />;
	}

	if (!companies.list) {
		return <LoadingMainApp />;
	} */

/* 	if (typeof window.orientation !== 'undefined')){
		return <div>LO SENTIMOS, NO SE PUEDE CELEBRAR UNA REUNIÓN DESDE UN DISPOSITIVO MOVIL</div>
    } */

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
