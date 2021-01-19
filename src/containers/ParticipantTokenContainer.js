import React from "react";
import { Redirect } from "react-router-dom";
import { graphql, withApollo } from "react-apollo";
import gql from "graphql-tag";
import { bindActionCreators } from 'redux';
import * as mainActions from '../actions/mainActions';
import { connect } from "react-redux";
import { LoadingMainApp } from "../displayComponents";
import InvalidUrl from "../components/participant/InvalidUrl.jsx";
import { refreshWSLink } from "./App";
import { initLogRocket } from "../utils/logRocket";

const initialState = {
	loading: true,
	error: false,
	participant: null,
	token: null
}

const reducer = (state, action) => {
	const actions = {
		'SET_LOADING': () => ({
			...state,
			loading: action.value
		}),
		'SET_DATA': () => ({
			...state,
			...action.value,
			loading: false
		}),
		'SET_ERROR': () => ({
			...state,
			error: action.value,
			loading: false
		})
	}

	return actions[action.type]? actions[action.type]() : state;
}

const ParticipantTokenContainer = ({ participantToken, match, client, translate }) => {
	const [state, dispatch] = React.useReducer(reducer, initialState);

	React.useEffect(() => {
		const getData = async () => {
			dispatch({ type: 'SET_LOADING', value: true });
			try {
				let token;

				if(match.params.creds){
					token = match.params.creds;
				} else {
					const response = await participantToken();
					if(response.errors){
						throw new Error("Error getting participant token");
					}
					token = response.data.participantToken;
				}
				sessionStorage.setItem("participantToken", token);
				const responseQueryMe = await client.query({
					query: getMe,
					variables: {},
					fetchPolicy: "network-only"
				});
				const participant = responseQueryMe.data.participantMe;
				refreshWSLink();

				dispatch({ type: 'SET_DATA', value: {
					token,
					participant
				}});
			} catch (error) {
				dispatch({ type: 'SET_ERROR', value: true });
			}
		}

		if(!state.participant){
			getData();
		}
	}, [participantToken]);

	const { loading, error, participant } = state;

	if (Object.keys(translate).length === 0 && loading) {
		return <LoadingMainApp />;
	}

	if (error) {
		return <InvalidUrl test={match.params.token === 'fake' || match.params.token === 'test'} />;
	}

	return (
		<React.Fragment>
			{participant &&
				<Redirect to={`/participant/${participant.id}/council/${participant.councilId}/login`} />
			}
		</React.Fragment>
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
			language
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
