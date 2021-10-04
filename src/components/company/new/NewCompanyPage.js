import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { MenuItem } from 'material-ui';
import gql from 'graphql-tag';
import { toast } from 'react-toastify';
import withSharedProps from '../../../HOCs/withSharedProps';
import {
	BasicButton,
	ButtonIcon,
	CardPageLayout,
	LiveToast,
	FileUploadButton,
	Grid,
	GridItem,
	LoadingSection,
	SelectInput,
	TextInput,
	SectionTitle
} from '../../../displayComponents';
import { checkCifExists } from '../../../queries/userAndCompanySignUp';
import { USER_ACTIVATIONS } from '../../../constants';
import { getPrimary, getSecondary } from '../../../styles/colors';
import { provinces as provincesQuery } from '../../../queries/masters';
import { bHistory, store } from '../../../containers/App';
import { getCompanies } from '../../../actions/companyActions';
import { sendGAevent } from '../../../utils/analytics';
// import GoverningBodyForm from '../settings/GoverningBodyForm';


class NewCompanyPage extends React.PureComponent {
	state = {
		data: {
			businessName: '',
			alias: '',
			tin: '',
			domain: '',
			type: 0,
			linkKey: '',
			address: '',
			governingBodyType: 0,
			governingBodyData: {},
			city: '',
			zipcode: '',
			country: 'España',
			creationCode: '',
			countryState: '',
			language: 'es'
		},
		step: 1,
		hasError: false,
		errors: {},
		provinces: [],
		success: false,
		countryInput: false,
		request: false,
		requestError: false
	};

	static getDerivedStateFromProps(nextProps, prevProps) {
		if (!nextProps.info.loading && prevProps.provinces.length === 0) {
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
		if (selectedCountry) {
			this.updateProvinces(selectedCountry.id);
		} else {
			this.setState({
				provinces: [],
				data: {
					...this.state.data,
					country: ''
				},
				countryInput: true
			});
		}
	};

	updateProvinces = async countryID => {
		const response = await this.props.client.query({
			query: provincesQuery,
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

	updateState = (object, cb) => {
		this.setState({
			data: {
				...this.state.data,
				...object
			}
		}, () => (cb ? cb() : {}));
	};

	cbxFile = event => {
		const file = event.nativeEvent.target.files[0];
		if (!file) {
			return;
		}

		const reader = new FileReader();
		reader.readAsDataURL(file);

		reader.onload = async () => {
			const fileInfo = {
				filename: file.name,
				filetype: file.type,
				filesize: Math.round(file.size / 1000).toString(),
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
		if (!await this.checkRequiredFields()) {
			sendGAevent({
				category: 'Editar entidades',
				action: 'Crear entidad',
				label: this.props.company ? this.props.company.businessName : 'Sin compañía'
			});
			this.setState({
				request: true
			});
			const response = await this.props.createCompany({
				variables: {
					company: {
						...this.state.data,
						demo: this.props.user.actived === USER_ACTIVATIONS.FREE_TRIAL ? 1 : 0
					},
					...((this.props.company && this.props.company.corporationId !== 1) ? { organization: this.props.company.id } : {})
				}
			});

			if (!response.errors) {
				if (response.data.createCompany.id) {
					this.setState({ request: false });
					await store.dispatch(getCompanies(this.props.user.id));
					bHistory.push('/');
					toast(
						<LiveToast
							message={this.props.translate.company_created}
							id="success-toast"
						/>,
						{
							position: toast.POSITION.TOP_RIGHT,
							autoClose: true,
							className: 'successToast'
						}
					);
				}
			}
		}
	};

	checkRequiredFields = async () => {
		const { translate } = this.props;

		const { data } = this.state;
		const errors = {
			businessName: '',
			type: '',
			alias: '',
			tin: '',
			address: '',
			city: '',
			countryState: '',
			country: '',
			zipcode: '',
		};
		let hasError = false;

		if (!data.businessName) {
			hasError = true;
			errors.businessName = translate.field_required;
		}

		if (data.type === '') {
			hasError = true;
			errors.type = translate.field_required;
		}

		const existsCif = await this.checkCifExists();

		if (!data.tin || existsCif) {
			hasError = true;
			errors.tin = existsCif ?
				translate.vat_previosly_save
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

		if (data.countryState === '') {
			hasError = true;
			errors.countryState = translate.field_required;
		}

		if (!data.zipcode) {
			hasError = true;
			errors.zipcode = translate.field_required;
		}

		if (data.type === '') {
			hasError = true;
			errors.province = translate.field_required;
		}

		this.setState({
			errors,
			hasError
		});

		return hasError;
	}

	async checkCifExists() {
		const response = await this.props.client.query({
			query: checkCifExists,
			variables: { cif: this.state.data.tin }
		});

		return response.data.checkCifExists.success;
	}

	handleKeyUp = event => {
		if (event.nativeEvent.keyCode === 13) {
			this.createCompany();
		}
		if (this.state.hasError) {
			this.checkRequiredFields();
		}
	};

	render() {
		const { translate, requestClose, buttonBack } = this.props;
		const {
			data, errors, requestError, success, request
		} = this.state;
		const primary = getPrimary();
		const secondary = getSecondary();

		if (this.props.info.loading) {
			return <LoadingSection />;
		}

		return (
			<CardPageLayout title={translate.companies_add}>
				{this.state.step === 1 ? (
					<div>
						<div>
							<SectionTitle
								text={translate.fiscal_data}
								color={primary}
								style={{
									marginTop: '1em'
								}}
							/>
							<br />
							<Grid spacing={0} onKeyUp={this.handleKeyUp}>
								<GridItem xs={12} md={9} lg={9}>
									<Grid spacing={16}>
										<GridItem xs={12} md={6} lg={5}>
											<TextInput
												floatingText={translate.business_name}
												id="company-name-input"
												type="text"
												value={data.businessName}
												errorText={errors.businessName}
												onChange={event => this.updateState({
													businessName:
														event.target.value
												})
												}
												required
											/>
										</GridItem>
										<GridItem xs={12} md={6} lg={3}>
											<SelectInput
												id="company-type-input"
												floatingText={translate.company_type}
												value={data.type}
												onChange={event => this.updateState({
													type: event.target.value
												})
												}
												errorText={errors.type}
											>
												{this.props.info.companyTypes.map(
													companyType => (
														<MenuItem
															id={`company-type-${companyType.value}`}
															key={companyType.label}
															value={companyType.value}
														>
															{translate[companyType.label]}
														</MenuItem>
													)
												)}
											</SelectInput>
										</GridItem>
										<GridItem xs={12} md={6} lg={4}>
											<TextInput
												floatingText={translate.entity_cif}
												id="company-id-input"
												type="text"
												value={data.tin}
												errorText={errors.tin}
												onChange={event => this.updateState({
													tin: event.target.value
												})
												}
												required
											/>
										</GridItem>
										<GridItem xs={12} md={6} lg={5}>
											<TextInput
												floatingText={translate.company_new_domain}
												id="company-domain-input"
												type="text"
												value={data.domain}
												errorText={errors.domain}
												onChange={event => this.updateState({
													domain: event.target.value
												})
												}
											/>
										</GridItem>
										<GridItem xs={12} md={6} lg={4}>
											<TextInput
												floatingText={translate.company_new_key}
												id="company-key-input"
												type="text"
												value={data.linkKey}
												helpPopover={true}
												helpTitle={translate.company_new_key}
												helpDescription={translate.company_link_key_desc}
												errorText={errors.linkKey}
												onChange={event => this.updateState({
													linkKey: event.target.value
												})
												}
											/>
										</GridItem>
										{/* Used in Evid
										 <GridItem xs={12} md={6} lg={4}>
											<TextInput
												floatingText={translate.external_id}
												id="company-external-id-input"
												type="text"
												value={data.externalId}
												errorText={errors.externalId}
												onChange={event => this.updateState({
													externalId: event.target.value
												})
												}
											/>
										</GridItem> */}
										<GridItem xs={12} md={6} lg={4}>
											<TextInput
												floatingText={translate.contact_email}
												type="text"
												errorText={errors.contactEmail}
												value={data.contactEmail || ''}
												onChange={event => this.updateState({
													contactEmail: event.target.value
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
									style={{ textAlign: 'center' }}
								>
									<GridItem xs={12} md={12} lg={12}>
										{!!data.logo && (
											<img
												src={data.logo}
												alt="logo"
												style={{
													marginBottom: '0.6em',
													maxHeight: '4em',
													maxWidth: '100%'
												}}
											/>
										)}
									</GridItem>
									<GridItem xs={12} md={12} lg={12}>
										<FileUploadButton
											text={translate.entity_logo}
											id="company-logo-input"
											image
											color={secondary}
											textStyle={{
												color: 'white',
												fontWeight: '700',
												fontSize: '0.9em',
												textTransform: 'none'
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
							{/* <Grid spacing={16}>
								<GridItem xs={12} md={12} lg={12}>
									<GoverningBodyForm translate={translate} state={data} updateState={this.updateState} />
								</GridItem>
							</Grid> */}
							<SectionTitle
								text={translate.contact_data}
								color={primary}
								style={{
									marginTop: '2em'
								}}
							/>
							<br />
							<Grid spacing={16} onKeyUp={this.handleKeyUp}>
								<GridItem xs={12} md={6} lg={6}>
									<TextInput
										required
										floatingText={translate.address}
										id="company-address-input"
										type="text"
										value={data.address}
										errorText={errors.address}
										onChange={event => this.updateState({
											address: event.target.value
										})
										}
									/>
								</GridItem>
								<GridItem xs={12} md={6} lg={6}>
									<TextInput
										required
										floatingText={translate.company_new_locality}
										id="company-city-input"
										type="text"
										value={data.city}
										errorText={errors.city}
										onChange={event => this.updateState({
											city: event.target.value
										})
										}
									/>
								</GridItem>
								<GridItem xs={12} md={6} lg={3}>
									<SelectInput
										floatingText={translate.company_new_country}
										id="company-country-select"
										value={this.state.countryInput ? 'other' : data.country}
										onChange={this.cbxCountryChange}
										errorText={errors.country}
									>
										{this.props.info.countries.map(country => (
											<MenuItem
												id={`company-country-${country.deno}`}
												key={country.deno}
												value={country.deno}
											>
												{country.deno}
											</MenuItem>
										))}
										<MenuItem
											key={'other'}
											id="company-country-other"
											value={'other'}
										>
											{translate.other}
										</MenuItem>
									</SelectInput>
								</GridItem>
								{this.state.countryInput
									&& <GridItem xs={12} md={6} lg={3}>
										<TextInput
											floatingText={
												translate.company_new_country
											}
											id="company-country-input"
											type="text"
											value={data.country}
											errorText={errors.country}
											onChange={event => this.updateState({
												country: event.target.value
											})
											}
										/>
									</GridItem>
								}
								<GridItem xs={12} md={6} lg={3}>
									{this.state.countryInput ?
										<TextInput
											floatingText={
												translate.company_new_country_state
											}
											type="text"
											id="country-state-input"
											value={data.countryState}
											errorText={errors.countryState}
											onChange={event => this.updateState({
												countryState: event.target.value
											})
											}
										/>
										: <SelectInput
											required
											floatingText={
												translate.company_new_country_state
											}
											id="country-state-select"
											value={data.countryState}
											errorText={errors.countryState}
											onChange={event => {
												this.updateState({
													countryState: event.target.value
												}, () => this.handleKeyUp(event));
											}}
										>
											{this.state.provinces.map(province => (
												<MenuItem
													key={province.deno}
													id={`company-country-state-${province.deno}`}
													value={province.deno}
												>
													{province.deno}
												</MenuItem>
											))}
										</SelectInput>
									}
								</GridItem>
								<GridItem xs={12} md={6} lg={3}>
									<TextInput
										required
										floatingText={translate.company_new_zipcode}
										type="text"
										id="company-zipcode-input"
										value={data.zipcode}
										errorText={errors.zipcode}
										onChange={event => this.updateState({
											zipcode: event.target.value
										})
										}
									/>
								</GridItem>
								<GridItem xs={12} md={6} lg={3}>
									<SelectInput
										floatingText={translate.language}
										value={data.language}
										id="company-language-select"
										onChange={event => this.updateState({
											language: event.target.value
										})
										}
										errorText={errors.language}
									>
										{this.props.info.languages
											&& this.props.info.languages.map(
												language => (
													<MenuItem
														id={`company-language-${language.columnName}`}
														key={`language_${language.columnName
															}`}
														value={language.columnName}
													>
														{language.desc}
													</MenuItem>
												)
											)}
									</SelectInput>
								</GridItem>
								<GridItem xs={12} md={6} lg={3}>
									<TextInput
										id="company-code-input"
										floatingText={translate.affiliation_code}
										type="text"
										value={data.creationCode}
										onChange={event => this.updateState({
											creationCode: event.target.value
										})
										}
									/>
								</GridItem>
							</Grid>
						</div>
						<br />
						<div style={{ marginTop: '3em' }}>
							<div style={{
								display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '2em'
							}} >
								{buttonBack ?
									<React.Fragment>
										<BasicButton
											id="back-button"
											text={translate.back}
											textStyle={{ textTransform: 'none', color: 'black', fontWeight: '700' }}
											onClick={requestClose}
											buttonStyle={{ marginRight: '1em' }}
											primary={true}
											color='transparent'
											type="flat"
										/>
										<BasicButton
											text={translate.companies_add}
											color={getPrimary()}
											error={requestError}
											id="company-add-button"
											success={success}
											loading={request}
											floatRight
											textStyle={{
												color: 'white',
												fontWeight: '700',

											}}
											onClick={this.createCompany}
											icon={<ButtonIcon type="add" color="white" />}
										/>
									</React.Fragment>
									: <BasicButton
										text={translate.companies_add}
										color={getPrimary()}
										error={requestError}
										success={success}
										id="company-add-button"
										loading={request}
										floatRight
										textStyle={{
											color: 'white',
											fontWeight: '700',
											marginBottom: '2em'
										}}
										onClick={this.createCompany}
										icon={<ButtonIcon type="add" color="white" />}
									/>
								}
							</div>
						</div>
					</div>
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
	mutation CreateCompany($company: CompanyInput, $organization: Int) {
		createCompany(company: $company, organization: $organization) {
			id
		}
	}
`;

export default compose(
	graphql(info, {
		name: 'info',
		options: () => ({
			variables: {
				countryId: 1
			}
		})
	}),
	graphql(createCompany, {
		name: 'createCompany',
		options: {
			errorPolicy: 'all'
		}
	})
)(withSharedProps()(withApollo(NewCompanyPage)));
