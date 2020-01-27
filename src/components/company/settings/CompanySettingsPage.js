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
	TextInput,
	PaginationFooter,
	Scrollbar,
	Link,
	Checkbox
} from "../../../displayComponents";
import { MenuItem, Icon } from "material-ui";
import withSharedProps from '../../../HOCs/withSharedProps';
import { compose, graphql, withApollo } from "react-apollo";
import { provinces } from "../../../queries/masters";
import { unlinkCompany, updateCompany } from "../../../queries/company";
import { getPrimary, getSecondary, primary } from "../../../styles/colors";
import { bHistory, store, moment } from "../../../containers/App";
import { getCompanies, setCompany } from "../../../actions/companyActions";
import gql from "graphql-tag";
import { toast } from "react-toastify";
import ConfirmCompanyButton from "../../corporation/companies/ConfirmCompanyButton";
import DeleteCompanyButton from "./DeleteCompanyButton";
import { sendGAevent } from "../../../utils/analytics";
import GoverningBodyForm from "./GoverningBodyForm";
import NewUser from "../../corporation/users/NewUser";
import AdminManager from './AdminManager';
import { corporationUsers } from "../../../queries/corporation";

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
				if(!props.organization){
					store.dispatch(setCompany(response.data.updateCompany));
				}
				bHistory.goBack();
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
				bHistory.goBack();
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
					<GridItem xs={12} md={12} lg={12}>
						<TablaUsuarios
							translate={translate}
							client={client}
							companyId={company.id}
							corporationId={company.corporationId}
						/>
					</GridItem>
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

const TablaUsuarios = ({ translate, client, companyId, corporationId }) => {
	const [users, setUsers] = React.useState(false);
	const [usersPage, setUsersPage] = React.useState(1);
	const [usersTotal, setUsersTotal] = React.useState(false);
	const [addAdmins, setAddAdmins] = React.useState(false);
	const [checkedItems, setCheckedItems] = React.useState([]);
	const [state, setState] = React.useState({
		filterTextUsuarios: "",
	});

	const getUsers = async () => {
		const response = await client.query({
			query: companyUsers,
			variables: {
				companyId: companyId,
				options: {
					limit: 20,
					offset: (usersPage - 1) * 20,
					orderDirection: 'DESC'
				},
				filters: [{ field: 'fullName', text: state.filterTextUsuarios }],
			}
		});

		if (response.data.companyUsers.list) {
			setUsers(response.data.companyUsers.list)
			setUsersTotal(response.data.companyUsers.total)
		}
	}

	React.useEffect(() => {
		getUsers()
	}, [state.filterTextUsuarios, usersPage]);


	return (
		<div>
			<div style={{ display: "flex", justifyContent: "flex-end" }}>
				<div style={{ padding: "0.5em", display: "flex", alignItems: "center" }}>
					<BasicButton
						buttonStyle={{ boxShadow: "none", marginRight: "1em", borderRadius: "4px", border: `1px solid ${primary}`, padding: "0.2em 0.4em", marginTop: "5px", color: primary, }}
						backgroundColor={{ backgroundColor: "white" }}
						text={translate.add}
						// Falta añadir usuarios
						onClick={() => setAddAdmins(true)}
					/>

					<div style={{ padding: "0px 8px", fontSize: "24px", color: "#c196c3" }}>
						<i className="fa fa-filter"></i>
					</div>
					<TextInput
						placeholder={translate.search}
						adornment={<Icon style={{ background: "#f0f3f6", paddingLeft: "5px", height: '100%', display: "flex", alignItems: "center", justifyContent: "center" }}>search</Icon>}
						type="text"
						value={state.filterTextUsuarios || ""}
						styleInInput={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.54)", background: "#f0f3f6", marginLeft: "0", paddingLeft: "8px" }}
						disableUnderline={true}
						stylesAdornment={{ background: "#f0f3f6", marginLeft: "0", paddingLeft: "8px" }}
						onChange={event => {
							setState({
								...state,
								filterTextUsuarios: event.target.value
							})
						}}
					/>
				</div>
				<AlertConfirm
					bodyStyle={{ minWidth: '70vw' }}
					requestClose={() => setAddAdmins(false)}
					open={addAdmins}
					bodyText={
						<TablaUsuariosAdmin
							translate={translate}
							client={client}
							corporationId={corporationId}
							companyId={companyId}
							usersCompany={users}
							getUsersCompany={getUsers}
							closeModal={() => setAddAdmins(false)}
						/>
					}
					title={translate.add}
				/>
			</div>
			<div style={{}}>
				<div style={{ fontSize: "13px" }}>
					<div style={{ display: "flex", justifyContent: "space-between", padding: "1em", }}>
						<div style={{ color: getPrimary(), fontWeight: "bold", width: 'calc( 100% / 5 )', textAlign: 'left' }}>
							Estado
				</div>
						<div style={{ color: getPrimary(), fontWeight: "bold", width: 'calc( 100% / 5 )', textAlign: 'left' }}>
							Id
				</div>
						<div style={{ color: getPrimary(), fontWeight: "bold", width: 'calc( 100% / 5 )', textAlign: 'left' }}>
							Nombre
				</div>
						<div style={{ color: getPrimary(), fontWeight: "bold", overflow: "hidden", width: 'calc( 100% / 5 )', textAlign: 'left' }}>
							Email
				</div>
						<div style={{ color: getPrimary(), fontWeight: "bold", overflow: "hidden", width: 'calc( 100% / 5 )', textAlign: 'left' }}>
							Últ.Conexión
				</div>
					</div>
					<div style={{ height: "300px" }}>
						<Scrollbar>
							{users &&
								users.map(item => {
									return (
										<div
											key={item.id}
											style={{
												display: "flex",
												justifyContent: "space-between",
												padding: "1em",
												alignItems: "center"
											}}>
											<Cell text={item.actived} />
											<Cell text={item.id} />
											<Cell text={item.name + " " + item.surname} />
											<Cell text={item.email} />
											<Cell text={item.lastConnectionDate && moment(item.lastConnectionDate).format("LLL")} />
										</div>

									)
								})}
						</Scrollbar>
					</div>
					<Grid style={{ marginTop: "1em" }}>
						<PaginationFooter
							page={usersPage}
							translate={translate}
							length={users.length}
							total={usersTotal}
							limit={10}
							changePage={setUsersPage}
							md={12}
							xs={12}
						/>
					</Grid>
				</div>
			</div>
		</div>
	)
}

const TablaUsuariosAdmin = ({ translate, client, corporationId, companyId, usersCompany, getUsersCompany, closeModal }) => {
	const [users, setUsers] = React.useState(false);
	const [usersPage, setUsersPage] = React.useState(1);
	const [usersTotal, setUsersTotal] = React.useState(false);
	const [state, setState] = React.useState({
		filterTextUsuarios: "",
		checked: [],
	});

	const getUsersModal = async () => {
		const response = await client.query({
			query: corporationUsers,
			variables: {
				filters: [{ field: 'fullName', text: state.filterTextUsuarios }],
				options: {
					limit: 10,
					offset: (usersPage - 1) * 10,
					orderDirection: 'DESC'
				},
				corporationId: corporationId
			}
		});

		let filtrado = response.data.corporationUsers.list.filter(comparer(usersCompany));
		if (response.data.corporationUsers.list) {
			setUsers(filtrado)
			setUsersTotal(response.data.corporationUsers.total)
		}
	}

	const comparer = (otherArray) => {
		return function (current) {
			return otherArray.filter(function (other) {
				return (other.id == current.id)
			}).length == 0;
		}
	}

	React.useEffect(() => {
		getUsersModal()
	}, [state.filterTextUsuarios, usersPage, usersCompany]);

	const saveUsersInCompany = async () => {
		const response = await client.mutate({
			mutation: linkCompanyUsers,
			variables: {
				companyTin: companyId,
				usersIds: state.checked.map(check => check.id),
			}
		});
		getUsersCompany();
	}


	const checkUser = (user, check) => {
		let checked = [...state.checked];
		if (check) {
			checked = [...checked, user];
		} else {
			const index = checked.findIndex(item => item.id === user.id);
			checked.splice(index, 1);
		}
		setState({
			...state,
			checked: checked
		});
	}

	const isChecked = (id) => {
		const item = state.checked.find(item => item.id === id);
		return !!item;
	}

	return (
		<div>
			<div style={{ display: "flex", justifyContent: "flex-end" }}>
				<div style={{ padding: "0.5em", display: "flex", alignItems: "center" }}>
					<div style={{ padding: "0px 8px", fontSize: "24px", color: "#c196c3" }}>
						<i className="fa fa-filter"></i>
					</div>
					<TextInput
						placeholder={translate.search}
						adornment={<Icon style={{ background: "#f0f3f6", paddingLeft: "5px", height: '100%', display: "flex", alignItems: "center", justifyContent: "center" }}>search</Icon>}
						type="text"
						value={state.filterTextUsuarios || ""}
						styleInInput={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.54)", background: "#f0f3f6", marginLeft: "0", paddingLeft: "8px" }}
						disableUnderline={true}
						stylesAdornment={{ background: "#f0f3f6", marginLeft: "0", paddingLeft: "8px" }}
						onChange={event => {
							setState({
								...state,
								filterTextUsuarios: event.target.value
							})
						}}
					/>
				</div>
			</div>
			<div style={{}}>
				<div style={{ fontSize: "13px" }}>
					<div style={{ display: "flex", justifyContent: "space-between", padding: "1em", }}>
						<div style={{ color: getPrimary(), fontWeight: "bold", width: '3em', textAlign: 'left' }}></div>
						<div style={{ color: getPrimary(), fontWeight: "bold", width: 'calc( 100% / 5 )', textAlign: 'left' }}>
							Estado
				</div>
						<div style={{ color: getPrimary(), fontWeight: "bold", width: 'calc( 100% / 5 )', textAlign: 'left' }}>
							Id
				</div>
						<div style={{ color: getPrimary(), fontWeight: "bold", width: 'calc( 100% / 5 )', textAlign: 'left' }}>
							Nombre
				</div>
						<div style={{ color: getPrimary(), fontWeight: "bold", overflow: "hidden", width: 'calc( 100% / 5 )', textAlign: 'left' }}>
							Email
				</div>
						<div style={{ color: getPrimary(), fontWeight: "bold", overflow: "hidden", width: 'calc( 100% / 5 )', textAlign: 'left' }}>
							Últ.Conexión
				</div>
					</div>
					<div style={{ height: "300px" }}>
						<Scrollbar>
							{users &&
								users.map(item => {
									return (
										<div
											key={item.id}
											style={{
												display: "flex",
												justifyContent: "space-between",
												padding: "1em",
												alignItems: "center"
											}}>
											<Cell
												styles={{ width: '3em' }}
												text={
													<Checkbox
														value={isChecked(item.id)}
														onChange={(event, isInputChecked) => {
															checkUser(item, isInputChecked)
														}}
													/>
												}
											/>
											<Cell text={item.actived} />
											<Cell text={item.id} />
											<Cell text={item.name + " " + item.surname} />
											<Cell text={item.email} />
											<Cell text={item.lastConnectionDate && moment(item.lastConnectionDate).format("LLL")} />
										</div>

									)
								})}
						</Scrollbar>
					</div>
					<Grid style={{ marginTop: "1em" }}>
						<PaginationFooter
							page={usersPage}
							translate={translate}
							length={users.length}
							total={usersTotal}
							limit={10}
							changePage={setUsersPage}
							md={12}
							xs={12}
						/>
					</Grid>
				</div>
			</div>
			<div style={{
				display: "flex",
				justifyContent: "flex-end",
				paddingRight: '0.6em',
				borderTop: '1px solid gainsboro',
				paddingTop: '0.5em',
				marginTop: "2em"
			}}>
				<BasicButton
					text={translate.cancel}
					onClick={() => closeModal()}
					textStyle={{
						textTransform: "none",
						fontWeight: "700",
					}}
					primary={true}
					color='transparent'
					type="flat"
				/>
				<BasicButton
					text={translate.add}
					onClick={() => saveUsersInCompany()}
					textStyle={{
						color: "white",
						textTransform: "none",
						fontWeight: "700"
					}}
					buttonStyle={{ marginLeft: "1em" }}
					color={primary}
				/>
			</div>
		</div>
	)
}

const Cell = ({ text, width, styles }) => {
	return (
		<div style={{ overflow: "hidden", width: width ? `calc( 100% / ${width})` : 'calc( 100% / 5 )', textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: "10px", ...styles }}>
			{text}
		</div>
	)
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
const linkCompanyUsers = gql`
    mutation linkCompanyUsers($companyTin: String!, $usersIds: [Int]){
        linkCompanyUsers(companyTin: $companyTin, usersIds: $usersIds){
            success
            message
        }
    }
`;


const companyUsers = gql`
query CompanyUsers($companyId: Int!, $filters: [FilterInput], $options: OptionsInput,) {
	companyUsers(companyId: $companyId, filters: $filters, options: $options,) {
		list {
			id
			name
			surname
			actived
			email
			lastConnectionDate
		}
		total
	}
}
`;


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
