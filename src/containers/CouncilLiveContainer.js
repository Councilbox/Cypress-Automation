import React from 'react';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import { withApollo } from 'react-apollo';
import CouncilLivePage from '../components/council/live/CouncilLivePage';
import { LoadingMainApp } from '../displayComponents';
import CouncilLiveMobilePage from '../components/council/live/mobile/CouncilLiveMobilePage';
import NoConnectionModal from '../components/NoConnectionModal';
import { isMobile } from '../utils/screen';
import { bHistory, store } from './App';
import { addSpecificTranslations } from '../actions/companyActions';
import { checkCouncilState } from '../utils/CBX';
import { councilLiveQuery } from '../queries';
import { usePolling } from '../hooks';

export const CouncilLiveContext = React.createContext();

const CouncilLiveContainer = ({
	main, companies, translate, match, client
}) => {
	const [data, setData] = React.useState({});
	const [loading, setLoading] = React.useState(true);
	const [disableCheck, setDisableCheck] = React.useState(false);

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: councilLiveQuery,
			variables: {
				councilID: +match.params.id
			},
		});
		setData({
			...response.data,
			refetch: getData
		});
		if (loading) {
			setLoading(false);
		}
	}, [match.params.id]);

	React.useEffect(() => {
		getData();
	}, [getData]);

	usePolling(getData, 10000);

	React.useEffect(() => {
		const company = companies.list[companies.selected];
		if (company) {
			store.dispatch(addSpecificTranslations(company));
		}
	}, [store, companies.selected]);

	React.useEffect(() => {
		if (!loading) {
			const company = companies.list[companies.selected];

			if (!company) {
				return;
			}

			if (!disableCheck) {
				checkCouncilState(
					{
						state: data.council.state,
						id: data.council.id
					},
					company,
					bHistory,
					'live'
				);
			}
		}
	}, [loading, data.council]);

	const checkLoadingComplete = () => !loading && data.council && companies.list;

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
				position: 'fixed'
			}}
		>
			<CouncilLiveContext.Provider value={{
				disableCouncilStateCheck: flag => setDisableCheck(flag)
			}}>
				{!main.serverStatus
					&& <NoConnectionModal open={!main.serverStatus} />
				}
				{!isMobile ?
					<CouncilLivePage
						company={companies.list[companies.selected]}
						companies={companies}
						translate={translate}
						data={data}
					/>
					: <CouncilLiveMobilePage
						companies={companies}
						data={data}
						translate={translate}
					/>
				}
			</CouncilLiveContext.Provider>
		</div>
	);
};

const mapStateToProps = state => ({
	translate: state.translate,
	companies: state.companies,
	main: state.main
});

export default connect(mapStateToProps)(withRouter(withApollo(CouncilLiveContainer)));
