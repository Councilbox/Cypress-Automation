import React from "react";
import SignUpEnterprise from "./SignUpEnterprise";
import SignUpUser from "./SignUpUser";
import SignUpPay from "./SignUpPay";
import { getPrimary } from "../../../styles/colors";
import { Card, CardContent } from "material-ui";
import SignUpStepper from "./SignUpStepper";
import { BasicButton, NotLoggedLayout } from '../../../displayComponents';
import { bHistory } from '../../../containers/App';
import withWindowSize from "../../../HOCs/withWindowSize";
import Scrollbar from "react-perfect-scrollbar";
import { userAndCompanySignUp } from "../../../queries/userAndCompanySignUp";
import { graphql } from "react-apollo/index";
import Header from '../../Header';
import withTranslations from '../../../HOCs/withTranslations';

class SignUpPage extends React.PureComponent {
	state = {
		page: 1,
		success: false,
		data: {
			businessName: "",
			type: 0,
			cif: "",
			name: "",
			surname: "",
			phone: "",
			language: this.props.translate.selectedLanguage,
			email: "",
			pwd: "",
			address: "",
			city: "",
			country: "España",
			countryState: "",
			zipCode: "",
			subscriptionType: "",
			iban: "",
			code: ""
		},
		errors: {}
	};

	static getDerivedStateFromProps(nextProps, prevState){
		if(!prevState.language && !!nextProps.translate.selectedLanguage){
			return {
				data: {
					...prevState.data,
					language: nextProps.translate.selectedLanguage
				}
			}
		}

		return null;
	}

	nextPage = () => {
		const index = this.state.page + 1;
		if (index <= 3) {
			this.setState({
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
		const response = await this.props.mutate({
			variables: {
				data: this.state.data
			}
		});
		console.log(response.errors);
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
				data: this.state.data
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
						<h3 style={{ color: "white" }}>
							Alta de usuario {/*TRADUCCION*/}
						</h3>
					</div>
					{!this.state.success ? (
						<Card
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
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
											paddingTop: "1em",
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
										<Scrollbar option={{ suppressScrollX: true }}>
											<div style={{ paddingBottom: "6.5em" }}>
												{page === 1 && (
													<SignUpUser
														nextPage={this.nextPage}
														formData={this.state.data}
														errors={this.state.errors}
														updateState={
															this.updateState
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
														formData={this.state.data}
														errors={this.state.errors}
														updateState={
															this.updateState
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
														formData={this.state.data}
														errors={this.state.errors}
														updateState={
															this.updateState
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
