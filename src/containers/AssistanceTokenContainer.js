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

	async componentDidMount(prevProps) {
		this.setState({ loading: true });
		try {
			const response = await this.props.participantToken();
			if (response && !response.errors) {
				const token = response.data.assistanceToken;
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
		const { translate, match } = this.props;
		if (Object.keys(translate).length === 0 && loading) {
			return <LoadingMainApp />;
		}

		if (error) {
			return <InvalidUrl />;
		}
		if (match.params.token === 'fake') {
			return <div style={{ textAlign: 'center', padding: '20vh' }}>
				<h2>{translate.corfirm_assistance_test}</h2>
			</div>;
		}

		return (
			<React.Fragment>
				{participant ? (
					<Redirect
						to={`/assistance/participant/${participant.id}/council/${
							participant.councilId
							}`}
					/>
				) : <div>No participant</div>}
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
		assistanceToken(token: $token)
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
