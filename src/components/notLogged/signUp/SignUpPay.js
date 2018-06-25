import React from "react";
import CouncilboxApi from "../../../api/CouncilboxApi";
import {
	BasicButton,
	ButtonIcon,
	Checkbox,
	Grid,
	GridItem,
	LoadingSection,
	SelectInput,
	TextInput
} from "../../../displayComponents";
import { getPrimary, secondary } from "../../../styles/colors";
import { MenuItem } from "material-ui/Menu";
import { graphql, withApollo } from "react-apollo";
import { countries, provinces } from "../../../queries/masters";
import TermsModal from "./TermsModal";

class SignUpPay extends React.Component {
	state = {
		provinces: [],
		subscriptions: [],
		termsCheck: false,
		termsAlert: false,
		showTermsModal: false
	};


	componentDidMount = async () => {
		const subscriptions = await CouncilboxApi.getSubscriptions();
		this.setState({
			subscriptions: subscriptions
		});
	};

	componentWillReceiveProps = async nextProps => {
		const data = nextProps.formData;
		const selectedCountry = this.props.data.countries
			? this.props.data.countries.find(
					country => country.deno === data.country
			  )
			: {
					deno: "España",
					id: 1
			  };

		const response = await this.props.client.query({
			query: provinces,
			variables: {
				countryId: selectedCountry.id
			}
		});

		if (response) {
			this.setState({
				provinces: response.data.provinces
			});
		}
	};

	previousPage = () => {
		this.props.previousPage();
	};

	endForm = async () => {
		if (!this.checkRequiredFields()) {
			this.props.send();
		}
	};

	handleCountryChange = async event => {
		this.props.updateState({
			country: event.target.value
		});
	};

	checkRequiredFields() {
		const { translate } = this.props;

		let errors = {
			address: "",
			city: "",
			country: "",
			zipCode: "",
			termsCheck: ""
		};
		let hasError = false;
		const data = this.props.formData;

		if (!data.address.length > 0) {
			hasError = true;
			errors.address = translate.field_required;
		}

		if (!data.city.length > 0) {
			hasError = true;
			errors.city = translate.field_required;
		}

		if (data.countryState === "") {
			hasError = true;
			errors.countryState = translate.field_required;
		}

		if (!data.zipCode.length > 0) {
			hasError = true;
			errors.zipCode = translate.field_required;
		}

		if (data.type === "") {
			hasError = true;
			errors.province = translate.field_required;
		}

		if (!this.state.termsCheck) {
			hasError = true;
			errors.termsCheck = translate.acept_terms;
		}

		this.props.updateErrors(errors);

		return hasError;
	}

	render() {
		if (this.props.data.loading) {
			return <LoadingSection />;
		}

		const { translate, errors } = this.props;
		const data = this.props.formData;
		const primary = getPrimary();

		return (
			<div
				style={{
					width: "100%",
					padding: "6%"
				}}
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
					<GridItem xs={12} md={12} lg={12}>
						<TextInput
							floatingText={translate.address}
							type="text"
							value={data.address}
							errorText={this.props.errors.address}
							onChange={event =>
								this.props.updateState({
									address: event.target.value
								})
							}
							required
						/>
					</GridItem>
					<GridItem xs={12} md={6} lg={6}>
						<TextInput
							floatingText={translate.company_new_locality}
							type="text"
							value={data.city}
							onChange={event =>
								this.props.updateState({
									city: event.target.value
								})
							}
							errorText={this.props.errors.city}
							required
						/>
					</GridItem>
					<GridItem xs={12} md={6} lg={6}>
						<SelectInput
							floatingText={translate.company_new_country}
							value={data.country}
							onChange={this.handleCountryChange}
							errorText={errors.country}
							required
						>
							{this.props.data.countries.map(country => {
								return (
									<MenuItem
										key={country.deno}
										value={country.deno}
									>
										{country.deno}
									</MenuItem>
								);
							})}
						</SelectInput>
					</GridItem>
					<GridItem xs={12} md={6} lg={6}>
						<SelectInput
							floatingText={translate.company_new_country_state}
							value={data.countryState}
							errorText={errors.countryState}
							onChange={event =>
								this.props.updateState({
									countryState: event.target.value
								})
							}
							required
						>
							{this.state.provinces.map(province => {
								return (
									<MenuItem
										key={province.deno}
										value={province.id}
									>
										{province.deno}
									</MenuItem>
								);
							})}
						</SelectInput>
					</GridItem>
					<GridItem xs={12} md={6} lg={6}>
						<TextInput
							floatingText={translate.company_new_zipcode}
							type="text"
							value={data.zipCode}
							onChange={event =>
								this.props.updateState({
									zipCode: event.target.value
								})
							}
							errorText={this.props.errors.zipCode}
							required
						/>
					</GridItem>
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
							floatingText="Código"
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
									fontSize: '0.9em',
									fontWeight: '700',
									cursor: 'pointer',
									textTransform: 'lowerCase',
									paddingBottom: '3px',
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
					<GridItem xs={12} md={6} lg={6}>
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
					<GridItem xs={12} md={6} lg={6}>
						<BasicButton
							text={translate.continue}
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

export default graphql(countries)(withApollo(SignUpPay));
