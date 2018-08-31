import React from "react";
import {
	BasicButton,
	ButtonIcon,
	Grid,
	GridItem,
	LoadingSection,
	SelectInput,
	TextInput
} from "../../../displayComponents";
import { MenuItem } from "material-ui/Menu";
import { getPrimary, getSecondary } from "../../../styles/colors";
import { companyTypes } from "../../../queries/masters";
import { checkCifExists } from "../../../queries/userAndCompanySignUp";
import CouncilboxApi from "../../../api/CouncilboxApi";
import { countries, provinces } from "../../../queries/masters";
import { graphql, withApollo, compose } from "react-apollo";


class SignUpEnterprise extends React.Component {

	state = {
		provinces: []
	}

	componentDidMount = async () => {
		const subscriptions = await CouncilboxApi.getSubscriptions();
		this.setState({
			subscriptions: subscriptions
		});
	};

	componentWillReceiveProps = async nextProps => {
		const data = nextProps.formData;
		const selectedCountry = this.props.countries.countries
			? this.props.countries.countries.find(
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

	nextPage = async () => {
		let isSuccess = await this.checkRequiredFields();
		if (!isSuccess) {
			this.props.nextPage();
		}
	};

	handleTypeChange = event => {
		this.props.updateState({
			type: event.target.value
		});
	};

	handleCountryChange = async event => {
		this.props.updateState({
			country: event.target.value
		});
	};

	previousPage = () => {
		this.props.previousPage();
	};

	jumpStep = () => {
		this.props.nextPage(false);
	}


	async checkRequiredFields() {
		const { translate } = this.props;

		const data = this.props.formData;
		let errors = {
			businessName: "",
			type: "",
			cif: "",
			address: "",
			countryState: '',
			city: "",
			country: "",
			zipcode: '',
		};
		let hasError = false;

		if (!data.businessName) {
			hasError = true;
			errors.businessName = translate.field_required;
		}

		if (data.type === "") {
			hasError = true;
			errors.type = translate.field_required;
		}

		let existsCif = await this.checkCifExists();

		if (!data.tin || existsCif) {
			hasError = true;
			errors.cif = existsCif
				? translate.vat_previosly_save
				: translate.field_required;
		}

		if (!data.address) {
			hasError = true;
			errors.address = translate.field_required;
		}

		if (!data.city) {
			hasError = true;
			errors.city = translate.field_required;
		}

		if (data.countryState === "") {
			hasError = true;
			errors.countryState = translate.field_required;
		}

		if (!data.zipcode) {
			hasError = true;
			errors.zipcode = translate.field_required;
		}

		if (data.type === "") {
			hasError = true;
			errors.province = translate.field_required;
		}

		this.props.updateErrors({
			...errors,
			hasError: hasError
		});

		return hasError;
	}

	handleKeyUp = event => {
		if (event.nativeEvent.keyCode === 13) {
			this.nextPage();
		}
		if(this.props.errors.hasError){
			this.checkRequiredFields();
		}
	};

	async checkCifExists() {
		const response = await this.props.client.query({
			query: checkCifExists,
			variables: { cif: this.props.formData.tin }
		});

		return response.data.checkCifExists.success;
	}

	render() {
		if (this.props.data.loading || this.props.countries.loading) {
			return <LoadingSection />;
		}

		const { translate, errors } = this.props;
		const data = this.props.formData;
		const primary = getPrimary();

		return (
			<div
				style={{
					width: "100%",
					padding: "6%",
					height: "100%"
				}}
				onKeyUp={this.handleKeyUp}
			>
				<span
					style={{
						fontSize: "1.3em",
						fontWeight: "700",
						color: primary
					}}
				>
					{translate.company_new_data}
				</span>
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
							{this.props.countries.countries.map(country => {
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
							value={data.zipcode}
							onChange={event =>
								this.props.updateState({
									zipcode: event.target.value
								})
							}
							errorText={this.props.errors.zipcode}
							required
						/>
					</GridItem>
					<GridItem xs={12} md={12} lg={12}>
						<TextInput
							floatingText={translate.entity_name}
							type="text"
							value={this.props.formData.businessName}
							onChange={event =>
								this.props.updateState({
									businessName: event.nativeEvent.target.value
								})
							}
							errorText={this.props.errors.businessName}
							required
						/>
					</GridItem>
					<GridItem xs={12} md={6} lg={6}>
						<SelectInput
							floatingText={translate.company_type}
							value={this.props.formData.type}
							onChange={this.handleTypeChange}
							errorText={this.props.errors.type}
							required
						>
							{this.props.data.companyTypes.map(type => {
								return (
									<MenuItem
										key={type.label}
										value={type.value}
									>
										{translate[type.label]}
									</MenuItem>
								);
							})}
						</SelectInput>
					</GridItem>
					<GridItem xs={12} md={6} lg={6}>
						<TextInput
							floatingText={translate.cif}
							type="text"
							value={this.props.formData.tin}
							onChange={event =>
								this.props.updateState({
									tin: event.target.value
								})
							}
							errorText={this.props.errors.cif}
							required
						/>
					</GridItem>
					<GridItem xs={12} md={4} lg={4}>
						<BasicButton
							text={translate.back}
							color={getSecondary()}
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
							text="Omitir este paso"
							color={getSecondary()}
							textStyle={{
								color: "white",
								fontWeight: "700"
							}}
							onClick={this.jumpStep}
							fullWidth
							icon={
								<ButtonIcon color="white" type="redo" />
							}
						/>
					</GridItem>
					<GridItem xs={12} md={4} lg={4}>
						<BasicButton
							text={translate.continue}
							color={primary}
							textStyle={{
								color: "white",
								fontWeight: "700"
							}}
							onClick={this.nextPage}
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
			</div>
		);
	}
}

export default compose(
	graphql(companyTypes),
	graphql(countries, {
		name: 'countries'
	})
)(withApollo(SignUpEnterprise));
