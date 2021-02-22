import React from 'react';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import { Paper } from 'material-ui';
import gql from 'graphql-tag';
import { bHistory } from '../../containers/App';
import withTranslations from '../../HOCs/withTranslations';
import { getPrimary } from '../../styles/colors';
import {
	LoadingSection, BasicButton, TextInput, NotLoggedLayout
} from '../../displayComponents';
import { useSubdomain } from '../../utils/subdomain';

const SetUserPasswordPage = ({ translate, match, ...props }) => {
	const [state, setState] = React.useState({
		password: '',
		confirmPassword: '',
		showPassword: false,
		showConfirmPassword: false,
		loading: false,
		success: false,
		errors: {
			confirmPassword: '',
			password: ''
		}
	});
	const primary = getPrimary();
	const subdomain = useSubdomain();

	const confirmEmailAndSetPwd = async () => {
		if (!checkRequiredFields()) {
			setState({
				...state,
				loading: true
			});
			const response = await props.confirmEmailAndSetPwd({
				variables: {
					token: match.params.token,
					pwd: state.password
				}
			});

			if (!response.errors) {
				if (response.data.confirmEmailAndSetPwd.success) {
					setState({
						...state,
						loading: false,
						success: true
					});
				}
			} else {
				setState({
					...state,
					loading: false,
					success: false,
					error: response.errors[0].code
				});
			}
		}
	};

	const checkRequiredFields = () => {
		const errors = {
			confirmPassword: '',
			password: ''
		};

		let hasError;

		if (state.password.length === 0) {
			hasError = true;
			errors.password = translate.required_field;
		} else if (state.confirmPassword.length === 0) {
			hasError = true;
			errors.confirmPassword = translate.required_field;
		} else if (state.password !== state.confirmPassword) {
			errors.confirmPassword = translate.register_unmatch_pwds;
			hasError = true;
		}

		setState({
			...state,
			errors
		});

		return hasError;
	};

	const errorWrapper = () => (
		<div
			style={{
				color: primary,
				fontSize: '1.3em',
				fontWeight: '700',
				marginBottom: '1.3em'
			}}
		>
			{state.error === 407 ?
				translate.account_actived_yet
				: translate.error_active_account
			}
		</div>
	);

	const successMessage = () => (
		<div
			style={{
				color: primary,
				fontSize: '1.3em',
				fontWeight: '700',
				marginBottom: '1.3em'
			}}
		>
			{translate.account_actived}
		</div>
	);

	return (
		<NotLoggedLayout
			translate={translate}
			helpIcon={true}
			languageSelector={true}
		>
			<div
				className="row"
				style={{
					width: '100%',
					margin: 0,
					fontSize: '0.85em',
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				<Paper
					style={{
						width: '600px',
						height: '65vh',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						flexDirection: 'column'
					}}
				>
					{state.loading ?
						<LoadingSection />
						: <React.Fragment>
							{state.error
&& errorWrapper()}
							{state.success
&& successMessage()}
							{(!state.success && !state.error) ?
								<React.Fragment>
									<p
										style={{
											fontSize: '1.6em',
											color: primary,
											fontWeight: '700',
											width: '80%',
											textAlign: 'center',
											marginBottom: '1.2em'
										}}
									>
										{(subdomain && subdomain.title) ?
											translate.welcome_set_your_pwd.replace('Councilbox', subdomain?.title)
											: translate.welcome_set_your_pwd
										}
									</p>
									<div
										style={{
											width: '80%',
											marginBottom: '15%',
											display: 'flex',
											alignItems: 'center',
											flexDirection: 'column'
										}}
									>
										<TextInput
											floatingText={translate.login_password}
											type={
												state.showPassword ?
													'text'
													: 'password'
											}
											passwordToggler={() => setState({
												...state,
												showPassword: !state.showPassword
											})
											}
											showPassword={state.showPassword}
											required
											value={state.password}
											errorText={state.errors.password}
											onChange={event => setState({
												...state,
												password: event.target.value
											})}
										/>
										<TextInput
											floatingText={translate.login_confirm_password}
											type={
												state.showConfirmPassword ?
													'text'
													: 'password'
											}
											passwordToggler={() => setState({
												...state,
												showConfirmPassword: !state.showConfirmPassword
											})
											}
											showPassword={state.showConfirmPassword}
											value={state.confirmPassword}
											errorText={state.errors.confirmPassword}
											onChange={event => setState({
												...state,
												confirmPassword: event.target.value
											})}
										/>
										<div
											style={{ marginTop: '1.2em' }}
										>
											<BasicButton
												text={translate.set_pwd}
												color={primary}
												textStyle={{ color: 'white', textTransform: 'none', fontWeight: '700' }}
												onClick={confirmEmailAndSetPwd}
											/>
										</div>
									</div>
								</React.Fragment>
								: <BasicButton
									text={translate.go_login}
									textStyle={{ color: 'white', textTransform: 'none', fontWeight: '700' }}
									color={primary}
									onClick={() => bHistory.push('/')}
								/>
							}
						</React.Fragment>
					}
				</Paper>
			</div>
		</NotLoggedLayout>
	);
};


const confirmEmailAndSetPwd = gql`
	mutation confirmEmailAndSetPwd($token: String!, $pwd: String!){
		confirmEmailAndSetPwd(token: $token, pwd: $pwd){
			success
			message
		}
	}
`;


export default graphql(confirmEmailAndSetPwd, {
	name: 'confirmEmailAndSetPwd'
})(withTranslations()(withRouter(SetUserPasswordPage)));
