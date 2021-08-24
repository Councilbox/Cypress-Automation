import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card } from 'material-ui';
import { graphql } from 'react-apollo';
import * as mainActions from '../../actions/mainActions';
import { login as loginMutation } from '../../queries';
import { getPrimary, getSecondary } from '../../styles/colors';
import withWindowSize from '../../HOCs/withWindowSize';
import withTranslations from '../../HOCs/withTranslations';
import {
	BasicButton, ButtonIcon, Link, TextInput, NotLoggedLayout, Grid, GridItem, CBXFooter
} from '../../displayComponents';
import { useOldState } from '../../hooks';
import { useSubdomain, getCustomLogo } from '../../utils/subdomain';
import { isMobile } from '../../utils/screen';
import GenCatLogin from './GenCatLogin';
import { ConfigContext } from '../../containers/AppControl';


const Login = ({ translate, windowSize, ...props }) => {
	const [state, setState] = useOldState({
		user: '',
		password: '',
		loading: false,
		showPassword: false,
		errors: {
			user: '',
			password: ''
		}
	});
	const primary = getPrimary();
	const secondary = getSecondary();
	const subdomain = useSubdomain();
	const config = React.useContext(ConfigContext);

	function checkRequiredFields() {
		const errors = {
			user: '',
			password: ''
		};

		let hasError = false;

		if (!state.user) {
			hasError = true;
			errors.user = translate.field_required;
		}

		if (!state.password) {
			hasError = true;
			errors.password = translate.field_required;
		}

		setState({
			...state,
			errors
		});

		return hasError;
	}

	const login = async () => {
		const { user, password } = state;
		if (!checkRequiredFields()) {
			setState({
				loading: true
			});
			try {
				const response = await props.mutate({
					variables: {
						email: user,
						password
					}
				});
				if (response.errors) {
					const errors = {
						'Incorrect password': () => {
							setState({
								loading: false,
								errors: {
									password: translate.password_err
								}
							});
						},
						'User not registered or incorrect password': () => {
							setState({
								loading: false,
								errors: {
									user: translate.login_err
								}
							});
						},
						'Not actived': () => {
							setState({
								loading: false,
								errors: {
									user: translate.email_not_found
								}
							});
						},
						'Not found': () => {
							setState({
								loading: false,
								errors: {
									user: translate.email_not_found
								}
							});
						},
						'Invalid domain': () => {
							setState({
								loading: false,
								errors: {
									user: translate.domain_invalid_creds
								}
							});
						},
						'Unsubscribed account': () => {
							setState({
								loading: false,
								errors: {
									user: 'Cuenta deshabilitada'
								}
							});
						}
					};

					return errors[response.errors[0].message] ? errors[response.errors[0].message]() : null;
				}
				if (response.data.login) {
					setState({
						loading: false
					});
					props.actions.loginSuccess(response.data.login.token, response.data.login.refreshToken);
				}
			} catch (error) {
				if (error.message === 'Response not successful: Received status code 429') {
					return setState({
						loading: false,
						errors: {
							user: 'Too many requests'
						}
					});
				}
				return setState({
					loading: false,
					errors: {
						user: error.message
					}
				});
			}
		}
	};

	const handleKeyUp = event => {
		if (event.nativeEvent.keyCode === 13) {
			login();
		}
	};

	return (
		<NotLoggedLayout
			translate={translate}
			helpIcon={true}
			languageSelector={true}
		>
			<Grid style={{
				width: '100%',
				overflowX: 'hidden',
				padding: '0',
				margin: '0',
				height: '100%'
			}}>
				<GridItem xs={12} md={isMobile ? 12 : 7} lg={7}
					style={{
						color: 'white',
						display: 'flex',
						paddingLeft: '3%',
						flexDirection: 'column',
						alignItems: 'center',
						...((subdomain.hideSignUp && isMobile) ? { display: 'none' } : {}),
						paddingTop: windowSize === 'xs' ? '8%' : '12em'
					}}
				>
					{!subdomain.hideSignUp
						&& <div
							style={{
								width: '70%',
								fontSize: '0.9em',
								textAlign: 'center',
							}}
						>
							<h6
								style={{
									fontWeight: '300',
									marginBottom: '1.2em',
									fontSize: '1.7em',
									color: 'white'
								}}
							>
								{translate.account_question}
							</h6>
							{windowSize !== 'xs' && (
								<span
									style={{
										fontSize: '0.88rem',
										marginBottom: '1em',
										marginTop: '0.7em',
										textAlign: 'center',
										alignSelf: 'center'
									}}
								>
									{translate.login_desc}
								</span>
							)}
							<br />
							<div
								className="row"
								style={{
									display: 'flex',
									flexDirection: 'row',
									marginTop: windowSize === 'xs' ? 0 : '1em'
								}}
							>
								{config.meeting
									&& <div
										className="col-lg-6 col-md-6 col-xs-6"
										style={{ padding: '1em' }}
									>
										<Link to="/meeting/new">
											<BasicButton
												text={translate.start_conference_test}
												fullWidth
												buttonStyle={{ backgroundColor: 'transparent', border: '1px solid white', marginRight: '2em' }}
												textStyle={{
													color: 'white',
													fontWeight: '700',
													fontSize: window.innerWidth === 1024 && translate.selectedLanguage === 'fr' ? '.7rem' : '.8rem',
													textTransform: 'none',
													whiteSpace: 'nowrap'
												}}
											/>
										</Link>
									</div>
								}

								<div
									className="col-lg-6 col-md-6 col-xs-6"
									style={{ padding: '1em' }}
								>
									<Link to="/signup">
										<BasicButton
											id="sign-up-button"
											text={translate.login_check_in}
											color={'white'}
											fullWidth
											textStyle={{
												color: primary,
												fontWeight: '700',
												fontSize: '0.8rem',
												textTransform: 'none'
											}}
											textPosition="before"
										/>
									</Link>
								</div>
							</div>
						</div>
					}
				</GridItem>
				<GridItem lg={5} md={isMobile ? 12 : 5} xs={12}
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						padding: 0,
						margin: '0',
						height: !isMobile && '100%',
						width: '100%'
					}}
				>
					<Card
						elevation={6}
						style={{
							minHeight: '60%',
							width: windowSize === 'xs' ? '100vw' : '70%',
							padding: '8%',
							paddingBottom: '1em',
							margin: '0',
							position: 'relative',
							marginBottom: windowSize === 'xs' || (windowSize === 'md' && isMobile) ? 0 : '5em',
							marginRight: windowSize === 'xs' || (windowSize === 'md' && isMobile) ? 0 : '5em'
						}}
					>
						<div
							style={{
								marginBottom: 0,
								paddingBottom: 0,
								fontWeight: '700',
								fontSize: '1.5em',
								color: primary,
								...(isMobile ? {
									display: 'flex',
									alignItems: 'center',
									flexDirection: 'column'
								} : {})
							}}
						>
							{(subdomain.logo && isMobile)
								&& <React.Fragment>
									<img
										src={getCustomLogo()}
										className="App-logo"
										style={{
											height: '1.5em',
											marginLeft: '1em',
											// marginLeft: "2em",
											alignSelf: 'center',
											userSelect: 'none'
										}}
										alt="logo"
									/>
									<br />
								</React.Fragment>
							}
							{`${translate.login_signin_header} ${subdomain.title ? subdomain.title : 'Councilbox'}`}
						</div>
						<form>
							<div
								style={{
									marginTop: '2em',
									width: '95%'
								}}
							>
								<TextInput
									onKeyUp={handleKeyUp}
									id={'username'}
									floatingText={translate.login_user}
									errorText={state.errors.user}
									type="text"
									value={state.user}
									onChange={event => setState({
										user: event.nativeEvent.target.value
									})
									}
								/>
							</div>
							<div
								style={{
									marginTop: '1.5em',
									width: '95%'
								}}
							>
								<TextInput
									floatingText={translate.login_password}
									id={'password'}
									type={
										state.showPassword ?
											'text'
											: 'password'
									}
									passwordToggler={() => setState({
										showPassword: !state.showPassword
									})
									}
									showPassword={state.showPassword}
									onKeyUp={handleKeyUp}
									value={state.password}
									errorText={state.errors.password}
									onChange={event => setState({
										password: event.nativeEvent.target.value
									})
									}
								/>
							</div>
						</form>
						<div style={{ marginTop: '3em' }}>
							<BasicButton
								text={translate.dashboard_enter}
								color={primary}
								loading={state.loading}
								id={'login-button'}
								textStyle={{
									color: 'white',
									fontWeight: '700',
									...subdomain?.styles?.loginButton
								}}
								textPosition="before"
								onClick={login}
								fullWidth={true}
								icon={
									<ButtonIcon
										color="white"
										type="arrow_forward"
										style={{
											...subdomain?.styles?.loginButton
										}}
									/>
								}
							/>
						</div>
						{(!!subdomain.name && subdomain.name.includes('gencat'))
							&& <div style={{ marginTop: '1em' }}>
								<GenCatLogin
									loginSuccess={props.actions.loginSuccess}
								/>
							</div>
						}
						<div
							style={{
								marginTop: '2em',
								color: secondary
							}}
						>
							<Link to="/forgetPwd" id="restore-password-link">
								{translate.login_forgot}
							</Link>
						</div>
						{(!!subdomain.name && subdomain.name === 'madrid')
							&& <div style={{ width: '100%', textAlign: 'center' }}>
								<img src="/img/logo-1.png" style={{ marginTop: '2.5em', height: '3.5em', width: 'auto' }} alt="logo-seneca" />
							</div>
						}
						<CBXFooter style={{ marginTop: '5em' }} />
					</Card>
				</GridItem>
			</Grid>
		</NotLoggedLayout>
	);
};


function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(mainActions, dispatch)
	};
}

export default connect(
	null,
	mapDispatchToProps
)(graphql(loginMutation, { options: { errorPolicy: 'all' } })(withWindowSize(withTranslations()(Login))));
