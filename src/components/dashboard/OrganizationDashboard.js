


import React from "react";
import {
	Grid,
	GridItem,
	BasicButton,
	Scrollbar,
	TextInput,
	LoadingSection,
	PaginationFooter,
} from "../../displayComponents";
import { ConfigContext } from '../../containers/AppControl';
import { moment, bHistory } from "../../containers/App";
import { Avatar } from "antd";
import { primary, getPrimary } from "../../styles/colors";
import Calendar from 'react-calendar';
import { Icon, withStyles, } from "material-ui";
import { Doughnut, Chart } from "react-chartjs-2";
import { corporationUsers } from "../../queries/corporation";
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import GraficaEstadisiticas from "./GraficaEstadisiticas";
import { sendGAevent } from "../../utils/analytics";
import { isMobile } from "react-device-detect";
var LineChart = require("react-chartjs-2").Line;


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
	const [toggleReunionesCalendario, setToggleReunionesCalendario] = React.useState("reuniones");
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
	const [usuariosEntidades, setUsuariosEntidades] = React.useState("usuarios");

	const config = React.useContext(ConfigContext);

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
		if (usuariosEntidades === "usuarios") {
			getUsers();
		} else {
			getCompanies()
		}
	}, [company.id, state.filterTextUsuarios, state.filterTextCompanies, usuariosEntidades, usersPage, companiesPage]);



	const getReuniones = async (fechaInicio, fechaFin, fechaReunionConcreta) => {

		setReunionesLoading(true)
		const response = await client.query({
			query: corporationCouncils,
			variables: {
				fechaInicio: fechaInicio ? fechaFin : moment().endOf('month').toDate(),
				fechaFin: fechaFin ? fechaInicio : moment().startOf('month').toDate(),
				corporationId: company.id
			}
		});

		let data = ""
		if (fechaReunionConcreta) {
			if (response.data.corporationConvenedCouncils) {
				data = [...response.data.corporationConvenedCouncils, ...response.data.corporationLiveCouncils]
				setReunionesPorDia(data)
				setReunionesLoading(false)
			}
		} else {
			if (response.data.corporationConvenedCouncils) {
				data = [...response.data.corporationConvenedCouncils, ...response.data.corporationLiveCouncils]
				setReuniones(data)
				calcularEstadisticas(data)
				setReunionesLoading(false)
			}
		}
	}

	React.useEffect(() => {
		getReuniones()
	}, [company.id, state.filterFecha]);


	const hasBook = companyHasBook();

	const size = !hasBook ? 4 : 3;
	const blankSize = !hasBook ? 2 : 3;

	const prueba = (e) => {
		console.log(e)
	}

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

	const calcularEstadisticas = (data) => {
		let convocada = 0 //5-10
		let celebracion = 0//20-30
		let redActa = 0//40
		data.map((item, index) => {
			if (item.state === 5 || item.state === 10) {
				convocada++
			}
			if (item.state === 20 || item.state === 30) {
				celebracion++
			}
			if (item.state === 40) {
				redActa++
			}
		})
		let miLista = [convocada, celebracion, redActa];
		var mayor = miLista[0];
		for (let i = 1; i < miLista.length; i++) {
			if (miLista[i] > mayor)
				mayor = miLista[i];
		}
		setPorcentajes({
			convocadaPorcentaje: convocada,
			celebracionPorcentaje: celebracion,
			redActaPorcentaje: redActa,
			max: mayor
		})
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
						alignContent: "center"
					}}>
						<div style={{ fontWeight: 'bold', color: "#a09b9e", }}>Reuniones en curso</div>
						<div style={{
							display: "flex",
							alignContent: "inherit",
							justifyContent: "center"
						}}
						>
							<div style={{ color: "#c196c3", fontSize: "13px", marginRight: "0.5em" }}>Convocadas</div>
							<div style={{ color: "#c196c3", marginRight: "0.5em" }}>
								<i class="fa fa-filter" ></i>
							</div>
							{toggleReunionesCalendario === "reuniones" ?
								<div style={{}} onClick={() => setToggleReunionesCalendario("calendario")} >Ir</div>
								:
								<div style={{}} onClick={() => setToggleReunionesCalendario("reuniones")} >IC</div>
							}
						</div>
					</div>
					{toggleReunionesCalendario === "reuniones" ?
						<div style={{ height: "20em" }}>
							<Scrollbar>
								{day ?
									reunionesPorDia.length === undefined || reunionesLoading ?
										<LoadingSection />
										:
										reunionesPorDia.map((item, index) => {
											return (
												<TablaReunionesEnCurso
													key={index + "_reunionesPorDia"}
													item={item}
													index={index}
													translate={translate}
												/>
											)
										})
									:
									reuniones.length === undefined || reunionesLoading ?
										<LoadingSection />
										:
										reuniones.map((item, index) => {
											return (
												<TablaReunionesEnCurso
													key={index + "_reuniones"}
													item={item}
													index={index}
													translate={translate}
												/>
											)
										})
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
					<div style={{ marginBottom: "1em", fontWeight: 'bold', color: "#a09b9e", textAlign: "left" }}>Estadísticas</div>
					{reuniones.length === undefined ?
						<LoadingSection />
						:
						<div>
							{/* TRADUCCION */}
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
						alignContent: "center"
					}}>
						<div style={{ fontWeight: 'bold', color: "#a09b9e", }}>{translate.users}</div>
						<div style={{
							display: "flex",
							alignContent: "inherit",
							justifyContent: "center"
						}}
						>
							<div style={{ color: "#c196c3", fontSize: "13px", marginRight: "0.5em" }}>{translate.connecteds}</div>
							<div style={{ color: "#c196c3", marginRight: "0.5em" }}>
								<i class="fa fa-filter" ></i>
							</div>
							{usuariosEntidades === 'usuarios' ?
								<TextInput
									className={isMobile && !inputSearch ? "openInput" : ""}
									disableUnderline={true}
									styleInInput={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.54)", background: "#f0f3f6", padding: isMobile && inputSearch && "4px 5px", paddingLeft: !isMobile && "5px", marginTop: '0px' }}
									stylesAdornment={{ background: "#f0f3f6", marginLeft: "0", paddingLeft: isMobile && inputSearch ? "8px" : "4px" }}
									floatingText={" "}
									adornment={<Icon onClick={() => setInputSearch(!inputSearch)} style={{ background: "#f0f3f6", paddingLeft: "5px", height: '100%', display: "flex", alignItems: "center", justifyContent: "center" }}>search</Icon>}
									type="text"
									styles={{ marginTop: '-16px' }}
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
									styles={{ marginTop: '-16px' }}
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
									color: usuariosEntidades === 'usuarios' ? getPrimary() : "#9f9a9d",
									borderRight: "1px solid gainsboro"
								}}
									onClick={() => setUsuariosEntidades("usuarios")}
								>
									{translate.users}
								</div>
								<div
									style={{
										cursor: "pointer",
										paddingLeft: "0.5em",
										color: usuariosEntidades === 'entidades' ? getPrimary() : "#9f9a9d"
									}}
									onClick={() => setUsuariosEntidades("entidades")}
								>
									{translate.entities}
								</div>
							</div>
						</GridItem>
						<GridItem xs={6} md={6} lg={8} style={{ display: 'flex', justifyContent: "flex-end" }}>
							<div style={{ display: "flex", alignItems: "center" }}>
								{usuariosEntidades === 'usuarios' ?
									<BasicButton
										buttonStyle={{ boxShadow: "none", borderRadius: "4px", border: `1px solid ${getPrimary()}`, padding: "0.2em 0.4em", marginTop: "5px", color: getPrimary(), }}
										backgroundColor={{ backgroundColor: "white" }}
										text={translate.add}
										onClick={() => setAddUser(true)}
									/>
									:
									<BasicButton
										buttonStyle={{ boxShadow: "none", borderRadius: "4px", border: `1px solid ${getPrimary()}`, padding: "0.2em 0.4em", marginTop: "5px", color: getPrimary(), }}
										backgroundColor={{ backgroundColor: "white" }}
										text={translate.add}
										onClick={() => setEntidades(true)}
									/>
								}

							</div>
						</GridItem>
					</Grid>
					<div style={{}}>
						{usuariosEntidades === 'usuarios' ?
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
						<div style={{ marginBottom: "1em", fontWeight: 'bold', color: "#a09b9e" }}>Reuniones en curso</div>
						<Grid style={{ overflow: "hidden", height: "85%" }}>
							<Scrollbar>
								{day ?
									reunionesPorDia.length === undefined || reunionesLoading ?
										<LoadingSection />
										:
										reunionesPorDia.map((item, index) => {
											return (
												<TablaReunionesEnCurso
													key={index + "_reunionesPorDia"}
													item={item}
													index={index}
													translate={translate}
												/>
											)
										})
									:
									reuniones.length === undefined || reunionesLoading ?
										<LoadingSection />
										:
										reuniones.map((item, index) => {
											return (
												<TablaReunionesEnCurso
													key={index + "_reuniones"}
													item={item}
													index={index}
													translate={translate}
												/>
											)
										})
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
					<GridItem xs={4} md={4} lg={4} style={{
						background: "white",
						boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)",
						padding: "1em",
						borderRadius: "5px"
					}}>
						<div style={{ marginBottom: "1em", fontWeight: 'bold', color: "#a09b9e", textAlign: "left" }}>Estadísticas</div>
						{reuniones.length === undefined ?
							<LoadingSection />
							:
							<div>
								<Grid>
									<GridItem xs={12} md={6} lg={4}>
										<div style={{ color: "black", marginBottom: "1em" }}>Convocada</div>
										<div style={{ width: '100%', }}>
											<GraficaDoughnut
												porcentaje={porcentajes.convocadaPorcentaje || 0}
												color={'#e77153'}
												max={porcentajes.max}
											/>
										</div>
									</GridItem>
									<GridItem xs={12} md={6} lg={4}>
										<div style={{ color: "black", marginBottom: "1em" }}>En celebración</div>
										<div style={{ width: '100%', }}>
											<GraficaDoughnut
												porcentaje={porcentajes.celebracionPorcentaje || 0}
												color={'#e77153'}
												max={porcentajes.max}
											/>
										</div>
									</GridItem>
									<GridItem xs={12} md={6} lg={4}>
										<div style={{ color: "black", marginBottom: "1em" }}>Redact. Acta</div>
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
										color: usuariosEntidades === 'usuarios' ? getPrimary() : "#9f9a9d",
										borderRight: "1px solid gainsboro"
									}}
										onClick={() => setUsuariosEntidades("usuarios")}
									>
										Usuarios
									</div>
									<div
										style={{
											cursor: "pointer",
											paddingLeft: "0.5em",
											color: usuariosEntidades === 'entidades' ? getPrimary() : "#9f9a9d"
										}}
										onClick={() => setUsuariosEntidades("entidades")}
									>
										Entidades
									</div>
								</div>
							</GridItem>
							<GridItem xs={12} md={6} lg={8} style={{ display: 'flex', justifyContent: "flex-end" }}>
								<div style={{ padding: "0.5em", display: "flex", alignItems: "center" }}>
									{usuariosEntidades === 'usuarios' ?
										<BasicButton
											buttonStyle={{ boxShadow: "none", marginRight: "1em", borderRadius: "4px", border: `1px solid ${getPrimary()}`, padding: "0.2em 0.4em", marginTop: "5px", color: getPrimary(), }}
											backgroundColor={{ backgroundColor: "white" }}
											text={translate.add}
											onClick={() => setAddUser(true)}
										/>
										:
										<BasicButton
											buttonStyle={{ boxShadow: "none", marginRight: "1em", borderRadius: "4px", border: `1px solid ${getPrimary()}`, padding: "0.2em 0.4em", marginTop: "5px", color: getPrimary(), }}
											backgroundColor={{ backgroundColor: "white" }}
											text={translate.add}
											onClick={() => setEntidades(true)}
										/>
									}

									<div style={{ padding: "0px 8px", fontSize: "24px", color: "#c196c3" }}>
										<i className="fa fa-filter"></i>
									</div>
									{usuariosEntidades === 'usuarios' ?
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
							{usuariosEntidades === 'usuarios' ?
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
				</Grid>

			</Grid>
		</div>
	);
}

const TablaReunionesEnCurso = ({ item, index, translate }) => {

	const getSectionTranslation = type => {
		const texts = {
			drafts: translate.companies_draft,
			calendar: translate.companies_calendar,
			live: translate.companies_live,
			act: translate.companies_writing,
			confirmed: translate.act_book,
			history: translate.dashboard_historical
		}

		return texts[type];
	}

	if (isMobile) {

		return (
			<GridItem key={item.id} style={{ background: index % 2 ? "#edf4fb" : "", padding: "0.7em 1em", }} xs={12} md={12} lg={12}>
				<div style={{ display: "flex", justifyContent: "space-between" }}>
					<div>
						{item.logo ?
							<Avatar alt="Foto" src={item.logo} />
							:
							<i
								className={'fa fa-building-o'}
								style={{ fontSize: '1.7em', color: 'lightgrey' }}
							/>
						}
					</div>
					<div>
						{item.name}
					</div>
					<div>
						{moment(item.dateStart).subtract(10, 'days').calendar()}
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
					{item.name} - {moment(item.dateStart).subtract(10, 'days').calendar()}
				</GridItem>
				<GridItem xs={3} md={3} lg={3} style={{ display: "flex", alignItems: "center", justifyContent: 'center' }}>
					{(item.state === 5 || item.state === 10) &&
						//convocada
						<BasicButton
							text="Convocada"//TRADUCCION
							textStyle={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: primary, }}
							backgroundColor={{ backgroundColor: "white", borderRadius: "4px" }}
							onClick={() => {
								sendGAevent({
									category: 'Reuniones',
									// action: `${getSectionTranslation(props.match.params.section)} - Acceso`,
									label: item.company.businessName
								})
								bHistory.push(
									`/company/${item.company.id}/council/${item.id}/prepare`
								)
							}}
						>
						</BasicButton>}

					{(item.state === 20 || item.state === 30) &&
						//celebracion
						<BasicButton
							text="En celebracion" //TRADUCCION
							textStyle={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: primary, }}
							backgroundColor={{ backgroundColor: "white", borderRadius: "4px" }}
							onClick={() => {
								sendGAevent({
									category: 'Reuniones',
									// action: `${getSectionTranslation(props.match.params.section)} - Acceso`,
									label: item.company.businessName
								})
								bHistory.push(
									`/company/${item.company.id}/council/${item.id}/live`
								)
							}}
						>
						</BasicButton>
					}

					{(item.state === 40) &&
						//redActa
						<BasicButton
							text="Redactando acta"//TRADUCCION
							textStyle={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: primary, }}
							backgroundColor={{ backgroundColor: "white", borderRadius: "4px" }}
							onClick={() => {
								sendGAevent({
									category: 'Reuniones',
									// action: `${getSectionTranslation(props.match.params.section)} - Acceso`,
									label: item.company.businessName
								})
								bHistory.push(
									`/company/${item.company.id}/council/${item.id}/finished`
								)
							}}
						>
						</BasicButton>
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
						Estado
				</div>
					<div style={{ color: primary, fontWeight: "bold", width: 'calc( 100% / 5 )', textAlign: 'left' }}>
						Id
				</div>
					<div style={{ color: primary, fontWeight: "bold", width: 'calc( 100% / 5 )', textAlign: 'left' }}>
						Nombre
				</div>
					<div style={{ color: primary, fontWeight: "bold", overflow: "hidden", width: 'calc( 100% / 5 )', textAlign: 'left' }}>
						Email
				</div>
					<div style={{ color: primary, fontWeight: "bold", overflow: "hidden", width: 'calc( 100% / 5 )', textAlign: 'left' }}>
						Últ.Conexión
				</div>
				</div>
				<div style={{ height: "300px" }}>
					<Scrollbar>
						{users.map(item => {
							return (
								<div
									key={item.id}
									style={{
										display: "flex",
										justifyContent: "space-between",
										padding: "1em"
									}}>
									<Cell text={item.actived} />
									<Cell text={item.id} />
									<Cell text={item.name + " " + item.surname} />
									<Cell text={item.email} />
									<Cell text={moment(item.lastConnectionDate).format("LLL")} />
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
					Nombre
				</div>
			</div>
			<div style={{ height: "300px" }}>
				<Scrollbar>
					{companies.map(item => {
						return (
							<div
								key={item.id}
								style={{
									display: "flex",
									justifyContent: "space-between",
									padding: "1em"
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

const corporationCouncils = gql`
    query corporationCouncils($filters: [FilterInput], $options: OptionsInput, $fechaInicio: String, $fechaFin: String, $corporationId: Int){
					corporationConvenedCouncils(filters: $filters, options: $options, fechaInicio: $fechaInicio, fechaFin: $fechaFin, corporationId: $corporationId){
					id
			name
				state
				dateStart
				councilType
				prototype
			participants {
					id
				}
				company{
					id
				businessName
				logo
			}
		}

		corporationLiveCouncils(filters: $filters, options: $options, fechaInicio: $fechaInicio, fechaFin: $fechaFin, corporationId: $corporationId){
					id
			name
				state
				dateStart
				councilType
				prototype
			participants {
					id
				}
				company{
					id
				businessName
				logo
			}
		}
	}
`;

export default withApollo(withStyles(styles)(OrganizationDashboard));
