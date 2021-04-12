import React from 'react';
import { connect } from 'react-redux';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { bindActionCreators } from 'redux';
import { LoadingMainApp } from '../../../displayComponents';
import InvalidUrl from '../../participant/InvalidUrl';
import * as mainActions from '../../../actions/mainActions';
import { ConfigContext } from '../../../containers/AppControl';
import MainMenu from './MainMenu';
import { usePolling } from '../../../hooks';

const participantQuery = gql`
	query info($councilId: Int!) {
		participant {
			name
			surname
			id
			dni
			position
			phone
			email
			personOrEntity
			language
			numParticipations
			socialCapital
			delegateId
			assistanceIntention
			assistanceComment
			state
			type
			represented {
				name
				id
				surname
				numParticipations
				state
				assistanceIntention
				delegateId
				representative {
					id
					name
					surname
				}
			}
			representative {
				id
				name
				surname
				dni
				position
			}
			delegatedVotes {
				id
				name
				numParticipations
				state
				surname
				dni
				position
			}
		}
		council(id: $councilId) {
			active
			city
			companyId
			company {
				logo
				type
				businessName
			}
			conveneText
			councilStarted
			councilType
			country
			countryState
			dateStart
			dateStart2NdCall
			hasLimitDate
			id
			confirmAssistance
			noCelebrateComment
			remoteCelebration
			limitDateResponse
			name
			prototype
			sendDate
			state
			statute {
				id
				councilId
				requireProxy
				existsDelegatedVote
				existMaxNumDelegatedVotes
				attendanceText
				doubleColumnDocs
				canEarlyVote
				canSenseVoteDelegate
				title
				proxy
				proxySecondary
				voteLetter
				voteLetterSecondary
				voteLetterWithSense
				voteLetterWithSenseSecondary
				maxNumDelegatedVotes
			}
			street
			tin
			zipcode
		}
	}
`;

const ParticipantPanel = ({ translate, actions, match, client }) => {
	const [companyId, setCompanyId] = React.useState(null);
	const config = React.useContext(ConfigContext);
	const [data, setData] = React.useState({});
	const [loading, setLoading] = React.useState(true);

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: participantQuery,
			variables: {
				councilId: +match.params.councilId
			}
		});

		setData(response.data);
		setLoading(false);
	}, [match.params.councilId]);

	React.useEffect(() => {
		getData();
	}, [getData]);

	usePolling(getData, 10000);

	const [loadingConfig, setLoadingConfig] = React.useState(true);

	React.useEffect(() => {
		if (!loading && !data.error && translate.selectedLanguage !== data.participant.language) {
			actions.setLanguage(data.participant.language);
		}
	}, [loading, data.participant]);

	React.useEffect(() => {
		if (data.council) {
			setCompanyId(data.council.companyId);
		}
	}, [data.council]);

	const updateConfig = async id => {
		await config.updateConfig(id);
		setLoadingConfig(false);
	};

	React.useEffect(() => {
		if (companyId) {
			updateConfig(companyId);
		}
	}, [companyId]);

	if (data.error && data.error.graphQLErrors['0']) {
		return <InvalidUrl error={data.error.graphQLErrors['0']} />;
	}

	if (!translate || loading || loadingConfig) {
		return <LoadingMainApp />;
	}

	if (translate.selectedLanguage !== data.participant.language) {
		return <LoadingMainApp />;
	}

	return (
		<MainMenu
			participant={data.participant}
			appointment={data.council}
			translate={translate}
			refetch={getData}
		/>
	);
};

const mapStateToProps = state => ({
	main: state.main,
	translate: state.translate
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(mainActions, dispatch)
});

export default withApollo(connect(mapStateToProps, mapDispatchToProps)(ParticipantPanel));
