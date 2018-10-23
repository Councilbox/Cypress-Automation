import React from "react";
import {
	BasicButton,
	ButtonIcon,
	Checkbox,
	Grid,
	GridItem,
	SelectInput,
	TextInput
} from "../../../displayComponents";
import { getPrimary, secondary } from "../../../styles/colors";
import { MenuItem } from "material-ui/Menu";
import TermsModal from "./TermsModal";

class SignUpPay extends React.Component {
	state = {
		subscriptions: [],
		termsCheck: false,
		termsAlert: false,
		showTermsModal: false
	};

	previousPage = () => {
		this.props.previousPage();
	};

	jumpStep = () => {
		if (!this.checkTerms()) {
			this.props.send();
		}
	}

	endForm = async () => {
		if (!this.checkRequiredFields()) {
			this.props.send();
		}
	};

	checkRequiredFields() {
		const { translate } = this.props;

		let errors = {
			termsCheck: ""
		};
		let hasError = false;

		if (!this.state.termsCheck) {
			hasError = true;
			errors.termsCheck = translate.acept_terms;
		}

		this.props.updateErrors(errors);

		return hasError;
	}

	checkTerms() {
		let errors = {
			termsCheck: ""
		};

		let hasError = false;

		if (!this.state.termsCheck) {
			hasError = true;
			errors.termsCheck = this.props.translate.acept_terms;
		}

		this.props.updateErrors({
			...errors,
			hasError: hasError
		});

		return hasError;
	}

	handleKeyUp = event => {
		if (event.nativeEvent.keyCode === 13) {
			this.endForm();
		}
		if(this.props.errors.hasError){
			this.checkRequiredFields();
		}
	};

	render() {

		const { translate, errors } = this.props;
		const data = this.props.formData;
		const primary = getPrimary();

		return (
			<div
				style={{
					width: "100%",
					padding: "6%"
				}}
				onKeyUp={this.handleKeyUp}
			>
				<div
					style={{
						fontSize: "1.3em",
						fontWeight: "700",
						color: primary
					}}
				>
					{translate.billing_information}
				</div>
				<Grid style={{ marginTop: "2em" }}>
					<GridItem xs={12} md={4} lg={4}>
						<SelectInput
							floatingText={translate.type_of_subscription}
							value={data.subscriptionType}
							onChange={event =>
								this.props.updateState({
									subscriptionType: event.target.value
								})
							}
							errorText={errors.subscriptionType}
						>
							{this.state.subscriptions.map(subscription => {
								return (
									<MenuItem
										key={subscription}
										value={subscription}
									>
										{subscription}
									</MenuItem>
								);
							})}
						</SelectInput>
					</GridItem>
					<GridItem xs={12} md={4} lg={4}>
						<TextInput
							floatingText="IBAN"
							type="text"
							value={this.state.iban}
							onChange={event =>
								this.props.updateState({
									iban: event.target.value
								})
							}
							errorText={this.props.errors.iban}
						/>
					</GridItem>
					<GridItem xs={12} md={4} lg={4}>
						<TextInput
							floatingText={translate.code_society_up}
							type="text"
							value={this.state.code}
							onChange={event =>
								this.props.updateState({
									code: event.target.value
								})
							}
							errorText={this.props.errors.code}
						/>
					</GridItem>

					<GridItem xs={12} md={12} lg={12}>
						<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
							<Checkbox
								label={translate.login_read_terms + ' '}
								value={this.state.termsCheck}
								onChange={(event, isInputChecked) =>
									this.setState({
										termsCheck: isInputChecked
									})
								}
								onClick={() => {
									this.setState({
										termsCheck: true
									});
								}}
							/>
							<a
								style={{
									color: primary,
									fontWeight: '700',
									cursor: 'pointer',
									textTransform: 'lowerCase',
									marginLeft: '0.4em'
								 }}
								onClick={event => {
									event.stopPropagation();
									this.setState({
										showTermsModal: true,
									});
								}}
							>
								{translate.login_read_terms2}
							</a>
						</div>
						{this.props.errors.termsCheck && (
							<div style={{ color: "red" }}>
								{this.props.errors.termsCheck}
							</div>
						)}
					</GridItem>
					<GridItem xs={12} md={4} lg={4}>
						<BasicButton
							text={translate.back}
							color={secondary}
							textStyle={{
								color: "white",
								fontWeight: "700"
							}}
							onClick={this.previousPage}
							fullWidth
							icon={
								<ButtonIcon color="white" type="arrow_back" />
							}
						/>
					</GridItem>
					<GridItem xs={12} md={4} lg={4}>
						<BasicButton
							text={translate.send}
							color={primary}
							textStyle={{
								color: "white",
								fontWeight: "700"
							}}
							onClick={this.endForm}
							fullWidth
							icon={
								<ButtonIcon
									color="white"
									type="arrow_forward"
								/>
							}
						/>
					</GridItem>
				</Grid>
				<TermsModal
					open={this.state.showTermsModal}
					translate={translate}
					close={() => {
						this.setState({
							showTermsModal: false
						});
					}}
				/>
			</div>
		);
	}
}

export default SignUpPay;
