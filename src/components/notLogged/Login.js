import React from "react";
import * as mainActions from "../../actions/mainActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Card } from "material-ui";
import { graphql } from "react-apollo";
import { login } from "../../queries";
import { getPrimary, getSecondary } from "../../styles/colors";
import withWindowSize from "../../HOCs/withWindowSize";
import withTranslations from "../../HOCs/withTranslations";
import { BasicButton, ButtonIcon, Link, TextInput, NotLoggedLayout, Grid, GridItem } from "../../displayComponents";


class Login extends React.PureComponent {

	state = {
		user: "",
		password: "",
		loading: false,
		showPassword: false,
		errors: {
			user: "",
			password: ""
		}
	};

	login = async () => {
		const { translate } = this.props;
		const { user, password } = this.state;
		if (!this.checkRequiredFields()) {
			this.setState({
				loading: true
			});
			const response = await this.props.mutate({
				variables: {
					email: user,
					password: password
				}
			});
			if (response.errors) {
				switch (response.errors[0].message) {
					case "Incorrect password":
						this.setState({
							loading: false,
							errors: {
								password: translate.password_err
							}
						});
						break;

					case 'Not actived':
						this.setState({
							loading: false,
							errors: {
								user: translate.email_not_found
							}
						})
						break;
					case "Not found":
						this.setState({
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
				this.setState({
					loading: false
				});
				this.props.actions.loginSuccess(response.data.login.token, response.data.login.refreshToken);
			}
		}
	};

	logout = () => {
		this.props.actions.logout();
	};

	handleKeyUp = event => {
		if (event.nativeEvent.keyCode === 13) {
			this.login();
		}
	};

	checkRequiredFields() {
		const { translate } = this.props;

		let errors = {
			user: "",
			password: ""
		};
		let hasError = false;

		if (!this.state.user) {
			hasError = true;
			errors.user = translate.field_required;
		}

		if (!this.state.password) {
			hasError = true;
			errors.password = translate.field_required;
		}

		this.setState({
			...this.state,
			errors: errors
		});

		return hasError;
	}

	render() {
		const { translate, windowSize } = this.props;
		const primary = getPrimary();
		const secondary = getSecondary();
		return (
			<NotLoggedLayout
				translate={this.props.translate}
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
						<div
							style={{
								width: "70%",
								fontSize: "0.9em",
								textAlign: 'center'
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
										onKeyUp={this.handleKeyUp}
										id={'username'}
										floatingText={translate.login_user}
										errorText={this.state.errors.user}
										type="text"
										value={this.state.user}
										onChange={event =>
											this.setState({
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
											this.state.showPassword
												? "text"
												: "password"
										}
										passwordToggler={() =>
											this.setState({
												showPassword: !this.state.showPassword
											})
										}
										showPassword={this.state.showPassword}
										onKeyUp={this.handleKeyUp}
										value={this.state.password}
										errorText={this.state.errors.password}
										onChange={event =>
											this.setState({
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
									loading={this.state.loading}
									id={'login-button'}
									textStyle={{
										color: "white",
										fontWeight: "700"
									}}
									textPosition="before"
									onClick={this.login}
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
									{/*TODO*/}
									{translate.login_forgot}
								</Link>
							</div>
						</Card>
					</GridItem>
				</Grid>
			</NotLoggedLayout>
		);
	}
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
