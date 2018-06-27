import React from "react";
import * as mainActions from "../../actions/mainActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Card } from "material-ui";
import { graphql } from "react-apollo";
import { login } from "../../queries";
import Header from '../Header';
import { getPrimary, getSecondary } from "../../styles/colors";
import withWindowSize from "../../HOCs/withWindowSize";
import withTranslations from "../../HOCs/withTranslations";
import { BasicButton, ButtonIcon, Link, TextInput, NotLoggedLayout } from "../../displayComponents";
//let background;
//import("../../assets/img/signup3.jpg").then(data => background = data);

class Login extends React.PureComponent {

	state = {
		user: "",
		password: "",
		errors: {
			user: "",
			password: ""
		}
	};

	login = async () => {
		const { translate } = this.props;
		const { user, password } = this.state;
		if (!this.checkRequiredFields()) {
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
							errors: {
								password: translate.password_err
							}
						});
						break;
					case "Not found":
						this.setState({
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
				this.props.actions.loginSuccess(response.data.login.token);
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

		if (!this.state.user.length > 0) {
			hasError = true;
			errors.user = translate.field_required;
		}

		if (!this.state.password.length > 0) {
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
		//background: `linear-gradient(to right, ${primary}, #6499B1)`
		return (
			<NotLoggedLayout
				translate={this.props.translate}
				helpIcon={true}
				languageSelector={true}
			>
				<div
					className="col-lg-7 col-md-7 col-xs-12"
					style={{
						color: "white",
						display: "flex",
						paddingLeft: "3%",
						flexDirection: "column",
						alignItems: "center",
						paddingTop: windowSize === "xs" ? "1em" : "9em"
					}}
				>
					<div
						style={{
							width: "70%",
							fontSize: "0.9em"
						}}
					>
						<h6
							style={{
								fontWeigth: "300",
								marginBottom: "1.2em",
								fontSize: "1.7em"
							}}
						>
							¿Todavía no dispones de una cuenta en CouncilBox?{/*TRADUCCION*/}
						</h6>
						{windowSize !== "xs" && (
							<span
								style={{
									fontSize: "0.9",
									marginBottom: "1em",
									marginTop: "0.7em"
								}}
							>
							{/*TRADUCCION*/}
							Active su cuenta de usuario de forma rápida y sencilla. Registre su entidad y empiece a gestionar sus reuniones al momento.

							También puede probarlo sin registrarse, realizando una reunión informal y descubriendo parte del potencial de Councilbox.
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
										text={translate.dashboard_new_meeting}
										color={'transparent'}
										fullWidth
										buttonStyle={{backgroundColor: 'transparent', border: '1px solid white', marginRight: '2em'}}
										textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
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
											fontSize: "0.9em",
											textTransform: "none"
										}}
										textPosition="before"
									/>
								</Link>
							</div>
						</div>
					</div>
				</div>
				<div
					className="col-lg-5 col-md-5 col-xs-12"
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						padding: 0
					}}
				>
					<Card
						style={{
							minHeight: "60%",
							width: windowSize === "xs" ? "100%" : "70%",
							padding: "8%",
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
						<div
							style={{
								marginTop: "2em",
								width: "95%"
							}}
						>
							<TextInput
								onKeyUp={this.handleKeyUp}
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
								onKeyUp={this.handleKeyUp}
								floatingText={translate.login_password}
								type="password"
								errorText={this.state.errors.password}
								value={this.state.password}
								onChange={event =>
									this.setState({
										password: event.nativeEvent.target.value
									})
								}
							/>
						</div>
						<div style={{ marginTop: "3em" }}>
							<BasicButton
								text={translate.dashboard_enter}
								color={primary}
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
				</div>
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
