import React from "react";
import { compose, graphql, withApollo } from "react-apollo";
import withSharedProps from "../../../HOCs/withSharedProps";
import {
	BasicButton,
	ButtonIcon,
	CardPageLayout,
	FileUploadButton,
	Grid,
	GridItem,
	LoadingSection,
	SelectInput,
	TextInput
} from "../../../displayComponents";
import { MenuItem, Typography } from "material-ui";
import { getPrimary, getSecondary } from "../../../styles/colors";
import { provinces } from "../../../queries/masters";
import gql from "graphql-tag";
import { bHistory, store } from "../../../containers/App";
import { getCompanies } from "../../../actions/companyActions";
import { toast } from "react-toastify";

class NewCompanyPage extends React.PureComponent {
	state = {
		data: {
			businessName: "",
			alias: "",
			tin: "",
			domain: "",
			type: 0,
			linkKey: "",
			address: "",
			city: "",
			zipcode: "",
			country: "España",
			language: "es"
		},
		step: 1,
		errors: {},
		provinces: [],
		success: false,
		request: false,
		requestError: false
	};

	static getDerivedStateFromProps(nextProps) {
		if (!nextProps.info.loading) {
			return {
				provinces: nextProps.info.provinces
			};
		}
		return null;
	}

	cbxCountryChange = event => {
		this.updateState({ country: event.target.value });
		const selectedCountry = this.props.info.countries.find(
			country => country.deno === event.target.value
		);
		this.updateProvinces(selectedCountry.id);
	};

	updateProvinces = async countryID => {
		const response = await this.props.client.query({
			query: provinces,
			variables: {
				countryId: countryID
			}
		});

		if (response) {
			this.setState({
				provinces: response.data.provinces
			});
		}
	};

	updateState = object => {
		this.setState({
			data: {
				...this.state.data,
				...object
			}
		});
	};

	cbxFile = event => {
		const file = event.nativeEvent.target.files[0];
		if (!file) {
			return;
		}

		let reader = new FileReader();
		reader.readAsDataURL(file);

		reader.onload = async () => {
			let fileInfo = {
				filename: file.name,
				filetype: file.type,
				filesize: Math.round(file.size / 1000),
				base64: reader.result,
				councilId: this.props.councilID
			};

			this.setState({
				uploading: true,
				data: {
					...this.state.data,
					logo: fileInfo.base64
				},
				success: false
			});
		};
	};

	cbx = object => {
		this.setState({
			errors: {
				...this.state.errors,
				...object
			}
		});
	};

	createCompany = async () => {
		const response = await this.props.createCompany({
			variables: {
				company: this.state.data,
				userId: this.props.user.id
			}
		});

		if (!response.errors) {
			if (response.data.createCompany.id) {
				store.dispatch(getCompanies(this.props.user.id));
				bHistory.push(`/company/${response.data.createCompany.id}`);
				toast.success(this.props.translate.company_created);
			}
		}
	};

	render() {
		const { translate } = this.props;
		const { data, errors, requestError, success, request } = this.state;
		const primary = getPrimary();
		const secondary = getSecondary();

		if (this.props.info.loading) {
			return <LoadingSection />;
		}

		return (
			<CardPageLayout title={"Crear entidad"}>{/*TRADUCCION*/}
				{this.state.step === 1 ? (
					<React.Fragment>
						<Typography variant="title" style={{ color: primary }}>
							{translate.fiscal_data}
						</Typography>
						<br />
						<Grid spacing={0}>
							<GridItem xs={12} md={9} lg={9}>
								<Grid spacing={16}>
									<GridItem xs={12} md={6} lg={5}>
										<TextInput
											floatingText={
												translate.business_name
											}
											type="text"
											value={data.businessName}
											errorText={errors.businessName}
											onChange={event =>
												this.updateState({
													businessName:
														event.target.value
												})
											}
											required
										/>
									</GridItem>
									<GridItem xs={12} md={6} lg={4}>
										<TextInput
											floatingText={
												"Nombre de la entidad"//TRADUCCION
											}
											type="text"
											value={data.alias}
											errorText={errors.alias}
											onChange={event =>
												this.updateState({
													alias: event.target.value
												})
											}
											required
										/>
									</GridItem>
									<GridItem xs={12} md={6} lg={3}>
										<SelectInput
											floatingText={
												"Tipo de entidad"//TRADUCCION
											}
											value={data.type}
											onChange={event =>
												this.updateState({
													type: event.target.value
												})
											}
											errorText={errors.type}
										>
											{this.props.info.companyTypes.map(
												companyType => {
													return (
														<MenuItem
															key={
																companyType.label
															}
															value={
																companyType.value
															}
														>
															{
																translate[
																	companyType
																		.label
																]
															}
														</MenuItem>
													);
												}
											)}
										</SelectInput>
									</GridItem>
									<GridItem xs={12} md={6} lg={4}>
										<TextInput
											floatingText={
												"CIF de la entidad"//TRADUCCION
											}
											type="text"
											value={data.tin}
											errorText={errors.tin}
											onChange={event =>
												this.updateState({
													tin: event.target.value
												})
											}
											required
										/>
									</GridItem>
									<GridItem xs={12} md={6} lg={4}>
										<TextInput
											floatingText={
												translate.company_new_domain
											}
											type="text"
											value={data.domain}
											errorText={errors.domain}
											onChange={event =>
												this.updateState({
													domain: event.target.value
												})
											}
										/>
									</GridItem>
									<GridItem xs={12} md={6} lg={4}>
										<TextInput
											floatingText={
												translate.company_new_key
											}
											type="text"
											value={data.linkKey}
											errorText={errors.linkKey}
											onChange={event =>
												this.updateState({
													linkKey: event.target.value
												})
											}
										/>
									</GridItem>
								</Grid>
							</GridItem>
							<GridItem
								xs={12}
								md={3}
								lg={3}
								style={{ textAlign: "center" }}
							>
								<GridItem xs={12} md={12} lg={12}>
									{!!data.logo && (
										<img
											src={data.logo}
											alt="logo"
											style={{
												marginBottom: "0.6em",
												maxHeight: "4em",
												maxWidth: "100%"
											}}
										/>
									)}
								</GridItem>
								<GridItem xs={12} md={12} lg={12}>
									<FileUploadButton
										text={'Logo de la entidad'}
										image
										color={secondary}
										textStyle={{
											color: "white",
											fontWeight: "700",
											fontSize: "0.9em",
											textTransform: "none"
										}}
										icon={
											<ButtonIcon
												type="publish"
												color="white"
											/>
										}
										onChange={this.cbxFile}
									/>
								</GridItem>
							</GridItem>
						</Grid>
						<br />
						<Typography variant="title" style={{ color: primary }}>
							{translate.contact_data}
						</Typography>
						<br />
						<Grid spacing={16}>
							<GridItem xs={12} md={6} lg={6}>
								<TextInput
									floatingText={translate.address}
									type="text"
									value={data.address}
									errorText={errors.address}
									onChange={event =>
										this.updateState({
											address: event.target.value
										})
									}
								/>
							</GridItem>
							<GridItem xs={12} md={6} lg={6}>
								<TextInput
									floatingText={
										translate.company_new_locality
									}
									type="text"
									value={data.city}
									errorText={errors.city}
									onChange={event =>
										this.updateState({
											city: event.target.value
										})
									}
								/>
							</GridItem>
							<GridItem xs={12} md={6} lg={3}>
								<SelectInput
									floatingText={translate.company_new_country}
									value={data.country}
									onChange={this.cbxCountryChange}
									errorText={errors.country}
								>
									{this.props.info.countries.map(country => {
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
							<GridItem xs={12} md={6} lg={3}>
								<SelectInput
									floatingText={
										translate.company_new_country_state
									}
									value={data.countryState}
									errorText={errors.countryState}
									onChange={event =>
										this.updateState({
											countryState: event.target.value
										})
									}
								>
									{this.state.provinces.map(province => {
										return (
											<MenuItem
												key={province.deno}
												value={province.deno}
											>
												{province.deno}
											</MenuItem>
										);
									})}
								</SelectInput>
							</GridItem>
							<GridItem xs={12} md={6} lg={3}>
								<TextInput
									floatingText={translate.company_new_zipcode}
									type="text"
									value={data.zipcode}
									errorText={errors.zipcode}
									onChange={event =>
										this.updateState({
											zipcode: event.target.value
										})
									}
								/>
							</GridItem>
							<GridItem xs={12} md={6} lg={3}>
								<SelectInput
									floatingText={translate.language}
									value={data.language}
									onChange={event =>
										this.updateState({
											language: event.target.value
										})
									}
									errorText={errors.language}
								>
									{this.props.info.languages &&
										this.props.info.languages.map(
											language => (
												<MenuItem
													key={`language_${
														language.columnName
													}`}
													value={language.columnName}
												>
													{language.desc}
												</MenuItem>
											)
										)}
								</SelectInput>
							</GridItem>
						</Grid>
						<br />
						<BasicButton
							text={'Añadir entidad'}//TRADUCCION
							color={getPrimary()}
							error={requestError}
							success={success}
							loading={request}
							floatRight
							textStyle={{
								color: "white",
								fontWeight: "700"
							}}
							onClick={this.createCompany}
							icon={<ButtonIcon type="add" color="white" />}
						/>
					</React.Fragment>
				) : (
					<React.Fragment>STEP 2</React.Fragment>
				)}
			</CardPageLayout>
		);
	}
}

export const info = gql`
	query info($countryId: Int!) {
		companyTypes {
			label
			value
		}
		countries {
			deno
			id
		}
		provinces(countryId: $countryId) {
			deno
			id
		}

		languages {
			desc
			columnName
		}
	}
`;

const createCompany = gql`
	mutation CreateCompany($company: CompanyInput, $userId: Int!) {
		createCompany(company: $company, userId: $userId) {
			id
		}
	}
`;

export default compose(
	graphql(info, {
		name: "info",
		options: props => ({
			variables: {
				countryId: 1
			}
		})
	}),
	graphql(createCompany, {
		name: "createCompany",
		options: {
			errorPolicy: "all"
		}
	})
)(withSharedProps()(withApollo(NewCompanyPage)));
