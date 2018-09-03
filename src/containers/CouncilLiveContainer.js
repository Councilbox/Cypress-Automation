import React from "react";
import CouncilLivePage from "../components/council/live/CouncilLivePage";
import { connect } from "react-redux";
import { LoadingMainApp } from "../displayComponents";
import { Redirect, withRouter } from "react-router-dom";
import {
	BrowserView,
	MobileView,
	isBrowser,
	isMobile
} from "react-device-detect";
import CouncilLiveMobilePage from "../components/council/live/mobile/CouncilLiveMobilePage";
import NoConnectionModal from '../components/NoConnectionModal';

const CouncilLiveContainer = ({ main, companies, match, translate }) => {
	if (!main.isLogged) {
		return <Redirect to="/" />;
	}

	if (!companies.list.length > 0) {
		return <LoadingMainApp />;
	}



	return (
		<div
			style={{
				width: '100vw',
				height: '100vh',
				overflow: 'hidden'
			}}
		>
			{!main.serverStatus &&
				<NoConnectionModal open={!main.serverStatus} />
			}
			<BrowserView>
				<CouncilLivePage
					companies={companies}
					translate={translate}
					councilID={match.params.id}
				/>
			</BrowserView>

			<MobileView>
				<CouncilLiveMobilePage
					companies={companies}
					translate={translate}
					councilID={match.params.id}
				/>
			</MobileView>
		</div>
	);
};

const mapStateToProps = state => ({
	translate: state.translate,
	companies: state.companies,
	main: state.main
});

export default connect(mapStateToProps)(withRouter(CouncilLiveContainer));
