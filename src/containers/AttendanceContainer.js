import React from "react";
import { connect } from "react-redux";
import { graphql, withApollo } from "react-apollo";
import gql from "graphql-tag";
import { LoadingMainApp } from "../displayComponents";
import InvalidUrl from "../components/participant/InvalidUrl";
import { bindActionCreators } from 'redux';
import * as mainActions from '../actions/mainActions';
import Assistance from "../components/participant/assistance/Assistance";

const AttendanceContainer = ({ data, translate, actions }) => {
	React.useEffect(() => {
		if(!data.loading && translate.selectedLanguage !== data.participant.language){
			actions.setLanguage(data.participant.language);
		}
	}, [data.loading, data.participant]);

	if (data.error && data.error.graphQLErrors["0"]) {
		return <InvalidUrl />;
	}

	if (!translate || data.loading) {
		return <LoadingMainApp />;
	}

	if(translate.selectedLanguage !== data.participant.language){
		return <LoadingMainApp />;
	}

	return (
		<Assistance
			participant={data.participant}
			council={data.councilVideo}
			company={data.councilVideo.company}
			refetch={data.refetch}
		/>
	);

}

const mapStateToProps = state => ({
	main: state.main,
	translate: state.translate
});

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(mainActions, dispatch)
    };
}

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
			councilId: props.match.params.councilId
		},
		fetchPolicy: "network-only"
	})
})(withApollo(connect(mapStateToProps, mapDispatchToProps)(AttendanceContainer)));
