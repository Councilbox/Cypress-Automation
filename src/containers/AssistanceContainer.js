import React from "react";
import { connect } from "react-redux";
import { graphql, withApollo } from "react-apollo";
import gql from "graphql-tag";
import { LoadingMainApp } from "../displayComponents";
import { PARTICIPANT_ERRORS } from "../constants";
import InvalidUrl from "../components/participant/InvalidUrl";
import ErrorState from "../components/participant/login/ErrorState";
import { Divider } from "material-ui";
import Assistance from "../components/participant/assistance/Assistance";

class AssistanceContainer extends React.PureComponent {
	render() {
		const { data } = this.props;

		if (data.error && data.error.graphQLErrors["0"]) {
			return <InvalidUrl />;
		}

		if (!this.props.translate || data.loading) {
			return <LoadingMainApp />;
		}

		return (
			<Assistance
				participant={data.participant}
				council={data.councilVideo}
				company={data.councilVideo.company}
				refetch = {data.refetch}
			/>
		);
	}
}

const mapStateToProps = state => ({
	main: state.main,
	translate: state.translate
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
			language
			assistanceIntention
			assistanceComment
			state
			type
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
			limitDateResponse
			name
			prototype
			sendDate
			state
			statute {
				id
				councilId
				existsDelegatedVote
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
})(withApollo(connect(mapStateToProps)(AssistanceContainer)));
