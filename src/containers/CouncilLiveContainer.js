import React from "react";
import CouncilLivePage from "../components/council/live/CouncilLivePage";
import CouncilLiveMobilePage from "../components/council/live/mobile/CouncilLiveMobilePage";
import { connect } from "react-redux";
import { LoadingMainApp } from "../displayComponents";
import { Redirect, withRouter } from "react-router-dom";

const CouncilLiveContainer = ({ main, companies, match, translate }) => {
	if (!main.isLogged) {
		return <Redirect to="/" />;
	}

	if (!companies.list.length > 0) {
		return <LoadingMainApp />;
	}

/* 	if (/Mobi|Android/i.test(navigator.userAgent)){
		return (
			<CouncilLiveMobilePage 
				companies={companies}
				translate={translate}
				councilID={match.params.id}
			/>
		);
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
