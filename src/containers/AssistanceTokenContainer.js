import React from 'react';
import { Redirect } from 'react-router-dom';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import { LoadingMainApp } from '../displayComponents';
import InvalidUrl from '../components/participant/InvalidUrl';
import SMSAuthForm from '../components/participant/2FA/SMSAuthForm';
import AccessClaveJusticia from '../components/participant/2FA/ClaveJusticia/AccessClaveJusticia';

const getMe = gql`
	query participantMe {
		participantMe {
			id
			councilId
			language
		}
	}
`;

const AssistanceTokenContainer = ({
	participantToken, client, translate, match
}) => {
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState(false);
	const [participant, setParticipant] = React.useState(null);
	const [key, setKey] = React.useState('');

	const handleSuccessfulLogin = async token => {
		sessionStorage.setItem('participantToken', token);
		const responseQueryMe = await client.query({
			query: getMe,
			variables: {},
			fetchPolicy: 'network-only'
		});
		const newParticipant = responseQueryMe.data.participantMe;

		setParticipant(newParticipant);
		setLoading(false);
	};

	const getData = React.useCallback(async accessKey => {
		try {
			const response = await participantToken({
				variables: {
					token: match.params.token,
					accessKey: accessKey || key
				}
			});

			if (response && !response.errors) {
				setError(false);
				await handleSuccessfulLogin(response.data.assistanceToken);
			} else {
				throw response.errors[0];
			}
		} catch (e) {
			setError(e);
			setLoading(false);
		}
	}, [match.params.token, key]);

	React.useEffect(() => {
		getData();
	}, [match.params.token]);

	if (Object.keys(translate).length === 0 || loading) {
		return <LoadingMainApp />;
	}

	if (error) {
		if (error.message === 'Cl@ve pin enabled' || error.message === 'Invalid cl@ve pin') {
			return (
				<AccessClaveJusticia
					translate={translate}
					sendKey={getData}
					// value={key}
					// updateValue={setKey}
					// translate={translate}
					// send={getData}
					error={error}
				/>
			);
		}

		if (error.message === '2FA enabled' || error.message === 'Invalid key') {
			return (
				<SMSAuthForm
					value={key}
					updateValue={setKey}
					translate={translate}
					send={getData}
					error={error}
				/>
			);
		}

		return <InvalidUrl test={match.params.token === 'fake' || match.params.token === 'test'} />;
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
					to={`/attendance/participant/${participant.id}/council/${
						participant.councilId
					}`}
				/>
			) : <div>Not found</div>}
		</React.Fragment>
	);
};


const mapStateToProps = state => ({
	main: state.main,
	translate: state.translate
});

const participantToken = gql`
	mutation participantToken($token: String!, $accessKey: String) {
		assistanceToken(token: $token, accessKey: $accessKey)
	}
`;

export default graphql(participantToken, {
	name: 'participantToken',
	options: props => ({
		variables: {
			token: props.match.params.token
		},
		errorPolicy: 'all'
	})
})(withApollo(connect(mapStateToProps)(AssistanceTokenContainer)));
