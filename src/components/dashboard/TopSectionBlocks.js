import React from "react";
import {
	Block, Grid, GridItem, LoadingSection, AlertConfirm, Link, BasicButton
} from "../../displayComponents";
import { graphql, compose } from "react-apollo";
import { councils } from "../../queries.js";
import CantCreateCouncilsModal from "./CantCreateCouncilsModal";
import { moment } from "../../containers/App";
import BigCalendar from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css";
import CouncilDetails from '../../components/council/display/CouncilDetails'
import gql from 'graphql-tag';
import AgendaEvent from './AgendaEvent';
import { isMobile } from "react-device-detect";
import Grafica from "./Grafica";
import UltimasAcciones from "./UltimasAcciones";
import ButtonsDirectAccess from "./ButtonsDirectAccess";
import _ from "lodash";
import RGL, { WidthProvider, Responsive } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import SinSesion from "./SinSesion"
import { Tooltip } from "material-ui";


const ResponsiveReactGridLayout = WidthProvider(Responsive);


//añadir en node modules utils antes del return  / l.y = Math.max(l.y, 0); l.x = Math.max(l.x, 0); / para que funcione todo bien

const stylesGrafica = {
	contenedor: {
		border: "1px solid #ddd",
		background: "white",
		boxShadow: "rgba(0, 0, 0, 0.2) 0px 2px 4px",
		// borderRadius: "3px",
		padding: "1.2em",
		marginBottom: '1em',
		marginTop: "2em",
		// marginRight: '2em',
	},
	grafica: {
		display: 'inline-flex',
		justifyContent: 'center',
		alignItems: 'center',
	}
}

class TopSectionBlocks extends React.Component {

	state = {
		modal: false,
		reunion: null,
		modalAcciones: false,
		activeDrags: 0,
		desactiveItem: false,
		layout: this.props.statesItems[1],
		onLayoutChange: function () { },
		layoutHorizontal: this.props.statesItems[2],
		onLayoutChangeHorizontal: function () { },
		breakpoint: "lg",
		breakpointHorizontal: "lg",

	}

	selectEvent = (event) => {
		this.setState({
			modal: true,
			reunion: event
		})
	}

	closeModal = () => {
		this.setState({
			modal: false
		});
	}

	handleStart = (layout, oldItem, newItem, placeholder, e, element, grid) => {
		e.preventDefault()
		e.stopPropagation()
	}

	handleStop = (layout, oldItem, newItem, placeholder, e, element, grid, nameLayout) => {
		e.preventDefault()
		e.stopPropagation()

		let breakpoint = this.state.breakpoint
		if (grid === 2) {
			grid = 2
			breakpoint = this.state.breakpointHorizontal
			layout = layoutPositivo(layout)
		}
		this.props.itemStorage("", "", layout, grid, nameLayout, breakpoint);
	}

	stopPropagation = (event) => {
		event.stopPropagation();
	};


	onBreakpointChange = (breakpoint) => {
		this.setState({ breakpoint: breakpoint })
	}

	onBreakpointChangeHorizontal = (breakpoint, cols) => {
		this.setState({ breakpointHorizontal: breakpoint })
	}


	onLayoutChangeHorizontal = (layout, layouts) => {
		this.setState({ layoutHorizontal: layouts });
		this.state.onLayoutChange(this.state.layoutHorizontal);
	};


	render() {
		const { translate, company, editMode, statesItems, layoutsResize, layoutsResizeHorizontal } = this.props;
		const localizer = BigCalendar.momentLocalizer(moment)
		let allViews = ["agenda", "month"]
		const { loading, councils, error, } = this.props.data;
		let eventos = [];
		let filtro = [5, 10, 20, 30]
		if (!loading) {
			//Si la dateEnd existe ponerla
			eventos = councils.map(({ dateStart, dateEnd, name, state, step, id, __typename, companyId }) =>
				({ start: new Date(dateStart), end: new Date(dateStart), title: name, state, step, id, __typename, companyId }))
			if (filtro) {
				eventos = Object.keys(eventos).filter(key => filtro.includes(eventos[key].state)).reduce((obj, key) => {
					obj[key] = eventos[key];
					return obj;
				}, []);
			}
		}
		const messages = { //TRADUCCION
			allDay: 'Todo el dia',
			previous: '< Atrás',
			next: translate.next + ' >',
			today: 'Hoy',
			month: 'Mes',
			week: 'Semana',
			day: 'Día',
			agenda: translate.agenda,
			date: translate.date,
			time: 'Hora',
			event: 'Evento',
			noEventsInRange: 'No hay eventos en este rango.',

		}

		const numReunion = []
		const numMes = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0 }

		let conf = [];
		let totalReuniones = 0;
		let info = [];
		if (!loading) {
			councils.forEach(reunion => numReunion.push(
				new Date(reunion.dateStart).getMonth()
			))
			for (let i = 0; i < numReunion.length; i++) {
				numMes[numReunion[i]]++
			}
			info = Object.values(numMes);
			for (let i = 0; i < info.length; i++) {
				totalReuniones = parseInt(info[i]) + parseInt(totalReuniones)
			}
		}


		const anoActual = new Date().getFullYear();

		///Se cambia error minimos por alerta  en /councilbox_client/node_modules/react-grid-layout/build/GridItem.js
		return (
			<Grid
				style={{
					width: "90%",
					// marginTop: "4vh"company/577
					height: "100%"
				}}
				spacing={8}
			>
				{isMobile &&
					<ButtonsDirectAccess
						company={company}
						translate={translate}
						isMobile={isMobile}
					/>
				}
				{!isMobile &&

					<GridItem xs={12} md={12} lg={12} style={{ height: '100%', minHeight: "800px" }}>

						<ResponsiveReactGridLayout
							breakpoints={{ lg: 1200, md: 1100, sm: 768, xs: 480, xxs: 0 }}
							cols={{ lg: 12, md: 8, sm: 6, xs: 4, xxs: 2 }}
							isResizable={false}
							layouts={layoutsResize}
							onBreakpointChange={(breakpoint, cols) => this.onBreakpointChange(breakpoint, cols)}
							onDragStop={(layout, oldItem, newItem, placeholder, e, element) => this.handleStop(layout, oldItem, newItem, placeholder, e, element, 1, 'layoutsResize')}
							onDragStart={(layout, oldItem, newItem, placeholder, e, element) => this.handleStart(layout, oldItem, newItem, placeholder, e, element, 1)}
							isDraggable={editMode}
							compactType={"vertical"}
							style={{ width: "100%", display: "flex", }}
						>
							<div key={"buttons"} data-grid={statesItems[1][0]} >
								{statesItems[0].buttons && (
									<div style={{ ...stylesGrafica.contenedor, }} className={editMode ? "shakeItems " : ""}>
										{editMode && (
											<div onMouseDown={this.stopPropagation} onTouchStart={this.stopPropagation} className={'shakeIcon'} onClick={(event) => this.props.itemStorage("buttons", false)} style={{ position: "absolute", top: "0", right: "5px", cursor: "pointer" }}>
												<i className={"fa fa-times"}></i>
											</div>
										)}
										<div style={{ marginBottom: "1em", marginTop: "0.5em" }}><b> Quick Links </b></div> {/*TRADUCCION*/}
										<ButtonsDirectAccess
											company={company}
											translate={translate}
											isMobile={isMobile}
										/>
									</div>
								)}
							</div>


							<div key={"sectionReuniones"} data-grid={statesItems[1][1]}>
								{statesItems[0].sectionReuniones && (
									<div style={{ marginLeft: editMode ? "" : "-9px", paddingLeft: editMode ? "1em" : "", marginTop: editMode ? "2em" : "", overflow: "hidden", width: "100%", height: '100%', border: editMode ? "1px solid #ddd" : "", background: editMode ? "white" : "", boxShadow: editMode ? "rgba(0, 0, 0, 0.2) 0px 2px 4px" : "", borderRadius: editMode ? "3px" : "", }} className={editMode ? "shakeItems " : ""} >
										{editMode && (
											<div onMouseDown={this.stopPropagation} onTouchStart={this.stopPropagation} className={'shakeIcon'} onClick={() => this.props.itemStorage("sectionReuniones", false)} style={{ position: "absolute", top: "0", right: "5px", cursor: "pointer", zIndex: "10" }} >
												<i className={"fa fa-times"}></i>
											</div>
										)}
										<div style={{ width: "100%", height: "100%" }}  >
											<ResponsiveReactGridLayout
												// breakpoints={{ lg: 1200, md: 1100, sm: 768, xs: 480, xxs: 0 }}
												// cols={{ lg: 12, md: 8, sm: 6, xs: 4, xxs: 2 }}
												breakpoints={{ lg: 1200, md: 1100, sm: 768, xs: 480, xxs: 0 }}
												cols={{ lg: 12, md: 8, sm: 6, xs: 4, xxs: 2 }}
												isResizable={false}
												autoSize={false}
												className={'sectionReuniones'}
												layouts={layoutsResizeHorizontal}
												onBreakpointChange={(breakpoint, cols) => this.onBreakpointChangeHorizontal(breakpoint, cols)}
												onDragStop={(layout, oldItem, newItem, placeholder, e, element) => this.handleStop(layout, oldItem, newItem, placeholder, e, element, 2, 'layoutsResizeHorizontal')}
												onDragStart={(layout, oldItem, newItem, placeholder, e, element) => this.handleStart(layout, oldItem, newItem, placeholder, e, element, 2)}
												isDraggable={editMode}
												compactType={"horizontal"}
												style={{ width: "100%", display: "flex", height: "100%" }}
											>
												<div key={"reuniones"} data-grid={statesItems[2][0]} >

													{statesItems[0].reuniones && (
														<div style={{ overflow: "hidden", width: "220px", height: '300px', ...stylesGrafica.contenedor }} className={editMode ? "shakeItemSmall" : ""}>
															{editMode && (
																<div onMouseDown={this.stopPropagation} onTouchStart={this.stopPropagation} className={'shakeIcon'} onClick={(i) => this.props.itemStorage("reuniones", false)} style={{ position: "absolute", top: "0", right: "5px", cursor: "pointer" }} >
																	<i className={"fa fa-times"}></i>
																</div>
															)}
															<div style={{ marginBottom: "0.5em", marginTop: "0.5em" }}><b> Reuniones </b></div> {/*TRADUCCION*/}
															<div > Año: {anoActual} </div> {/*TRADUCCION*/}
															{loading ? (
																<div style={{
																	width: '100%',
																	marginTop: '8em',
																	display: 'flex',
																	alignItems: 'center',
																	justifyContent: 'center'
																}}>
																	<LoadingSection />
																</div>
															) : (
																	<Grafica textCentral={"Reuniones"} styles={stylesGrafica.grafica} translate={translate} info={info} totalReuniones={totalReuniones} />//TRADUCCION
																)
															}
														</div>
													)}

												</div>

												<div key={"lastActions"} data-grid={statesItems[2][1]}>

													{statesItems[0].lastActions && (
														<div style={{ overflow: "hidden", width: "420px", height: '475px', ...stylesGrafica.contenedor }} className={editMode ? "shakeItemSmall" : ""}>
															{editMode && (
																<div onMouseDown={this.stopPropagation} onTouchStart={this.stopPropagation} className={'shakeIcon'} onClick={() => this.props.itemStorage("lastActions", false)} style={{ position: "absolute", top: "0", right: "5px", cursor: "pointer" }} >
																	<i className={"fa fa-times"}></i>
																</div>
															)}
															<div style={{ marginBottom: "0.5em", marginTop: "0.5em" }}><b>Ultimas Acciones</b></div> {/*TRADUCCION*/}
															{loading ? (
																<div style={{
																	width: '100%',
																	marginTop: '8em',
																}}>
																	<LoadingSection />
																</div>
															) : (
																	<div>
																		<UltimasAcciones
																			states={[5, 10, 20, 30]}
																			translate={translate}
																			councils={councils}
																		/>
																	</div>
																)
															}
														</div>
													)}

												</div>
												<div key={"noSession"} data-grid={statesItems[2][2]}>

													{statesItems[0].noSession && (
														<div style={{ overflow: "hidden", width: "420px", height: '475px', ...stylesGrafica.contenedor }} className={editMode ? "shakeItemSmall" : ""}>
															{editMode && (
																<div onMouseDown={this.stopPropagation} onTouchStart={this.stopPropagation} className={'shakeIcon'} onClick={() => this.props.itemStorage("lastActions", false)} style={{ position: "absolute", top: "0", right: "5px", cursor: "pointer" }} >
																	<i className={"fa fa-times"}></i>
																</div>
															)}
															<div style={{ marginBottom: "0.5em", marginTop: "0.5em" }}><b>Reuniones sin sesion</b></div> {/*TRADUCCION*/}
															{loading ? (
																<div style={{
																	width: '100%',
																	marginTop: '8em',
																}}>
																	<LoadingSection />
																</div>
															) : (
																	<div>
																		<SinSesion

																			translate={translate}
																			reuniones={councils}
																			company={company}
																		/>
																	</div>

																)
															}
														</div>
													)}
												</div>
											</ResponsiveReactGridLayout>
										</div>
									</div>
								)}
							</div>

							<div key={"calendar"} key="calendar" data-grid={statesItems[1][2]}>
								{statesItems[0].calendar && (
									<div style={{ height: '100%' }} className={editMode ? "shakeItems" : ""}>
										{loading ? (
											<div style={{
												width: '100%',
												marginTop: '8em',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center'
											}}>
												<LoadingSection />
											</div>
										) : (
												<React.Fragment>
													<div style={{ ...stylesGrafica.contenedor, minHeight: "480px" }}>
														{editMode && (
															<div onMouseDown={this.stopPropagation} onTouchStart={this.stopPropagation} className={'shakeIcon'} onClick={() => this.props.itemStorage("calendar", false)} style={{ position: "absolute", top: "0", right: "5px", cursor: "pointer" }}>
																<i className={"fa fa-times"}></i>
															</div>
														)}
														<BigCalendar
															messages={messages}
															defaultDate={new Date()}
															defaultView="agenda"
															localizer={localizer}
															events={eventos}
															startAccessor="start"
															endAccessor="end"
															views={allViews}
															resizable
															onSelectEvent={this.selectEvent}
															components={{
																event: Event,
																agenda: {
																	event: AgendaEvent,
																}

															}}
															style={{ height: "470px", width: "80%", margin: "0 auto" }}
															eventPropGetter={
																(event, start, end, isSelected) => {
																	return {
																		className: 'rbc-cell-' + event.state,
																	};
																}
															}

														>
														</BigCalendar>
													</div>
												</React.Fragment>
											)}
										<AlertConfirm
											requestClose={!!this.state.council ? this.closeCouncilDetails : this.closeModal}
											open={this.state.modal}
											bodyText={
												<CouncilDetails council={this.state.reunion} translate={this.props.translate} inIndex={true} />
											}
											title={translate.meeting_header}
											widthModal={{ width: "50%" }}
										/>
									</div>
								)}
							</div>
						</ResponsiveReactGridLayout>

					</GridItem>
				}
			</Grid >

		);
	}
}

function Event({ event }) {
	const objectNames = {5: "Convocadas", 10: "Convocadas", 20: "En celebración", 30: "En celebración"} //TRADUCCION
	const objectClass = {5: "fa fa-calendar-o", 10: "fa fa-calendar-o", 20: "fa fa-users", 30: "fa fa-users"}
	return (
		<div style={{display: "flex"}}>
			<Tooltip title={objectNames[event.state]}>
				<div style={{marginRight: "7px"}}><i class={objectClass[event.state]}></i></div>
			</Tooltip>
			<div style={{textOverflow: 'ellipsis',whiteSpace: 'nowrap',overflow: 'hidden'}}>{event.title}</div>
		</div>
	)

}


function layoutPositivo(layout) {
	let aux = [];
	layout.forEach(element => {
		let datoX = element.x;
		if (Math.sign(element.x) === -1) {
			datoX = 0
		}
		aux.push({ w: element.w, h: element.h, x: Math.round(datoX), y: element.y, i: element.i, moved: element.moved, static: element.static })
	});
	return aux;
}


const loadFromPreviousCouncil = gql`
    mutation LoadFromPreviousCouncil($councilId: Int!, $originId: Int!){
					loadFromAnotherCouncil(councilId: $councilId, originId: $originId){
					success
            message
				}
			}
		`;

export default compose(
	graphql(loadFromPreviousCouncil, { name: 'loadFromPreviousCouncil' }),
	graphql(councils, {
		options: props => ({
			variables: {
				state: [5, 10, 20, 30, 40, 60, 70],
				companyId: props.company.id,
				isMeeting: false,
				active: 1
			},
			errorPolicy: 'all'
		})
	})
)(TopSectionBlocks);

	// CANCELED: -1,
	// DRAFT: 0,
	// PRECONVENE: 3,
	// SAVED: 5,
	// PREPARING: 10,
	// ROOM_OPENED: 20,
	// APPROVING_ACT_DRAFT: 30,
	// FINISHED: 40,
	// APPROVED: 60,
	// FINAL_ACT_SENT: 70,
	// NOT_CELEBRATED: 80,
	// FINISHED_WITHOUT_ACT: 90,
	// MEETING_FINISHED: 100
