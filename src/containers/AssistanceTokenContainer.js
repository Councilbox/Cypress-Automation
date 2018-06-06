import React from "react";
import { Redirect } from "react-router-dom";
import { graphql, withApollo } from "react-apollo";
import gql from "graphql-tag";
import { connect } from "react-redux";
import { LoadingMainApp } from "../displayComponents";
import InvalidUrl from "../components/participant/InvalidUrl.jsx";

class AssistanceTokenContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			error: false,
			participant: null
		};
	}

	async componentDidUpdate(prevProps) {
		if (!prevProps.translate.send && this.props.translate.send) {
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
						to={`/assistance/participant/${participant.id}/council/${
							participant.councilId
						}`}
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
})(withApollo(connect(mapStateToProps)(AssistanceTokenContainer)));
