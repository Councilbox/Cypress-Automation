import React from "react";
import { connect } from "react-redux";
import { graphql, withApollo } from "react-apollo";
import gql from "graphql-tag";
import { LoadingMainApp } from "../displayComponents";
import { PARTICIPANT_ERRORS } from "../constants";
import InvalidUrl from "../components/participant/InvalidUrl";
import ErrorState from "../components/participant/login/ErrorState";
import { Divider } from "material-ui";

class AssistanceContainer extends React.PureComponent {
	render() {
		const { data } = this.props;

		if (data.error && data.error.graphQLErrors["0"]) {
			return <InvalidUrl />;
		}

		if (data.loading) {
			return <LoadingMainApp />;
		}

		return (
			<div> Meus juevos</div>
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
			phone
			email
			language
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
			}
			street
			tin
			zipcode
		}
	}
`;

const companyQuery = gql`
	query info($companyId: Int!) {
		company(id: $companyId) {
			logo
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
