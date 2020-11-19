import React from "react";
import CouncilLivePage from "../components/council/live/CouncilLivePage";
import { connect } from "react-redux";
import { LoadingMainApp } from "../displayComponents";
import { Redirect, withRouter } from "react-router-dom";
import CouncilLiveMobilePage from "../components/council/live/mobile/CouncilLiveMobilePage";
import NoConnectionModal from '../components/NoConnectionModal';
import { isMobile } from "../utils/screen";
import { bHistory, store } from "./App";
import { addSpecificTranslations } from "../actions/companyActions";
import { checkCouncilState } from "../utils/CBX";
import { graphql } from "react-apollo";
import { councilLiveQuery } from "../queries";

const CouncilLiveContainer = ({ main, companies, data, translate }) => {
	React.useEffect(() => {
		const company = companies.list[companies.selected];
		if(company){
			store.dispatch(addSpecificTranslations(company));
		}
	}, [store, companies.selected]);

	React.useEffect(() => {
		if (!data.loading) {
			const company = companies.list[companies.selected];

			checkCouncilState(
				{
					state: data.council.state,
					id: data.council.id
				},
				company,
				bHistory,
				"live"
			);
		}

	}, [data.loading, data.council]);

	const checkLoadingComplete = () => {
		return data.council && companies.list;
	};

	if (!main.isLogged) {
		return <Redirect to="/" />;
	}

	if (!checkLoadingComplete()) {
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
					data={data}
				/>
			:
				<CouncilLiveMobilePage
					companies={companies}
					data={data}
					translate={translate}
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

export default graphql(councilLiveQuery, {
	name: "data",
	options: props => ({
		variables: {
			councilID: +props.match.params.id
		},
		pollInterval: 10000
	})
})(connect(mapStateToProps)(withRouter(CouncilLiveContainer)));
