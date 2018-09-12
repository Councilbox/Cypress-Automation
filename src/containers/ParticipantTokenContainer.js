import React from "react";
import { Redirect } from "react-router-dom";
import { graphql, withApollo } from "react-apollo";
import gql from "graphql-tag";
import { bindActionCreators } from 'redux';
import * as mainActions from '../actions/mainActions';
import { connect } from "react-redux";
import { LoadingMainApp } from "../displayComponents";
import InvalidUrl from "../components/participant/InvalidUrl.jsx";

class ParticipantTokenContainer extends React.Component {
	state = {
		loading: true,
		error: false,
		participant: null
	};

	async componentDidMount() {
        this.setState({ loading: true });

        try {
            const response = await this.props.participantToken();
            if (response && !response.errors) {
                const token = response.data.participantToken;
                sessionStorage.setItem("participantToken", token);
                const responseQueryMe = await this.props.client.query({
                    query: getMe,
                    variables: {},
                    fetchPolicy: "network-only"
                });
				const participant = responseQueryMe.data.participantMe;			

                this.setState({
                    token: token,
                    loading: false,
                    participant: participant
                });
            } else {
                throw new Error("Error getting participant token");
            }
        } catch (error) {
            console.log(error);
            //TODO ADD TOAST OR LOAD MESSAGE VIEW
            this.setState({
                error: true,
                loading: false
            });
        }
	}

	render() {
		const { loading, error, participant } = this.state;
		const { translate } = this.props;
		if (Object.keys(translate).length === 0 && loading) {
			return <LoadingMainApp />;
		}

		if (error) {
			return <InvalidUrl />;
		}

		return (
			<React.Fragment>
				{participant && (
					<Redirect
						to={`/participant/${participant.id}/council/${participant.councilId}/login`}
					/>
				)}
			</React.Fragment>
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

const participantToken = gql`
	mutation participantToken($token: String!) {
		participantToken(token: $token)
	}
`;

const getMe = gql`
	query participantMe {
		participantMe {
			id
			councilId
		}
	}
`;

export default graphql(participantToken, {
	name: "participantToken",
	options: props => ({
		variables: {
			token: props.match.params.token
		},
		errorPolicy: "all"
	})
})(withApollo(connect(mapStateToProps, mapDispatchToProps)(ParticipantTokenContainer)));
