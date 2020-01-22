import React from "react";
import {
	AlertConfirm,
	BasicButton,
	ButtonIcon,
	CardPageLayout,
	FileUploadButton,
	Grid,
	GridItem,
	LoadingSection,
	LiveToast,
	SelectInput,
	SectionTitle,
	TextInput
} from "../../../displayComponents";
import { MenuItem } from "material-ui";
import withSharedProps from '../../../HOCs/withSharedProps';
import { compose, graphql, withApollo } from "react-apollo";
import { provinces } from "../../../queries/masters";
import { unlinkCompany, updateCompany } from "../../../queries/company";
import { getPrimary, getSecondary } from "../../../styles/colors";
import { bHistory, store } from "../../../containers/App";
import { getCompanies, setCompany } from "../../../actions/companyActions";
import gql from "graphql-tag";
import { toast } from "react-toastify";
import ConfirmCompanyButton from "../../corporation/companies/ConfirmCompanyButton";
import DeleteCompanyButton from "./DeleteCompanyButton";
import { sendGAevent } from "../../../utils/analytics";
import GoverningBodyForm from "./GoverningBodyForm";
import NewUser from "../../corporation/users/NewUser";

export const info = gql`
	query info {
		companyTypes {
			label
			value
		}
		countries {
			deno
			id
		}
		languages {
			desc
			columnName
		}
	}
`;

const CompanySettingsPage = ({ company, client, translate, ...props }) => {
	const [state, setState] = React.useState({
		data: company,
		success: false,
		error: false,
		fileSizeError: false,
		unlinkModal: false,
		request: false,
		provinces: [],
		errors: {}
	});
	const primary = getPrimary();
	const secondary = getSecondary();

	React.useEffect(() => {
		props.info.refetch();
		sendGAevent({
			category: 'Editar Datos básico de la empresa',
			action: 'Entrada',
			label: company.businessName
		});
	}, [company.id]);

	React.useEffect(() => {
		if (!props.info.loading && state.provinces.length === 0) {
			const selectedCountry = props.info.countries.find(
				country => country.deno === company.country
			);

			if(selectedCountry){
				updateProvinces(selectedCountry.id);
			}
		}
	}, [props.info]);

	const updateState = newValues => {
		setState({
			...state,
			data: {
				...state.data,
				...newValues
			},
			success: false
		});
	}

	const handleCountryChange = event => {
		updateState({ country: event.target.value });
		const selectedCountry = props.info.countries.find(
			country => country.deno === event.target.value
		);
		updateProvinces(selectedCountry.id);
	};


	const updateProvinces = async countryID => {
		const response = await client.query({
			query: provinces,
			variables: {
				countryId: countryID
			}
		});

		if (!response.errors) {
			setState({
				...state,
				provinces: response.data.provinces
			});
		}
	};

	const handleFile = event => {
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
				councilId: props.councilID
			};

			if (fileInfo.filesize > 2000) {
				setState({
					...state,
					fileSizeError: true
				});
			} else {
				setState({
					...state,
					uploading: true,
					data: {
						...state.data,
						logo: fileInfo.base64
					},
					success: false
				});
			}
		};
	};


	const saveCompany = async () => {
		if (!checkRequiredFields()) {
			sendGAevent({
				category: 'Editar Datos básico de la empresa',
				action: 'Actualización de datos',
				label: company.businessName
			});

			setState({
				...state,
				loading: true
			});
			const { __typename, creatorId, creationDate, corporationId, ...data } = state.data;

			const response = await props.updateCompany({
				variables: {
					company: data
				}
			});
			if (response.errors) {
				setState({
					...state,
					error: true,
					loading: false,
					success: false
				});
			} else {
				toast(
					<LiveToast
						message={translate.changes_saved}
					/>, {
						position: toast.POSITION.TOP_RIGHT,
						autoClose: true,
						className: "successToast"
					}
				);
				store.dispatch(setCompany(response.data.updateCompany));
				bHistory.push('/');
			}
		}
	};

	const unlinkCompany = async () => {
		const response = await props.unlinkCompany({
			variables: {
				userId: props.user.id,
				companyTin: company.tin
			}
		});

		if (!response.errors) {
			if (response.data.unlinkCompany.success) {
				store.dispatch(getCompanies(props.user.id));
				toast(
					<LiveToast
						message={translate.company_link_unliked_title}
					/>, {
						position: toast.POSITION.TOP_RIGHT,
						autoClose: true,
						className: "successToast"
					}
				);
				bHistory.push("/");
			}
		}
	};

	function checkRequiredFields() {
		let errors = {
			businessName: "",
			tin: ""
		};

		const { data } = state;
		let hasError = false;

		if (!data.businessName) {
			hasError = true;
			errors.businessName = translate.field_required;
		}

		if (!data.tin) {
			hasError = true;
			errors.tin = translate.field_required;
		}

		setState({
			...state,
			errors: errors
		});
		return hasError;
	}


	const { data, errors, success, request } = state;
	const updateError = state.error;
	const { loading } = props.info;

	if (loading) {
		return <LoadingSection />;
	}

	return (
		<CardPageLayout title={translate.company_settings}>
			<div style={{ width: '100%', height: '100%', padding: '1.5em', paddingBottom: '6em' }}>
				<SectionTitle
					text={translate.fiscal_data}
					color={primary}
				/>
				<br />
				<Grid spacing={0}>
					<GridItem xs={12} md={9} lg={9}>
						<Grid spacing={16}>
							<GridItem xs={12} md={6} lg={5}>
								<TextInput
									floatingText={translate.business_name}
									type="text"
									id={"business-name"}
									value={data.businessName}
									errorText={errors.businessName}
									onChange={event =>
										updateState({
											businessName: event.target.value
										})
									}
									required
								/>
							</GridItem>
							<GridItem xs={12} md={6} lg={3}>
								<SelectInput
									floatingText={translate.company_type}
									value={data.type}
									disabled
									onChange={event =>
										updateState({
											type: event.target.value
										})
									}
									errorText={errors.type}
								>
									{props.info.companyTypes.map(
										companyType => {
											return (
												<MenuItem
													key={companyType.label}
													value={companyType.value}
												>
													{
														translate[
														companyType.label
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
									floatingText={translate.entity_cif}
									id={'addSociedadCIF'}
									type="text"
									value={data.tin}
									errorText={errors.tin}
									onChange={event =>
										updateState({
											tin: event.target.value
										})
									}
									required
								/>
							</GridItem>
							<GridItem xs={12} md={6} lg={4}>
								<TextInput
									floatingText={translate.company_new_domain}
									type="text"
									id={'addSociedadDominio'}
									value={data.domain}
									errorText={errors.domain}
									onChange={event =>
										updateState({
											domain: event.target.value
										})
									}
								/>
							</GridItem>
							<GridItem xs={12} md={6} lg={4}>
								<TextInput
									floatingText={translate.company_new_key}
									type="text"
									value={data.linkKey}
									id={'addSociedadClaveMaestra'}
									helpPopover={true}
									helpTitle={translate.company_new_key}
									helpDescription={translate.company_link_key_desc}
									errorText={errors.linkKey}
									onChange={event =>
										updateState({
											linkKey: event.target.value
										})
									}
								/>
							</GridItem>
							{props.root &&
								<GridItem xs={12} md={6} lg={4}>
									<TextInput
										floatingText={'Saldo'}
										type="text"
										value={data.balance || ''}
										onChange={event =>
											updateState({
												balance: event.target.value
											})
										}
									/>
								</GridItem>
							}
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
								text={translate.company_logotype}
								image
								color={secondary}
								textStyle={{
									color: "white",
									fontWeight: "700",
									fontSize: "0.9em",
									textTransform: "none"
								}}
								icon={
									<ButtonIcon type="publish" color="white" />
								}
								onChange={handleFile}
							/>
						</GridItem>
					</GridItem>
				</Grid>
				<br />
				<Grid spacing={16}>
					<GridItem xs={12} md={12} lg={12}>
						<GoverningBodyForm translate={translate} state={data} updateState={updateState} />
					</GridItem>
				</Grid>
				<SectionTitle
					text={translate.contact_data}
					color={primary}
					style={{
						marginTop: '2em'
					}}
				/>
				<br />
				<Grid spacing={16}>
					<GridItem xs={12} md={6} lg={6}>
						<TextInput
							floatingText={translate.address}
							type="text"
							value={data.address}
							id={'addSociedadDireccion'}
							errorText={errors.address}
							onChange={event =>
								updateState({
									address: event.target.value
								})
							}
						/>
					</GridItem>
					<GridItem xs={12} md={6} lg={6}>
						<TextInput
							floatingText={translate.company_new_locality}
							type="text"
							id={'addSociedadLocalidad'}
							value={data.city}
							errorText={errors.city}
							onChange={event =>
								updateState({
									city: event.target.value
								})
							}
						/>
					</GridItem>
					<GridItem xs={12} md={6} lg={3}>
						<SelectInput
							floatingText={translate.company_new_country}
							value={data.country}
							onChange={handleCountryChange}
							errorText={errors.country}
						>
							{props.info.countries.map(country => {
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
							id={'addSociedadProvincia'}
							floatingText={translate.company_new_country_state}
							value={data.countryState}
							errorText={errors.countryState}
							onChange={event =>
								updateState({
									countryState: event.target.value
								})
							}
						>
							{state.provinces.map(province => {
								return (
									<MenuItem
										className={"addSociedadProvinciaOptions"}
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
							id={'addSociedadCP'}
							type="text"
							value={data.zipcode}
							errorText={errors.zipcode}
							onChange={event =>
								updateState({
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
								updateState({
									language: event.target.value
								})
							}
							errorText={errors.language}
						>
							{props.info.languages &&
								props.info.languages.map(language => (
									<MenuItem
										key={`language_${language.columnName}`}
										value={language.columnName}
									>
										{language.desc}
									</MenuItem>
								))}
						</SelectInput>
					</GridItem>
					{props.root &&
						<GridItem xs={12} md={6} lg={3}>
							<SelectInput
								floatingText={'Categoría'}
								value={data.category}
								onChange={event =>
									updateState({
										category: event.target.value
									})
								}
								errorText={errors.language}
							>
								<MenuItem value="society">
									Sociedad
								</MenuItem>
								<MenuItem value="realEstate">
									Administración de fincas
								</MenuItem>
							</SelectInput>
						</GridItem>
					}
				</Grid>
				<br />
				<BasicButton
					text={translate.save}
					id="save-button"
					color={primary}
					error={updateError}
					success={success}
					loading={request}
					floatRight
					textStyle={{
						color: "white",
						fontWeight: "700"
					}}
					onClick={saveCompany}
					icon={<ButtonIcon type="save" color="white" />}
				/>
				{props.linkButton &&
					<BasicButton
						text={translate.unlink}
						color={primary}
						floatRight
						textStyle={{
							color: "white",
							fontWeight: "700"
						}}
						buttonStyle={{ marginRight: "1.2em" }}
						onClick={() =>
							setState({
								...state,
								unlinkModal: true
							})
						}
						icon={<ButtonIcon type="link_off" color="white" />}
					/>
				}

				{props.confirmCompany &&
					<ConfirmCompanyButton
						translate={translate}
						company={company}
						refetch={props.refetch}
					/>
				}
				{props.root &&
					<DeleteCompanyButton
						translate={translate}
						company={company}
					/>
				}
				{company.corporationId !== 1 &&
					<BasicButton
						text={'Añadir administrador'}
						color={primary}
						floatRight
						textStyle={{
							color: "white",
							fontWeight: "700"
						}}
						buttonStyle={{ marginRight: "1.2em" }}
						onClick={() =>
							setState({
								...state,
								addAdminModal: true
							})
						}
					/>
				}
				<AlertConfirm
					requestClose={() => setState({ ...state, unlinkModal: false })}
					open={state.unlinkModal}
					acceptAction={unlinkCompany}
					buttonAccept={translate.accept}
					buttonCancel={translate.cancel}
					bodyText={<div>{translate.companies_unlink}</div>}
					title={translate.edit}
				/>
				<AddAdmin
					open={state.addAdminModal}
					company={company}
					requestClose={() => setState({
						...state,
						addAdminModal: false
					})}
					translate={translate}
				/>
				<AlertConfirm
					requestClose={() => setState({ ...state, fileSizeError: false })}
					open={state.fileSizeError}
					buttonCancel={translate.accept}
					bodyText={<div>{translate.file_exceeds}</div>}
					title={translate.error}
				/>
			</div>
		</CardPageLayout>
	);


}



const AddAdmin = ({ translate, company, open, requestClose }) => {
	const renderBody = () => {
		return (
			<NewUser
				fixedCompany={company}
				translate={translate}
				requestClose={requestClose}
			/>
		)
	}

	return (
		<AlertConfirm
			requestClose={requestClose}
			open={open}
			buttonCancel={translate.accept}
			bodyText={renderBody()}
			title={translate.users_add}
		/>
	)
}

export default compose(
	graphql(info, {
		name: "info",
		options: props => ({
			notifyOnNetworkStatusChange: true
		})
	}),
	graphql(updateCompany, {
		name: "updateCompany",
		options: {
			errorPolicy: "all"
		}
	}),
	graphql(unlinkCompany, {
		name: "unlinkCompany"
	})
)(withApollo(withSharedProps()(CompanySettingsPage)));
