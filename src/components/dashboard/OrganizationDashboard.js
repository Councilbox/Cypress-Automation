


import React from "react";
import {
	Grid,
	GridItem,
	BasicButton,
	Scrollbar,
	TextInput,
	LoadingSection,
	PaginationFooter,
	DropDownMenu,
	MenuItem,
} from "../../displayComponents";
import { ConfigContext } from '../../containers/AppControl';
import { moment, bHistory } from "../../containers/App";
import { Avatar } from "antd";
import { primary, getPrimary } from "../../styles/colors";
import Calendar from 'react-calendar';
import { Icon, withStyles, Divider, } from "material-ui";
import { Doughnut, Chart } from "react-chartjs-2";
import { corporationUsers } from "../../queries/corporation";
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import GraficaEstadisiticas from "./GraficaEstadisiticas";
import { sendGAevent } from "../../utils/analytics";
import { getActivationText } from "../company/settings/CompanySettingsPage";
import { isMobile } from "../../utils/screen";
import OneOnOneItem from "./OneOnOne/OneOnOneItem";
import { usePolling } from "../../hooks";
import ImportOneOneOne from "./OneOnOne/ImportOneOnOne";


const styles = {
	'input': {
		'&::placeholder': {
			textOverflow: 'ellipsis !important',
			color: '#0000005c'
		}
	},
};

const DEFAULT_OPTIONS = {
	limit: 10,
	offset: 0,
	orderDirection: 'DESC'
}

const corporationCompanies = gql`
    query corporationCompanies($filters: [FilterInput], $options: OptionsInput, $corporationId: Int!){
        corporationCompanies(filters: $filters, options: $options, corporationId: $corporationId){
            list{
                id
                businessName
                logo
            }
            total
        }
    }
`;


const OrganizationDashboard = ({ translate, company, user, client, setAddUser, setEntidades, ...props }) => {
	const [users, setUsers] = React.useState(false);
	const [usersPage, setUsersPage] = React.useState(1);
	const [usersTotal, setUsersTotal] = React.useState(false);
	const [companies, setCompanies] = React.useState(false);
	const [companiesPage, setCompaniesPage] = React.useState(1);
	const [companiesTotal, setCompaniesTotal] = React.useState(false);
	const [reuniones, setReuniones] = React.useState(false);
	const [reunionesPorDia, setReunionesPorDia] = React.useState([]);
	const [day, setDay] = React.useState(false);
	const [daySelected, setDaySelected] = React.useState(new Date());
	const [reunionesPage, setReunionesPage] = React.useState(1);
	const [reunionesLoading, setReunionesLoading] = React.useState(true);
	const [inputSearch, setInputSearch] = React.useState(false);
	const [inputSearchE, setInputSearchE] = React.useState(false);
	const [toggleReunionesCalendario, setToggleReunionesCalendario] = React.useState(translate.councils_link);
	const [filterReuniones, setFilterReuniones] = React.useState(translate.all);
	const [state, setState] = React.useState({
		filterTextCompanies: "",
		filterTextUsuarios: "",
		filterFecha: ""
	});
	const [porcentajes, setPorcentajes] = React.useState({
		convocadaPorcentaje: 0,
		celebracionPorcentaje: 0,
		redActaPorcentaje: 0,
	});
	const [fechaBusqueda, setFechaBusqueda] = React.useState(moment().startOf('month').toDate());
	const [usuariosEntidades, setUsuariosEntidades] = React.useState(translate.users);
	const primary = getPrimary();
	const config = React.useContext(ConfigContext);
	const [pageReuniones, setPageReuniones] = React.useState(1);
	const [ReunionesTotal, setReunionesTotal] = React.useState(false);
	const [totalReunionPorDia, setTotalReunionPorDia] = React.useState(false);


	const companyHasBook = () => {
		return company.category === 'society';
	}

	const getTileClassName = ({ date }) => {
		if (reuniones.length > 0) {
			let array = reuniones.find(reunion => {
				return moment(reunion.dateStart).format("MMM Do YY") === moment(date).format("MMM Do YY");
			})
			if (array) {
				return 'selectedDate';
			}
		}
		return '';
	}

	const getUsers = async () => {
		const response = await client.query({
			query: corporationUsers,
			variables: {
				filters: [{ field: 'fullName', text: state.filterTextUsuarios }],
				options: {
					limit: 10,
					offset: (usersPage - 1) * 10,
					orderDirection: 'DESC'
				},
				corporationId: company.id
			}
		});

		if (response.data.corporationUsers.list) {
			setUsers(response.data.corporationUsers.list)
			setUsersTotal(response.data.corporationUsers.total)
		}
	}

	const getCompanies = async () => {
		const response = await client.query({
			query: corporationCompanies,
			variables: {
				filters: [{ field: 'businessName', text: state.filterTextCompanies }],
				options: {
					limit: 10,
					offset: (companiesPage - 1) * 10,
					orderDirection: 'DESC'
				},
				corporationId: company.id
			}
		});

		if (response.data.corporationCompanies.list) {
			setCompanies(response.data.corporationCompanies.list)
			setCompaniesTotal(response.data.corporationCompanies.total)
		}
	}

	const changePageUsuarios = value => {
		setUsersPage(value)
	}

	const changePageCompanies = value => {
		setCompaniesPage(value)
	}

	const changePageReuniones = value => {
		reunionesPage(value)
	}


	React.useEffect(() => {
		if (!config.oneOnOneDashboard || company.id === company.corporationId) {
			if (usuariosEntidades === translate.users) {
				getUsers();
			} else {
				getCompanies();
			}
		}
	}, [company.id, state.filterTextUsuarios, state.filterTextCompanies, usuariosEntidades, usersPage, companiesPage]);



	const getReuniones = async (fechaInicio, fechaFin, fechaReunionConcreta) => {

		//setReunionesLoading(true)
		const response = await client.query({
			query: corporationConvenedLiveCouncils,
			variables: {
				fechaInicio: fechaInicio ? fechaFin : moment().endOf('month').toDate(),
				fechaFin: fechaFin ? fechaInicio : moment().startOf('month').toDate(),
				corporationId: company.id,
				options: {
					orderBy: 'dateStart',
					limit: 10,
					offset: (pageReuniones - 1) * 10,
				}
			}
		});
		let data = "";
		
		if (fechaInicio && fechaFin) {
			if (response.data.corporationConvenedLiveCouncils.list) {
				data = [...response.data.corporationConvenedLiveCouncils.list].sort((a, b) => {
					if (a.dateStart < b.dateStart) {
						return -1;
					}
					if (a.dateStart > b.dateStart) {
						return 1;
					}
					return 0;
				});
				if (filterReuniones !== translate.all) {
					data = filtrarLasReuniones(data);
				}
				setReunionesPorDia(data);
				setTotalReunionPorDia(response.data.corporationConvenedLiveCouncils.total);
				setReunionesLoading(false);
			}
		} else {
			if (response.data.corporationConvenedLiveCouncils.list) {
				data = [...response.data.corporationConvenedLiveCouncils.list].sort((a, b) => {
					if (a.dateStart < b.dateStart) {
						return -1;
					}
					if (a.dateStart > b.dateStart) {
						return 1;
					}
					return 0;
				});;

				if (filterReuniones !== translate.all) {
					data = filtrarLasReuniones(data);
				}
				setReuniones(data);
				setReunionesTotal(response.data.corporationConvenedLiveCouncils.total);
				
				setPorcentajes({
					convocadaPorcentaje: response.data.corporationConvenedLiveCouncils.preparing,
					celebracionPorcentaje: response.data.corporationConvenedLiveCouncils.roomOpened,
					redActaPorcentaje: response.data.corporationConvenedLiveCouncils.saved,
					max: response.data.corporationConvenedLiveCouncils.max
				})
				setReunionesLoading(false);
			}
		}

	}

	usePolling(getReuniones, 12000);

	const filtrarLasReuniones = (data) => {
		let dataFiltrado = []
		data.map((item, index) => {
			if (filterReuniones === translate.companies_calendar) {
				if (item.state === 5 || item.state === 10) {
					dataFiltrado.push(item);
				}
			}
			if (filterReuniones === translate.companies_live) {
				if (item.state === 20 || item.state === 30) {
					dataFiltrado.push(item);
				}
			}
			if (filterReuniones === translate.companies_writing) {
				if (item.state === 40) {
					dataFiltrado.push(item);
				}
			}
			if (filterReuniones === 'withoutAttachments') {
				if (!item.attachments || (item.attachments && item.attachments.length === 0)) {
					dataFiltrado.push(item);
				}
			}
		})
		return dataFiltrado;
	}

	React.useEffect(() => {
		getReuniones()
	}, [company.id, state.filterFecha, filterReuniones, pageReuniones, daySelected]);


	const hasBook = companyHasBook();

	const clickDay = (value) => {
		let fechaInicio = value
		let fechaFin = moment(value).add(24, 'hours');
		if (String(fechaInicio) === String(day)) {
			setDay(false)
		} else {
			setDay(value)
		}

		getReuniones(fechaInicio, fechaFin.toDate(), true)
	}

	const changeMonthBack = () => {
		setDay(false)
		let fechaInicio = moment(fechaBusqueda).subtract(1, 'months').startOf('month');
		let fechaFin = moment(fechaBusqueda).subtract(1, 'months').endOf('month');
		getReuniones(fechaInicio.toDate(), fechaFin.toDate())
		setFechaBusqueda(fechaInicio)
	}
	const changeMonthFront = () => {
		setDay(false)
		let fechaInicio = moment(fechaBusqueda).add(1, 'months').startOf('month');
		let fechaFin = moment(fechaBusqueda).add(1, 'months').endOf('month');
		getReuniones(fechaInicio.toDate(), fechaFin.toDate())
		setFechaBusqueda(fechaInicio)
	}

	const onChangeDay = (date) => {
		if (String(date) === String(day)) {
			setDaySelected(new Date('01/01/1970'))
			setDay(false)
		} else {
			setDay(date)
			setDaySelected(date)
		}
	}

	if (isMobile) {
		return (
			<div style={{ width: "100%", height: "100%" }}>
				<div style={{
					width: "100%",
					padding: "1em",
					background: "white",
					borderRadius: "5px",
					height: "100%",
					boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)",
					marginBottom: "0.5em"
				}}>
					<div style={{
						display: "flex",
						justifyContent: "space-between",
						alignContent: "center",
						marginBottom: "0.3em"
					}}>
						{config.oneOnOneDashboard ?
							<div style={{ marginBottom: "1em", fontWeight: 'bold', color: "#a09b9e" }}>Citas en curso</div>
							:
							<div style={{ marginBottom: "1em", fontWeight: 'bold', color: "#a09b9e" }}>Reuniones en curso</div>
						}
						<div style={{
							display: "flex",
							alignContent: "inherit",
							justifyContent: "center"
						}}
						>
							<div style={{ color: "#c196c3", fontSize: "13px", marginRight: "0.5em", display: 'flex', alignItems: 'center' }}>
								<DropDownMenu
									color={'white'}
									loading={false}
									// // {...(!!Component ? (Component = { Component }) : {})}
									text={<span style={{ color: "#c196c3", }} >{filterReuniones}</span>}
									textStyle={{ fontWeight: 'bold', color: "#c196c3", boxShadow: "none", padding: "0", margin: "0", minWidth: "0" }}
									// icon={<ButtonIcon type="add" color="white" />}
									backgroundColor={{ color: "#a09b9e" }}
									anchorOrigin={{
										vertical: 'bottom',
										horizontal: 'left',
									}}
									items={
										<React.Fragment>
											<MenuItem onClick={() => setFilterReuniones(translate.all)} >
												<div
													style={{
														width: "100%",
														display: "flex",
														flexDirection: "row",
														justifyContent: "space-between",
														color: "#c196c3",
														fontWeight: "bold"
													}}
												>
													{translate.all}
												</div>
											</MenuItem>
											<Divider />
											<MenuItem onClick={() => setFilterReuniones(translate.companies_calendar)} >
												<div
													style={{
														width: "100%",
														display: "flex",
														flexDirection: "row",
														justifyContent: "space-between",
														color: "#c196c3",
														fontWeight: "bold"
													}}
												>
													{translate.companies_calendar}
												</div>
											</MenuItem>
											<Divider />
											<MenuItem onClick={() => setFilterReuniones(translate.companies_live)}>
												<div
													style={{
														width: "100%",
														display: "flex",
														flexDirection: "row",
														justifyContent: "space-between",
														color: "#c196c3",
														fontWeight: "bold"
													}}
												>
													{translate.companies_live}
												</div>
											</MenuItem>
											<Divider />
											<MenuItem onClick={() => setFilterReuniones(translate.companies_writing)}>
												<div
													style={{
														width: "100%",
														display: "flex",
														flexDirection: "row",
														justifyContent: "space-between",
														color: "#c196c3",
														fontWeight: "bold"
													}}
												>
													{translate.companies_writing}
												</div>
											</MenuItem>
										</React.Fragment>
									}
								/>
							</div>
							<div style={{ color: "#c196c3", marginRight: "0.5em", display: 'flex', alignItems: 'center' }}>
								<i className="fa fa-filter" ></i>
							</div>
							{toggleReunionesCalendario === translate.councils_link ?
								<div style={{ position: "relative", color: "black", display: 'flex', alignItems: 'center' }} onClick={() => setToggleReunionesCalendario("calendario")} >
									<i className={'fa fa-calendar-o'} style={{ position: "relative", fontSize: "18px" }}></i>
									<i className={'fa fa-clock-o'} style={{ position: "relative", left: "-5px", bottom: "-5px" }}></i>
								</div>
								:
								<div style={{ color: "black", fontSize: "18px", display: 'flex', alignItems: 'center' }} onClick={() => setToggleReunionesCalendario(translate.councils_link)} >
									<i className={"fa fa-list"}></i>
								</div>
							}
						</div>
					</div>
					{toggleReunionesCalendario === translate.councils_link ?
						<div style={{ height: "20em" }}>
							<Scrollbar>
								{day ?
									reunionesPorDia.length === undefined || reunionesLoading ?
										<LoadingSection />
										: <div>
											{reunionesPorDia.map((item, index) => {
												return (
													<TablaReunionesEnCurso
														key={index + "_reunionesPorDia"}
														item={item}
														index={index}
														translate={translate}
													/>
												)
											})
											}

											<Grid style={{ marginTop: "1em" }}>
												<PaginationFooter
													page={pageReuniones}
													translate={translate}
													length={reunionesPorDia.length}
													total={totalReunionPorDia}
													limit={10}
													changePage={setPageReuniones}
												/>
											</Grid>
										</div>
									:
									reuniones.length === undefined || reunionesLoading ?
										<LoadingSection />
										:
										<div>
											{reuniones.map((item, index) => {
												return (
													<TablaReunionesEnCurso
														key={index + "_reuniones"}
														item={item}
														index={index}
														translate={translate}
													/>
												)
											})}
											<Grid style={{ marginTop: "1em" }}>
												<PaginationFooter
													page={pageReuniones}
													translate={translate}
													length={reuniones.length}
													total={ReunionesTotal}
													limit={10}
													changePage={setPageReuniones}
												/>
											</Grid>

										</div>
								}
							</Scrollbar>
						</div>
						:
						<div style={{ padding: "1em", display: 'flex', justifyContent: "center" }}>
							{reuniones.length === undefined ?
								<LoadingSection />
								:
								<Calendar
									showNeighboringMonth={false}
									prevLabel={
										<div style={{}} onClick={changeMonthBack}>
											<i className="fa fa-angle-left" ></i>
										</div>
									}
									nextLabel={
										<div style={{}} onClick={changeMonthFront}>
											<i className="fa fa-angle-right" >
											</i>
										</div>
									}
									onChange={onChangeDay}
									value={daySelected}
									minDetail={'month'}
									tileClassName={date => getTileClassName(date)}
									onClickDay={(value) => clickDay(value)}
								/>
							}
						</div>
					}
				</div>
				<div style={{
					width: "100%",
					padding: "1em",
					background: "white",
					borderRadius: "5px",
					height: "100%",
					boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)",
					marginBottom: "0.5em"
				}}>
					{reuniones.length === undefined ?
						<LoadingSection />
						:
						<div>
							<Grid>
								<GridItem xs={4} md={6} lg={4}>
									<div style={{ width: '100%', }}>
										<GraficaDoughnut
											porcentaje={porcentajes.convocadaPorcentaje || 0}
											color={'#e77153'}
											max={porcentajes.max}
										/>
									</div>
								</GridItem>
								<GridItem xs={4} md={6} lg={4}>
									<div style={{ width: '100%', }}>
										<GraficaDoughnut
											porcentaje={porcentajes.celebracionPorcentaje || 0}
											color={'#e77153'}
											max={porcentajes.max}
										/>
									</div>
								</GridItem>
								<GridItem xs={4} md={6} lg={4}>
									<div style={{ width: '100%', }}>
										<GraficaDoughnut
											porcentaje={porcentajes.redActaPorcentaje || 0}
											color={'#85a9ca'}
											max={porcentajes.max}
										/>
									</div>
								</GridItem>
							</Grid>
							<div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: '3em', padding: '1em' }}>
								<GraficaEstadisiticas
									porcentaje={'75'}
									color={'#85a9ca'}
								/>
							</div>
						</div>
					}
				</div>
				{!config.oneOnOneDashboard &&
					<div style={{
						width: "100%",
						padding: "1em",
						background: "white",
						borderRadius: "5px",
						height: "100%",
						boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)",
					}}>
						<div style={{
							display: "flex",
							justifyContent: "space-between",
							alignContent: "center",
							marginBottom: "0.3em"
						}}>
							<div style={{ fontWeight: 'bold', color: "#a09b9e", display: 'flex', alignItems: 'center' }}>{usuariosEntidades === translate.users ? translate.users : translate.entities}</div>
							<div style={{
								display: "flex",
								alignContent: "inherit",
								justifyContent: "center"
							}}
							>
								{/* <div style={{ color: "#c196c3", fontSize: "13px", marginRight: "0.5em", display: 'flex', alignItems: 'center' }}>{translate.connecteds}</div> */}
								<div style={{ color: "#c196c3", marginRight: "0.5em", display: 'flex', alignItems: 'center' }}>
									<i className="fa fa-filter" ></i>
								</div>
								{usuariosEntidades === translate.users ?
									<TextInput
										className={isMobile && !inputSearch ? "openInput" : ""}
										disableUnderline={true}
										styleInInput={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.54)", background: "#f0f3f6", padding: isMobile && inputSearch && "4px 5px", paddingLeft: !isMobile && "5px", marginTop: '0px' }}
										stylesAdornment={{ background: "#f0f3f6", marginLeft: "0", paddingLeft: isMobile && inputSearch ? "8px" : "4px" }}
										floatingText={" "}
										adornment={<Icon onClick={() => setInputSearch(!inputSearch)} style={{ background: "#f0f3f6", paddingLeft: "5px", height: '100%', display: "flex", alignItems: "center", justifyContent: "center" }}>search</Icon>}
										type="text"
										styles={{ marginTop: '-16px', marginBottom: "-8px" }}
										value={state.filterTextUsuarios || ""}
										onChange={event => {
											setState({
												...state,
												filterTextUsuarios: event.target.value
											})
										}}
									/>
									:
									<TextInput
										className={isMobile && !inputSearchE ? "openInput" : ""}
										disableUnderline={true}
										styleInInput={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.54)", background: "#f0f3f6", padding: isMobile && inputSearch && "4px 5px", paddingLeft: !isMobile && "5px" }}
										stylesAdornment={{ background: "#f0f3f6", marginLeft: "0", paddingLeft: isMobile && inputSearch ? "8px" : "4px" }}
										floatingText={" "}
										styles={{ marginTop: '-16px', marginBottom: "-8px" }}
										adornment={<Icon onClick={() => setInputSearchE(!inputSearchE)} style={{ background: "#f0f3f6", paddingLeft: "5px", height: '100%', display: "flex", alignItems: "center", justifyContent: "center" }}>search</Icon>}
										type="text"
										value={state.filterTextCompanies || ""}
										onChange={event => {
											setState({
												...state,
												filterTextCompanies: event.target.value
											})
										}}
									/>
								}
							</div>
						</div>
						<Grid style={{ justifyContent: "space-between", alignItems: "center" }}>
							<GridItem xs={6} md={6} lg={4} style={{ display: "flex" }}>
								<div style={{ height: "100%", fontWeight: "bold", padding: "0.5em", display: "flex", borderRadius: "5px", boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)", }}>
									<div style={{
										cursor: "pointer",
										paddingRight: "0.5em",
										color: usuariosEntidades === translate.users ? primary : "#9f9a9d",
										borderRight: "1px solid gainsboro"
									}}
										onClick={() => setUsuariosEntidades(translate.users)}
									>
										{translate.users}
									</div>
									<div
										style={{
											cursor: "pointer",
											paddingLeft: "0.5em",
											color: usuariosEntidades === translate.entities ? primary : "#9f9a9d"
										}}
										onClick={() => setUsuariosEntidades(translate.entities)}
									>
										{translate.entities}
									</div>
								</div>
							</GridItem>
							<GridItem xs={6} md={6} lg={8} style={{ display: 'flex', justifyContent: "flex-end" }}>
								<div style={{ display: "flex", alignItems: "center" }}>
									{usuariosEntidades === translate.users ?
										<BasicButton
											buttonStyle={{ boxShadow: "none", borderRadius: "4px", border: `1px solid ${primary}`, padding: "0.2em 0.4em", marginTop: "5px", color: primary, }}
											backgroundColor={{ backgroundColor: "white" }}
											text={translate.add}
											onClick={() => setAddUser(true)}
										/>
										:
										<BasicButton
											buttonStyle={{ boxShadow: "none", borderRadius: "4px", border: `1px solid ${primary}`, padding: "0.2em 0.4em", marginTop: "5px", color: primary, }}
											backgroundColor={{ backgroundColor: "white" }}
											text={translate.add}
											onClick={() => setEntidades(true)}
										/>
									}

								</div>
							</GridItem>
						</Grid>
						<div style={{}}>
							{usuariosEntidades === translate.users ?
								users.length === undefined ?
									<LoadingSection />
									:
									<TablaUsuarios
										users={users}
										translate={translate}
										total={usersTotal}
										changePageUsuarios={changePageUsuarios}
										usersPage={usersPage}
									/>
								:
								companies.length === undefined ?
									<LoadingSection />
									:
									<TablaCompanies
										companies={companies}
										translate={translate}
										total={companiesTotal}
										changePageCompanies={changePageCompanies}
										companiesPage={companiesPage}
									/>
							}
						</div>
					</div>
				}

			</div>
		);
	}

	return (
		<div style={{ width: "100%" }}>
			<Grid style={{
				padding: "1em",
			}}>
				<Grid style={{
					background: "white",
					boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)",
					padding: "1em",
					borderRadius: "5px",
					textAlign: "left",
					overflow: "hidden"
				}}>
					<GridItem xs={8} md={8} lg={8} style={{ overflow: "hidden" }}>
						{config.oneOnOneDashboard ?
							<div style={{ marginBottom: "1em", fontWeight: 'bold', color: "#a09b9e" }}>Citas en curso</div>
							:
							<div style={{ marginBottom: "1em", fontWeight: 'bold', color: "#a09b9e" }}>Reuniones en curso</div>
						}
						{config.oneOnOneDashboard &&
							<div style={{ display: "flex", alignItems: "center", marginBottom: "1em" }}>
								<div style={{ display: "flex", marginRight: "1em" }}>
									<BasicButton
										text="Ver documentaciones pendientes"
										onClick={() => setFilterReuniones('withoutAttachments')}
										backgroundColor={{
											fontSize: "12px",
											fontStyle: "Lato",
											fontWeight: 'bold',
											color: filterReuniones === 'withoutAttachments' ? 'white' : primary,
											backgroundColor: filterReuniones === 'withoutAttachments' ? primary : 'white',
											borderRadius: '4px',
											boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)'
										}}
									/>
								</div>
								<div>
									<BasicButton
										text="Ver todas las citas"
										onClick={() => setFilterReuniones(translate.all_plural)}
										backgroundColor={{
											fontSize: "12px",
											fontStyle: "Lato",
											fontWeight: 'bold',
											color: filterReuniones === translate.all_plural ? 'white' : primary,
											backgroundColor: filterReuniones === translate.all_plural ? primary : 'white',
											borderRadius: '4px',
											boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)'
										}}
									/>
								</div>
								<div style={{ marginLeft: "1em" }}>
									<ImportOneOneOne
										company={company}
										translate={translate}
									/>
								</div>
							</div>
						}
						<Grid style={{ overflow: "hidden", height: `calc(90% - ${config.oneOnOneDashboard ? '4em' : '0px'})` }}>
							<Scrollbar>
								{day ?
									reunionesPorDia.length === undefined || reunionesLoading ?
										<LoadingSection />
										: <div>
											{reunionesPorDia.map((item, index) => {
												return (
													<TablaReunionesEnCurso
														key={index + "_reunionesPorDia"}
														item={item}
														index={index}
														translate={translate}
													/>
												)
											})
											}

											<Grid style={{ marginTop: "1em" }}>
												<PaginationFooter
													page={pageReuniones}
													translate={translate}
													length={reunionesPorDia.length}
													total={totalReunionPorDia}
													limit={10}
													changePage={setPageReuniones}
												/>
											</Grid>
										</div>
									:
									reuniones.length === undefined || reunionesLoading ?
										<LoadingSection />
										:
										<div>
											{reuniones.map((item, index) => {
												return (
													<TablaReunionesEnCurso
														key={index + "_reuniones"}
														item={item}
														index={index}
														translate={translate}
													/>
												)
											})}
											<Grid style={{ marginTop: "1em" }}>
												<PaginationFooter
													page={pageReuniones}
													translate={translate}
													length={reuniones.length}
													total={ReunionesTotal}
													limit={10}
													changePage={setPageReuniones}
												/>
											</Grid>

										</div>
								}
							</Scrollbar>
						</Grid>
					</GridItem>
					<GridItem xs={4} md={4} lg={4}>
						<div style={{ padding: "1em", display: 'flex', justifyContent: "center" }}>
							{reuniones.length === undefined ?
								<LoadingSection />
								:
								<Calendar
									showNeighboringMonth={false}
									prevLabel={
										<div style={{}} onClick={changeMonthBack}>
											<i className="fa fa-angle-left" ></i>
										</div>
									}
									nextLabel={
										<div style={{}} onClick={changeMonthFront}>
											<i className="fa fa-angle-right" >
											</i>
										</div>
									}
									onChange={onChangeDay}
									value={daySelected}
									minDetail={'month'}
									tileClassName={date => getTileClassName(date)}
									onClickDay={(value) => clickDay(value)}
								/>
							}
						</div>
					</GridItem>
				</Grid>
				<Grid
					style={{
						marginTop: '2em',
						display: "flex",
						justifyContent: 'space-between'
					}}>
					<GridItem
						xs={(!config.oneOnOneDashboard || company.id === company.corporationId) ? 4 : 12}
						xs={(!config.oneOnOneDashboard || company.id === company.corporationId) ? 4 : 12}
						xs={(!config.oneOnOneDashboard || company.id === company.corporationId) ? 4 : 12}
						style={{
							background: "white",
							boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)",
							padding: "1em",
							borderRadius: "5px"
						}}>
						{reuniones.length === undefined ?
							<LoadingSection />
							:
							<div>
								<Grid>
									<GridItem xs={12} md={6} lg={4}>
										<div style={{ color: "black", marginBottom: "1em" }}>{translate.companies_calendar}</div>
										<div style={{ width: '100%', }}>
											<GraficaDoughnut
												porcentaje={porcentajes.convocadaPorcentaje || 0}
												color={'#e77153'}
												max={porcentajes.max}
											/>
										</div>
									</GridItem>
									<GridItem xs={12} md={6} lg={4}>
										<div style={{ color: "black", marginBottom: "1em" }}>{translate.companies_live}</div>
										<div style={{ width: '100%', }}>
											<GraficaDoughnut
												porcentaje={porcentajes.celebracionPorcentaje || 0}
												color={'#e77153'}
												max={porcentajes.max}
											/>
										</div>
									</GridItem>
									<GridItem xs={12} md={6} lg={4}>
										<div style={{ color: "black", marginBottom: "1em" }}>{translate.companies_writing}</div>
										<div style={{ width: '100%', }}>
											<GraficaDoughnut
												porcentaje={porcentajes.redActaPorcentaje || 0}
												color={'#85a9ca'}
												max={porcentajes.max}
											/>
										</div>
									</GridItem>
								</Grid>
								<div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: '3em' }}>
									<GraficaEstadisiticas
										porcentaje={'75'}
										color={'#85a9ca'}
									/>
								</div>
							</div>
						}
					</GridItem>
					{(!config.oneOnOneDashboard || company.id === company.corporationId) &&
						<GridItem xs={7} md={7} lg={7} style={{
							background: "white",
							boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)",
							padding: "1em",
							borderRadius: "5px"
						}}>
							<Grid style={{ justifyContent: "space-between", alignItems: "center" }}>
								<GridItem xs={12} md={6} lg={4} style={{ display: "flex" }}>
									<div style={{ height: "100%", fontWeight: "bold", padding: "0.5em", display: "flex", borderRadius: "5px", boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)", }}>
										<div style={{
											cursor: "pointer",
											paddingRight: "0.5em",
											color: usuariosEntidades === translate.users ? primary : "#9f9a9d",
											borderRight: "1px solid gainsboro"
										}}
											onClick={() => setUsuariosEntidades(translate.users)}
										>
											{translate.users}
										</div>
										<div
											style={{
												cursor: "pointer",
												paddingLeft: "0.5em",
												color: usuariosEntidades === translate.entities ? primary : "#9f9a9d"
											}}
											onClick={() => setUsuariosEntidades(translate.entities)}
										>
											{translate.entities}
										</div>
									</div>
								</GridItem>
								<GridItem xs={12} md={6} lg={8} style={{ display: 'flex', justifyContent: "flex-end" }}>
									<div style={{ padding: "0.5em", display: "flex", alignItems: "center" }}>
										{usuariosEntidades === translate.users ?
											<BasicButton
												buttonStyle={{ boxShadow: "none", marginRight: "1em", borderRadius: "4px", border: `1px solid ${primary}`, padding: "0.2em 0.4em", marginTop: "5px", color: primary, }}
												backgroundColor={{ backgroundColor: "white" }}
												text={translate.add}
												onClick={() => setAddUser(true)}
											/>
											:
											<BasicButton
												buttonStyle={{ boxShadow: "none", marginRight: "1em", borderRadius: "4px", border: `1px solid ${primary}`, padding: "0.2em 0.4em", marginTop: "5px", color: primary, }}
												backgroundColor={{ backgroundColor: "white" }}
												text={translate.add}
												onClick={() => setEntidades(true)}
											/>
										}

										<div style={{ padding: "0px 8px", fontSize: "24px", color: "#c196c3" }}>
											<i className="fa fa-filter"></i>
										</div>
										{usuariosEntidades === translate.users ?
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
											:
											<TextInput
												placeholder={translate.search}
												adornment={<Icon style={{ background: "#f0f3f6", paddingLeft: "5px", height: '100%', display: "flex", alignItems: "center", justifyContent: "center" }}>search</Icon>}
												type="text"
												value={state.filterTextCompanies || ""}
												styleInInput={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.54)", background: "#f0f3f6", marginLeft: "0", paddingLeft: "8px" }}
												disableUnderline={true}
												stylesAdornment={{ background: "#f0f3f6", marginLeft: "0", paddingLeft: "8px" }}
												onChange={event => {
													setState({
														...state,
														filterTextCompanies: event.target.value
													})
												}}
											/>
										}
									</div>
								</GridItem>
							</Grid>
							<div style={{}}>
								{usuariosEntidades === translate.users ?
									users.length === undefined ?
										<LoadingSection />
										:
										<TablaUsuarios
											users={users}
											translate={translate}
											total={usersTotal}
											changePageUsuarios={changePageUsuarios}
											usersPage={usersPage}
										/>
									:
									companies.length === undefined ?
										<LoadingSection />
										:
										<TablaCompanies
											companies={companies}
											translate={translate}
											total={companiesTotal}
											changePageCompanies={changePageCompanies}
											companiesPage={companiesPage}
										/>
								}
							</div>
						</GridItem>
					}

				</Grid>

			</Grid>
		</div>
	);
}

const TablaReunionesEnCurso = ({ item, index, translate }) => {
	if (item.councilType === 5) {
		return (
			<OneOnOneItem
				key={index}
				index={index}
				council={item}
				translate={translate}
			/>
		)
	}

	if (isMobile) {
		return (
			<GridItem key={item.id} style={{ background: index % 2 ? "#edf4fb" : "", padding: "0.7em 1em", }} xs={12} md={12} lg={12}>
				<div style={{ display: "flex", justifyContent: "space-between" }}>
					<div style={{ marginRight: '0.2em' }}>
						{item.logo ?
							<Avatar alt="Foto" src={item.logo} />
							:
							<i
								className={'fa fa-building-o'}
								style={{ fontSize: '1.7em', color: 'lightgrey' }}
							/>
						}
					</div>
					<div style={{ marginRight: '0.2em' }}>
						{item.name}
					</div>
					<div style={{ marginRight: '0.2em' }}>
						{moment(item.dateStart).format('DD/MM/YYYY HH:mm')}
					</div>
				</div>
			</GridItem>
		)
	}

	return (
		<GridItem key={item.id} style={{ background: index % 2 ? "#edf4fb" : "", padding: "0.7em 1em", }} xs={12} md={12} lg={12}>
			<Grid style={{ alignItems: "center" }}>
				<GridItem xs={1} md={1} lg={1}>
					{item.logo ?
						<Avatar alt="Foto" src={item.logo} />
						:
						<i
							className={'fa fa-building-o'}
							style={{ fontSize: '1.7em', color: 'lightgrey' }}
						/>
					}
				</GridItem>
				<GridItem xs={4} md={4} lg={4}>
					<b>{item.company ? item.company.businessName : ""}</b>
				</GridItem>
				<GridItem xs={4} md={4} lg={4}>
					{item.name} - {moment(item.dateStart).format('DD/MM/YYYY HH:mm')}
				</GridItem>
				<GridItem xs={3} md={3} lg={3} style={{ display: "flex", alignItems: "center", justifyContent: 'center' }}>
					{(item.state === 5 || item.state === 10) &&
						translate.convened
					}

					{(item.state === 20 || item.state === 30) &&
						translate.companies_live
					}

					{(item.state === 40) &&
						translate.companies_writing
					}

				</GridItem>
			</Grid>
		</GridItem>
	)
}

const TablaUsuarios = ({ users, translate, total, changePageUsuarios, usersPage }) => {

	const primary = getPrimary();
	return (
		<div style={{}}>
			<div style={{ fontSize: "13px" }}>
				<div style={{ display: "flex", justifyContent: "space-between", padding: "1em", }}>
					<div style={{ color: primary, fontWeight: "bold", width: 'calc( 100% / 5 )', textAlign: 'left' }}>
						{translate.state}
					</div>
					<div style={{ color: primary, fontWeight: "bold", width: 'calc( 100% / 5 )', textAlign: 'left' }}>
						Id
					</div>
					<div style={{ color: primary, fontWeight: "bold", width: 'calc( 100% / 5 )', textAlign: 'left' }}>
						{translate.name}
					</div>
					<div style={{ color: primary, fontWeight: "bold", overflow: "hidden", width: 'calc( 100% / 5 )', textAlign: 'left' }}>
						{translate.email}
					</div>
					<div style={{ color: primary, fontWeight: "bold", overflow: "hidden", width: 'calc( 100% / 5 )', textAlign: 'left' }}>
						{translate.last_connection}
					</div>
				</div>
				<div style={{ height: "300px" }}>
					<Scrollbar>
						{users.map((item, index) => {
							return (
								<div
									key={item.id}
									style={{
										display: "flex",
										justifyContent: "space-between",
										padding: "1em",
										background: index % 2 ? "#edf4fb" : "",
									}}>
									<Cell text={getActivationText(item.actived, translate)} />
									<Cell text={item.id} />
									<Cell text={item.name + " " + item.surname || ''} />
									<Cell text={item.email} />
									<Cell text={item.lastConnectionDate ? moment(item.lastConnectionDate).format("LLL") : '-'} />
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
						total={total}
						limit={10}
						changePage={changePageUsuarios}
						md={12}
						xs={12}
					/>
				</Grid>
			</div>
		</div>
	)
}

const TablaCompanies = ({ companies, translate, total, changePageCompanies, companiesPage }) => {
	const primary = getPrimary();

	return (
		<div style={{ fontSize: "13px" }}>
			<div style={{ display: "flex", justifyContent: "space-between", padding: "1em", }}>
				<div style={{ color: primary, fontWeight: "bold", width: 'calc( 100% / 3 )', textAlign: 'left' }}>

				</div>
				<div style={{ color: primary, fontWeight: "bold", width: 'calc( 100% / 3 )', textAlign: 'left' }}>
					Id
				</div>
				<div style={{ color: primary, fontWeight: "bold", width: 'calc( 100% / 3 )', textAlign: 'left' }}>
					{translate.name}
				</div>
			</div>
			<div style={{ height: "300px" }}>
				<Scrollbar>
					{companies.map((item, index) => {
						return (
							<div
								key={item.id}
								style={{
									display: "flex",
									justifyContent: "space-between",
									padding: "1em",
									background: index % 2 ? "#edf4fb" : "",
								}}>
								<CellAvatar width={3} avatar={item.logo} />
								<Cell width={3} text={item.id} />
								<Cell width={3} text={item.businessName} />
							</div>
						)
					})}
				</Scrollbar>
			</div>
			<Grid style={{ marginTop: "1em" }}>
				<PaginationFooter
					page={companiesPage}
					translate={translate}
					length={companies.length}
					total={total}
					limit={10}
					changePage={changePageCompanies}
				/>
			</Grid>
		</div>
	)
}


const GraficaDoughnut = ({ porcentaje, color, max }) => {
	Chart.pluginService.register({
		afterUpdate: function (chart) {
			if (chart.config.options.elements.arc.roundedCornersFor !== undefined) {
				var arc = chart.getDatasetMeta(0).data[chart.config.options.elements.arc.roundedCornersFor];
				arc.round = {
					x: (chart.chartArea.left + chart.chartArea.right) / 2,
					y: (chart.chartArea.top + chart.chartArea.bottom) / 2,
					radius: (chart.outerRadius + chart.innerRadius) / 2,
					thickness: (chart.outerRadius - chart.innerRadius) / 2 - 2,
					backgroundColor: arc._model.backgroundColor
				}
			}
		},

		afterDraw: function (chart) {
			if (chart.config.options.elements.arc.roundedCornersFor !== undefined) {
				var ctx = chart.chart.ctx;
				var arc = chart.getDatasetMeta(0).data[chart.config.options.elements.arc.roundedCornersFor];
				var startAngle = Math.PI / 2 - arc._view.startAngle;
				var endAngle = Math.PI / 2 - arc._view.endAngle;

				ctx.save();
				ctx.translate(arc.round.x, arc.round.y);
				ctx.fillStyle = arc.round.backgroundColor;
				ctx.beginPath();
				ctx.arc(arc.round.radius * Math.sin(startAngle), arc.round.radius * Math.cos(startAngle), arc.round.thickness, 0, 2 * Math.PI);
				ctx.arc(arc.round.radius * Math.sin(endAngle), arc.round.radius * Math.cos(endAngle), arc.round.thickness, 0, 2 * Math.PI);
				ctx.closePath();
				ctx.fill();
				ctx.restore();
			}
		},
	});

	Chart.pluginService.register({
		afterUpdate: function (chart) {
			if (chart.config.options.elements.center) {
				var helpers = Chart.helpers;
				var centerConfig = chart.config.options.elements.center;
				var globalConfig = Chart.defaults.global;
				var ctx = chart.chart.ctx;
				var fontStyle = helpers.getValueOrDefault(centerConfig.fontStyle, globalConfig.defaultFontStyle);
				var fontFamily = helpers.getValueOrDefault(centerConfig.fontFamily, globalConfig.defaultFontFamily);
				if (centerConfig.fontSize)
					var fontSize = centerConfig.fontSize;
				else {
					ctx.save();
					var fontSize = helpers.getValueOrDefault(centerConfig.minFontSize, 1);
					var maxFontSize = helpers.getValueOrDefault(centerConfig.maxFontSize, 256);
					var maxText = helpers.getValueOrDefault(centerConfig.maxText, centerConfig.text);
					do {
						ctx.font = helpers.fontString(fontSize, fontStyle, fontFamily);
						var textWidth = ctx.measureText(maxText).width;
						if (textWidth < chart.innerRadius * 2 && fontSize < maxFontSize)
							fontSize += 1;
						else {
							fontSize -= 1;
							break;
						}
					} while (true)
					ctx.restore();
				}
				chart.center = {
					font: helpers.fontString(fontSize, fontStyle, fontFamily),
					fillStyle: helpers.getValueOrDefault(centerConfig.fontColor, globalConfig.defaultFontColor)
				};
			}
		},
		afterDraw: function (chart) {
			if (chart.center) {
				var centerConfig = chart.config.options.elements.center;
				var ctx = chart.chart.ctx;
				ctx.save();
				ctx.font = chart.center.font;
				ctx.fillStyle = chart.center.fillStyle;
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				var centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
				var centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
				ctx.fillText(centerConfig.text, centerX, centerY);
				ctx.restore();
			}
		},
	})

	return (
		<Doughnut
			data={{
				labels: [
					"Red",
					"Gray"
				],
				datasets: [{
					data: [porcentaje, porcentaje - max === 0 ? 10 : max - porcentaje],
					backgroundColor: [
						color,
						"#491f77"
					],
					hoverBackgroundColor: [
						color,
						"#491f77"
					],
					borderColor: '#cfe7f4',
					borderWidth: 4,
					hoverBorderColor: ["#cfe7f4", '#cfe7f4']
				}]
			}}
			options={{
				legend: {
					display: false
				},
				tooltips: {
					enabled: false
				},
				cutoutPercentage: 60,
				elements: {
					arc: {
						roundedCornersFor: 0
					},
					center: {
						maxText: '100%',
						text: porcentaje,
						// text: porcentaje + "%",
						fontColor: '#491f77',
						fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
						fontStyle: 'italic',
						minFontSize: 1,
						maxFontSize: 256,
					}
				}
			}}
		/>
	)
}



const CellAvatar = ({ avatar }) => {
	return (
		<div style={{ overflow: "hidden", width: 'calc( 100% / 3 )', textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: "10px" }}>
			{avatar ?
				<Avatar src={avatar} alt="Foto" />
				:
				<i style={{ color: 'lightgrey', fontSize: "1.7em", marginLeft: '6px' }} className={'fa fa-building-o'} />
			}
		</div>
	)
}
const Cell = ({ text, avatar, width }) => {
	return (
		<div style={{ overflow: "hidden", width: width ? `calc( 100% / ${width})` : 'calc( 100% / 5 )', textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: "10px" }}>
			{text}
		</div>
	)
}

const corporationConvenedLiveCouncils = gql`
    query corporationConvenedLiveCouncils($filters: [FilterInput], $options: OptionsInput, $fechaInicio: String, $fechaFin: String, $corporationId: Int){
		corporationConvenedLiveCouncils(filters: $filters, options: $options, fechaInicio: $fechaInicio, fechaFin: $fechaFin, corporationId: $corporationId){
			list{
				id
				name
				state
				dateStart
				councilStarted
				councilType
				externalId
				participants {
					id
					name
					surname
				}
				prototype
				attachments {
					filename
					participantId
				}
				company{
					id
					businessName
					logo
				}
			}
			total,
			preparing,
			saved,
			roomOpened,
			max
		}
	}
`;

export default withApollo(withStyles(styles)(OrganizationDashboard));
