import React from "react";
import SignUpEnterprise from "./SignUpEnterprise";
import SignUpUser from "./SignUpUser";
import SignUpPay from "./SignUpPay";
import { getPrimary } from "../../../styles/colors";
import { Card, CardContent } from "material-ui";
import SignUpStepper from "./SignUpStepper";
import { BasicButton, NotLoggedLayout, Scrollbar } from '../../../displayComponents';
import { bHistory } from '../../../containers/App';
import withWindowSize from "../../../HOCs/withWindowSize";
import { userAndCompanySignUp } from "../../../queries/userAndCompanySignUp";
import { graphql } from "react-apollo";
import withTranslations from '../../../HOCs/withTranslations';

class SignUpPage extends React.PureComponent {
	state = {
		page: 1,
		success: false,
		sendCompany: true,
		data: {
			user: {
				name: "",
				surname: "",
				phone: "",
				preferredLanguage: this.props.translate.selectedLanguage,
				email: "",
				pwd: "",
			},
			company: {
				businessName: "",
				type: 0,
				tin: "",
				address: "",
				city: "",
				country: "España",
				countryState: "",
				zipcode: "",
			},
			subscription: {
				subscriptionType: "",
				iban: "",
				code: ""
			}
		},
		errors: {}
	};

	static getDerivedStateFromProps(nextProps, prevState){
		if(!prevState.data.user.preferredLanguage && !!nextProps.translate.selectedLanguage){
			return {
				data: {
					...prevState.data,
					user: {
						...prevState.data.user,
						preferredLanguage: nextProps.translate.selectedLanguage
					}
				}
			}
		}

		return null;
	}

	nextPage = (sendCompany = true) => {
		const index = this.state.page + 1;
		if (index <= 3) {
			this.setState({
				sendCompany: sendCompany,
				page: index
			});
		}
	};

	previousPage = () => {
		const index = this.state.page - 1;
		if (index <= 3) {
			this.setState({
				page: index
			});
		}
	};

	goToPage = index => {
		if (index < this.state.page) {
			this.setState({
				page: index
			});
		}
	};

	send = async () => {
		const { user, company, subscription } = this.state.data;
		const response = await this.props.mutate({
			variables: {
				user,
				/* ...(this.state.sendCompany? { company: company } : {}),
				subscription */
			}
		});
		if (response.errors) {
			switch (response.errors[0].message) {
				default:
					return;
			}
		}
		if (response.data.userAndCompanySignUp.success) {
			this.setState({
				success: true
			});
		}
	};

	createUser = async () => {
		const response = await this.props.mutate({
			variables: {
				...this.state.data
			}
		});
		if (response.errors) {
			switch (response.errors[0].message) {
				default:
					return;
			}
		}
		if (response.data.userAndCompanySignUp.success) {
			this.setState({
				success: true
			});
		}
	}

	updateState = object => {
		this.setState({
			...this.state,
			data: {
				...this.state.data,
				...object
			}
		});
	};

	updateUser = object => {
		this.setState({
			...this.state,
			data: {
				...this.state.data,
				user: {
					...this.state.data.user,
					...object
				}
			}
		})
	}

	updateCompany = object => {
		this.setState({
			...this.state,
			data: {
				...this.state.data,
				company: {
					...this.state.data.company,
					...object
				}
			}
		})
	}

	updateSubscription = object => {
		this.setState({
			...this.state,
			data: {
				...this.state.data,
				subscription: {
					...this.state.data.subscription,
					...object
				}
			}
		})
	}

	updateErrors = object => {
		this.setState({
			...this.state,
			errors: {
				...this.state.errors,
				...object
			}
		});
	};

	render() {
		const { translate, windowSize } = this.props;
		const { page } = this.state;
		const primary = getPrimary();

		return (
			<NotLoggedLayout
				translate={translate}
				languageSelector={true}
				helpIcon={true}
			>
				<div
					style={{
						width: '100%',
						height: '100%',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center'
					}}
				>
					<div
						style={{
							height: "13%",
							display: "flex",
							alignItems: "center",
							justifyContent: 'center'
						}}
					>
						<h3 style={{ color: "white", fontWeight: '700' }}>
							{translate.sign_up_user}
						</h3>
					</div>
					{!this.state.success ? (
						<Card
							elevation={8}
							style={{
								width: windowSize !== "xs" ? "65%" : "100%",
								height: windowSize !== "xs" ? null : "100%",
								padding: 0,
								borderRadius: windowSize !== "xs" ? "0.3em" : "0",
								overflow: "hidden"
							}}
						>
							<CardContent
								style={{
									padding: 0,
									width: "100%"
								}}
							>
								<div
									style={{
										display: "flex",
										flexDirection:
											windowSize !== "xs" ? "row" : "column",
										height:
											windowSize !== "xs"
												? "72vh"
												: "calc(100vh - 3em)",
										width: "100%"
									}}
								>
									<div
										style={{
											backgroundColor: "WhiteSmoke",
											height:
												windowSize !== "xs" ? "100%" : "5em"
										}}
									>
										<SignUpStepper
											translate={translate}
											active={page - 1}
											windowSize={windowSize}
											goToPage={this.goToPage}
										/>
									</div>
									<div
										style={{
											backgroundColor: "white",
											width: "100%",
											position: "relative",
											overflowY: "hidden",
											height:
												windowSize !== "xs"
													? "100%"
													: "calc(100vh - 8em - 11.5%)"
										}}
									>
										<Scrollbar>
											<div style={{ paddingBottom: "4.5em" }}>
												{page === 1 && (
													<SignUpUser
														nextPage={this.nextPage}
														formData={this.state.data.user}
														errors={this.state.errors}
														signUp={this.send}
														updateState={
															this.updateUser
														}
														updateErrors={
															this.updateErrors
														}
														translate={
															this.props.translate
														}
													/>
												)}

												{page === 2 && (
													<SignUpEnterprise
														nextPage={this.nextPage}
														translate={
															this.props.translate
														}
														previousPage={
															this.previousPage
														}
														formData={this.state.data.company}
														errors={this.state.errors}
														updateState={
															this.updateCompany
														}
														updateErrors={
															this.updateErrors
														}
													/>
												)}

												{page === 3 && (
													<SignUpPay
														nextPage={this.nextPage}
														previousPage={
															this.previousPage
														}
														formData={this.state.data.subscription}
														errors={this.state.errors}
														updateState={
															this.updateSubscription
														}
														updateErrors={
															this.updateErrors
														}
														translate={
															this.props.translate
														}
														send={this.send}
													/>
												)}
											</div>
										</Scrollbar>
									</div>
								</div>
							</CardContent>
						</Card>
					) : (
						<Card
							style={{
								width: windowSize === "xs" ? "100%" : "70%",
								padding: "3vw"
							}}
						>
							<div
								style={{
									marginBottom: 0,
									paddingBottom: 0,
									fontWeight: "600",
									fontSize: "1.2em",
									color: primary
								}}
							>
								{translate.register_successfully}
								<div style={{marginTop: '0.9em', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
									<BasicButton
										text={translate.back}
										textStyle={{fontWeight: '700', textTransform: 'none', color: 'white'}}
										onClick={() => bHistory.push('/')}
										color={primary}
									/>
								</div>
							</div>
						</Card>
					)}
				</div>
			</NotLoggedLayout>
		);
	}
}

export default graphql(userAndCompanySignUp, {
	options: { errorPolicy: "all" }
})(withWindowSize(withTranslations()(SignUpPage)));
