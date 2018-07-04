import React from "react";
import CouncilLivePage from "../components/council/live/CouncilLivePage";
import { connect } from "react-redux";
import { LoadingMainApp } from "../displayComponents";
import { Redirect, withRouter } from "react-router-dom";

const CouncilLiveContainer = ({ main, companies, match, translate }) => {
	if (!main.isLogged) {
		return <Redirect to="/" />;
	}

	if (!companies.list) {
		return <LoadingMainApp />;
	}

/* 	if (typeof window.orientation !== 'undefined')){
		return <div>LO SENTIMOS, NO SE PUEDE CELEBRAR UNA REUNIÓN DESDE UN DISPOSITIVO MOVIL</div>
	} */

	return (
		<div
			style={{
				width: '100vw',
				height: '100vh',
				overflow: 'hidden'
			}}
		>
			<CouncilLivePage
				companies={companies}
				translate={translate}
				companyID={match.params.company}
				councilID={match.params.id}
			/>
		</div>
	);
};

const mapStateToProps = state => ({
	translate: state.translate,
	companies: state.companies,
	main: state.main
});

export default connect(mapStateToProps)(withRouter(CouncilLiveContainer));
