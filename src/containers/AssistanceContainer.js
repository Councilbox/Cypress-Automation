import React from "react";
import { connect } from "react-redux";
import { graphql, withApollo } from "react-apollo";
import gql from "graphql-tag";
import { LoadingMainApp } from "../displayComponents";
import InvalidUrl from "../components/participant/InvalidUrl";
import { bindActionCreators } from 'redux';
import * as mainActions from '../actions/mainActions';
import Assistance from "../components/participant/assistance/Assistance";

class AssistanceContainer extends React.PureComponent {

	componentDidUpdate(){
		if(!this.props.data.loading){
			if(this.props.translate.selectedLanguage !== this.props.data.participant.language){
				this.props.actions.setLanguage(this.props.data.participant.language);
			}
		}
	}

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
			delegateId
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
})(withApollo(connect(mapStateToProps, mapDispatchToProps)(AssistanceContainer)));
