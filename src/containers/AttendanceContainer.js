import React from 'react';
import { connect } from 'react-redux';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { bindActionCreators } from 'redux';
import { LoadingMainApp } from '../displayComponents';
import InvalidUrl from '../components/participant/InvalidUrl';
import * as mainActions from '../actions/mainActions';
import Assistance from '../components/participant/assistance/Assistance';
import { ConfigContext } from './AppControl';
import { COUNCIL_TYPES } from '../constants';
import OneOnOneDocumentation from '../components/participant/assistance/OneOnOneDocumentation';
import CanceledCouncil from '../components/CanceledCouncil';


const AttendanceContainer = ({ data, translate, actions }) => {
	const [companyId, setCompanyId] = React.useState(null);
	const config = React.useContext(ConfigContext);
	const [loadingConfig, setLoadingConfig] = React.useState(true);

	React.useEffect(() => {
		if (!data.error && !data.loading && translate.selectedLanguage !== data.participant.language) {
			actions.setLanguage(data.participant.language);
		}
	}, [data.loading, data.participant?.language]);


	React.useEffect(() => {
		if (data.councilVideo) {
			setCompanyId(data.councilVideo.companyId);
		}
	}, [data.councilVideo]);

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

	if (!translate || data.loading || loadingConfig) {
		return <LoadingMainApp />;
	}


	if (data.councilVideo.state === -1) {
		return <CanceledCouncil council={data.councilVideo} translate={translate} />;
	}

	if (data.councilVideo.councilType === COUNCIL_TYPES.ONE_ON_ONE) {
		return (
			<OneOnOneDocumentation
				translate={translate}
				participant={data.participant}
				council={data.councilVideo}
				company={data.councilVideo.company}
				refetch={data.refetch}
			/>
		);
	}

	return (
		<Assistance
			participant={data.participant}
			council={data.councilVideo}
			company={data.councilVideo.company}
			refetch={data.refetch}
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

const participantQuery = gql`
	query info($councilId: Int!) {
		participant {
			name
			surname
			id
			dni
			hasDelegatedVotes
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
		councilVideo(id: $councilId) {
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
			agendas {
				id
				agendaSubject
			}
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

export default graphql(participantQuery, {
	options: props => ({
		variables: {
			councilId: +props.match.params.councilId
		},
		fetchPolicy: 'network-only'
	})
})(withApollo(connect(mapStateToProps, mapDispatchToProps)(AttendanceContainer)));
