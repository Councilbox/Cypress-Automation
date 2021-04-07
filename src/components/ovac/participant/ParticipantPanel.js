import React from 'react';
import { connect } from 'react-redux';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { bindActionCreators } from 'redux';
import { LoadingMainApp } from '../../../displayComponents';
import InvalidUrl from '../../participant/InvalidUrl';
import * as mainActions from '../../../actions/mainActions';
import { ConfigContext } from '../../../containers/AppControl';
import MainMenu from './MainMenu';


const ParticipantPanel = ({ data, translate, actions, match }) => {
	const [companyId, setCompanyId] = React.useState(null);
	const config = React.useContext(ConfigContext);
	const [loadingConfig, setLoadingConfig] = React.useState(true);

	React.useEffect(() => {
		if (!data.error && !data.loading && translate.selectedLanguage !== data.participant.language) {
			actions.setLanguage(data.participant.language);
		}
	}, [data.loading, data.participant]);

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

	if (translate.selectedLanguage !== data.participant.language) {
		return <LoadingMainApp />;
	}

	if (data.councilVideo.state === -1) {
		return 'CITA CANCELADA';
	}

	return (
		<MainMenu
			participant={data.participant}
			appointment={data.councilVideo}
			translate={translate}
			match={match}
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
})(withApollo(connect(mapStateToProps, mapDispatchToProps)(ParticipantPanel)));
