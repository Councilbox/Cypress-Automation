import React from "react";
import CouncilLivePage from "../components/council/live/CouncilLivePage";
import { connect } from "react-redux";
import { LoadingMainApp } from "../displayComponents";
import { Redirect, withRouter } from "react-router-dom";
import CouncilLiveMobilePage from "../components/council/live/mobile/CouncilLiveMobilePage";
import NoConnectionModal from '../components/NoConnectionModal';
import { isMobile } from "../utils/screen";
import { store } from "./App";
import { addSpecificTranslations } from "../actions/companyActions";

const CouncilLiveContainer = ({ main, companies, match, translate }) => {
	React.useEffect(() => {
		const company = companies.list[companies.selected];
		if(company){
			store.dispatch(addSpecificTranslations(company.type));
		}
	}, [store, companies.selected]);

	if (!main.isLogged) {
		return <Redirect to="/" />;
	}

	if (!(companies.list.length > 0)) {
		return <LoadingMainApp />;
	}

	return (
		<div
			id="mainContainer"
			style={{
				width: '100%',
				height: '100%',
				overflow: 'hidden',
				position:"fixed"
			}}
		>
			{!main.serverStatus &&
				<NoConnectionModal open={!main.serverStatus} />
			}
			{!isMobile?
				<CouncilLivePage
					companies={companies}
					translate={translate}
					councilID={match.params.id}
				/>
			:
				<CouncilLiveMobilePage
					companies={companies}
					translate={translate}
					councilID={match.params.id}
				/>
			}
		</div>
	);
};

const mapStateToProps = state => ({
	translate: state.translate,
	companies: state.companies,
	main: state.main
});

export default connect(mapStateToProps)(withRouter(CouncilLiveContainer));
