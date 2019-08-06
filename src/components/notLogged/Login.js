import React from "react";
import * as mainActions from "../../actions/mainActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Card } from "material-ui";
import { graphql } from "react-apollo";
import { login } from "../../queries";
import { getPrimary, getSecondary, darkGrey } from "../../styles/colors";
import withWindowSize from "../../HOCs/withWindowSize";
import withTranslations from "../../HOCs/withTranslations";
import { BasicButton, ButtonIcon, Link, TextInput, NotLoggedLayout, Grid, GridItem } from "../../displayComponents";
import { useOldState } from "../../hooks";
import { variant } from "../../config";


const Login = ({ translate, windowSize, ...props }) => {
	const [state, setState] = useOldState({
		user: "",
		password: "",
		loading: false,
		showPassword: false,
		errors: {
			user: "",
			password: ""
		}
	});
	const primary = getPrimary();
	const secondary = getSecondary();

	const login = async () => {
		const { user, password } = state;
		if (!checkRequiredFields()) {
			setState({
				loading: true
			});
			const response = await props.mutate({
				variables: {
					email: user,
					password: password
				}
			});
			if (response.errors) {
				switch (response.errors[0].message) {
					case "Incorrect password":
						setState({
							loading: false,
							errors: {
								password: translate.password_err
							}
						});
						break;

					case 'Not actived':
						setState({
							loading: false,
							errors: {
								user: translate.email_not_found
							}
						})
						break;
					case "Not found":
						setState({
							loading: false,
							errors: {
								user: translate.email_not_found
							}
						});
						break;

					default:
						return;
				}
			}
			if (response.data.login) {
				setState({
					loading: false
				});
				props.actions.loginSuccess(response.data.login.token, response.data.login.refreshToken);
			}
		}
	};

	const handleKeyUp = event => {
		if (event.nativeEvent.keyCode === 13) {
			login();
		}
	};

	function checkRequiredFields() {
		let errors = {
			user: "",
			password: ""
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
			errors: errors
		});

		return hasError;
	}

	return (
		<NotLoggedLayout
			translate={translate}
			helpIcon={true}
			languageSelector={true}
		>
			<Grid style={{width: '100%', overflowX: 'hidden', padding: '0', margin: '0'}}>
				<GridItem xs={12} md={7} lg={7}
					style={{
						color: "white",
						display: "flex",
						paddingLeft: "3%",
						flexDirection: "column",
						alignItems: "center",
						paddingTop: windowSize === "xs" ? "8%" : "12em"
					}}
				>
					{window.location.origin.includes('conpaas')?
						<COELeftSide translate={translate} windowSize={windowSize} />
					:
						<div
							style={{
								width: "70%",
								fontSize: "0.9em",
								textAlign: 'center',
							}}
						>
							<h6
								style={{
									fontWeight: "300",
									marginBottom: "1.2em",
									fontSize: "1.7em",
									color: 'white'
								}}
							>
								{translate.account_question}
							</h6>
							{windowSize !== "xs" && (
								<span
									style={{
										fontSize: "0.76rem",
										marginBottom: "1em",
										marginTop: "0.7em",
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
									display: "flex",
									flexDirection: "row",
									marginTop: windowSize === "xs" ? 0 : "1em"
								}}
							>
								<div
									className="col-lg-6 col-md-6 col-xs-6"
									style={{ padding: "1em" }}
								>
									<Link to="/meeting/new">
										<BasicButton
											text={translate.start_conference_test}
											color={'transparent'}
											fullWidth
											buttonStyle={{backgroundColor: 'transparent', border: '1px solid white', marginRight: '2em'}}
											textStyle={{color: 'white', fontWeight: '700', fontSize: '0.8rem', textTransform: 'none'}}
										/>
									</Link>
								</div>
								<div
									className="col-lg-6 col-md-6 col-xs-6"
									style={{ padding: "1em" }}
								>
									<Link to="/signup">
										<BasicButton
											text={translate.login_check_in}
											color={"white"}
											fullWidth
											textStyle={{
												color: primary,
												fontWeight: "700",
												fontSize: "0.8rem",
												textTransform: "none"
											}}
											textPosition="before"
										/>
									</Link>
								</div>
							</div>
						</div>
					}
				</GridItem>
				<GridItem lg={5} md={5} xs={12}
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						padding: 0,
						margin: '0',
						width: '100%'
					}}
				>
					<Card
						elevation={6}
						style={{
							minHeight: "60%",
							width: windowSize === "xs" ? "100vw" : "70%",
							padding: "8%",
							margin: '0',
							marginBottom: windowSize === "xs" ? 0 : "5em",
							marginRight: windowSize === "xs" ? 0 : "5em"
						}}
					>
						<div
							style={{
								marginBottom: 0,
								paddingBottom: 0,
								fontWeight: "700",
								fontSize: "1.5em",
								color: primary
							}}
						>
							{`${translate.login_signin_header} Councilbox`}
						</div>
						<form>
							<div
								style={{
									marginTop: "2em",
									width: "95%"
								}}
							>
								<TextInput
									onKeyUp={handleKeyUp}
									id={'username'}
									floatingText={translate.login_user}
									errorText={state.errors.user}
									type="text"
									value={state.user}
									onChange={event =>
										setState({
											user: event.nativeEvent.target.value
										})
									}
								/>
							</div>
							<div
								style={{
									marginTop: "1.5em",
									width: "95%"
								}}
							>
								<TextInput
									floatingText={translate.login_password}
									id={'password'}
									type={
										state.showPassword
											? "text"
											: "password"
									}
									passwordToggler={() =>
										setState({
											showPassword: !state.showPassword
										})
									}
									showPassword={state.showPassword}
									onKeyUp={handleKeyUp}
									value={state.password}
									errorText={state.errors.password}
									onChange={event =>
										setState({
											password: event.nativeEvent.target.value
										})
									}
								/>
							</div>
						</form>
						<div style={{ marginTop: "3em" }}>
							<BasicButton
								text={translate.dashboard_enter}
								color={primary}
								loading={state.loading}
								id={'login-button'}
								textStyle={{
									color: "white",
									fontWeight: "700"
								}}
								textPosition="before"
								onClick={login}
								fullWidth={true}
								icon={
									<ButtonIcon
										color="white"
										type="arrow_forward"
									/>
								}
							/>
						</div>
						<div
							style={{
								marginTop: "2em",
								color: secondary
							}}
						>
							<Link to="/forgetPwd">
								{translate.login_forgot}
							</Link>
						</div>
					</Card>
				</GridItem>
			</Grid>
		</NotLoggedLayout>
	);
}


const COELeftSide = ({ translate, windowSize }) => {
	const primary = getPrimary();

	return <span />

	return (
		<Card
			style={{
				width: "70%",
				fontSize: "0.9em",
				textAlign: 'center',
				padding: '2em'
			}}
		>
			<h6
				style={{
					fontWeight: "300",
					marginBottom: "1.2em",
					fontSize: "1.7em"
				}}
			>
				{translate.account_question}
			</h6>
			{windowSize !== "xs" && (
				<span
					style={{
						fontSize: "0.76rem",
						marginBottom: "1em",
						color: darkGrey,
						marginTop: "0.7em",
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
					display: "flex",
					flexDirection: "row",
					marginTop: windowSize === "xs" ? 0 : "1em"
				}}
			>
				<div
					className="col-lg-6 col-md-6 col-xs-6"
					style={{ padding: "1em" }}
				>
					<Link to="/meeting/new">
						<BasicButton
							text={translate.start_conference_test}
							color={'transparent'}
							fullWidth
							buttonStyle={{backgroundColor: 'transparent', border: '1px solid white', marginRight: '2em'}}
							textStyle={{ fontWeight: '700', fontSize: '0.8rem', textTransform: 'none'}}
						/>
					</Link>
				</div>
				<div
					className="col-lg-6 col-md-6 col-xs-6"
					style={{ padding: "1em" }}
				>
					<Link to="/signup">
						<BasicButton
							text={translate.login_check_in}
							color={"white"}
							fullWidth
							textStyle={{
								color: primary,
								fontWeight: "700",
								fontSize: "0.8rem",
								textTransform: "none"
							}}
							textPosition="before"
						/>
					</Link>
				</div>
			</div>
		</Card>
	)
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(mainActions, dispatch)
	};
}

export default connect(
	null,
	mapDispatchToProps
)(graphql(login, { options: { errorPolicy: "all" } })(withWindowSize(withTranslations()(Login))));
