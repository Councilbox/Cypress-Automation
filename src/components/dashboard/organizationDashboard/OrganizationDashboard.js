


import React from "react";
import { Avatar } from "antd";
import Calendar from 'react-calendar';
import { Icon, withStyles, Divider, } from "material-ui";
import { Doughnut, Chart } from "react-chartjs-2";
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { getPrimary } from "../../../styles/colors";
import { moment } from "../../../containers/App";
import { ConfigContext } from '../../../containers/AppControl';
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
} from "../../../displayComponents";
import GraficaEstadisiticas from "../GraficaEstadisiticas";
import { isMobile } from "../../../utils/screen";
import OneOnOneItem from "../OneOnOne/OneOnOneItem";
import { usePolling } from "../../../hooks";
import ImportOneOneOne from "../OneOnOne/ImportOneOnOne";
import UsersTable from "./UsersTable";
import EntitiesTable from "./EntitiesTable";
import { isOrganization } from "../../../utils/CBX";


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

const OrganizationDashboard = ({ translate, company, user, client, setAddUser, setEntidades, ...props }) => {
	const [reuniones, setReuniones] = React.useState(false);
	const [filters, setFilters] = React.useState({
		page: 1,
		dateStart: moment().startOf('month').toDate(),
		dateEnd: moment().endOf('month').toDate(),
		type: 'all'
	})
	const [reunionesLoading, setReunionesLoading] = React.useState(true);
	const [inputSearch, setInputSearch] = React.useState(false);
	const [toggleReunionesCalendario, setToggleReunionesCalendario] = React.useState(translate.councils_link);
	const [filterReuniones, setFilterReuniones] = React.useState(translate.all);
	const [state, setState] = React.useState({
		textFilter: ''
	});
	const [porcentajes, setPorcentajes] = React.useState({
		convocadaPorcentaje: 0,
		celebracionPorcentaje: 0,
		redActaPorcentaje: 0,
	});
	const [usuariosEntidades, setUsuariosEntidades] = React.useState(translate.users);
	const primary = getPrimary();
	const config = React.useContext(ConfigContext);
	const [ReunionesTotal, setReunionesTotal] = React.useState(false);


	const getTileClassName = ({ date }) => {
		if (reuniones.length > 0) {
			const array = reuniones.find(reunion => moment(reunion.dateStart).format("MMM Do YY") === moment(date).format("MMM Do YY"))
			if (array) {
				return 'selectedDate';
			}
		}
		return '';
	}

	const getReuniones = React.useCallback(async () => {
		const response = await client.query({
			query: corporationConvenedLiveCouncils,
			variables: {
				dateStart: filters.dateStart,
				dateEnd: filters.dateEnd,
				corporationId: company.id,
				...(filterReuniones !== translate.all ? {
					status: filterReuniones
				} : {}),
				options: {
					orderBy: 'dateStart',
					limit: 10,
					offset: (filters.page - 1) * 10,
				}
			}
		});

		setReuniones(response.data.organizationCouncils.list);
		setReunionesTotal(response.data.organizationCouncils.total);

		setPorcentajes({
			convocadaPorcentaje: response.data.organizationCouncils.preparing,
			celebracionPorcentaje: response.data.organizationCouncils.roomOpened,
			redActaPorcentaje: response.data.organizationCouncils.saved,
			max: response.data.organizationCouncils.max
		})
		setReunionesLoading(false);
	}, [filters.dateStart, filters.dateEnd, filters.page, company.id, filterReuniones]);

	usePolling(getReuniones, 12000);

	React.useEffect(() => {
		getReuniones()
	}, [getReuniones]);

	const changeMonthBack = () => {
		setFilters({
			...filters,
			dateStart: moment(filters.dateStart).subtract(1, 'months').startOf('month'),
			dateEnd: moment(filters.dateStart).subtract(1, 'months').endOf('month'),
			selectedDay: null
		});
	}
	const changeMonthFront = () => {
		setFilters({
			...filters,
			dateStart: moment(filters.dateStart).add(1, 'months').startOf('month'),
			dateEnd: moment(filters.dateStart).add(1, 'months').endOf('month'),
			selectedDay: null
		});
	}

	const onChangeDay = date => {
		if (String(filters.dateStart) === String(date)) {
			setFilters({
				...filters,
				dateStart: moment().startOf('month').toDate(),
				dateEnd: moment().endOf('month').toDate(),
				selectedDay: new Date('01/01/1970')
			});
		} else {
			setFilters({
				...filters,
				dateStart: date,
				dateEnd: moment(date).add(24, 'hours'),
				selectedDay: date
			});
		}
	}

	const renderTables = () => (
			usuariosEntidades === translate.users ?
				<UsersTable
					company={company}
					textFilter={state.textFilter || ''}
					translate={translate}
				/>
			:
				<EntitiesTable
					company={company}
					textFilter={state.textFilter || ''}
					translate={translate}
				/>
		)

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
								{reuniones.length === undefined || reunionesLoading ?
									<LoadingSection />
									:
									<div>
										{reuniones.map((item, index) => (
												<TablaReunionesEnCurso
													key={index + "_reuniones"}
													item={item}
													index={index}
													translate={translate}
												/>
											))}
										<Grid style={{ marginTop: "1em" }}>
											<PaginationFooter
												page={filters.page}
												translate={translate}
												length={reuniones.length}
												total={ReunionesTotal}
												limit={10}
												changePage={page => setFilters({ ...filters, page })}
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
									value={filters.selectedDay}
									minDetail={'month'}
									tileClassName={date => getTileClassName(date)}
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
								<TextInput
									className={isMobile && !inputSearch ? "openInput" : ""}
									disableUnderline={true}
									styleInInput={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.54)", background: "#f0f3f6", padding: isMobile && inputSearch && "4px 5px", paddingLeft: !isMobile && "5px", marginTop: '0px' }}
									stylesAdornment={{ background: "#f0f3f6", marginLeft: "0", paddingLeft: isMobile && inputSearch ? "8px" : "4px" }}
									floatingText={" "}
									adornment={<Icon onClick={() => setInputSearch(!inputSearch)} style={{ background: "#f0f3f6", paddingLeft: "5px", height: '100%', display: "flex", alignItems: "center", justifyContent: "center" }}>search</Icon>}
									type="text"
									styles={{ marginTop: '-16px', marginBottom: "-8px" }}
									value={state.textFilter || ""}
									onChange={event => {
										setState({
											...state,
											textFilter: event.target.value
										})
									}}
								/>
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
										isOrganization(company) &&
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
							{renderTables()}
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
								{reuniones.length === undefined || reunionesLoading ?
										<LoadingSection />
										:
										<div>
											{reuniones.map((item, index) => (
													<TablaReunionesEnCurso
														key={index + "_reuniones"}
														item={item}
														index={index}
														translate={translate}
													/>
												))}
											<Grid style={{ marginTop: "1em" }}>
												<PaginationFooter
													page={filters.page}
													translate={translate}
													length={reuniones.length}
													total={ReunionesTotal}
													limit={10}
													changePage={page => {
														setFilters({
															...filters,
															page
														})
													}}
												/>
											</Grid>

										</div>
								}
							</Scrollbar>
						</Grid>
					</GridItem>
					<GridItem xs={4} md={4} lg={4} style={{ height: '35em' }}>
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
									value={filters.selectedDay}
									minDetail={'month'}
									tileClassName={date => getTileClassName(date)}
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
										<TextInput
											placeholder={translate.search}
											adornment={<Icon style={{ background: "#f0f3f6", paddingLeft: "5px", height: '100%', display: "flex", alignItems: "center", justifyContent: "center" }}>search</Icon>}
											type="text"
											value={state.textFilter || ""}
											styleInInput={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.54)", background: "#f0f3f6", marginLeft: "0", paddingLeft: "8px" }}
											disableUnderline={true}
											stylesAdornment={{ background: "#f0f3f6", marginLeft: "0", paddingLeft: "8px" }}
											onChange={event => {
												setState({
													...state,
													textFilter: event.target.value
												})
											}}
										/>

									</div>
								</GridItem>
							</Grid>
							<div style={{}}>
								{renderTables()}
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

const GraficaDoughnut = ({ porcentaje, color, max }) => {
	Chart.pluginService.register({
		afterUpdate(chart) {
			if (chart.config.options.elements.arc.roundedCornersFor !== undefined) {
				const arc = chart.getDatasetMeta(0).data[chart.config.options.elements.arc.roundedCornersFor];
				arc.round = {
					x: (chart.chartArea.left + chart.chartArea.right) / 2,
					y: (chart.chartArea.top + chart.chartArea.bottom) / 2,
					radius: (chart.outerRadius + chart.innerRadius) / 2,
					thickness: (chart.outerRadius - chart.innerRadius) / 2 - 2,
					backgroundColor: arc._model.backgroundColor
				}
			}
		},

		afterDraw(chart) {
			if (chart.config.options.elements.arc.roundedCornersFor !== undefined) {
				const ctx = chart.chart.ctx;
				const arc = chart.getDatasetMeta(0).data[chart.config.options.elements.arc.roundedCornersFor];
				const startAngle = Math.PI / 2 - arc._view.startAngle;
				const endAngle = Math.PI / 2 - arc._view.endAngle;

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
		afterUpdate(chart) {
			if (chart.config.options.elements.center) {
				const helpers = Chart.helpers;
				const centerConfig = chart.config.options.elements.center;
				const globalConfig = Chart.defaults.global;
				const ctx = chart.chart.ctx;
				const fontStyle = helpers.getValueOrDefault(centerConfig.fontStyle, globalConfig.defaultFontStyle);
				const fontFamily = helpers.getValueOrDefault(centerConfig.fontFamily, globalConfig.defaultFontFamily);
				if (centerConfig.fontSize) var fontSize = centerConfig.fontSize;
				else {
					ctx.save();
					var fontSize = helpers.getValueOrDefault(centerConfig.minFontSize, 1);
					const maxFontSize = helpers.getValueOrDefault(centerConfig.maxFontSize, 256);
					const maxText = helpers.getValueOrDefault(centerConfig.maxText, centerConfig.text);
					do {
						ctx.font = helpers.fontString(fontSize, fontStyle, fontFamily);
						const textWidth = ctx.measureText(maxText).width;
						if (textWidth < chart.innerRadius * 2 && fontSize < maxFontSize) fontSize += 1;
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
		afterDraw(chart) {
			if (chart.center) {
				const centerConfig = chart.config.options.elements.center;
				const ctx = chart.chart.ctx;
				ctx.save();
				ctx.font = chart.center.font;
				ctx.fillStyle = chart.center.fillStyle;
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
				const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
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

const corporationConvenedLiveCouncils = gql`
    query corporationConvenedLiveCouncils(
		$filters: [FilterInput],
		$options: OptionsInput,
		$dateStart: String,
		$dateEnd: String,
		$status: String,
		$corporationId: Int
	){
		organizationCouncils(
			filters: $filters,
			options: $options,
			dateStart: $dateStart,
			dateEnd: $dateEnd,
			status: $status,
			corporationId: $corporationId
		){
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
